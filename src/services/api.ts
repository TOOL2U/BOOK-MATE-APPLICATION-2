import { getJson, postJson } from "./http";
import {
  BalanceResponse, BalanceRow, LedgerResponse, MonthKey, OptionsResponse,
  PnLResponse, PostSheetsRequest, PostSheetsResponse, TransactionsResponse
} from "../types/api";

const validMonth = (m?: string | null): MonthKey => {
  if (!m || typeof m !== 'string') return "ALL";
  const upperMonth = m.toUpperCase();
  return (["ALL","JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"] as const)
    .includes(upperMonth as MonthKey)
    ? (upperMonth as MonthKey)
    : "ALL";
};

export const apiService = {
  getOptions: () => getJson<OptionsResponse>("/api/options"),

  getBalance: (month?: string) =>
    getJson<BalanceResponse>(`/api/balance?month=${validMonth(month)}`),

  getPnL: (month?: string) =>
    getJson<PnLResponse>(`/api/pnl?month=${validMonth(month)}`),

  getTransactions: (month?: string) =>
    getJson<TransactionsResponse>(`/api/transactions${month ? `?month=${validMonth(month)}` : ""}`),

  getLedger: (month?: string) =>
    getJson<LedgerResponse>(`/api/ledger?month=${validMonth(month)}`),

  postSheets: (payload: PostSheetsRequest) =>
    postJson<PostSheetsResponse>("/api/sheets", payload),

  getHealth: () => {
    // Health check endpoint requires admin auth, fall back to options check
    return apiService.getOptions()
      .then(() => ({ ok: true }))
      .catch(() => ({ ok: false }));
  },

  // LEGACY WRAPPER METHODS - These wrap new API to match old interface for compatibility
  
  async ocr(image: string, fileType: string): Promise<{ok: boolean; text?: string; error?: string}> {
    try {
      // Note: OCR endpoint not yet unified - using legacy for now
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL || 'https://accounting.siamoon.com'}/api/extract/ocr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, fileType }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'OCR failed' };
    }
  },

  async extract(text: string, comment?: string): Promise<{ok: boolean; transaction?: any; error?: string}> {
    try {
      // Note: Extract endpoint not yet unified - using legacy for now
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL || 'https://accounting.siamoon.com'}/api/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, comment }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Extract failed' };
    }
  },

  async submitTransaction(transaction: any): Promise<{ok: boolean; message?: string}> {
    try {
      const result = await this.postSheets(transaction);
      return { ok: result.ok, message: result.error || 'Success' };
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : 'Submit failed' };
    }
  },

  async getInbox(): Promise<{ok: boolean; data?: any[]; error?: string}> {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL || 'https://accounting.siamoon.com'}/api/inbox`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.ok && result.data) {
        // Sort transactions by rowNumber descending (newest first)
        const sortedData = result.data.sort((a: any, b: any) => b.rowNumber - a.rowNumber);
        return { ok: true, data: sortedData };
      }
      
      return { ok: false, error: 'Invalid response format' };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Inbox fetch failed' };
    }
  },

  async deleteReceipt(rowNumber: number): Promise<{ok: boolean; message?: string}> {
    try {
      // Note: Delete endpoint not yet unified - using legacy for now
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL || 'https://accounting.siamoon.com'}/api/inbox`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rowNumber }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : 'Delete failed' };
    }
  },

  async getPL(): Promise<{ok: boolean; data?: any; error?: string}> {
    try {
      const result = await apiService.getPnL('ALL'); // Use 'ALL' as default month
      return { ok: true, data: result };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'P&L fetch failed' };
    }
  },

  async getOverheadExpenses(period: 'month' | 'year'): Promise<{ok: boolean; data?: any; error?: string}> {
    try {
      // Note: Overhead expenses likely contained in P&L response
      const result = await apiService.getPnL('ALL'); // Use 'ALL' as default month
      return { ok: true, data: result };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Overhead expenses fetch failed' };
    }
  },

  async getPropertyPersonExpenses(period: 'month' | 'year'): Promise<{ok: boolean; data?: any; error?: string}> {
    try {
      // Note: Property/person expenses likely contained in P&L response
      const result = await apiService.getPnL('ALL'); // Use 'ALL' as default month
      return { ok: true, data: result };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Property/person expenses fetch failed' };
    }
  },

  async getBalances(): Promise<{ok: boolean; balances: Array<{bankName: string; balance: number; lastUpdated: string}>}> {
    try {
      const result = await this.getBalance();
      // Transform unified response to legacy format
      const balances = result.items?.map((row: BalanceRow) => ({
        bankName: row.accountName || 'Unknown',
        balance: row.currentBalance || 0,
        lastUpdated: row.lastTxnAt || new Date().toISOString(),
      })) || [];
      return { ok: true, balances };
    } catch (error) {
      return { ok: false, balances: [] };
    }
  },

  async saveBalance(data: any): Promise<{ok: boolean; message?: string}> {
    try {
      // Note: Save balance endpoint not yet unified - using legacy for now
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL || 'https://accounting.siamoon.com'}/api/balance/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : 'Save balance failed' };
    }
  },

  async getDropdownOptions(): Promise<{ok: boolean; data?: {properties: string[]; typeOfOperations: string[]; typeOfPayments: string[]}; error?: string}> {
    try {
      const result = await this.getOptions();
      return { 
        ok: true, 
        data: {
          properties: result.data.properties || [],
          typeOfOperations: result.data.typeOfOperations || [],
          typeOfPayments: result.data.typeOfPayment || [],
        }
      };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Dropdown options fetch failed' };
    }
  },

  async healthCheck(): Promise<{status: string}> {
    try {
      const result = await this.getHealth();
      return { status: result.ok ? 'healthy' : 'unhealthy' };
    } catch (error) {
      return { status: 'unhealthy' };
    }
  },
};

