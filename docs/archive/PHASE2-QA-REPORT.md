# Phase 2 QA Report - BookMate
**Version:** 1.0.0  
**Build:** 1  
**Test Date:** [To be filled during testing]  
**Tester:** [Tester Name]

---

## Test Environment

### Build Information
- **App Version:** 1.0.0
- **Build Number:** 1
- **Platform:** iOS / Android
- **Build Type:** TestFlight / Production
- **Build Date:** [Date]
- **EAS Build ID:** [Build ID from EAS]

### Test Devices

| Device | iOS Version | Screen Size | Status |
|--------|-------------|-------------|--------|
| iPhone 14 Pro Max | 17.x | 6.7" | ⏳ Not Tested |
| iPhone 13 | 16.x | 6.1" | ⏳ Not Tested |
| iPhone SE 3rd gen | 17.x | 4.7" | ⏳ Not Tested |
| iPad Air | 17.x | 10.9" | ⏳ Optional |

---

## Critical Flow Testing

### 1. Installation & First Launch

| Test Case | Expected Result | Actual Result | Pass/Fail |
|-----------|----------------|---------------|-----------|
| Install from TestFlight | App installs without errors | | ⏳ |
| First launch | Splash screen shows BookMate logo | | ⏳ |
| Permissions prompt | Camera & photos permissions requested | | ⏳ |
| Initial load | Login/auth screen appears | | ⏳ |

**Notes:**
```
[Add any observations here]
```

---

### 2. Authentication

| Test Case | Expected Result | Actual Result | Pass/Fail |
|-----------|----------------|---------------|-----------|
| Login - valid credentials | Successfully logs in, navigates to dashboard | | ⏳ |
| Login - invalid email | Shows error message | | ⏳ |
| Login - invalid password | Shows error message | | ⏳ |
| Token persistence | Remains logged in after app restart | | ⏳ |
| Logout | Clears session, returns to login | | ⏳ |

**Test Credentials:**
- Email: demo@bookmate.app
- Password: DemoBookMate2025!

**Notes:**
```
[Add any observations here]
```

---

### 3. Dashboard Screen

| Test Case | Expected Result | Actual Result | Pass/Fail |
|-----------|----------------|---------------|-----------|
| Initial load | Shows balance overview with data | | ⏳ |
| Balance cards | Display all accounts with amounts | | ⏳ |
| Pull to refresh | Reloads data from API | | ⏳ |
| Loading state | Shows loading indicator during fetch | | ⏳ |
| Error state | Handles network errors gracefully | | ⏳ |
| Navigation | Tapping balance opens detail view | | ⏳ |

**Notes:**
```
[Add any observations here]
```

---

### 4. P&L Screen

| Test Case | Expected Result | Actual Result | Pass/Fail |
|-----------|----------------|---------------|-----------|
| Monthly view | Shows current month P&L data | | ⏳ |
| Yearly view | Shows year-to-date P&L data | | ⏳ |
| Toggle month/year | Switches between views smoothly | | ⏳ |
| Overhead expenses | Displays categories with amounts | | ⏳ |
| Property/Person | Shows expense breakdown by property/person | | ⏳ |
| Expand/collapse | Category details expand correctly | | ⏳ |
| Charts render | Visual charts display correctly | | ⏳ |

**Notes:**
```
[Add any observations here]
```

---

### 5. Upload Screen (Receipt Scanning)

| Test Case | Expected Result | Actual Result | Pass/Fail |
|-----------|----------------|---------------|-----------|
| Open camera | Camera opens successfully | | ⏳ |
| Camera permission | Permission granted (or prompt shown) | | ⏳ |
| Take photo | Captures receipt image | | ⏳ |
| OCR processing | Extracts text from receipt | | ⏳ |
| AI extraction | Populates amount, date, merchant fields | | ⏳ |
| Choose from library | Photo picker opens | | ⏳ |
| Photo library permission | Permission granted (or prompt shown) | | ⏳ |
| Select existing photo | Processes selected image | | ⏳ |
| Submit transaction | Creates transaction successfully | | ⏳ |
| Error handling | Shows error if OCR fails | | ⏳ |

**Test Receipts:**
- [ ] Receipt with clear text (English)
- [ ] Receipt with Thai text
- [ ] Receipt with poor quality
- [ ] Receipt at angle

**Notes:**
```
[Add any observations here]
```

---

### 6. Manual Entry (Activity Screen)

| Test Case | Expected Result | Actual Result | Pass/Fail |
|-----------|----------------|---------------|-----------|
| Open wizard | Taps "+" button, wizard modal opens | | ⏳ |
| Step 1: Property & Type | Family property pre-selected | | ⏳ |
| Step 1: Validation | Cannot proceed without selections | | ⏳ |
| Step 2: Payment | Bank Transfer - Krung Thai pre-selected | | ⏳ |
| Step 3: Details | Description field auto-focused | | ⏳ |
| Step 3: Amount | Numeric keyboard shows | | ⏳ |
| Keyboard dismissal | Tap outside closes keyboard | | ⏳ |
| Submit | Creates transaction | | ⏳ |
| Navigate to Activity | Redirects to Activity tab | | ⏳ |
| Highlight animation | New transaction highlights with yellow glow | | ⏳ |

**Notes:**
```
[Add any observations here]
```

---

### 7. Transfer Modal

| Test Case | Expected Result | Actual Result | Pass/Fail |
|-----------|----------------|---------------|-----------|
| Open transfer modal | Modal opens from appropriate screen | | ⏳ |
| From account selection | Dropdown lists all accounts | | ⏳ |
| To account selection | Dropdown lists all accounts | | ⏳ |
| Amount input | Numeric keyboard, accepts decimals | | ⏳ |
| Description input | Text field works correctly | | ⏳ |
| Validation | Cannot transfer to same account | | ⏳ |
| Submit | Creates two transactions (dual-entry) | | ⏳ |
| Balance update | Both accounts reflect transfer | | ⏳ |

**Notes:**
```
[Add any observations here]
```

---

### 8. Offline Mode

| Test Case | Expected Result | Actual Result | Pass/Fail |
|-----------|----------------|---------------|-----------|
| Enable airplane mode | Device offline | | ⏳ |
| Submit transaction | Transaction queued locally | | ⏳ |
| Queue indicator | Shows "queued" or pending status | | ⏳ |
| Re-enable network | Connection restored | | ⏳ |
| Auto-sync | Queued transaction syncs automatically | | ⏳ |
| Confirmation | Success message shown | | ⏳ |
| Data consistency | Transaction appears in list | | ⏳ |

**Notes:**
```
[Add any observations here]
```

---

### 9. Navigation & UI

| Test Case | Expected Result | Actual Result | Pass/Fail |
|-----------|----------------|---------------|-----------|
| Tab navigation | All 4 tabs work (Dashboard, Activity, Upload, P&L) | | ⏳ |
| Tab icons | Icons display correctly | | ⏳ |
| Tab animations | Smooth transitions between tabs | | ⏳ |
| Back navigation | Back button works correctly | | ⏳ |
| Modal close | Modals close properly | | ⏳ |
| Rapid tab switching | No crashes or UI glitches | | ⏳ |

**Notes:**
```
[Add any observations here]
```

---

### 10. Performance

| Test Case | Expected Result | Actual Result | Pass/Fail |
|-----------|----------------|---------------|-----------|
| App launch time | < 3 seconds from tap to usable | | ⏳ |
| Screen transitions | Smooth, no jank | | ⏳ |
| API response time | Data loads in < 2 seconds | | ⏳ |
| Memory usage | No memory warnings or crashes | | ⏳ |
| Battery impact | No excessive battery drain | | ⏳ |
| Network efficiency | No excessive API calls | | ⏳ |

**Performance Metrics:**
- Launch time: ___ seconds
- Dashboard load: ___ seconds
- P&L load: ___ seconds
- Memory usage: ___ MB

**Notes:**
```
[Add any observations here]
```

---

## Build Verification

### App Information

| Item | Expected | Actual | Pass/Fail |
|------|----------|--------|-----------|
| App name | BookMate | | ⏳ |
| App icon | Custom BookMate icon (not Expo default) | | ⏳ |
| Splash screen | BookMate splash | | ⏳ |
| Version | 1.0.0 | | ⏳ |
| Build number | 1 | | ⏳ |
| Bundle ID | com.siamoon.bookmate | | ⏳ |

**Notes:**
```
[Add any observations here]
```

---

## Edge Cases & Error Handling

### Network Errors

| Test Case | Expected Result | Actual Result | Pass/Fail |
|-----------|----------------|---------------|-----------|
| No internet on launch | Shows friendly error message | | ⏳ |
| Network timeout | Shows retry option | | ⏳ |
| 401 Unauthorized | Redirects to login | | ⏳ |
| 500 Server Error | Shows error message, allows retry | | ⏳ |
| Slow connection | Shows loading indicator | | ⏳ |

**Notes:**
```
[Add any observations here]
```

---

### App Lifecycle

| Test Case | Expected Result | Actual Result | Pass/Fail |
|-----------|----------------|---------------|-----------|
| Background app | App suspends correctly | | ⏳ |
| Resume from background | App resumes, refreshes data | | ⏳ |
| Force quit & relaunch | App restarts cleanly | | ⏳ |
| Low memory warning | App handles gracefully (no crash) | | ⏳ |
| Incoming phone call | App pauses, resumes after call | | ⏳ |

**Notes:**
```
[Add any observations here]
```

---

### Input Validation

| Test Case | Expected Result | Actual Result | Pass/Fail |
|-----------|----------------|---------------|-----------|
| Negative amounts | Rejected or handled correctly | | ⏳ |
| Very large amounts | Handles without overflow | | ⏳ |
| Empty fields | Shows validation error | | ⏳ |
| Special characters | Handles or sanitizes correctly | | ⏳ |
| Emoji input | Handles or rejects gracefully | | ⏳ |

**Notes:**
```
[Add any observations here]
```

---

## Accessibility

| Test Case | Expected Result | Actual Result | Pass/Fail |
|-----------|----------------|---------------|-----------|
| VoiceOver support | Basic navigation works | | ⏳ |
| Dynamic text size | UI adapts to larger text | | ⏳ |
| Color contrast | Readable in dark mode | | ⏳ |
| Touch targets | Buttons minimum 44x44 pts | | ⏳ |

**Notes:**
```
[Add any observations here]
```

---

## Security

| Test Case | Expected Result | Actual Result | Pass/Fail |
|-----------|----------------|---------------|-----------|
| HTTPS only | All API calls use HTTPS | | ⏳ |
| Secure token storage | Token not visible in logs | | ⏳ |
| Session timeout | Expires after inactivity (if implemented) | | ⏳ |
| Screenshot blocking | Sensitive data not in screenshot (optional) | | ⏳ |

**Notes:**
```
[Add any observations here]
```

---

## Crash Reporting (if enabled)

| Test Case | Expected Result | Actual Result | Pass/Fail |
|-----------|----------------|---------------|-----------|
| Force crash (test) | Crash reported to Sentry/Firebase | | ⏳ |
| Error stack trace | Full stack trace captured | | ⏳ |
| User context | User ID/email associated (if applicable) | | ⏳ |

**Notes:**
```
[Add any observations here]
```

---

## Bugs Found

### High Priority (Blockers)
```
1. [Bug description]
   - Steps to reproduce:
   - Expected:
   - Actual:
   - Device:
   - Screenshot/video:

2. [Next bug...]
```

### Medium Priority
```
1. [Bug description]
   - Details...
```

### Low Priority (Nice to Fix)
```
1. [Bug description]
   - Details...
```

---

## Overall Assessment

### Summary Statistics
- **Total Test Cases:** [Auto-calculated]
- **Passed:** ___
- **Failed:** ___
- **Skipped:** ___
- **Pass Rate:** ___%

### Recommendation

**Status:** ☐ READY FOR SUBMISSION | ☐ NEEDS FIXES | ☐ MAJOR ISSUES

**Justification:**
```
[Explain the decision here]
```

### Critical Issues to Fix Before Submission
```
1. [Issue]
2. [Issue]
3. [Issue]
```

### Non-Critical Issues (Can Fix in v1.1)
```
1. [Issue]
2. [Issue]
```

---

## Sign-Off

**Tester Name:** ___________________  
**Date:** ___________________  
**Signature:** ___________________

**Reviewed By (Engineering Lead):** ___________________  
**Date:** ___________________

**Approved By (Project Manager):** ___________________  
**Date:** ___________________

---

## Appendix: Test Data

### Demo Account
- Email: demo@bookmate.app
- Password: DemoBookMate2025!

### Expected Data (Demo Account)
- Bank accounts: [List expected accounts]
- Transaction count: ~XX transactions
- Balance total: ~฿XXX,XXX

### Test Receipt Images
- Location: [Path to test images]
- Files: receipt1.jpg, receipt2.jpg, etc.

---

**QA Report Version:** 1.0  
**Template Last Updated:** November 11, 2025
