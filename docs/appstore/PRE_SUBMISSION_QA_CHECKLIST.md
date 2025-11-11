# BookMate Mobile - Final Pre-App Store QA & Verification

**Version:** 1.0.1 (Build 2)  
**Date:** __________  
**Tested By:** __________  
**Environment:** Production

---

## ⚠️ CRITICAL: Before You Start

- [ ] Webapp backend is live at https://accounting.siamoon.com/api
- [ ] Firebase project configured for production
- [ ] Apple Developer account (SIA MOON COMPANY LIMITED) active
- [ ] Phases 1-4 implementation complete
- [ ] Production build ready for testing

**If any above is incomplete, STOP and complete first.**

---

## 1️⃣ Build & Environment Sanity

### 1.1 Generate Release Build

**iOS:**
```bash
# Production build
eas build --platform ios --profile production

# Or TestFlight build
eas submit --platform ios
```

- [ ] Build completed successfully
- [ ] Build number: ________ (should be 2)
- [ ] Version: ________ (should be 1.0.1)

### 1.2 Install on Physical Device

- [ ] Downloaded .ipa from EAS dashboard
- [ ] Installed via TestFlight
- [ ] App icon shows correctly (yellow BookMate icon)
- [ ] App name shows: "BookMate" (not "BOOK-MATE-APPLICATION-2")

### 1.3 Environment Variables Check

**Open app and verify (check network calls in logs):**

- [ ] API Base URL: `https://accounting.siamoon.com/api` ✅
- [ ] NO dev endpoints (localhost, .dev, staging) ❌
- [ ] NO hard-coded test tokens visible ❌
- [ ] Firebase config present (check Firebase Console for events)

**How to verify:**
```bash
# Check build logs for env vars
eas build:list

# Or in app, add temporary debug screen (remove before submission):
import ENV from './src/config/environment';
console.log('API URL:', ENV.API_URL); // Should be production URL
```

**FAIL if:**
- Any localhost URL found
- Test API keys visible in logs
- Staging URLs present

### 1.4 App Launch Test

- [ ] App launches with splash screen (BookMate logo)
- [ ] No red error screen
- [ ] No runtime errors in console
- [ ] Splash → Dashboard transition smooth
- [ ] No infinite loading spinner

**Expected:** Splash (2s) → Dashboard with data OR Login screen

**FAIL if:**
- App crashes on launch
- Red error screen appears
- Stuck on splash screen >10 seconds

---

## 2️⃣ Authentication & Onboarding

**Note:** BookMate v1.0 uses webhook secret, not user auth. Skip this section if no login screen.

**If you have a demo/test mode or future login:**

### 2.1 Valid Credentials

- [ ] Enter demo account: `demo@bookmate.app` / `DemoBookMate2025!`
- [ ] Login successful
- [ ] Dashboard loads with data
- [ ] No errors in logs

### 2.2 Invalid Credentials

- [ ] Enter wrong password: `wrongpassword123`
- [ ] Shows friendly error: "Invalid email or password" ✅
- [ ] No crash ❌
- [ ] No raw error dump ❌

### 2.3 Session Persistence

- [ ] Close app completely (swipe up from task switcher)
- [ ] Re-open app
- [ ] Still logged in (no re-login required) ✅
- [ ] Dashboard loads data ✅

**OR** (if using webhook secret only):

- [ ] No login screen shown
- [ ] App opens directly to Dashboard
- [ ] Data loads immediately

### 2.4 Token Expiry (if applicable)

- [ ] Simulate expired token (wait 24h or manually expire)
- [ ] App logs out cleanly
- [ ] Shows login screen (or error message)
- [ ] No infinite loading loop

**FAIL if:**
- App crashes on wrong password
- Raw error message shown: "Error: 401 Unauthorized"
- Session doesn't persist after app restart

---

## 3️⃣ Data Accuracy vs WebApp (Source of Truth)

**CRITICAL:** Numbers must match production webapp exactly.

### 3.1 Setup

**On Laptop:**
1. Open webapp: https://accounting.siamoon.com (or production URL)
2. Login to same workspace as mobile app
3. Open: Dashboard, Balances, P&L, Transactions

**On iPhone:**
1. Open BookMate mobile app
2. Navigate to same screens

### 3.2 Balance Verification

**Webapp Balance:** ฿ __________  
**Mobile Balance:** ฿ __________

- [ ] Total balance matches ✅
- [ ] Difference: ฿ 0.00

**Per-Account Balances:**

| Account Name | Webapp (฿) | Mobile (฿) | Match? |
|--------------|------------|------------|--------|
| ____________ | __________ | __________ | ✅/❌ |
| ____________ | __________ | __________ | ✅/❌ |
| ____________ | __________ | __________ | ✅/❌ |
| ____________ | __________ | __________ | ✅/❌ |

**FAIL if:** Any account balance differs by >฿0.01

### 3.3 P&L Report Verification

**Select Period:** Month: __________ Year: __________

**Webapp P&L:**
- Revenue: ฿ __________
- Expenses: ฿ __________
- Net: ฿ __________

**Mobile P&L:**
- Revenue: ฿ __________
- Expenses: ฿ __________
- Net: ฿ __________

- [ ] Revenue matches ✅
- [ ] Expenses match ✅
- [ ] Net matches ✅

**FAIL if:** Any P&L number differs by >฿0.01

### 3.4 Property/Person Breakdown

**Select Property:** __________

**Webapp Breakdown:**
- Total Expenses: ฿ __________
- Percentage: __________%

**Mobile Breakdown:**
- Total Expenses: ฿ __________
- Percentage: __________%

- [ ] Property totals match ✅
- [ ] Percentages match ✅

### 3.5 Latest Transactions

**Compare last 10 transactions:**

| # | Webapp Amount | Mobile Amount | Match? |
|---|---------------|---------------|--------|
| 1 | ฿ ___________ | ฿ ___________ | ✅/❌ |
| 2 | ฿ ___________ | ฿ ___________ | ✅/❌ |
| 3 | ฿ ___________ | ฿ ___________ | ✅/❌ |
| 4 | ฿ ___________ | ฿ ___________ | ✅/❌ |
| 5 | ฿ ___________ | ฿ ___________ | ✅/❌ |

- [ ] All transaction amounts match ✅
- [ ] No missing transactions ✅
- [ ] No duplicated transactions ✅

### 3.6 Data Discrepancy Log

**If any numbers don't match, fill this out:**

| Screen | Expected (Webapp) | Actual (Mobile) | Difference |
|--------|-------------------|-----------------|------------|
| ________________ | ฿ ________ | ฿ ________ | ฿ ________ |
| ________________ | ฿ ________ | ฿ ________ | ฿ ________ |

**API Payload/Response (if discrepancy found):**
```
Request: GET /balance
Response: { ... paste full response ... }
```

**BLOCKER if:** Any core number (balance, P&L) differs by >฿1.00

---

## 4️⃣ API / Network Robustness

### 4.1 Slow Network Test

**On iPhone:**
1. Settings → Developer → Network Link Conditioner → Enable
2. Select "Very Bad Network" or "3G"
3. Open BookMate app
4. Navigate to Dashboard, P&L, Transactions

**Check:**
- [ ] Loading states show (spinner/skeleton/Lottie) ✅
- [ ] No frozen screens ❌
- [ ] Data eventually loads (within 30s) ✅
- [ ] No crash ❌

**FAIL if:**
- Screen freezes with no loading indicator
- App crashes on slow network
- Loading spinner spins forever (>60s)

### 4.2 Offline Test

**On iPhone:**
1. Enable Airplane Mode
2. Open BookMate app (or navigate to new screen)

**Check:**
- [ ] Shows clear message: "Unable to load. Please check your connection." ✅
- [ ] No crash ❌
- [ ] No infinite spinner ❌
- [ ] No raw error message ❌

**Then:**
1. Disable Airplane Mode
2. Pull to refresh (or tap Retry)
3. Data loads successfully ✅

**FAIL if:**
- App crashes in offline mode
- Shows technical error: "Network request failed"
- No way to retry after connection restored

### 4.3 API Error Simulation

**Simulate API errors (ask backend team to temporarily break endpoint or use proxy):**

**Test 1: 500 Internal Server Error**
- [ ] User sees: "Something went wrong. Please try again." ✅
- [ ] No stack trace visible ❌
- [ ] No crash ❌

**Test 2: 401 Unauthorized**
- [ ] User sees: "Session expired. Please log in again." ✅
- [ ] OR: Logs out cleanly ✅
- [ ] No crash ❌

**Test 3: 404 Not Found**
- [ ] User sees: "Data not found." ✅
- [ ] No crash ❌

**FAIL if:**
- Any error shows raw message: "Error: Cannot read property 'data' of undefined"
- Stack traces visible to user
- App crashes on any API error

### 4.4 Production API Verification

**Check all API calls use production URL:**

1. Open app
2. Check network logs (Xcode Console or React Native Debugger)
3. Verify all requests go to: `https://accounting.siamoon.com/api`

**List of endpoints to verify:**
- [ ] `GET /balance` → production URL ✅
- [ ] `GET /pl-data` → production URL ✅
- [ ] `POST /upload-receipt` → production URL ✅
- [ ] `POST /manual-entry` → production URL ✅
- [ ] `POST /transfer` → production URL ✅

**FAIL if:**
- ANY request goes to localhost, .dev, or staging URL

### 4.5 Promise Rejection Check

**In Xcode Console, search for:**
- "Unhandled promise rejection"
- "Possible Unhandled Promise Rejection"

- [ ] No unhandled rejections found ✅

**If found:**
```
File: __________
Line: __________
Error: __________
```

**BLOCKER if:** Unhandled promise rejections present

---

## 5️⃣ Reports, Exports & Sharing

### 5.1 Report Generation (if supported)

**From mobile app:**
1. Navigate to P&L Report screen
2. Select month/year
3. Generate report

- [ ] Report loads successfully ✅
- [ ] Data matches webapp (use Section 3 data) ✅
- [ ] No loading errors ❌

### 5.2 Share Link Test (if supported)

**From mobile app:**
1. Tap "Share Report" (if available)
2. Copy share link

**Expected format:**
```
https://accounting.siamoon.com/share/report/[token]
```

**Test on:**
1. **iOS Safari:**
   - [ ] Link opens ✅
   - [ ] Report displays correctly ✅
   - [ ] Numbers match mobile app ✅

2. **Desktop Browser (Chrome/Safari):**
   - [ ] Link opens ✅
   - [ ] Report displays correctly ✅
   - [ ] Numbers match mobile app ✅

### 5.3 Share Link Security

**Test expired link:**
1. Use link older than expiry period (if set)
2. Open in browser

- [ ] Shows: "Link expired" or "Access denied" ✅
- [ ] Does NOT show report data ❌

**Test without token:**
1. Remove token from URL: `https://accounting.siamoon.com/share/report/`
2. Open in browser

- [ ] Shows: 401 Unauthorized or "Invalid link" ✅
- [ ] Does NOT show any data ❌

**FAIL if:**
- Expired links still work
- Reports accessible without valid token

### 5.4 PDF/PNG Export (if supported)

**Generate PDF from mobile:**
1. Tap "Download PDF" (if available)
2. Open downloaded file

**Check:**
- [ ] PDF opens without errors ✅
- [ ] Full page visible (not cut off) ✅
- [ ] Numbers are sharp/readable ✅
- [ ] Branding (logo, colors) correct ✅
- [ ] Numbers match mobile app ✅

**FAIL if:**
- PDF is corrupted or won't open
- Numbers in PDF don't match app
- Logo/branding incorrect

---

## 6️⃣ UI/UX & Brand Consistency

### 6.1 App Name & Icon

- [ ] App name on home screen: "BookMate" ✅
- [ ] NOT: "BOOK-MATE-APPLICATION-2" or "Expo Go" ❌
- [ ] App icon: Yellow BookMate icon (1024×1024px) ✅
- [ ] NOT: Expo default or dev icon ❌
- [ ] Icon is sharp/crisp (not blurry) ✅

### 6.2 Splash Screen

- [ ] Shows BookMate logo ✅
- [ ] Brand colors: Yellow (#FFC107) + White ✅
- [ ] NO Expo branding ❌
- [ ] NO "Powered by Expo" text ❌
- [ ] Duration: 2-3 seconds (not too long) ✅

### 6.3 Brand Consistency

**Check colors match brand:**
- [ ] Primary: #FFC107 (yellow) ✅
- [ ] Background: White or light gray ✅
- [ ] Text: Dark gray or black ✅

**Check fonts:**
- [ ] Consistent font family throughout ✅
- [ ] Readable sizes (not too small) ✅

**Check spacing:**
- [ ] Consistent padding/margins ✅
- [ ] No elements touching screen edges ✅

### 6.4 Content Quality

**Scan all screens for:**
- [ ] NO "Lorem ipsum" or placeholder text ❌
- [ ] NO developer notes visible (e.g., "TODO: fix this") ❌
- [ ] NO technical jargon (e.g., "API Error 500") ❌
- [ ] All text is user-friendly and clear ✅

**Examples of good vs. bad:**
- ✅ "Unable to load data. Please try again."
- ❌ "Network request failed: ERR_NETWORK_TIMEOUT"

### 6.5 Device Compatibility

**Test on 3 device sizes:**

**Small: iPhone SE (4.7")**
- [ ] App opens and works ✅
- [ ] No clipped buttons ✅
- [ ] All text readable ✅
- [ ] Scroll works on long pages ✅

**Standard: iPhone 14/15 (6.1")**
- [ ] App opens and works ✅
- [ ] Layout looks good ✅
- [ ] All features accessible ✅

**Large: iPhone 14/15 Pro Max (6.7")**
- [ ] App opens and works ✅
- [ ] No excessive white space ✅
- [ ] Elements scale properly ✅

**FAIL if:**
- Buttons cut off on any device
- Text unreadable on small device
- Layout breaks on large device

---

## 7️⃣ Privacy, Security & Content

### 7.1 Test Data Check

**Search entire app for:**
- [ ] NO test emails visible (e.g., test@example.com) ❌
- [ ] NO test phone numbers (e.g., 555-1234) ❌
- [ ] NO API keys in UI ❌
- [ ] NO internal secrets visible ❌

**How to check:**
- Navigate through all screens
- Check settings/about pages
- Review any debug screens (should be removed!)

**FAIL if:**
- Any test data or secrets visible to user

### 7.2 External Links

**Test all external links:**

**Support URL:**
- [ ] Tap "Support" → Opens: https://bookmate.app/support ✅
- [ ] Page loads correctly ✅

**Privacy Policy:**
- [ ] Tap "Privacy Policy" → Opens: https://bookmate.app/privacy ✅
- [ ] Page loads correctly ✅

**Terms of Service (if present):**
- [ ] Tap "Terms" → Opens: https://bookmate.app/terms ✅
- [ ] Page loads correctly ✅

**FAIL if:**
- Any link goes to staging, localhost, or 404 page
- Links go to internal tools (Jira, Slack, etc.)

### 7.3 Data Collection Declaration

**Compare app behavior with App Store privacy labels:**

**App Store Connect says you collect:**
- [ ] Email addresses
- [ ] Financial information
- [ ] Photos (for receipt scanning)

**Verify in app:**
- [ ] App only collects what's declared ✅
- [ ] NO hidden data collection ❌

**Check logs for:**
- [ ] NO full credit card numbers logged ❌
- [ ] NO passwords in plain text ❌
- [ ] NO API keys in logs ❌

**BLOCKER if:**
- App collects data NOT declared in privacy labels
- Sensitive data logged in plain text

### 7.4 Content Compliance

**App Store Guidelines check:**
- [ ] NO gambling or betting features ✅
- [ ] NO adult content ✅
- [ ] NO hate speech or offensive content ✅
- [ ] Age rating appropriate (4+) ✅

---

## 8️⃣ Crashes, Logs & Analytics

### 8.1 Crashlytics/Sentry Setup

**Verify crash reporting works:**

1. **Add test crash button (temporarily):**
```typescript
// In a test screen
import firebase from './src/services/firebase';

<Button 
  title="TEST CRASH" 
  onPress={() => {
    firebase.logError(new Error('Test crash from QA'), 'QA Testing');
  }}
/>
```

2. Tap "TEST CRASH" button
3. Check Firebase Crashlytics dashboard (wait 5 minutes)

- [ ] Test crash appears in dashboard ✅
- [ ] Crash details visible (stack trace, device info) ✅

**REMOVE test crash button before submission!**

### 8.2 Analytics Verification

**Check Firebase Analytics:**
1. Use app normally (open screens, scan receipt, etc.)
2. Wait 5-10 minutes
3. Open Firebase Console → Analytics → DebugView (if enabled)

- [ ] Events appear: `app_open`, `screen_view` ✅
- [ ] Custom events work: `receipt_scanned`, `manual_entry` ✅

**OR** (if using DebugView):
```bash
# Enable debug mode
adb shell setprop debug.firebase.analytics.app com.siamoon.bookmate
# iOS: Edit scheme in Xcode, add -FIRDebugEnabled
```

### 8.3 Log Review

**Search production logs for sensitive data:**

**MUST NOT appear in logs:**
- [ ] NO API keys or tokens ❌
- [ ] NO webhook secrets ❌
- [ ] NO full credit card numbers ❌
- [ ] NO passwords ❌
- [ ] NO financial data in plain text ❌

**Acceptable in logs:**
- ✅ User IDs (non-sensitive)
- ✅ Transaction amounts (if already visible to user)
- ✅ Error messages (without stack traces)

**How to check:**
```bash
# View production logs
eas build:view --id [BUILD_ID]

# Or check Firebase Crashlytics logs
```

**BLOCKER if:**
- API keys, secrets, or passwords found in logs

---

## 9️⃣ App Store Submission Readiness

### 9.1 Final Assets Check

**App Icon:**
- [ ] 1024×1024px PNG ✅
- [ ] NO transparency ❌
- [ ] NO App Store badge imagery ❌
- [ ] Uploaded to App Store Connect ✅

**Screenshots:**
- [ ] iPhone 6.7" (1290×2796px): 5 screenshots ✅
- [ ] iPhone 5.5" (1242×2208px): 5 screenshots ✅
- [ ] Taken from production build ✅
- [ ] All uploaded to App Store Connect ✅

### 9.2 Metadata Verification

**App Store Connect → BookMate → App Information:**

- [ ] **App Name:** BookMate ✅
- [ ] **Subtitle:** Smart bookkeeping & reports (29 chars) ✅
- [ ] **Description:** Copy from APPSTORE_DESCRIPTION.md ✅
- [ ] **Keywords:** `bookkeeping,finance,P&L,receipts,accounting,property,business,automation,Thailand,expenses` ✅
- [ ] **Support URL:** https://bookmate.app/support ✅
- [ ] **Marketing URL:** https://bookmate.app ✅
- [ ] **Privacy Policy URL:** https://bookmate.app/privacy ✅

### 9.3 Version & Build Number

- [ ] **Version:** 1.0.1 ✅
- [ ] **Build Number:** 2 ✅
- [ ] Matches app.json ✅

### 9.4 Privacy & Compliance

**App Privacy:**
- [ ] Data collection declared: Email, Financial, Photos ✅
- [ ] Data encryption: YES ✅
- [ ] Data selling: NO ✅
- [ ] Third-party sharing: NO ✅

**Export Compliance:**
- [ ] Uses encryption: YES ✅
- [ ] Exempt (HTTPS only): YES ✅

**Age Rating:**
- [ ] Rated: 4+ ✅
- [ ] All mature content: NO ✅

---

## 🔚 Final Sign-Off

### QA Summary

**Testing Completed On:** __________  
**Device Used:** __________ (e.g., iPhone 14, iOS 17.5)  
**Build Tested:** 1.0.1 (Build 2)

### Checklist Status

| Section | Status | Notes |
|---------|--------|-------|
| 1. Build & Environment | ✅ PASS / ❌ FAIL | ____________ |
| 2. Authentication | ✅ PASS / ❌ FAIL | ____________ |
| 3. Data Accuracy | ✅ PASS / ❌ FAIL | ____________ |
| 4. Network Robustness | ✅ PASS / ❌ FAIL | ____________ |
| 5. Reports & Sharing | ✅ PASS / ❌ FAIL | ____________ |
| 6. UI/UX & Brand | ✅ PASS / ❌ FAIL | ____________ |
| 7. Privacy & Security | ✅ PASS / ❌ FAIL | ____________ |
| 8. Crashes & Analytics | ✅ PASS / ❌ FAIL | ____________ |
| 9. Submission Ready | ✅ PASS / ❌ FAIL | ____________ |

### Blocking Issues

**List any issues that MUST be fixed before submission:**

1. ____________________________________________________________
2. ____________________________________________________________
3. ____________________________________________________________

**Status:** 🟢 READY TO SUBMIT / 🟡 MINOR ISSUES / 🔴 BLOCKER

### Screenshots for Documentation

**Attach screenshots of:**
1. ✅ Dashboard with balances
2. ✅ P&L Report (matching webapp)
3. ✅ Receipt scan screen
4. ✅ Manual entry wizard
5. ✅ Offline error state
6. ✅ Loading state (skeleton/spinner)

**Save to:** `QA_SCREENSHOTS/` folder

### Example Share Link

**If applicable:**
```
https://accounting.siamoon.com/share/report/[token]
```

**Link tested on:**
- [ ] iOS Safari ✅
- [ ] Desktop Chrome ✅
- [ ] Link expires correctly ✅

---

## ✅ Internal Sign-Off Statement

**Copy this after all checks pass:**

```
Mobile app v1.0.1 (Build 2) - Validated against production backend 
on [DATE]. Data parity confirmed with webapp. All 9 sections PASS. 
No blocking bugs. Ready for App Store submission.

Tested by: __________
Approved by: __________
Date: __________
```

---

## 🚨 If Any Section FAILS

**DO NOT SUBMIT TO APP STORE.**

1. Document the failure in "Blocking Issues" above
2. Create GitHub issue with:
   - Section failed
   - Steps to reproduce
   - Expected vs. actual behavior
   - Screenshots
3. Fix the issue
4. Re-run this entire checklist
5. Get approval from PM/Lead
6. THEN submit to App Store

---

## 📋 Submission Workflow (After QA Pass)

1. [ ] All 9 sections PASS ✅
2. [ ] Internal sign-off received ✅
3. [ ] Build uploaded to App Store Connect ✅
4. [ ] Metadata complete ✅
5. [ ] Screenshots uploaded ✅
6. [ ] Privacy/compliance answered ✅
7. [ ] Submit for Review ✅
8. [ ] Status: "Waiting for Review" ✅
9. [ ] Team notified ✅

**Estimated Review Time:** 24-72 hours  
**Target Launch:** November 20, 2025

---

**Checklist Version:** 1.0  
**Created:** November 11, 2025  
**For:** BookMate iOS v1.0.1 (Build 2)  
**Last Updated:** November 11, 2025
