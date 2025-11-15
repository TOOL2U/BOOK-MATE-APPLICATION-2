# 🧪 Immediate Testing Action Plan

**Date:** November 14, 2025  
**Status:** 🟢 CREDENTIALS RECEIVED - READY TO TEST

---

## 🔐 Test Credentials Received

### Account 1: Sia Moon Company Limited ✅
```
Email:    shaun@siamoon.com
Password: Alesiamay231!
Account ID: acc_sia_moon_001
```

### Account 2: Alesia House Company Ltd ✅
```
Email:    maria@siamoon.com
Password: Alesiamay231!
Account ID: acc_alesia_house_001
```

---

## ✅ Webapp Team Confirmations

- ✅ **POST /api/auth/login** - LIVE and tested
- ✅ **POST /api/auth/logout-session** - LIVE and tested
- ✅ **All data endpoints** - Accept JWT, filter by accountId
- ✅ **JWT expiry** - Confirmed 7 days
- ✅ **Rate limiting** - 429 includes `resetAt` timestamp
- ✅ **Multi-tenant isolation** - Verified working
- ⚠️ **Signup endpoint** - NOT available (admin-only for v1.1)

---

## 🚀 Immediate Actions (Next 30 Minutes)

### Step 1: Start Expo Development Server ✅

```bash
cd /Users/shaunducker/Desktop/BookMate\ Mobile\ Application/BOOK-MATE-APPLICATION-2
npx expo start
```

### Step 2: Test Login Flow (5 minutes)

**Test Case 1.1: Valid Login - User A**
- [ ] Open app on simulator
- [ ] Enter: `shaun@siamoon.com` / `Alesiamaya231`
- [ ] Tap LOGIN button
- [ ] Expected: Navigate to Balance screen
- [ ] Verify company name: "Sia Moon Company Limited"

**Test Case 1.2: Invalid Login**
- [ ] Logout (if logged in)
- [ ] Enter: `wrong@email.com` / `wrongpassword`
- [ ] Tap LOGIN
- [ ] Expected: Error message "Invalid email or password"

**Test Case 1.3: Empty Fields**
- [ ] Clear both fields
- [ ] Tap LOGIN
- [ ] Expected: Validation error

### Step 3: Test Session Persistence (5 minutes)

**Test Case 2.1: App Restart**
- [ ] Login as `shaun@siamoon.com`
- [ ] Navigate to Balance screen
- [ ] Force quit app (Cmd+Q or swipe up)
- [ ] Reopen app
- [ ] Expected: Still logged in, no LoginScreen shown

**Test Case 2.2: Session Data Intact**
- [ ] After restart, go to Settings tab
- [ ] Verify profile shows:
  - Name: Shaun Ducker
  - Email: shaun@siamoon.com
  - Company: Sia Moon Company Limited
  - Account ID: acc_sia_moon_001

### Step 4: Test Multi-Tenant Isolation (10 minutes)

**Test Case 3.1: User A Data**
- [ ] Login: `shaun@siamoon.com` / `Alesiamaya231`
- [ ] Go to Balance screen
- [ ] Note down:
  - Company name: _______________
  - First balance amount: _______________
- [ ] Go to P&L screen
- [ ] Note down first expense: _______________

**Test Case 3.2: Logout and Switch**
- [ ] Go to Settings → Tap LOGOUT
- [ ] Confirm logout dialog
- [ ] Expected: Return to LoginScreen

**Test Case 3.3: User B Data**
- [ ] Login: `maria@siamoon.com` / `Alesiamaya231`
- [ ] Go to Balance screen
- [ ] Verify DIFFERENT company name
- [ ] Verify DIFFERENT balance amounts
- [ ] Expected: "Alesia House Company Ltd" (not "Sia Moon")

**Test Case 3.4: No Cross-Contamination**
- [ ] Check all tabs (Manual, Upload, Balance, P&L, Activity)
- [ ] Verify NO "Sia Moon" data visible anywhere
- [ ] Confirm accountId in Settings: acc_alesia_house_001

### Step 5: Test Settings Screen (5 minutes)

**Test Case 4.1: Profile Display**
- [ ] Login as any user
- [ ] Go to Settings tab
- [ ] Verify visible:
  - Square LogoBM avatar with yellow border
  - User name (Aileron-Bold)
  - User email (Aileron-Regular)
  - Company name with building icon
  - Account ID with ID icon
  - App version: "1.1.0 (Multi-Tenant)"
  - API endpoint: "accounting.siamoon.com"

**Test Case 4.2: Logout Button**
- [ ] Tap "LOGOUT" button (red)
- [ ] Verify confirmation dialog appears
- [ ] Tap "Cancel" → Dialog closes, stay on Settings
- [ ] Tap "LOGOUT" again → Tap "Logout" in dialog
- [ ] Expected: Return to LoginScreen

### Step 6: Test Error Handling (5 minutes)

**Test Case 5.1: Network Error**
- [ ] Logout if logged in
- [ ] Turn on Airplane Mode (Mac: Control Center)
- [ ] Try to login
- [ ] Expected: "Network error" message
- [ ] Turn off Airplane Mode
- [ ] Login should work now

**Test Case 5.2: API Error Handling**
- [ ] Login successfully
- [ ] Turn on Airplane Mode
- [ ] Try to refresh Balance screen
- [ ] Expected: Error message displayed
- [ ] Turn off Airplane Mode
- [ ] Refresh → Data loads

---

## 📋 Test Results Template

### Test Run #1 - [Date/Time]

**Environment:**
- Device: iOS Simulator / Physical iPhone
- iOS Version: ___
- App Version: 1.1.0
- Tester: ___

**Results:**

| Test Case | Status | Notes |
|-----------|--------|-------|
| 1.1 Valid Login (User A) | ⬜ Pass / ❌ Fail | |
| 1.2 Invalid Login | ⬜ Pass / ❌ Fail | |
| 1.3 Empty Fields | ⬜ Pass / ❌ Fail | |
| 2.1 App Restart | ⬜ Pass / ❌ Fail | |
| 2.2 Session Data | ⬜ Pass / ❌ Fail | |
| 3.1 User A Data | ⬜ Pass / ❌ Fail | |
| 3.2 Logout | ⬜ Pass / ❌ Fail | |
| 3.3 User B Data | ⬜ Pass / ❌ Fail | |
| 3.4 Isolation | ⬜ Pass / ❌ Fail | |
| 4.1 Profile Display | ⬜ Pass / ❌ Fail | |
| 4.2 Logout Button | ⬜ Pass / ❌ Fail | |
| 5.1 Network Error | ⬜ Pass / ❌ Fail | |
| 5.2 API Error | ⬜ Pass / ❌ Fail | |

**Overall Status:** ⬜ All Pass / ⚠️ Minor Issues / ❌ Major Issues

**Issues Found:**
1. 
2. 
3. 

---

## 🐛 Issue Tracking

### Critical Issues 🔴
(Blockers - must fix before production)

- [ ] None found

### High Priority Issues 🟡
(Important - should fix before production)

- [ ] None found

### Medium Priority Issues 🟢
(Nice to have - can fix post-launch)

- [ ] None found

### Low Priority Issues ⚪
(Cosmetic - backlog)

- [ ] None found

---

## ✅ Sign-Off Checklist

Before proceeding to production build:

- [ ] All 13 test cases passed
- [ ] Multi-tenant isolation verified
- [ ] No critical or high-priority issues
- [ ] Settings screen displays correctly
- [ ] Logout flow works properly
- [ ] Session persistence confirmed
- [ ] Network error handling works
- [ ] Brand compliance verified
- [ ] No compilation errors
- [ ] Code reviewed
- [ ] Documentation updated

---

## 🚀 Next Steps After Testing

### If All Tests Pass ✅

1. **Update Version** (5 minutes)
   ```bash
   # Update app.json
   "version": "1.1.0"
   "ios": { "buildNumber": "3" }
   ```

2. **Commit Changes** (5 minutes)
   ```bash
   git add .
   git commit -m "feat: multi-tenant authentication system v1.1.0"
   git push origin feature/ios-share-extension-planning
   ```

3. **Production Build** (30 minutes)
   ```bash
   eas build --platform ios --profile production
   ```

4. **TestFlight** (1 hour)
   - Upload build to App Store Connect
   - Add to TestFlight
   - Send to 2-3 beta testers
   - Get approval

5. **App Store Submission** (2 hours)
   - Update screenshots (add Settings screen)
   - Update description (consumer-focused)
   - Update "What's New"
   - Submit for review

### If Issues Found ❌

1. **Document Issues**
   - Use template above
   - Include screenshots
   - Note exact steps to reproduce

2. **Prioritize Fixes**
   - Critical: Fix immediately
   - High: Fix before production
   - Medium/Low: Backlog

3. **Fix and Re-test**
   - Make fixes
   - Run full test suite again
   - Verify fixes don't break other features

4. **Contact Webapp Team**
   - If server-side issue found
   - Email: shaun@siamoon.com
   - Include error messages and screenshots

---

## 📞 Support Contacts

**Webapp Team:**
- Email: shaun@siamoon.com
- Hours: 9 AM - 6 PM GMT+7

**Issue Reporting:**
- GitHub: https://github.com/TOOL2U/BookMate/issues
- Format: See MOBILE_TEAM_RESPONSE.md section "How to Report Issues"

---

**START TESTING NOW!** 🚀

Run: `npx expo start`
