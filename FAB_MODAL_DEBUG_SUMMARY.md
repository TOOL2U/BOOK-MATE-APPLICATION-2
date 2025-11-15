# 🔍 FAB Modal Investigation & Debug Setup

## Current Status
Added comprehensive debugging to track why Manual Entry and Transfer modals aren't opening from the FAB menu.

## Changes Made

### 1. FabMenu.tsx - Added Debug Logs
**Location:** `src/components/ui/FabMenu.tsx`

```typescript
const handleManual = () => {
  console.log('Manual Entry clicked');         // Step 1: User taps option
  closeMenu();
  setTimeout(() => {
    console.log('Opening Manual Entry modal...'); // Step 2: Callback should fire
    onOpenManualEntry();
  }, 250);  // Increased from 100ms to 250ms
};

const handleTransfer = () => {
  console.log('Transfer clicked');             // Step 1: User taps option
  closeMenu();
  setTimeout(() => {
    console.log('Opening Transfer modal...');    // Step 2: Callback should fire
    onOpenTransfer();
  }, 250);  // Increased from 100ms to 250ms
};

const handleUpload = () => {
  console.log('Upload clicked');               // Step 1: User taps option
  closeMenu();
  setTimeout(() => {
    console.log('Navigating to Upload...');      // Step 2: Navigation should happen
    navigation.navigate('Upload' as never);
  }, 250);  // Increased from 100ms to 250ms
};
```

**Why 250ms?** Give menu close animation (200ms) time to complete before opening modal.

---

### 2. App.tsx - Added State Tracking
**Location:** `App.tsx` (MainNavigator component)

```typescript
// Track wizard modal state
useEffect(() => {
  console.log('Wizard Modal Visible:', wizardModalVisible);
}, [wizardModalVisible]);

// Track transfer modal state
useEffect(() => {
  console.log('Transfer Modal Visible:', transferModalVisible);
}, [transferModalVisible]);

// Track when callbacks are invoked
<FabMenu
  onOpenManualEntry={() => {
    console.log('FAB: onOpenManualEntry callback triggered');
    setWizardModalVisible(true);
  }}
  onOpenTransfer={() => {
    console.log('FAB: onOpenTransfer callback triggered');
    setTransferModalVisible(true);
  }}
/>

// Track modal close events
<WizardManualEntry
  visible={wizardModalVisible}
  onClose={() => {
    console.log('Wizard modal onClose called');
    setWizardModalVisible(false);
  }}
  // ... other props
/>

<TransferModal
  visible={transferModalVisible}
  onClose={() => {
    console.log('Transfer modal onClose called');
    setTransferModalVisible(false);
  }}
/>
```

---

## Debug Flow Chart

```
User taps FAB (+)
    ↓
Menu opens (modal with 3 options)
    ↓
User taps "Manual Entry"
    ↓
[1] console.log('Manual Entry clicked') ← Should appear
    ↓
closeMenu() executes (200ms animation)
    ↓
Wait 250ms (setTimeout)
    ↓
[2] console.log('Opening Manual Entry modal...') ← Should appear
    ↓
onOpenManualEntry() called
    ↓
[3] console.log('FAB: onOpenManualEntry callback triggered') ← Should appear
    ↓
setWizardModalVisible(true) executed
    ↓
[4] useEffect detects change
    ↓
[5] console.log('Wizard Modal Visible: true') ← Should appear
    ↓
React re-renders with visible={true}
    ↓
WizardManualEntry <Modal visible={true}> should appear
    ↓
✅ Modal appears on screen
```

---

## Expected Console Output

### Successful Manual Entry Flow:
```
Manual Entry clicked
Opening Manual Entry modal...
FAB: onOpenManualEntry callback triggered
Wizard Modal Visible: true
```

### Successful Transfer Flow:
```
Transfer clicked
Opening Transfer modal...
FAB: onOpenTransfer callback triggered
Transfer Modal Visible: true
```

### Successful Upload Flow:
```
Upload clicked
Navigating to Upload...
```

---

## Potential Issues & Diagnoses

### Scenario 1: No logs appear at all
**Diagnosis:** Touch events not reaching menu options  
**Likely Cause:** 
- TouchableWithoutFeedback blocking touches
- Modal overlay intercepting events
- pointerEvents misconfiguration

**Fix:** Verify menu option TouchableOpacity components are receiving touches

---

### Scenario 2: Step [1] appears but not [2]
**Diagnosis:** closeMenu() blocking setTimeout  
**Likely Cause:**
- Animation callback clearing timeout
- Component unmounting during close animation

**Fix:** Remove closeMenu() call or use different timing

---

### Scenario 3: Steps [1][2] appear but not [3]
**Diagnosis:** onOpenManualEntry callback not connected  
**Likely Cause:**
- Props not passed correctly from App.tsx to FabMenu
- Function reference lost during render

**Fix:** Verify FabMenu receives correct callback props

---

### Scenario 4: Steps [1][2][3][4][5] all appear but modal doesn't show
**Diagnosis:** Modal rendering issue  
**Likely Cause:**
- Modal rendered but behind other components (z-index)
- Modal animationType not working
- Modal inside wrong container

**Fix:** 
- Check modal is inside NavigationContainer
- Verify modal has proper z-index
- Check WizardManualEntry/TransferModal visible prop handling

---

### Scenario 5: Modal flashes and immediately closes
**Diagnosis:** State immediately reverting to false  
**Likely Cause:**
- onClose being called immediately
- Re-render resetting state
- Props changing causing close

**Fix:** Check for conflicting state updates

---

## Component Tree Structure

```
App
└── SafeAreaProvider
    └── OptionsProvider (provides dropdown data)
        └── NavigationContainer
            └── MainNavigator ← FAB state managed here
                ├── Tab.Navigator
                │   ├── ManualEntryScreen (tab)
                │   ├── UploadScreen (tab)
                │   ├── BalanceScreen (tab)
                │   ├── PLScreen (tab)
                │   ├── InboxScreen (tab)
                │   └── SettingsScreen (hidden tab)
                │
                ├── FabMenu (floating, z-index: 1000)
                │   └── Modal (menu overlay)
                │       └── 3 options (Manual, Transfer, Upload)
                │
                ├── WizardManualEntry ← Modal component
                │   └── visible={wizardModalVisible}
                │
                └── TransferModal ← Modal component
                    └── visible={transferModalVisible}
```

**Note:** Both modals are siblings of Tab.Navigator, rendered at same level. This is correct for modal visibility.

---

## Testing Instructions

1. **Reload the app** (`r` in Metro bundler or shake device)
2. **Open Metro Bundler terminal** to see console logs
3. **Tap the yellow FAB button** (+ icon)
4. **Verify menu opens** with 3 options
5. **Tap "Manual Entry"** option
6. **Observe console logs** in Metro terminal
7. **Check if WizardManualEntry modal appears**

Repeat steps 5-7 for "Transfer" option.

---

## What to Share

Please share the following:

1. **Console output** from Metro bundler after tapping options
2. **Visual behavior:** 
   - Does menu close when option is tapped? ✓/✗
   - Does modal appear? ✓/✗
   - Any error messages? (share them)
3. **Which logs appeared:**
   - [ ] "Manual Entry clicked"
   - [ ] "Opening Manual Entry modal..."
   - [ ] "FAB: onOpenManualEntry callback triggered"
   - [ ] "Wizard Modal Visible: true"

This will tell us exactly where the flow breaks!

---

## Quick Fixes to Try

### Fix 1: Remove closeMenu() delay
If menu is interfering, try opening modal immediately:

```typescript
const handleManual = () => {
  onOpenManualEntry();  // Open modal first
  closeMenu();          // Then close menu
};
```

### Fix 2: Force modal to top
If modal is rendering behind elements, add to modal styles:

```typescript
// In WizardManualEntry and TransferModal
<Modal
  visible={visible}
  transparent={true}
  animationType="fade"
  // Add this:
  presentationStyle="overFullScreen"
>
```

### Fix 3: Test state directly
Try hardcoding state to verify modal works:

```typescript
// In MainNavigator, temporarily change:
const [wizardModalVisible, setWizardModalVisible] = useState(true); // ← Force true

// If modal appears, state management works. Issue is in callback chain.
```

---

## Files to Check

1. ✅ `src/components/ui/FabMenu.tsx` - FAB component with menu
2. ✅ `App.tsx` - State management for modals
3. ⚠️ `src/components/WizardManualEntry.tsx` - Wizard modal component
4. ⚠️ `src/components/TransferModal.tsx` - Transfer modal component

Next, we may need to check if the modal components themselves have issues rendering.

---

*Debug setup complete. Ready for testing!*
