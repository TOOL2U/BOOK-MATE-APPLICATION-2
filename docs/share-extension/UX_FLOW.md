# 📱 iOS Share Extension — UX Flow

**Feature:** "Share to BookMate"  
**Version:** v1.1.0  
**Last Updated:** November 12, 2025

---

## 🎯 User Stories

### Story 1: Share Single Photo Receipt
**As a** BookMate user  
**I want to** share a bank slip photo directly from Photos app  
**So that** I can upload it to BookMate in 2 taps instead of 5+

**Acceptance Criteria:**
- User selects photo in Photos app
- Taps share button
- Sees "BookMate" in share sheet
- Taps "BookMate"
- Extension opens with confirmation UI
- Taps "Send to BookMate"
- Returns to Photos app
- Receives notification "1 receipt queued for upload"
- Opens BookMate app → sees receipt in "Pending" section
- Upload completes automatically in background

---

### Story 2: Share Multiple Photos
**As a** user with multiple receipts  
**I want to** select 3-5 photos and share them all at once  
**So that** I can batch upload after a shopping trip

**Acceptance Criteria:**
- User selects 3 photos in Photos app
- Taps share → "BookMate"
- Extension shows "3 items selected"
- Taps "Send to BookMate"
- Returns to Photos
- Notification: "3 receipts queued for upload"
- Opens BookMate → sees 3 pending uploads
- All upload in parallel

---

### Story 3: Share PDF from Files App
**As a** user who received an invoice PDF  
**I want to** share it from Files app to BookMate  
**So that** I can keep all expenses in one place

**Acceptance Criteria:**
- User opens Files app
- Long-press PDF → Share
- Taps "BookMate"
- Extension shows PDF preview (filename + size)
- Taps "Send to BookMate"
- Returns to Files
- PDF queued for upload
- Opens BookMate → PDF appears in pending uploads

---

### Story 4: Share from Banking App
**As a** user who receives bank transaction slips  
**I want to** share them directly from my banking app  
**So that** I don't need to save to Photos first

**Acceptance Criteria:**
- Banking app shows transaction slip (image)
- Taps share button
- Selects "BookMate"
- Extension opens with preview
- Taps "Send to BookMate"
- Returns to banking app
- Image queued and uploaded

---

### Story 5: Offline Share
**As a** user in airplane mode  
**I want to** share a receipt  
**So that** it uploads when I'm back online

**Acceptance Criteria:**
- User is offline (airplane mode)
- Shares photo to BookMate
- Extension shows "Saved - will upload when online"
- Returns to source app
- User goes back online
- Opens BookMate app
- Pending receipts upload automatically
- User sees success notification

---

## 📊 User Flows (Detailed)

### Flow 1: Happy Path (Photo → BookMate)

```
┌─────────────────────────┐
│   Photos App            │
│   (User viewing photo)  │
└───────────┬─────────────┘
            │
            │ Tap Share button
            ▼
┌─────────────────────────┐
│   iOS Share Sheet       │
│   [Messages] [Mail]     │
│   [BookMate] [AirDrop]  │  ← BookMate appears here
└───────────┬─────────────┘
            │
            │ Tap "BookMate"
            ▼
┌─────────────────────────┐
│ Share Extension UI      │
│ ┌─────────────────────┐ │
│ │ 📸 IMG_1234.jpg     │ │
│ │ 2.3 MB              │ │
│ └─────────────────────┘ │
│                         │
│ Optional: Add note      │
│ [                    ]  │
│                         │
│ [Cancel]  [Send (1)]    │  ← Send button
└───────────┬─────────────┘
            │
            │ Tap "Send"
            ▼
┌─────────────────────────┐
│ Quick Animation         │
│ ✓ Sent to BookMate      │
│ (0.5s then dismiss)     │
└───────────┬─────────────┘
            │
            │ Auto-dismiss
            ▼
┌─────────────────────────┐
│   Photos App            │
│   (Returns to gallery)  │
└─────────────────────────┘
            │
            │ User continues browsing
            │
            │ Later: Opens BookMate
            ▼
┌─────────────────────────┐
│   BookMate App          │
│   Dashboard             │
│   ┌───────────────────┐ │
│   │ 🔔 1 new receipt  │ │ ← Banner
│   └───────────────────┘ │
│                         │
│   Tap "Review" →        │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   Review Screen         │
│   ┌───────────────────┐ │
│   │ [Thumbnail]       │ │
│   │ IMG_1234.jpg      │ │
│   │ Uploaded: 2m ago  │ │
│   │                   │ │
│   │ [Categorize]      │ │ ← Optional
│   └───────────────────┘ │
│                         │
│   [Skip] [Process (1)]  │
└─────────────────────────┘
```

---

### Flow 2: Multiple Files

```
Photos App (3 selected) → Share → BookMate
                ↓
Extension UI:
┌─────────────────────────┐
│ 3 items selected        │
│ ┌─────┐ ┌─────┐ ┌─────┐ │
│ │ 📸 │ │ 📸 │ │ 📸 │ │ ← Thumbnails
│ └─────┘ └─────┘ └─────┘ │
│                         │
│ Total: 6.8 MB           │
│                         │
│ [Cancel]  [Send (3)]    │
└─────────────────────────┘
                ↓
        Tap "Send"
                ↓
┌─────────────────────────┐
│ ✓ 3 items sent          │
│ (Auto-dismiss 0.5s)     │
└─────────────────────────┘
```

---

### Flow 3: Error State (No Authentication)

```
User shares photo → BookMate Extension
                ↓
Extension checks auth token
                ↓
        No token found
                ↓
┌─────────────────────────┐
│ ⚠️ Sign in Required     │
│                         │
│ Open BookMate to        │
│ sign in, then try       │
│ sharing again.          │
│                         │
│        [OK]             │
└─────────────────────────┘
                ↓
        User taps OK
                ↓
      Extension dismisses
                ↓
┌─────────────────────────┐
│ File saved locally      │
│ Will prompt on next     │
│ BookMate app open       │
└─────────────────────────┘
```

---

### Flow 4: Offline (No Network)

```
User shares photo → BookMate Extension
                ↓
Extension detects no network
                ↓
┌─────────────────────────┐
│ 📸 IMG_5678.jpg         │
│ 3.1 MB                  │
│                         │
│ ⚠️ Offline              │
│ Will upload when        │
│ connected               │
│                         │
│ [Cancel]  [Save]        │
└─────────────────────────┘
                ↓
        Tap "Save"
                ↓
File persisted to App Group
                ↓
┌─────────────────────────┐
│ ✓ Saved                 │
│ Will upload when online │
└─────────────────────────┘
                ↓
      Extension dismisses
                ↓
Later: User goes online + opens BookMate
                ↓
┌─────────────────────────┐
│ 🔄 Uploading 1 receipt  │
│ [Progress bar]          │
└─────────────────────────┘
                ↓
┌─────────────────────────┐
│ ✓ Receipt uploaded      │
└─────────────────────────┘
```

---

## 🎨 UI Wireframes

### Extension UI (Single Item)
```
┌─────────────────────────────────┐
│ Share to BookMate               │  ← Nav bar
├─────────────────────────────────┤
│                                 │
│   ┌─────────────────────────┐   │
│   │                         │   │
│   │      [Thumbnail]        │   │  ← Preview
│   │      640x480            │   │
│   │                         │   │
│   └─────────────────────────┘   │
│                                 │
│   📄 IMG_1234.jpg               │  ← Filename
│   📊 2.3 MB • JPEG              │  ← Size & type
│                                 │
│   Add a note (optional)         │
│   ┌─────────────────────────┐   │
│   │                         │   │  ← Text input
│   └─────────────────────────┘   │
│                                 │
├─────────────────────────────────┤
│  [Cancel]          [Send (1)]   │  ← Actions
└─────────────────────────────────┘
```

### Extension UI (Multiple Items)
```
┌─────────────────────────────────┐
│ Share to BookMate               │
├─────────────────────────────────┤
│                                 │
│   3 items selected              │
│                                 │
│   ┌────┐  ┌────┐  ┌────┐        │
│   │ 📸│  │ 📸│  │ 📸│        │  ← Thumbnails
│   └────┘  └────┘  └────┘        │
│                                 │
│   📊 Total: 6.8 MB              │
│                                 │
│   Add a note (optional)         │
│   ┌─────────────────────────┐   │
│   │                         │   │
│   └─────────────────────────┘   │
│                                 │
├─────────────────────────────────┤
│  [Cancel]          [Send (3)]   │
└─────────────────────────────────┘
```

### Success State
```
┌─────────────────────────────────┐
│                                 │
│           ✓                     │  ← Big checkmark
│                                 │
│      Sent to BookMate           │
│                                 │
│  (Auto-dismisses in 0.5s)       │
│                                 │
└─────────────────────────────────┘
```

### Error State
```
┌─────────────────────────────────┐
│                                 │
│           ⚠️                    │
│                                 │
│       Sign in Required          │
│                                 │
│   Open BookMate to sign in,     │
│   then try sharing again.       │
│                                 │
│          [OK]                   │
│                                 │
└─────────────────────────────────┘
```

---

## 🎯 Edge Cases & Handling

### Edge Case 1: Very Large File (>50MB)
**Scenario:** User shares 60MB PDF

**Handling:**
```
Extension UI:
┌─────────────────────────┐
│ ⚠️ File too large       │
│                         │
│ Document.pdf            │
│ 60.2 MB                 │
│                         │
│ Maximum: 50 MB          │
│                         │
│ Open BookMate to        │
│ upload large files      │
│                         │
│      [OK]               │
└─────────────────────────┘
```

**User Path:**
1. Extension shows error
2. User taps OK
3. Extension dismisses
4. User opens BookMate app
5. App shows "Upload Large File" button
6. User selects file manually

---

### Edge Case 2: Unsupported File Type
**Scenario:** User shares .docx file

**Handling:**
```
Extension UI:
┌─────────────────────────┐
│ ⚠️ Unsupported format   │
│                         │
│ Report.docx             │
│                         │
│ BookMate supports:      │
│ • Photos (JPG, PNG)     │
│ • PDFs                  │
│                         │
│      [OK]               │
└─────────────────────────┘
```

---

### Edge Case 3: Duplicate File
**Scenario:** User shares photo already uploaded today

**v1.0 Behavior:** Accept duplicate (no detection)

**v1.1 Planned:**
```
Extension UI:
┌─────────────────────────┐
│ ℹ️ Already Uploaded     │
│                         │
│ This receipt was        │
│ uploaded 2 hours ago    │
│                         │
│ [Cancel] [Send Anyway]  │
└─────────────────────────┘
```

---

### Edge Case 4: Extension Killed Mid-Upload
**Scenario:** iOS terminates extension after 30s

**Handling:**
1. Extension persists file to App Group immediately (< 1s)
2. Starts upload in background URLSession
3. If killed, URLSession continues in background
4. Host app checks for completed uploads on next foreground
5. If upload failed, host app retries

**User Experience:**
- User doesn't see extension hang
- Extension dismisses after confirming file saved
- Host app shows "Uploading in background..." banner
- Success/failure notification appears later

---

### Edge Case 5: No Disk Space
**Scenario:** Device has < 100MB free space

**Handling:**
```
Extension UI:
┌─────────────────────────┐
│ ⚠️ Insufficient Storage │
│                         │
│ Free up space on your   │
│ device to upload files  │
│                         │
│      [OK]               │
└─────────────────────────┘
```

---

### Edge Case 6: Token Expired
**Scenario:** User's auth token expired (7 days since last login)

**Handling:**
1. Extension detects expired token
2. Saves file to App Group with `auth_required` flag
3. Shows "Sign in required" message
4. User opens host app
5. App prompts re-authentication
6. After login, app processes queued files

**UI:**
```
Host App (on next launch):
┌─────────────────────────┐
│ 🔒 Sign In Required     │
│                         │
│ Your session expired.   │
│ Sign in to upload       │
│ 1 pending receipt       │
│                         │
│   [Sign In]             │
└─────────────────────────┘
```

---

### Edge Case 7: Poor Network (Upload Timeout)
**Scenario:** Upload takes >30s on slow 3G

**Handling:**
1. Extension saves file to App Group immediately
2. Shows "Saved - uploading in background"
3. Host app attempts upload when next opened
4. If still slow, shows progress bar
5. User can pause/cancel upload

**UI:**
```
Host App:
┌─────────────────────────┐
│ 🔄 Uploading Receipt    │
│ [████████░░] 80%        │
│                         │
│ 3.2 MB of 4.1 MB        │
│ 2 min remaining         │
│                         │
│   [Pause] [Cancel]      │
└─────────────────────────┘
```

---

## 🔔 Notifications & Toasts

### Success Notification (Host App)
**Trigger:** Upload completes in background

**UI:**
```
┌─────────────────────────────────┐
│ ✓ Receipt uploaded              │ ← Banner toast
│ Tap to categorize                │
└─────────────────────────────────┘
```
**Duration:** 3 seconds  
**Action:** Tap → navigates to review screen

---

### Error Notification
**Trigger:** Upload fails after 3 retries

**UI:**
```
┌─────────────────────────────────┐
│ ⚠️ Upload failed                │
│ IMG_1234.jpg • Tap to retry      │
└─────────────────────────────────┘
```
**Duration:** Until dismissed  
**Action:** Tap → retries upload

---

### Queued Notification
**Trigger:** File saved while offline

**UI:**
```
┌─────────────────────────────────┐
│ 📥 1 receipt queued             │
│ Will upload when online          │
└─────────────────────────────────┘
```
**Duration:** 2 seconds  
**Action:** None (informational)

---

## 📊 Empty/Error States in Host App

### Empty State (No Pending Uploads)
```
┌─────────────────────────────────┐
│                                 │
│           📋                    │
│                                 │
│   No pending uploads            │
│                                 │
│   Share photos or PDFs from     │
│   other apps to get started     │
│                                 │
└─────────────────────────────────┘
```

---

### Queue Screen (With Pending Uploads)
```
┌─────────────────────────────────┐
│ Pending Uploads              (3)│
├─────────────────────────────────┤
│ ┌─────┐ IMG_1234.jpg            │
│ │ 📸 │ 2.3 MB • 2m ago          │
│ └─────┘ [✓ Uploaded]            │
├─────────────────────────────────┤
│ ┌─────┐ IMG_5678.jpg            │
│ │ 📸 │ 1.8 MB • Uploading...    │
│ └─────┘ [████░░] 70%            │
├─────────────────────────────────┤
│ ┌─────┐ Receipt.pdf             │
│ │ 📄 │ 4.1 MB • Failed          │
│ └─────┘ [Retry]                 │
└─────────────────────────────────┘
```

---

### Error State (All Failed)
```
┌─────────────────────────────────┐
│           ⚠️                    │
│                                 │
│   3 uploads failed              │
│                                 │
│   Check your network connection │
│   and try again                 │
│                                 │
│      [Retry All]                │
└─────────────────────────────────┘
```

---

## 🎨 Screenshots for App Store

### Screenshot 1: Share Sheet Integration
**Device:** iPhone 15 Pro  
**Resolution:** 1242 × 2688  
**Caption:** "Share receipts from any app"

**Content:**
- Photos app with share sheet open
- "BookMate" visible in app row
- Annotation: "Tap to send to BookMate"

---

### Screenshot 2: Extension UI
**Device:** iPhone 15 Pro  
**Resolution:** 1242 × 2688  
**Caption:** "Quick and easy upload"

**Content:**
- Extension UI showing receipt preview
- "Send to BookMate" button highlighted
- Clean, minimal interface

---

### Screenshot 3: Host App Queue
**Device:** iPhone 15 Pro  
**Resolution:** 1242 × 2688  
**Caption:** "Track your uploads"

**Content:**
- Host app showing pending uploads
- Upload progress indicators
- Success states

---

### Screenshot 4: Success State
**Device:** iPhone 15 Pro  
**Resolution:** 1242 × 2688  
**Caption:** "Automatic processing"

**Content:**
- Dashboard with "Receipt uploaded" notification
- Clean integration with main app
- Professional appearance

---

## 🧪 User Testing Scenarios

### Test Scenario 1: First-Time User
**Goal:** Test discoverability and onboarding

**Steps:**
1. Install BookMate v1.1 (never used share extension)
2. Take photo of receipt
3. Tap share button
4. Observe: Does user find "BookMate" option?
5. Tap "BookMate"
6. Observe: Is extension UI clear?
7. Complete upload

**Success Criteria:**
- User finds BookMate in share sheet without help
- User understands extension UI immediately
- Upload completes without confusion

---

### Test Scenario 2: Power User (Batch Upload)
**Goal:** Test multi-file workflow

**Steps:**
1. Select 5 receipts in Photos
2. Share all to BookMate
3. Review extension UI
4. Confirm upload
5. Open BookMate app
6. Review pending uploads

**Success Criteria:**
- All 5 files appear in extension
- Upload completes within 20s on Wi-Fi
- Host app shows all 5 in queue
- No files lost or duplicated

---

### Test Scenario 3: Offline Recovery
**Goal:** Test offline persistence

**Steps:**
1. Enable airplane mode
2. Share receipt to BookMate
3. Extension shows "saved" message
4. Disable airplane mode
5. Open BookMate app
6. Observe auto-upload

**Success Criteria:**
- File persisted while offline
- Clear messaging about offline state
- Automatic upload when online
- User receives success notification

---

## ✅ Acceptance Criteria Summary

### Must Have (v1.0)
- [ ] Extension appears in iOS share sheet
- [ ] Supports single and multiple files
- [ ] Supports .jpg, .jpeg, .png, .heic, .pdf
- [ ] Files persist if extension killed
- [ ] Host app displays pending queue
- [ ] Uploads complete in background
- [ ] Success/failure notifications shown
- [ ] Graceful offline handling
- [ ] Auth state validated
- [ ] Error states have clear messaging

### Nice to Have (v1.1+)
- [ ] In-extension preview with zoom
- [ ] Quick categorization dropdown
- [ ] Amount field for manual entry
- [ ] Duplicate detection with user choice
- [ ] Batch rename in host app
- [ ] Scheduled upload (e.g., "Upload at 9 PM")

---

## 📝 Copy & Messaging

### Extension Name
**Display Name:** "BookMate" (matches main app)  
**Subtitle:** "Add to receipts"

### Buttons
- Primary: "Send to BookMate" or "Send (3)" if multiple
- Secondary: "Cancel"

### Messages
- Success: "✓ Sent to BookMate"
- Offline: "Saved - will upload when online"
- Auth Required: "Sign in Required — Open BookMate to sign in, then try sharing again."
- Too Large: "File too large (max 50 MB)"
- Unsupported: "Unsupported format — BookMate supports photos (JPG, PNG) and PDFs"

---

**Status:** ✅ UX Flow Complete  
**Next:** Technical specification and API design  
**Review:** Pending PM and Design team approval

---

*Last Updated: November 12, 2025*  
*Document Owner: Product Designer + iOS Lead*
