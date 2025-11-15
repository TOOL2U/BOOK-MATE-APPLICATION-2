/**
 * Authentication Service
 * Handles login, logout, and session management for multi-tenant system
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LoginResponse, SignupResponse, Session, User, Account } from '../types/session';

const API_BASE = 'https://accounting.siamoon.com';

// Storage keys
const STORAGE_KEYS = {
  TOKEN: '@bookmate:token',
  USER: '@bookmate:user',
  ACCOUNT: '@bookmate:account',
};

/**
 * Login user with email and password
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data: LoginResponse = await response.json();
    
    // DEBUG: Log the actual response
    console.log('🔍 Login response:', JSON.stringify(data, null, 2));

    // Extract token from actual API response format
    const token = data.tokens?.accessToken || data.token;
    
    if (data.success && token && data.user) {
      // Add displayName if not present
      const user = {
        ...data.user,
        displayName: data.user.displayName || data.user.name || data.user.email,
      };
      
      // Create a default account if not provided
      const account = data.account || {
        accountId: data.user.id,
        companyName: data.user.name || 'My Account',
        userEmail: data.user.email,
        sheetId: '',
        scriptUrl: '',
        scriptSecret: '',
      };
      
      // Store session data
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.TOKEN, token],
        [STORAGE_KEYS.USER, JSON.stringify(user)],
        [STORAGE_KEYS.ACCOUNT, JSON.stringify(account)],
      ]);
      
      // DEBUG: Verify token was saved
      const savedToken = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      console.log('🔑 Token saved:', savedToken ? `${savedToken.substring(0, 20)}...` : '❌ FAILED TO SAVE');
      
      // Return in expected format
      return {
        success: true,
        token,
        user,
        account,
      };
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error. Please try again.',
    };
  }
}

/**
 * Sign up new user
 */
export async function signup(
  email: string,
  password: string,
  name: string
): Promise<SignupResponse> {
  try {
    const response = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    const data: SignupResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Signup error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error. Please try again.',
    };
  }
}

/**
 * Logout user and clear session
 */
export async function logout(): Promise<void> {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

    if (token) {
      // Call logout endpoint
      await fetch(`${API_BASE}/api/auth/logout-session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear all storage including dropdown options cache
    const allKeys = await AsyncStorage.getAllKeys();
    const bookMateKeys = allKeys.filter(key => key.startsWith('@bookmate:'));
    await AsyncStorage.multiRemove(bookMateKeys);
    console.log('🧹 Cleared all cached data on logout');
  }
}

/**
 * Get current session
 */
export async function getSession(): Promise<Session | null> {
  try {
    const [token, userJson, accountJson] = await AsyncStorage.multiGet([
      STORAGE_KEYS.TOKEN,
      STORAGE_KEYS.USER,
      STORAGE_KEYS.ACCOUNT,
    ]);

    if (!token[1] || !userJson[1] || !accountJson[1]) {
      return null;
    }

    return {
      token: token[1],
      user: JSON.parse(userJson[1]) as User,
      account: JSON.parse(accountJson[1]) as Account,
    };
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
}

/**
 * Get auth token
 */
export async function getToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error('Get token error:', error);
    return null;
  }
}

/**
 * Get current user
 */
export async function getUser(): Promise<User | null> {
  try {
    const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    if (!userJson) return null;
    return JSON.parse(userJson) as User;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

/**
 * Get current account
 */
export async function getAccount(): Promise<Account | null> {
  try {
    const accountJson = await AsyncStorage.getItem(STORAGE_KEYS.ACCOUNT);
    if (!accountJson) return null;
    return JSON.parse(accountJson) as Account;
  } catch (error) {
    console.error('Get account error:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getToken();
  return !!token;
}

/**
 * Clear session (for error handling)
 */
export async function clearSession(): Promise<void> {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.TOKEN,
    STORAGE_KEYS.USER,
    STORAGE_KEYS.ACCOUNT,
  ]);
}
