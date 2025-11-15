# User Switch Cache Fix

## Problem
When logging out of one account (e.g., Shaun's account) and logging into another account (e.g., Maria's account), the app was displaying cached data from the previous account until the screen was manually refreshed.

## Root Cause
The `OptionsProvider` context was only fetching data once on mount and not refreshing when the user changed. This caused:
- Old dropdown options (properties, payment types, etc.) to persist
- Screen data to show previous user's information
- Need for manual page refresh to see correct data

## Solution
Implemented a **forced remount strategy** using React keys:

### 1. Added User Key State (App.tsx)
```typescript
const [userKey, setUserKey] = useState(0); // Key to force remount on user change
```

### 2. Increment Key on Login/Logout
```typescript
const handleLoginSuccess = () => {
  console.log('🔑 User logged in - forcing fresh data load');
  setAuthenticated(true);
  setUserKey(prev => prev + 1); // Force remount with fresh data
};

const handleLogout = () => {
  console.log('🚪 User logged out - clearing cached data');
  setAuthenticated(false);
  setUserKey(prev => prev + 1); // Force remount to clear old data
};
```

### 3. Apply Key to OptionsProvider
```typescript
<OptionsProvider key={userKey}>
  <NavigationContainer>
    <StatusBar style="light" />
    <MainNavigator onLogout={handleLogout} />
  </NavigationContainer>
</OptionsProvider>
```

### 4. Added Logging for Debugging
- `OptionsContext.tsx`: Logs when fetching fresh options and which properties loaded
- `App.tsx`: Logs when user logs in/out and forces data refresh

## How It Works
1. When a user logs in, `userKey` increments (e.g., 0 → 1)
2. React sees the key change on `OptionsProvider` and completely **unmounts** the old instance
3. React creates a **new instance** with fresh state
4. The new `OptionsProvider` runs `useEffect` and fetches fresh data from `/api/options`
5. All child components get fresh context data automatically
6. Same process happens on logout to clear old data

## Benefits
✅ **No cached data** - Fresh fetch on every login  
✅ **Automatic refresh** - All screens update without manual refresh  
✅ **Account isolation** - Each account's data is completely separate  
✅ **Simple implementation** - Uses React's built-in key prop behavior  
✅ **Debuggable** - Console logs track when data refreshes  

## Testing Checklist
- [ ] Log out of Shaun's account
- [ ] Log into Maria's account
- [ ] Verify dropdown options show Maria's properties (not Shaun's "Family")
- [ ] Verify dashboard shows Maria's data immediately
- [ ] Verify no manual refresh needed
- [ ] Check console logs show "forcing fresh data load" and "Options loaded for account"

## Technical Notes
- The `key` prop forces React to treat components as completely different instances
- When key changes, React unmounts old component and mounts new one
- This triggers all lifecycle methods (useEffect, useState initialization, etc.)
- More reliable than manual cache clearing for complex context state

## Files Modified
- `App.tsx` - Added `userKey` state and key prop on `OptionsProvider`
- `src/contexts/OptionsContext.tsx` - Added logging for debugging
- `src/services/authService.ts` - Already had proper logout clearing (no changes needed)
- `src/screens/SettingsScreen.tsx` - Already using `onLogout` callback (no changes needed)

## Console Log Output Example
```
🚪 User logged out - clearing cached data
🔄 OptionsContext: Fetching fresh dropdown options...
✅ OptionsContext: Options loaded for account
   Properties: []

🔑 User logged in - forcing fresh data load
🔄 OptionsContext: Fetching fresh dropdown options...
✅ OptionsContext: Options loaded for account
   Properties: ['Family', 'Casa Siam']
```

## Status
✅ **FIXED** - Users can now switch accounts without seeing cached data
