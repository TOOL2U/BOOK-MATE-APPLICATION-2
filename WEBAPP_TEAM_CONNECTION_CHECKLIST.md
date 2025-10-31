# 🔧 Webapp Team - Mobile App Connection Checklist

**To:** Mobile App Team & Project Manager  
**From:** Webapp Development Team  
**Date:** October 30, 2025  
**Subject:** Everything Mobile Team Needs to Connect to Webapp Backend

---

## 📋 PM's Directive - Acknowledged ✅

**Objective:** Ensure mobile app is fully connected and synced to webapp backend  
**Focus:** Provide mobile team with everything they need  
**Next Step:** Run connection tests together

---

## 🌐 **PRODUCTION API BASE URL**

### **Primary Endpoint:**
```
https://accounting-buddy-app.vercel.app
```

**Status:** ✅ Live and deployed on Vercel  
**SSL:** ✅ HTTPS enabled  
**CORS:** ✅ Configured for mobile apps

---

## 🔑 **AUTHENTICATION (Current Status)**

### **No Authentication Required (For Now)**

**Current Status:** All endpoints are **PUBLIC** (no auth required)

**What This Means:**
- ✅ Mobile app can call all endpoints without tokens
- ✅ No API keys needed in mobile app
- ✅ No login required

**Future (Dec 1, 2025):** JWT authentication will be required

---

## 📡 **ALL 8 API ENDPOINTS - READY FOR MOBILE**

### **1. OCR - Extract Text from Receipt Image**

**Endpoint:** `POST /api/ocr`

**Request:**
```bash
curl -X POST https://accounting-buddy-app.vercel.app/api/ocr \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  }'
```

**Response:**
```json
{
  "text": "TESCO LOTUS\nDate: 30/10/2025\nTotal: 450.00 THB"
}
```

**Status:** ✅ Working  
**Rate Limit:** None  
**Timeout:** 30 seconds

---

### **2. Extract - AI Field Extraction**

**Endpoint:** `POST /api/extract`

**Request:**
```bash
curl -X POST https://accounting-buddy-app.vercel.app/api/extract \
  -H "Content-Type: application/json" \
  -d '{
    "text": "TESCO LOTUS\nDate: 30/10/2025\nTotal: 450.00 THB"
  }'
```

**Response:**
```json
{
  "date": "2025-10-30",
  "detail": "TESCO LOTUS",
  "debit": 450,
  "credit": 0,
  "typeOfOperation": "EXP - Groceries & Food",
  "property": "Shaun Ducker - Personal",
  "typeOfPayment": "Cash",
  "ref": ""
}
```

**Status:** ✅ Working  
**Rate Limit:** None  
**Timeout:** 30 seconds

---

### **3. Sheets - Submit Transaction**

**Endpoint:** `POST /api/sheets`

**Request:**
```bash
curl -X POST https://accounting-buddy-app.vercel.app/api/sheets \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-10-30",
    "property": "Shaun Ducker - Personal",
    "typeOfOperation": "EXP - Groceries & Food",
    "detail": "TESCO LOTUS - Groceries",
    "ref": "",
    "debit": 450,
    "credit": 0,
    "typeOfPayment": "Cash"
  }'
```

**Response:**
```json
{
  "ok": true,
  "message": "Data appended successfully",
  "rowNumber": 156
}
```

**Status:** ✅ Working  
**Rate Limit:** None  
**Timeout:** 30 seconds

---

### **4. Inbox - Get All Transactions**

**Endpoint:** `GET /api/inbox`

**Request:**
```bash
curl https://accounting-buddy-app.vercel.app/api/inbox
```

**Response:**
```json
{
  "ok": true,
  "data": [
    {
      "rowNumber": 156,
      "date": "2025-10-30",
      "property": "Shaun Ducker - Personal",
      "typeOfOperation": "EXP - Groceries & Food",
      "detail": "TESCO LOTUS - Groceries",
      "ref": "",
      "debit": 450,
      "credit": 0,
      "typeOfPayment": "Cash"
    }
  ],
  "count": 1
}
```

**Status:** ✅ Working  
**Rate Limit:** None  
**Timeout:** 30 seconds

---

### **5. Inbox - Delete Transaction**

**Endpoint:** `DELETE /api/inbox`

**Request:**
```bash
curl -X DELETE https://accounting-buddy-app.vercel.app/api/inbox \
  -H "Content-Type: application/json" \
  -d '{
    "rowNumber": 156
  }'
```

**Response:**
```json
{
  "ok": true,
  "message": "Entry deleted successfully"
}
```

**Status:** ✅ Working  
**Rate Limit:** None  
**Timeout:** 30 seconds

---

### **6. P&L - Get KPI Data**

**Endpoint:** `GET /api/pnl`

**Request:**
```bash
curl https://accounting-buddy-app.vercel.app/api/pnl
```

**Response:**
```json
{
  "ok": true,
  "data": {
    "monthKPIs": {
      "totalRevenue": 125000,
      "totalExpenses": 45000,
      "netProfit": 80000,
      "profitMargin": 64
    },
    "yearKPIs": {
      "totalRevenue": 1250000,
      "totalExpenses": 450000,
      "netProfit": 800000,
      "profitMargin": 64
    }
  }
}
```

**Status:** ⚠️ Needs Vercel env var: `SHEETS_PNL_URL`  
**Rate Limit:** None  
**Timeout:** 30 seconds

---

### **7. Balance - Get All Balances**

**Endpoint:** `GET /api/balance/get`

**Request:**
```bash
curl https://accounting-buddy-app.vercel.app/api/balance/get
```

**Response:**
```json
{
  "balances": [
    {
      "bankName": "Bangkok Bank - Shaun Ducker",
      "balance": 50000,
      "date": "2025-10-30"
    },
    {
      "bankName": "Bangkok Bank - Maria Ren",
      "balance": 25000,
      "date": "2025-10-30"
    }
  ]
}
```

**Status:** ⚠️ Needs Vercel env var: `SHEETS_BALANCES_GET_URL`  
**Rate Limit:** None  
**Timeout:** 30 seconds

---

### **8. Balance - Save Balance Entry**

**Endpoint:** `POST /api/balance/save`

**Request:**
```bash
curl -X POST https://accounting-buddy-app.vercel.app/api/balance/save \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-10-30",
    "bankName": "Bangkok Bank - Shaun Ducker",
    "balance": 50000
  }'
```

**Response:**
```json
{
  "ok": true,
  "message": "Balance saved successfully"
}
```

**Status:** ⚠️ Needs Vercel env var: `SHEETS_BALANCES_APPEND_URL`  
**Rate Limit:** None  
**Timeout:** 30 seconds

---

## ⚠️ **CURRENT ISSUES - NEED TO FIX**

### **Issue: 3 Endpoints Need Environment Variables on Vercel**

**Affected Endpoints:**
1. ❌ `GET /api/pnl` - Missing `SHEETS_PNL_URL`
2. ❌ `GET /api/balance/get` - Missing `SHEETS_BALANCES_GET_URL`
3. ❌ `POST /api/balance/save` - Missing `SHEETS_BALANCES_APPEND_URL`

**Error Response (Current):**
```json
{
  "ok": false,
  "error": "P&L endpoint not configured. Please set SHEETS_PNL_URL in environment variables."
}
```

**Solution:** Add these to Vercel (all with SAME value):
```bash
SHEETS_PNL_URL=https://script.google.com/macros/s/AKfycbwRMGdzvsn3-3JhlUA8cVMeX5gySIJzTMJu1hywgPAT2_QiVKj-3KJfFScHhDQwFtKC/exec

SHEETS_BALANCES_GET_URL=https://script.google.com/macros/s/AKfycbwRMGdzvsn3-3JhlUA8cVMeX5gySIJzTMJu1hywgPAT2_QiVKj-3KJfFScHhDQwFtKC/exec

SHEETS_BALANCES_APPEND_URL=https://script.google.com/macros/s/AKfycbwRMGdzvsn3-3JhlUA8cVMeX5gySIJzTMJu1hywgPAT2_QiVKj-3KJfFScHhDQwFtKC/exec
```

**Timeline:** 15 minutes (configure + redeploy + test)

---

## ✅ **WHAT MOBILE TEAM HAS (CONFIRMED)**

Based on their update, mobile team already has:

1. ✅ **API Base URL:** `https://accounting-buddy-app.vercel.app`
2. ✅ **All 8 endpoint paths** (from API integration guide)
3. ✅ **Request/response formats** (from API integration guide)
4. ✅ **Dropdown values** (all 33 categories, 7 properties, 4 payment types)
5. ✅ **Error handling** (retry logic with exponential backoff)
6. ✅ **Timeout handling** (30-second timeout per request)

---

## 📝 **WHAT MOBILE TEAM NEEDS FROM US**

### **Immediate Needs:**

1. ✅ **Confirm API base URL is correct**
   - Answer: `https://accounting-buddy-app.vercel.app` ✅

2. ⏳ **Fix 3 endpoints that return "not configured" errors**
   - Action: Configure Vercel environment variables (webapp team doing this now)

3. ✅ **Confirm no API keys needed in mobile app**
   - Answer: No API keys needed (all endpoints are public) ✅

4. ✅ **Confirm CORS is enabled for mobile apps**
   - Answer: CORS is enabled ✅

5. ✅ **Confirm request/response formats are correct**
   - Answer: All formats in API guide are correct ✅

---

## 🧪 **CONNECTION TESTS - READY TO RUN**

### **Test Plan (Mobile Team & Webapp Team Together)**

**Test 1: OCR Endpoint** ✅
```bash
curl -X POST https://accounting-buddy-app.vercel.app/api/ocr \
  -H "Content-Type: application/json" \
  -d '{"image": "data:image/jpeg;base64,..."}'
```
**Expected:** 200 OK with extracted text  
**Status:** Ready to test

---

**Test 2: Extract Endpoint** ✅
```bash
curl -X POST https://accounting-buddy-app.vercel.app/api/extract \
  -H "Content-Type: application/json" \
  -d '{"text": "TESCO LOTUS\nTotal: 450 THB"}'
```
**Expected:** 200 OK with structured JSON  
**Status:** Ready to test

---

**Test 3: Submit Transaction** ✅
```bash
curl -X POST https://accounting-buddy-app.vercel.app/api/sheets \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-10-30",
    "property": "Shaun Ducker - Personal",
    "typeOfOperation": "EXP - Groceries & Food",
    "detail": "Test from mobile app",
    "ref": "MOBILE-TEST-001",
    "debit": 100,
    "credit": 0,
    "typeOfPayment": "Cash"
  }'
```
**Expected:** 200 OK with row number  
**Status:** Ready to test

---

**Test 4: Get Inbox** ✅
```bash
curl https://accounting-buddy-app.vercel.app/api/inbox
```
**Expected:** 200 OK with array of transactions  
**Status:** Ready to test

---

**Test 5: Delete Transaction** ✅
```bash
curl -X DELETE https://accounting-buddy-app.vercel.app/api/inbox \
  -H "Content-Type: application/json" \
  -d '{"rowNumber": 156}'
```
**Expected:** 200 OK with success message  
**Status:** Ready to test

---

**Test 6: Get P&L** ⚠️
```bash
curl https://accounting-buddy-app.vercel.app/api/pnl
```
**Expected:** 200 OK with KPI data  
**Status:** ⚠️ Waiting for Vercel env var configuration

---

**Test 7: Get Balances** ⚠️
```bash
curl https://accounting-buddy-app.vercel.app/api/balance/get
```
**Expected:** 200 OK with balance array  
**Status:** ⚠️ Waiting for Vercel env var configuration

---

**Test 8: Save Balance** ⚠️
```bash
curl -X POST https://accounting-buddy-app.vercel.app/api/balance/save \
  -H "Content-Type: application/json" \
  -d '{"date": "2025-10-30", "bankName": "Bangkok Bank - Shaun Ducker", "balance": 50000}'
```
**Expected:** 200 OK with success message  
**Status:** ⚠️ Waiting for Vercel env var configuration

---

## 🎯 **ACTION ITEMS**

### **For Webapp Team (Us) - URGENT:**

- [ ] **Configure Vercel Environment Variables** (15 minutes)
  - Add `SHEETS_PNL_URL`
  - Add `SHEETS_BALANCES_GET_URL`
  - Add `SHEETS_BALANCES_APPEND_URL`
  - All with same value as `SHEETS_WEBHOOK_URL`

- [ ] **Wait for Vercel Redeploy** (2 minutes)

- [ ] **Test All 8 Endpoints** (10 minutes)
  - Run all cURL commands above
  - Verify responses
  - Document any errors

- [ ] **Notify Mobile Team & PM** (5 minutes)
  - Confirm all endpoints working
  - Provide test results
  - Ready for mobile team testing

**Total Time:** 32 minutes

---

### **For Mobile Team - AFTER Webapp Team Completes Above:**

- [ ] **Test All 8 Endpoints from Mobile App**
  - Use actual mobile app (not cURL)
  - Test each screen/feature
  - Document any errors

- [ ] **Submit Test Transaction**
  - Use Upload Receipt flow
  - Verify appears in Google Sheets
  - Check data formatting

- [ ] **Submit Manual Entry**
  - Use Manual Entry screen
  - Test all dropdown pickers
  - Verify appears in Google Sheets

- [ ] **Test Balance Screen**
  - Fetch balances
  - Save new balance
  - Verify appears in Google Sheets

- [ ] **Test P&L Dashboard**
  - Fetch KPI data
  - Verify numbers match Google Sheets

- [ ] **Test Inbox**
  - Fetch all transactions
  - Delete a transaction
  - Verify deleted from Google Sheets

- [ ] **Report Results to PM & Webapp Team**

---

## 📊 **SUMMARY FOR PM**

### **Current Status:**

**Working Endpoints:** 5/8 (62.5%)
- ✅ OCR
- ✅ Extract
- ✅ Submit Transaction
- ✅ Get Inbox
- ✅ Delete Transaction

**Blocked Endpoints:** 3/8 (37.5%)
- ⚠️ Get P&L (needs env var)
- ⚠️ Get Balances (needs env var)
- ⚠️ Save Balance (needs env var)

**Root Cause:** Missing environment variables on Vercel

**Solution:** Configure 3 environment variables (all with same webhook URL)

**Timeline:** 32 minutes total

**Next Steps:**
1. Webapp team configures Vercel (15 min)
2. Webapp team tests all endpoints (10 min)
3. Mobile team tests from mobile app (30 min)
4. Both teams report results to PM

---

## ✅ **WEBAPP TEAM COMMITMENT**

**We commit to:**
1. ✅ Configure missing environment variables within 30 minutes
2. ✅ Test all 8 endpoints and verify they work
3. ✅ Provide mobile team with test results
4. ✅ Be available for joint testing session
5. ✅ Fix any issues discovered during testing

**We are ready to start NOW!**

---

**— Webapp Development Team**  
**Status:** Ready to Configure Vercel ✅  
**ETA:** All endpoints working in 30 minutes

