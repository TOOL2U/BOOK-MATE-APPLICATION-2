# FOR WEBAPP TEAM – Implement P&L Overview Dashboard (Revolut Style)

**Date:** November 15, 2025  
**Status:** Requirements Specification  
**Priority:** High  
**Target:** BookMate Web Application

---

## 🎯 Goal

Redesign the existing P&L screen in the webapp into a clean, **Revolut-style "Overview Dashboard"**, similar in visual language to the new Accounts modal in the mobile app.

**Key Principle:** This should **not** show every individual transaction/expense on the main screen.

Instead, it should show:
- High-level P&L metrics for the current period
- A few preview items (top properties, top categories)
- Clickable cards that open detail modals for full breakdowns (Overheads + Property/Person)

Use the same **brand kit & dark theme** as the rest of BookMate.

---

## 1️⃣ Data to Use (Existing P&L Endpoints)

Use the existing P&L endpoints/hooks already wired in the webapp that talk to Apps Script:

### Primary Endpoint: `getPnL`
Core P&L data (month + year):
```typescript
{
  month: {
    revenue: number;
    overheads: number;
    propertyPersonExpense: number;
    gop: number;
    ebitdaMargin: number;
  },
  year: {
    // same structure
  }
}
```

### Secondary Endpoints:
1. **`getPropertyPersonDetails(period: 'month' | 'year')`**
   - Returns: `Array<{ name: string, expense: number, percentage: number }>`

2. **`getOverheadExpensesDetails(period: 'month' | 'year')`**
   - Returns: `Array<{ name: string, expense: number, percentage: number }>`

**Initial Implementation:** Start with `period = "month"` (we can extend later).

---

## 2️⃣ Layout – P&L Overview (Desktop & Mobile-Responsive)

### A. Page Header

```
P&L                         [ This month ▾ ]
This month • THB
```

**Elements:**
- **Title:** "P&L"
- **Subtext line:** e.g. `This month • THB`
- **Right side:** Small dropdown or pill for period
  - Default: "This month" (preselected)
  - Future options: This year, Last month, Custom range

---

### B. Hero Net Result Card (Top Primary Card)

**Placement:** Full-width (or 2/3 width on desktop), at the top

**Content:**
- **Label:** "Net result this month"
- **Big number:** `฿123,456.78`
- **Subtext:** "Revenue – Overheads – Property / Person"

**Calculation:**
```typescript
netResult = month.revenue - month.overheads - month.propertyPersonExpense;
```

**Styling:**
- Dark card background (`#1A1A1A` or `#1C1C1C`)
- **Brand yellow** (`#FFF02B`) or green for positive net result
- **Expense red** for negative values
- Small subtle icon in top right:
  - `trending-up` (positive)
  - `trending-down` (negative)

**Visual Reference:** Similar prominence to the account balance in the mobile Accounts modal.

---

### C. Metric Row – 3–4 Small Cards in a Grid

**Layout:** Responsive grid under the hero card

**Cards:**

1. **Revenue (this month)**
   - Label: "Revenue"
   - Value: `฿{month.revenue}`

2. **Overheads (this month)**
   - Label: "Overheads"
   - Value: `฿{month.overheads}`

3. **Property / Person**
   - Label: "Property / Person"
   - Value: `฿{month.propertyPersonExpense}`

4. **EBITDA %**
   - Label: "EBITDA"
   - Value: `{month.ebitdaMargin}%`

**Card Styling:**
- Same card style as other dashboard cards
- Rounded corners (17px border radius)
- Border: `rgba(255,255,255,0.06)`
- Subtle shadow
- Small label text (12-13px, uppercase, secondary color)
- Larger value text (20-24px, bold, primary color)
- Optional: Tiny pill under value showing "This month"

**Responsive Behavior:**
- Desktop: 4 cards in a row
- Tablet: 2x2 grid
- Mobile: Stacked vertically

---

### D. Insights Pair – "Earned this month" + "Progress this month"

**Purpose:** Mirror the feel of the mobile Accounts modal insights row.

**Card 1 – Earned this month**
```
Earned this month
฿{month.revenue}
All time: ฿{year.revenue}
```

**Card 2 – Progress this month**
```
Progress this month
฿{month.gop}  // or month.revenue - month.overheads
EBITDA: {month.ebitdaMargin}%
```
(Future: Add "vs last month: +X%")

**Layout:**
- Two cards side by side on desktop
- Stacked on mobile
- Same visual style as mobile Accounts insights
- Min height: 140px
- Padding: 20px
- Spacing between cards: 12px

---

### E. Overheads Summary Card (with "View full breakdown")

**Card Title:** "Overheads (this month)"

**Content Structure:**

```
Overheads (this month)             ฿{month.overheads}

EXP – Utilities                    ฿12,000   [▓▓▓░░░░░░░] 35%
EXP – Staff                        ฿18,500   [▓▓▓▓▓░░░░░] 54%
EXP – Maintenance                  ฿8,200    [▓▓░░░░░░░░] 24%

                          [View full breakdown →]
```

**Data Source:**
- Total: `month.overheads`
- Top 3 items: First 3 from `getOverheadExpensesDetails('month')`

**Features:**
- Optional thin progress bars under each line based on `percentage`
- Bottom-right link/button: "View full breakdown"

**Click Behavior:**
When clicking the card or "View full breakdown":
1. Open modal (Revolut-style, similar to mobile Accounts modal)
2. Show **full list** of all categories from `getOverheadExpensesDetails('month')`
3. Scrollable list/table with columns:
   - **Category** | **Amount** | **% of total**
4. Clean dark theme styling
5. Close button in top-right
6. Slide-up animation (web equivalent)

---

### F. Property / Person Summary Card (with "View full breakdown")

**Same structure as Overheads card:**

```
Property / Person (this month)     ฿{month.propertyPersonExpense}

Villa A                            ฿18,000   [▓▓▓▓▓▓░░░░] 62%
Villa B                            ฿9,500    [▓▓▓░░░░░░░] 33%
House                              ฿5,300    [▓░░░░░░░░░] 18%

                          [View full breakdown →]
```

**Data Source:**
- Total: `month.propertyPersonExpense`
- Top 3 items: First 3 from `getPropertyPersonDetails('month')`

**Click Behavior:**
Open Property / Person breakdown modal:
- List of **all** properties/persons from `getPropertyPersonDetails('month')`
- Columns: **Name** | **Amount** | **% of total**
- Same style as Overheads modal for consistency

---

## 3️⃣ Visual Style & UX Guidelines

### Color Palette (BookMate Dark Theme)

```css
/* Backgrounds */
--background-primary: #121212;
--card-background: #1A1A1A;
--card-background-alt: #1C1C1C;

/* Text */
--text-primary: #FFFFFF;
--text-secondary: #B3B3B3;
--text-muted: #777777;

/* Brand Colors */
--brand-yellow: #FFF02B;
--brand-green: #4CAF50;   /* For positive values */
--expense-red: #FF453A;   /* For negative values */

/* Borders & Dividers */
--border-subtle: rgba(255, 255, 255, 0.06);
--border-medium: rgba(255, 255, 255, 0.1);
```

### Card Styling

```css
.card {
  background: #1A1A1A;
  border-radius: 17px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.card-label {
  font-size: 13px;
  font-weight: 400;
  color: #B3B3B3;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.card-value {
  font-size: 24px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 12px;
}

.card-subtext {
  font-size: 12px;
  font-weight: 400;
  color: #777777;
}
```

### Spacing System

```css
--spacing-xs: 8px;
--spacing-sm: 12px;
--spacing-md: 16px;
--spacing-lg: 20px;
--spacing-xl: 24px;
--spacing-2xl: 32px;
```

### Responsive Breakpoints

```css
--mobile: 480px;
--tablet: 768px;
--desktop: 1024px;
--desktop-lg: 1440px;
```

### Modal Styling

Follow the mobile Accounts modal design language:
- Height: 90% of viewport
- Border radius top: 24px
- Dark background with subtle gradient
- Handle bar at top (40px wide, 4px tall, light gray)
- Close button (top-right, 24px icon)
- Smooth fade + slide-up animation (240ms cubic easing)

---

## 4️⃣ Behavior & Loading States

### Initial Load Sequence

1. Show skeleton/shimmer for:
   - Hero card
   - Metric row (4 cards)
   - Insights pair (2 cards)
   - Summary cards (2 cards)

2. Fetch data in parallel:
   ```typescript
   Promise.all([
     getPnL(),
     getPropertyPersonDetails('month'),
     getOverheadExpensesDetails('month')
   ])
   ```

3. Replace skeletons with real data as each resolves

### Error Handling

**Per-Card Error Strategy:**
- If `getPnL` fails: Show error in hero + metric cards
- If `getOverheadExpensesDetails` fails: Show error only in Overheads card
- If `getPropertyPersonDetails` fails: Show error only in Property/Person card

**Error Message Style:**
```
⚠️ Unable to load data
Please try again
[Retry button]
```

**Do NOT** break the whole page if one card fails – graceful degradation.

### Loading Skeleton Example

```tsx
<div className="card skeleton">
  <div className="skeleton-line skeleton-label" />
  <div className="skeleton-line skeleton-value" />
  <div className="skeleton-line skeleton-subtext" />
</div>
```

---

## 5️⃣ Implementation Checklist

### Phase 1: Core Layout ✅
- [ ] Page header with title and period selector
- [ ] Hero Net Result card
- [ ] Metric row (4 cards: Revenue, Overheads, Property/Person, EBITDA)
- [ ] Mobile-responsive grid layout
- [ ] Loading skeletons for all cards

### Phase 2: Insights & Summaries ✅
- [ ] "Earned this month" + "Progress this month" cards
- [ ] Overheads summary card (top 3 + total)
- [ ] Property/Person summary card (top 3 + total)
- [ ] Progress bars for breakdown items

### Phase 3: Modals & Interactivity ✅
- [ ] Overheads breakdown modal
  - [ ] Full list from API
  - [ ] Scrollable table/list
  - [ ] Clean close UX
- [ ] Property/Person breakdown modal
  - [ ] Full list from API
  - [ ] Same styling as Overheads modal
- [ ] Smooth modal animations

### Phase 4: Polish & Testing ✅
- [ ] Error handling per card
- [ ] Retry functionality
- [ ] Cross-browser testing
- [ ] Mobile responsiveness verification
- [ ] Data accuracy validation against Google Sheets

---

## 6️⃣ Acceptance Criteria

### ✅ Visual Requirements

**When I open the P&L page, I see:**
- [ ] Hero Net result card showing calculated net result
- [ ] Metric row with Revenue, Overheads, Property/Person, EBITDA
- [ ] "Earned this month" + "Progress this month" cards
- [ ] Overheads summary card with top 3 categories + full total
- [ ] Property / Person summary card with top 3 items + full total
- [ ] All cards use consistent BookMate dark theme styling
- [ ] Layout is responsive (mobile, tablet, desktop)

### ✅ Data Accuracy

- [ ] All numbers align with Google Sheet for current month
- [ ] Net result = Revenue - Overheads - Property/Person expense
- [ ] Top 3 items match API response order
- [ ] Percentages are correctly calculated and displayed

### ✅ Interaction Requirements

**When I click "View full breakdown" on Overheads:**
- [ ] Modal opens with smooth animation
- [ ] Shows full list of overhead categories from API
- [ ] Displays: Category | Amount | % of total
- [ ] Modal is scrollable
- [ ] Close button works correctly

**When I click "View full breakdown" on Property/Person:**
- [ ] Modal opens with smooth animation
- [ ] Shows full list of properties/persons from API
- [ ] Displays: Name | Amount | % of total
- [ ] Modal is scrollable
- [ ] Close button works correctly

### ✅ UX Requirements

- [ ] Overall look & feel matches Revolut-style premium dashboard
- [ ] Visual consistency with mobile Accounts modal
- [ ] Loading states are smooth and non-jarring
- [ ] Error states are helpful and non-blocking
- [ ] Animations feel polished (not too fast, not too slow)

---

## 7️⃣ Reference Screenshots

### Mobile Accounts Modal (for visual reference)
The webapp implementation should follow similar design principles:
- Clean dark background with gradient
- Large, prominent numbers with brand yellow
- Consistent card spacing and shadows
- Professional typography hierarchy
- Subtle borders and dividers

**Key Similarities to Replicate:**
1. Premium gradient backgrounds
2. Large header with icon + balance
3. Insight cards with label + value + subtext
4. Clean action buttons/links
5. Smooth modal transitions

---

## 8️⃣ Future Enhancements (Out of Scope for V1)

- [ ] Period selector (This year, Last month, Custom range)
- [ ] "vs last month" comparison metrics
- [ ] Sparkline charts for trends
- [ ] Export to PDF/CSV functionality
- [ ] Drill-down into individual transactions from modals
- [ ] Year-over-year comparison view

---

## 9️⃣ Technical Notes

### API Integration

```typescript
// Example usage
const { data: pnlData, loading, error } = usePnL();
const { data: overheads } = useOverheadDetails('month');
const { data: properties } = usePropertyPersonDetails('month');

// Calculate net result
const netResult = 
  pnlData.month.revenue - 
  pnlData.month.overheads - 
  pnlData.month.propertyPersonExpense;
```

### Component Structure Suggestion

```
components/
  PnL/
    PnLOverview.tsx          // Main container
    HeroNetResultCard.tsx    // Hero card
    MetricCard.tsx           // Reusable metric card
    InsightsCard.tsx         // Earned/Progress cards
    SummaryCard.tsx          // Overheads/Property summary
    BreakdownModal.tsx       // Reusable modal for details
    ProgressBar.tsx          // Progress bar component
```

### Styling Approach

Use CSS Modules or Styled Components to match existing webapp patterns.

---

## 📌 Questions for Webapp Team?

1. Is there a preferred charting library if we add sparklines later?
2. Should the period selector be a dropdown or segmented control?
3. Do you want skeleton loading or spinner for initial load?
4. Any existing modal component we should reuse?
5. Preferred state management pattern (Redux, Context, etc.)?

---

**Document Version:** 1.0  
**Created by:** Mobile Team  
**For:** Webapp Development Team  
**Next Steps:** Review requirements → Estimate effort → Begin implementation

---

## Example Code Snippets

### Net Result Card Component

```tsx
interface NetResultCardProps {
  revenue: number;
  overheads: number;
  propertyPersonExpense: number;
  loading?: boolean;
}

export const NetResultCard: React.FC<NetResultCardProps> = ({
  revenue,
  overheads,
  propertyPersonExpense,
  loading
}) => {
  const netResult = revenue - overheads - propertyPersonExpense;
  const isPositive = netResult >= 0;

  if (loading) {
    return <NetResultSkeleton />;
  }

  return (
    <div className="card hero-card">
      <div className="card-header">
        <span className="card-label">Net result this month</span>
        <Icon 
          name={isPositive ? 'trending-up' : 'trending-down'} 
          color={isPositive ? 'green' : 'red'}
        />
      </div>
      <div className={`card-value ${isPositive ? 'positive' : 'negative'}`}>
        ฿{formatCurrency(Math.abs(netResult))}
      </div>
      <div className="card-subtext">
        Revenue – Overheads – Property / Person
      </div>
    </div>
  );
};
```

### Breakdown Modal Component

```tsx
interface BreakdownModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  total: number;
  items: Array<{ name: string; expense: number; percentage: number }>;
}

export const BreakdownModal: React.FC<BreakdownModalProps> = ({
  visible,
  onClose,
  title,
  total,
  items
}) => {
  if (!visible) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />
        <button className="modal-close" onClick={onClose}>
          <Icon name="close" />
        </button>
        
        <div className="modal-header">
          <h2>{title}</h2>
          <div className="modal-total">฿{formatCurrency(total)}</div>
        </div>

        <div className="modal-content">
          <table className="breakdown-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>% of Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.name}>
                  <td>{item.name}</td>
                  <td>฿{formatCurrency(item.expense)}</td>
                  <td>{item.percentage.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
```

---

**Ready to implement? Let's build a premium P&L dashboard! 🚀**
