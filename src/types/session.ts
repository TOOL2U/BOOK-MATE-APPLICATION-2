/**
 * Session & Authentication Types
 * Based on ACTUAL Multi-Tenant API Response (November 14, 2025)
 */

export interface User {
  id: string;  // Actual API uses 'id' not 'uid'
  firebaseUid?: string;
  email: string;
  emailVerified?: boolean;
  name: string | null;
  displayName?: string | null;  // Computed from name
  avatarUrl?: string | null;
  phone?: string | null;
  provider?: string;
  status?: string;
  role?: string;
}

export interface Account {
  accountId: string;
  companyName: string;
  userEmail: string;
  sheetId: string;
  scriptUrl: string;
  scriptSecret: string;
}

export interface Session {
  token: string;  // We'll store accessToken here
  user: User;
  account?: Account;  // May not exist in response
}

export interface LoginResponse {
  success: boolean;
  error?: string;
  user?: User;
  tokens?: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
  };
  token?: string;  // Keep for backward compatibility
  account?: Account;
}

export interface SignupResponse {
  success: boolean;  // Webapp API uses 'success', not 'ok'
  error?: string;
  user?: User;
  token?: string;
  account?: Account;
}
