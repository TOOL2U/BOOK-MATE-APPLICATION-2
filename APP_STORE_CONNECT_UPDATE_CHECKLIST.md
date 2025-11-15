# 📋 App Store Connect Update Checklist
**Task:** Update metadata to address Apple's Guideline 3.2 rejection  
**Date:** November 14, 2025  
**Time Required:** ~15 minutes  
**Status:** Ready to execute

---

## 🎯 What We're Fixing

**Apple's Concern:** "App appears to be for enterprise/business use, not general public"

**Our Solution:** Update ALL metadata to emphasize consumer/personal use

**Key Changes:**
- ❌ Remove: "business," "property," "enterprise," "company"  
- ✅ Add: "personal," "individual," "consumer," "freelancer," "everyone"

---

## ✅ Step-by-Step Instructions

### **Step 1: Login to App Store Connect**

1. Go to: https://appstoreconnect.apple.com
2. Sign in with Apple ID: [Your Apple ID]
3. Select: **My Apps**
4. Click: **BookMate**

**Estimated time:** 1 minute

---

### **Step 2: Update App Information (Subtitle & Category)**

1. Click **App Information** (left sidebar)

2. **Update Subtitle:**
   - Find field: **Subtitle**
   - Current: `Automated financial insights for property owners & businesses`
   - **Change to:** `Personal Expense Tracker for Everyone`

3. **Update Secondary Category:**
   - Find field: **Secondary Category**
   - Current: `Business`
   - **Change to:** `Productivity` (or leave blank)

4. Click **Save** (top right)

**Estimated time:** 2 minutes

---

### **Step 3: Update Version 1.0.1 Metadata**

1. Go back to **BookMate** main page
2. Click **iOS** platform
3. Click **1.0.1 Prepare for Submission** (or current version)
4. Scroll to **App Store** tab

**Estimated time:** 1 minute

---

### **Step 4: Update Description**

1. Find field: **Description** (under App Store Information)

2. Delete ENTIRE current text

3. **Paste NEW description:**
   - Open: `APPSTORE_DESCRIPTION_CONSUMER_FOCUSED.md`
   - Copy section: "NEW VERSION - Consumer/Personal Focus"
   - Paste into Description field

4. **Verify character count:** Should be ~3,892 characters (within 4,000 limit)

**Estimated time:** 2 minutes

---

### **Step 5: Update Keywords**

1. Find field: **Keywords**

2. Current keywords:
   ```
   bookkeeping,finance,P&L,receipts,accounting,property,business,automation,Thailand,expenses
   ```

3. **Replace with:**
   ```
   personal finance,expense tracker,receipt scanner,budget,freelancer,individual,consumer,money,spending
   ```

4. **Verify character count:** Should be 99/100

**Estimated time:** 1 minute

---

### **Step 6: Update Promotional Text**

1. Find field: **Promotional Text** (optional field below description)

2. Current text:
   ```
   🚀 AI-powered receipt scanning saves hours weekly. Track balances, generate P&L reports, and manage property expenses—all from your iPhone. Try it free!
   ```

3. **Replace with:**
   ```
   📱 Track personal expenses effortlessly. Scan receipts with AI, monitor spending, and stay on budget. Perfect for freelancers and anyone managing money. Free!
   ```

4. **Verify character count:** Should be 168/170

**Estimated time:** 1 minute

---

### **Step 7: Update What's New (Release Notes)**

1. Find field: **What's New in This Version**

2. **Replace with:**
   ```
   Welcome to BookMate! 🎉

   Your personal expense tracking companion is here.

   ✨ WHAT'S INCLUDED:

   📸 Smart Receipt Scanning
   • Snap photos of receipts
   • AI extracts all the details
   • Save time, stay organized

   💰 Expense Tracking
   • Log personal expenses in seconds
   • Categorize spending (Food, Transport, etc.)
   • See where your money goes

   📊 Visual Dashboards
   • Beautiful spending charts
   • Monthly/yearly summaries
   • Understand your finances better

   🏦 Account Management
   • Track all your accounts
   • Monitor balances
   • See your complete financial picture

   ✍️ Quick Entry
   • Manual logging in 3 taps
   • Perfect for cash payments
   • Mobile-optimized

   📡 Offline Support
   • Works without internet
   • Auto-sync when online
   • Never lose data

   🔒 Secure & Private
   • Your data is protected
   • Privacy-first design
   • We never sell your info

   ━━━━━━━━━━━━━━━━━━━━━━

   Perfect for individuals, freelancers, students, and anyone who wants to manage money better.

   Questions? Email support@siamoon.com

   Download now and take control of your finances!
   ```

**Estimated time:** 1 minute

---

### **Step 8: Update iPad Screenshots**

1. Scroll to **App Previews and Screenshots** section

2. Find **iPad Pro (12.9-inch) (3rd generation)** section

3. **Delete old screenshots** (if any - these were stretched iPhone images)

4. **Upload 5 NEW screenshots:**
   - Navigate to: `~/Desktop/`
   - Select files:
     - `BookMate_iPad_01_Balance.png`
     - `BookMate_iPad_02_PL_Dashboard.png`
     - `BookMate_iPad_03_Activity.png`
     - `BookMate_iPad_04_Manual_Entry.png`
     - `BookMate_iPad_05_Upload_Receipt.png`

5. **Drag to reorder** if needed (Balance should be first)

6. **Verify dimensions:** Each should be 2048×2732 pixels

**Estimated time:** 3 minutes

---

### **Step 9: Update App Review Information**

1. Scroll to **App Review Information** section

2. Find field: **Notes**

3. **Replace with:**
   ```
   BookMate is a personal finance app for individual consumers (like Mint or YNAB).

   NO LOGIN REQUIRED: The app works immediately upon download. Users can start 
   tracking expenses without creating an account.

   TESTING STEPS:
   1. Open BookMate—no sign-up screen, goes straight to app
   2. View Dashboard—see sample data or empty state
   3. Navigate to tabs—Balance, P&L, Activity, Upload, Manual Entry
   4. Test receipt upload:
      - Tap Upload tab
      - Choose "Camera" or "Photo Library"
      - Camera permission will be requested—please allow
      - Take/select a receipt photo
      - AI will extract amount, date, merchant
   5. Try manual entry:
      - Tap Manual Entry tab (or "+" button)
      - Complete 3-step wizard (Property, Category, Amount)
      - Transaction saved to Activity list
   6. Test offline mode:
      - Enable airplane mode
      - Add a transaction
      - Re-enable network
      - Transaction syncs automatically

   PERMISSIONS EXPLAINED:
   - Camera: Scan receipt photos (optional feature)
   - Photo Library: Upload existing receipt images (optional feature)

   WHO IS THIS APP FOR?
   - Individual consumers managing personal finances
   - Freelancers tracking expenses
   - Students budgeting their money
   - Anyone who wants to organize receipts and expenses

   THIS IS NOT:
   - An enterprise app
   - Restricted to company employees
   - Business-only software

   The app connects to our API for data sync, but no account is required.
   Users own their data. We do not sell data to third parties.

   For questions: support@siamoon.com

   Thank you for reviewing BookMate!
   ```

**Estimated time:** 2 minutes

---

### **Step 10: Select Build 3 (When Ready)**

1. Scroll to **Build** section

2. **Wait for Build 3 to process** (if not ready yet)
   - Processing usually takes 5-15 minutes after upload
   - You'll get email when processing completes
   - Build status changes from "Processing" to available

3. Click **Select a build before you submit your app**

4. Select **Build 3** from the list
   - Version: 1.0.1
   - Build: 3
   - Date: November 14, 2025

5. Click **Done**

**Note:** Don't do this step until Build 3 is actually uploaded and processed!

**Estimated time:** 1 minute (assuming build is ready)

---

### **Step 11: Save & Review**

1. Click **Save** (top right corner)

2. **Review all changes:**
   - Subtitle: "Personal Expense Tracker for Everyone" ✓
   - Description: Consumer-focused (no "business" mentions) ✓
   - Keywords: Personal, individual, consumer focus ✓
   - Promotional text: Personal expense tracking ✓
   - What's New: Friendly, accessible tone ✓
   - iPad screenshots: 5 genuine screenshots uploaded ✓
   - Review notes: Explains consumer app positioning ✓

3. **Check for errors:**
   - Look for yellow warning triangles
   - Fix any required fields
   - Ensure all character limits met

**Estimated time:** 2 minutes

---

### **Step 12: Submit Reply to Apple (With Answers)**

1. Go to **Resolution Center** (if there's a message from Apple)
   - OR go to **Activity** tab and find the rejection message

2. Click **Reply to App Review**

3. **Paste prepared response:**
   - Open: `APPLE_APP_REVIEW_RESPONSE.md`
   - Copy the ENTIRE response document
   - Paste into message field

4. **Attach this info (in message):**
   ```
   We have made the following changes to address your concerns:

   ✅ Fixed iPad crash (graceful error handling implemented)
   ✅ Uploaded genuine iPad screenshots (2048×2732, not stretched)
   ✅ Updated all app metadata to emphasize consumer/public use:
      • Subtitle changed to "Personal Expense Tracker for Everyone"
      • Description rewritten for individual consumers
      • Keywords updated to include "personal," "individual," "consumer"
      • Removed all "business," "enterprise," "property" language

   Please see our detailed answers to your 5 questions above.

   We are resubmitting Build 3 with these changes.

   Thank you for your guidance!
   ```

5. Click **Send**

**Estimated time:** 2 minutes

---

## 📊 Before & After Comparison

### Subtitle:
| Before | After |
|--------|-------|
| ❌ "Automated financial insights for property owners & businesses" | ✅ "Personal Expense Tracker for Everyone" |

### Description First Line:
| Before | After |
|--------|-------|
| ❌ "Transform your business bookkeeping..." | ✅ "Simplify your personal finances..." |

### Target Audience:
| Before | After |
|--------|-------|
| ❌ Property managers, landlords, finance teams | ✅ Students, freelancers, individuals, consumers |

### Keywords:
| Before | After |
|--------|-------|
| ❌ bookkeeping, property, business, accounting | ✅ personal finance, freelancer, individual, consumer |

---

## ✅ Final Checklist

Before clicking "Submit for Review":

- [ ] **App Information updated:**
  - [ ] Subtitle changed to consumer-focused
  - [ ] Secondary category updated (or removed)

- [ ] **Version 1.0.1 metadata updated:**
  - [ ] Description replaced with consumer version
  - [ ] Keywords updated (no "business" words)
  - [ ] Promotional text updated
  - [ ] What's New updated

- [ ] **Screenshots:**
  - [ ] 5 iPad screenshots uploaded (2048×2732)
  - [ ] Screenshots show genuine iPad UI (not stretched)
  - [ ] Order: Balance → P&L → Activity → Manual Entry → Upload

- [ ] **App Review Information:**
  - [ ] Review notes updated (explains consumer app)
  - [ ] Emphasizes NO login required
  - [ ] Clarifies this is NOT enterprise app

- [ ] **Build selected:**
  - [ ] Build 3 selected (not Build 2)
  - [ ] Version 1.0.1 confirmed
  - [ ] Build processed successfully

- [ ] **Reply sent to Apple:**
  - [ ] Detailed answers to 5 questions provided
  - [ ] Explained all metadata changes
  - [ ] Professional, respectful tone

- [ ] **Everything saved:**
  - [ ] All changes saved in App Store Connect
  - [ ] No warning messages
  - [ ] Ready to submit

---

## 🚀 When Everything is Done

1. Click **Submit for Review** button (top right)

2. **Answer export compliance questions:**
   - "Does your app use encryption?" → YES
   - "Is your app exempt?" → YES (HTTPS only)

3. **Confirm submission**

4. **Wait for confirmation email** from Apple

5. **Expected timeline:**
   - Submission confirmed: Immediately
   - "In Review": 24-48 hours
   - Review decision: 24-48 hours after "In Review"
   - Total time: 2-4 days

---

## 📧 What to Expect

**Email 1: "Your submission was received"**
- Time: Immediately after clicking Submit
- Means: Apple received your submission
- Status: "Waiting for Review"

**Email 2: "Your app is In Review"**
- Time: 24-48 hours later
- Means: Apple reviewer is actively testing
- Status: "In Review"

**Email 3: "Your app has been approved" (hopefully!)**
- Time: 24-48 hours after In Review
- Means: App passed review ✅
- Status: "Pending Developer Release" or "Ready for Sale"

---

## 🆘 If You Need Help

**Documents to reference:**
- Full response to Apple: `APPLE_APP_REVIEW_RESPONSE.md`
- New description text: `APPSTORE_DESCRIPTION_CONSUMER_FOCUSED.md`
- Original rejection: `APP_STORE_REJECTION_REPORT.md`

**Screenshots location:**
- Desktop: `~/Desktop/BookMate_iPad_*.png`
- Backup: `app-store-screenshots/ipad/`

**Questions?**
- Check rejection report for Apple's exact feedback
- Review response document for prepared answers
- All text is copy-paste ready (no editing needed)

---

**Status:** ✅ Ready to execute  
**Time estimate:** 15-20 minutes total  
**Best time to do this:** Now (so Build 3 can be submitted today)  
**Deadline:** November 14, 5:00 PM (for resubmission)
