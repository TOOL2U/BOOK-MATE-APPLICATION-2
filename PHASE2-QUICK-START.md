# Phase 2 Quick Start Guide
**BookMate App Store Submission**  
**Last Updated:** November 11, 2025

---

## 🚀 Quick Commands

### Build Production iOS
```bash
# Full production build for App Store
eas build --profile production --platform ios

# Check build status
eas build:list

# Download build
eas build:view [build-id]
```

### Submit to App Store
```bash
# Automatic submission
eas submit --profile production --platform ios

# Manual: Download .ipa and use Transporter app
```

### Build Preview (for Testing)
```bash
# Internal testing build
eas build --profile preview --platform ios
```

---

## 📋 Pre-Flight Checklist

### Before First Build
- [ ] Apple Developer account approved
- [ ] Team members added to App Store Connect
- [ ] App ID created: `com.siamoon.bookmate`
- [ ] EAS credentials configured: `eas build:configure`

### Before Submission
- [ ] TestFlight testing complete
- [ ] QA report filled (PHASE2-QA-REPORT.md)
- [ ] Privacy Policy live
- [ ] Support URL live
- [ ] App icon uploaded (1024x1024)
- [ ] Screenshots uploaded (5 per size)
- [ ] All metadata complete

---

## 🔑 Important Links

### Apple
- **App Store Connect:** https://appstoreconnect.apple.com
- **Developer Portal:** https://developer.apple.com/account
- **TestFlight Guide:** https://developer.apple.com/testflight/

### EAS/Expo
- **EAS Dashboard:** https://expo.dev/accounts/[your-account]/projects/bookmate-mobile
- **Build Docs:** https://docs.expo.dev/build/introduction/
- **Submit Docs:** https://docs.expo.dev/submit/introduction/

### Documentation
- **Phase 2 Guide:** PHASE2-APP-STORE-PREPARATION.md
- **Metadata:** APPSTORE_METADATA.md
- **Privacy Policy:** PRIVACY_POLICY.md
- **QA Template:** PHASE2-QA-REPORT.md

---

## 📱 Demo Account

**For App Review & Testing:**
- Email: demo@bookmate.app
- Password: DemoBookMate2025!

**Setup:**
- [ ] Create account in production
- [ ] Populate with sample data
- [ ] Test all features work

---

## 🎨 Asset Requirements

### App Icon
- **Size:** 1024 × 1024 px
- **Format:** PNG, no transparency
- **Location:** TBD from design team

### Screenshots (iPhone 6.7")
1. Dashboard with balance overview
2. P&L monthly report
3. Receipt scanning flow
4. Manual entry wizard
5. Balance detail screen

**Resolution:** 1290 × 2796 px

---

## 🐛 Common Issues & Solutions

### Issue: EAS credentials error
```bash
# Solution: Reset credentials
eas credentials
# Select: iOS → Production → Remove all → Regenerate
```

### Issue: Build fails with signing error
```bash
# Solution: Use automatic signing
eas build:configure
# Select: "Let Expo handle the process"
```

### Issue: TestFlight not showing build
- Wait 5-10 minutes for processing
- Check Export Compliance questionnaire
- Refresh TestFlight app

### Issue: App Store Connect shows "Missing Compliance"
- Answer: YES to encryption
- Answer: YES to exempt (HTTPS only)
- Submit

---

## 📞 Support Contacts

**Project Manager:** [PM Name]  
**Engineering Lead:** [Your Name]  
**Design Team:** [Designer Email]  
**Support Email:** support@siamoon.com

---

## ⏱️ Timeline

**Day 1 (Nov 11):** Configure & document ✅  
**Day 2 (Nov 12):** Apple setup & first build  
**Day 3 (Nov 13):** TestFlight testing  
**Day 4 (Nov 14):** Metadata & assets  
**Day 5 (Nov 15):** Submit for review 🎯  
**Day 7-9 (Nov 17-19):** Apple review  
**Day 10 (Nov 20):** LIVE ON APP STORE 🎉

---

## ✅ Daily Tasks

### Today (Nov 11)
- [x] Update eas.json with store distribution
- [x] Create Phase 2 documentation
- [x] Create metadata template
- [x] Create privacy policy
- [ ] Request app icon from design
- [ ] Request screenshots from design
- [ ] Create privacy policy webpage

### Tomorrow (Nov 12)
- [ ] Verify Apple Developer account
- [ ] Add team to App Store Connect
- [ ] Create App ID
- [ ] Run `eas build --profile production --platform ios`
- [ ] Upload to TestFlight

### Nov 13
- [ ] Internal testing (all team members)
- [ ] Fill QA report
- [ ] Fix critical bugs

### Nov 14
- [ ] Upload all assets
- [ ] Complete metadata
- [ ] Final QA pass

### Nov 15
- [ ] Submit for review 🚀

---

**Keep this guide handy during Phase 2!**
