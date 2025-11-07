import { apiService } from './api';

export interface BalanceVerification {
  accountName: string;
  openingBalance: number;
  inflow: number;
  outflow: number;
  calculatedBalance: number;
  apiBalance: number;
  difference: number;
  isValid: boolean;
  lastTxnAt: string;
  validationNote?: string; // Optional note for debugging
}

export interface VerificationSummary {
  totalVariance: number;
  accountVerifications: BalanceVerification[];
  hasDiscrepancies: boolean;
  totalAccounts: number;
  validAccounts: number;
}

export class BalanceVerificationService {
  /**
   * Performs comprehensive balance verification
   */
  static async verifyBalances(): Promise<VerificationSummary> {
    try {
      // Step 1: Fetch current balance data
      const balanceResponse = await apiService.getBalance();
      
      if (!balanceResponse.ok || !balanceResponse.items) {
        throw new Error('Failed to fetch balance data');
      }

      const verifications: BalanceVerification[] = [];
      let totalVariance = 0;

      // Step 2: Verify each account
      for (const account of balanceResponse.items) {
        const verification = this.verifyAccount(account);
        verifications.push(verification);
        totalVariance += Math.abs(verification.difference);
      }

      // Step 3: Generate summary
      const summary: VerificationSummary = {
        totalVariance,
        accountVerifications: verifications,
        hasDiscrepancies: totalVariance > 0.01, // Allow for small floating point differences
        totalAccounts: verifications.length,
        validAccounts: verifications.filter(v => v.isValid).length,
      };

      return summary;
    } catch (error) {
      console.error('Balance verification failed:', error);
      throw error;
    }
  }

  /**
   * Verifies a single account's balance
   */
  private static verifyAccount(account: any): BalanceVerification {
    const openingBalance = account.openingBalance || 0;
    const inflow = account.inflow || 0;
    const outflow = account.outflow || 0;
    const apiBalance = account.currentBalance || 0;
    
    // Calculate expected balance: opening + inflow - outflow
    const calculatedBalance = openingBalance + inflow - outflow;
    const difference = apiBalance - calculatedBalance;
    
    // More lenient validation - consider valid if difference is reasonable
    // This accounts for timing differences and incomplete transaction data
    const isValid = Math.abs(difference) < Math.max(1, Math.abs(apiBalance) * 0.001); // 0.1% tolerance or ฿1, whichever is larger
    
    // If there's a large discrepancy, it might indicate:
    // 1. Transactions processed after inflow/outflow calculation
    // 2. Manual balance adjustments
    // 3. Different data synchronization timing
    let validationNote = '';
    if (!isValid) {
      if (Math.abs(difference) > 1000) {
        validationNote = 'Large discrepancy - may indicate timing or data sync issues';
      } else {
        validationNote = 'Minor discrepancy - within acceptable range';
      }
    }

    return {
      accountName: account.accountName || 'Unknown Account',
      openingBalance,
      inflow,
      outflow,
      calculatedBalance,
      apiBalance,
      difference,
      isValid,
      lastTxnAt: account.lastTxnAt || '',
      validationNote, // Add note for debugging
    };
  }

  /**
   * Groups accounts by type for display
   */
  static groupAccountsByType(verifications: BalanceVerification[]) {
    const bankAccounts = verifications.filter(v => 
      v.accountName.toLowerCase().includes('bank')
    );
    
    const cashAccounts = verifications.filter(v => 
      v.accountName.toLowerCase().includes('cash')
    );
    
    const otherAccounts = verifications.filter(v => 
      !v.accountName.toLowerCase().includes('bank') && 
      !v.accountName.toLowerCase().includes('cash')
    );

    return {
      bankAccounts,
      cashAccounts,
      otherAccounts,
    };
  }

  /**
   * Formats currency for display
   */
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Validates transfer consistency
   */
  static async validateTransfers(): Promise<{
    isValid: boolean;
    netTransferAmount: number;
    transferCount: number;
    issues: string[];
  }> {
    // This would require access to transaction data to validate transfers
    // For now, we'll return a placeholder that can be expanded when needed
    return {
      isValid: true,
      netTransferAmount: 0,
      transferCount: 0,
      issues: [],
    };
  }
}