# Lottie Animations for Tab Icons

## How to Use

### Option 1: Regular Animated Icons (Current Default)
The current setup uses Ionicons with scale and bounce animations.

### Option 2: Lottie Animations
To use Lottie animations instead:

1. Add Lottie JSON files to this directory
2. In `App.tsx`, update the tab icon like this:

```tsx
tabBarIcon: ({ color, size, focused }) => (
  <AnimatedTabIcon
    focused={focused}
    color={color}
    size={22}
    name="create-outline"
    useLottie={true}
    lottieSource={require('../assets/lottie/pen-bounce.json')}
  />
)
```

## Finding Lottie Icons

Free Lottie animations can be found at:
- https://lottiefiles.com/
- https://iconscout.com/lottie-animations

Search for:
- "pen icon" or "edit icon" (for Manual Entry)
- "camera icon" (for Upload)
- "wallet icon" or "money icon" (for Balance)
- "chart icon" or "graph icon" (for P&L)
- "pulse icon" or "activity icon" (for Activity)

## Reverting to Regular Icons

To go back to the regular animated icons:
1. Simply remove `useLottie={true}` and `lottieSource={...}` props
2. Or restore from backup: `cp src/components/AnimatedTabIcon.backup.tsx src/components/AnimatedTabIcon.tsx`

## Current Setup

Right now, the component supports BOTH:
- If `useLottie={false}` or omitted: Uses Ionicons with bounce animation
- If `useLottie={true}`: Uses Lottie animation files
