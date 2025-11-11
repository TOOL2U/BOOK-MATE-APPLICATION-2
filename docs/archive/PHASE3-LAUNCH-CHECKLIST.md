# Phase 3 Launch Checklist
**BookMate App Store Submission**  
**Version:** 1.0.1 (Build 2)  
**Target Submission:** November 15, 2025  
**Target Launch:** November 20, 2025

---

## 🚦 Pre-Submission Status

### Build & Version
- [x] Version updated to 1.0.1 in app.json
- [x] iOS build number updated to 2
- [x] Android version code updated to 2
- [ ] Git tag created: v1.0.1
- [ ] Production build completed
- [ ] Build uploaded to App Store Connect

### Documentation
- [x] Phase 3 master guide created
- [x] App Store description finalized
- [x] Screenshot specifications documented
- [x] Privacy policy ready

---

## 📋 Monday, November 11 (Today)

### Engineering
- [x] Update app.json to v1.0.1
- [x] Create Phase 3 documentation
- [x] Finalize App Store description
- [x] Document screenshot requirements
- [ ] Request screenshots from design team
- [ ] Verify privacy policy is ready to publish

### Design
- [ ] Receive screenshot specifications
- [ ] Review sample data requirements
- [ ] Plan screenshot creation approach

### Marketing
- [ ] Review APPSTORE_DESCRIPTION.md
- [ ] Approve final copy
- [ ] Prepare privacy policy webpage content
- [ ] Prepare support webpage content

**End of Day Goals:**
- ✅ Version locked at 1.0.1
- ✅ Documentation complete
- ⏳ Screenshots requested
- ⏳ Web team assigned privacy/support pages

---

## 📋 Tuesday, November 12

### Engineering
- [ ] Create git tag: `git tag -a v1.0.1 -m "BookMate iOS App Store build"`
- [ ] Push tag: `git push origin v1.0.1`
- [ ] Run production build: `eas build --platform ios --profile production`
- [ ] Monitor build progress (~15-20 minutes)
- [ ] Download .ipa from EAS dashboard
- [ ] Upload to App Store Connect (or use `eas submit`)
- [ ] Complete basic App Store Connect metadata

### App Store Connect Setup
- [ ] Login to https://appstoreconnect.apple.com
- [ ] Go to "My Apps" → BookMate
- [ ] Select build from TestFlight
- [ ] Fill in version info (1.0.1)
- [ ] Add app description (from APPSTORE_DESCRIPTION.md)
- [ ] Add keywords
- [ ] Add promotional text
- [ ] Add What's New text
- [ ] Save as draft

### Design
- [ ] Create screenshot 1: Dashboard
- [ ] Create screenshot 2: P&L Report
- [ ] Create screenshot 3: Receipt Scanning
- [ ] Create screenshot 4: Manual Entry
- [ ] Create screenshot 5: Property Breakdown
- [ ] Export both sizes (6.7" and 5.5")
- [ ] Send to engineering team

### Backend
- [ ] Create demo account (demo@bookmate.app)
- [ ] Set password: DemoBookMate2025!
- [ ] Populate with sample data:
  - [ ] 3-5 bank accounts with balances
  - [ ] 10-15 sample transactions
  - [ ] P&L data for current month
  - [ ] Property/person categories
- [ ] Test demo account login works
- [ ] Verify all features accessible

### Marketing
- [ ] Publish privacy policy to bookmate.app/privacy
- [ ] Publish support page to bookmate.app/support
- [ ] Update main bookmate.app site (if needed)
- [ ] Verify all URLs are publicly accessible
- [ ] Test URLs from different devices

**End of Day Goals:**
- ✅ Production build uploaded to App Store Connect
- ✅ Screenshots created (or in progress)
- ✅ Demo account ready
- ✅ Privacy/support URLs live

---

## 📋 Wednesday, November 13

### TestFlight Testing

**Internal Testers:**
- [ ] Engineering lead
- [ ] QA team member
- [ ] Project manager
- [ ] Shaun Ducker (CEO)
- [ ] [Add other stakeholders]

**Testing Checklist (each tester):**
- [ ] Install from TestFlight
- [ ] Login with demo account
- [ ] Test Dashboard (balance overview)
- [ ] Test P&L reports (month/year toggle)
- [ ] Test receipt upload (camera + photo library)
- [ ] Test manual entry (complete wizard)
- [ ] Test transfer between accounts (if time)
- [ ] Test offline mode (airplane mode)
- [ ] Report any bugs found

**Bug Triage:**
- [ ] Review all reported bugs
- [ ] Categorize: Critical / High / Medium / Low
- [ ] Fix critical bugs immediately
- [ ] Document high/medium bugs for v1.0.2

**QA Sign-Off:**
- [ ] Complete PHASE2-QA-REPORT.md
- [ ] Get approval from Shaun or product lead
- [ ] Decision: GO / NO-GO for submission

**Engineering:**
- [ ] Fix any critical bugs found
- [ ] Re-build if necessary
- [ ] Upload new build to TestFlight
- [ ] Re-test critical flows

**End of Day Goals:**
- ✅ All critical bugs fixed
- ✅ QA sign-off received
- ✅ Build approved for submission

---

## 📋 Thursday, November 14

### App Store Connect - Final Metadata

**Screenshots:**
- [ ] Receive all screenshots from design team
- [ ] Verify sizes are correct
- [ ] Upload to App Store Connect:
  - [ ] 6.7" iPhone (5 screenshots)
  - [ ] 5.5" iPhone (5 screenshots)
- [ ] Preview how they look in App Store

**App Information:**
- [ ] Verify app name: BookMate
- [ ] Verify subtitle: Automated financial insights for property owners & businesses
- [ ] Verify category: Finance
- [ ] Verify age rating: 4+
- [ ] Verify copyright: © 2025 Sia Moon Company Limited

**URLs:**
- [ ] Test privacy policy URL: https://bookmate.app/privacy
- [ ] Test support URL: https://bookmate.app/support
- [ ] Test marketing URL: https://bookmate.app
- [ ] All URLs return 200 OK

**App Privacy:**
- [ ] Complete privacy questionnaire
- [ ] Answer: YES to data collection
- [ ] Specify: Email, Financial info, Photos
- [ ] Confirm: Data encrypted in transit
- [ ] Confirm: NO data selling
- [ ] Confirm: NO tracking

**Review Information:**
- [ ] Add contact info (name, phone, email)
- [ ] Add demo account:
  - Email: demo@bookmate.app
  - Password: DemoBookMate2025!
- [ ] Add notes to reviewer (from APPSTORE_DESCRIPTION.md)
- [ ] Test demo account one more time

**Export Compliance:**
- [ ] Answer: YES to encryption
- [ ] Answer: YES to exempt (HTTPS only)

**Pricing & Availability:**
- [ ] Set price: Free
- [ ] Set availability: All countries
- [ ] Set release: Manually release

**Final Review:**
- [ ] Review entire submission
- [ ] Check for typos
- [ ] Verify all fields filled
- [ ] Get approval from project manager

**End of Day Goals:**
- ✅ All metadata complete
- ✅ Screenshots uploaded
- ✅ Privacy/compliance done
- ✅ Ready to submit tomorrow

---

## 📋 Friday, November 15 🎯 SUBMISSION DAY

### Morning - Final Checks

**Pre-Submission Checklist:**
- [ ] Build is latest version (1.0.1 Build 2)
- [ ] All screenshots uploaded and verified
- [ ] Privacy policy accessible
- [ ] Support URL accessible
- [ ] Demo account tested within last 24 hours
- [ ] All metadata reviewed
- [ ] No typos in description
- [ ] Keywords optimized
- [ ] QA sign-off received
- [ ] Project manager approval

### Midday - SUBMIT

**Submission Steps:**
1. [ ] Login to App Store Connect
2. [ ] Go to BookMate → 1.0.1 Prepare for Submission
3. [ ] Click "Add for Review"
4. [ ] Review submission summary
5. [ ] Click "Submit to App Review"
6. [ ] **Status changes to "Waiting for Review"** ✅

**Immediate Post-Submission:**
- [ ] Screenshot the submission confirmation
- [ ] Note submission time
- [ ] Save App Store Connect URL
- [ ] Verify email confirmation received

### Afternoon - Announcements

**Internal Communication:**
- [ ] Post to #bookmate-launch Slack channel
- [ ] Email to stakeholders
- [ ] Update project board status
- [ ] Thank the team

**Announcement Template:**
```
🎉 BOOKMATE SUBMITTED TO APP STORE! 🎉

Team, I'm excited to announce that BookMate v1.0.1 has been 
successfully submitted to the Apple App Store for review!

📱 Status: Waiting for Review
🗓️ Submitted: November 15, 2025
⏰ Expected Review: 24-72 hours
🚀 Target Launch: November 20, 2025

What happens next:
1. Apple reviews the app (typically 1-3 days)
2. If approved, we'll manually release to the App Store
3. BookMate goes LIVE for download worldwide!

Thank you to everyone who made this possible:
- Engineering team for building an amazing product
- Design team for beautiful screenshots
- QA team for thorough testing
- Marketing team for compelling copy
- Everyone who contributed

We'll keep you posted on the review status. 🤞

Questions? Drop them in this channel or DM me.

Let's go! 🚀
```

**Monitoring:**
- [ ] Check App Store Connect every 4-6 hours
- [ ] Watch for email from Apple
- [ ] Be ready to respond to rejection notes (if any)

**End of Day Goals:**
- ✅ App submitted successfully
- ✅ Team notified
- ✅ Monitoring process in place

---

## 📋 Saturday-Monday, November 16-18 (Weekend + Monday)

### Apple Review Period

**Expected Status Changes:**
- "Waiting for Review" → "In Review" → "Pending Developer Release"

**What to Do:**
- [ ] Check App Store Connect 2x daily
- [ ] Respond to any Apple questions within 24 hours
- [ ] Have team on standby for urgent fixes
- [ ] Prepare launch materials (if not done)

**If Rejected:**
- [ ] Read rejection reason carefully
- [ ] Fix issue immediately
- [ ] Resubmit within 24 hours
- [ ] Notify team of delay

**If Approved:**
- [ ] Screenshot approval notification
- [ ] Notify team immediately
- [ ] Prepare for manual release
- [ ] Double-check app page looks good

**Launch Preparation:**
- [ ] Finalize launch announcement
- [ ] Prepare social media posts
- [ ] Update website with App Store badge
- [ ] Create FAQ document
- [ ] Brief support team

---

## 📋 Wednesday, November 20 🎉 LAUNCH DAY

### Morning - Pre-Release Checks

**Verify Everything:**
- [ ] App status: "Pending Developer Release"
- [ ] App page preview looks correct
- [ ] Screenshots display properly
- [ ] Description has no typos
- [ ] Privacy policy accessible
- [ ] Support URL working

**Team Readiness:**
- [ ] Support team briefed
- [ ] Marketing materials ready
- [ ] Social media posts scheduled
- [ ] Website updated
- [ ] Stakeholders notified

### Midday - RELEASE

**Release Steps:**
1. [ ] Login to App Store Connect
2. [ ] Go to BookMate → 1.0.1
3. [ ] Click "Release This Version"
4. [ ] Confirm release
5. [ ] **App goes LIVE** 🎉

**Propagation Wait:**
- Wait 2-4 hours for App Store to update worldwide
- App won't appear immediately in all regions

### Afternoon - Verification

**Test Download:**
- [ ] Search "BookMate" in App Store
- [ ] Verify app appears in results
- [ ] Download and install
- [ ] Test first launch
- [ ] Verify everything works

**Screenshots:**
- [ ] Screenshot app page on App Store
- [ ] Screenshot search results
- [ ] Save for records

### Evening - Announcements

**Go Public:**
- [ ] Post to #bookmate-launch: "WE'RE LIVE!"
- [ ] Email stakeholders with App Store link
- [ ] Social media announcements (if planned)
- [ ] Update company website
- [ ] Press release (if planned)

**Celebration Template:**
```
🚀🎉 BOOKMATE IS LIVE ON THE APP STORE! 🎉🚀

Team, we did it! BookMate is now available for download 
worldwide on the Apple App Store!

📱 Download: [App Store link]
⭐ Please rate & review if you enjoy it!

This is a massive milestone. From concept to code to App Store 
in record time. You all made this happen.

What's next:
- Monitor reviews and feedback
- Track download numbers
- Plan v1.0.2 bug fix release (if needed)
- Start planning v1.1 features

Thank you all for your incredible work. This is just the beginning!

Cheers! 🥂

P.S. Don't forget to download the app and leave a 5-star review 😉
```

**Monitoring Day 1:**
- [ ] Check reviews every 2-4 hours
- [ ] Respond to user feedback
- [ ] Watch crash reports (if Sentry enabled)
- [ ] Track download numbers
- [ ] Monitor support email

**End of Day:**
- 🎉 BookMate is LIVE
- 🎉 Team celebrated
- 🎉 First downloads recorded
- 🎉 Monitoring in place

---

## 📊 Post-Launch (Week 1: Nov 20-27)

### Daily Tasks
- [ ] Check App Store reviews
- [ ] Respond to user feedback
- [ ] Monitor crash reports
- [ ] Track download metrics
- [ ] Answer support emails

### Metrics to Track
- Downloads (target: 50+ in Week 1)
- Rating (target: 4.5+ stars)
- Reviews (read all, respond to negative)
- Crashes (target: 0 critical crashes)
- Support requests (track common issues)

### Bug Fixes
- [ ] Collect all reported bugs
- [ ] Prioritize by severity
- [ ] Plan v1.0.2 release (if needed)
- [ ] Estimated date: December 1-5

---

## 📊 Post-Launch (Month 1: Nov 20 - Dec 20)

### Goals
- 200+ downloads
- 4.5+ star rating
- 90% feature adoption
- Positive user sentiment

### Feature Requests
- [ ] Collect user feature requests
- [ ] Categorize and prioritize
- [ ] Plan v1.1 roadmap
- [ ] Target: January 2026

### Marketing
- [ ] Blog post about launch
- [ ] Case study (if user permits)
- [ ] Social proof (testimonials)
- [ ] App Store optimization review

---

## 🚨 Emergency Contacts

**Project Manager:** [Name] - [Phone]  
**Engineering Lead:** [Name] - [Phone]  
**CEO (Shaun):** [Phone]  

**Apple Support:** https://developer.apple.com/contact/  
**EAS Support:** https://expo.dev/support  

---

## 📞 If Things Go Wrong

### App Rejected
1. Read rejection reason carefully
2. Check Apple's Review Guidelines
3. Fix issue immediately
4. Resubmit within 24 hours
5. Escalate if rejection seems unfair

### App Crashes Post-Launch
1. Collect crash reports
2. Identify root cause
3. Fix immediately
4. Submit v1.0.2 emergency update
5. Notify affected users

### Privacy Policy Issues
1. Update policy immediately
2. Notify Apple of changes
3. Update app if needed
4. Document changes

### Demo Account Locked
1. Reset password immediately
2. Test login works
3. Notify Apple if during review
4. Update documentation

---

## ✅ Success Criteria

### Phase 3 Complete When:
- ✅ App submitted to Apple
- ✅ Status = "Waiting for Review"

### Ultimate Success:
- 🎉 App LIVE on App Store
- 🎉 50+ downloads in Week 1
- 🎉 4.5+ star rating
- 🎉 Zero critical bugs
- 🎉 Positive user reviews

---

**Current Status:** 📝 Documentation complete, version locked  
**Next Action:** Tag git release and run production build  
**Days Until Submission:** 4 days  
**Days Until Launch:** 9 days

**Let's ship this! 🚀**
