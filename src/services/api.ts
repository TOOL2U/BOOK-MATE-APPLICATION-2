import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import type {
  OCRResponse,
  ExtractResponse,
  SheetsResponse,
  InboxResponse,
  PLResponse,
  BalanceResponse,
  BalanceSaveRequest,
  BalanceSaveResponse,
  Transaction,
} from '../types';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Retry logic with exponential backoff
async function retryRequest<T>(
  requestFn: () => Promise<T>,
  retries = API_CONFIG.RETRY_ATTEMPTS
): Promise<T> {
  try {
    return await requestFn();
  } catch (error) {
    if (retries > 0 && axios.isAxiosError(error)) {
      const status = error.response?.status;
      // Retry on 429 (rate limit) or 500 (server error)
      if (status === 429 || status === 500) {
        const delay = API_CONFIG.RETRY_DELAY * (API_CONFIG.RETRY_ATTEMPTS - retries + 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        return retryRequest(requestFn, retries - 1);
      }
    }
    throw error;
  }
}

// Error handler
function handleError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string; message?: string }>;
    const message = axiosError.response?.data?.error || 
                   axiosError.response?.data?.message || 
                   axiosError.message || 
                   'An unknown error occurred';
    throw new Error(message);
  }
  throw error;
}

// API Service
export const apiService = {
  // OCR - Extract text from receipt image
  async ocr(image: string, fileType: string): Promise<OCRResponse> {
    try {
      const response = await retryRequest(() =>
        apiClient.post<OCRResponse>(API_ENDPOINTS.OCR, {
          image,
          fileType,
        })
      );
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // AI Extract - Extract fields from text
  async extract(text: string, comment?: string): Promise<ExtractResponse> {
    try {
      const response = await apiClient.post<ExtractResponse>(API_ENDPOINTS.EXTRACT, {
        text,
        comment,
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Submit transaction to Google Sheets
  async submitTransaction(transaction: Transaction): Promise<SheetsResponse> {
    try {
      const response = await apiClient.post<SheetsResponse>(API_ENDPOINTS.SHEETS, transaction);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Fetch all receipts from inbox
  async getInbox(): Promise<InboxResponse> {
    try {
      const response = await apiClient.get<InboxResponse>(API_ENDPOINTS.INBOX);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Delete a receipt by row number
  async deleteReceipt(rowNumber: number): Promise<{ ok: boolean; message?: string }> {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.INBOX, {
        data: { rowNumber },
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Fetch P&L KPI data
  async getPL(): Promise<PLResponse> {
    try {
      const response = await apiClient.get<PLResponse>(API_ENDPOINTS.PNL);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Fetch all balances
  async getBalances(): Promise<BalanceResponse> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.BALANCE_GET);
      
      // Transform the API response to match our expected format
      // API returns: { ok, allBalances: { "bankName": { timestamp, bankName, balance, note } } }
      // We need: { ok, balances: [{ bankName, balance, lastUpdated }] }
      const apiData = response.data;
      
      if (apiData.ok && apiData.allBalances) {
        const balancesArray = Object.values(apiData.allBalances)
          .filter((item: any) => 
            // Filter out header row and ensure balance is a number
            typeof item.balance === 'number' && 
            item.balance !== 'Balance'
          )
          .map((item: any) => ({
            bankName: item.bankName,
            balance: item.balance,
            lastUpdated: item.timestamp,
          }));
        
        return {
          ok: true,
          balances: balancesArray,
        };
      }
      
      return { ok: false, balances: [] };
    } catch (error) {
      handleError(error);
    }
  },

  // Save balance entry
  async saveBalance(data: BalanceSaveRequest): Promise<BalanceSaveResponse> {
    try {
      const response = await apiClient.post<BalanceSaveResponse>(
        API_ENDPOINTS.BALANCE_SAVE,
        data
      );
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SHEETS);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

