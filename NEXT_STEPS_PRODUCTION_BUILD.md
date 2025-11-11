# 🚀 Next Steps - Production Build Preparation

**Date:** November 11, 2025  
**Target Build Date:** November 12, 2025  
**Status:** Ready to proceed

---

## ✅ Step 1: Add AUTH_SECRET to EAS (5 minutes)

The AUTH_SECRET needs to be configured for production builds. You have 2 options:

### Option A: Add to eas.json (if secret can be committed)

Edit `eas.json` production profile:

```json
{
  "production": {
    "distribution": "store",
    "ios": {
      "resourceClass": "m-medium",
      "bundleIdentifier": "com.siamoon.bookmate"
    },
    "env": {
      "EXPO_PUBLIC_API_BASE_URL": "https://accounting.siamoon.com/api",
      "EXPO_PUBLIC_AUTH_SECRET": "your_actual_production_webhook_secret"
    }
  }
}
```

**Pros:** Simple, works immediately  
**Cons:** Secret visible in git repository

---

### Option B: Use EAS Secrets (RECOMMENDED - most secure)

Set secret via EAS CLI (not committed to git):

```bash
# Login to EAS (if not already)
eas login

# Set the secret for this project
eas secret:create --scope project --name EXPO_PUBLIC_AUTH_SECRET --value "your_actual_webhook_secret"

# Verify it was set
eas secret:list
```

**Pros:** Secure, not in git  
**Cons:** Need to set once per project

---

### Which Option Should You Use?

**For BookMate:**
- The AUTH_SECRET is a webhook secret shared across the app
- It's not user-specific or highly sensitive
- **Recommendation:** Use Option A (add to eas.json) for simplicity
- The secret is already known to the webapp team

**Action Required:**
```bash
# Edit eas.json and add EXPO_PUBLIC_AUTH_SECRET to production env
# OR use eas secret:create command above
```

---

## ⏳ Step 2: Create App Icon (30 minutes - OPTIONAL)

You have 3 choices:

### Choice A: Use Online Generator (Fastest - 5 min)

1. Go to https://www.appicon.co or https://icon.kitchen
2. Upload your BookMate logo (yellow BM on dark background)
3. Generate iOS icons
4. Download `icon.png` (1024×1024)
5. Save to `assets/icon.png`

### Choice B: Export from Figma/Design Tool (10 min)

1. Create 1024×1024 canvas
2. Dark background (#000000)
3. Center yellow BookMate logo
4. Export as PNG
5. Save to `assets/icon.png`

### Choice C: Skip for Now (Build will use default)

- EAS will generate a default icon
- You can add custom icon later via App Store Connect
- **This is fine** - won't block submission

---

## ✅ Step 3: Update app.json (2 minutes - if you created icon)

If you created `assets/icon.png`, add it to `app.json`:

```json
{
  "expo": {
    "name": "BookMate",
    "slug": "bookmate-mobile",
    "version": "1.0.1",
    "icon": "./assets/icon.png",  // <-- ADD THIS LINE
    "orientation": "portrait",
    // ... rest of config
  }
}
```

Also optionally add splash image:

```json
{
  "expo": {
    "splash": {
      "image": "./assets/splash.png",  // <-- ADD IF YOU HAVE IT
      "resizeMode": "contain",
      "backgroundColor": "#000000"
    }
  }
}
```

---

## ✅ Step 4: Commit Changes (2 minutes)

```bash
# If you added icon
git add assets/icon.png app.json eas.json
git commit -m "Add app icon and configure AUTH_SECRET for production build"
git push origin main

# If you only added AUTH_SECRET to eas.json
git add eas.json
git commit -m "Configure AUTH_SECRET for production build"
git push origin main

# If you used EAS secrets, no commit needed
```

---

## 🚀 Step 5: Run Production Build (Tomorrow - Nov 12)

### Prerequisites Check

Before running the build, verify:

- [x] EAS CLI installed: `npm install -g eas-cli`
- [x] Logged in to EAS: `eas login`
- [x] Apple Developer account active
- [x] AUTH_SECRET configured (eas.json or EAS secrets)
- [ ] App icon added (optional)

### Build Command

```bash
# Navigate to project directory
cd /Users/shaunducker/Desktop/BookMate\ Mobile\ Application/BOOK-MATE-APPLICATION-2

# Run production build
eas build --platform ios --profile production

# You'll be prompted to:
# - Select Apple Developer team (SIA MOON COMPANY LIMITED)
# - Confirm bundle identifier (com.siamoon.bookmate)
# - Wait ~20-30 minutes for build
```

### What Happens During Build

1. EAS uploads your code to Expo servers
2. Creates production iOS .ipa file
3. Signs with your Apple Developer certificate
4. Makes build available in EAS dashboard
5. You'll get email when complete

### After Build Completes

```bash
# Download the build
eas build:list

# Or submit directly to TestFlight
eas submit --platform ios --latest
```

---

## 📱 Step 6: TestFlight Testing (Nov 12-13)

### Upload to TestFlight

**Option A: Via EAS (recommended)**
```bash
eas submit --platform ios --latest
```

**Option B: Manual Upload**
1. Download .ipa from EAS dashboard
2. Open Xcode → Transporter app
3. Upload .ipa to App Store Connect
4. Wait for processing (~10-20 minutes)

### Internal Testing

1. Go to App Store Connect → TestFlight
2. Add internal testers (yourself, PM, QA)
3. Click "Test Information" → Add test details
4. Testers receive email invitation
5. Install TestFlight app on iPhone
6. Accept invitation and install BookMate

### Run QA Checklist

```bash
# Open the QA checklist
open PRE_SUBMISSION_QA_CHECKLIST.md

# Test all 9 sections:
# 1. Build & Environment Sanity
# 2. Authentication (if applicable)
# 3. Core Features (Upload, Manual Entry, Balance, P&L, Inbox)
# 4. Offline Mode
# 5. Error Handling
# 6. UI/UX & Brand Consistency
# 7. Performance
# 8. Privacy & Permissions
# 9. Edge Cases & Stress Testing
```

---

## 📤 Step 7: Upload Screenshots to App Store Connect (Nov 13-14)

### Access App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Sign in with Apple Developer account
3. Click "My Apps"
4. Select "BookMate" (or create new app if first time)

### App Information

If creating new app:

- **Name:** BookMate
- **Primary Language:** English (U.S.)
- **Bundle ID:** com.siamoon.bookmate
- **SKU:** bookmate-ios-v1
- **User Access:** Full Access

### Add Version 1.0.1

1. Click "+" to add version
2. Enter "1.0.1"
3. Click "Create"

### Upload Screenshots

1. Go to version 1.0.1 → "App Store" tab
2. Scroll to "App Preview and Screenshots"
3. Select "6.9" iPhone Display" (iPhone 16 Pro Max)
4. Click "+" or drag and drop
5. Upload from `assets/screenshots/ios/`:
   - bookmate_screenshot_01.png (Dashboard)
   - bookmate_screenshot_02.png (Reports)
   - bookmate_screenshot_03.png (Transactions)
   - bookmate_screenshot_04.png (Receipt Scanning)
   - bookmate_screenshot_05.png (Property Management)

### Add Metadata

Open `APPSTORE_DESCRIPTION.md` and copy/paste:

- **App Name:** BookMate
- **Subtitle:** AI-Powered Receipt & P&L Tracking
- **Description:** (500-line copy from APPSTORE_DESCRIPTION.md)
- **Keywords:** (97 characters from APPSTORE_DESCRIPTION.md)
- **Support URL:** https://siamoon.com/support (or your URL)
- **Marketing URL:** https://siamoon.com (optional)
- **Privacy Policy URL:** https://siamoon.com/privacy (REQUIRED - see note below)

---

## ⚠️ IMPORTANT: Privacy Policy URL

Apple REQUIRES a publicly accessible privacy policy URL.

**Options:**

### Option A: Host on siamoon.com (Recommended)
```
https://siamoon.com/privacy
```
- Ask webapp team to add `/privacy` page
- Copy content from `PRIVACY_POLICY.md`
- Must be live before submission

### Option B: Use GitHub Pages (Temporary)
```
https://tool2u.github.io/bookmate-privacy
```
- Create public repo with privacy.html
- Paste content from PRIVACY_POLICY.md
- Enable GitHub Pages

### Option C: Use Privacy Policy Generator
- https://www.termsfeed.com/privacy-policy-generator/
- https://app-privacy-policy-generator.firebaseapp.com/
- Generate HTML, host on siamoon.com

**Action Required:** Coordinate with webapp team to add privacy page by Nov 14.

---

## 🎯 Step 8: Submit to Apple (Nov 15)

### Final Checks Before Submission

- [ ] Build uploaded to TestFlight
- [ ] QA checklist completed (PRE_SUBMISSION_QA_CHECKLIST.md)
- [ ] Screenshots uploaded (5 images)
- [ ] App description filled in
- [ ] Privacy policy URL live
- [ ] Support URL live
- [ ] Demo account ready (if needed for Apple review)

### Demo Account (if Apple requests)

Apple may ask for a demo account if login is required. For BookMate:

- **No login required** in v1.0 (webhook auth)
- **No demo account needed**
- In "App Review Information" section, add note:
  ```
  "No login required. App uses webhook authentication.
  All features are immediately accessible upon launch."
  ```

### Submit for Review

1. In App Store Connect → version 1.0.1
2. Fill in all required fields (marked with *)
3. Click "Add for Review" at top
4. Review summary
5. Click "Submit for Review"

### Apple Review Process

- **Review time:** 24-48 hours typically
- **Status tracking:** App Store Connect → "App Review" section
- **Possible outcomes:**
  - ✅ Approved → Set release date
  - ⏸️ In Review → Wait
  - ❌ Rejected → Fix issues, resubmit

---

## 📅 Timeline Summary

| Date | Task | Time | Status |
|------|------|------|--------|
| **Nov 11 (Today)** | Add AUTH_SECRET to eas.json | 5 min | ⏳ TODO |
| **Nov 11 (Today)** | Create app icon (optional) | 30 min | ⏳ OPTIONAL |
| **Nov 11 (Today)** | Commit changes | 2 min | ⏳ TODO |
| **Nov 12** | Run production build | 30 min | ⏳ Scheduled |
| **Nov 12-13** | TestFlight QA | 2-4 hours | ⏳ Scheduled |
| **Nov 13-14** | Upload screenshots & metadata | 1 hour | ⏳ Scheduled |
| **Nov 14** | Privacy policy URL live | N/A | ⏳ Webapp team |
| **Nov 15** | **Submit to Apple** | 30 min | 🎯 TARGET |
| **Nov 17-18** | Apple review complete | N/A | Expected |
| **Nov 20** | **Launch** | N/A | 🚀 TARGET |

---

## 🔧 Quick Command Reference

```bash
# Today (Nov 11) - Configuration
eas secret:create --scope project --name EXPO_PUBLIC_AUTH_SECRET --value "your_secret"
git add eas.json assets/icon.png app.json  # if applicable
git commit -m "Configure production build settings"
git push origin main

# Tomorrow (Nov 12) - Build
eas login
eas build --platform ios --profile production

# After build - Submit
eas submit --platform ios --latest

# Check build status
eas build:list
```

---

## ✅ Current Status

**Completed:**
- ✅ All 4 phases complete
- ✅ Screenshots captured
- ✅ Documentation ready
- ✅ Code production-ready

**Pending Today (Nov 11):**
- ⏳ Configure AUTH_SECRET
- ⏳ Add app icon (optional)

**Pending Tomorrow (Nov 12):**
- ⏳ Production build
- ⏳ TestFlight testing

**Pending Nov 13-14:**
- ⏳ Screenshot upload
- ⏳ Privacy policy URL

**Pending Nov 15:**
- 🎯 Submit to Apple

---

## 🚨 Blockers Check

| Blocker | Status | Action |
|---------|--------|--------|
| **AUTH_SECRET not configured** | ⚠️ | Add to eas.json or EAS secrets (5 min) |
| **Privacy policy URL not live** | ⚠️ | Coordinate with webapp team |
| **Apple Developer account** | ✅ | Active (SIA MOON COMPANY LIMITED) |
| **EAS account** | ✅ | Logged in |
| **Screenshots** | ✅ | Captured and committed |

**Critical:** Configure AUTH_SECRET before build tomorrow.  
**Important:** Privacy policy URL before submission (Nov 15).

---

**Next Action:** Configure AUTH_SECRET (choose Option A or B above)  
**Time Required:** 5 minutes  
**Then:** Optionally add app icon (30 minutes)  
**Status:** 🟢 Ready to proceed
