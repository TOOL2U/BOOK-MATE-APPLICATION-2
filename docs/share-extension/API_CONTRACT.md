# 🌐 iOS Share Extension — API Contract

**Endpoint:** `POST /api/mobile/ingest`  
**Feature:** Receipt/Document Upload from iOS Share Extension  
**Version:** v1.0  
**Last Updated:** November 12, 2025

---

## 📋 Overview

This document defines the HTTP API contract between the BookMate iOS Share Extension and the backend accounting system for receipt/document ingestion.

**Purpose:** Upload files shared from iOS apps with metadata for processing

**Authentication:** JWT Bearer token (same as existing mobile endpoints)

**Rate Limiting:** 100 requests per user per hour

---

## 🔗 Endpoint Details

### Base URL
```
Production:  https://accounting.siamoon.com
Staging:     https://staging.accounting.siamoon.com
Development: http://localhost:8000  (local testing)
```

### Full Endpoint
```
POST https://accounting.siamoon.com/api/mobile/ingest
```

---

## 🔑 Authentication

### Header
```http
Authorization: Bearer {access_token}
```

### Token Requirements
- **Type:** JWT (same format as `/api/auth/login` response)
- **Validity:** 15 minutes (standard access token lifespan)
- **Refresh:** Client should refresh token if 401 received
- **Claims Required:**
  - `uid`: User ID
  - `exp`: Expiration timestamp

### Example
```http
POST /api/mobile/ingest HTTP/1.1
Host: accounting.siamoon.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW
```

---

## 📤 Request Format

### Content-Type
```
multipart/form-data
```

### Form Fields

| Field      | Type   | Required | Description                          |
|------------|--------|----------|--------------------------------------|
| `uid`      | string | Yes      | User ID (from JWT token)             |
| `source`   | string | Yes      | Source identifier: `"ios_share_extension"` |
| `metadata` | JSON   | Yes      | File metadata (see schema below)     |
| `file`     | binary | Yes      | The actual file (image or PDF)       |

---

### Metadata JSON Schema
```json
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
    "appName": "Photos",
    "timestamp": "2025-11-12T14:30:22.000Z",
    "device": {
      "model": "iPhone 15 Pro",
      "osVersion": "17.1.2",
      "locale": "en_US"
    }
  },
  "user": {
    "uid": "user_abc123",
    "note": ""
  }
}
```

---

### Complete Request Example
```http
POST /api/mobile/ingest HTTP/1.1
Host: accounting.siamoon.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Length: 2418934

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
    "appName": "Photos",
    "timestamp": "2025-11-12T14:30:22.000Z",
    "device": {
      "model": "iPhone 15 Pro",
      "osVersion": "17.1.2",
      "locale": "en_US"
    }
  },
  "user": {
    "uid": "user_abc123",
    "note": "Business lunch receipt"
  }
}
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="20251112_143022_a7f3e9d1.jpg"
Content-Type: image/jpeg

<binary file data: 2,415,892 bytes>
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

---

## ✅ Success Response

### HTTP Status
```
200 OK
```

### Response Schema
```json
{
  "ok": true,
  "ingested": true,
  "data": {
    "id": "ingest_d7f2a1b3c4e5",
    "uid": "user_abc123",
    "fileName": "20251112_143022_a7f3e9d1.jpg",
    "storagePath": "receipts/2025/11/user_abc123/20251112_143022_a7f3e9d1.jpg",
    "uploadedAt": "2025-11-12T14:30:25.123Z",
    "status": "pending_processing",
    "fileUrl": "https://storage.siamoon.com/receipts/2025/11/user_abc123/20251112_143022_a7f3e9d1.jpg"
  }
}
```

### Response Fields

| Field                  | Type    | Description                                |
|------------------------|---------|--------------------------------------------|
| `ok`                   | boolean | Always `true` for successful response      |
| `ingested`             | boolean | Indicates file was successfully ingested   |
| `data.id`              | string  | Unique ingestion ID (for tracking)         |
| `data.uid`             | string  | User ID (echo from request)                |
| `data.fileName`        | string  | Stored filename                            |
| `data.storagePath`     | string  | Backend storage path (S3/GCS)              |
| `data.uploadedAt`      | string  | ISO 8601 timestamp of upload               |
| `data.status`          | string  | Processing status (see below)              |
| `data.fileUrl`         | string  | Public URL to access file (if applicable)  |

---

### Processing Status Values

| Status                 | Description                              |
|------------------------|------------------------------------------|
| `pending_processing`   | File uploaded, queued for OCR/analysis   |
| `processing`           | OCR/analysis in progress                 |
| `processed`            | OCR complete, data extracted             |
| `failed`               | Processing failed (see error log)        |

---

## ❌ Error Responses

### 400 Bad Request
**Cause:** Invalid request format or missing required fields

```json
{
  "ok": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Missing required field: uid",
    "details": {
      "field": "uid",
      "expected": "string",
      "received": "undefined"
    }
  }
}
```

**Common Causes:**
- Missing `uid`, `source`, `metadata`, or `file` field
- Invalid JSON in `metadata` field
- Empty file upload
- Malformed multipart data

---

### 401 Unauthorized
**Cause:** Missing or invalid authentication token

```json
{
  "ok": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token",
    "details": {
      "tokenExpired": true,
      "expiresAt": "2025-11-12T14:15:00Z"
    }
  }
}
```

**Client Action:**
1. Refresh access token using refresh token
2. Retry request with new access token
3. If refresh fails, prompt user to re-authenticate

---

### 413 Payload Too Large
**Cause:** File exceeds maximum size limit (50MB)

```json
{
  "ok": false,
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "File size exceeds maximum allowed (50MB)",
    "details": {
      "receivedBytes": 60485760,
      "maxBytes": 52428800
    }
  }
}
```

**Client Action:**
- Show error to user: "File too large (max 50MB)"
- Do NOT retry

---

### 415 Unsupported Media Type
**Cause:** File MIME type not supported

```json
{
  "ok": false,
  "error": {
    "code": "UNSUPPORTED_FILE_TYPE",
    "message": "File type not supported",
    "details": {
      "receivedMimeType": "application/msword",
      "supportedTypes": [
        "image/jpeg",
        "image/png",
        "image/heic",
        "application/pdf"
      ]
    }
  }
}
```

**Client Action:**
- Show error: "Unsupported file type. BookMate accepts: JPG, PNG, HEIC, PDF"
- Do NOT retry

---

### 429 Too Many Requests
**Cause:** Rate limit exceeded

```json
{
  "ok": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "details": {
      "limit": 100,
      "remaining": 0,
      "resetAt": "2025-11-12T15:00:00Z"
    }
  }
}
```

**Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1731424800
Retry-After: 3600
```

**Client Action:**
1. Show error: "Upload limit reached. Try again in X minutes."
2. Retry after `resetAt` timestamp
3. Consider queueing uploads locally

---

### 500 Internal Server Error
**Cause:** Backend processing error

```json
{
  "ok": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An error occurred while processing your upload",
    "details": {
      "requestId": "req_a7f3e9d1b2c4"
    }
  }
}
```

**Client Action:**
1. Retry with exponential backoff (3 attempts max)
2. If all retries fail, show error and keep file in local queue
3. Log `requestId` for debugging

---

### 503 Service Unavailable
**Cause:** Backend temporarily unavailable (maintenance or overload)

```json
{
  "ok": false,
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "Service temporarily unavailable. Please try again later.",
    "details": {
      "retryAfter": 300
    }
  }
}
```

**Headers:**
```http
Retry-After: 300
```

**Client Action:**
1. Show error: "Service temporarily unavailable"
2. Retry after 5 minutes (or `Retry-After` value)
3. Keep file in local queue

---

## 🔄 Retry Strategy

### Client-Side Retry Logic
```swift
func uploadWithRetry(
    file: FileMetadata,
    maxAttempts: Int = 3
) async throws -> UploadResponse {
    var lastError: Error?
    
    for attempt in 1...maxAttempts {
        do {
            return try await uploadFile(file)
        } catch let error as HTTPError {
            lastError = error
            
            // Don't retry on client errors (4xx except 429)
            if error.statusCode >= 400 && error.statusCode < 500 && error.statusCode != 429 {
                throw error
            }
            
            // Exponential backoff for retryable errors
            let delay = min(pow(2.0, Double(attempt)), 30.0)  // Max 30s
            try await Task.sleep(nanoseconds: UInt64(delay * 1_000_000_000))
            
        } catch {
            lastError = error
            
            // Network errors: retry with backoff
            let delay = pow(2.0, Double(attempt))
            try await Task.sleep(nanoseconds: UInt64(delay * 1_000_000_000))
        }
    }
    
    throw lastError ?? UploadError.unknown
}
```

---

## 🧪 Testing Endpoints

### Staging Environment
```
POST https://staging.accounting.siamoon.com/api/mobile/ingest
```

**Test User:**
- Email: `shaun@siamoon.com`
- Password: `Shaun231!`
- UID: `user_abc123`

**Test Files:**
- `tests/fixtures/receipt_sample.jpg` (2.3 MB, valid JPEG)
- `tests/fixtures/invoice_sample.pdf` (1.1 MB, valid PDF)
- `tests/fixtures/large_file.jpg` (60 MB, should fail with 413)

---

### Local Development
```bash
# Start backend locally
cd backend
npm run dev  # Runs on http://localhost:8000

# Test with curl
curl -X POST http://localhost:8000/api/mobile/ingest \
  -H "Authorization: Bearer {token}" \
  -F "uid=user_abc123" \
  -F "source=ios_share_extension" \
  -F 'metadata={"version":"1.0","file":{"originalName":"test.jpg"}}' \
  -F "file=@/path/to/test.jpg"
```

---

## 📊 Backend Implementation Checklist

### Endpoint Requirements
- [ ] Accept multipart/form-data requests
- [ ] Validate JWT token in Authorization header
- [ ] Extract `uid`, `source`, `metadata`, `file` from request
- [ ] Validate file MIME type (JPG, PNG, HEIC, PDF only)
- [ ] Validate file size (≤50MB)
- [ ] Generate unique storage path: `receipts/{YYYY}/{MM}/{uid}/{filename}`
- [ ] Upload file to cloud storage (S3/GCS)
- [ ] Store metadata in database (ingestions table)
- [ ] Return ingestion ID and storage URL
- [ ] Queue file for OCR/processing (async job)
- [ ] Implement rate limiting (100 req/hour per user)
- [ ] Log all requests with request ID for debugging

---

### Database Schema (Backend)
```sql
CREATE TABLE ingestions (
    id VARCHAR(50) PRIMARY KEY,  -- e.g., "ingest_d7f2a1b3c4e5"
    uid VARCHAR(50) NOT NULL,
    source VARCHAR(50) NOT NULL,  -- "ios_share_extension"
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    mime_type VARCHAR(100),
    size_bytes BIGINT,
    storage_path TEXT,
    file_url TEXT,
    status VARCHAR(50) DEFAULT 'pending_processing',  -- pending_processing | processing | processed | failed
    metadata JSONB,  -- Full metadata from client
    uploaded_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP,
    error_message TEXT,
    FOREIGN KEY (uid) REFERENCES users(uid)
);

CREATE INDEX idx_ingestions_uid ON ingestions(uid);
CREATE INDEX idx_ingestions_status ON ingestions(status);
CREATE INDEX idx_ingestions_uploaded_at ON ingestions(uploaded_at);
```

---

### Backend Code Example (Node.js + Express)
```javascript
const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const jwt = require('jsonwebtoken');

const router = express.Router();
const storage = new Storage();
const bucket = storage.bucket('bookmate-receipts');

// Multer config (50MB limit)
const upload = multer({
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/heic', 'application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'));
    }
  }
});

// POST /api/mobile/ingest
router.post('/ingest', upload.single('file'), async (req, res) => {
  try {
    // 1. Verify JWT token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        ok: false,
        error: { code: 'UNAUTHORIZED', message: 'Missing token' }
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { uid } = decoded;
    
    // 2. Validate required fields
    const { source, metadata } = req.body;
    if (!source || !metadata || !req.file) {
      return res.status(400).json({
        ok: false,
        error: { code: 'INVALID_REQUEST', message: 'Missing required fields' }
      });
    }
    
    const meta = JSON.parse(metadata);
    
    // 3. Generate storage path
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const storagePath = `receipts/${year}/${month}/${uid}/${meta.file.storageName}`;
    
    // 4. Upload to cloud storage
    const file = bucket.file(storagePath);
    await file.save(req.file.buffer, {
      contentType: req.file.mimetype,
      metadata: {
        uid,
        originalName: meta.file.originalName
      }
    });
    
    const fileUrl = `https://storage.googleapis.com/bookmate-receipts/${storagePath}`;
    
    // 5. Save to database
    const ingestionId = `ingest_${generateId()}`;
    await db.query(`
      INSERT INTO ingestions (id, uid, source, file_name, original_name, mime_type, size_bytes, storage_path, file_url, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [
      ingestionId,
      uid,
      source,
      meta.file.storageName,
      meta.file.originalName,
      req.file.mimetype,
      req.file.size,
      storagePath,
      fileUrl,
      JSON.stringify(meta)
    ]);
    
    // 6. Queue for OCR processing (async)
    await queueOCRJob(ingestionId);
    
    // 7. Return success response
    res.json({
      ok: true,
      ingested: true,
      data: {
        id: ingestionId,
        uid,
        fileName: meta.file.storageName,
        storagePath,
        uploadedAt: new Date().toISOString(),
        status: 'pending_processing',
        fileUrl
      }
    });
    
  } catch (error) {
    console.error('Ingest error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        ok: false,
        error: { code: 'UNAUTHORIZED', message: 'Invalid token' }
      });
    }
    
    res.status(500).json({
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while processing your upload',
        details: { requestId: req.id }
      }
    });
  }
});

module.exports = router;
```

---

## 🔐 Security Considerations

### Input Validation
- [ ] Validate JWT token signature and expiration
- [ ] Validate `uid` matches token claim
- [ ] Sanitize all file names (remove path traversal: `../`)
- [ ] Validate MIME type matches file content (magic number check)
- [ ] Limit file size (50MB hard limit)
- [ ] Rate limit per user (100 req/hour)

### Storage Security
- [ ] Store files in private cloud bucket (not public)
- [ ] Generate signed URLs for file access (expire in 1 hour)
- [ ] Scan uploaded files for malware (ClamAV or cloud service)
- [ ] Delete files after 90 days (GDPR compliance)

---

## 📈 Monitoring & Metrics

### Metrics to Track
```javascript
// Prometheus metrics example
const promClient = require('prom-client');

const uploadCounter = new promClient.Counter({
  name: 'ingest_uploads_total',
  help: 'Total number of file uploads',
  labelNames: ['status', 'source', 'mime_type']
});

const uploadDuration = new promClient.Histogram({
  name: 'ingest_upload_duration_seconds',
  help: 'Upload processing duration',
  buckets: [0.1, 0.5, 1, 2, 5, 10]
});

const uploadSize = new promClient.Histogram({
  name: 'ingest_file_size_bytes',
  help: 'Uploaded file sizes',
  buckets: [100000, 500000, 1000000, 5000000, 10000000, 50000000]
});
```

---

## ✅ API Readiness Checklist

### Backend
- [ ] Endpoint implemented: `POST /api/mobile/ingest`
- [ ] JWT authentication working
- [ ] Multipart file upload parsing
- [ ] File validation (MIME type, size)
- [ ] Cloud storage integration (S3/GCS)
- [ ] Database schema created (`ingestions` table)
- [ ] Rate limiting configured (100 req/hour per user)
- [ ] Error responses standardized
- [ ] OCR job queueing implemented
- [ ] Monitoring/metrics configured

### Frontend (iOS)
- [ ] API client service implemented
- [ ] Multipart upload working
- [ ] JWT token refresh on 401
- [ ] Retry logic with exponential backoff
- [ ] Error handling for all status codes
- [ ] Upload progress tracking
- [ ] Local queue persistence

---

**Status:** ✅ API Contract Complete  
**Next:** QA test plan and acceptance criteria  
**Review:** Pending Backend Team and Mobile Team approval

---

*Last Updated: November 12, 2025*  
*Document Owner: Backend Lead + iOS Lead*
