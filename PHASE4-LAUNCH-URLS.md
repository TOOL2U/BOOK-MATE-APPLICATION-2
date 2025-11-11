# BookMate App Store URLs & Resources

**Last Updated:** November 11, 2025  
**Version:** 1.0.1 (Build 2)

---

## 📱 Official App Store URL

**Primary URL:**
```
https://apps.apple.com/app/id[YOUR_APP_ID]
```

> ⚠️ **TODO:** Replace `[YOUR_APP_ID]` with actual Apple ID from App Store Connect after approval.

**How to find your Apple ID:**
1. Login to [App Store Connect](https://appstoreconnect.apple.com)
2. Go to **My Apps** → **BookMate**
3. Look for **Apple ID** under App Information (General Information section)
4. Example: If Apple ID is `6738291045`, your URL becomes:
   ```
   https://apps.apple.com/app/id6738291045
   ```

---

## 🌍 Regional Store URLs

**Thailand:**
```
https://apps.apple.com/th/app/id[YOUR_APP_ID]
```

**United States:**
```
https://apps.apple.com/us/app/id[YOUR_APP_ID]
```

**United Kingdom:**
```
https://apps.apple.com/gb/app/id[YOUR_APP_ID]
```

**Singapore:**
```
https://apps.apple.com/sg/app/id[YOUR_APP_ID]
```

---

## 🔗 Short URLs (Optional)

**Custom Short URL (if eligible):**
```
https://apps.apple.com/app/bookmate
```

> **Note:** Custom short URLs are usually only available for apps with significant downloads or Apple partnership.

**Bitly Short URL (Create after launch):**
```
https://bit.ly/bookmate-app
```

**QR Code Generator:**
- [qr-code-generator.com](https://www.qr-code-generator.com/)
- Input: Your full App Store URL
- Download: 1000×1000px PNG
- Save as: `assets/bookmate-app-qr.png`

---

## 🎨 App Store Marketing Assets

### Download Badge

**Download from Apple:**
[Apple Marketing Resources](https://developer.apple.com/app-store/marketing/guidelines/)

**Badge Files:**
```
assets/
  app-store-badge-en-black.svg
  app-store-badge-en-white.svg
  app-store-badge-th-black.svg
  app-store-badge-th-white.svg
```

**Usage Guidelines:**
- Minimum size: 120×40px
- Recommended size: 156×52px
- Clear space: 1/10 badge height on all sides
- Always link to your App Store page
- Don't modify the badge design

### App Icon

**1024×1024px App Icon:**
```
assets/
  bookmate-app-icon-1024.png
```

**Usage:**
- Website favicon
- Social media profile
- Press kit

### Screenshots

**6.7" iPhone (1290×2796px):**
```
assets/screenshots/
  01-dashboard-6.7.png
  02-pl-report-6.7.png
  03-receipt-scan-6.7.png
  04-manual-entry-6.7.png
  05-property-breakdown-6.7.png
```

**5.5" iPhone (1242×2208px):**
```
assets/screenshots/
  01-dashboard-5.5.png
  02-pl-report-5.5.png
  03-receipt-scan-5.5.png
  04-manual-entry-5.5.png
  05-property-breakdown-5.5.png
```

---

## 📊 App Store Connect Links

**App Store Connect Dashboard:**
```
https://appstoreconnect.apple.com/apps/[YOUR_APP_ID]/appstore
```

**Analytics:**
```
https://appstoreconnect.apple.com/analytics/app/[YOUR_APP_ID]
```

**Ratings & Reviews:**
```
https://appstoreconnect.apple.com/apps/[YOUR_APP_ID]/ratings
```

**TestFlight:**
```
https://appstoreconnect.apple.com/apps/[YOUR_APP_ID]/testflight
```

---

## 🌐 Website Integration URLs

**BookMate Website:**
- Homepage: https://bookmate.app
- Download Page: https://bookmate.app/download
- Support Page: https://bookmate.app/support
- Privacy Policy: https://bookmate.app/privacy
- Feedback Form: https://bookmate.app/feedback

**Sia Moon Website:**
- Homepage: https://siamoon.com
- Products: https://siamoon.com/products or https://siamoon.com/#products
- About: https://siamoon.com/about

---

## 📧 Email & Support

**Support Email:**
```
support@bookmate.app
```

**Auto-Reply Subject:**
```
We received your BookMate support request
```

**Feedback Form:**
```
https://bookmate.app/feedback
```
or
```
https://forms.gle/[YOUR_GOOGLE_FORM_ID]
```

---

## 🔍 Search Keywords

**App Store Search:**
- BookMate
- Sia Moon
- bookkeeping Thailand
- property accounting
- receipt scanner
- P&L report
- business finance

**SEO Keywords (Website):**
- bookkeeping app
- receipt scanning app
- property expense tracking
- P&L report generator
- Thailand accounting app
- Sia Moon BookMate
- automated bookkeeping

---

## 📱 Smart Banner Code

**Add to `<head>` of bookmate.app:**

```html
<!-- iOS Smart App Banner -->
<meta name="apple-itunes-app" content="app-id=[YOUR_APP_ID]">
```

**This will show:**
- A banner at the top of Safari on iOS
- "View in App Store" or "Open in App" (if installed)
- Automatically disappears after user dismisses

---

## 🎯 UTM Tracking Links (Optional)

**For tracking download sources:**

**From Email:**
```
https://apps.apple.com/app/id[YOUR_APP_ID]?pt=123456&ct=email&mt=8
```

**From Social Media:**
```
https://apps.apple.com/app/id[YOUR_APP_ID]?pt=123456&ct=social&mt=8
```

**From Website:**
```
https://apps.apple.com/app/id[YOUR_APP_ID]?pt=123456&ct=website&mt=8
```

> **Note:** Requires Apple Search Ads account for full attribution. Optional for Phase 4.

---

## 📋 Checklist: After Launch

- [ ] Get Apple ID from App Store Connect
- [ ] Update all `[YOUR_APP_ID]` placeholders in this file
- [ ] Create QR code with final URL
- [ ] Download App Store badge (SVG + PNG)
- [ ] Add Smart Banner meta tag to website
- [ ] Test all links work (desktop + mobile)
- [ ] Create Bitly short URL (optional)
- [ ] Share final URLs with team

---

## 📞 Quick Reference

| Resource | URL |
|----------|-----|
| **App Store Listing** | https://apps.apple.com/app/id[YOUR_APP_ID] |
| **TestFlight** | https://testflight.apple.com/join/[CODE] |
| **Support** | support@bookmate.app |
| **Website** | https://bookmate.app |
| **Privacy Policy** | https://bookmate.app/privacy |
| **Feedback Form** | https://bookmate.app/feedback |

---

**Created:** November 11, 2025  
**For:** Phase 4 - Light Launch  
**Next Review:** After App Store approval (Nov 20, 2025)
