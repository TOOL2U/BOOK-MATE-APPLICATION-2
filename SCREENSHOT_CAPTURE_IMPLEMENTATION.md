# 📸 Screenshot Capture Implementation Guide

**Status:** ✅ Tools Ready  
**Date:** November 11, 2025  
**Target:** Capture 5 App Store screenshots for BookMate iOS v1.0.1

---

## 🎯 Quick Start

### Option 1: Automated Capture (Recommended)

```bash
# Run the automated screenshot tool
./capture-screenshots-auto.sh
```

This script will:
1. ✅ Boot iPhone 16 Pro Max simulator automatically
2. ✅ Open Simulator app
3. ✅ Guide you through manual navigation with 15-second intervals
4. ✅ Capture all 5 screenshots automatically
5. ✅ Verify resolution and file sizes
6. ✅ Save to `assets/screenshots/ios/`

### Option 2: Manual Interactive Capture

```bash
# Run the interactive screenshot tool
./capture-screenshots.sh
```

This script:
1. ✅ Detects currently running simulator
2. ✅ Prompts you to navigate to each screen
3. ✅ Captures on ENTER key press
4. ✅ Allows skipping screenshots

---

## 📋 Required Screenshots

Navigate to these 5 screens in order:

| # | Screen | Navigation Path | Key Elements |
|---|--------|-----------------|--------------|
| **1** | Dashboard Overview | Launch app → Home | Balance cards, quick actions, property summary |
| **2** | Reports & Analytics | Dashboard → Reports tab | P&L chart, AI insights, date selector |
| **3** | Transaction List | Dashboard → Transactions | Recent entries, sync status, search |
| **4** | Receipt Scanning | Dashboard → Upload → Camera | Scan interface or upload screen |
| **5** | Property Management | Dashboard → Property selector | Allocations, transfers, balances |

---

## 🔧 Technical Details

### Screenshot Specifications

- **Resolution:** Automatically captured at device native resolution
- **Device:** iPhone 16 Pro Max (1320×2868 or 1290×2796)
- **Format:** PNG (required by Apple)
- **Output:** `assets/screenshots/ios/bookmate_screenshot_01.png` → `05.png`

### Apple Requirements Met

✅ **Native resolution** from actual device simulator  
✅ **PNG format** with RGB color space  
✅ **Actual app UI** (not mockups)  
✅ **Clean data** (no test/placeholder text)  
✅ **Sequential naming** for easy upload

---

## 🚀 Step-by-Step Process

### Step 1: Prepare the App

```bash
# Make sure app is running in simulator
# If not already running:
npx expo start --ios
```

Wait for the app to fully load in the simulator.

### Step 2: Run Screenshot Tool

```bash
# Use automated tool (recommended)
./capture-screenshots-auto.sh

# OR use manual tool
./capture-screenshots.sh
```

### Step 3: Navigate Through Screens

Follow the on-screen prompts:
- **15 seconds** between each screenshot to navigate
- Navigate to the specified screen
- Let UI settle before capture
- Script captures automatically at intervals

### Step 4: Verify Captures

```bash
# Open the screenshots folder
open assets/screenshots/ios/

# Check the files
ls -lh assets/screenshots/ios/*.png
```

Verify:
- ✅ All 5 screenshots present
- ✅ Correct screens captured
- ✅ No UI glitches or loading states
- ✅ Professional appearance
- ✅ File sizes reasonable (< 8MB each)

### Step 5: Commit to Repository

```bash
# Add screenshots to git
git add assets/screenshots/ios/*.png

# Commit with descriptive message
git commit -m "Add App Store screenshots for iOS v1.0.1 - Dashboard, Reports, Transactions, Scanning, Properties"

# Push to repository
git push origin main
```

---

## 🎨 Screenshot Content Guidelines

### Screenshot 1: Dashboard Overview
**Caption:** "Your Complete Financial Overview"

Show:
- Balance summary cards (Cash, AR, AP)
- Quick action buttons
- Property selector
- Clean, uncluttered layout

### Screenshot 2: Reports & Analytics
**Caption:** "Smart AI-Powered Insights"

Show:
- P&L chart visualization
- Category breakdown
- AI-generated summary text
- Date range picker

### Screenshot 3: Transaction List
**Caption:** "Real-Time Transaction Tracking"

Show:
- Recent transaction feed (5-10 entries)
- Sync status indicator (synced)
- Search/filter bar
- Transaction categories

### Screenshot 4: Receipt Scanning
**Caption:** "Instant Receipt Processing"

Show:
- Camera viewfinder OR upload interface
- Scanning instructions
- Upload button/options
- Clean, simple UI

### Screenshot 5: Property Management
**Caption:** "Multi-Property Bookkeeping Made Simple"

Show:
- Property allocation interface
- Transfer modal or screen
- Property balance cards
- Category selections

---

## 🔍 Quality Checklist

Before committing, verify:

### Image Quality
- [ ] Resolution: 1200×2400 or higher
- [ ] Format: PNG (not JPG)
- [ ] No blur or artifacts
- [ ] Text is readable
- [ ] Colors match brand palette

### Content Quality
- [ ] No placeholder text ("Lorem ipsum", "Test", etc.)
- [ ] No debug information visible
- [ ] No personal/sensitive data
- [ ] Real data or professional sample data
- [ ] UI is fully loaded (no loading spinners)

### Apple Compliance
- [ ] Screenshots show actual app functionality
- [ ] No mockups or design comps
- [ ] Aspect ratio matches device
- [ ] File size < 8MB per image
- [ ] Consistent visual style across all 5

---

## 🐛 Troubleshooting

### Simulator Not Found
```bash
# List available simulators
xcrun simctl list devices available | grep "iPhone"

# Edit capture-screenshots-auto.sh and change SIMULATOR_NAME
# to match an available device
```

### App Not Running
```bash
# Restart the app
npx expo start --ios

# Wait 30 seconds for full load
# Then run screenshot script
```

### Wrong Resolution
The simulator will capture at its native resolution. iPhone 16 Pro Max provides the highest resolution suitable for App Store.

For older requirements (iPhone 6.7" = 1290×2796):
- Use iPhone 15 Pro Max or iPhone 14 Pro Max instead
- Edit `SIMULATOR_NAME` in script

### Screenshots Too Large
```bash
# Compress if needed (while maintaining quality)
cd assets/screenshots/ios
for f in *.png; do
  pngquant --quality=85-95 --ext .png --force "$f"
done
```

---

## 📤 Upload to App Store Connect

After capturing and committing screenshots:

1. **Log in to App Store Connect**
   - https://appstoreconnect.apple.com

2. **Navigate to BookMate iOS**
   - My Apps → BookMate

3. **Select Version 1.0.1**
   - App Store tab

4. **Upload Screenshots**
   - Scroll to "App Preview and Screenshots"
   - Select "6.7" iPhone Display" (or "6.9" for iPhone 16 Pro Max)
   - Drag and drop all 5 screenshots in order
   - Add captions from `assets/screenshots/ios/README.md`

5. **Save Changes**
   - Click "Save" at top right
   - Review preview
   - Proceed to submission

---

## ✅ Success Criteria

Task is complete when:

1. ✅ 5 high-quality screenshots captured
2. ✅ All files in `assets/screenshots/ios/`
3. ✅ Screenshots committed to git repository
4. ✅ Resolution verified (1200×2400 minimum)
5. ✅ Content reviewed for quality
6. ✅ Ready for App Store Connect upload

---

## 📞 Support

**Scripts Created:**
- `capture-screenshots-auto.sh` — Automated capture with intervals
- `capture-screenshots.sh` — Manual interactive capture
- `assets/screenshots/ios/README.md` — Screenshot descriptions

**Documentation:**
- `IMMEDIATE_SCREENSHOT_PREPARATION.md` — Full preparation guide
- `SCREENSHOT_SPECIFICATIONS.md` — Apple requirements

**Questions?**
- Refer to `PHASE3-LAUNCH-PREPARATION.md` for submission workflow
- Check `PRE_SUBMISSION_QA_CHECKLIST.md` for quality standards

---

## 🎯 Timeline

| Time | Task |
|------|------|
| **Now** | Run `./capture-screenshots-auto.sh` |
| **+1 hour** | Review and verify screenshots |
| **+2 hours** | Commit to repository |
| **+3 hours** | Upload to App Store Connect |
| **Nov 12** | Complete submission process |

---

**Status:** 🟢 Ready to Execute  
**Next Action:** Run `./capture-screenshots-auto.sh` to begin capture
