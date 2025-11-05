// Transaction Schema (10 Fields)
export interface Transaction {
  day: string;           // "1" to "31"
  month: string;         // "1" to "12"
  year: string;          // "2025"
  property: string;      // Must match dropdown options
  typeOfOperation: string; // Must match dropdown options
  typeOfPayment: string; // Must match dropdown options
  detail: string;        // Free text description
  ref: string;           // Reference number (optional)
  debit: number;         // Debit amount (0 if credit)
  credit: number;        // Credit amount (0 if debit)
}

// Transaction with row number (from inbox)
export interface TransactionWithRow extends Transaction {
  rowNumber: number;
}

// OCR Response
export interface OCRResponse {
  success: boolean;
  text?: string;
  id?: string;
  error?: string;
}

// AI Extract Response
export interface ExtractResponse {
  success: boolean;
  data: Transaction;
  confidence?: {
    property?: number;
    typeOfOperation?: number;
    typeOfPayment?: number;
  };
  error?: string;
}

// Sheets Submit Response
export interface SheetsResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Inbox Response
export interface InboxResponse {
  ok: boolean;
  data: TransactionWithRow[];
  count?: number;
  cached?: boolean;
  cacheAge?: number;
  error?: string;
}

// P&L Data
export interface PLData {
  revenue: number;
  overheads: number;
  propertyPersonExpense: number;
  gop: number;
  ebitdaMargin: number;
}

export interface PLResponse {
  ok: boolean;
  data: {
    month: PLData;
    year: PLData;
    updatedAt: string;
  };
  cached?: boolean;
  warnings?: string[];
  computedFallbacks?: string[];
  error?: string;
}

// Overhead Expenses Data
export interface OverheadExpense {
  name: string;
  expense: number;
  percentage: number;
}

export interface OverheadExpensesResponse {
  ok: boolean;
  data: OverheadExpense[];
  period: 'month' | 'year';
  totalExpense: number;
  timestamp: string;
  error?: string;
}

// Property/Person Expenses Data
export interface PropertyPersonExpense {
  name: string;
  expense: number;
  percentage: number;
}

export interface PropertyPersonExpensesResponse {
  ok: boolean;
  data: PropertyPersonExpense[];
  period: 'month' | 'year';
  totalExpense: number;
  timestamp: string;
  error?: string;
}

// Balance Data
export interface Balance {
  bankName: string;
  balance: number;
  lastUpdated: string;
}

export interface BalanceResponse {
  ok: boolean;
  balances: Balance[];
  error?: string;
}

export interface BalanceSaveRequest {
  bankName: string;
  balance: number;
  note?: string;
}

export interface BalanceSaveResponse {
  ok: boolean;
  message?: string;
  savedData?: {
    bankName: string;
    balance: number;
  };
  error?: string;
}

// Dropdown Options - CORRECTED VALUES (October 30, 2025)
// ⚠️ CRITICAL: These values must match EXACTLY (case-sensitive, preserve spacing)
// Source: MOBILE_API_INTEGRATION_GUIDE.md (corrected version)

export const PROPERTIES = [
  'Sia Moon - Land - General',
  'Alesia House',
  'Lanna House',
  'Parents House',
  'Shaun Ducker - Personal',
  'Maria Ren - Personal',
  'Family',
] as const;

export const TYPE_OF_OPERATIONS = [
  // REVENUES (4 options)
  'Revenue - Commision',  // ⚠️ Note: "Commision" is misspelled - use exact spelling
  'Revenue - Sales',
  'Revenue - Services',
  'Revenue - Rental Income',

  // UTILITIES (3 options)
  'EXP - Utilities - Gas',
  'EXP - Utilities - Water',
  'EXP - Utilities  - Electricity',  // ⚠️ Note: TWO spaces before "Electricity"

  // OVERHEAD EXPENSES (1 option)
  'OVERHEAD EXPENSES',

  // ADMINISTRATION & GENERAL (5 options)
  'EXP - Administration & General - License & Certificates',
  'EXP - Administration & General - Legal',
  'EXP - Administration & General - Professional fees',
  'EXP - Administration & General - Office supplies',
  'EXP - Administration & General  - Subscription, Software & Membership',  // ⚠️ Note: TWO spaces

  // CONSTRUCTION (4 options)
  'EXP - Construction - Structure',
  'EXP - Construction - Overheads/General/Unclassified',
  'EXP - Construction - Electric Supplies',
  'EXP - Construction - Wall',

  // HR (1 option)
  'EXP - HR - Employees Salaries',

  // APPLIANCES & HARDWARE (2 options)
  'EXP - Appliances & Electronics',
  'EXP - Windows, Doors, Locks & Hardware',

  // REPAIRS & MAINTENANCE (6 options)
  'EXP - Repairs & Maintenance  - Furniture & Decorative Items',  // ⚠️ Note: TWO spaces
  'EXP - Repairs & Maintenance  - Waste removal',  // ⚠️ Note: TWO spaces
  'EXP - Repairs & Maintenance - Tools & Equipment',
  'EXP - Repairs & Maintenance - Painting & Decoration',
  'EXP - Repairs & Maintenance - Electrical & Mechanical',
  'EXP - Repairs & Maintenance - Landscaping',

  // SALES & MARKETING (1 option)
  'EXP - Sales & Marketing -  Professional Marketing Services',  // ⚠️ Note: TWO spaces after dash

  // OTHER EXPENSES (1 option)
  'EXP - Other Expenses',

  // PERSONAL EXPENSES (1 option)
  'EXP - Personal - Massage',

  // HOUSEHOLD EXPENSES (4 options)
  'EXP - Household - Alcohol',
  'EXP - Household - Groceries',
  'EXP - Household - Nappies',
  'EXP - Household - Toiletries',
] as const;

export const TYPE_OF_PAYMENTS = [
  'Bank Transfer - Bangkok Bank - Shaun Ducker',
  'Bank Transfer - Bangkok Bank - Maria Ren',
  'Bank transfer - Krung Thai Bank - Family Account',  // ⚠️ Note: lowercase "transfer"
  'Cash',
] as const;

export type Property = typeof PROPERTIES[number];
export type TypeOfOperation = typeof TYPE_OF_OPERATIONS[number];
export type TypeOfPayment = typeof TYPE_OF_PAYMENTS[number];

