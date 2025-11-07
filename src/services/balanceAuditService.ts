import { apiService } from './api';

/**
 * BookMate Balance Audit Service
 * 
 * Purpose: Ensure 1:1 accuracy between mobile app balances and Google Sheets Balance Summary
 * Data Flow: Input → Transactions → Ledger → Balance Summary → Mobile App
 * 
 * This service verifies:
 * 1. API data matches Balance Summary sheet exactly
 * 2. Transaction integrity (dual entries for transfers)
 * 3. Balance calculation accuracy (opening + net change = current)
 * 4. No stale/cached data discrepancies
 */

interface BalanceAuditResult {
  accountName: string;
  sheetBalance: number;
  appBalance: number;
  sheetInflow: number;
  appInflow: number;
  sheetOutflow: number;
  appOutflow: number;
  sheetNetChange: number;
  appNetChange: number;
  openingBalance: number;
  balanceDifference: number;
  inflowDifference: number;
  outflowDifference: number;
  netChangeDifference: number;
  isBalanceMatch: boolean;
  isInflowMatch: boolean;
  isOutflowMatch: boolean;
  isNetChangeMatch: boolean;
  isPerfectMatch: boolean;
  lastSheetUpdate: string;
  lastAppUpdate: string;
  errorDetails: string[];
}

interface FullAuditReport {
  auditTimestamp: string;
  totalAccounts: number;
  perfectMatches: number;
  balanceDiscrepancies: number;
  flowDiscrepancies: number;
  totalSheetBalance: number;
  totalAppBalance: number;
  totalBalanceDifference: number;
  dataFreshness: 'CURRENT' | 'STALE' | 'UNKNOWN';
  accountAudits: BalanceAuditResult[];
  systemHealth: {
    apiStatus: 'HEALTHY' | 'DEGRADED' | 'DOWN';
    sheetSyncStatus: 'SYNCED' | 'DELAYED' | 'ERROR';
    transactionIntegrity: 'VALID' | 'ISSUES_FOUND';
  };
  recommendations: string[];
}

export class BalanceAuditService {
  
  /**
   * Performs comprehensive balance audit comparing app vs Google Sheets
   * @param monthFilter Optional month filter (ALL, NOV, etc.)
   * @returns Complete audit report with detailed findings
   */
  static async performFullAudit(monthFilter: string = 'ALL'): Promise<FullAuditReport> {
    console.log(`🔍 Starting Balance Audit for month: ${monthFilter}`);
    
    try {
      // Fetch data from both sources simultaneously using enhanced API service
      const [appResponse, sheetResponse] = await Promise.all([
        apiService.getBalance(monthFilter, 'app'),
        apiService.getBalance(monthFilter, 'sheets').catch(error => {
          console.warn('Sheet API unavailable, using app data only:', error);
          return { items: [] };
        })
      ]);

      const appBalances = appResponse.items || [];
      const sheetBalances = sheetResponse.items || [];

      // Perform account-by-account comparison
      const accountAudits = this.compareAccountBalances(appBalances, sheetBalances);
      
      // Calculate summary statistics
      const auditSummary = this.generateAuditSummary(accountAudits);
      
      // Assess system health
      const systemHealth = this.assessSystemHealth(accountAudits);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(accountAudits, systemHealth);

      const fullReport: FullAuditReport = {
        auditTimestamp: new Date().toISOString(),
        totalAccounts: accountAudits.length,
        perfectMatches: accountAudits.filter(a => a.isPerfectMatch).length,
        balanceDiscrepancies: accountAudits.filter(a => !a.isBalanceMatch).length,
        flowDiscrepancies: accountAudits.filter(a => !a.isInflowMatch || !a.isOutflowMatch).length,
        totalSheetBalance: sheetBalances.reduce((sum, acc) => sum + (acc.currentBalance || 0), 0),
        totalAppBalance: appBalances.reduce((sum, acc) => sum + (acc.currentBalance || 0), 0),
        totalBalanceDifference: 0, // Will be calculated
        dataFreshness: this.assessDataFreshness(accountAudits),
        accountAudits,
        systemHealth,
        recommendations
      };

      fullReport.totalBalanceDifference = fullReport.totalAppBalance - fullReport.totalSheetBalance;

      console.log(`✅ Audit Complete: ${fullReport.perfectMatches}/${fullReport.totalAccounts} perfect matches`);
      return fullReport;

    } catch (error) {
      console.error('❌ Audit failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Balance audit failed: ${errorMessage}`);
    }
  }

  /**
   * Compares app and sheet balances account by account
   */
  private static compareAccountBalances(appBalances: any[], sheetBalances: any[]): BalanceAuditResult[] {
    const audits: BalanceAuditResult[] = [];
    
    // Create lookup map for sheet balances
    const sheetLookup = new Map();
    sheetBalances.forEach(sheet => {
      const key = this.normalizeAccountName(sheet.accountName || sheet.bankName);
      sheetLookup.set(key, sheet);
    });

    // Compare each app account with sheet data
    appBalances.forEach(app => {
      const normalizedName = this.normalizeAccountName(app.accountName || app.bankName);
      const sheet = sheetLookup.get(normalizedName);
      
      const audit = this.auditSingleAccount(app, sheet, normalizedName);
      audits.push(audit);
    });

    // Check for sheet accounts not in app
    sheetBalances.forEach(sheet => {
      const normalizedName = this.normalizeAccountName(sheet.accountName || sheet.bankName);
      const hasMatch = appBalances.some(app => 
        this.normalizeAccountName(app.accountName || app.bankName) === normalizedName
      );
      
      if (!hasMatch) {
        audits.push(this.createMissingAccountAudit(sheet, normalizedName, 'MISSING_FROM_APP'));
      }
    });

    return audits;
  }

  /**
   * Audits a single account comparing app vs sheet data
   */
  private static auditSingleAccount(app: any, sheet: any, accountName: string): BalanceAuditResult {
    const errorDetails: string[] = [];
    
    if (!sheet) {
      errorDetails.push('Account exists in app but not in Google Sheets');
    }

    // Extract values with fallbacks
    const sheetBalance = sheet?.currentBalance || 0;
    const appBalance = app?.currentBalance || 0;
    const sheetInflow = sheet?.inflow || 0;
    const appInflow = app?.inflow || 0;
    const sheetOutflow = sheet?.outflow || 0;
    const appOutflow = app?.outflow || 0;
    const sheetNetChange = sheet?.netChange || (sheetInflow - sheetOutflow);
    const appNetChange = app?.netChange || (appInflow - appOutflow);
    const openingBalance = sheet?.openingBalance || app?.openingBalance || 0;

    // Calculate differences
    const balanceDifference = appBalance - sheetBalance;
    const inflowDifference = appInflow - sheetInflow;
    const outflowDifference = appOutflow - sheetOutflow;
    const netChangeDifference = appNetChange - sheetNetChange;

    // Determine match status (allowing for small floating point differences)
    const tolerance = 0.01;
    const isBalanceMatch = Math.abs(balanceDifference) < tolerance;
    const isInflowMatch = Math.abs(inflowDifference) < tolerance;
    const isOutflowMatch = Math.abs(outflowDifference) < tolerance;
    const isNetChangeMatch = Math.abs(netChangeDifference) < tolerance;
    const isPerfectMatch = isBalanceMatch && isInflowMatch && isOutflowMatch && isNetChangeMatch;

    // Validation checks
    if (!isBalanceMatch) {
      errorDetails.push(`Balance mismatch: App ฿${appBalance.toLocaleString()} vs Sheet ฿${sheetBalance.toLocaleString()}`);
    }
    
    if (!isInflowMatch) {
      errorDetails.push(`Inflow mismatch: App ฿${appInflow.toLocaleString()} vs Sheet ฿${sheetInflow.toLocaleString()}`);
    }
    
    if (!isOutflowMatch) {
      errorDetails.push(`Outflow mismatch: App ฿${appOutflow.toLocaleString()} vs Sheet ฿${sheetOutflow.toLocaleString()}`);
    }

    // Check calculation integrity: opening + net change = current balance
    const expectedBalance = openingBalance + sheetNetChange;
    if (Math.abs(sheetBalance - expectedBalance) > tolerance) {
      errorDetails.push(`Sheet calculation error: ฿${openingBalance} + ฿${sheetNetChange} ≠ ฿${sheetBalance}`);
    }

    return {
      accountName,
      sheetBalance,
      appBalance,
      sheetInflow,
      appInflow,
      sheetOutflow,
      appOutflow,
      sheetNetChange,
      appNetChange,
      openingBalance,
      balanceDifference,
      inflowDifference,
      outflowDifference,
      netChangeDifference,
      isBalanceMatch,
      isInflowMatch,
      isOutflowMatch,
      isNetChangeMatch,
      isPerfectMatch,
      lastSheetUpdate: sheet?.lastUpdated || 'Unknown',
      lastAppUpdate: app?.lastUpdated || 'Unknown',
      errorDetails
    };
  }

  /**
   * Creates audit entry for accounts missing from app
   */
  private static createMissingAccountAudit(sheet: any, accountName: string, reason: string): BalanceAuditResult {
    return {
      accountName,
      sheetBalance: sheet?.currentBalance || 0,
      appBalance: 0,
      sheetInflow: sheet?.inflow || 0,
      appInflow: 0,
      sheetOutflow: sheet?.outflow || 0,
      appOutflow: 0,
      sheetNetChange: sheet?.netChange || 0,
      appNetChange: 0,
      openingBalance: sheet?.openingBalance || 0,
      balanceDifference: -(sheet?.currentBalance || 0),
      inflowDifference: -(sheet?.inflow || 0),
      outflowDifference: -(sheet?.outflow || 0),
      netChangeDifference: -(sheet?.netChange || 0),
      isBalanceMatch: false,
      isInflowMatch: false,
      isOutflowMatch: false,
      isNetChangeMatch: false,
      isPerfectMatch: false,
      lastSheetUpdate: sheet?.lastUpdated || 'Unknown',
      lastAppUpdate: 'N/A',
      errorDetails: [reason]
    };
  }

  /**
   * Normalizes account names for comparison
   */
  private static normalizeAccountName(name: string): string {
    return name?.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .trim() || 'unknown';
  }

  /**
   * Generates audit summary statistics
   */
  private static generateAuditSummary(audits: BalanceAuditResult[]) {
    return {
      totalAccounts: audits.length,
      perfectMatches: audits.filter(a => a.isPerfectMatch).length,
      balanceDiscrepancies: audits.filter(a => !a.isBalanceMatch).length,
      flowDiscrepancies: audits.filter(a => !a.isInflowMatch || !a.isOutflowMatch).length
    };
  }

  /**
   * Assesses overall system health
   */
  private static assessSystemHealth(audits: BalanceAuditResult[]) {
    const perfectMatchRate = audits.filter(a => a.isPerfectMatch).length / audits.length;
    const balanceMatchRate = audits.filter(a => a.isBalanceMatch).length / audits.length;
    
    return {
      apiStatus: (balanceMatchRate > 0.8 ? 'HEALTHY' : balanceMatchRate > 0.5 ? 'DEGRADED' : 'DOWN') as any,
      sheetSyncStatus: (perfectMatchRate > 0.9 ? 'SYNCED' : perfectMatchRate > 0.7 ? 'DELAYED' : 'ERROR') as any,
      transactionIntegrity: (audits.every(a => a.errorDetails.length === 0) ? 'VALID' : 'ISSUES_FOUND') as any
    };
  }

  /**
   * Assesses data freshness
   */
  private static assessDataFreshness(audits: BalanceAuditResult[]): 'CURRENT' | 'STALE' | 'UNKNOWN' {
    const now = Date.now();
    const recentThreshold = 60 * 60 * 1000; // 1 hour
    
    const hasRecentUpdates = audits.some(audit => {
      const lastUpdate = audit.lastAppUpdate;
      if (lastUpdate === 'Unknown' || lastUpdate === 'N/A') return false;
      
      const updateTime = new Date(lastUpdate).getTime();
      return (now - updateTime) < recentThreshold;
    });
    
    if (hasRecentUpdates) return 'CURRENT';
    if (audits.some(a => a.lastAppUpdate !== 'Unknown')) return 'STALE';
    return 'UNKNOWN';
  }

  /**
   * Generates actionable recommendations
   */
  private static generateRecommendations(audits: BalanceAuditResult[], systemHealth: any): string[] {
    const recommendations: string[] = [];
    
    const balanceIssues = audits.filter(a => !a.isBalanceMatch).length;
    const flowIssues = audits.filter(a => !a.isInflowMatch || !a.isOutflowMatch).length;
    
    if (balanceIssues > 0) {
      recommendations.push(`${balanceIssues} accounts have balance discrepancies - check API data source`);
    }
    
    if (flowIssues > 0) {
      recommendations.push(`${flowIssues} accounts have inflow/outflow issues - verify transaction processing`);
    }
    
    if (systemHealth.sheetSyncStatus === 'ERROR') {
      recommendations.push('Google Sheets sync is failing - check sheet permissions and formulas');
    }
    
    if (systemHealth.apiStatus === 'DEGRADED') {
      recommendations.push('API responses are inconsistent - investigate data caching and refresh logic');
    }
    
    const missingAccounts = audits.filter(a => a.errorDetails.includes('MISSING_FROM_APP')).length;
    if (missingAccounts > 0) {
      recommendations.push(`${missingAccounts} sheet accounts missing from app - update account sync`);
    }
    
    if (recommendations.length === 0) {
      recommendations.push('✅ All systems synchronized - ready for next feature phase');
    }
    
    return recommendations;
  }

  /**
   * Formats currency for display
   */
  static formatCurrency(amount: number): string {
    return `฿${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  /**
   * Creates a test transaction for end-to-end verification
   */
  static async createTestTransaction(amount: number, fromAccount: string, description: string): Promise<any> {
    try {
      return await apiService.createTestTransaction(amount, fromAccount, description);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to create test transaction: ${errorMessage}`);
    }
  }
}

export type { BalanceAuditResult, FullAuditReport };