# 📊 iOS Share Extension — Analytics & Telemetry Events

**Feature:** "Share to BookMate"  
**Version:** v1.1.0  
**Last Updated:** November 12, 2025

---

## 🎯 Overview

This document defines all analytics events and telemetry to track for the iOS Share Extension feature.

**Analytics Platform:** Firebase Analytics (or your chosen platform)  
**Purpose:** Measure feature adoption, performance, and user behavior

---

## 📊 Event Categories

### 1. Extension Lifecycle Events
Track extension opening, dismissing, and user actions

### 2. File Handling Events
Track files selected, validated, saved, uploaded

### 3. Error Events
Track all errors and failures

### 4. Performance Events
Track timing metrics (load time, upload time, etc.)

### 5. User Engagement Events
Track feature adoption and usage patterns

---

## 📋 Event Definitions

### Event 1: `share_extension_opened`
**Trigger:** Extension UI becomes visible  
**Purpose:** Track how often extension is used

**Parameters:**
```typescript
{
  source_app: string;        // e.g., "com.apple.mobileslideshow" (Photos)
  source_app_name: string;   // e.g., "Photos"
  item_count: number;        // Number of items shared (1-10)
  item_types: string[];      // e.g., ["image/jpeg", "application/pdf"]
  timestamp: string;         // ISO 8601
  user_id: string;           // Hashed user ID (for privacy)
  session_id: string;        // Unique session ID
}
```

**Example:**
```javascript
Analytics.logEvent('share_extension_opened', {
  source_app: 'com.apple.mobileslideshow',
  source_app_name: 'Photos',
  item_count: 1,
  item_types: ['image/jpeg'],
  timestamp: '2025-11-12T14:30:22.000Z',
  user_id: 'hash_abc123',
  session_id: 'session_xyz789'
});
```

---

### Event 2: `share_item_validated`
**Trigger:** File passes validation (MIME type, size)  
**Purpose:** Track validation success/failure rates

**Parameters:**
```typescript
{
  file_name: string;         // Original filename (sanitized)
  mime_type: string;         // e.g., "image/jpeg"
  size_bytes: number;        // File size
  is_valid: boolean;         // Validation result
  validation_error: string?; // If invalid: "file_too_large" | "unsupported_type" | "invalid_content"
  session_id: string;
}
```

**Example:**
```javascript
Analytics.logEvent('share_item_validated', {
  file_name: 'IMG_1234.jpg',
  mime_type: 'image/jpeg',
  size_bytes: 2415892,
  is_valid: true,
  session_id: 'session_xyz789'
});
```

---

### Event 3: `share_item_saved`
**Trigger:** File saved to App Group  
**Purpose:** Track save success rate and duration

**Parameters:**
```typescript
{
  file_name: string;
  storage_name: string;      // Generated filename
  mime_type: string;
  size_bytes: number;
  save_duration_ms: number;  // Time to save file
  compressed: boolean;       // Was compression applied?
  session_id: string;
}
```

**Example:**
```javascript
Analytics.logEvent('share_item_saved', {
  file_name: 'IMG_1234.jpg',
  storage_name: '20251112_143022_a7f3.jpg',
  mime_type: 'image/jpeg',
  size_bytes: 2415892,
  save_duration_ms: 245,
  compressed: false,
  session_id: 'session_xyz789'
});
```

---

### Event 4: `share_confirmed`
**Trigger:** User taps "Send to BookMate"  
**Purpose:** Track conversion rate (opened → confirmed)

**Parameters:**
```typescript
{
  item_count: number;
  total_size_bytes: number;
  has_note: boolean;         // Did user add a note?
  session_id: string;
}
```

**Example:**
```javascript
Analytics.logEvent('share_confirmed', {
  item_count: 1,
  total_size_bytes: 2415892,
  has_note: false,
  session_id: 'session_xyz789'
});
```

---

### Event 5: `share_cancelled`
**Trigger:** User taps "Cancel" or dismisses extension  
**Purpose:** Track drop-off rate

**Parameters:**
```typescript
{
  item_count: number;
  session_id: string;
  reason: string;            // "user_cancelled" | "auth_required" | "error"
}
```

**Example:**
```javascript
Analytics.logEvent('share_cancelled', {
  item_count: 1,
  session_id: 'session_xyz789',
  reason: 'user_cancelled'
});
```

---

### Event 6: `share_upload_started`
**Trigger:** Host app begins uploading file  
**Purpose:** Track upload queue processing

**Parameters:**
```typescript
{
  file_id: string;           // Storage name (unique identifier)
  mime_type: string;
  size_bytes: number;
  network_type: string;      // "wifi" | "cellular" | "unknown"
  is_background: boolean;    // Upload in background?
  user_id: string;
}
```

**Example:**
```javascript
Analytics.logEvent('share_upload_started', {
  file_id: '20251112_143022_a7f3.jpg',
  mime_type: 'image/jpeg',
  size_bytes: 2415892,
  network_type: 'wifi',
  is_background: false,
  user_id: 'hash_abc123'
});
```

---

### Event 7: `share_upload_success`
**Trigger:** Upload completes successfully (200 OK)  
**Purpose:** Track upload success rate and performance

**Parameters:**
```typescript
{
  file_id: string;
  backend_id: string;        // ID returned by backend
  size_bytes: number;
  upload_duration_ms: number;
  network_type: string;
  retry_count: number;       // Number of retries (0 if first attempt succeeded)
  user_id: string;
}
```

**Example:**
```javascript
Analytics.logEvent('share_upload_success', {
  file_id: '20251112_143022_a7f3.jpg',
  backend_id: 'ingest_d7f2a1b3',
  size_bytes: 2415892,
  upload_duration_ms: 3420,
  network_type: 'wifi',
  retry_count: 0,
  user_id: 'hash_abc123'
});
```

---

### Event 8: `share_upload_failed`
**Trigger:** Upload fails after all retries  
**Purpose:** Track failure reasons and patterns

**Parameters:**
```typescript
{
  file_id: string;
  size_bytes: number;
  error_code: string;        // "network_error" | "auth_failed" | "server_error" | "rate_limit" | "file_too_large"
  http_status: number?;      // HTTP status code (if applicable)
  error_message: string;
  retry_count: number;
  network_type: string;
  user_id: string;
}
```

**Example:**
```javascript
Analytics.logEvent('share_upload_failed', {
  file_id: '20251112_143022_a7f3.jpg',
  size_bytes: 2415892,
  error_code: 'network_error',
  error_message: 'Request timed out',
  retry_count: 3,
  network_type: 'cellular',
  user_id: 'hash_abc123'
});
```

---

### Event 9: `share_queue_persisted`
**Trigger:** Extension saves file while offline  
**Purpose:** Track offline usage

**Parameters:**
```typescript
{
  file_id: string;
  size_bytes: number;
  is_offline: boolean;
  session_id: string;
}
```

**Example:**
```javascript
Analytics.logEvent('share_queue_persisted', {
  file_id: '20251112_143022_a7f3.jpg',
  size_bytes: 2415892,
  is_offline: true,
  session_id: 'session_xyz789'
});
```

---

### Event 10: `share_queue_flushed`
**Trigger:** Host app uploads queued files after going online  
**Purpose:** Track offline→online recovery

**Parameters:**
```typescript
{
  files_uploaded: number;
  total_bytes: number;
  queue_age_seconds: number; // Time since oldest file queued
  user_id: string;
}
```

**Example:**
```javascript
Analytics.logEvent('share_queue_flushed', {
  files_uploaded: 3,
  total_bytes: 7248765,
  queue_age_seconds: 1820,  // ~30 minutes
  user_id: 'hash_abc123'
});
```

---

### Event 11: `share_error`
**Trigger:** Any error occurs (validation, save, upload)  
**Purpose:** Catch-all for errors

**Parameters:**
```typescript
{
  error_type: string;        // "validation" | "save" | "upload" | "auth" | "unknown"
  error_code: string;
  error_message: string;
  context: string;           // Where error occurred: "extension" | "host_app"
  session_id: string;
  user_id: string?;
}
```

**Example:**
```javascript
Analytics.logEvent('share_error', {
  error_type: 'validation',
  error_code: 'file_too_large',
  error_message: 'File exceeds 50MB limit',
  context: 'extension',
  session_id: 'session_xyz789'
});
```

---

## 📈 Performance Metrics

### Metric 1: Extension Launch Time
**Event:** `share_performance_extension_launch`

**Parameters:**
```typescript
{
  launch_duration_ms: number; // Time from tap "BookMate" → UI visible
  session_id: string;
}
```

**Target:** <800ms

---

### Metric 2: File Save Time
**Event:** `share_performance_file_save`

**Parameters:**
```typescript
{
  size_bytes: number;
  save_duration_ms: number;
  was_compressed: boolean;
  session_id: string;
}
```

**Target:** <500ms for files <10MB

---

### Metric 3: Upload Performance
**Event:** `share_performance_upload`

**Parameters:**
```typescript
{
  size_bytes: number;
  upload_duration_ms: number;
  network_type: string;
  throughput_kbps: number;   // Calculated: size / duration
}
```

**Target:**
- Wi-Fi: <5s for 5MB file
- 4G: <15s for 5MB file

---

## 🔍 User Engagement Metrics

### Metric 1: Daily Active Users (Share Extension)
**Event:** Aggregate of `share_extension_opened`

**Query:**
```sql
SELECT COUNT(DISTINCT user_id)
FROM events
WHERE event_name = 'share_extension_opened'
  AND date = CURRENT_DATE
```

---

### Metric 2: Share Extension Adoption Rate
**Definition:** % of users who have used share extension at least once

**Query:**
```sql
WITH total_users AS (
  SELECT COUNT(DISTINCT user_id) AS total FROM users
),
extension_users AS (
  SELECT COUNT(DISTINCT user_id) AS used_extension
  FROM events
  WHERE event_name = 'share_extension_opened'
)
SELECT (used_extension::FLOAT / total::FLOAT * 100) AS adoption_rate_percent
FROM total_users, extension_users
```

**Target:** 40% within 30 days

---

### Metric 3: Upload Success Rate
**Query:**
```sql
WITH uploads AS (
  SELECT
    SUM(CASE WHEN event_name = 'share_upload_success' THEN 1 ELSE 0 END) AS successes,
    SUM(CASE WHEN event_name = 'share_upload_failed' THEN 1 ELSE 0 END) AS failures
  FROM events
  WHERE event_name IN ('share_upload_success', 'share_upload_failed')
)
SELECT (successes::FLOAT / (successes + failures) * 100) AS success_rate_percent
FROM uploads
```

**Target:** ≥99%

---

### Metric 4: Average Upload Time by Network
**Query:**
```sql
SELECT
  network_type,
  AVG(upload_duration_ms) AS avg_duration_ms,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY upload_duration_ms) AS p95_duration_ms
FROM events
WHERE event_name = 'share_upload_success'
GROUP BY network_type
```

---

## 📊 Dashboard Panels (Grafana / Datadog)

### Panel 1: Daily Extension Usage
**Metric:** Count of `share_extension_opened` by day  
**Visualization:** Line chart

---

### Panel 2: Upload Success Rate
**Metric:** `share_upload_success / (share_upload_success + share_upload_failed) * 100`  
**Visualization:** Single stat (percentage)  
**Alert:** If <95%, send alert

---

### Panel 3: Upload Performance (p95)
**Metric:** 95th percentile of `upload_duration_ms` by network type  
**Visualization:** Bar chart (Wi-Fi vs 4G)

---

### Panel 4: Top Source Apps
**Metric:** Count of `share_extension_opened` grouped by `source_app_name`  
**Visualization:** Pie chart

**Expected:**
- Photos: ~60%
- Files: ~20%
- Banking apps: ~10%
- Other: ~10%

---

### Panel 5: Error Rate
**Metric:** Count of `share_error` by `error_code`  
**Visualization:** Stacked bar chart  
**Alert:** If error rate >5%, send alert

---

## 🔔 Alerts & Monitoring

### Alert 1: High Error Rate
**Condition:** `share_error` count > 50 in last hour  
**Severity:** P1  
**Action:** Page on-call engineer

---

### Alert 2: Low Upload Success Rate
**Condition:** Upload success rate <90% in last 6 hours  
**Severity:** P1  
**Action:** Slack #engineering

---

### Alert 3: Slow Upload Performance
**Condition:** p95 upload time >15s on Wi-Fi in last hour  
**Severity:** P2  
**Action:** Slack #performance

---

### Alert 4: Backend 500 Errors
**Condition:** `share_upload_failed` with `http_status=500` count >10 in last 15 min  
**Severity:** P0  
**Action:** Page on-call + backend team

---

## 📝 Implementation Checklist

### Extension (Swift)
- [ ] Instrument `share_extension_opened` on `viewDidLoad`
- [ ] Instrument `share_item_validated` for each file
- [ ] Instrument `share_item_saved` after App Group write
- [ ] Instrument `share_confirmed` on "Send" tap
- [ ] Instrument `share_cancelled` on "Cancel" tap
- [ ] Instrument `share_error` for all errors
- [ ] Instrument `share_performance_extension_launch` timing

### Host App (React Native / TypeScript)
- [ ] Instrument `share_upload_started` when upload begins
- [ ] Instrument `share_upload_success` on 200 OK
- [ ] Instrument `share_upload_failed` on error
- [ ] Instrument `share_queue_persisted` when offline
- [ ] Instrument `share_queue_flushed` when online
- [ ] Instrument `share_performance_upload` for each upload

### Backend
- [ ] Log all `/api/mobile/ingest` requests
- [ ] Record: user ID, file size, duration, status code
- [ ] Export logs to analytics platform (BigQuery / Datadog)

---

## 🧪 Testing Analytics

### Test Events (Staging)
```bash
# Send test event
curl -X POST https://www.google-analytics.com/mp/collect \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "test_client",
    "events": [{
      "name": "share_extension_opened",
      "params": {
        "source_app": "com.apple.mobileslideshow",
        "item_count": 1
      }
    }]
  }'
```

### Verify in Firebase Console
1. Firebase Console → Analytics → DebugView
2. Enable debug mode on test device:
   ```bash
   adb shell setprop debug.firebase.analytics.app com.siamoon.bookmate
   ```
3. Use extension → Verify events appear in DebugView

---

**Status:** ✅ Analytics Events Complete  
**Next:** Final review and implementation kickoff  
**Review:** Pending iOS Lead and Data Team approval

---

*Last Updated: November 12, 2025*  
*Document Owner: iOS Lead + Data Analyst*
