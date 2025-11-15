# 📸 iPad Screenshot Checklist — BookMate

**Device:** iPad Pro 13-inch (M4)  
**Resolution:** 2048×2732 (verified after capture)  
**Format:** PNG  
**Quality:** High (no compression)

---

## 🎯 5 Screenshots to Capture

### Screenshot #1: Dashboard / Home Screen
**Filename:** `BookMate_iPad_01_Dashboard.png`

**What to show:**
- Main dashboard when app opens
- Expense summary or overview
- Recent activity
- Clean, professional layout

**How:**
1. Open BookMate on iPad
2. Navigate to home/dashboard screen
3. Press **⌘+S** (Command + S)
4. Screenshot saved to `~/Desktop/`

**Status:** [ ] Not captured yet

---

### Screenshot #2: Expense List / Transactions
**Filename:** `BookMate_iPad_02_ExpenseList.png`

**What to show:**
- List of expenses/receipts
- Multiple entries with details
- Categories, amounts, dates visible
- Scrollable list with good data

**How:**
1. Navigate to expenses or receipts list
2. Ensure sample data is visible
3. Press **⌘+S**

**Status:** [ ] Not captured yet

---

### Screenshot #3: Add Receipt / Upload Screen
**Filename:** `BookMate_iPad_03_AddReceipt.png`

**What to show:**
- Screen for adding new receipt/expense
- Upload button or camera option
- Form fields (category, amount, date, notes)
- User-friendly input UI

**How:**
1. Tap "Add Receipt" or "+" button
2. Show empty form or upload screen
3. Press **⌘+S**

**Status:** [ ] Not captured yet

---

### Screenshot #4: Reports / Analytics
**Filename:** `BookMate_iPad_04_Reports.png`

**What to show:**
- Expense reports or charts
- Visual data (graphs, pie charts)
- Date filters or time periods
- Professional analytics view

**How:**
1. Navigate to reports/analytics tab
2. Show meaningful data visualization
3. Press **⌘+S**

**Status:** [ ] Not captured yet

---

### Screenshot #5: Settings / Profile
**Filename:** `BookMate_iPad_05_Settings.png`

**What to show:**
- App settings menu
- User preferences
- Account options
- Professional settings layout

**How:**
1. Navigate to settings screen
2. Show clean settings menu
3. Press **⌘+S**

**Status:** [ ] Not captured yet

---

## ✅ After Capture: Verification Steps

### Step 1: Count Files
```bash
ls -1 ~/Desktop/Simulator*.png | wc -l
# Should output: 5
```

**Status:** [ ] Verified 5 files exist

---

### Step 2: Check Dimensions
```bash
for img in ~/Desktop/Simulator*.png; do
  echo "Checking: $(basename "$img")"
  sips -g pixelWidth -g pixelHeight "$img"
  echo "---"
done
```

**Expected output for EACH:**
```
pixelWidth: 2048
pixelHeight: 2732
```

**Status:** [ ] All screenshots verified at 2048×2732

---

### Step 3: Rename Files
```bash
cd ~/Desktop

# Rename one by one (adjust timestamps as needed)
mv "Simulator Screen Shot - iPad Pro (13-inch) (M4) - 2025-11-13 at 14.23.45.png" "BookMate_iPad_01_Dashboard.png"

mv "Simulator Screen Shot - iPad Pro (13-inch) (M4) - 2025-11-13 at 14.25.12.png" "BookMate_iPad_02_ExpenseList.png"

mv "Simulator Screen Shot - iPad Pro (13-inch) (M4) - 2025-11-13 at 14.26.33.png" "BookMate_iPad_03_AddReceipt.png"

mv "Simulator Screen Shot - iPad Pro (13-inch) (M4) - 2025-11-13 at 14.27.54.png" "BookMate_iPad_04_Reports.png"

mv "Simulator Screen Shot - iPad Pro (13-inch) (M4) - 2025-11-13 at 14.29.15.png" "BookMate_iPad_05_Settings.png"
```

**Status:** [ ] All files renamed

---

### Step 4: Final Verification
```bash
# List all renamed screenshots
ls -lh ~/Desktop/BookMate_iPad_*.png

# Verify dimensions one more time
sips -g pixelWidth -g pixelHeight ~/Desktop/BookMate_iPad_*.png
```

**Status:** [ ] Final check complete

---

### Step 5: Visual Quality Check
```bash
# Open all screenshots in Preview
open ~/Desktop/BookMate_iPad_*.png
```

**Check for:**
- [ ] No loading spinners visible
- [ ] No error messages shown
- [ ] Text is readable
- [ ] UI looks professional
- [ ] Different screens (not duplicates)
- [ ] High quality (no pixelation)

**Status:** [ ] Quality approved

---

### Step 6: Backup to Project (Optional)
```bash
# Create folder
mkdir -p "/Users/shaunducker/Desktop/BookMate Mobile Application/BOOK-MATE-APPLICATION-2/app-store-screenshots/ipad"

# Copy screenshots
cp ~/Desktop/BookMate_iPad_*.png "/Users/shaunducker/Desktop/BookMate Mobile Application/BOOK-MATE-APPLICATION-2/app-store-screenshots/ipad/"

# Verify
ls -la "/Users/shaunducker/Desktop/BookMate Mobile Application/BOOK-MATE-APPLICATION-2/app-store-screenshots/ipad/"
```

**Status:** [ ] Backed up to project

---

## 🎯 Quick Reference: Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Take screenshot | **⌘+S** (Command + S) |
| Home button | **⌘+Shift+H** |
| Rotate device | **⌘+Left/Right Arrow** |
| Physical Size view | **⌘+1** |
| Fit Screen | **⌘+2** |

---

## ⚠️ Common Issues

### Issue: Screenshots saved at wrong size
**Solution:** 
- Simulator must be set to "Physical Size" (⌘+1)
- Not zoomed to fit screen
- Must be iPad Pro 13-inch, not 11-inch

---

### Issue: App looks stretched/broken on iPad
**Solution:**
- This is the crash bug Apple reported
- We need to fix this before screenshots
- See APP_STORE_REJECTION_REPORT.md for fix

---

### Issue: Can't find screenshots on Desktop
**Solution:**
```bash
# Screenshots saved to:
ls -la ~/Desktop/Simulator*.png

# Or search for them:
find ~/Desktop -name "Simulator*.png" -mtime -1
```

---

## 📤 Upload Instructions (Tomorrow - Nov 14)

**After all screenshots verified:**

1. Login to **App Store Connect**: https://appstoreconnect.apple.com
2. Go to **My Apps** → **BookMate** → **1.0.1**
3. Click **App Store** tab
4. Scroll to **"iPad Pro (12.9-inch) (3rd generation)"** section
5. Click **"Media Manager"** or screenshots section
6. **Delete all old iPad screenshots** (the stretched ones)
7. Click **"+"** to add new screenshots
8. **Upload all 5 files:**
   - BookMate_iPad_01_Dashboard.png
   - BookMate_iPad_02_ExpenseList.png
   - BookMate_iPad_03_AddReceipt.png
   - BookMate_iPad_04_Reports.png
   - BookMate_iPad_05_Settings.png
9. **Save changes**
10. Verify screenshots appear correctly in preview

---

## ✅ Success Criteria

**Screenshots are ready when:**
- ✅ 5 PNG files created
- ✅ All are 2048×2732 pixels
- ✅ All show different screens
- ✅ All are native iPad captures (not resized)
- ✅ All look professional (no errors)
- ✅ Files renamed descriptively
- ✅ Quality verified visually

**Estimated Time:** 20-30 minutes (once app is installed)

---

**Next Step:** Wait for app to build and install on iPad simulator (~5-10 min remaining)

---

*Checklist Created: November 13, 2025*  
*Status: Waiting for app installation to complete*
