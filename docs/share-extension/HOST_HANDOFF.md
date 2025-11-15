# 🔄 iOS Share Extension — Host App Handoff

**Feature:** "Share to BookMate"  
**Version:** v1.1.0  
**Last Updated:** November 12, 2025

---

## 🎯 Overview

This document defines how the BookMate host app (main app) discovers, processes, and uploads files queued by the Share Extension.

**Flow:**
```
Share Extension → App Group Storage → Host App → Backend API
```

---

## 📊 Architecture

```
┌─────────────────────────────────────────────────────┐
│           App Group Storage                         │
│       group.com.siamoon.bookmate                    │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  pending/                                   │   │
│  │  ├── 20251112_143022_a7f3.jpg              │   │
│  │  ├── 20251112_143022_a7f3.json ← Metadata  │   │
│  │  ├── 20251112_143045_b2e8.pdf              │   │
│  │  └── 20251112_143045_b2e8.json             │   │
│  └─────────────────────────────────────────────┘   │
│           ▲                       │                 │
│           │ Write                 │ Read            │
│           │                       ▼                 │
│  ┌────────────────┐    ┌─────────────────────────┐ │
│  │ Share Extension│    │    Host App             │ │
│  │                │    │  • Monitors pending/    │ │
│  │ • Validates    │    │  • Uploads to backend   │ │
│  │ • Saves file   │    │  • Shows notifications  │ │
│  │ • Dismisses    │    │  • Moves to uploaded/   │ │
│  └────────────────┘    └─────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## 🔍 Host App Responsibilities

### 1. Monitor App Group Inbox
**Trigger:** App enters foreground (becomes active)

**Implementation:**
```swift
// AppDelegate.swift or SceneDelegate.swift
func sceneDidBecomeActive(_ scene: UIScene) {
    // Check for new files from share extension
    AppGroupService.shared.checkForPendingUploads()
}
```

---

### 2. Discover Pending Files
**Location:** `group.com.siamoon.bookmate/pending/`

**Algorithm:**
```swift
import Foundation

class AppGroupService {
    static let shared = AppGroupService()
    
    private let fileManager = FileManager.default
    private let appGroupURL = FileManager.default.containerURL(
        forSecurityApplicationGroupIdentifier: "group.com.siamoon.bookmate"
    )!
    
    func checkForPendingUploads() {
        let pendingDir = appGroupURL.appendingPathComponent("pending")
        
        guard let files = try? fileManager.contentsOfDirectory(
            at: pendingDir,
            includingPropertiesForKeys: [.creationDateKey],
            options: .skipsHiddenFiles
        ) else { return }
        
        // Filter for JSON metadata files
        let metadataFiles = files.filter { $0.pathExtension == "json" }
        
        for metadataURL in metadataFiles {
            processFile(metadataURL: metadataURL)
        }
    }
    
    func processFile(metadataURL: URL) {
        guard let data = try? Data(contentsOf: metadataURL),
              let metadata = try? JSONDecoder().decode(FileMetadata.self, from: data) else {
            print("Failed to read metadata: \(metadataURL)")
            return
        }
        
        // Check if already uploaded
        if metadata.ingest.status == "uploaded" {
            // Move to uploaded/ directory
            moveToUploaded(metadata)
            return
        }
        
        // Queue for upload
        UploadQueue.shared.enqueue(metadata)
    }
}
```

---

### 3. Upload Queue Management
**Design:** In-memory queue with persistence

**Implementation:**
```swift
import Foundation

class UploadQueue {
    static let shared = UploadQueue()
    
    private var queue: [FileMetadata] = []
    private var isProcessing = false
    
    func enqueue(_ metadata: FileMetadata) {
        queue.append(metadata)
        
        // Deduplicate by storage name
        queue = queue.uniqued(on: \.file.storageName)
        
        // Start processing if not already running
        if !isProcessing {
            processQueue()
        }
    }
    
    func processQueue() {
        guard !queue.isEmpty else {
            isProcessing = false
            return
        }
        
        isProcessing = true
        let metadata = queue.first!
        
        // Upload file
        Task {
            do {
                try await UploadService.shared.upload(metadata)
                
                // Remove from queue
                queue.removeFirst()
                
                // Continue with next
                processQueue()
                
            } catch {
                print("Upload failed: \(error)")
                
                // Update metadata: increment attempts
                var updated = metadata
                updated.ingest.attempts += 1
                updated.ingest.lastAttempt = ISO8601DateFormatter().string(from: Date())
                updated.ingest.errorMessage = error.localizedDescription
                
                if updated.ingest.attempts >= 3 {
                    // Max retries reached
                    updated.ingest.status = "failed"
                    saveMetadata(updated)
                    queue.removeFirst()
                } else {
                    // Retry with exponential backoff
                    let delay = pow(2.0, Double(updated.ingest.attempts))
                    try? await Task.sleep(nanoseconds: UInt64(delay * 1_000_000_000))
                    queue[0] = updated
                }
                
                // Continue processing
                processQueue()
            }
        }
    }
    
    func saveMetadata(_ metadata: FileMetadata) {
        let encoder = JSONEncoder()
        encoder.outputFormatting = .prettyPrinted
        
        guard let data = try? encoder.encode(metadata) else { return }
        
        let url = appGroupURL
            .appendingPathComponent("pending")
            .appendingPathComponent("\(metadata.file.storageName).json")
        
        try? data.write(to: url)
    }
}

// Helper: Deduplicate array
extension Array {
    func uniqued<T: Hashable>(on keyPath: KeyPath<Element, T>) -> [Element] {
        var seen = Set<T>()
        return filter { seen.insert($0[keyPath: keyPath]).inserted }
    }
}
```

---

### 4. Upload Service
**Responsibilities:**
- Authenticate with backend
- Upload file via multipart/form-data
- Handle errors and retries
- Update metadata after success

**Implementation:**
```swift
import Foundation

class UploadService {
    static let shared = UploadService()
    
    private let baseURL = "https://accounting.siamoon.com"
    
    func upload(_ metadata: FileMetadata) async throws {
        // 1. Get auth token
        guard let token = try await getAuthToken() else {
            throw UploadError.notAuthenticated
        }
        
        // 2. Prepare file URL
        let fileURL = appGroupURL
            .appendingPathComponent("pending")
            .appendingPathComponent(metadata.file.storageName)
        
        guard FileManager.default.fileExists(atPath: fileURL.path) else {
            throw UploadError.fileNotFound
        }
        
        // 3. Create multipart request
        let request = try createMultipartRequest(
            fileURL: fileURL,
            metadata: metadata,
            token: token
        )
        
        // 4. Upload
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw UploadError.invalidResponse
        }
        
        // 5. Handle response
        switch httpResponse.statusCode {
        case 200...299:
            let uploadResponse = try JSONDecoder().decode(UploadResponse.self, from: data)
            
            // Update metadata
            var updated = metadata
            updated.ingest.status = "uploaded"
            updated.ingest.backendId = uploadResponse.data.id
            
            // Save updated metadata
            UploadQueue.shared.saveMetadata(updated)
            
            // Move to uploaded/
            moveToUploaded(updated)
            
            // Show notification
            showSuccessNotification(fileName: metadata.file.originalName)
            
        case 401:
            // Token expired - refresh and retry
            try await refreshTokenAndRetry(metadata)
            
        case 413:
            throw UploadError.fileTooLarge
            
        case 429:
            throw UploadError.rateLimitExceeded
            
        case 500...599:
            throw UploadError.serverError
            
        default:
            throw UploadError.unknown(statusCode: httpResponse.statusCode)
        }
    }
    
    private func createMultipartRequest(
        fileURL: URL,
        metadata: FileMetadata,
        token: String
    ) throws -> URLRequest {
        let boundary = "Boundary-\(UUID().uuidString)"
        
        var request = URLRequest(url: URL(string: "\(baseURL)/api/mobile/ingest")!)
        request.httpMethod = "POST"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")
        
        var body = Data()
        
        // Add uid field
        body.append("--\(boundary)\r\n".data(using: .utf8)!)
        body.append("Content-Disposition: form-data; name=\"uid\"\r\n\r\n".data(using: .utf8)!)
        body.append("\(metadata.user.uid)\r\n".data(using: .utf8)!)
        
        // Add source field
        body.append("--\(boundary)\r\n".data(using: .utf8)!)
        body.append("Content-Disposition: form-data; name=\"source\"\r\n\r\n".data(using: .utf8)!)
        body.append("ios_share_extension\r\n".data(using: .utf8)!)
        
        // Add metadata field
        let metadataJSON = try JSONEncoder().encode(metadata)
        body.append("--\(boundary)\r\n".data(using: .utf8)!)
        body.append("Content-Disposition: form-data; name=\"metadata\"\r\n".data(using: .utf8)!)
        body.append("Content-Type: application/json\r\n\r\n".data(using: .utf8)!)
        body.append(metadataJSON)
        body.append("\r\n".data(using: .utf8)!)
        
        // Add file
        body.append("--\(boundary)\r\n".data(using: .utf8)!)
        body.append("Content-Disposition: form-data; name=\"file\"; filename=\"\(metadata.file.storageName)\"\r\n".data(using: .utf8)!)
        body.append("Content-Type: \(metadata.file.mimeType)\r\n\r\n".data(using: .utf8)!)
        body.append(try Data(contentsOf: fileURL))
        body.append("\r\n".data(using: .utf8)!)
        
        // Closing boundary
        body.append("--\(boundary)--\r\n".data(using: .utf8)!)
        
        request.httpBody = body
        
        return request
    }
    
    private func getAuthToken() async throws -> String? {
        // Retrieve from Keychain
        return SecureStorage.shared.getString(key: "auth_token")
    }
    
    private func refreshTokenAndRetry(_ metadata: FileMetadata) async throws {
        // Refresh token logic
        guard let refreshToken = SecureStorage.shared.getString(key: "refresh_token") else {
            throw UploadError.notAuthenticated
        }
        
        // Call refresh endpoint
        let newToken = try await AuthService.shared.refreshToken(refreshToken)
        
        // Retry upload
        try await upload(metadata)
    }
}

// MARK: - Models
struct UploadResponse: Codable {
    let ok: Bool
    let ingested: Bool
    let data: UploadData
    
    struct UploadData: Codable {
        let id: String
        let uid: String
        let fileName: String
        let storagePath: String
        let uploadedAt: String
        let status: String
        let fileUrl: String
    }
}

enum UploadError: Error {
    case notAuthenticated
    case fileNotFound
    case invalidResponse
    case fileTooLarge
    case rateLimitExceeded
    case serverError
    case unknown(statusCode: Int)
}
```

---

### 5. Move to Uploaded Archive
**Purpose:** Keep uploaded files for 7 days (for reference/debugging)

**Implementation:**
```swift
func moveToUploaded(_ metadata: FileMetadata) {
    let fileManager = FileManager.default
    let pendingDir = appGroupURL.appendingPathComponent("pending")
    let uploadedDir = appGroupURL.appendingPathComponent("uploaded")
    
    // Create uploaded/ directory if needed
    try? fileManager.createDirectory(at: uploadedDir, withIntermediateDirectories: true)
    
    let fileName = metadata.file.storageName
    let sourceFileURL = pendingDir.appendingPathComponent(fileName)
    let sourceMetaURL = pendingDir.appendingPathComponent("\(fileName).json")
    
    let destFileURL = uploadedDir.appendingPathComponent(fileName)
    let destMetaURL = uploadedDir.appendingPathComponent("\(fileName).json")
    
    // Move file
    try? fileManager.moveItem(at: sourceFileURL, to: destFileURL)
    
    // Move metadata
    try? fileManager.moveItem(at: sourceMetaURL, to: destMetaURL)
}
```

---

### 6. Show Notifications
**Trigger:** After successful upload

**Implementation:**
```swift
import UserNotifications

func showSuccessNotification(fileName: String) {
    let content = UNMutableNotificationContent()
    content.title = "Receipt Uploaded"
    content.body = "\(fileName) uploaded successfully. Tap to categorize."
    content.sound = .default
    content.categoryIdentifier = "RECEIPT_UPLOAD"
    
    let request = UNNotificationRequest(
        identifier: UUID().uuidString,
        content: content,
        trigger: nil  // Immediate
    )
    
    UNUserNotificationCenter.current().add(request)
}

func showErrorNotification(fileName: String, error: String) {
    let content = UNMutableNotificationContent()
    content.title = "Upload Failed"
    content.body = "\(fileName): \(error). Tap to retry."
    content.sound = .default
    content.categoryIdentifier = "RECEIPT_UPLOAD_FAILED"
    
    let request = UNNotificationRequest(
        identifier: UUID().uuidString,
        content: content,
        trigger: nil
    )
    
    UNUserNotificationCenter.current().add(request)
}
```

---

## 📱 Pending Uploads Screen (UI)

### Purpose
Display all files in the upload queue with status

### Design
```
┌─────────────────────────────────┐
│ ← Pending Uploads            (3)│
├─────────────────────────────────┤
│ ┌─────┐ IMG_1234.jpg            │
│ │ 📸 │ 2.3 MB • 2m ago          │
│ └─────┘ ✓ Uploaded              │
├─────────────────────────────────┤
│ ┌─────┐ IMG_5678.jpg            │
│ │ 📸 │ 1.8 MB • Uploading...    │
│ └─────┘ [████████░░] 85%        │
├─────────────────────────────────┤
│ ┌─────┐ Receipt.pdf             │
│ │ 📄 │ 4.1 MB • Upload failed   │
│ └─────┘ [Retry]                 │
└─────────────────────────────────┘
```

### Implementation
```typescript
// src/screens/PendingUploadsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { AppGroupService } from '../services/AppGroupService';
import { UploadQueue } from '../services/UploadQueue';

interface PendingUpload {
  fileName: string;
  originalName: string;
  sizeBytes: number;
  queuedAt: string;
  status: 'pending' | 'uploading' | 'uploaded' | 'failed';
  progress?: number;  // 0-100
  errorMessage?: string;
}

export const PendingUploadsScreen = () => {
  const [uploads, setUploads] = useState<PendingUpload[]>([]);
  
  useEffect(() => {
    loadPendingUploads();
    
    // Refresh every 2 seconds
    const interval = setInterval(loadPendingUploads, 2000);
    return () => clearInterval(interval);
  }, []);
  
  const loadPendingUploads = async () => {
    const pending = await AppGroupService.shared.getPendingFiles();
    setUploads(pending);
  };
  
  const retryUpload = (fileName: string) => {
    UploadQueue.shared.retryFile(fileName);
  };
  
  const renderItem = ({ item }: { item: PendingUpload }) => (
    <View style={styles.item}>
      <View style={styles.thumbnail}>
        <Text style={styles.icon}>{getIcon(item.fileName)}</Text>
      </View>
      
      <View style={styles.details}>
        <Text style={styles.fileName}>{item.originalName}</Text>
        <Text style={styles.meta}>
          {formatBytes(item.sizeBytes)} • {formatTime(item.queuedAt)}
        </Text>
        
        {item.status === 'uploaded' && (
          <Text style={styles.success}>✓ Uploaded</Text>
        )}
        
        {item.status === 'uploading' && (
          <View>
            <Text style={styles.uploading}>Uploading...</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
            </View>
          </View>
        )}
        
        {item.status === 'failed' && (
          <View>
            <Text style={styles.error}>Upload failed</Text>
            <TouchableOpacity onPress={() => retryUpload(item.fileName)}>
              <Text style={styles.retryButton}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
  
  if (uploads.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={styles.emptyText}>No pending uploads</Text>
        <Text style={styles.emptyHint}>
          Share photos or PDFs from other apps to get started
        </Text>
      </View>
    );
  }
  
  return (
    <FlatList
      data={uploads}
      renderItem={renderItem}
      keyExtractor={item => item.fileName}
      contentContainerStyle={styles.list}
    />
  );
};

// Helper functions
function getIcon(fileName: string): string {
  if (fileName.endsWith('.pdf')) return '📄';
  return '📸';
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}
```

---

## 🔄 Background Upload (iOS Background Tasks)

### Purpose
Continue uploads even when app is in background

### Implementation
```swift
// AppDelegate.swift
import BackgroundTasks

func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
) -> Bool {
    // Register background task
    BGTaskScheduler.shared.register(
        forTaskWithIdentifier: "com.siamoon.bookmate.upload",
        using: nil
    ) { task in
        self.handleBackgroundUpload(task: task as! BGProcessingTask)
    }
    
    return true
}

func handleBackgroundUpload(task: BGProcessingTask) {
    // Set expiration handler
    task.expirationHandler = {
        // Cancel any ongoing uploads
        UploadQueue.shared.cancelAll()
        task.setTaskCompleted(success: false)
    }
    
    // Process upload queue
    Task {
        do {
            try await UploadQueue.shared.processAll()
            task.setTaskCompleted(success: true)
        } catch {
            task.setTaskCompleted(success: false)
        }
    }
}

func scheduleBackgroundUpload() {
    let request = BGProcessingTaskRequest(identifier: "com.siamoon.bookmate.upload")
    request.earliestBeginDate = Date(timeIntervalSinceNow: 5 * 60)  // 5 min
    request.requiresNetworkConnectivity = true
    request.requiresExternalPower = false
    
    try? BGTaskScheduler.shared.submit(request)
}
```

---

## 🧹 Cleanup Job

### Purpose
Delete old uploaded files from App Group (>7 days)

### Implementation
```swift
func cleanupOldUploads() {
    let fileManager = FileManager.default
    let uploadedDir = appGroupURL.appendingPathComponent("uploaded")
    
    guard let files = try? fileManager.contentsOfDirectory(
        at: uploadedDir,
        includingPropertiesForKeys: [.creationDateKey]
    ) else { return }
    
    let sevenDaysAgo = Date().addingTimeInterval(-7 * 24 * 60 * 60)
    
    for file in files {
        guard let attrs = try? fileManager.attributesOfItem(atPath: file.path),
              let creationDate = attrs[.creationDate] as? Date else {
            continue
        }
        
        if creationDate < sevenDaysAgo {
            try? fileManager.removeItem(at: file)
            print("Cleaned up old file: \(file.lastPathComponent)")
        }
    }
}

// Schedule daily cleanup
func scheduleCleanup() {
    Timer.scheduledTimer(withTimeInterval: 24 * 60 * 60, repeats: true) { _ in
        cleanupOldUploads()
    }
}
```

---

## ✅ Host App Checklist

### App Delegate / Scene Delegate
- [ ] Monitor App Group on foreground (`sceneDidBecomeActive`)
- [ ] Register background upload task
- [ ] Schedule cleanup job

### Services
- [ ] AppGroupService: Discover pending files
- [ ] UploadQueue: Manage upload queue
- [ ] UploadService: Upload to backend
- [ ] SecureStorage: Retrieve auth token

### UI
- [ ] PendingUploadsScreen: Display queue
- [ ] Notifications: Success/error alerts
- [ ] Dashboard: Show upload count badge

### Testing
- [ ] Share file → Verify appears in pending queue
- [ ] Upload succeeds → Verify moved to uploaded/
- [ ] Upload fails → Verify retry logic
- [ ] Offline → Verify queued and uploaded when online
- [ ] Background upload → Verify completes in background

---

**Status:** ✅ Host App Handoff Complete  
**Next:** App Store metadata and analytics events  
**Review:** Pending iOS Lead approval

---

*Last Updated: November 12, 2025*  
*Document Owner: iOS Lead*
