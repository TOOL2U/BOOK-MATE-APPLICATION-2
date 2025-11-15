# 🎨 BOOKMATE COLOR PALETTE - QUICK REFERENCE

## Use This Guide When Styling Components

---

### 🎯 BACKGROUND COLORS

```typescript
// Main app background (all screens)
backgroundColor: COLORS.BACKGROUND  // #121212
```

---

### 🎯 CARD COLORS (by importance)

```typescript
// 1. Basic cards (forms, sections, main content)
backgroundColor: COLORS.CARD_PRIMARY  // #1A1A1A

// 2. Input fields, dropdowns (secondary surfaces)
backgroundColor: COLORS.CARD_SECONDARY  // #1C1C1C

// 3. Buttons, raised elements (elevated surfaces)
backgroundColor: COLORS.CARD_ELEVATED  // #1E1E1E

// 4. Analytics cards, totals (highlighted content)
backgroundColor: COLORS.CARD_HIGHLIGHT  // #242424
```

---

### 🎯 BORDERS

```typescript
// All borders - subtle and premium
borderColor: COLORS.BORDER  // rgba(255, 255, 255, 0.06)

// Focused input borders
borderColor: COLORS.BORDER_FOCUS  // rgba(255, 240, 43, 0.3)
```

---

### 🎯 TEXT COLORS

```typescript
// Headings, primary text
color: COLORS.TEXT_PRIMARY  // #FFFFFF

// Labels, secondary text
color: COLORS.TEXT_SECONDARY  // #B3B3B3

// Hints, placeholders, disabled text
color: COLORS.TEXT_MUTED  // #777777
```

---

### 🎯 BRAND COLORS

```typescript
// Primary accent (buttons, highlights, active states)
color: COLORS.BRAND_YELLOW  // #FFF02B
backgroundColor: COLORS.BRAND_YELLOW

// Text on yellow buttons
color: COLORS.BRAND_BLACK  // #000000
```

---

### 🎯 STATUS COLORS

```typescript
color: COLORS.SUCCESS  // #00FF88 (green)
color: COLORS.ERROR    // #FF3366 (red)
color: COLORS.WARNING  // #FFA500 (orange)
color: COLORS.INFO     // #FFF02B (yellow)
```

---

## 📋 COMPONENT TEMPLATES

### Input Field
```typescript
input: {
  backgroundColor: COLORS.CARD_SECONDARY,
  borderWidth: 1,
  borderColor: COLORS.BORDER,
  color: COLORS.TEXT_PRIMARY,
  borderRadius: 8,
  padding: 12,
}
```

### Card
```typescript
card: {
  backgroundColor: COLORS.CARD_PRIMARY,
  borderWidth: 1,
  borderColor: COLORS.BORDER,
  borderRadius: 12,
  padding: 16,
}
```

### Primary Button (Yellow)
```typescript
button: {
  backgroundColor: COLORS.BRAND_YELLOW,
  borderRadius: 12,
  padding: 16,
}
buttonText: {
  color: COLORS.BRAND_BLACK,
  fontWeight: '600',
}
```

### Secondary Button (Dark)
```typescript
button: {
  backgroundColor: COLORS.CARD_ELEVATED,
  borderWidth: 1,
  borderColor: COLORS.BORDER,
  borderRadius: 12,
  padding: 16,
}
buttonText: {
  color: COLORS.TEXT_PRIMARY,
  fontWeight: '600',
}
```

### Modal
```typescript
modal: {
  backgroundColor: COLORS.CARD_HIGHLIGHT,
  borderWidth: 2,
  borderColor: COLORS.BRAND_YELLOW,
  borderRadius: 20,
  padding: 20,
}
```

---

## 🚫 DON'T USE

```typescript
// ❌ Avoid hard-coded colors
backgroundColor: '#1A1A1A'  // Use COLORS.CARD_PRIMARY
backgroundColor: '#4D4D4D'  // Use COLORS.CARD_* variants
borderColor: '#2A2A2A'     // Use COLORS.BORDER

// ❌ Avoid legacy aliases (being phased out)
COLORS.GREY_SECONDARY  // Use CARD_* variants
COLORS.SURFACE_1       // Use COLORS.CARD_PRIMARY
COLORS.SURFACE_2       // Use COLORS.CARD_ELEVATED
COLORS.YELLOW          // Use COLORS.BRAND_YELLOW
COLORS.BLACK           // Use COLORS.BRAND_BLACK
```

---

## ✅ VISUAL HIERARCHY

```
Darkest  →  BACKGROUND      #121212
            ↓
            CARD_PRIMARY    #1A1A1A  (basic cards)
            ↓
            CARD_SECONDARY  #1C1C1C  (inputs)
            ↓
            CARD_ELEVATED   #1E1E1E  (buttons)
            ↓
Lightest →  CARD_HIGHLIGHT  #242424  (analytics)

ACCENT   →  BRAND_YELLOW    #FFF02B  (pops!)
```

---

## 💡 WHEN TO USE WHAT

| Element Type | Background Color |
|-------------|------------------|
| Screen background | `BACKGROUND` |
| Form container | `CARD_PRIMARY` |
| Text input | `CARD_SECONDARY` |
| Dropdown/picker | `CARD_SECONDARY` |
| Section card | `CARD_PRIMARY` |
| Secondary button | `CARD_ELEVATED` |
| Analytics card | `CARD_HIGHLIGHT` |
| Modal background | `CARD_HIGHLIGHT` |
| Primary button | `BRAND_YELLOW` |
| Active tab | `BRAND_YELLOW` |

---

## 📱 IMPORT

```typescript
import { COLORS } from '../config/theme';
```

---

**Quick Tip:** When in doubt, use `CARD_PRIMARY` for cards and `CARD_SECONDARY` for inputs!
