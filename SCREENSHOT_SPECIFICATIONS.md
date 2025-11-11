# Screenshot Specifications - BookMate App Store
**Last Updated:** November 11, 2025  
**For:** Design Team  
**Due:** November 14, 2025

---

## Overview

This document provides exact specifications for creating App Store screenshots for BookMate v1.0.1. These screenshots are **REQUIRED** for App Store submission.

---

## Required Sizes

### 1. iPhone 6.7" (iPhone 14 Pro Max / 15 Pro Max) - PRIMARY

**Resolution:** 1290 × 2796 px (portrait)  
**Aspect Ratio:** ~0.46:1  
**File Format:** PNG or JPG  
**Color Space:** RGB  
**Quantity:** 5-8 screenshots (5 recommended)  
**Status:** ⚠️ URGENT - Needed by Nov 14

### 2. iPhone 5.5" (iPhone 8 Plus) - REQUIRED

**Resolution:** 1242 × 2208 px (portrait)  
**Aspect Ratio:** ~0.56:1  
**File Format:** PNG or JPG  
**Color Space:** RGB  
**Quantity:** 5-8 screenshots (same content as 6.7")  
**Status:** ⚠️ URGENT - Needed by Nov 14

### 3. iPad (OPTIONAL for v1.0)

**Resolution:** 2048 × 2732 px (portrait)  
**Status:** ⏸️ Skip for initial release

---

## Design Guidelines

### DO's ✅
- ✅ Use actual app UI and real data
- ✅ Show BookMate in dark mode (matches app theme)
- ✅ Clean status bar (full battery, good signal, 9:41 AM)
- ✅ Use readable font sizes (important text should be legible even at thumbnail size)
- ✅ Highlight key features with subtle overlays or captions (optional)
- ✅ Show app in realistic use cases
- ✅ Maintain consistent visual style across all screenshots

### DON'Ts ❌
- ❌ No device frames or bezels (Apple adds automatically)
- ❌ No Lorem Ipsum or placeholder text
- ❌ No developer/debug UI elements
- ❌ No screenshots from other apps
- ❌ No misleading features (don't show features that don't exist)
- ❌ No copyrighted content without permission
- ❌ No excessive text overlays that obscure the UI

---

## Screenshot Content Plan

### Screenshot 1: Dashboard - Balance Overview
**Primary Goal:** Show financial dashboard at a glance

**Content to Show:**
- Top section: Total balance or summary card
- Multiple bank account cards with balances
- Visual indicators (colored borders, icons)
- Clean, organized layout

**Sample Data:**
- Krung Thai Bank: ฿125,450.00
- Bangkok Bank: ฿89,320.50
- SCB: ฿42,100.00
- Cash on Hand: ฿15,000.00

**Optional Caption:** "Track all accounts at a glance" (bottom or top overlay)

---

### Screenshot 2: P&L Report - Monthly Breakdown
**Primary Goal:** Show automated financial reporting

**Content to Show:**
- Month selector or toggle (showing current month)
- Income section with total
- Expense section with categories
- Net profit/loss summary
- Charts or visual breakdowns

**Sample Data:**
- Total Income: ฿450,000
- Total Expenses: ฿320,000
- Net Profit: ฿130,000
- Top expense categories visible

**Optional Caption:** "Automated P&L reports - monthly & yearly"

---

### Screenshot 3: Receipt Scanning - AI Extraction
**Primary Goal:** Highlight AI-powered receipt scanning feature

**Content to Show:**
- Either:
  - Camera interface with receipt in view, OR
  - OCR extraction screen with data fields being filled

**Sample Data (if showing extraction):**
- Receipt image thumbnail
- Amount: ฿850.00
- Date: Nov 11, 2025
- Merchant: 7-Eleven
- Category: Office Supplies
- Description: Auto-filled or being typed

**Optional Caption:** "AI-powered receipt scanning - no typing needed"

---

### Screenshot 4: Manual Entry - 3-Step Wizard
**Primary Goal:** Show quick manual transaction entry

**Content to Show:**
- Transaction entry wizard (ideally Step 3 with all fields visible)
- Property selection: "Family"
- Type: "Expense" or "Income"
- Payment method: "Bank Transfer - Krung Thai"
- Amount field, Description field
- Clean, simple form layout

**Sample Data:**
- Description: "Monthly rent payment"
- Amount: ฿25,000
- Date: Nov 11, 2025

**Optional Caption:** "Quick entry in 3 simple steps"

---

### Screenshot 5: Property/Person Breakdown
**Primary Goal:** Show expense allocation by property

**Content to Show:**
- List of properties with expense amounts
- Percentage breakdowns
- Visual indicators (progress bars or pie chart)
- Total expenses at top

**Sample Data:**
- Alesia House: ฿45,000 (35%)
- Lanna House: ฿32,000 (25%)
- Chiang Mai Property: ฿28,000 (22%)
- Other: ฿23,000 (18%)
- Total: ฿128,000

**Optional Caption:** "Track expenses by property or person"

---

## Optional Screenshots (if time permits)

### Screenshot 6: Activity/Transaction List
- Recent transactions
- Swipe actions or detail views
- Clean list layout

### Screenshot 7: Transfer Between Accounts
- Transfer modal or screen
- From/to account selection
- Amount and description

### Screenshot 8: Settings or Profile
- App settings
- User profile
- Account management

---

## File Naming Convention

```
# iPhone 6.7" (1290x2796)
01-dashboard-6.7.png
02-pl-report-6.7.png
03-receipt-scan-6.7.png
04-manual-entry-6.7.png
05-property-breakdown-6.7.png

# iPhone 5.5" (1242x2208)
01-dashboard-5.5.png
02-pl-report-5.5.png
03-receipt-scan-5.5.png
04-manual-entry-5.5.png
05-property-breakdown-5.5.png
```

---

## Status Bar Guidelines

**Time:** 9:41 AM (Apple's standard time)  
**Battery:** Full or near full  
**Signal:** Full bars  
**WiFi:** Connected  
**No:** Notifications, Bluetooth icon (unless relevant)

---

## How to Create Screenshots

### Option 1: Export from Running App (Recommended)
1. Run BookMate on iPhone simulator or physical device
2. Navigate to desired screen
3. Ensure data looks good (use demo account)
4. Take screenshot:
   - Simulator: Cmd+S
   - Physical device: Volume Up + Side button
5. Export at correct resolution
6. Edit in Figma/Photoshop if captions needed

### Option 2: Design in Figma/Sketch
1. Create artboards at exact sizes (1290x2796, 1242x2208)
2. Import app UI screenshots as base
3. Add captions or overlays if desired
4. Export as PNG (highest quality)

### Option 3: Use Screenshot Tools
- **Fastlane Snapshot:** Automated screenshot generation
- **Previewed.app:** Add device frames and captions
- **App Store Screenshot Generator:** Online tools

---

## Quality Checklist

Before submitting screenshots to engineering:

**Technical:**
- [ ] Exact resolution (1290x2796 and 1242x2208)
- [ ] PNG or high-quality JPG
- [ ] RGB color space
- [ ] File size < 5MB each

**Content:**
- [ ] Real app UI (not mockups)
- [ ] Actual data (not placeholders)
- [ ] Status bar clean (9:41, full battery)
- [ ] No typos in any visible text
- [ ] All text readable

**Visual:**
- [ ] High contrast and clarity
- [ ] Consistent dark mode theme
- [ ] Professional appearance
- [ ] No debug UI elements

**Count:**
- [ ] 5 screenshots for 6.7"
- [ ] 5 screenshots for 5.5"
- [ ] Total: 10 screenshots minimum

---

## Delivery

**Deliver To:** Engineering Team  
**Method:** 
- Upload to shared folder, OR
- Email with Dropbox/Google Drive link, OR
- Commit to /assets/appstore-screenshots/ios folder

**File Structure:**
```
assets/
  appstore-screenshots/
    ios/
      6.7-inch/
        01-dashboard-6.7.png
        02-pl-report-6.7.png
        03-receipt-scan-6.7.png
        04-manual-entry-6.7.png
        05-property-breakdown-6.7.png
      5.5-inch/
        01-dashboard-5.5.png
        02-pl-report-5.5.png
        03-receipt-scan-5.5.png
        04-manual-entry-5.5.png
        05-property-breakdown-5.5.png
      README.md (this file)
```

---

## Timeline

**Request Date:** November 11, 2025  
**Due Date:** November 14, 2025 (3 days)  
**Submission Date:** November 15, 2025

**Urgency:** HIGH - Required for App Store submission

---

## Reference Materials

### App Screens to Screenshot
1. Dashboard (main tab)
2. P&L Screen (reports tab)
3. Upload Screen (camera or completed upload)
4. Activity Screen with manual entry wizard
5. P&L Property/Person breakdown

### Demo Account
- Email: demo@bookmate.app
- Password: DemoBookMate2025!
- Status: ⏳ To be created

### App Theme
- Dark mode enabled
- Primary color: [Specify if known]
- Background: Dark gray/black
- Cards: Slightly lighter gray
- Text: White/light gray

---

## Examples from Competitors

**Good Examples (for inspiration):**
- QuickBooks Mobile
- FreshBooks
- Wave Accounting
- Zoho Books

**What to Look For:**
- Clean UI with clear hierarchy
- Readable text even at small size
- Consistent visual style
- Real data (not Lorem Ipsum)
- Professional captions

---

## Questions?

**Contact:** Engineering Team  
**Email:** [Your email]  
**Slack:** #bookmate-launch

**Quick Answer:**
- Resolution questions? 1290x2796 for 6.7", 1242x2208 for 5.5"
- Content questions? See "Screenshot Content Plan" above
- Format questions? PNG preferred, JPG acceptable
- Deadline questions? November 14 (FIRM)

---

**Status:** 📝 Specs ready, awaiting screenshots  
**Priority:** 🔴 HIGH - App Store submission blocked without these  
**Assigned To:** Design Team
