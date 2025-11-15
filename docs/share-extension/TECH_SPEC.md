# 🔧 iOS Share Extension — Technical Specification

**Feature:** "Share to BookMate"  
**Version:** v1.1.0  
**Last Updated:** November 12, 2025

---

## 🏗️ Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│                   iOS System                         │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────┐         ┌──────────────────┐       │
│  │ Source App │─Share──▶│ iOS Share Sheet  │       │
│  │ (Photos,   │         │ [BookMate] [...]  │       │
│  │  Files,    │         └──────────┬───────┘       │
│  │  Banking)  │                    │               │
│  └────────────┘                    │               │
│                                    │ Tap BookMate  │
│                                    ▼               │
│         ┌──────────────────────────────────┐       │
│         │   BookMate Share Extension       │       │
│         │   (Extension Target)             │       │
│         │                                  │       │
│         │  • NSExtensionContext            │       │
│         │  • ShareViewController.swift     │       │
│         │  • Validates file types          │       │
│         │  • Checks auth token             │       │
│         │  • Copies files to App Group     │       │
│         └──────────────┬───────────────────┘       │
│                        │                           │
│                        │ Shared Container          │
│                        ▼                           │
│         ┌──────────────────────────────┐           │
│         │   App Group Storage          │           │
│         │   group.com.siamoon.bookmate │           │
│         │                              │           │
│         │  /pending/                   │           │
│         │    - file_uuid_1.jpg         │           │
│         │    - file_uuid_2.pdf         │           │
│         │    - metadata.json           │           │
│         │                              │           │
│         │  /uploaded/                  │           │
│         │    - archived files          │           │
│         └──────────────┬───────────────┘           │
│                        │                           │
│                        │ Host app reads queue      │
│                        ▼                           │
│         ┌──────────────────────────────┐           │
│         │   BookMate Host App          │           │
│         │   (Main App Target)          │           │
│         │                              │           │
│         │  • Monitors App Group inbox  │           │
│         │  • Displays pending queue    │           │
│         │  • Uploads to backend        │           │
│         │  • Shows notifications       │           │
│         └──────────────┬───────────────┘           │
│                        │                           │
└────────────────────────┼───────────────────────────┘
                         │
                         │ HTTPS POST /api/mobile/ingest
                         ▼
          ┌──────────────────────────────┐
          │   Backend API                │
          │   accounting.siamoon.com     │
          │                              │
          │  • Receives file upload      │
          │  • Stores in cloud storage   │
          │  • Returns ingestion ID      │
          │  • Queues for OCR (v1.1+)    │
          └──────────────────────────────┘
```

---

## 🎯 Xcode Project Structure

### Current State (Expo Managed)
```
BOOK-MATE-APPLICATION-2/
├── App.tsx
├── src/
│   ├── screens/
│   ├── components/
│   └── services/
├── app.json
├── package.json
└── ios/           ← Expo-generated, do NOT edit
```

### Target State (EAS + Dev Client)
```
BOOK-MATE-APPLICATION-2/
├── App.tsx
├── src/
│   ├── screens/
│   ├── components/
│   ├── services/
│   └── extensions/
│       └── share/
│           ├── ShareViewController.swift
│           ├── ShareViewController.storyboard
│           └── Info.plist
├── app.json
├── app.config.js        ← New: for native config
├── package.json
├── plugins/             ← New: Expo config plugins
│   └── withShareExtension.js
└── ios/
    ├── BookMate/                    ← Main app target
    │   ├── AppDelegate.swift
    │   ├── Info.plist
    │   ├── BookMate.entitlements
    │   └── ...
    ├── ShareExtension/              ← NEW EXTENSION TARGET
    │   ├── ShareViewController.swift
    │   ├── ShareViewController.storyboard
    │   ├── Info.plist
    │   └── ShareExtension.entitlements
    └── BookMate.xcworkspace
```

---

## 📦 Bundle IDs & Identifiers

### App Group
**ID:** `group.com.siamoon.bookmate`  
**Purpose:** Shared container for files and metadata  
**Registration:** Apple Developer Portal → Certificates, IDs & Profiles → Identifiers → App Groups

### Main App Bundle ID
**ID:** `com.siamoon.bookmate` (existing)  
**Capabilities:**
- App Groups: `group.com.siamoon.bookmate`
- Push Notifications (existing)
- Background Modes: Background fetch, Remote notifications

### Share Extension Bundle ID
**ID:** `com.siamoon.bookmate.share`  
**Parent:** `com.siamoon.bookmate`  
**Capabilities:**
- App Groups: `group.com.siamoon.bookmate`  
- (No push notifications, no background modes)

---

## 🔐 Entitlements

### Main App (BookMate.entitlements)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.application-groups</key>
    <array>
        <string>group.com.siamoon.bookmate</string>
    </array>
    <key>aps-environment</key>
    <string>production</string>
    <key>com.apple.developer.networking.networkextension</key>
    <array>
        <string>app-proxy-provider</string>
    </array>
</dict>
</plist>
```

### Share Extension (ShareExtension.entitlements)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.application-groups</key>
    <array>
        <string>group.com.siamoon.bookmate</string>
    </array>
</dict>
</plist>
```

---

## 📄 Info.plist Configuration

### Share Extension Info.plist
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDisplayName</key>
    <string>BookMate</string>
    
    <key>CFBundleName</key>
    <string>$(PRODUCT_NAME)</string>
    
    <key>CFBundleShortVersionString</key>
    <string>1.1.0</string>
    
    <key>NSExtension</key>
    <dict>
        <key>NSExtensionAttributes</key>
        <dict>
            <key>NSExtensionActivationRule</key>
            <dict>
                <!-- Accept 1-10 items -->
                <key>NSExtensionActivationSupportsFileWithMaxCount</key>
                <integer>10</integer>
                
                <key>NSExtensionActivationSupportsImageWithMaxCount</key>
                <integer>10</integer>
                
                <!-- Supported MIME types -->
                <key>NSExtensionActivationSupportsWebURLWithMaxCount</key>
                <integer>0</integer>
                
                <key>NSExtensionActivationSupportsWebPageWithMaxCount</key>
                <integer>0</integer>
                
                <key>NSExtensionActivationSupportsText</key>
                <false/>
            </dict>
        </dict>
        
        <key>NSExtensionPointIdentifier</key>
        <string>com.apple.share-services</string>
        
        <key>NSExtensionPrincipalClass</key>
        <string>ShareViewController</string>
    </dict>
    
    <!-- Privacy Descriptions (inherited from main app) -->
    <key>NSPhotoLibraryUsageDescription</key>
    <string>Access photos to upload receipts</string>
</dict>
</plist>
```

---

## 🎯 Supported File Types

### Images
| Extension | MIME Type       | Max Size | Notes                |
|-----------|----------------|----------|----------------------|
| `.jpg`    | `image/jpeg`   | 50 MB    | Most common          |
| `.jpeg`   | `image/jpeg`   | 50 MB    | Same as .jpg         |
| `.png`    | `image/png`    | 50 MB    | Screenshots          |
| `.heic`   | `image/heic`   | 50 MB    | iPhone default (iOS 11+) |

### Documents
| Extension | MIME Type          | Max Size | Notes                |
|-----------|--------------------|----------|----------------------|
| `.pdf`    | `application/pdf`  | 50 MB    | Invoices, statements |

### Not Supported (v1.0)
- `.txt`, `.csv` (planned for v1.1)
- `.doc`, `.docx` (not planned)
- Videos (not receipts/expenses)
- Audio (not receipts/expenses)

---

## 📊 File Validation Logic

### ShareViewController.swift Pseudo-code
```swift
extension ShareViewController {
    func validateAttachment(_ itemProvider: NSItemProvider) -> ValidationResult {
        // Step 1: Check type identifiers
        let supportedTypes = [
            "public.jpeg",
            "public.png",
            "public.heic",
            "com.adobe.pdf"
        ]
        
        guard itemProvider.hasItemConformingToTypeIdentifier(
            oneOf: supportedTypes
        ) else {
            return .error(.unsupportedFileType)
        }
        
        // Step 2: Load file temporarily
        itemProvider.loadFileRepresentation { url, error in
            guard let url = url else {
                return .error(.loadFailed)
            }
            
            // Step 3: Check file size
            let fileSize = try? FileManager.default
                .attributesOfItem(atPath: url.path)[.size] as? Int64
            
            guard let size = fileSize, size <= 50_000_000 else {
                return .error(.fileTooLarge)
            }
            
            // Step 4: Validate MIME type by content
            guard validateMimeType(url) else {
                return .error(.invalidContent)
            }
            
            return .valid(url)
        }
    }
    
    func validateMimeType(_ url: URL) -> Bool {
        // Read first few bytes to verify actual file type
        // (Prevents .exe renamed to .jpg)
        let magicNumbers: [Data: String] = [
            Data([0xFF, 0xD8, 0xFF]): "image/jpeg",
            Data([0x89, 0x50, 0x4E, 0x47]): "image/png",
            Data([0x25, 0x50, 0x44, 0x46]): "application/pdf"
        ]
        
        guard let fileHandle = try? FileHandle(forReadingFrom: url),
              let header = try? fileHandle.read(upToCount: 16) else {
            return false
        }
        
        return magicNumbers.keys.contains { header.starts(with: $0) }
    }
}
```

---

## 💾 App Group File Structure

### Directory Layout
```
group.com.siamoon.bookmate/
├── pending/                      ← Files awaiting upload
│   ├── 20251112_143022_a7f3.jpg
│   ├── 20251112_143022_a7f3.json
│   ├── 20251112_143045_b2e8.pdf
│   └── 20251112_143045_b2e8.json
├── uploaded/                     ← Archive of uploaded files
│   ├── 20251110_090000_c4d1.jpg
│   └── 20251110_090000_c4d1.json
└── logs/                         ← Debug logs (dev builds only)
    └── share-extension.log
```

### File Naming Convention
**Format:** `YYYYMMDD_HHMMSS_{uuid}.{ext}`

**Examples:**
- `20251112_143022_a7f3e9d1.jpg`
- `20251112_143022_a7f3e9d1.json`

**Components:**
- `YYYYMMDD`: Date (UTC)
- `HHMMSS`: Time (UTC)
- `{uuid}`: First 8 chars of UUID v4
- `.{ext}`: Original file extension

### Metadata JSON Schema
**File:** `{filename}.json`

```json
{
  "version": "1.0",
  "file": {
    "name": "IMG_1234.jpg",
    "originalName": "IMG_1234.jpg",
    "storageName": "20251112_143022_a7f3e9d1.jpg",
    "mimeType": "image/jpeg",
    "sizeBytes": 2415892,
    "extension": "jpg"
  },
  "source": {
    "app": "com.apple.mobileslideshow",  // Photos app
    "timestamp": "2025-11-12T14:30:22Z",
    "device": "iPhone 15 Pro",
    "osVersion": "17.1.2"
  },
  "ingest": {
    "status": "pending",  // pending | uploading | uploaded | failed
    "attempts": 0,
    "lastAttempt": null,
    "errorMessage": null,
    "backendId": null  // Set after successful upload
  },
  "user": {
    "uid": "user_abc123",  // From auth token
    "note": ""  // Optional user note
  }
}
```

---

## 🔒 Security & Privacy

### Authentication Token Storage
**Location:** iOS Keychain (via `expo-secure-store`)  
**Key:** `bookmate_auth_token`  
**Accessibility:** `kSecAttrAccessibleAfterFirstUnlock`

**Share Extension Access:**
```swift
// ShareViewController.swift
import Security

func getAuthToken() -> String? {
    let query: [String: Any] = [
        kSecClass as String: kSecClassGenericPassword,
        kSecAttrAccount as String: "bookmate_auth_token",
        kSecReturnData as String: true
    ]
    
    var item: CFTypeRef?
    let status = SecItemCopyMatching(query as CFDictionary, &item)
    
    guard status == errSecSuccess,
          let data = item as? Data,
          let token = String(data: data, encoding: .utf8) else {
        return nil
    }
    
    return token
}
```

**Note:** App Group does NOT provide automatic Keychain sharing. Need to explicitly enable "Keychain Sharing" capability if using shared Keychain access group. For v1.0, store token copy in App Group as fallback.

---

### PII Handling
**Files Containing PII:**
- Receipt images (may contain names, addresses, card numbers)
- PDFs (invoices with personal info)

**Mitigation:**
1. **Temporary Storage:** Files kept in App Group only until uploaded
2. **Purge After Upload:** Delete from App Group after successful upload
3. **No iCloud Backup:** App Group container excluded from iCloud backup
4. **Encrypted in Transit:** All uploads via HTTPS with TLS 1.3

**App Group UserDefaults Exclusion:**
```swift
// AppDelegate.swift or ShareViewController.swift
let appGroup = UserDefaults(suiteName: "group.com.siamoon.bookmate")!
appGroup.set(false, forKey: "NSApplicationSupportBackup")
```

---

## 🚀 Performance Constraints

### iOS Extension Limits
| Limit               | Value       | Mitigation                          |
|---------------------|-------------|-------------------------------------|
| Memory              | ~120 MB     | Compress images >5MB before copy    |
| Execution Time      | 30 seconds  | Copy to App Group immediately       |
| Background Time     | None        | Use `URLSessionConfiguration.background` |
| Network             | Wi-Fi/Cell  | Queue for later if no connection    |

---

### Performance Targets
| Metric                   | Target    | Measurement                     |
|--------------------------|-----------|--------------------------------|
| Extension Launch         | <800ms    | Time to show UI                |
| File Copy to App Group   | <500ms    | Per file <10MB                 |
| UI Dismiss After Tap     | <200ms    | Tap "Send" → extension closes  |
| Memory Peak              | <100MB    | During 5-file batch            |

---

### Optimization Strategies

#### 1. Image Compression (Before Copy)
```swift
func compressIfNeeded(_ image: UIImage) -> Data? {
    let maxSize: CGFloat = 2048  // Max dimension
    let maxBytes = 5_000_000     // 5 MB
    
    // Resize if too large
    var resized = image
    if image.size.width > maxSize || image.size.height > maxSize {
        let ratio = min(maxSize / image.size.width, maxSize / image.size.height)
        let newSize = CGSize(
            width: image.size.width * ratio,
            height: image.size.height * ratio
        )
        resized = image.resize(to: newSize)
    }
    
    // Compress to target size
    var quality: CGFloat = 0.9
    var data = resized.jpegData(compressionQuality: quality)
    
    while let currentData = data, currentData.count > maxBytes, quality > 0.5 {
        quality -= 0.1
        data = resized.jpegData(compressionQuality: quality)
    }
    
    return data
}
```

#### 2. Background Upload (Host App)
```swift
// In host app
let config = URLSessionConfiguration.background(
    withIdentifier: "com.siamoon.bookmate.upload"
)
config.isDiscretionary = false  // Upload ASAP
config.sessionSendsLaunchEvents = true

let session = URLSession(
    configuration: config,
    delegate: self,
    delegateQueue: nil
)
```

#### 3. Batch Upload Strategy
```swift
// Host app processes queue
func processQueue() {
    let files = getPendingFiles()
    
    // Upload in parallel (max 3 concurrent)
    let semaphore = DispatchSemaphore(value: 3)
    
    for file in files {
        DispatchQueue.global().async {
            semaphore.wait()
            defer { semaphore.signal() }
            
            uploadFile(file) { result in
                if case .success = result {
                    moveToUploaded(file)
                }
            }
        }
    }
}
```

---

## 🌐 Network Handling

### Offline Detection
```swift
import Network

class NetworkMonitor {
    static let shared = NetworkMonitor()
    private let monitor = NWPathMonitor()
    private var isConnected = false
    
    func startMonitoring() {
        monitor.pathUpdateHandler = { path in
            self.isConnected = path.status == .satisfied
        }
        monitor.start(queue: DispatchQueue.global())
    }
    
    var canUpload: Bool {
        return isConnected
    }
}
```

### Retry Logic
```swift
func uploadWithRetry(
    file: FileMetadata,
    maxAttempts: Int = 3
) async throws -> UploadResponse {
    var lastError: Error?
    
    for attempt in 1...maxAttempts {
        do {
            return try await uploadFile(file)
        } catch {
            lastError = error
            
            // Exponential backoff
            let delay = pow(2.0, Double(attempt)) // 2s, 4s, 8s
            try await Task.sleep(nanoseconds: UInt64(delay * 1_000_000_000))
        }
    }
    
    throw lastError ?? UploadError.unknown
}
```

---

## 📊 Telemetry & Analytics

### Events to Track
```swift
enum ShareExtensionEvent {
    case opened(sourceApp: String, itemCount: Int)
    case fileValidated(mimeType: String, sizeBytes: Int)
    case fileRejected(reason: String)
    case authChecked(isAuthenticated: Bool)
    case fileSaved(uuid: String, duration: TimeInterval)
    case dismissed(action: String)  // "send" | "cancel"
    case error(code: String, message: String)
}
```

### Implementation
```swift
import Firebase  // Or your analytics SDK

func logEvent(_ event: ShareExtensionEvent) {
    switch event {
    case .opened(let app, let count):
        Analytics.logEvent("share_extension_opened", parameters: [
            "source_app": app,
            "item_count": count
        ])
    case .fileSaved(let uuid, let duration):
        Analytics.logEvent("share_file_saved", parameters: [
            "file_id": uuid,
            "duration_ms": Int(duration * 1000)
        ])
    // ... other cases
    }
}
```

---

## 🧪 Testing Considerations

### Unit Tests
```swift
// ShareExtensionTests.swift
import XCTest
@testable import ShareExtension

class FileValidatorTests: XCTestCase {
    func testValidJPEGAccepted() {
        let url = Bundle.test.url(forResource: "sample", withExtension: "jpg")!
        let result = FileValidator.validate(url)
        XCTAssertTrue(result.isValid)
    }
    
    func testOversizedFileRejected() {
        let url = createLargeFile(sizeBytes: 60_000_000)  // 60 MB
        let result = FileValidator.validate(url)
        XCTAssertFalse(result.isValid)
        XCTAssertEqual(result.error, .fileTooLarge)
    }
    
    func testRenamedExecutableRejected() {
        // Malicious .exe renamed to .jpg
        let url = Bundle.test.url(forResource: "malware.jpg")!
        let result = FileValidator.validate(url)
        XCTAssertFalse(result.isValid)
        XCTAssertEqual(result.error, .invalidContent)
    }
}
```

### Integration Tests
```swift
class AppGroupCommunicationTests: XCTestCase {
    func testExtensionWritesFile_HostAppReads() {
        // 1. Extension writes file
        let file = createTestReceipt()
        ShareExtension.saveToAppGroup(file)
        
        // 2. Host app reads queue
        let queue = HostApp.getPendingFiles()
        
        XCTAssertEqual(queue.count, 1)
        XCTAssertEqual(queue.first?.name, file.name)
    }
    
    func testHostAppUploads_MovesToArchive() async {
        // 1. Create pending file
        let file = createPendingFile()
        
        // 2. Host app uploads
        try await HostApp.uploadFile(file)
        
        // 3. Verify moved to uploaded/
        let pending = HostApp.getPendingFiles()
        let uploaded = HostApp.getUploadedFiles()
        
        XCTAssertEqual(pending.count, 0)
        XCTAssertEqual(uploaded.count, 1)
    }
}
```

### Manual Testing Checklist
- [ ] Share from Photos app (single photo)
- [ ] Share from Photos app (3+ photos)
- [ ] Share from Files app (PDF)
- [ ] Share from Safari (Save Image → Share)
- [ ] Share from 3rd-party banking app
- [ ] Share while offline → verify saved to App Group
- [ ] Go online → verify auto-upload
- [ ] Share while not authenticated → verify error message
- [ ] Share 50MB file → verify accepted
- [ ] Share 51MB file → verify rejected
- [ ] Share .txt file → verify rejected
- [ ] Extension killed mid-upload → verify file persisted

---

## 📦 Dependencies

### Swift Packages (Share Extension)
```swift
// Package.swift or Xcode SPM
dependencies: [
    .package(url: "https://github.com/Alamofire/Alamofire.git", from: "5.8.0"),
    // For networking if needed
]
```

### CocoaPods (Alternative)
```ruby
# Podfile
target 'ShareExtension' do
  use_frameworks!
  
  # Minimal dependencies
  pod 'Alamofire', '~> 5.8'  # Optional
end
```

**Recommendation:** Keep extension dependencies minimal to reduce memory footprint. Prefer native URLSession over Alamofire if possible.

---

## 🔄 Migration Path (Expo Managed → Dev Client)

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
eas login
```

### Step 2: Configure EAS Build
```json
// eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "distribution": "store"
    }
  }
}
```

### Step 3: Create Config Plugin
```javascript
// plugins/withShareExtension.js
const { withXcodeProject, withEntitlementsPlist } = require('@expo/config-plugins');

function withShareExtension(config) {
  // Add Share Extension target to Xcode project
  config = withXcodeProject(config, (config) => {
    const project = config.modResults;
    
    // Add target
    const target = project.addTarget(
      'ShareExtension',
      'app_extension',
      'ShareExtension'
    );
    
    // Configure build settings
    project.updateBuildProperty('PRODUCT_BUNDLE_IDENTIFIER', 'com.siamoon.bookmate.share', 'ShareExtension');
    
    return config;
  });
  
  // Add entitlements
  config = withEntitlementsPlist(config, (config) => {
    config.modResults['com.apple.security.application-groups'] = [
      'group.com.siamoon.bookmate'
    ];
    return config;
  });
  
  return config;
}

module.exports = withShareExtension;
```

### Step 4: Update app.config.js
```javascript
// app.config.js
export default {
  expo: {
    name: "BookMate",
    slug: "bookmate",
    version: "1.1.0",
    ios: {
      bundleIdentifier: "com.siamoon.bookmate",
      buildNumber: "3",
      entitlements: {
        "com.apple.security.application-groups": [
          "group.com.siamoon.bookmate"
        ]
      }
    },
    plugins: [
      "./plugins/withShareExtension"
    ]
  }
};
```

### Step 5: Generate Native Projects
```bash
npx expo prebuild --platform ios --clean
```

### Step 6: Add Swift Files Manually
1. Open `ios/BookMate.xcworkspace` in Xcode
2. Right-click ShareExtension folder → Add Files
3. Add `ShareViewController.swift`
4. Add `ShareViewController.storyboard`
5. Verify target membership: ShareExtension

### Step 7: Build with EAS
```bash
eas build --platform ios --profile development
```

---

## 📝 Code Ownership

### Files Owned by Extension
```
ios/ShareExtension/
├── ShareViewController.swift       ← Core extension logic
├── ShareViewController.storyboard  ← UI (can be programmatic)
├── Info.plist                      ← Extension config
├── ShareExtension.entitlements     ← App Group access
└── Assets.xcassets/                ← Extension icon
```

### Files Owned by Host App
```
src/screens/
├── PendingUploadsScreen.tsx        ← Queue management UI
└── ReviewReceiptScreen.tsx         ← Post-upload review

src/services/
├── AppGroupService.ts              ← Read App Group inbox
└── UploadService.ts                ← Background upload logic
```

---

## ✅ Pre-Launch Checklist

### Apple Developer Portal
- [ ] Create App Group: `group.com.siamoon.bookmate`
- [ ] Create Identifier: `com.siamoon.bookmate.share`
- [ ] Enable App Groups on main app identifier
- [ ] Create provisioning profile for extension

### Xcode Configuration
- [ ] Extension target added to project
- [ ] Bundle ID: `com.siamoon.bookmate.share`
- [ ] Deployment target: iOS 14.0+
- [ ] Entitlements file configured
- [ ] Info.plist activation rules set
- [ ] Signing configured (automatic or manual)

### Code Implementation
- [ ] ShareViewController.swift complete
- [ ] File validation logic tested
- [ ] App Group read/write working
- [ ] Auth token check implemented
- [ ] Error handling complete

### Host App
- [ ] App Group entitlement added
- [ ] Pending queue screen implemented
- [ ] Background upload service ready
- [ ] Notification handlers added

### Testing
- [ ] All manual test cases passed
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] TestFlight internal build distributed
- [ ] QA sign-off received

---

**Status:** ✅ Technical Specification Complete  
**Next:** API contract definition and backend coordination  
**Review:** Pending iOS Lead and Backend Team approval

---

*Last Updated: November 12, 2025*  
*Document Owner: iOS Lead + Platform Architect*
