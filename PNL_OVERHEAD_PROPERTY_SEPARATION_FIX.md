# CRITICAL FIX: Overhead and Property/Person Separation

## ❌ Issue Identified

The P&L Overview Dashboard was **incorrectly calculating** the net result by combining overhead expenses with property/person expenses:

```typescript
// ❌ WRONG - This was combining two separate expense categories
const netResult = currentData.revenue - currentData.overheads - currentData.propertyPersonExpense;
```

## ✅ Fix Applied

### What Changed:

**File: `src/screens/PLScreen.tsx`**

1. **Removed incorrect calculation** (Line 176):
   ```typescript
   // BEFORE (WRONG):
   const netResult = currentData.revenue - currentData.overheads - currentData.propertyPersonExpense;
   
   // AFTER (CORRECT):
   const netResult = currentData.gop;  // Use GOP directly from API
   ```

2. **Updated Hero Card Label** (Line 233):
   ```typescript
   // BEFORE:
   <Text style={styles.heroLabel}>Net result {period === 'month' ? 'this month' : 'this year'}</Text>
   
   // AFTER:
   <Text style={styles.heroLabel}>Gross Operating Profit {period === 'month' ? 'this month' : 'this year'}</Text>
   ```

3. **Updated Hero Card Subtext** (Line 243):
   ```typescript
   // BEFORE (WRONG):
   <Text style={styles.heroSubtext}>Revenue – Overheads – Property / Person</Text>
   
   // AFTER (CORRECT):
   <Text style={styles.heroSubtext}>Revenue – Overheads</Text>
   ```

---

## 🧮 Correct P&L Calculation Structure

### GOP (Gross Operating Profit)
```
GOP = Revenue - Overheads
```

**Overheads include:**
- Utilities
- Staff salaries
- Marketing
- Office expenses
- Maintenance
- etc.

**Property/Person expenses are SEPARATE:**
- Property-specific costs (Villa A, Villa B, House, etc.)
- Person-specific allocations
- These are tracked independently for management purposes

---

## ✅ Verified Correct Implementation

### Files Checked:

1. **✅ `src/screens/PLScreen.tsx`**
   - Now correctly uses `currentData.gop` (provided by API)
   - Hero card shows "Gross Operating Profit"
   - Subtext shows "Revenue – Overheads" only
   - Property/Person shown separately in its own metric card

2. **✅ `src/screens/HomeScreen.tsx`** (Line 105)
   - Already correct: `const expenses = plData.overheads || 0;`
   - Uses `plData.gop` for netResult
   - No incorrect combination found

3. **✅ API Response Structure** (`src/types/index.ts`)
   ```typescript
   export interface PLData {
     revenue: number;
     overheads: number;
     propertyPersonExpense: number;  // ← SEPARATE field
     gop: number;                     // ← Already calculated correctly by backend
     ebitdaMargin: number;
   }
   ```

---

## 📊 Dashboard Display (After Fix)

### Hero Card (Top)
```
┌─────────────────────────────────────────┐
│ Gross Operating Profit this month  ↗   │
│                                         │
│ ฿ 45,230                                │
│                                         │
│ Revenue – Overheads                     │
└─────────────────────────────────────────┘
```

### Metric Cards (4 separate cards)
```
┌─────────────────┐  ┌─────────────────┐
│ Revenue         │  │ Overheads       │
│ ฿ 125,000       │  │ ฿ 79,770        │
│ This month      │  │ This month      │
└─────────────────┘  └─────────────────┘

┌─────────────────┐  ┌─────────────────┐
│ Property/Person │  │ EBITDA          │
│ ฿ 22,500        │  │ 36.2%           │
│ This month      │  │ This month      │
└─────────────────┘  └─────────────────┘
```

**Each expense type is clearly separated and NOT combined.**

---

## 🎯 Why This Matters

### Business Logic:
- **Overheads** = Operating expenses of the business
- **Property/Person** = Allocation/tracking for specific properties or individuals
- These serve **different management purposes** and should never be combined in GOP

### Financial Accuracy:
- GOP is a standard accounting metric: **Revenue - Operating Expenses**
- Property/Person expenses may be tracked for internal allocation, not necessarily part of operating costs
- Combining them would create an incorrect financial picture

---

## 🔍 Audit Results

### Search Pattern: Files combining overhead + property/person
```bash
grep -r "overheads.*propertyPerson\|propertyPerson.*overheads" src/
```

**Result:** ✅ **NO MATCHES FOUND** (after fix)

### Manual Code Review:
- ✅ PLScreen.tsx - Fixed ✓
- ✅ HomeScreen.tsx - Already correct ✓
- ✅ No other calculation points found ✓

---

## 📝 Summary

**Status:** ✅ **FIXED AND VERIFIED**

- P&L screen now correctly shows GOP = Revenue - Overheads
- Property/Person expenses displayed separately
- No files are incorrectly combining these two expense categories
- All calculations now match the backend API's GOP field

**Changed Files:**
- `src/screens/PLScreen.tsx` (3 changes)

**Documentation:**
- This file created: `PNL_OVERHEAD_PROPERTY_SEPARATION_FIX.md`
