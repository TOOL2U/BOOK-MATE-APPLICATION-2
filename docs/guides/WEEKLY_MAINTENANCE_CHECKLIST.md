# BookMate Weekly Maintenance Checklist

**Purpose:** Weekly health check for BookMate iOS app  
**Frequency:** Every Monday morning  
**Owner:** [Assign name]  
**Estimated Time:** 30-45 minutes

---

## Week of: __________
**Completed by:** _______________  
**Date completed:** _______________

---

## 1. App Store Health

### Downloads & Impressions
- [ ] **Check App Store Connect → Analytics**
  - **Impressions:** ________ (last week: ________)
  - **Product Page Views:** ________ (last week: ________)
  - **Downloads:** ________ (last week: ________)
  - **Conversion Rate:** ________% (target: >3%)
  - **Week-over-week change:** +/- ________%

### Crash Metrics
- [ ] **Check App Store Connect → Crashes**
  - **Crash-free users:** ________% (target: >99.5%) 🟢/🟡/🔴
  - **Crashes per session:** ________ (target: <0.1%)
  - **New crash types this week:** ________
  - **Most common crash:** ___________________________
  - **Action taken:** ___________________________

### Ratings & Reviews
- [ ] **Check App Store Connect → Ratings and Reviews**
  - **Total reviews:** ________
  - **New reviews this week:** ________
  - **Average rating (all time):** ⭐ ________ / 5.0
  - **Average rating (this version):** ⭐ ________ / 5.0
  - **5-star reviews:** ________
  - **4-star reviews:** ________
  - **3-star reviews:** ________
  - **2-star reviews:** ________
  - **1-star reviews:** ________

- [ ] **Responded to negative reviews (<4 stars):** ✅ / ❌
  - Response rate: ________%
  - Average response time: ________ hours

- [ ] **Flagged inappropriate reviews:** ✅ / ❌
  - Number flagged: ________

**Top 3 Review Themes:**
1. ________________________________________________________
2. ________________________________________________________
3. ________________________________________________________

---

## 2. Firebase Monitoring

### Analytics
- [ ] **Firebase Console → Analytics → Dashboard**
  - **Daily Active Users (DAU):** ________ (avg this week)
  - **Weekly Active Users (WAU):** ________
  - **New Users:** ________
  - **Session Duration:** ________ minutes (target: >2 min)
  - **Sessions per User:** ________ (target: >3)
  - **Retention (Day 1):** ________% (target: >40%)
  - **Retention (Day 7):** ________% (target: >20%)

- [ ] **Most Used Features (by event count):**
  1. ________________________________________ (________ events)
  2. ________________________________________ (________ events)
  3. ________________________________________ (________ events)
  4. ________________________________________ (________ events)
  5. ________________________________________ (________ events)

- [ ] **Feature Adoption:**
  - Receipt Scan: ________% of users (target: >70%)
  - Manual Entry: ________% of users (target: >60%)
  - P&L Reports: ________% of users (target: >50%)
  - Transfer: ________% of users (target: >30%)

### Crashlytics
- [ ] **Firebase Console → Crashlytics**
  - **Crash-free users:** ________% (target: >99.5%)
  - **New crashes this week:** ________
  - **Total crash events:** ________
  - **Users affected:** ________
  - **Most common crash:** ___________________________
    - **Occurs in:** ___________________________
    - **Affected versions:** ___________________________
    - **Priority:** Critical / High / Medium / Low
    - **Action taken:** ___________________________

### Performance (if enabled)
- [ ] **Firebase Console → Performance**
  - **App Startup Time:** ________ ms (target: <2000ms)
  - **Screen Render Time:** ________ ms (target: <500ms)
  - **Network Request Success Rate:** ________% (target: >99%)
  - **Slowest API endpoints:**
    1. ________________________________________ (________ ms)
    2. ________________________________________ (________ ms)
    3. ________________________________________ (________ ms)

**Performance Issues Identified:**
- ____________________________________________________________
- ____________________________________________________________

---

## 3. Backend API Health

### API Status
- [ ] **Check Backend Logs** (https://accounting.siamoon.com/api)
  - **Total API Requests:** ________
  - **4xx Errors:** ________ (________%)
  - **5xx Errors:** ________ (________%)
  - **Average Response Time:** ________ ms

### Endpoint Verification
- [ ] **Test Critical Endpoints:**
  - `GET /balance`: ✅ / ❌ (________ ms)
  - `GET /pl-data`: ✅ / ❌ (________ ms)
  - `POST /upload-receipt`: ✅ / ❌ (________ ms)
  - `POST /manual-entry`: ✅ / ❌ (________ ms)
  - `POST /transfer`: ✅ / ❌ (________ ms)

- [ ] **Slowest Endpoints (>2s):**
  1. ________________________________________________________
  2. ________________________________________________________
  3. ________________________________________________________

### Security
- [ ] **Webhook secret rotation needed:** ✅ / ❌
  - Last rotated: _______________
  - Next rotation: _______________

- [ ] **SSL certificate status:** Valid / Expiring soon / Expired
  - Expires: _______________

---

## 4. User Support

### Email Support
- [ ] **Check support@bookmate.app inbox**
  - **New emails this week:** ________
  - **All responded to:** ✅ / ❌
  - **Pending responses:** ________
  - **Average response time:** ________ hours (target: <24h)

- [ ] **Email Categories:**
  - **Bug reports:** ________
  - **Feature requests:** ________
  - **How-to questions:** ________
  - **Billing/account issues:** ________
  - **Praise/compliments:** ________
  - **Other:** ________

### Feedback Form
- [ ] **Check bookmate.app/feedback submissions**
  - **New submissions:** ________
  - **Logged in FEEDBACK_LOG.md:** ✅ / ❌

### Social Media (if applicable)
- [ ] **Check mentions on:**
  - **Twitter/X:** ________ mentions
  - **Facebook:** ________ mentions
  - **LinkedIn:** ________ mentions
  - **All responded to:** ✅ / ❌

**Most Common Support Question:**
____________________________________________________________

**Action:** Update FAQ / Create help article / Fix bug

---

## 5. Bug Triage

### Reported Bugs
- [ ] **Review bugs from all sources:**
  - User emails: ________ bugs
  - App Store reviews: ________ bugs
  - Crash logs: ________ bugs
  - Internal testing: ________ bugs
  - **Total new bugs:** ________

### Prioritization
- [ ] **Prioritize by severity:**
  - **Critical (app-breaking):** ________ bugs
    - [ ] ________________________________________________
    - [ ] ________________________________________________
  - **High (major features broken):** ________ bugs
    - [ ] ________________________________________________
    - [ ] ________________________________________________
  - **Medium (annoyances):** ________ bugs
    - [ ] ________________________________________________
    - [ ] ________________________________________________
  - **Low (cosmetic):** ________ bugs
    - [ ] ________________________________________________
    - [ ] ________________________________________________

### Actions Taken
- [ ] **Created GitHub/Jira issues:** ✅ / ❌
  - Issues created: ________
  - Links: ________________________________________________

- [ ] **Scheduled for v1.0.2 patch:** ✅ / ❌
  - Bugs included: ________

---

## 6. Feature Requests

### New Requests
- [ ] **Review feature requests from:**
  - Feedback form: ________ requests
  - Support emails: ________ requests
  - App Store reviews: ________ requests
  - Internal ideas: ________ requests

### Top Requested Features
1. ________________________________________ (________ mentions)
2. ________________________________________ (________ mentions)
3. ________________________________________ (________ mentions)
4. ________________________________________ (________ mentions)
5. ________________________________________ (________ mentions)

### Roadmap Update
- [ ] **Added to v1.1 roadmap:** ✅ / ❌
  - Features prioritized: ________

- [ ] **Shared with product team:** ✅ / ❌

---

## 7. Security & Compliance

### Dependencies
- [ ] **Check for outdated/vulnerable packages:**
  ```bash
  npm outdated
  npm audit
  ```
  - **Outdated packages:** ________
  - **Security vulnerabilities:** ________ (Critical: ____, High: ____, Medium: ____, Low: ____)
  - **Action required:** ✅ / ❌
  - **Update scheduled for:** _______________

### Website Status
- [ ] **Verify all URLs are accessible:**
  - https://bookmate.app: ✅ / ❌
  - https://bookmate.app/support: ✅ / ❌
  - https://bookmate.app/privacy: ✅ / ❌
  - https://bookmate.app/download: ✅ / ❌
  - https://bookmate.app/feedback: ✅ / ❌

- [ ] **SSL Certificate Valid:** ✅ / ❌
  - Expires: _______________

### Compliance
- [ ] **Privacy policy up-to-date:** ✅ / ❌
- [ ] **Terms of service up-to-date:** ✅ / ❌
- [ ] **App Store metadata accurate:** ✅ / ❌

---

## 8. Patch Planning (v1.0.2)

### Patch Status
- [ ] **Bugs queued for v1.0.2:** ________ bugs
- [ ] **Critical bugs requiring immediate patch:** ________ bugs
- [ ] **Estimated release date:** _______________
- [ ] **Changelog drafted:** ✅ / ❌

### Testing Plan
- [ ] **QA assigned:** _______________
- [ ] **Test cases prepared:** ✅ / ❌
- [ ] **TestFlight beta ready:** ✅ / ❌

---

## 9. Summary

### Overall App Health
**Status:** 🟢 Healthy / 🟡 Needs Attention / 🔴 Critical

**Reasoning:**
____________________________________________________________
____________________________________________________________

### Key Wins This Week
1. ____________________________________________________________
2. ____________________________________________________________
3. ____________________________________________________________

### Key Concerns This Week
1. ____________________________________________________________
2. ____________________________________________________________
3. ____________________________________________________________

### Action Items for Next Week
- [ ] ____________________________________________________________
- [ ] ____________________________________________________________
- [ ] ____________________________________________________________
- [ ] ____________________________________________________________

### Metrics Dashboard (Quick View)

| Metric | This Week | Last Week | Change | Target | Status |
|--------|-----------|-----------|--------|--------|--------|
| Downloads | ________ | ________ | ±____% | 50+ | 🟢/🟡/🔴 |
| DAU | ________ | ________ | ±____% | 30+ | 🟢/🟡/🔴 |
| Crash-free % | ______% | ______% | ±____% | >99.5% | 🟢/🟡/🔴 |
| Avg Rating | ⭐____ | ⭐____ | ±____ | >4.5 | 🟢/🟡/🔴 |
| Support Emails | ________ | ________ | ±____% | <10 | 🟢/🟡/🔴 |

---

## 10. Notes & Observations

**Additional Comments:**
____________________________________________________________
____________________________________________________________
____________________________________________________________
____________________________________________________________

**Questions for Team:**
____________________________________________________________
____________________________________________________________

**Blockers:**
____________________________________________________________
____________________________________________________________

---

## ✅ Sign-Off

**Checklist Completed By:** _______________  
**Date:** _______________  
**Time Spent:** ________ minutes

**Reviewed By (Manager/PM):** _______________  
**Date:** _______________

**Next Review Date:** _______________

---

## 📊 Historical Data (For Trend Analysis)

| Week | Downloads | DAU | Crash-free % | Rating | Notes |
|------|-----------|-----|--------------|--------|-------|
| Nov 20-27 | ________ | ____ | ______% | ⭐____ | ________________ |
| Nov 28-Dec 4 | ________ | ____ | ______% | ⭐____ | ________________ |
| Dec 5-11 | ________ | ____ | ______% | ⭐____ | ________________ |
| Dec 12-18 | ________ | ____ | ______% | ⭐____ | ________________ |

---

**Template Version:** 1.0  
**Last Updated:** November 11, 2025  
**For:** BookMate iOS v1.0.1+
