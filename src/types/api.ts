export type MonthKey =
  | "ALL"|"JAN"|"FEB"|"MAR"|"APR"|"MAY"|"JUN"
  | "JUL"|"AUG"|"SEP"|"OCT"|"NOV"|"DEC";

export interface BalanceRow {
  accountName: string;
  openingBalance: number;
  netChange: number;
  currentBalance: number;
  lastTxnAt: string | null;
  inflow: number;
  outflow: number;
  note?: string;
}

export interface BalanceResponse {
  ok: boolean;
  source: "BalanceSummary";
  month: MonthKey;
  items: BalanceRow[];  // API actually uses 'items', not 'data.rows'
  totals: { 
    netChange: number; 
    currentBalance: number; 
    inflow: number; 
    outflow: number; 
  };
  durationMs: number;
}

// Legacy P&L response structure (what API actually returns)
export interface PLLegacyData {
  revenue: number;
  overheads: number;
  propertyPersonExpense: number;
  gop: number;
  ebitdaMargin: number;
}

export interface PnLResponse {
  ok: boolean;
  data: {
    month: PLLegacyData;
    year: PLLegacyData;
    updatedAt: string;
  };
  cached?: boolean;
  cacheAge?: number;
  warnings?: string[];
  computedFallbacks?: string[];
  matchInfo?: Record<string, any>;
}

export interface OptionsResponse {
  data: {
    // Rich + string versions (per unified API)
    typeOfPayments: { name: string; monthly: number[]; yearTotal: number }[];
    typeOfPayment: string[];
    typeOfOperations: string[];
    properties: string[];
  };
}

export interface TransactionRow {
  timestamp: string;  // ISO
  fromAccount?: string|null;
  toAccount?: string|null;
  transactionType: "Revenue"|"Expense"|"Transfer";
  amount: number;
  currency: string;
  note?: string;
  referenceID?: string;
  user?: string;
}

export interface TransactionsResponse {
  data: TransactionRow[];
}

export interface LedgerRow {
  timestamp: string;       // ISO or serial converted
  accountName: string;
  delta: number;           // +inflow / -outflow
  month: MonthKey;
}

export interface LedgerResponse {
  data: LedgerRow[];
}

export interface PostSheetsRequest {
  kind: "transaction";
  payload: TransactionRow;
}

export interface PostSheetsResponse {
  ok: boolean;
  error?: string;
}