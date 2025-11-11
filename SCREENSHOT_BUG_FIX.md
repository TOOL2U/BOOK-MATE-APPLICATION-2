# 🔧 Screenshot Capture Scripts - Bug Fix Applied

**Date:** November 11, 2025  
**Issue:** UUID extraction regex was incorrect  
**Fix:** Updated to proper UUID pattern matching  
**Status:** ✅ FIXED and tested

---

## 🐛 Bug Report

### Issue
The automated screenshot script was failing with error:
```
Invalid device or device pair: P
```

### Root Cause
Incorrect regex pattern in UUID extraction:
```bash
# BROKEN (old):
grep -o "\([A-Z0-9\-]*\)" 

# FIXED (new):
grep -E -o '[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}'
```

### Files Fixed
- `capture-screenshots-auto.sh` (line 28)
- `capture-screenshots.sh` (line 16)

### Commit
- **Hash:** a04d0be
- **Message:** "Fix UUID extraction in screenshot capture scripts"

---

## ✅ Verification

### Before Fix:
```bash
SIMULATOR_ID=$(... | grep -o "\([A-Z0-9\-]*\)")
# Result: "P" ❌ (wrong!)
```

### After Fix:
```bash
SIMULATOR_ID=$(... | grep -E -o '[A-F0-9]{8}-...')
# Result: "09C9C9D1-3200-4514-BC14-76104733A0F8" ✅ (correct!)
```

---

## 🚀 How to Use Now

### Option 1: Automated Capture (Requires Interaction)

```bash
./capture-screenshots-auto.sh
```

**What happens:**
1. ✅ Boots iPhone 16 Pro Max simulator (UUID now extracted correctly)
2. ✅ Opens Simulator app
3. ✅ Waits for you to press ENTER to start
4. ✅ Guides you to navigate to each screen (15 seconds between captures)
5. ✅ Captures 5 screenshots automatically
6. ✅ Saves to `assets/screenshots/ios/`

**Note:** This script runs in interactive mode and will wait for your input.

---

### Option 2: Manual Step-by-Step (Simpler)

Since the automated script requires interaction, here's a simpler manual approach:

#### Step 1: Start the simulator with the app
```bash
npx expo start --ios
```
Wait for app to fully load.

#### Step 2: Use the interactive capture script
```bash
./capture-screenshots.sh
```

This script:
- ✅ Detects the booted simulator (UUID now works!)
- ✅ Waits for you to navigate to each screen
- ✅ Prompts "Press ENTER to capture"
- ✅ Captures screenshot when you press ENTER
- ✅ Allows skipping with 'skip' command

---

### Option 3: Fully Manual (Most Control)

```bash
# 1. Make sure app is running in simulator
npx expo start --ios

# 2. Navigate to each screen manually

# 3. Capture each screenshot from terminal:
xcrun simctl io booted screenshot assets/screenshots/ios/bookmate_screenshot_01.png
xcrun simctl io booted screenshot assets/screenshots/ios/bookmate_screenshot_02.png
xcrun simctl io booted screenshot assets/screenshots/ios/bookmate_screenshot_03.png
xcrun simctl io booted screenshot assets/screenshots/ios/bookmate_screenshot_04.png
xcrun simctl io booted screenshot assets/screenshots/ios/bookmate_screenshot_05.png
```

---

## 📸 Screenshot Checklist

Navigate to and capture:

- [ ] **Screenshot 1:** Dashboard (Balance cards, quick actions)
- [ ] **Screenshot 2:** Reports tab (P&L chart, AI insights)  
- [ ] **Screenshot 3:** Transactions tab (Transaction list)
- [ ] **Screenshot 4:** Upload screen (Camera/scan interface)
- [ ] **Screenshot 5:** Property modal (Allocations, transfers)

---

## 🔍 Verify Captures

```bash
# Check if screenshots were created
ls -lh assets/screenshots/ios/*.png

# View screenshots
open assets/screenshots/ios/
```

Should see 5 PNG files:
- `bookmate_screenshot_01.png` (1320×2868 or similar)
- `bookmate_screenshot_02.png`
- `bookmate_screenshot_03.png`
- `bookmate_screenshot_04.png`
- `bookmate_screenshot_05.png`

---

## 📦 After Capture

```bash
# Commit screenshots
git add assets/screenshots/ios/*.png
git commit -m "Add App Store screenshots for iOS v1.0.1"
git push origin main

# Then upload to App Store Connect
# See: assets/screenshots/ios/README.md for upload instructions
```

---

## 🎯 Status

| Item | Status |
|------|--------|
| **Script Bug** | ✅ Fixed (commit a04d0be) |
| **UUID Extraction** | ✅ Working correctly |
| **Automated Script** | ✅ Functional (interactive mode) |
| **Manual Script** | ✅ Functional |
| **Ready to Capture** | ✅ YES |

---

## 📝 Recommendation

**Best approach for quick capture:**

1. **Start app in simulator:**
   ```bash
   npx expo start --ios
   ```

2. **Use interactive script:**
   ```bash
   ./capture-screenshots.sh
   ```

3. **Navigate and capture:**
   - Navigate to Dashboard → Press ENTER
   - Navigate to Reports → Press ENTER
   - Navigate to Transactions → Press ENTER
   - Navigate to Upload → Press ENTER
   - Navigate to Property modal → Press ENTER

4. **Verify and commit:**
   ```bash
   open assets/screenshots/ios/
   git add assets/screenshots/ios/*.png
   git commit -m "Add App Store screenshots"
   git push
   ```

**Total time:** 10-15 minutes

---

**Fix Applied:** ✅ Complete  
**Scripts Working:** ✅ Yes  
**Ready to Capture:** ✅ Now
