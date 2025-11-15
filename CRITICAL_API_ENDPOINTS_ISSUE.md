# 🚨 CRITICAL: API Endpoints Don't Match Documentation

**Date:** November 14, 2025  
**Status:** 🔴 BLOCKED - Need Webapp Team Response

---

## 🐛 Problem Summary

The webapp team's documentation is **completely incorrect**:

1. ❌ Wrong password in documentation
2. ❌ Wrong API response format
3. ❌ **CRITICAL**: Endpoints don't accept JWT tokens or don't exist!

---

## 🧪 Test Results

### Login Works ✅
```bash
POST https://accounting.siamoon.com/api/auth/login
Credentials: maria@siamoon.com / Alesiamay231!
Response: {
  "success": true,
  "tokens": {
    "accessToken": "eyJ..."
  }
}
```

### But Data Endpoints Fail ❌
```bash
GET https://accounting.siamoon.com/api/options
Headers: Authorization: Bearer eyJ...
Response: 401 {"ok":false,"error":"Not authenticated"}
```

**Token is valid but endpoint rejects it!**

---

## 📊 What We Discovered

### Documentation Said:
```
Password: Alesiamaya231  ❌ WRONG
Token path: data.token  ❌ WRONG
User ID: user.uid  ❌ WRONG
Endpoints: /api/options, /api/balance, etc. ❌ DON'T WORK WITH JWT
```

### Reality:
```
Password: Alesiamay231!  ✅ CORRECT (we found this ourselves)
Token path: data.tokens.accessToken  ✅ CORRECT (we adapted)
User ID: user.id  ✅ CORRECT (we adapted)
Endpoints: ??? ❓ UNKNOWN - Don't accept JWT tokens!
```

---

## 🔍 Possible Issues

### Theory 1: Endpoints Don't Exist Yet
The multi-tenant API endpoints (`/api/options`, `/api/balance`, etc.) might not be implemented yet on the server.

### Theory 2: Different Base URL
Maybe these endpoints are at a different URL than `/api/*`?

### Theory 3: Different Authentication
Maybe these endpoints use a different auth method (API key, session cookie, etc.)?

### Theory 4: Mobile-Specific Endpoints
Maybe there are mobile-specific endpoints like `/mobile/api/options`?

---

## ❓ Questions for Webapp Team

### URGENT - Please Answer:

1. **What is the ACTUAL base URL for mobile app data endpoints?**
   - Is it `https://accounting.siamoon.com/api/...`?
   - Or something else?

2. **What are the ACTUAL endpoint paths?**
   - Get options/dropdown data: `GET /api/...` ?
   - Get balance data: `GET /api/...` ?
   - Get P&L data: `GET /api/...` ?
   - Get transactions: `GET /api/...` ?
   - Submit transaction: `POST /api/...` ?

3. **Do these endpoints accept JWT Bearer tokens?**
   - If YES: Why is `/api/options` returning 401?
   - If NO: What authentication method should we use?

4. **Can you test these endpoints yourself?**
   ```bash
   # Login
   curl -X POST https://accounting.siamoon.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"maria@siamoon.com","password":"Alesiamay231!"}'
   
   # Get token from response, then:
   curl https://accounting.siamoon.com/api/options \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```
   What do you get?

5. **Is the multi-tenant API actually deployed?**
   - The login endpoint works
   - But data endpoints don't
   - Are they on different servers?

6. **Can you provide a working example?**
   - Postman collection?
   - cURL commands that actually work?
   - Actual endpoint URLs and request/response examples?

---

## 📋 What We've Tried

### ✅ What Works:
1. Login endpoint: `POST /api/auth/login` ✅
2. Token extraction: `tokens.accessToken` ✅
3. Token storage: AsyncStorage ✅
4. Token injection: `Authorization: Bearer <token>` ✅

### ❌ What Doesn't Work:
1. `GET /api/options` → 401
2. `GET /api/balance` → 401
3. `GET /api/pnl` → 401
4. `GET /api/transactions` → 401
5. ALL data endpoints return "Not authenticated"

---

## 🎯 What We Need

### From Webapp Team (URGENT):

1. **Working endpoint documentation**
   - Actual URLs (not documentation URLs)
   - Actual request/response formats (not assumptions)
   - Actual authentication method

2. **Test it yourself first**
   - Please verify endpoints work with the token
   - Share cURL commands that actually succeed
   - Don't send documentation - send working examples!

3. **API specification**
   - OpenAPI/Swagger spec?
   - Postman collection?
   - Working code example?

---

## 🚨 Impact

### Mobile App Status: 🔴 BLOCKED

- ✅ Login screen works
- ✅ Authentication flow works
- ✅ Token management works
- ❌ **Cannot load ANY data** (all endpoints return 401)
- ❌ **Cannot test multi-tenant isolation**
- ❌ **Cannot proceed to production**

### Timeline Impact:

- Originally planned: Test today, submit to Apple tomorrow
- Current status: **BLOCKED** until webapp team provides working endpoints
- New timeline: Unknown (depends on webapp team response)

---

## 📞 Action Required

### Webapp Team: Please Respond ASAP

1. Test the endpoints yourself with the accessToken
2. Share the EXACT working cURL commands
3. Confirm the multi-tenant API is actually deployed
4. If not deployed, give us an ETA

### Mobile Team: Waiting

We've done everything we can with the information provided. The mobile app code is correct - we're successfully:
- Logging in ✅
- Getting tokens ✅
- Storing tokens ✅
- Sending tokens ✅

But the server is rejecting our authenticated requests. This is a server-side issue or documentation issue, not a mobile app issue.

---

## 📧 Contact Info

**Webapp Team Lead:** shaun@siamoon.com  
**Mobile Team:** Ready to test as soon as endpoints work  
**Urgency:** 🔴 HIGH - Blocking production deployment

---

**We need WORKING endpoints, not documentation!** 🙏
