# 📝 iOS Share Extension — File Parsing Strategy

**Feature:** "Share to BookMate"  
**Version:** v1.1.0  
**Last Updated:** November 12, 2025

---

## 🎯 Overview

This document defines how the BookMate iOS Share Extension processes, names, stores, and prepares files for backend ingestion. The strategy prioritizes **simplicity** in v1.0 and **intelligence** in future versions.

---

## 🗂️ File Naming Convention

### Format
```
YYYYMMDD_HHMMSS_{uuid}.{ext}
```

### Components
| Component    | Description                          | Example      |
|--------------|--------------------------------------|--------------|
| `YYYYMMDD`   | Date in UTC                         | `20251112`   |
| `HHMMSS`     | Time in UTC (24-hour)               | `143022`     |
| `{uuid}`     | First 8 chars of UUID v4            | `a7f3e9d1`   |
| `.{ext}`     | Original file extension (lowercase) | `.jpg`       |

### Examples
```
20251112_143022_a7f3e9d1.jpg
20251112_143022_a7f3e9d1.json
20251112_143045_b2e8c4f7.pdf
20251112_143045_b2e8c4f7.json
20251113_090000_d1f2a3b4.heic
20251113_090000_d1f2a3b4.json
```

### Swift Implementation
```swift
import Foundation

struct FileNamer {
    static func generateName(originalURL: URL) -> String {
        let ext = originalURL.pathExtension.lowercased()
        let uuid = UUID().uuidString.prefix(8).lowercased()
        
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyyMMdd_HHmmss"
        formatter.timeZone = TimeZone(identifier: "UTC")
        let timestamp = formatter.string(from: Date())
        
        return "\(timestamp)_\(uuid).\(ext)"
    }
}

// Usage
let originalURL = URL(fileURLWithPath: "/tmp/IMG_1234.JPG")
let newName = FileNamer.generateName(originalURL: originalURL)
// Result: "20251112_143022_a7f3e9d1.jpg"
```

---

## 📊 Metadata Extraction

### v1.0: Minimal Approach
**Philosophy:** Store only what's immediately available. No OCR, no ML, no parsing.

**Metadata Collected:**
1. **File Info:** Name, size, MIME type, extension
2. **Source Info:** Source app bundle ID, device model, iOS version
3. **Timestamp:** When shared (UTC)
4. **User Info:** User ID (from auth token), optional note

**NOT Collected in v1.0:**
- ❌ Image EXIF data (GPS, camera model)
- ❌ OCR text from image
- ❌ PDF text extraction
- ❌ Amount/merchant auto-detection
- ❌ Category suggestion

### Metadata JSON Schema (v1.0)
```json
{
  "version": "1.0",
  "file": {
    "name": "IMG_1234.jpg",
    "originalName": "IMG_1234.jpg",
    "storageName": "20251112_143022_a7f3e9d1.jpg",
    "mimeType": "image/jpeg",
    "sizeBytes": 2415892,
    "extension": "jpg",
    "width": null,
    "height": null
  },
  "source": {
    "app": "com.apple.mobileslideshow",
    "appName": "Photos",
    "timestamp": "2025-11-12T14:30:22.000Z",
    "device": {
      "model": "iPhone 15 Pro",
      "osVersion": "17.1.2",
      "locale": "en_US"
    }
  },
  "ingest": {
    "status": "pending",
    "queuedAt": "2025-11-12T14:30:22.500Z",
    "attempts": 0,
    "lastAttempt": null,
    "errorMessage": null,
    "backendId": null
  },
  "user": {
    "uid": "user_abc123",
    "note": ""
  }
}
```

### Swift Implementation
```swift
import UIKit

struct FileMetadata: Codable {
    let version: String
    let file: FileInfo
    let source: SourceInfo
    var ingest: IngestInfo
    let user: UserInfo
    
    struct FileInfo: Codable {
        let name: String
        let originalName: String
        let storageName: String
        let mimeType: String
        let sizeBytes: Int64
        let `extension`: String
        let width: Int?
        let height: Int?
    }
    
    struct SourceInfo: Codable {
        let app: String
        let appName: String
        let timestamp: String  // ISO 8601
        let device: DeviceInfo
        
        struct DeviceInfo: Codable {
            let model: String
            let osVersion: String
            let locale: String
        }
    }
    
    struct IngestInfo: Codable {
        var status: String  // "pending" | "uploading" | "uploaded" | "failed"
        let queuedAt: String
        var attempts: Int
        var lastAttempt: String?
        var errorMessage: String?
        var backendId: String?
    }
    
    struct UserInfo: Codable {
        let uid: String
        var note: String
    }
}

// Factory
extension FileMetadata {
    static func create(
        originalURL: URL,
        storageName: String,
        sourceApp: String,
        userID: String
    ) throws -> FileMetadata {
        let attributes = try FileManager.default.attributesOfItem(atPath: originalURL.path)
        let sizeBytes = attributes[.size] as! Int64
        
        let mimeType = getMimeType(for: originalURL)
        let ext = originalURL.pathExtension.lowercased()
        
        let iso8601 = ISO8601DateFormatter()
        let now = iso8601.string(from: Date())
        
        return FileMetadata(
            version: "1.0",
            file: FileInfo(
                name: originalURL.lastPathComponent,
                originalName: originalURL.lastPathComponent,
                storageName: storageName,
                mimeType: mimeType,
                sizeBytes: sizeBytes,
                extension: ext,
                width: nil,  // v1.0: not extracted
                height: nil
            ),
            source: SourceInfo(
                app: sourceApp,
                appName: getAppName(bundleID: sourceApp),
                timestamp: now,
                device: DeviceInfo(
                    model: UIDevice.current.model,
                    osVersion: UIDevice.current.systemVersion,
                    locale: Locale.current.identifier
                )
            ),
            ingest: IngestInfo(
                status: "pending",
                queuedAt: now,
                attempts: 0,
                lastAttempt: nil,
                errorMessage: nil,
                backendId: nil
            ),
            user: UserInfo(
                uid: userID,
                note: ""
            )
        )
    }
}
```

---

## 🖼️ Image Processing (v1.0)

### Compression Strategy
**Goal:** Balance quality vs. upload speed

**Rules:**
1. If image ≤5MB → Keep original, no compression
2. If image >5MB but ≤50MB → Compress to ~3-5MB
3. If image >50MB → Reject (show error)

**Implementation:**
```swift
func compressImageIfNeeded(_ url: URL) -> Data? {
    guard let image = UIImage(contentsOfFile: url.path) else {
        return nil
    }
    
    let fileSize = (try? FileManager.default.attributesOfItem(atPath: url.path)[.size] as? Int64) ?? 0
    
    // Keep original if small enough
    if fileSize <= 5_000_000 {
        return try? Data(contentsOf: url)
    }
    
    // Compress large images
    let targetBytes = 4_000_000  // 4 MB target
    var quality: CGFloat = 0.85
    var data = image.jpegData(compressionQuality: quality)
    
    while let currentData = data, currentData.count > targetBytes, quality > 0.5 {
        quality -= 0.05
        data = image.jpegData(compressionQuality: quality)
    }
    
    return data
}
```

**Note:** HEIC files are already compressed. Convert to JPEG only if needed for compatibility.

---

## 📄 PDF Processing (v1.0)

### Validation Only
**v1.0 Approach:** No PDF manipulation, just validate and store

**Checks:**
1. File is valid PDF (magic number `%PDF`)
2. File size ≤50MB
3. No password protection (can be opened)

**Implementation:**
```swift
func validatePDF(_ url: URL) -> Bool {
    // Check magic number
    guard let fileHandle = try? FileHandle(forReadingFrom: url),
          let header = try? fileHandle.read(upToCount: 4),
          header.starts(with: Data([0x25, 0x50, 0x44, 0x46])) else {  // %PDF
        return false
    }
    
    // Check if password-protected
    guard let pdf = CGPDFDocument(url as CFURL),
          pdf.isUnlocked else {
        return false
    }
    
    return true
}
```

**v1.1 Enhancement:** Extract text from first page for better search

---

## 🗄️ Storage Structure

### App Group Directory Layout
```
group.com.siamoon.bookmate/
├── pending/
│   ├── 20251112_143022_a7f3e9d1.jpg      ← Compressed image
│   ├── 20251112_143022_a7f3e9d1.json     ← Metadata
│   ├── 20251112_143045_b2e8c4f7.pdf
│   └── 20251112_143045_b2e8c4f7.json
├── uploaded/
│   ├── 20251110_090000_c4d1e2f3.jpg
│   └── 20251110_090000_c4d1e2f3.json
└── logs/ (dev builds only)
    └── share-extension.log
```

### File Lifecycle
```
1. User shares file
         ↓
2. Extension validates file
         ↓
3. Generate storage name (YYYYMMDD_HHMMSS_{uuid}.ext)
         ↓
4. Compress if needed (images >5MB)
         ↓
5. Copy to pending/ directory
         ↓
6. Create metadata JSON
         ↓
7. Save metadata to pending/{name}.json
         ↓
8. Extension dismisses
         ↓
   [Host app takes over]
         ↓
9. Host app reads pending/ on foreground
         ↓
10. Upload file to backend
         ↓
11. Backend returns ingestion ID
         ↓
12. Update metadata: status="uploaded", backendId="{id}"
         ↓
13. Move file and metadata to uploaded/
         ↓
14. Purge after 7 days (cleanup job)
```

---

## 📤 Upload Payload Format

### Multipart Form Data
```http
POST /api/mobile/ingest HTTP/1.1
Host: accounting.siamoon.com
Authorization: Bearer {access_token}
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="uid"

user_abc123
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="source"

ios_share_extension
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="metadata"
Content-Type: application/json

{
  "version": "1.0",
  "file": {
    "originalName": "IMG_1234.jpg",
    "storageName": "20251112_143022_a7f3e9d1.jpg",
    "mimeType": "image/jpeg",
    "sizeBytes": 2415892
  },
  "source": {
    "app": "com.apple.mobileslideshow",
    "timestamp": "2025-11-12T14:30:22.000Z"
  },
  "user": {
    "note": ""
  }
}
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="20251112_143022_a7f3e9d1.jpg"
Content-Type: image/jpeg

<binary file data>
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

### Swift Implementation
```swift
import Alamofire

func uploadFile(
    _ fileURL: URL,
    metadata: FileMetadata,
    token: String
) async throws -> UploadResponse {
    let endpoint = "https://accounting.siamoon.com/api/mobile/ingest"
    
    let headers: HTTPHeaders = [
        "Authorization": "Bearer \(token)"
    ]
    
    let metadataJSON = try JSONEncoder().encode(metadata)
    
    return try await withCheckedThrowingContinuation { continuation in
        AF.upload(
            multipartFormData: { formData in
                formData.append(
                    metadata.user.uid.data(using: .utf8)!,
                    withName: "uid"
                )
                formData.append(
                    "ios_share_extension".data(using: .utf8)!,
                    withName: "source"
                )
                formData.append(
                    metadataJSON,
                    withName: "metadata",
                    mimeType: "application/json"
                )
                formData.append(
                    fileURL,
                    withName: "file",
                    fileName: metadata.file.storageName,
                    mimeType: metadata.file.mimeType
                )
            },
            to: endpoint,
            headers: headers
        )
        .validate()
        .responseDecodable(of: UploadResponse.self) { response in
            switch response.result {
            case .success(let value):
                continuation.resume(returning: value)
            case .failure(let error):
                continuation.resume(throwing: error)
            }
        }
    }
}
```

---

## 🔍 v1.1: Enhanced Parsing (Planned)

### OCR Integration
**Library:** Apple Vision Framework (native, no 3rd party)

**Implementation:**
```swift
import Vision

func extractText(from image: UIImage) async throws -> String {
    guard let cgImage = image.cgImage else {
        throw OCRError.invalidImage
    }
    
    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.usesLanguageCorrection = true
    
    let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
    try handler.perform([request])
    
    guard let observations = request.results else {
        return ""
    }
    
    let text = observations
        .compactMap { $0.topCandidates(1).first?.string }
        .joined(separator: "\n")
    
    return text
}
```

**Usage:**
```swift
// In v1.1, after file saved to App Group
let image = UIImage(contentsOfFile: fileURL.path)!
let extractedText = try await extractText(from: image)

// Update metadata
metadata.ocr = OCRInfo(
    text: extractedText,
    confidence: 0.85,
    language: "en"
)
```

---

### Smart Field Detection (v1.1)
**Goal:** Auto-detect amount, date, merchant from OCR text

**Example:**
```
OCR Text:
---
Starbucks Coffee
123 Main St
Los Angeles, CA

Date: 11/12/2025
Time: 2:30 PM

Americano        $4.50
Tax              $0.38
---
Total:           $4.88

Thank you!
---

Detected Fields:
- Merchant: "Starbucks Coffee"
- Amount: 4.88
- Date: "2025-11-12"
- Category: "Food & Beverage" (ML suggestion)
```

**Implementation (Regex + ML):**
```swift
struct ReceiptParser {
    func parse(_ text: String) -> ParsedReceipt {
        var result = ParsedReceipt()
        
        // Detect amount
        let amountRegex = /(?:Total|Amount|Sum)[\s:]*\$?([\d,]+\.\d{2})/
        if let match = text.firstMatch(of: amountRegex) {
            result.amount = Double(match.1.replacing(",", with: ""))
        }
        
        // Detect date
        let dateRegex = /(\d{1,2}\/\d{1,2}\/\d{4})/
        if let match = text.firstMatch(of: dateRegex) {
            result.date = parseDate(match.1)
        }
        
        // Detect merchant (first line, usually)
        let lines = text.split(separator: "\n")
        if let firstLine = lines.first {
            result.merchant = String(firstLine).trimmingCharacters(in: .whitespaces)
        }
        
        return result
    }
}
```

---

### PDF Text Extraction (v1.1)
```swift
import PDFKit

func extractTextFromPDF(_ url: URL) -> String {
    guard let pdf = PDFDocument(url: url) else {
        return ""
    }
    
    var fullText = ""
    
    for pageIndex in 0..<pdf.pageCount {
        guard let page = pdf.page(at: pageIndex) else { continue }
        fullText += page.string ?? ""
        fullText += "\n---\n"
    }
    
    return fullText
}
```

---

## 🧹 Cleanup Strategy

### Purge Rules
1. **Uploaded Files:** Delete after 7 days
2. **Failed Uploads (3+ attempts):** Keep for 14 days, then delete
3. **Logs (dev builds):** Keep for 24 hours

### Implementation
```swift
class AppGroupCleaner {
    let fileManager = FileManager.default
    let appGroupURL = FileManager.default.containerURL(
        forSecurityApplicationGroupIdentifier: "group.com.siamoon.bookmate"
    )!
    
    func cleanupOldFiles() {
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
                print("Deleted old file: \(file.lastPathComponent)")
            }
        }
    }
}
```

**Trigger:** Run cleanup on host app foreground (daily)

---

## 📊 Comparison: v1.0 vs v1.1

| Feature                  | v1.0              | v1.1 (Planned)        |
|--------------------------|-------------------|-----------------------|
| **File Storage**         | Original + compress if >5MB | Same |
| **Metadata**             | Basic file info only | + OCR text |
| **Amount Detection**     | ❌ Manual entry   | ✅ Auto-detected      |
| **Merchant Detection**   | ❌ Manual entry   | ✅ Auto-detected      |
| **Category Suggestion**  | ❌ Manual select  | ✅ ML-suggested       |
| **Date Detection**       | ❌ Today assumed  | ✅ Auto-detected      |
| **PDF Text Extraction**  | ❌ Not extracted  | ✅ Full text indexed  |
| **Duplicate Detection**  | ❌ None           | ✅ Hash-based         |
| **Search**               | ❌ Filename only  | ✅ Full-text search   |

---

## ✅ Implementation Checklist

### v1.0 (MVP)
- [ ] File naming convention implemented
- [ ] Metadata JSON schema defined
- [ ] Image compression logic (>5MB)
- [ ] PDF validation (magic number + unlocked)
- [ ] App Group storage working
- [ ] Upload payload format tested
- [ ] Cleanup job scheduled

### v1.1 (Enhanced)
- [ ] Vision Framework OCR integrated
- [ ] Amount regex parsing
- [ ] Merchant detection
- [ ] Date extraction
- [ ] Category ML model trained
- [ ] PDF text extraction
- [ ] Duplicate detection (perceptual hash)

---

**Status:** ✅ Parsing Strategy Complete  
**Next:** API contract definition for backend coordination  
**Review:** Pending iOS Lead and Backend Team approval

---

*Last Updated: November 12, 2025*  
*Document Owner: iOS Lead + Backend Engineer*
