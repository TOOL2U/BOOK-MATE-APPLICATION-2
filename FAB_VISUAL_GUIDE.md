# 📲 FAB Menu Visual Guide

## Component Layout

```
┌─────────────────────────────────────┐
│         📱 Screen Header            │
├─────────────────────────────────────┤
│                                     │
│                                     │
│         Screen Content              │
│                                     │
│                                     │
│                                     │
│            ┌───────────┐            │
│            │ 📝 Manual │  ← Menu    │
│            ├───────────┤    Option  │
│            │ 🔄 Transfer│            │
│            ├───────────┤            │
│            │ 📷 Upload │            │
│            └───────────┘            │
│                 ↑                   │
│            ╭─────────╮              │
│            │    +    │  ← FAB       │
│            ╰─────────╯    (64x64)  │
├─────────────────────────────────────┤
│ [📝] [📷] [💰] [📊] [⚡]  ← Bottom │
│                               Tabs  │
└─────────────────────────────────────┘
```

## Visual States

### Closed State (Default)
```
┌─────────────────────────┐
│                         │
│    Screen Content       │
│                         │
│     ╭─────────╮         │
│     │    +    │  ← Yellow circle
│     ╰─────────╯    64x64, #FFF02B
├─────────────────────────┤
│  Bottom Navigation      │
└─────────────────────────┘
```

### Open State (Menu Visible)
```
┌─────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░ │ ← Dark overlay
│ ░░┌───────────────┐░░░░ │   rgba(0,0,0,0.5)
│ ░░│ 📝 Manual     │░░░░ │
│ ░░│ Entry         │░░░░ │ ← Menu card
│ ░░├───────────────┤░░░░ │   #1A1A1A
│ ░░│ 🔄 Transfer   │░░░░ │   200px wide
│ ░░├───────────────┤░░░░ │
│ ░░│ 📷 Upload     │░░░░ │
│ ░░│ Receipt       │░░░░ │
│ ░░└───────────────┘░░░░ │
│ ░░░░░░↑░░░░░░░░░░░░░░░░ │
│ ░░╭─────────╮░░░░░░░░░░ │
│ ░░│    ✕    │░░░░ ← "+" rotated 45°
│ ░░╰─────────╯░░░░░░░░░░ │
├─────────────────────────┤
│  Bottom Navigation      │
└─────────────────────────┘
```

## Color Palette

### FAB Button
```css
background: #FFF02B (Brand Yellow)
icon: #000000 (Brand Black)
shadow: iOS/Android elevation
size: 64x64 circular
```

### Menu Container
```css
background: #1A1A1A (Card Primary)
border: 1px solid rgba(255,255,255,0.06)
borderRadius: 16px
padding: 12px
shadow: Elevated
```

### Menu Options
```css
background: transparent (hover: #1E1E1E)
text: #FFFFFF (Primary Text)
icon: #FFFFFF
height: 48px each
gap: 8px between
```

### Overlay
```css
background: rgba(0, 0, 0, 0.5)
fullscreen
z-index: 999
```

## Animations

### FAB Open Animation (200ms)
```
Icon Rotation:
  0deg → 45deg (smooth ease-out)

Menu Scale:
  0.8 → 1.0 (smooth ease-out)

Overlay Opacity:
  0 → 1 (fade in)
```

### FAB Close Animation (200ms)
```
Icon Rotation:
  45deg → 0deg (smooth ease-in)

Menu Scale:
  1.0 → 0.8 (smooth ease-in)

Overlay Opacity:
  1 → 0 (fade out)
```

## Interactive Zones

```
┌────────────────────────────────┐
│  TAP OUTSIDE = CLOSE MENU      │
│  ┌──────────────────────┐      │
│  │  MENU OPTIONS        │      │
│  │  ┌────────────────┐  │      │
│  │  │ 📝 Manual      │ ← Tap = Open Modal
│  │  ├────────────────┤  │      │
│  │  │ 🔄 Transfer    │ ← Tap = Open Modal
│  │  ├────────────────┤  │      │
│  │  │ 📷 Upload      │ ← Tap = Navigate
│  │  └────────────────┘  │      │
│  └──────────────────────┘      │
│          ↑                     │
│    ╭──────────╮                │
│    │    +     │ ← Tap = Toggle Menu
│    ╰──────────╯                │
└────────────────────────────────┘
```

## Z-Index Hierarchy

```
Layer 6: Modals (WizardManualEntry, TransferModal) - z-index: 2000+
Layer 5: Menu Overlay - z-index: 999
Layer 4: Menu Container - z-index: 1001
Layer 3: FAB Button - z-index: 1000
Layer 2: Screen Content - z-index: 1
Layer 1: Bottom Navigation - z-index: 0
```

## Icon Mapping

### Menu Option Icons
```
Manual Entry    → create-outline (Ionicons)
Transfer        → swap-horizontal-outline (Ionicons)
Upload Receipt  → camera-outline (Ionicons)
```

### FAB Icon States
```
Closed State: + (plus icon, 0° rotation)
Open State:   ✕ (x icon, 45° rotation of +)
```

## Positioning

### FAB Position
```css
position: absolute
bottom: 100px (clears bottom nav)
alignSelf: center (horizontal center)
zIndex: 1000
```

### Menu Position
```css
position: absolute (within modal)
bottom: 180px (above FAB)
alignSelf: center (horizontal center)
zIndex: 1001
```

## Touch Targets

All interactive elements meet minimum size requirements:

```
FAB Button:      64x64 (✅ exceeds 48x48 minimum)
Menu Options:    200x48 each (✅ meets minimum)
Overlay:         Full screen (✅ easy to tap)
```

## Responsive Behavior

### Portrait Mode
- FAB centered horizontally
- Menu appears directly above FAB
- Overlay covers entire screen

### Different Screen Sizes
- FAB position relative to bottom nav (100px bottom margin)
- Menu width fixed (200px) for consistency
- All spacing uses absolute pixels for precision

## Accessibility

### Visual Feedback
- Tap → Haptic feedback (iOS)
- Tap → Visual scale animation
- Menu option → Background highlight on press

### Clear Labels
```
✅ "Manual Entry" (not just icon)
✅ "Transfer" (not just icon)
✅ "Upload Receipt" (not just icon)
```

### Professional Icons
```
✅ Ionicons (vector icons)
✅ 24px size (clearly visible)
✅ White color (high contrast on dark)
```

---

## Implementation Files

```
src/components/ui/FabMenu.tsx  ← FAB Component
App.tsx (MainNavigator)        ← Integration
```

## Dependencies

```typescript
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SHADOWS } from '../../config/theme';
```

---

*This visual guide shows the exact layout, colors, animations, and behavior of the FAB menu implementation.*
