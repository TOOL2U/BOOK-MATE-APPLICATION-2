# 🔍 Debug: Login Working But API Calls Failing

**Issue:** Login succeeds but then all API calls get 401 errors

---

## 🐛 Problem Analysis

Your console shows:
```
LOG  Login successful: maria@siamoon.com  ← Login worked!
ERROR Failed to fetch dropdown options: [Error: HTTP 401] ← But API calls fail
```

This means:
1. ✅ Login endpoint works
2. ✅ Token is received
3. ✅ Token is stored in AsyncStorage
4. ❌ But subsequent API calls don't include the token

---

## 🔧 Quick Fix Steps

### Step 1: Clear App Data & Restart

The app might be using cached code. Do this:

1. **Stop the Expo server** (Ctrl+C in terminal)
2. **Clear Metro bundler cache:**
   ```bash
   npx expo start --clear
   ```
3. **In the app: Shake device → "Reload"**
4. **Or: Force quit app and reopen**

### Step 2: Verify Token is Being Saved

Add this debug log right after login success:

In `LoginScreen.tsx` line ~50, add:
```typescript
if (response.success) {
  // DEBUG: Check if token was saved
  import('@react-native-async-storage/async-storage').then(async (AsyncStorage) => {
    const token = await AsyncStorage.default.getItem('@bookmate:token');
    console.log('🔑 Token stored:', token ? token.substring(0, 30) + '...' : 'NULL');
  });
  
  console.log('Login successful:', response.user?.email);
  onLoginSuccess();
}
```

### Step 3: Verify Token is Being Retrieved

In `http.ts` line ~14, add debug log:
```typescript
async function coreFetch(path: string, init?: RequestInit) {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  
  // Get JWT token for authentication
  const token = await getToken();
  console.log('🔐 Token for', path, ':', token ? token.substring(0, 30) + '...' : 'NULL');
  
  // ... rest of function
}
```

---

## 🎯 Expected Output After Fix

```
LOG  Login successful: maria@siamoon.com
LOG  🔑 Token stored: eyJhbGciOiJIUzI1NiIsInR5cCI...
LOG  🔐 Token for /api/options: eyJhbGciOiJIUzI1NiIsInR5cCI...
LOG  Options fetched successfully
```

If you see `Token: NULL`, that's the problem!

---

## 🚨 Alternative: Manual Reset

If the above doesn't work, try this nuclear option:

### Option A: Delete and reinstall app
1. Delete app from simulator
2. Run `npx expo start`
3. Install fresh

### Option B: Clear AsyncStorage manually

Add this button temporarily to LoginScreen:
```typescript
<Button 
  title="CLEAR STORAGE (DEBUG)" 
  onPress={async () => {
    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    await AsyncStorage.default.clear();
    Alert.alert('Storage cleared');
  }}
/>
```

---

## 📞 If Still Not Working

The issue might be that the webapp endpoint isn't ready yet. Contact them and ask:

1. Are these credentials actually working on the webapp?
2. Is the `/api/auth/login` endpoint live?
3. Can they test login with `maria@siamoon.com` / `Alesiamaya231`?

My direct test of the login endpoint failed with "Invalid email or password", which suggests the server might not be fully configured yet.

---

**Try:** `npx expo start --clear` first!
