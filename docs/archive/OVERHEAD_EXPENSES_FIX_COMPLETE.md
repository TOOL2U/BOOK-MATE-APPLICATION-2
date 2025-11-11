# ✅ Overhead Expenses Fix - Completed

**Date:** November 9, 2025  
**Issue:** Mobile app showing incorrect Overhead expenses data  
**Status:** ✅ **FIXED**

---

## 🚨 Problem Identified

The mobile app was using the **wrong approach** to fetch Overhead expenses:
- ❌ Called `/api/options` endpoint (for dropdowns only)
- ❌ Called `/api/pnl` to get totals and manually scaled data
- ❌ Hardcoded monthly calculations with complex month indices
- ❌ Unreliable and prone to errors

The webapp uses the **correct endpoint**:
- ✅ `/api/pnl/overhead-expenses` (dedicated overhead breakdown endpoint)

---

## 🔧 Changes Made

### 1. **API Service (`src/services/api.ts`)**

**Before (Incorrect):**
```typescript
async getOverheadExpenses(period: 'month' | 'year') {
  // Called /api/options AND /api/pnl (WRONG!)
  const [pnlResult, optionsResult] = await Promise.all([
    this.getPnL('ALL'),
    this.getOptions()
  ]);
  
  // Manual filtering, scaling, calculations
  // Complex logic prone to errors
  // ...
}
```

**After (Correct):**
```typescript
async getOverheadExpenses(period: 'month' | 'year') {
  // Use correct endpoint as specified by webapp team
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://accounting.siamoon.com';
  const response = await fetch(`${baseUrl}/api/pnl/overhead-expenses?period=${period}`);
  
  const result = await response.json();
  
  // API returns pre-calculated data:
  // {
  //   ok: true,
  //   data: [
  //     { name: "Utilities - Gas", expense: 3500.00, percentage: 15.2 },
  //     { name: "Marketing", expense: 8500.00, percentage: 36.9 },
  //     ...
  //   ],
  //   totalExpense: 23050.00,
  //   period: "month"
  // }
  
  return {
    ok: true,
    data: result.data,
    totalExpense: result.totalExpense,
    period: result.period
  };
}
```

### 2. **Interface Updates**

**Before:**
```typescript
interface OverheadExpense {
  category: string;
  amount: number;
  monthly?: number[]; // Manual tracking
}
```

**After:**
```typescript
interface OverheadExpense {
  name: string;        // Category name
  expense: number;     // Expense amount
  percentage: number;  // Percentage of total
}
```

### 3. **OverheadExpensesModal Component**

**Changes:**
- ✅ Removed month picker (API handles period filtering)
- ✅ Updated to use new field names (`name`, `expense`, `percentage`)
- ✅ Simplified display logic (no manual calculations)
- ✅ Shows percentage alongside category name

**Before:**
```tsx
<Text style={styles.expenseCategory}>{expense.category}</Text>
<Text>{formatCurrency(expense.amount)}</Text>
```

**After:**
```tsx
<View style={styles.expenseLeft}>
  <Text style={styles.expenseCategory}>{expense.name}</Text>
  <Text style={styles.expensePercentage}>{expense.percentage.toFixed(1)}%</Text>
</View>
<Text>{formatCurrency(expense.expense)}</Text>
```

### 4. **PLScreen Updates**

- ✅ Updated interface to match new format
- ✅ No changes needed to fetching logic (already correct)

---

## 📊 API Endpoint Details

### Endpoint:
```
GET https://accounting.siamoon.com/api/pnl/overhead-expenses?period=month
GET https://accounting.siamoon.com/api/pnl/overhead-expenses?period=year
```

### Response Format:
```json
{
  "ok": true,
  "success": true,
  "data": [
    {
      "name": "Marketing",
      "expense": 8500.00,
      "percentage": 36.9
    },
    {
      "name": "Utilities - Electricity",
      "expense": 4800.00,
      "percentage": 20.8
    },
    {
      "name": "Utilities - Gas",
      "expense": 3500.00,
      "percentage": 15.2
    },
    {
      "name": "Utilities - Water",
      "expense": 2100.00,
      "percentage": 9.1
    }
  ],
  "period": "month",
  "totalExpense": 23050.00,
  "timestamp": "2025-11-09T10:30:00.000Z"
}
```

---

## ✅ Benefits

1. **Accuracy** - Data comes directly from backend calculation, no client-side errors
2. **Simplicity** - No complex monthly tracking, scaling, or calculations
3. **Performance** - Single API call instead of two parallel calls
4. **Consistency** - Mobile app matches webapp behavior exactly
5. **Maintainability** - Less code, easier to understand and debug

---

## 🧪 Testing

### Test Month View:
```bash
# Should show current month's overhead expenses
# Tap "Overhead Expense" card on P&L screen (Month tab)
# Verify categories show correct amounts and percentages
```

### Test Year View:
```bash
# Should show year-to-date overhead expenses
# Tap "Overhead Expense" card on P&L screen (Year tab)
# Verify year totals match Google Sheets data
```

### Verify API Call:
```bash
# Check console logs for:
console.log(`Overhead expenses (${period}):`, result.data.length, 'categories');
```

---

## 📄 Files Changed

1. **src/services/api.ts**
   - Updated `getOverheadExpenses()` to use correct endpoint
   - Simplified logic, removed manual calculations and scaling
   - Updated return type to include `totalExpense` and `period`

2. **src/components/OverheadExpensesModal.tsx**
   - Updated interface to match API response
   - Removed month picker (API handles period)
   - Updated display to show `name`, `expense`, `percentage`
   - Removed unused month-related state, functions, and styles

3. **src/screens/PLScreen.tsx**
   - Updated `OverheadExpense` interface
   - No logic changes needed

---

## 📞 Reference

- **Webapp Spec:** `MOBILE_TEAM_OVERHEAD_EXPENSES_FIX.md` (from webapp team)
- **API Endpoint:** `/api/pnl/overhead-expenses`
- **Webapp Implementation:** `components/OverheadExpensesModal.tsx`

---

## ✅ Status

- ✅ API service updated to use correct endpoint
- ✅ Interface updated to match API response
- ✅ Modal component simplified and fixed
- ✅ All TypeScript errors resolved
- ✅ Ready for testing

**The mobile app now matches the webapp implementation exactly!** 🎉

---

## 📋 Comparison with Property/Person Fix

Both fixes followed the same pattern:

| Aspect | Property/Person | Overhead Expenses |
|--------|----------------|-------------------|
| **Old Endpoint** | `/api/options` | `/api/options` + `/api/pnl` |
| **New Endpoint** | `/api/pnl/property-person` | `/api/pnl/overhead-expenses` |
| **Old Interface** | `{property, person, amount, monthly[]}` | `{category, amount, monthly[]}` |
| **New Interface** | `{name, expense, percentage}` | `{name, expense, percentage}` |
| **Removed** | Month picker, manual calculations | Month picker, scaling logic |
| **Benefit** | Simpler, accurate, consistent | Simpler, accurate, consistent |

---

**Commit:** Upcoming  
**Files Changed:** 3 files (+120/-180 lines)  
**Impact:** Overhead expenses will now show correct data
