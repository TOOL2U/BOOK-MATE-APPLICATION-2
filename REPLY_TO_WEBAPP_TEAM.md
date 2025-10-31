# 📝 Reply to Webapp Team - Documentation Clarifications Needed

**To:** Webapp Development Team  
**From:** Mobile Development Team  
**Date:** October 31, 2025  
**RE:** Your Authentication Clarification Document

---

## ✅ Overall Assessment

Your authentication flow explanation is **mostly correct**, but it needs **two critical clarifications** that are causing the current "Unauthorized" issue.

---

## 🔴 Issue #1: Wrong Base URL in Documentation

### **What You Wrote:**

```bash
curl https://accounting-buddy-app.vercel.app/api/pnl
```

### **The Problem:**

- `accounting-buddy-app.vercel.app` is a **preview/staging deployment**
- That deployment may not have the correct environment variables
- It may have an outdated or incorrect `SHEETS_WEBHOOK_SECRET`

### **What It Should Be:**

```bash
curl https://accounting.siamoon.com/api/pnl
```

### **Why This Matters:**

If the mobile app calls the old preview URL, it will fail authentication because that deployment doesn't have the matching secret.

**✅ ACTION TAKEN:** We've updated the mobile app to use `https://accounting.siamoon.com` in all places.

---

## 🟠 Issue #2: Missing Clarity on "Who Sends the Secret"

### **What You Wrote:**

```javascript
const response = await fetch(SHEETS_WEBHOOK_URL, {
  method: 'POST',
  body: JSON.stringify({
    secret: process.env.SHEETS_WEBHOOK_SECRET  // ← WE add this
  })
});
```

### **The Confusion:**

When you said "WE add this," the mobile team thought: "Do WE (mobile app) need to send that secret?"

### **What You Should Clarify:**

**✅ Please state explicitly:**

1. **This code runs on the Vercel server** (Next.js API route)
2. **The mobile app does NOT send the secret**
3. **The mobile app does NOT need to know the secret**
4. **The mobile app just calls your API, and your API calls Apps Script with the secret**

### **Suggested Wording:**

```
Step 2: Webapp API → Apps Script (Private Call)

Inside the Next.js API route on Vercel (NOT in the mobile app), 
we call the Google Apps Script webhook.

The mobile app never sees or sends the secret. The server handles this.
```

---

## ✅ Issue #3: Your Step 3 is Correct

Your explanation of Apps Script validation is **correct**:

```javascript
if (data.secret !== WEBHOOK_SECRET) {
  return { ok: false, error: 'Unauthorized' };
}
```

This confirms the "Unauthorized" error is happening because:
- The Next.js API IS talking to Apps Script ✅
- But Apps Script is rejecting the secret it received ❌

---

## ✅ Issue #4: Your Step 4 is Correct

Your data flow is **correct**:

```
Google Sheets → Apps Script → Next.js API → Mobile App
```

This matches the architecture.

---

## 🎯 What We Need From You

### **Please Update Your Documentation:**

**1. Change all references from:**
```
https://accounting-buddy-app.vercel.app
```

**To:**
```
https://accounting.siamoon.com
```

**2. Add explicit clarification:**
- "The mobile app does NOT send the secret"
- "The server (Vercel) sends the secret to Apps Script"
- "The mobile app just calls the public API endpoints"

**3. Add a section on secret matching:**
- The secret in Vercel must **exactly** match the secret in Apps Script
- Byte-for-byte identical
- No extra spaces, newlines, or missing characters

---

## 📊 Root Cause Analysis

### **Why We're Seeing "Unauthorized":**

**Hypothesis 1:** Mobile app was calling wrong deployment ✅ **FIXED**
- Mobile app now uses `https://accounting.siamoon.com`

**Hypothesis 2:** Secret mismatch between Vercel and Apps Script ⏳ **NEEDS PM**
- The secret in Vercel: `VqwvzpO3Ja5Yn+qhWg6DLwTspv/t2V8f3CXI+iJ9Dz8=`
- The secret in Apps Script: `???` (needs verification)

### **Next Steps:**

1. ✅ Mobile app updated to production domain
2. ⏳ PM verifies Apps Script secret matches Vercel exactly
3. ⏳ Test all endpoints after PM confirms match

---

## 🧪 Testing After PM Fixes Secret

### **Test Commands (Using Correct Domain):**

```bash
# Test 1: P&L
curl https://accounting.siamoon.com/api/pnl

# Test 2: Balance
curl https://accounting.siamoon.com/api/balance/get

# Test 3: Inbox
curl https://accounting.siamoon.com/api/inbox
```

**Expected:** JSON data (not "Unauthorized")

---

## ✅ Summary for Webapp Team

### **Your Documentation Was:**
- ✅ Conceptually correct
- ✅ Accurate about the authentication flow
- ✅ Helpful in understanding the architecture

### **But It Needed:**
- ❌ Correct production domain (not preview domain)
- ❌ Explicit clarity that mobile app doesn't send the secret
- ❌ Warning about exact secret matching

### **We've Fixed:**
- ✅ Mobile app base URL updated to `https://accounting.siamoon.com`
- ✅ All configuration files updated
- ✅ Development server restarted

### **Still Needed:**
- ⏳ PM verifies Apps Script secret matches Vercel
- ⏳ Your team updates documentation with clarifications above

---

## 📞 Communication

### **Our Status:**
✅ Mobile app ready  
✅ Calling correct production domain  
✅ Waiting for Apps Script secret verification  

### **Your Next Action:**
1. Update documentation with correct domain
2. Add explicit clarifications about who sends the secret
3. Test endpoints after PM confirms Apps Script secret

### **PM Next Action:**
1. Verify Apps Script secret is exactly: `VqwvzpO3Ja5Yn+qhWg6DLwTspv/t2V8f3CXI+iJ9Dz8=`
2. Test with curl commands above
3. Notify teams when working

---

**Thanks for the clear explanation!** Just needed these two tweaks to prevent confusion.

**Mobile Development Team**  
**Status:** Ready and waiting for Apps Script secret verification  
**Confidence:** High - We're on the right track now!
