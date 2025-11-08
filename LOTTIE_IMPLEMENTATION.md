# 🎨 BookMate Lottie Animation System

## ✅ Implementation Complete

All Lottie animations have been implemented with brand-aligned colors (#FFF02B yellow on black).

## 📁 Animation Files Created

All files are in `/assets/lottie/`:

1. **penIcon.json** - Manual Entry tab (pen with slight tilt and scale)
2. **uploadPulse.json** - Upload tab (arrow floating upward)
3. **walletGlow.json** - Balance tab (wallet with subtle glow pulse)
4. **chartLine.json** - P&L tab (line graph drawing animation)
5. **activityWave.json** - Activity tab (pulse ring expanding outward)
6. **checkSuccess.json** - Success state (checkmark draw-in)
7. **syncRing.json** - Sync indicator (rotating dashed ring)

## 🎯 Current Status

### ✅ Implemented
- All 5 navigation tabs now use Lottie animations
- Animations are brand-aligned (#FFF02B yellow)
- Duration: 400-700ms (professional, not distracting)
- Trigger: Plays once when tab is focused
- Backup available at `src/components/AnimatedTabIcon.backup.tsx`

### 🔄 How It Works

When a tab is tapped:
1. Haptic feedback triggers (iOS only)
2. Lottie animation plays once
3. Icon remains in final animation state

When unfocused:
4. Animation resets to initial state

## 🛠️ To Revert to Regular Icons

If Lottie animations aren't working or you prefer the bounce animation:

```bash
# Remove useLottie props from App.tsx manually, OR:
# Restore backup
cp src/components/AnimatedTabIcon.backup.tsx src/components/AnimatedTabIcon.tsx
```

Then in `App.tsx`, remove `useLottie={true}` and `lottieSource={...}` from each tab.

## 🎨 Brand Compliance

All animations use:
- **Primary Yellow**: `#FFF02B` (rgb: 255, 240, 43)
- **Minimal design**: No gradients, no shadows (except subtle wallet glow)
- **Professional timing**: 40-60 frames, 400-700ms duration
- **Native performance**: Uses native driver where possible

## 🧪 Testing

1. **Tap each tab** - animation should play once
2. **Switch between tabs** - animations should reset and replay
3. **Check performance** - should be smooth 60fps
4. **iOS haptics** - should feel tactile feedback

## 📦 Dependencies

Already installed:
```json
{
  "lottie-react-native": "^6.7.2",
  "lottie-ios": "^4.5.0" // Auto-installed via expo
}
```

## 🚀 Future Enhancements

### Sync Indicator (Not Yet Implemented)
Use `syncRing.json` to show syncing status:

```tsx
{isSyncing ? (
  <LottieView
    source={require('../assets/lottie/syncRing.json')}
    autoPlay
    loop
    style={{ width: 18, height: 18 }}
  />
) : (
  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: isOnline ? '#00FF00' : '#888' }} />
)}
```

### Success/Error Notifications
Use `checkSuccess.json` for successful transactions:

```tsx
<LottieView
  source={require('../assets/lottie/checkSuccess.json')}
  autoPlay
  loop={false}
  style={{ width: 40, height: 40 }}
  onAnimationFinish={() => setShowSuccess(false)}
/>
```

## 🎬 Animation Specs

| File | Duration | Loop | Trigger | Purpose |
|------|----------|------|---------|---------|
| penIcon.json | 40 frames (667ms) | No | Tab focus | Manual entry icon |
| uploadPulse.json | 40 frames (667ms) | No | Tab focus | Upload icon float |
| walletGlow.json | 40 frames (667ms) | No | Tab focus | Balance icon glow |
| chartLine.json | 40 frames (667ms) | No | Tab focus | P&L line draw |
| activityWave.json | 40 frames (667ms) | No | Tab focus | Activity pulse ring |
| checkSuccess.json | 30 frames (500ms) | No | On success | Success checkmark |
| syncRing.json | 90 frames (1500ms) | Yes | While syncing | Sync indicator |

## 🔧 Customization

To adjust animation speed, edit the JSON files:
- `"fr": 60` = 60 frames per second
- `"op": 40` = 40 frames total = 667ms duration
- Increase `op` for slower, decrease for faster

To change colors:
- All animations use `"c": {"a": 0, "k": [1, 0.941, 0.169, 1]}`
- This is RGBA for #FFF02B (yellow)
- Modify `k` array: [R/255, G/255, B/255, alpha]

## 💡 Tips

1. **Performance**: Lottie uses native rendering, so these animations are performant
2. **File Size**: Each JSON is ~1-2KB, minimal impact on app bundle
3. **Fallback**: Component automatically falls back to Ionicons if Lottie fails
4. **Debugging**: Check console for "AnimatedTabIcon - focused:" logs

## ✨ Result

Your app now has:
- ✅ Professional, subtle micro-animations
- ✅ Brand-aligned yellow #FFF02B throughout
- ✅ Responsive feedback on every tab tap
- ✅ Minimal, clean aesthetic maintained
- ✅ Easy revert option if needed
