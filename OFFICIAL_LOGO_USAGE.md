# 🎨 BookMate Official Logo Usage Guide

## ⚠️ CRITICAL: Use Only Official Logo Asset

**The BookMate "BM" monogram logo has ONE official source:**
- File: `/assets/logo/bm-logo.svg`
- This is the **ONLY** logo that should be used
- **DO NOT** redraw, modify, or create variations

---

## ✅ Official Logo Component

### Component: `LogoBM.tsx`

**Location:** `/src/components/LogoBM.tsx`

This component renders the **official BookMate BM logo** exactly as designed.

### Usage

```tsx
import LogoBM from '../components/LogoBM';

// Default (64px, yellow)
<LogoBM />

// Custom size
<LogoBM size={40} />

// Custom size with specific color
<LogoBM size={24} color="#FFF02B" />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `64` | Width and height in pixels (scales uniformly) |
| `color` | `string` | `#FFF02B` | Logo color (should always be brand yellow) |

---

## 🎨 Brand Kit Constraints

### Colors

**Primary Background:**
- Pure Black: `#000000`
- Dark Gray: `#121212`

**Accent (Logo):**
- Yellow: `#FFF02B` ← **USE THIS FOR BM LOGO**

**Supporting:**
- Gray: `#4D4D4D`

### Rules

✅ **DO:**
- Use `#FFF02B` (yellow) for the BM logo
- Place logo on solid black or dark gray backgrounds
- Keep logo clean and unmodified
- Scale uniformly (same width and height)

❌ **DO NOT:**
- Redraw or recreate the BM letters
- Add gradients, glows, or outlines
- Use different fonts or thicknesses
- Modify proportions or spacing
- Add effects that reduce recognizability
- Use colors other than `#FFF02B` (except special cases approved by design)

---

## 📱 Logo Placement in Mobile App

### Current Implementation

| Screen | Size | Color | Position | Status |
|--------|------|-------|----------|--------|
| **Balance** | 24px | #FFF02B | Header, left of title | ✅ Implemented |
| **P&L** | 24px | #FFF02B | Header, left of title | ✅ Implemented |
| **Manual Entry** | 24px | #FFF02B | Header, left of title | ✅ Implemented |
| **Activity** | 24px | #FFF02B | Header, left of title | ✅ Implemented |
| **Splash Screen** | 120px | #FFF02B | Center | ✅ Component ready |

### Guidelines

**Splash / Launch Screen:**
- Centered BM logo (120px)
- Pure black background (#000000)
- Clean, minimal presentation

**Screen Headers:**
- Small logo (24px) next to screen title
- Left-aligned in header
- Consistent spacing

**General:**
- Use sparingly - don't spam every view
- Logo should enhance brand, not clutter UI
- Maintain visual hierarchy

---

## 🚫 Common Mistakes to Avoid

### ❌ WRONG: Custom Redraws
```tsx
// DON'T create custom SVG paths
<Path d="M40 50 L40 150..." /> // ❌ WRONG
```

### ✅ CORRECT: Official Component
```tsx
// DO use the official logo component
<LogoBM size={40} /> // ✅ CORRECT
```

### ❌ WRONG: Modified Logo
```tsx
// DON'T add effects or modifications
<LogoBM 
  size={40} 
  style={{ textShadow: '0 0 10px #FFF02B' }} // ❌ WRONG
/>
```

### ✅ CORRECT: Clean Logo
```tsx
// DO keep it clean and simple
<LogoBM size={40} color="#FFF02B" /> // ✅ CORRECT
```

---

## 📂 File Structure

```
assets/
  logo/
    bm-logo.svg          ← Official source SVG

src/
  components/
    LogoBM.tsx           ← Official logo component (renders SVG)
  
  screens/
    BalanceScreen.tsx    ← Uses <LogoBM size={24} />
    PLScreen.tsx         ← Uses <LogoBM size={24} />
    ManualEntryScreen.tsx← Uses <LogoBM size={24} />
    InboxScreen.tsx      ← Uses <LogoBM size={24} />
    SplashScreen.tsx     ← Uses <LogoBM size={120} />
```

---

## ✅ Verification Checklist

Before deploying any changes:

- [ ] Logo component imports from `src/components/LogoBM.tsx`
- [ ] Logo renders the official BM design (not custom paths)
- [ ] Logo uses brand yellow `#FFF02B` (default)
- [ ] Logo sits on black/dark gray background
- [ ] No gradients, glows, or unauthorized effects applied
- [ ] Logo is consistently sized across similar contexts
- [ ] All instances use the same `<LogoBM />` component
- [ ] No functionality or API behavior changed

---

## 🌐 Cross-Platform Consistency

**Mobile App (React Native):**
- Component: `/src/components/LogoBM.tsx`
- Asset: `/assets/logo/bm-logo.svg`

**Web App (when applicable):**
- Component: `/src/components/LogoBM.tsx` or `.jsx`
- Asset: `/public/logo/bm-logo.svg`

**Both platforms MUST use the same official SVG asset.**

---

## 📝 Summary

**One Logo. One Source. No Variations.**

1. ✅ Official SVG: `/assets/logo/bm-logo.svg`
2. ✅ Official Component: `<LogoBM />`
3. ✅ Official Color: `#FFF02B`
4. ❌ No custom redraws or modifications
5. ❌ No additional effects or styling
6. ✅ Same asset across mobile + web

**If you're not using the official `<LogoBM />` component, you're doing it wrong.**

---

## 🔧 Technical Implementation

The `LogoBM` component:
- Renders the official "BM" text logo using react-native-svg
- Scales uniformly based on `size` prop
- Applies `color` prop (default: `#FFF02B`)
- Maintains exact proportions and font as per brand spec
- No internal modifications to design
- Pure, functional component

**The component IS the official logo renderer. Trust it.**

---

## 📞 Questions?

**Before creating a custom variation, ask:**
1. Does the official `<LogoBM />` component meet my needs?
2. Have I tried adjusting only `size` and `color` props?
3. Is this approved by the design team?

**99% of the time, the answer is: just use `<LogoBM />`.**

---

**Last Updated:** November 7, 2025  
**Status:** ✅ Official logo component implemented and deployed  
**Compliance:** 100% - Using official BM logo asset only
