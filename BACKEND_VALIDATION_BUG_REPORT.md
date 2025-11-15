# 🐛 Backend Validation Bug Report - POST /api/sheets

## Issue Summary
POST `/api/sheets` endpoint is rejecting **valid transactions** with HTTP 400 error despite all dropdown values being correct.

**Error Message:**
```json
{
  "success": false,
  "error": "Unable to validate dropdown values. Please try again."
}
```

## Evidence

### Manual Entry Transaction (REJECTED)
```json
{
  "day": "15",
  "month": "NOV",
  "year": "2025",
  "property": "Family",
  "typeOfOperation": "EXP - Utilities - Gas",
  "typeOfPayment": "Bank transfer - Krung Thai Bank - Family Account",
  "detail": "Test",
  "ref": "",
  "debit": 1,
  "credit": 0
}
```

**Result**: HTTP 400 - "Unable to validate dropdown values. Please try again."

### Transfer Transaction - Row A (REJECTED)
```json
{
  "day": "15",
  "month": "NOV",
  "year": "2025",
  "property": "Family",
  "typeOfOperation": "Transfer",
  "typeOfPayment": "Bank transfer - Krung Thai Bank - Family Account",
  "detail": "Test",
  "ref": "T-2025-768056",
  "debit": 1,
  "credit": 0
}
```

**Result**: HTTP 400 - "Unable to validate dropdown values. Please try again."

### Validation Results from /api/options

**For Manual Entry:**
```
✅ Month: "NOV" - EXISTS in months array
✅ Property: "Family" - EXISTS in properties array  
✅ TypeOfOperation: "EXP - Utilities - Gas" - EXISTS in typeOfOperation array
✅ TypeOfPayment: "Bank transfer - Krung Thai Bank - Family Account" - EXISTS in typeOfPayment array
```

**For Transfer:**
```
✅ Month: "NOV" - EXISTS in months array
✅ Property: "Family" - EXISTS in properties array  
✅ TypeOfOperation: "Transfer" - EXISTS in typeOfOperation array
✅ TypeOfPayment: "Bank transfer - Krung Thai Bank - Family Account" - EXISTS in typeOfPayment array
```

**Both transaction types are being rejected with identical error despite all values being valid!**

### Available Options from GET /api/options
```json
{
  "months": ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
  "properties": ["Family", "Maria Ren - Personal", "Shaun Ducker - Personal", "Lanna House", "Alesia House"],
  "typeOfOperation": [
    "Revenue - Commision",
    "Revenue - Sales",
    "EXP - Utilities - Gas",  ← EXACT MATCH
    "EXP - Utilities - Water",
    // ... more categories
  ],
  "typeOfPayment": [
    "Bank transfer - Krung Thai Bank - Family Account",  ← EXACT MATCH
    "Bank Transfer - Bangkok Bank - Maria Ren",
    // ... more payment types
  ]
}
```

## Timeline

### When It Worked
- ✅ Before multi-account system implementation
- ✅ Mobile app successfully submitted transactions
- ✅ Transactions appeared in P&L spreadsheet
- ✅ Transactions appeared in Recent Activity (/api/inbox)

### When It Broke
- ❌ After multi-account system changes
- ❌ Same exact data format now returns HTTP 400
- ❌ Error message says "Unable to validate dropdown values"
- ❌ But all dropdown values ARE valid (verified against /api/options)

## Technical Details

### Request Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
```

### Request Endpoint
```
POST https://accounting.siamoon.com/api/sheets
```

### Request Retry Behavior
The request is being retried (appears twice in logs), indicating the mobile app's retry logic is working, but both attempts fail with the same 400 error.

## Hypotheses

### 1. Case Sensitivity Issue (UNLIKELY)
The backend might have introduced case-sensitive validation.
- **Evidence Against**: We're using exact strings from /api/options response
- **Evidence Against**: Validation says "dropdown values" not "case mismatch"

### 2. Additional Hidden Field Validation (LIKELY)
The backend might be validating fields that aren't in the error message:
- `day` format (we send "15" as string)
- `year` format (we send "2025" as string)  
- `ref` empty string vs null
- `debit`/`credit` number type

### 3. New Required Field (POSSIBLE)
Multi-account system might have introduced a new required field:
- Account ID?
- User ID?
- Transaction ID?
- Timestamp?

### 4. Validation Logic Bug (MOST LIKELY)
The backend validation code has a bug:
- Maybe comparing against wrong array
- Maybe using wrong comparison operator
- Maybe validation runs before option normalization
- Maybe there's a typo in the backend validation code

## Debugging Steps Taken

1. ✅ Verified month format (uppercase)
2. ✅ Verified property is not empty
3. ✅ Verified all dropdown values match /api/options exactly
4. ✅ Added extensive logging throughout mobile app
5. ✅ Confirmed JWT authentication is working (other endpoints work)
6. ✅ Tested both Manual Entry and Transfer (both fail)
7. ✅ Checked for trailing spaces or hidden characters (none found)

## What We Need from Backend Team

### 1. Server-Side Logs
Please check backend logs for this transaction:
- What field(s) is failing validation?
- What value was received vs what was expected?
- Any error stack traces?

### 2. Validation Code Review
Please review the validation logic in POST /api/sheets handler:
```typescript
// Pseudo-code of what we expect the backend is doing:
function validateTransaction(data) {
  const validOptions = await getOptions();
  
  // Which of these checks is failing?
  if (!validOptions.months.includes(data.month)) {
    return { error: "Unable to validate dropdown values" };
  }
  
  if (!validOptions.properties.includes(data.property)) {
    return { error: "Unable to validate dropdown values" };
  }
  
  if (!validOptions.typeOfOperation.includes(data.typeOfOperation)) {
    return { error: "Unable to validate dropdown values" };
  }
  
  if (!validOptions.typeOfPayment.includes(data.typeOfPayment)) {
    return { error: "Unable to validate dropdown values" };
  }
  
  // Is there a NEW check that was added for multi-account?
  if (!data.accountId) {  // ← Example of possible new field
    return { error: "Unable to validate dropdown values" };
  }
}
```

### 3. Test Transaction
Please try submitting this exact payload directly to your backend:
```bash
curl -X POST https://accounting.siamoon.com/api/sheets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "day": "15",
    "month": "NOV",
    "year": "2025",
    "property": "Family",
    "typeOfOperation": "EXP - Utilities - Gas",
    "typeOfPayment": "Bank transfer - Krung Thai Bank - Family Account",
    "detail": "Test transaction from mobile app",
    "ref": "",
    "debit": 100,
    "credit": 0
  }'
```

Does this succeed or fail? If it fails, what's the detailed error?

### 4. Webapp Comparison
Does the webapp successfully submit transactions?
- If YES: What does the webapp send that's different from mobile?
- If NO: The validation bug affects both platforms

## Temporary Workarounds

### Option 1: Bypass Validation (Backend)
Temporarily disable or relax the dropdown validation to unblock mobile development:
```typescript
// Temporary - remove after fixing root cause
if (process.env.BYPASS_DROPDOWN_VALIDATION === 'true') {
  return validateTransactionBasic(data);
}
```

### Option 2: Mock Endpoint (Backend)
Create a `/api/sheets/debug` endpoint that logs everything and bypasses validation:
```typescript
app.post('/api/sheets/debug', async (req, res) => {
  console.log('DEBUG: Received transaction:', JSON.stringify(req.body, null, 2));
  console.log('DEBUG: Available options:', await getOptions());
  // Try to validate and log which field fails
  const result = await validateWithDetailedErrors(req.body);
  return res.json(result);
});
```

### Option 3: Return Detailed Errors (Backend - RECOMMENDED)
Instead of generic "Unable to validate dropdown values", return specific field:
```typescript
// Better error messages:
if (!validOptions.months.includes(data.month)) {
  return { error: `Invalid month: "${data.month}". Expected one of: ${validOptions.months.join(', ')}` };
}

if (!validOptions.typeOfOperation.includes(data.typeOfOperation)) {
  return { error: `Invalid category: "${data.typeOfOperation}". Not found in available categories.` };
}
```

## Impact

### Affected Features
- ❌ **Manual Entry** - Cannot submit expense/revenue transactions
- ❌ **Transfer** - Cannot move money between accounts
- ❌ **Upload Receipt** - Likely same validation issue (not tested yet)

### Current State
- ❌ Mobile app CANNOT submit ANY transactions
- ❌ All transaction submission features are broken
- ❌ App is unusable for its core purpose (financial tracking)

### User Experience
- User fills out form correctly using provided dropdown options
- User clicks Submit
- App shows "Unable to validate dropdown values" error
- User is confused (they selected values from the dropdowns provided by /api/options!)
- User cannot add any financial data to the system

### Error Pattern
**Consistent Failure Across All Transaction Types:**
```
Manual Entry → POST /api/sheets → HTTP 400 "Unable to validate dropdown values"
Transfer Row A → POST /api/sheets → HTTP 400 "Unable to validate dropdown values"  
Transfer Row B → POST /api/sheets → HTTP 400 "Unable to validate dropdown values"
```

All three use the same endpoint and fail with identical error.

## Priority
🔴 **CRITICAL** - Blocks core functionality of mobile app

## Next Steps

1. **Backend Team**: Investigate validation logic and provide server-side logs
2. **Backend Team**: Add detailed error messages to help debug
3. **Backend Team**: Test the exact payload we're sending
4. **Mobile Team**: Wait for backend fix OR use debug endpoint if provided
5. **Both Teams**: Schedule call to review validation requirements together

---

**Created**: November 15, 2025  
**Reported By**: Mobile Development Team  
**Affects**: POST /api/sheets endpoint  
**Related**: Multi-account system implementation
