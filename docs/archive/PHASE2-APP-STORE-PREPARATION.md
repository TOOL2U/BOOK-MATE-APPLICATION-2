# Phase 2: App Store Launch Preparation
**BookMate Mobile Application**  
**Start Date:** November 11, 2025  
**Target Submission:** November 15, 2025  
**Status:** 🚀 IN PROGRESS

---

## Executive Summary

Phase 2 transforms the **tech-ready build** from Phase 1 into an **App Store submission-ready** application. This includes proper provisioning, code signing, TestFlight builds, store metadata preparation, and comprehensive QA on real devices.

### Current Status: Infrastructure Ready ✅
- ✅ Bundle identifiers configured: `com.siamoon.bookmate`
- ✅ EAS build profiles configured
- ✅ Version: 1.0.0, Build: 1
- ✅ Production API: `https://accounting.siamoon.com/api`
- ⏳ Waiting for Apple Developer account approval
- ⏳ Store metadata preparation needed
- ⏳ App icon and screenshots needed

---

## Phase 2 Checklist

### 1️⃣ App Identifier & Bundle Setup ✅

**Status:** COMPLETE

**Configuration Verified:**
```json
{
  "expo": {
    "name": "BookMate",
    "slug": "bookmate-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "ios": {
      "bundleIdentifier": "com.siamoon.bookmate",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.siamoon.bookmate",
      "versionCode": 1
    }
  }
}
```

**Permissions Configured:**
- ✅ Camera access (receipt scanning)
- ✅ Photo library access (receipt upload)
- ✅ Proper permission descriptions in `infoPlist`

**Deliverable:** ✅ `app.json` committed with final identifiers

---

### 2️⃣ Provisioning Profiles & Certificates (Apple Side)

**Status:** WAITING FOR APPLE DEVELOPER ACCOUNT

**Prerequisites:**
1. **Apple Developer Account** - Sia Moon Company Ltd
   - Cost: $99/year
   - Apply at: https://developer.apple.com/programs/enroll/
   - Approval time: 1-2 business days

**Once Account is Approved:**

#### Step 1: Add Team Members
1. Go to **App Store Connect** → **Users and Access**
2. Add all engineers as **Developer** role
3. Grant **Admin** or **App Manager** access as needed

#### Step 2: Create App ID
1. Go to **Certificates, Identifiers & Profiles**
2. Click **Identifiers** → **+** (Add)
3. Select **App IDs** → **App**
4. Configure:
   - **Description:** BookMate iOS
   - **Bundle ID:** `com.siamoon.bookmate` (Explicit)
   - **Capabilities:** 
     - ✅ Push Notifications (if needed later)
     - ✅ Associated Domains (if deep linking)

#### Step 3: Configure EAS Credentials
```bash
# Login to EAS
eas login

# Configure credentials (automatic)
eas build:configure

# Let Expo manage certificates (recommended)
# Select: "Let Expo handle the process"
```

**OR Manual Certificate Setup:**
```bash
# Configure credentials manually
eas credentials

# Select: iOS → Production
# Choose: "Set up new Apple Provisioning Profile"
# Follow prompts to generate certificates
```

**Deliverable:** ✅ Successful run of `eas build --profile production --platform ios` without credential errors

---

### 3️⃣ EAS Build Profiles and Secrets ✅

**Status:** CONFIGURED

**Updated `eas.json`:**
```json
{
  "build": {
    "production": {
      "distribution": "store",          // ← Added for App Store
      "ios": {
        "resourceClass": "m-medium",
        "bundleIdentifier": "com.siamoon.bookmate"
      },
      "android": {
        "resourceClass": "medium",
        "buildType": "app-bundle",
        "gradleCommand": ":app:bundleRelease"
      },
      "env": {
        "EXPO_PUBLIC_API_BASE_URL": "https://accounting.siamoon.com/api"
      }
    }
  }
}
```

**Environment Variables (Already Set):**
- ✅ `EXPO_PUBLIC_API_BASE_URL` - Production API endpoint
- ⏳ `EXPO_PUBLIC_AUTH_SECRET` - Add via EAS Secrets (if not public)

**Add Secrets (if needed):**
```bash
# Store sensitive values in EAS
eas secret:create --scope project --name EXPO_PUBLIC_AUTH_SECRET --value "your-secret-here"

# For Sentry (if implemented)
eas secret:create --scope project --name SENTRY_DSN --value "your-sentry-dsn"

# For Firebase (if implemented)
eas secret:create --scope project --name FIREBASE_CONFIG --value "{...}"
```

**Test Build Locally:**
```bash
# Run production build (once credentials are set up)
eas build --profile production --platform ios

# Expected output:
# ✓ Build credentials set up
# ✓ Archive built successfully
# ✓ .ipa uploaded to EAS servers
```

**Deliverable:** ✅ Successful `.ipa` build uploaded to Expo/App Store Connect

---

### 4️⃣ TestFlight Preparation & Internal Testing

**Status:** READY TO START (pending Apple account)

#### Step 1: Create App in App Store Connect
1. Go to **App Store Connect** → **My Apps** → **+**
2. Select **New App**
3. Configure:
   - **Platform:** iOS
   - **Name:** BookMate
   - **Primary Language:** English (U.S.)
   - **Bundle ID:** Select `com.siamoon.bookmate`
   - **SKU:** `bookmate-ios-v1`
   - **User Access:** Full Access

#### Step 2: Upload Build from EAS
Option A - **Automatic via EAS Submit:**
```bash
eas submit --profile production --platform ios
```

Option B - **Manual via Transporter:**
1. Download `.ipa` from EAS dashboard
2. Open **Transporter** app (macOS)
3. Drag and drop `.ipa` file
4. Wait for upload and processing

#### Step 3: Enable TestFlight
1. In App Store Connect → **BookMate** → **TestFlight**
2. Wait for build to finish processing (5-10 minutes)
3. Complete **Export Compliance** questionnaire:
   - Does your app use encryption? **YES**
   - Is it exempt from export compliance? **YES** (HTTPS only)

#### Step 4: Add Internal Testers
1. Click **App Store Connect Users** (internal testers)
2. Add team members:
   - Engineers (all developers)
   - QA team
   - Project manager
   - Stakeholders
3. They'll receive TestFlight invite via email

#### Step 5: Testing Checklist
Each tester must verify:
- [ ] App installs successfully
- [ ] Login/authentication works
- [ ] Dashboard loads with real data
- [ ] Balance screen displays correctly
- [ ] P&L reports load
- [ ] Upload receipt flow works (camera + photo library)
- [ ] Manual entry wizard works
- [ ] Transfer modal works
- [ ] Offline mode handles gracefully
- [ ] No crashes on critical flows

**Deliverable:** ✅ TestFlight build downloadable by internal testers with stable functionality

---

### 5️⃣ App Store Metadata & Compliance Prep

**Status:** IN PROGRESS (see APPSTORE_METADATA.md)

#### Required Text Content

**App Name:** BookMate  
**Subtitle:** Automated financial insights for property owners & businesses  
**Promotional Text:** (Optional, can be updated anytime)

**Description:**
```
BookMate automates your bookkeeping with AI-powered receipt scanning and real-time financial insights.

KEY FEATURES:
• AI Receipt Scanning - Snap a photo, extract data instantly
• Real-Time Dashboard - See your financial health at a glance
• Automated P&L Reports - Monthly and yearly profit & loss tracking
• Balance Overview - Monitor all bank accounts in one place
• Property & Person Expense Tracking - Categorize by property or individual
• Offline Support - Queue transactions when offline, sync when online
• Secure & Private - All data encrypted with HTTPS

DESIGNED FOR:
• Property managers tracking rental income and expenses
• Small business owners managing multiple properties
• Finance teams needing automated bookkeeping
• Anyone tired of manual receipt entry

POWERED BY SIA MOON:
BookMate is built by Sia Moon Company Limited, bringing enterprise-grade financial automation to your mobile device.

Download BookMate today and transform how you manage your finances!
```

**Keywords:** (100 chars max)
```
bookkeeping,finance,P&L,accounting,receipts,automation,property,business,Thailand,Sia Moon
```

**Support URL:**  
`https://bookmate.app/support` (or `https://siamoon.com/support`)

**Privacy Policy URL:**  
`https://bookmate.app/privacy` (REQUIRED - see below)

**Marketing URL:**  
`https://bookmate.app` (optional)

#### Required Visual Assets

**App Icon:**
- Size: 1024 × 1024 px
- Format: PNG (no transparency)
- No rounded corners (Apple adds them automatically)
- Current status: ⏳ NEEDED FROM DESIGN TEAM

**iPhone Screenshots (REQUIRED):**
- **6.7" Display** (iPhone 14 Pro Max): 1290 × 2796 px
  - Required: 3-8 screenshots
  - Recommended: 5 screenshots
- **6.5" Display** (iPhone 11 Pro Max): 1242 × 2688 px
  - Required: 3-8 screenshots

**Recommended Screenshots:**
1. Dashboard with balance overview
2. P&L monthly report
3. Receipt scanning flow
4. Manual entry wizard
5. Balance detail screen

**iPad Screenshots (Optional):**
- 12.9" iPad Pro: 2048 × 2732 px
- Skip for v1.0 if not iPad-optimized

**Preview Videos (Optional):**
- 15-30 seconds
- Portrait orientation
- Show key features in action

**Deliverable:** ✅ APPSTORE_METADATA.md with final text + links to assets

---

### 6️⃣ Compliance & Privacy Checks

**Status:** NEEDS COMPLETION

#### Privacy Policy Requirements

**CRITICAL:** Apple requires a publicly accessible Privacy Policy URL.

**Quick Solution - Create Privacy Page:**
Create a simple HTML page at `https://bookmate.app/privacy` (or host on GitHub Pages):

**Privacy Policy Template:**
```markdown
# Privacy Policy for BookMate

Last updated: November 11, 2025

## Overview
BookMate ("we", "our", "us") is operated by Sia Moon Company Limited. We are committed to protecting your privacy.

## Data We Collect
- **Email Address:** For account authentication
- **Financial Data:** Transaction amounts, descriptions, categories (stored securely)
- **Photos:** Receipt images (processed and stored securely)
- **Device Information:** For crash reporting and analytics

## How We Use Your Data
- Provide bookkeeping and financial reporting services
- Improve app functionality and user experience
- Send important account notifications

## Data Security
- All data transmitted via HTTPS encryption
- Data stored on secure servers
- No data sold to third parties

## Your Rights
- Access your data anytime
- Request data deletion
- Export your data

## Third-Party Services
- API Server: Sia Moon accounting backend
- Analytics: None (currently)
- Crash Reporting: None (currently)

## Contact Us
For privacy concerns, contact: support@siamoon.com

## Changes to This Policy
We may update this policy. Check this page for the latest version.
```

#### App Store Data Usage Declaration

**In App Store Connect → App Privacy:**

**Data Types Collected:**
1. **Contact Info**
   - Email address: ✅ YES
   - Used for: Account functionality
   - Linked to user: YES
   - Used for tracking: NO

2. **Financial Info**
   - Financial Info: ✅ YES
   - Used for: App functionality
   - Linked to user: YES
   - Used for tracking: NO

3. **User Content**
   - Photos or Videos: ✅ YES
   - Used for: App functionality (receipt scanning)
   - Linked to user: YES
   - Used for tracking: NO

**Data Not Collected:**
- ❌ Location
- ❌ Contacts
- ❌ Health & Fitness
- ❌ Browsing History
- ❌ Sensitive Info

#### Third-Party SDKs Declaration

**Current SDKs in app.json:**
- `expo-camera` - Camera access for receipts
- `expo-image-picker` - Photo library access
- `expo-asset` - Asset loading

**Future SDKs (if implemented):**
- Sentry - Crash reporting (add to privacy policy)
- Firebase Analytics - Usage analytics (add to privacy policy)

**Deliverable:** ✅ "Data Safety Summary" document with answers to Apple's data collection questions

---

### 7️⃣ Pre-Launch QA Checklist

**Status:** READY TO START (pending TestFlight build)

#### Device Testing Requirements

**Minimum Test Devices:**
- [ ] iPhone 14 Pro Max (6.7" - latest)
- [ ] iPhone 13 (6.1" - mid-range)
- [ ] iPhone SE 3rd gen (4.7" - small screen)
- [ ] iPad (if claiming iPad support)

**iOS Version Testing:**
- [ ] iOS 17.x (latest)
- [ ] iOS 16.x (previous major version)

#### Critical Flow Testing

**Authentication:**
- [ ] First launch experience
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Token refresh works
- [ ] Logout works

**Dashboard:**
- [ ] Balance overview loads
- [ ] Data displays correctly
- [ ] Pull-to-refresh works
- [ ] Loading states show properly
- [ ] Error states handled

**P&L Screen:**
- [ ] Monthly report loads
- [ ] Yearly report loads
- [ ] Toggle between views works
- [ ] Charts render correctly
- [ ] Expand/collapse categories work

**Upload Flow:**
- [ ] Camera opens successfully
- [ ] Take photo and process
- [ ] Choose from photo library
- [ ] OCR extracts text
- [ ] AI populates fields
- [ ] Submit transaction success

**Manual Entry:**
- [ ] Wizard opens correctly
- [ ] All 3 steps work
- [ ] Defaults set (Family, Bank Transfer - Krung Thai)
- [ ] Keyboard dismissal works
- [ ] Submit creates transaction
- [ ] Navigate to Activity screen
- [ ] Highlight animation shows

**Offline Mode:**
- [ ] Enable airplane mode
- [ ] Try to submit transaction
- [ ] Transaction queued successfully
- [ ] Re-enable network
- [ ] Queued transaction syncs
- [ ] Confirmation shown

**Edge Cases:**
- [ ] Rapid navigation between tabs
- [ ] Background/foreground transitions
- [ ] Low memory scenarios
- [ ] Network timeouts handled
- [ ] 401 unauthorized handled
- [ ] 500 server errors handled

#### Build Verification

**App Information:**
- [ ] App name displays as "BookMate"
- [ ] App icon shows correctly (no default Expo icon)
- [ ] Splash screen shows correctly
- [ ] Version: 1.0.0
- [ ] Build number: 1

**Performance:**
- [ ] App launches in < 3 seconds
- [ ] Screens transition smoothly
- [ ] No memory leaks
- [ ] No battery drain issues
- [ ] No excessive network calls

**Sentry/Crashlytics (if enabled):**
- [ ] Test crash reporting works
- [ ] Error events logged
- [ ] Stack traces captured

**Deliverable:** ✅ QA Report listing devices tested and results (see PHASE2-QA-REPORT.md)

---

### 8️⃣ Submit for App Store Review

**Status:** NOT STARTED (pending all above steps)

#### Submission Checklist

**Before Submission:**
- [ ] TestFlight testing complete (all critical flows pass)
- [ ] All metadata prepared
- [ ] All screenshots uploaded
- [ ] Privacy Policy URL live and accessible
- [ ] Support URL live and accessible
- [ ] App icon finalized (1024x1024)
- [ ] No placeholder text in metadata
- [ ] Build number matches App Store Connect

#### Submission Steps

**Step 1: Complete App Information**
1. Go to **App Store Connect** → **BookMate** → **App Information**
2. Fill in:
   - Category: **Finance** (primary)
   - Secondary Category: **Business** (optional)
   - Content Rights: "Does not contain third-party content"

**Step 2: Pricing and Availability**
1. Go to **Pricing and Availability**
2. Set:
   - Price: **Free**
   - Availability: **All countries** (or select specific)
   - Pre-orders: NO

**Step 3: Prepare for Submission**
1. Go to **iOS App** → **1.0 Prepare for Submission**
2. Upload screenshots (all required sizes)
3. Fill in description, keywords, support URL, privacy URL
4. Select build from TestFlight
5. Fill in **App Review Information**:
   - Contact: Your email
   - Phone: Your phone number
   - Demo account (if login required):
     - Username: demo@bookmate.app
     - Password: DemoPassword123
   - Notes: "Internal bookkeeping tool for Sia Moon Company Ltd. Login required."

**Step 4: Age Rating**
1. Complete age rating questionnaire
2. Expected rating: **4+** (no mature content)

**Step 5: Submit**
1. Review all information
2. Click **Add for Review**
3. Click **Submit to App Review**
4. Status changes to **Waiting for Review**

#### Review Timeline
- **Typical review time:** 24-72 hours
- **Complex apps:** Up to 7 days
- **Rejections:** Address issues and resubmit

#### Common Rejection Reasons (Avoid These)
- ❌ Missing Privacy Policy
- ❌ Crashes on launch
- ❌ Broken core functionality
- ❌ Misleading screenshots
- ❌ Demo account doesn't work
- ❌ Requires payment without IAP
- ❌ Uses private APIs

**Deliverable:** ✅ Build status = "Waiting for Review"

---

## Timeline

### Day 1 (Today - Nov 11)
- ✅ Configure EAS for App Store distribution
- ✅ Create Phase 2 documentation
- ⏳ Create APPSTORE_METADATA.md
- ⏳ Create privacy policy page
- ⏳ Request app icon from design team
- ⏳ Request screenshots from design team

### Day 2 (Nov 12)
- ⏳ Complete Apple Developer enrollment (if not done)
- ⏳ Add team members to App Store Connect
- ⏳ Create App ID in Apple Developer Portal
- ⏳ Run first EAS production build
- ⏳ Upload to TestFlight

### Day 3 (Nov 13)
- ⏳ Internal TestFlight testing
- ⏳ QA on multiple devices
- ⏳ Fix any critical bugs found
- ⏳ Finalize all metadata and assets

### Day 4 (Nov 14)
- ⏳ Complete privacy policy
- ⏳ Upload all screenshots
- ⏳ Fill in all App Store metadata
- ⏳ Final QA pass

### Day 5 (Nov 15)
- ⏳ Submit for App Store Review
- ⏳ Status: "Waiting for Review"

### Day 6-8 (Nov 16-18)
- ⏳ Apple review in progress
- ⏳ Address any rejection notes (if needed)

### Day 9-10 (Nov 19-20)
- 🎉 **App approved and live on App Store**

---

## Risk Mitigation

### Risk 1: Apple Developer Account Delay
**Impact:** HIGH  
**Mitigation:**
- Apply for account immediately if not done
- Escalate with Apple if delayed beyond 2 days
- Have company documents ready (D-U-N-S number, business verification)

### Risk 2: App Rejection
**Impact:** MEDIUM  
**Mitigation:**
- Thorough TestFlight testing before submission
- Clear demo account credentials
- Complete privacy policy
- Professional screenshots and metadata

### Risk 3: Missing Visual Assets
**Impact:** MEDIUM  
**Mitigation:**
- Request from design team TODAY
- Have backup plan (use screenshots from running app)
- Use Figma/Sketch mockups if needed

### Risk 4: Build Errors
**Impact:** MEDIUM  
**Mitigation:**
- Test EAS build early (preview profile first)
- Fix any signing/provisioning issues before production build
- Have fallback: manual Xcode build if EAS fails

---

## Success Criteria

### Phase 2 Complete When:
1. ✅ iOS build signed and uploaded to App Store Connect
2. ✅ TestFlight distribution working with internal testers
3. ✅ All metadata, legal URLs, and privacy details complete
4. ✅ QA passed on real devices (iPhone + iPad if applicable)
5. ✅ App submitted for review under Sia Moon Company Limited
6. ✅ Build status = "Waiting for Review"

---

## Next Steps (Immediate Actions)

### For Engineering Team:
1. Review this document thoroughly
2. Ensure Apple Developer account is active
3. Run `eas build --profile production --platform ios` once credentials are set
4. Test TestFlight build on real devices
5. Document any issues in PHASE2-ISSUES.md

### For Design Team:
1. Provide app icon (1024x1024 PNG)
2. Provide 5 screenshots for iPhone 6.7" display
3. Provide 5 screenshots for iPhone 6.5" display
4. Optional: Create app preview video

### For Marketing Team:
1. Review app description in APPSTORE_METADATA.md
2. Finalize keywords
3. Create privacy policy page
4. Create support page

### For Project Manager:
1. Coordinate Apple Developer account setup
2. Monitor timeline and milestones
3. Escalate blockers immediately
4. Prepare for App Store launch announcement

---

## Resources

### Apple Documentation
- **App Store Connect:** https://appstoreconnect.apple.com
- **Developer Portal:** https://developer.apple.com/account
- **App Store Review Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **TestFlight:** https://developer.apple.com/testflight/

### EAS Documentation
- **EAS Build:** https://docs.expo.dev/build/introduction/
- **EAS Submit:** https://docs.expo.dev/submit/introduction/
- **Credentials:** https://docs.expo.dev/app-signing/app-credentials/

### Tools
- **Transporter:** https://apps.apple.com/app/transporter/id1450874784
- **TestFlight (iOS):** https://apps.apple.com/app/testflight/id899247664
- **App Store Connect (iOS):** https://apps.apple.com/app/app-store-connect/id1234793120

---

**Last Updated:** November 11, 2025  
**Phase Status:** 🚀 IN PROGRESS  
**Target Submission:** November 15, 2025
