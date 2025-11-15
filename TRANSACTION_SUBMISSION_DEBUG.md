# Transaction Submission Debug Guide

## Issue
Manual entry shows success message but transaction doesn't appear in:
- P&L spreadsheet
- Recent Activity feed

## Current Implementation

### 1. Transaction Submission Flow
```
User fills form → WizardManualEntry/ManualEntryScreen
                ↓
         apiService.submitTransaction(data)
                ↓
         apiService.postSheets(data)
                ↓
         POST /api/sheets (with JWT auth)
                ↓
         Backend processes request
                ↓
         Google Sheets API writes to P&L sheet
```

### 2. Transaction Retrieval Flow
```
Recent Activity Screen → apiService.getInbox()
                       ↓
                GET /api/inbox (with JWT auth)
                       ↓
                Backend reads from Google Sheets
                       ↓
                Returns TransactionWithRow[] array
```

## Diagnostic Steps

### Step 1: Check Console Logs
After adding a transaction, check the React Native console for:
```
🚀 Submitting transaction to POST /api/sheets: { ... }
📥 Response from POST /api/sheets: { ... }
✅ Transaction submission SUCCESSFUL: ...
```

**What to look for:**
- Is the transaction data correct? (day, month, year, property, typeOfOperation, typeOfPayment, detail, debit/credit)
- Does the response say `{ ok: true }` or `{ success: true }`?
- Is there an error message in the response?

### Step 2: Verify Transaction Data Format
The transaction must have this structure:
```typescript
{
  day: "15",           // Current day as string
  month: "NOV",        // Month abbreviation (JAN, FEB, etc.)
  year: "2025",        // Year as string
  property: "Family",  // Must match an option from /api/options
  typeOfOperation: "Revenue - Consulting", // Must match category from /api/options
  typeOfPayment: "Bank Transfer - Krung Thai", // Must match payment type
  detail: "Test transaction",
  ref: "",             // Reference (optional)
  debit: 0,            // Expense amount (0 if revenue)
  credit: 1000         // Revenue amount (0 if expense)
}
```

### Step 3: Check Backend Server Logs
If you have access to the backend server (https://accounting.siamoon.com), check:
1. Is the POST request being received?
2. Is it authenticated (JWT token valid)?
3. Is it writing to Google Sheets successfully?
4. Are there any Google Sheets API errors?

### Step 4: Verify Google Sheets
Manually check the P&L Google Sheet:
1. Open the spreadsheet
2. Look for the "P&L" sheet tab
3. Check if new rows are being added
4. Verify the data format matches what the API expects

### Step 5: Test /api/inbox Response
After submitting a transaction:
1. Wait 2-3 seconds
2. Pull to refresh on Recent Activity screen
3. Check console for: `GET /api/inbox` response
4. Verify if the new transaction appears in the response data

## Possible Issues & Solutions

### Issue 1: Backend Returns Success But Doesn't Write
**Symptom:** API returns `{ ok: true }` but nothing appears in sheets

**Possible Causes:**
- Backend Google Sheets API credentials expired
- Sheet is locked or permissions issue
- Wrong sheet ID or tab name
- Backend mock mode (returns success without actually writing)

**Solution:** Contact backend team to verify Google Sheets integration

### Issue 2: Month Format Mismatch
**Symptom:** Transaction submitted but doesn't appear when filtering

**Possible Causes:**
- Backend expects different month format (e.g., "11" instead of "NOV")
- Month case sensitivity (NOV vs Nov vs nov)

**Solution:** Check backend API documentation for exact month format

### Issue 3: Delayed Sync
**Symptom:** Transaction appears after a delay (30+ seconds)

**Possible Causes:**
- Google Sheets API caching
- Backend processing queue

**Solution:** Add manual refresh button and wait longer before checking

### Issue 4: /api/inbox Not Reading New Rows
**Symptom:** Transaction is in sheets but /api/inbox doesn't return it

**Possible Causes:**
- Backend caching old data
- Wrong sheet range being read
- Row number tracking issue

**Solution:** Check backend /api/inbox implementation

## Quick Fix to Try

### Add Request/Response Logging
The code has been updated with console.log statements. After trying to submit a transaction, check the console and share:

1. **Request payload:** What data was sent to `/api/sheets`?
2. **Response data:** What did the backend return?
3. **Error messages:** Any errors in the console?

### Test with Backend Team
Share this test transaction payload with the backend team:
```json
{
  "day": "15",
  "month": "NOV",
  "year": "2025",
  "property": "Family",
  "typeOfOperation": "Revenue - Testing",
  "typeOfPayment": "Cash",
  "detail": "Test manual entry from mobile",
  "ref": "",
  "debit": 0,
  "credit": 100
}
```

Ask them to:
1. Verify it's being received at POST /api/sheets
2. Check if it writes to Google Sheets
3. Verify if GET /api/inbox returns it

## Next Steps

1. **Try another transaction** with logging enabled
2. **Check the console output** and share the logs
3. **Pull to refresh** Recent Activity after 5 seconds
4. **Check Google Sheets manually** if you have access
5. **Contact backend team** with the console logs if issue persists

## Backend Team Questions to Ask

1. Does POST /api/sheets actually write to Google Sheets or is it in mock mode?
2. What format does the month field need to be? (NOV, Nov, 11, etc.)
3. Is there caching on GET /api/inbox that needs to be cleared?
4. Can you manually verify the last transaction was written to sheets?
5. Are there any Google Sheets API errors in your server logs?
