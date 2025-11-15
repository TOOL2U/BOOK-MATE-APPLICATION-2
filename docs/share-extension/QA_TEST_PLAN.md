# ✅ iOS Share Extension — QA Test Plan

**Feature:** "Share to BookMate"  
**Version:** v1.1.0  
**Test Phase:** UAT (User Acceptance Testing)  
**Last Updated:** November 12, 2025

---

## 🎯 Test Objectives

1. **Functional:** Verify all share extension features work as specified
2. **Compatibility:** Ensure compatibility across iOS versions and devices
3. **Performance:** Validate performance meets targets (<800ms open, <5s upload)
4. **Security:** Confirm authentication and data handling are secure
5. **UX:** Validate user experience is smooth and intuitive

---

## 📱 Device Matrix

### Required Test Devices

| Device            | iOS Version | Screen Size | Purpose                    |
|-------------------|-------------|-------------|----------------------------|
| iPhone 12         | iOS 17.0    | 6.1"        | Mid-range device           |
| iPhone 13 Pro     | iOS 17.1    | 6.1"        | Pro features               |
| iPhone 14         | iOS 17.2    | 6.1"        | Latest non-Pro             |
| iPhone 15 Pro Max | iOS 17.3    | 6.7"        | Largest screen             |
| iPhone SE (3rd)   | iOS 17.0    | 4.7"        | Smallest screen + budget   |
| iPad Air (5th)    | iPadOS 17.1 | 10.9"       | Tablet compatibility       |
| iPad Pro 12.9"    | iPadOS 17.2 | 12.9"       | Largest tablet             |

### Network Conditions
- ✅ Wi-Fi (fast: 100+ Mbps)
- ✅ Wi-Fi (slow: 1-5 Mbps)
- ✅ 5G (if available)
- ✅ 4G LTE
- ✅ 3G (throttled)
- ✅ Airplane mode (offline)

---

## 🧪 Test Cases

### TC-001: Share Single Photo from Photos App
**Priority:** P0 (Critical)  
**Pre-conditions:**
- User is authenticated in BookMate app
- Photos app has at least 1 photo

**Steps:**
1. Open Photos app
2. Select any photo
3. Tap share button
4. Scroll share sheet to find "BookMate"
5. Tap "BookMate"
6. Verify extension UI opens
7. Tap "Send to BookMate"
8. Verify success message
9. Open BookMate app
10. Navigate to pending uploads

**Expected Results:**
- ✅ "BookMate" appears in share sheet
- ✅ Extension opens in <800ms
- ✅ Photo preview displayed correctly
- ✅ "Send to BookMate" button enabled
- ✅ Success message shown after tap
- ✅ Extension dismisses in <200ms
- ✅ Photo appears in pending uploads queue
- ✅ Upload completes in <5s on Wi-Fi
- ✅ Notification shown after upload

**Pass Criteria:** All steps complete without errors

---

### TC-002: Share Multiple Photos (3+)
**Priority:** P0 (Critical)  
**Pre-conditions:**
- User is authenticated
- Photos app has 5+ photos

**Steps:**
1. Open Photos app
2. Tap "Select"
3. Select 3 photos
4. Tap share button
5. Tap "BookMate"
6. Verify "3 items selected" displayed
7. Tap "Send (3)"
8. Open BookMate app

**Expected Results:**
- ✅ Extension shows all 3 thumbnails
- ✅ Item count displayed: "3 items selected"
- ✅ Button label: "Send (3)"
- ✅ All 3 photos appear in pending queue
- ✅ All upload successfully
- ✅ Notification: "3 receipts uploaded"

**Pass Criteria:** All 3 photos uploaded successfully

---

### TC-003: Share PDF from Files App
**Priority:** P1 (High)  
**Pre-conditions:**
- User has PDF in Files app
- User is authenticated

**Steps:**
1. Open Files app
2. Navigate to PDF file
3. Long-press PDF → Share
4. Tap "BookMate"
5. Verify PDF preview shown
6. Tap "Send to BookMate"
7. Open BookMate app

**Expected Results:**
- ✅ PDF filename and size displayed
- ✅ Extension shows PDF icon/preview
- ✅ Upload completes successfully
- ✅ PDF appears in pending queue
- ✅ Can view PDF in app after upload

**Pass Criteria:** PDF uploaded and viewable

---

### TC-004: Share from 3rd-Party Banking App
**Priority:** P1 (High)  
**Pre-conditions:**
- Banking app installed (e.g., Chase, Bank of America)
- User has transaction slip/receipt in banking app

**Steps:**
1. Open banking app
2. Navigate to transaction with downloadable receipt
3. Tap share/export button
4. Tap "BookMate" in share sheet
5. Verify receipt preview
6. Tap "Send to BookMate"

**Expected Results:**
- ✅ "BookMate" appears in banking app share sheet
- ✅ Receipt image loads correctly
- ✅ Upload succeeds
- ✅ Receipt appears in BookMate pending queue

**Pass Criteria:** Receipt successfully uploaded from 3rd-party app

---

### TC-005: Offline Share (Airplane Mode)
**Priority:** P0 (Critical)  
**Pre-conditions:**
- User is authenticated
- Device in airplane mode (offline)

**Steps:**
1. Enable airplane mode
2. Open Photos app
3. Share photo to BookMate
4. Verify "Saved - will upload when online" message
5. Disable airplane mode
6. Open BookMate app
7. Wait 5 seconds

**Expected Results:**
- ✅ Extension shows offline indicator
- ✅ File saved to App Group locally
- ✅ "Saved" confirmation message displayed
- ✅ After going online, app auto-uploads
- ✅ Notification: "Receipt uploaded"
- ✅ File appears in queue with "uploaded" status

**Pass Criteria:** File queued offline, auto-uploaded when online

---

### TC-006: Share Without Authentication
**Priority:** P0 (Critical)  
**Pre-conditions:**
- User is NOT authenticated (logged out)

**Steps:**
1. Log out of BookMate app (if logged in)
2. Open Photos app
3. Share photo to BookMate
4. Observe error message

**Expected Results:**
- ✅ Extension shows "Sign in Required" error
- ✅ Clear message: "Open BookMate to sign in, then try sharing again."
- ✅ "OK" button dismisses extension
- ✅ File NOT saved to App Group
- ✅ User can retry after authenticating

**Pass Criteria:** Clear error shown, no file saved

---

### TC-007: Share Large File (45MB)
**Priority:** P1 (High)  
**Pre-conditions:**
- User has large image file (40-49MB)

**Steps:**
1. Share 45MB image to BookMate
2. Observe upload progress
3. Verify success

**Expected Results:**
- ✅ Extension accepts file (under 50MB limit)
- ✅ Compression applied (if >5MB)
- ✅ Upload completes (may take 10-20s on Wi-Fi)
- ✅ Progress indicator shown in host app
- ✅ Success notification after upload

**Pass Criteria:** Large file uploaded successfully

---

### TC-008: Share Oversized File (>50MB)
**Priority:** P1 (High)  
**Pre-conditions:**
- User has file >50MB

**Steps:**
1. Share 60MB PDF to BookMate
2. Observe error

**Expected Results:**
- ✅ Extension shows "File too large" error
- ✅ Message: "Maximum: 50 MB"
- ✅ User can tap "OK" to dismiss
- ✅ File NOT uploaded
- ✅ Clear guidance to use main app for large files

**Pass Criteria:** Error shown, file rejected

---

### TC-009: Share Unsupported File Type (.txt)
**Priority:** P1 (High)  
**Pre-conditions:**
- User has .txt file

**Steps:**
1. Open Files app
2. Share .txt file to BookMate
3. Observe result

**Expected Results:**
- ✅ Extension shows "Unsupported format" error
- ✅ Lists supported types: "Photos (JPG, PNG), PDFs"
- ✅ File NOT uploaded

**Pass Criteria:** Clear error, file rejected

---

### TC-010: Token Expiration During Upload
**Priority:** P2 (Medium)  
**Pre-conditions:**
- User's access token about to expire (14min 50s old)

**Steps:**
1. Share photo to BookMate
2. Extension queues file
3. Host app attempts upload after token expires
4. Observe behavior

**Expected Results:**
- ✅ Upload fails with 401 error
- ✅ App automatically refreshes token
- ✅ Upload retried with new token
- ✅ Upload succeeds
- ✅ User sees success notification (seamless)

**Pass Criteria:** Token refresh transparent to user

---

### TC-011: Network Interruption Mid-Upload
**Priority:** P1 (High)  
**Pre-conditions:**
- User on Wi-Fi

**Steps:**
1. Share photo to BookMate
2. Photo starts uploading
3. Disable Wi-Fi mid-upload
4. Wait 10 seconds
5. Re-enable Wi-Fi
6. Observe behavior

**Expected Results:**
- ✅ Upload pauses when network lost
- ✅ File remains in pending queue
- ✅ Upload resumes when network restored
- ✅ Upload completes successfully
- ✅ User sees success notification

**Pass Criteria:** Upload recovers from network interruption

---

### TC-012: Rapid Sequential Shares (5 files in 30s)
**Priority:** P2 (Medium)  
**Pre-conditions:**
- User has 5+ photos

**Steps:**
1. Share photo 1 to BookMate
2. Immediately share photo 2
3. Continue with photos 3, 4, 5 (rapid succession)
4. Open BookMate app
5. Observe pending queue

**Expected Results:**
- ✅ All 5 files appear in pending queue
- ✅ No duplicates
- ✅ All upload successfully (may be in parallel)
- ✅ No crashes or hangs
- ✅ Memory usage stays <200MB

**Pass Criteria:** All 5 files uploaded without errors

---

### TC-013: Share While Low Memory (<100MB free)
**Priority:** P2 (Medium)  
**Pre-conditions:**
- Device has low available memory

**Steps:**
1. Fill device memory (use large apps/files)
2. Share photo to BookMate
3. Observe behavior

**Expected Results:**
- ✅ Extension handles low memory gracefully
- ✅ File saved to App Group (priority)
- ✅ Upload deferred if necessary
- ✅ No crash
- ✅ User sees success/queued message

**Pass Criteria:** No crash, file safely queued

---

### TC-014: Background Upload (App in Background)
**Priority:** P1 (High)  
**Pre-conditions:**
- User has file in pending queue

**Steps:**
1. Share photo to BookMate
2. Switch to another app (put BookMate in background)
3. Wait 30 seconds
4. Return to BookMate app

**Expected Results:**
- ✅ Upload completed in background
- ✅ File moved from pending to uploaded
- ✅ Notification shown
- ✅ Dashboard updated with new receipt

**Pass Criteria:** Upload completes while app backgrounded

---

### TC-015: Extension Killed by iOS (30s timeout)
**Priority:** P0 (Critical)  
**Pre-conditions:**
- Simulated: Trigger 30s extension timeout

**Steps:**
1. Share large file (20MB)
2. Extension starts processing
3. iOS kills extension after 30s (simulated)
4. Open BookMate app

**Expected Results:**
- ✅ File already saved to App Group (before timeout)
- ✅ File appears in pending queue
- ✅ Host app uploads file
- ✅ No data loss

**Pass Criteria:** File persisted despite extension being killed

---

### TC-016: Duplicate File Detection (v1.1)
**Priority:** P3 (Low - Future)  
**Pre-conditions:**
- User uploaded same photo yesterday

**Steps:**
1. Share same photo again
2. Observe warning

**Expected Results:**
- ⚠️ v1.0: No duplicate detection (accepted)
- ✅ v1.1: Shows "Already uploaded 1 day ago" warning
- ✅ v1.1: User can choose "Cancel" or "Upload Anyway"

**Pass Criteria (v1.1):** Duplicate detected with user choice

---

### TC-017: HEIC File Compatibility
**Priority:** P1 (High)  
**Pre-conditions:**
- User has HEIC photo (iPhone default format)

**Steps:**
1. Take new photo with iPhone (defaults to HEIC)
2. Share to BookMate
3. Verify upload

**Expected Results:**
- ✅ HEIC file accepted
- ✅ File uploaded as HEIC (or converted to JPG if needed)
- ✅ Thumbnail displays correctly
- ✅ Full image viewable in app

**Pass Criteria:** HEIC photos upload successfully

---

### TC-018: User Cancels Mid-Upload
**Priority:** P2 (Medium)  
**Pre-conditions:**
- User sharing file

**Steps:**
1. Share large file (30MB)
2. Tap "Send to BookMate"
3. Immediately tap "Cancel" in host app progress screen

**Expected Results:**
- ✅ Upload cancels immediately
- ✅ File removed from pending queue
- ✅ Partial upload discarded (not saved)
- ✅ No error notification

**Pass Criteria:** Upload cancels cleanly without errors

---

### TC-019: Add Note to Shared File
**Priority:** P2 (Medium)  
**Pre-conditions:**
- User authenticated

**Steps:**
1. Share photo to BookMate
2. Type note in "Add a note" field: "Business lunch receipt"
3. Tap "Send to BookMate"
4. Open host app
5. View receipt details

**Expected Results:**
- ✅ Note field accepts text input
- ✅ Note saved with file metadata
- ✅ Note visible in host app receipt view
- ✅ Note uploaded to backend

**Pass Criteria:** Note persists through upload

---

### TC-020: Rapid Extension Open/Close (Stress Test)
**Priority:** P2 (Medium)  
**Pre-conditions:**
- User has multiple photos

**Steps:**
1. Share photo 1 → Open extension → Cancel
2. Share photo 2 → Open extension → Cancel
3. Repeat 10 times rapidly
4. Share photo 11 → Complete upload

**Expected Results:**
- ✅ No crashes
- ✅ Extension opens/closes smoothly each time
- ✅ Memory doesn't leak (<50MB growth)
- ✅ Final upload succeeds

**Pass Criteria:** No crashes or performance degradation

---

## 📊 Performance Benchmarks

### Target Metrics

| Metric                     | Target      | Measurement Method                 |
|----------------------------|-------------|------------------------------------|
| Extension Launch Time      | <800ms      | Tap "BookMate" → UI visible        |
| File Copy to App Group     | <500ms      | Per file <10MB                     |
| UI Dismiss After Send      | <200ms      | Tap "Send" → extension closes      |
| Upload Time (5MB, Wi-Fi)   | <5s         | Start upload → 200 OK received     |
| Upload Time (5MB, 4G)      | <15s        | Start upload → 200 OK received     |
| Memory Peak (Single)       | <100MB      | Monitor Xcode Instruments          |
| Memory Peak (5 files)      | <150MB      | Monitor Xcode Instruments          |

### Performance Test Script
```bash
# Install Xcode Instruments
# Run app in Release mode
# Profile using Time Profiler + Allocations

# Commands for automated measurement:
xcrun xctrace record --template 'Time Profiler' \
  --launch com.siamoon.bookmate \
  --output share_extension_profile.trace

# Analyze results:
xcrun xctrace export --input share_extension_profile.trace
```

---

## 🔒 Security Test Cases

### SEC-001: Token Storage Security
**Test:** Verify auth tokens stored in Keychain, not plaintext

**Steps:**
1. Authenticate in app
2. Inspect App Group files
3. Search for token string

**Expected:** Token NOT found in App Group files (only in Keychain)

---

### SEC-002: PII Handling
**Test:** Verify files deleted after upload

**Steps:**
1. Upload receipt with personal info
2. Verify upload succeeds
3. Check App Group `uploaded/` directory after 24 hours

**Expected:** File deleted from device (only on cloud)

---

### SEC-003: Malicious File Detection
**Test:** Share .exe renamed to .jpg

**Steps:**
1. Rename malware.exe to malware.jpg
2. Share to BookMate

**Expected:** File rejected (magic number check)

---

## 📸 Screenshot Test Plan

### Required Screenshots for App Store
1. Share sheet with "BookMate" visible (iPhone 6.5")
2. Extension UI with receipt preview (iPhone 6.5")
3. Host app pending queue (iPhone 6.5")
4. Upload success notification (iPhone 6.5")
5. iPad share sheet (iPad Pro 12.9")

### Screenshot Capture Script
```bash
# Use BookMate screenshot script
./capture-screenshots.sh

# Verify dimensions:
# iPhone: 1242 × 2688 (6.5" display)
# iPad: 2048 × 2732 (12.9" display)
```

---

## ✅ Acceptance Criteria

### Functional (Must Pass)
- [ ] All P0 test cases pass (100%)
- [ ] All P1 test cases pass (≥95%)
- [ ] P2 test cases pass (≥80%)

### Performance (Must Meet)
- [ ] Extension launches in <800ms
- [ ] Upload completes in <5s on Wi-Fi (5MB file)
- [ ] Memory peak <100MB (single file)

### Security (Must Pass)
- [ ] All security test cases pass (100%)
- [ ] No tokens in plaintext
- [ ] Files deleted after upload

### User Experience (Must Pass)
- [ ] No crashes in any test case
- [ ] Error messages are clear and actionable
- [ ] Offline mode works seamlessly

---

## 🐛 Bug Severity Levels

| Severity | Definition                              | Example                           |
|----------|-----------------------------------------|-----------------------------------|
| P0       | Blocker - Cannot ship                  | Extension crashes on launch       |
| P1       | Critical - Major feature broken        | Upload fails for all users        |
| P2       | High - Significant impact              | Upload slow on 4G (>30s)          |
| P3       | Medium - Minor impact                  | Thumbnail quality low             |
| P4       | Low - Cosmetic                         | Button label text slightly cut off|

---

## 📋 QA Sign-Off Checklist

### Before TestFlight Release
- [ ] All device matrix tests completed
- [ ] All P0 test cases pass
- [ ] Performance benchmarks met
- [ ] Security tests pass
- [ ] No P0/P1 bugs open
- [ ] Screenshots captured and reviewed
- [ ] QA lead sign-off received

### Before Production Release
- [ ] TestFlight beta feedback reviewed
- [ ] All reported bugs triaged
- [ ] Regression tests pass
- [ ] Load testing completed (100 concurrent uploads)
- [ ] PM sign-off received
- [ ] iOS lead sign-off received

---

**Status:** ✅ QA Test Plan Complete  
**Next:** Security checklist and rollback procedures  
**Review:** Pending QA Lead approval

---

*Last Updated: November 12, 2025*  
*Document Owner: QA Lead + iOS Lead*
