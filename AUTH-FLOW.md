# Authentication Flow Documentation
**BookMate Mobile Application**  
Version: 1.0.0  
Last Updated: November 11, 2025

---

## Current State: No Authentication (v1.0)

### Overview
The BookMate mobile application **currently does not implement user authentication**. The app is designed for direct access to the backend API using a shared webhook secret.

**This is intentional for v1.0** based on the current architecture where:
- The app operates on a single Google Sheets backend
- Access control is managed at the API/backend level
- The mobile app is an internal tool for Sia Moon accounting

---

## API Authentication Method

### Current Implementation

**Authentication Type:** Webhook Secret (Shared Key)

**How It Works:**
```typescript
// src/services/api.ts
const AUTH_SECRET = process.env.EXPO_PUBLIC_AUTH_SECRET || '';

// Included in requests (if backend requires it)
headers: {
  'Authorization': `Bearer ${AUTH_SECRET}`,
  'Content-Type': 'application/json'
}
```

**Backend Endpoints:**
- **Base URL:** `https://accounting.siamoon.com/api`
- **All endpoints are currently open** (no auth token validation in mobile app)

**Environment Variables:**
```bash
# .env
EXPO_PUBLIC_API_BASE_URL=https://accounting.siamoon.com/api
EXPO_PUBLIC_AUTH_SECRET=your_sheets_webhook_secret_here
```

---

## Token Storage (Future Implementation)

### If Authentication is Added in v2.0

**Recommended Approach: Expo SecureStore**

```typescript
import * as SecureStore from 'expo-secure-store';

// Store tokens securely
await SecureStore.setItemAsync('authToken', token);
await SecureStore.setItemAsync('refreshToken', refreshToken);

// Retrieve tokens
const authToken = await SecureStore.getItemAsync('authToken');

// Delete on logout
await SecureStore.deleteItemAsync('authToken');
```

**Why SecureStore:**
- ✅ iOS: Uses Keychain
- ✅ Android: Uses EncryptedSharedPreferences
- ✅ Secure storage for sensitive data
- ✅ Persists across app restarts
- ❌ Not available on web (would need AsyncStorage fallback)

---

## Future Auth Flow (v2.0+ Recommendation)

### Option 1: Email/Password Authentication

**Login Flow:**
```
1. User enters email + password
2. POST /api/auth/login
3. Backend returns { authToken, refreshToken, user }
4. Store tokens in SecureStore
5. Navigate to Dashboard
```

**Request Example:**
```typescript
async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const { authToken, refreshToken, user } = await response.json();
  
  await SecureStore.setItemAsync('authToken', authToken);
  await SecureStore.setItemAsync('refreshToken', refreshToken);
  
  return user;
}
```

### Option 2: Magic Link Authentication

**Flow:**
```
1. User enters email
2. POST /api/auth/magic-link { email }
3. Backend sends email with one-time link
4. User clicks link → opens app with token
5. Store token in SecureStore
6. Navigate to Dashboard
```

**Benefits:**
- No password management
- Better UX for mobile
- More secure (no password to steal)

### Option 3: OAuth (Google/Apple Sign-In)

**Recommended for Public Release:**
```typescript
// Using expo-auth-session
import * as AuthSession from 'expo-auth-session';

const [request, response, promptAsync] = Google.useAuthRequest({
  clientId: 'YOUR_GOOGLE_CLIENT_ID',
});

// After successful auth
const { idToken, accessToken } = response.authentication;
```

---

## Token Refresh Strategy (Future)

### Auto-Refresh Implementation

```typescript
// src/services/authService.ts
export async function refreshAuthToken() {
  const refreshToken = await SecureStore.getItemAsync('refreshToken');
  
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  
  const { authToken, newRefreshToken } = await response.json();
  
  await SecureStore.setItemAsync('authToken', authToken);
  await SecureStore.setItemAsync('refreshToken', newRefreshToken);
  
  return authToken;
}
```

### API Interceptor with Auto-Refresh

```typescript
// src/services/api.ts
async function makeAuthenticatedRequest(endpoint: string, options: RequestInit) {
  let authToken = await SecureStore.getItemAsync('authToken');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${authToken}`
    }
  });
  
  // If token expired, refresh and retry
  if (response.status === 401) {
    authToken = await refreshAuthToken();
    
    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${authToken}`
      }
    });
  }
  
  return response;
}
```

---

## Error Handling

### 401 Unauthorized (Token Expired)

**Current:** Not implemented

**Recommended (v2.0):**
```typescript
if (response.status === 401) {
  // Try to refresh token
  try {
    await refreshAuthToken();
    // Retry original request
  } catch {
    // Refresh failed, force re-login
    await logout();
    navigation.navigate('Login');
  }
}
```

### 403 Forbidden (Insufficient Permissions)

```typescript
if (response.status === 403) {
  showError('Access Denied', 'You don\'t have permission to perform this action.');
}
```

### Network Errors

**Already Implemented:**
```typescript
// src/services/api.ts handles network errors
try {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
} catch (error) {
  return { ok: false, error: error.message };
}
```

---

## Session Management

### Current: No Sessions
- App does not track logged-in state
- No session expiry
- No logout functionality

### Recommended (v2.0):

**State Management:**
```typescript
// Context for auth state
const AuthContext = React.createContext({
  user: null,
  isAuthenticated: false,
  login: async (email, password) => {},
  logout: async () => {},
  refreshAuth: async () => {}
});
```

**Persistent Session:**
```typescript
// Check on app launch
useEffect(() => {
  async function checkAuth() {
    const authToken = await SecureStore.getItemAsync('authToken');
    if (authToken) {
      // Validate token
      const isValid = await validateToken(authToken);
      if (isValid) {
        setIsAuthenticated(true);
      } else {
        await logout();
      }
    }
  }
  checkAuth();
}, []);
```

**Auto-Logout on Inactivity:**
```typescript
// Optional: Logout after 30 mins of inactivity
let lastActivity = Date.now();

const resetTimer = () => {
  lastActivity = Date.now();
};

useEffect(() => {
  const interval = setInterval(() => {
    if (Date.now() - lastActivity > 30 * 60 * 1000) {
      logout();
    }
  }, 60000); // Check every minute
  
  return () => clearInterval(interval);
}, []);
```

---

## Security Considerations

### Current Risks (v1.0)
- ⚠️ **No user authentication** - Anyone with the app can access all data
- ⚠️ **Shared secret** - Same AUTH_SECRET for all users
- ⚠️ **No access control** - All users have full permissions

### Recommended Mitigations (v2.0)
1. **Implement user authentication** with individual tokens
2. **Role-based access control** (admin, viewer, editor)
3. **Audit logging** - Track who changed what
4. **Token expiry** - Short-lived access tokens (15 mins)
5. **Refresh tokens** - Longer-lived (30 days) with rotation
6. **Device tracking** - Know which devices are logged in
7. **Force logout** - Ability to revoke tokens remotely

---

## Endpoints Used (Current)

All endpoints currently accessible without authentication:

### Transaction Management
- `POST /api/sheets` - Submit transaction
- `GET /api/inbox` - Fetch transaction history
- `DELETE /api/inbox/:rowNumber` - Delete transaction
- `GET /api/sheets` - Get dropdown options (properties, categories, etc.)

### Financial Reports
- `GET /api/pnl` - P&L summary
- `GET /api/pnl/overhead-expenses?period=month|year` - Overhead breakdown
- `GET /api/pnl/property-person?period=month|year` - Property expenses

### Balance Management
- `GET /api/balance/get` - Fetch all balances
- `POST /api/balance/save` - Update balance
- `POST /api/balance/ocr` - OCR balance from image

### OCR & AI
- `POST /api/ocr` - Extract text from receipt image
- `POST /api/extract` - AI-powered field extraction

---

## Migration Path (v1.0 → v2.0)

### Phase 1: Add Authentication (Optional Login)
1. Add login screen (optional, can skip)
2. If no credentials, use shared secret
3. If logged in, use individual token
4. **No breaking changes** for existing users

### Phase 2: Require Authentication
1. Force all users to create accounts
2. Migrate existing data to user accounts
3. Deprecate shared secret
4. Enable role-based access

### Phase 3: Advanced Features
1. Multi-company support
2. Team collaboration
3. Permission management
4. Audit trails

---

## Testing Authentication (When Implemented)

### Test Cases
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Token refresh when expired
- [ ] Force logout after 3 failed attempts
- [ ] Remember me / Stay logged in
- [ ] Logout clears all tokens
- [ ] App reopens with saved session
- [ ] Network error during login
- [ ] Token revoked on server
- [ ] Concurrent sessions on multiple devices

---

## Conclusion

**Current Status (v1.0):**
- ✅ No authentication required
- ✅ Direct API access with shared secret
- ✅ Suitable for internal/single-user application
- ⚠️ Not suitable for multi-user or public release

**Recommendation for App Store:**
- **For v1.0:** Acceptable if app is internal-only or invitation-only
- **For public release:** Implement authentication (recommended: Magic Link or OAuth)

**Next Steps:**
- Confirm if v1.0 will be public or internal-only
- If public → Implement authentication before App Store submission
- If internal → Current setup is production-ready

---

**Related Documentation:**
- `PHASE1-CODEBASE-REPORT.md` - Overall readiness assessment
- `BUILD-PROCESS.md` - How to create production builds (to be created)
