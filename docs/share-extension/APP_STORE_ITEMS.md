# 🍎 iOS Share Extension — App Store Items

**Feature:** "Share to BookMate"  
**Version:** v1.1.0  
**Last Updated:** November 12, 2025

---

## 🎯 Overview

This document lists all App Store Connect and Apple Developer Portal items that must be created or updated for the iOS Share Extension feature.

---

## 📋 Apple Developer Portal Items

### 1. App Group Identifier
**Status:** ⏸️ To Be Created

**Details:**
- **Type:** App Group
- **Description:** Shared container for BookMate app and Share Extension
- **Identifier:** `group.com.siamoon.bookmate`
- **Name:** BookMate Shared Data

**Creation Steps:**
1. Log in to [Apple Developer Portal](https://developer.apple.com)
2. Navigate to: Certificates, Identifiers & Profiles → Identifiers
3. Click **+** (Add)
4. Select **App Groups** → Continue
5. **Description:** BookMate Shared Data
6. **Identifier:** `group.com.siamoon.bookmate`
7. Click **Register**

---

### 2. Share Extension Bundle Identifier
**Status:** ⏸️ To Be Created

**Details:**
- **Type:** App ID
- **Description:** BookMate Share Extension
- **Bundle ID:** `com.siamoon.bookmate.share`
- **Platform:** iOS
- **Capabilities:**
  - App Groups: ✅ (Required)
  - Push Notifications: ❌ (Not needed)
  - Background Modes: ❌ (Not needed)

**Creation Steps:**
1. Apple Developer Portal → Identifiers → **+** (Add)
2. Select **App IDs** → Continue
3. Select **App** → Continue
4. **Description:** BookMate Share Extension
5. **Bundle ID:** `com.siamoon.bookmate.share`
6. **Capabilities:**
   - Enable: **App Groups**
   - Configure: Select `group.com.siamoon.bookmate`
7. Click **Register**

---

### 3. Update Main App Identifier
**Status:** ⏸️ To Be Updated

**Current:**
- **Bundle ID:** `com.siamoon.bookmate`
- **App Groups:** ❌ Not enabled

**Update:**
- **Bundle ID:** `com.siamoon.bookmate` (unchanged)
- **App Groups:** ✅ Enable and configure `group.com.siamoon.bookmate`

**Update Steps:**
1. Apple Developer Portal → Identifiers
2. Find: `com.siamoon.bookmate`
3. Click to edit
4. Enable **App Groups**
5. Click **Edit** next to App Groups
6. Select: `group.com.siamoon.bookmate`
7. Click **Save**
8. Click **Continue** → **Save**

---

### 4. Provisioning Profiles

#### 4a. Main App Provisioning Profile (Update)
**Status:** ⏸️ To Be Regenerated

**Details:**
- **Type:** iOS App Store
- **App ID:** `com.siamoon.bookmate`
- **Name:** BookMate AppStore
- **Team:** SIA MOON COMPANY LIMITED (Z3X867AM26)
- **Entitlements:** App Groups (newly added)

**Regeneration Required:** Yes (App Groups capability added)

**Steps:**
1. Apple Developer Portal → Profiles
2. Find: BookMate AppStore
3. Click **Edit**
4. Verify App Groups capability included
5. Click **Generate**
6. Download new profile
7. EAS Build will use new profile automatically

---

#### 4b. Share Extension Provisioning Profile (Create)
**Status:** ⏸️ To Be Created

**Details:**
- **Type:** iOS App Store
- **App ID:** `com.siamoon.bookmate.share`
- **Name:** BookMate Share Extension AppStore
- **Team:** SIA MOON COMPANY LIMITED (Z3X867AM26)
- **Distribution Certificate:** Use existing (Serial: 65B4B5A2CB6046D026E09FAC0EA301DD)

**Creation Steps:**
1. Apple Developer Portal → Profiles → **+** (Add)
2. Select **App Store** → Continue
3. **App ID:** Select `com.siamoon.bookmate.share`
4. **Certificate:** Select existing distribution certificate
5. **Profile Name:** BookMate Share Extension AppStore
6. Click **Generate**
7. Download profile
8. EAS Build will use this automatically

---

### 5. Distribution Certificate
**Status:** ✅ Existing (No Changes Needed)

**Details:**
- **Type:** iOS Distribution
- **Name:** iOS Distribution: SIA MOON COMPANY LIMITED
- **Serial:** 65B4B5A2CB6046D026E09FAC0EA301DD
- **Expires:** November 12, 2026
- **Team ID:** Z3X867AM26

**Action:** None (reuse existing certificate for both targets)

---

## 📱 App Store Connect Items

### 6. App Metadata Update
**Status:** ⏸️ To Be Updated

**Current Version:** 1.0.1 (Build 2) - Submitted, in review  
**New Version:** 1.1.0 (Build 3) - Will include Share Extension

**Updates Required:**

#### Version Number
- **Version:** 1.1.0
- **Build:** 3

#### What's New in This Version
```
New in BookMate 1.1:

• Share to BookMate: Upload receipts directly from Photos, Files, or any app's share menu
• Faster uploads: Queue receipts even when offline, auto-upload when connected
• Enhanced authentication: Secure login with email and password

Bug fixes and performance improvements.
```

#### Description (No Change)
```
BookMate: Your Personal Accounting Assistant

Track expenses, manage receipts, and stay on top of your finances with BookMate. 
Designed for freelancers, small business owners, and anyone who wants simple, 
powerful expense tracking.

KEY FEATURES:
• Receipt upload and storage
• Expense categorization
• Financial reports and insights
• Secure cloud backup

NEW: Share Extension
Upload receipts instantly from any app. No need to switch to BookMate first!

Get started with BookMate today and take control of your finances.
```

#### Keywords (Add: "share")
```
accounting, bookkeeping, expenses, receipts, finance, business, tax, invoices, share
```

#### Screenshots (Add New)
**Required:**
- iPhone 6.7" (1290 × 2796): 5 screenshots
  1. Dashboard (existing)
  2. Expense list (existing)
  3. **NEW:** Share sheet with "BookMate" visible
  4. **NEW:** Share Extension UI
  5. **NEW:** Pending uploads queue

- iPad Pro 12.9" (2048 × 2732): 5 screenshots
  1. Dashboard (existing)
  2. Expense list (existing)
  3. **NEW:** Share sheet (iPad)
  4. Reports (existing)
  5. Settings (existing)

---

### 7. App Privacy Update
**Status:** ⏸️ To Be Updated

**Current:**
- Financial Info: Collected (not linked to user)
- Customer Support: Collected (linked to user)

**New (Add):**
- **User Content:** Collected
  - Data Type: Photos, Documents
  - Linked to User: No (if anonymous mode) / Yes (if user accounts)
  - Used for Tracking: No
  - Purpose: App Functionality

**Update Steps:**
1. App Store Connect → App → App Privacy
2. Click **Edit**
3. Add **User Content** data type
4. Select: Photos, Documents
5. Purpose: App Functionality
6. Linked to You: [Select based on auth mode]
7. Used for Tracking: No
8. Save

---

### 8. Version Release Notes (Internal)
**Version:** 1.1.0  
**Build:** 3  
**Release Date:** December 2, 2025 (Estimated)

**Changes:**
- ✅ Share Extension: Upload from any app
- ✅ Authentication: Email/password login
- ✅ Offline queue: Files upload automatically when online
- ✅ Background uploads: Uploads continue in background
- ✅ Enhanced error handling
- ✅ Performance improvements (upload <5s on Wi-Fi)

**Known Issues:**
- None (as of November 12, 2025)

**Testing:**
- ✅ QA passed all test cases
- ✅ UAT completed
- ✅ Security review approved

---

## 🔐 Entitlements Summary

### Main App (`com.siamoon.bookmate`)
```xml
<key>com.apple.security.application-groups</key>
<array>
    <string>group.com.siamoon.bookmate</string>
</array>

<key>aps-environment</key>
<string>production</string>
```

### Share Extension (`com.siamoon.bookmate.share`)
```xml
<key>com.apple.security.application-groups</key>
<array>
    <string>group.com.siamoon.bookmate</string>
</array>
```

---

## 📝 Checklist: Apple Developer Portal

### Before Starting Development
- [ ] Create App Group: `group.com.siamoon.bookmate`
- [ ] Create App ID: `com.siamoon.bookmate.share`
- [ ] Update Main App ID: Enable App Groups
- [ ] Generate new Main App provisioning profile
- [ ] Create Share Extension provisioning profile

### Before Submitting to App Store
- [ ] Verify all identifiers registered
- [ ] Verify provisioning profiles valid
- [ ] Test on device with production profiles
- [ ] Verify entitlements match profiles

---

## 📝 Checklist: App Store Connect

### Before Submission
- [ ] Create new version: 1.1.0
- [ ] Update "What's New" text
- [ ] Add keywords: "share"
- [ ] Update App Privacy: Add "User Content"
- [ ] Upload new screenshots (share sheet + extension)
- [ ] Review metadata for accuracy

### During Submission
- [ ] Upload build via EAS: `eas submit --platform ios`
- [ ] Select build 1.1.0 (3)
- [ ] Save for Manual Release (recommended)
- [ ] Submit for Review

### App Review Information
**Sign-in Required:** Yes (NEW in v1.1)

**Demo Account:**
- Username: `shaun@siamoon.com`
- Password: `Shaun231!`

**Notes for Reviewer:**
```
New in v1.1: Share Extension

HOW TO TEST SHARE EXTENSION:
1. Sign in with demo account
2. Open Photos app
3. Select any photo
4. Tap share button
5. Tap "BookMate" in share sheet
6. Tap "Send to BookMate"
7. Return to BookMate app
8. See photo in "Pending Uploads" screen

Thank you for reviewing BookMate!
```

---

## 🎯 Post-Approval Actions

### Day 1 (After Approval)
- [ ] Release v1.1.0 to App Store
- [ ] Monitor crash reports
- [ ] Monitor user reviews
- [ ] Check analytics: share extension usage

### Week 1
- [ ] Review metrics: Share extension adoption rate
- [ ] Collect user feedback
- [ ] Address any issues via 1.1.1 patch if needed

### Week 2
- [ ] Analyze upload success rate
- [ ] Review backend load (share extension traffic)
- [ ] Plan v1.2 enhancements based on data

---

## 📊 Success Metrics (Track Post-Launch)

| Metric                        | Target       | Data Source           |
|-------------------------------|--------------|----------------------|
| Share Extension Adoption      | 40%          | Firebase Analytics   |
| Share Extension Uploads       | 60% of total | Backend logs         |
| Upload Success Rate           | ≥99%         | Backend logs         |
| Average Upload Time (Wi-Fi)   | <5s          | Firebase Performance |
| User Reviews Mentioning Share | +10% positive| App Store Reviews    |

---

## 🔗 Quick Links

### Apple Developer Portal
- **Identifiers:** https://developer.apple.com/account/resources/identifiers/list
- **Profiles:** https://developer.apple.com/account/resources/profiles/list
- **Certificates:** https://developer.apple.com/account/resources/certificates/list

### App Store Connect
- **My Apps:** https://appstoreconnect.apple.com/apps
- **BookMate App:** https://appstoreconnect.apple.com/apps/6755171461
- **App Privacy:** https://appstoreconnect.apple.com/apps/6755171461/appstore/privacy

---

**Status:** ✅ App Store Items List Complete  
**Next:** Analytics and telemetry events  
**Review:** Pending iOS Lead approval

---

*Last Updated: November 12, 2025*  
*Document Owner: iOS Lead + Product Manager*
