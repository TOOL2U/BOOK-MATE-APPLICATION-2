import { getJson, postJson } from "./http";
import {
  BalanceResponse, BalanceRow, LedgerResponse, MonthKey, OptionsResponse,
  PnLResponse, PostSheetsRequest, PostSheetsResponse, TransactionsResponse
} from "../types/api";
import { getMonthNumber } from "../utils/dateUtils";

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

  getBalance: (month?: string, source?: 'app' | 'sheets') => {
    const monthParam = validMonth(month);
    const sourceParam = source ? `&source=${source}` : '';
    return getJson<BalanceResponse>(`/api/balance?month=${monthParam}${sourceParam}`);
  },

  getPnL: (month?: string) =>
    getJson<PnLResponse>(`/api/pnl?month=${validMonth(month)}`),

  getTransactions: (month?: string) =>
    getJson<TransactionsResponse>(`/api/transactions${month ? `?month=${validMonth(month)}` : ""}`),

  getLedger: (month?: string) =>
    getJson<LedgerResponse>(`/api/ledger?month=${validMonth(month)}`),

  postSheets: (payload: PostSheetsRequest) =>
    postJson<PostSheetsResponse>("/api/sheets", payload),

  // Balance Audit specific endpoints
  createTestTransaction: (amount: number, fromAccount: string, description: string) =>
    postJson("/api/test-transaction", {
      amount,
      fromAccount,
      description,
      timestamp: new Date().toISOString()
    }),

  getBalanceComparison: (month?: string) => {
    // Returns both app and sheet data for comparison
    return Promise.all([
      apiService.getBalance(month, 'app'),
      apiService.getBalance(month, 'sheets').catch(() => ({ items: [] })) // Fallback if sheets API not available
    ]).then(([app, sheets]) => ({
      app: app.items || [],
      sheets: sheets.items || []
    }));
  },

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
      // Submit transaction with month as received (e.g., "NOV")
      const result = await this.postSheets(transaction);
      
      // Handle the actual API response format
      const isSuccess = result.ok || (result as any).success;
      const responseMessage = result.error || (result as any).message || (isSuccess ? 'Success' : 'Submit failed');
      
      return { 
        ok: isSuccess, 
        message: responseMessage
      };
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
      // Get both P&L data (for accurate totals) and options data (for breakdown)
      const [pnlResult, optionsResult] = await Promise.all([
        this.getPnL('ALL'), // Get P&L data for accurate totals
        this.getOptions()   // Get options data for expense breakdown
      ]);
      
      if (!optionsResult || !optionsResult.data) {
        console.warn('Options API returned no data');
        return { ok: false, error: 'No options data available' };
      }

      if (!optionsResult.data.typeOfOperations || !Array.isArray(optionsResult.data.typeOfOperations)) {
        console.warn('typeOfOperations not found or not an array in options data');
        return { ok: false, error: 'No expense categories available' };
      }

      // Get overhead expenses breakdown from options API
      const overheadCategories = optionsResult.data.typeOfOperations
        .filter((op: any) => op && op.name && (op.name.startsWith('EXP -') || op.name.startsWith('Exp -')))
        .map((op: any) => {
          return {
            category: op.name,
            amount: period === 'month' ? (op.monthly?.[10] || 0) : (op.yearTotal || 0), // November = index 10
            monthly: op.monthly || Array(12).fill(0)
          };
        })
        .filter((expense: any) => {
          if (period === 'year') {
            return expense.amount > 0;
          } else {
            return expense.monthly && expense.monthly.some((amount: number) => amount > 0);
          }
        });

      // If we have P&L data, use it to get the accurate total and scale breakdown accordingly
      if (pnlResult && pnlResult.data) {
        const pnlTotal = period === 'month' ? pnlResult.data.month?.overheads : pnlResult.data.year?.overheads;
        const breakdownTotal = overheadCategories.reduce((sum: number, item: any) => sum + item.amount, 0);
        
        // Scale individual items proportionally to match P&L total
        if (pnlTotal && breakdownTotal > 0 && Math.abs(pnlTotal - breakdownTotal) > 1) {
          const scaleFactor = pnlTotal / breakdownTotal;
          console.log(`Scaling overhead breakdown by ${scaleFactor.toFixed(4)} to match P&L total: ${pnlTotal}`);
          
          overheadCategories.forEach((expense: any) => {
            const originalAmount = expense.amount;
            expense.amount = Math.round(expense.amount * scaleFactor);
            
            // Scale monthly array proportionally for all months
            if (expense.monthly && Array.isArray(expense.monthly)) {
              expense.monthly = expense.monthly.map((monthAmount: number) => 
                Math.round(monthAmount * scaleFactor)
              );
            }
          });
          
          // Verify the scaling worked correctly
          const scaledTotal = overheadCategories.reduce((sum: number, item: any) => sum + item.amount, 0);
          if (Math.abs(scaledTotal - pnlTotal) > 1) {
            console.warn(`Scaling verification failed: expected ${pnlTotal}, got ${scaledTotal}`);
          }
        } else if (pnlTotal && breakdownTotal === 0) {
          console.warn('No overhead expense data available for scaling');
        } else if (!pnlTotal) {
          console.warn('No P&L total available for overhead scaling');
        }
      }

      return { ok: true, data: overheadCategories };
    } catch (error) {
      console.error('Overhead expenses fetch error:', error);
      return { ok: false, error: error instanceof Error ? error.message : 'Overhead expenses fetch failed' };
    }
  },

  async getPropertyPersonExpenses(period: 'month' | 'year'): Promise<{ok: boolean; data?: any; error?: string}> {
    try {
      // Get options data for property breakdown
      const optionsResult = await this.getOptions();
      
      if (!optionsResult || !optionsResult.data) {
        console.warn('Options API returned no data');
        return { ok: false, error: 'No options data available' };
      }

      // Define PropertyPersonExpense interface
      interface PropertyPersonExpense {
        property: string;
        person: string;
        amount: number;
        monthly: number[];
      }

      // Get P&L data for all months to get proper totals
      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const monthlyPnLTotals = Array(12).fill(0);
      
      // Fetch P&L data for each month (no hardcoding)
      for (let i = 0; i < 12; i++) {
        try {
          const monthPnL = await this.getPnL(monthNames[i]);
          if (monthPnL && monthPnL.data && monthPnL.data.month) {
            monthlyPnLTotals[i] = monthPnL.data.month.propertyPersonExpense || 0;
          }
        } catch (error) {
          console.warn(`Failed to fetch P&L for ${monthNames[i]}:`, error);
          monthlyPnLTotals[i] = 0;
        }
      }

      // Collect specific property expenses from propertiesRich (excluding Family)
      const specificPropertyExpenses: PropertyPersonExpense[] = [];
      const monthlyTotalsSpecificProperties = Array(12).fill(0);

      if (optionsResult.data.propertiesRich && Array.isArray(optionsResult.data.propertiesRich)) {
        optionsResult.data.propertiesRich
          .filter((prop: any) => prop && prop.name && prop.name !== 'Family')
          .forEach((prop: any) => {
            const monthlyArray = prop.monthly || Array(12).fill(0);
            const amount = period === 'month' ? (monthlyArray[10] || 0) : (prop.yearTotal || 0); // Current display month
            
            specificPropertyExpenses.push({
              property: prop.name,
              person: 'Property Owner',
              amount: amount,
              monthly: monthlyArray
            });

            // Track monthly totals for Family calculation
            for (let i = 0; i < 12; i++) {
              monthlyTotalsSpecificProperties[i] += monthlyArray[i] || 0;
            }
          });
      }

      // Calculate Family monthly amounts as remainder for each month (NO HARDCODING)
      // Family = P&L Total (per month) - Sum of all specific properties (per month)
      const familyMonthlyArray = Array(12).fill(0);
      
      for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
        // For each month: Family = Monthly P&L Total - Sum(Specific Properties for that month)
        familyMonthlyArray[monthIndex] = Math.max(0, 
          monthlyPnLTotals[monthIndex] - monthlyTotalsSpecificProperties[monthIndex]
        );
      }

      const familyCurrentAmount = period === 'month' ? 
        familyMonthlyArray[10] : // November for monthly view
        familyMonthlyArray.reduce((sum, amt) => sum + amt, 0); // Year total for yearly view

      // Add Family property with calculated remainder for each month
      specificPropertyExpenses.push({
        property: 'Family',
        person: 'Property Owner',
        amount: familyCurrentAmount,
        monthly: familyMonthlyArray
      });

      // Sort to match P&L page display order (highest amounts first)
      specificPropertyExpenses.sort((a, b) => b.amount - a.amount);

      return { ok: true, data: specificPropertyExpenses };
    } catch (error) {
      console.error('Property/person expenses fetch error:', error);
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
          typeOfOperations: result.data.typeOfOperation || [],
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

