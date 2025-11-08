import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { apiService } from '../services/api';
import { BalanceVerificationService, VerificationSummary } from '../services/balanceVerification';
import { COLORS, SHADOWS } from '../config/theme';
import type { Balance } from '../types';
import TransferModal from '../components/TransferModal';
import BrandedAlert from '../components/BrandedAlert';
import { useBrandedAlert } from '../hooks/useBrandedAlert';
import LogoBM from '../components/LogoBM';

export default function BalanceScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [verificationSummary, setVerificationSummary] = useState<VerificationSummary | null>(null);
  const [verificationLoading, setVerificationLoading] = useState(false);

  // Branded alert hook
  const {
    alertConfig,
    isVisible: alertVisible,
    hideAlert,
    showError,
  } = useBrandedAlert();

  const fetchBalances = async () => {
    try {
      const response = await apiService.getBalances();
      if (response.ok) {
        setBalances(response.balances);
        // Also run verification after fetching balances
        await runVerification();
      }
    } catch (error) {
      showError('Error', 'Failed to fetch balances');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

    const runVerification = async () => {
    setVerificationLoading(true);
    try {
      const summary = await BalanceVerificationService.verifyBalances();
      setVerificationSummary(summary);
    } catch (error) {
      console.error('Error running balance verification:', error);
      showError('Verification Error', 'Failed to verify balances. Please try again.');
    } finally {
      setVerificationLoading(false);
    }
  };

  // Run verification when component mounts
  useEffect(() => {
    if (balances.length > 0) {
      runVerification();
    }
  }, [balances]);

  useEffect(() => {
    fetchBalances();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBalances();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.YELLOW} />
      </View>
    );
  }

  const totalBalance = balances?.reduce((sum, b) => sum + b.balance, 0) || 0;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.YELLOW}
          />
        }
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <LogoBM size={64} />
        </View>
        
        {/* Header */}
        <Text style={styles.title}>Balance</Text>
        <Text style={styles.subtitle}>Track your bank and cash balances</Text>

        {/* Total Balance Card */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Balance</Text>
          <Text style={styles.totalAmount}>{formatCurrency(totalBalance)}</Text>
        </View>

        {/* Transfer Button */}
        <TouchableOpacity
          style={styles.transferButton}
          onPress={() => setTransferModalVisible(true)}
        >
          <Text style={styles.transferButtonText}>Transfer Money</Text>
        </TouchableOpacity>

        {/* Individual Balances */}
        <View style={styles.balanceList}>
          {balances?.map((balance, index) => (
            <View key={index} style={styles.balanceCard}>
              <View style={styles.balanceHeader}>
                <Text style={styles.bankName}>{balance.bankName}</Text>
                <Text style={styles.balanceAmount}>
                  {formatCurrency(balance.balance)}
                </Text>
              </View>
              <Text style={styles.lastUpdated}>
                Updated: {formatDate(balance.lastUpdated)}
              </Text>
            </View>
          ))}
        </View>

        {/* Balance Verification Section */}
        {verificationSummary && (
          <View style={styles.verificationSection}>
            <View style={styles.verificationHeader}>
              <Text style={styles.verificationTitle}>Balance Verification</Text>
              <TouchableOpacity
                style={styles.recalculateButton}
                onPress={runVerification}
                disabled={verificationLoading}
              >
                {verificationLoading ? (
                  <ActivityIndicator size="small" color={COLORS.BLACK} />
                ) : (
                  <Text style={styles.recalculateButtonText}>Recalculate</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Summary Stats */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Verification Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Accounts:</Text>
                <Text style={styles.summaryValue}>{verificationSummary.totalAccounts}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Valid Accounts:</Text>
                <Text style={[styles.summaryValue, { color: COLORS.SUCCESS }]}>
                  {verificationSummary.validAccounts}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Variance:</Text>
                <Text style={[
                  styles.summaryValue,
                  verificationSummary.hasDiscrepancies ? { color: COLORS.ERROR } : { color: COLORS.SUCCESS }
                ]}>
                  {BalanceVerificationService.formatCurrency(verificationSummary.totalVariance)}
                  {verificationSummary.hasDiscrepancies ? ' ❌' : ' ✅'}
                </Text>
              </View>
            </View>

            {/* Detailed Verification */}
            {verificationSummary.accountVerifications.map((verification, index) => (
              <View key={index} style={[
                styles.verificationCard,
                !verification.isValid && styles.verificationCardError
              ]}>
                <Text style={styles.verificationAccountName}>{verification.accountName}</Text>
                
                <View style={styles.verificationRow}>
                  <Text style={styles.verificationLabel}>Opening:</Text>
                  <Text style={styles.verificationValue}>
                    {BalanceVerificationService.formatCurrency(verification.openingBalance)}
                  </Text>
                </View>
                
                <View style={styles.verificationRow}>
                  <Text style={styles.verificationLabel}>Inflow:</Text>
                  <Text style={[styles.verificationValue, { color: COLORS.SUCCESS }]}>
                    {BalanceVerificationService.formatCurrency(verification.inflow)}
                  </Text>
                </View>
                
                <View style={styles.verificationRow}>
                  <Text style={styles.verificationLabel}>Outflow:</Text>
                  <Text style={[styles.verificationValue, { color: COLORS.ERROR }]}>
                    {BalanceVerificationService.formatCurrency(verification.outflow)}
                  </Text>
                </View>
                
                <View style={styles.verificationRow}>
                  <Text style={styles.verificationLabel}>Calculated:</Text>
                  <Text style={styles.verificationValue}>
                    {BalanceVerificationService.formatCurrency(verification.calculatedBalance)}
                  </Text>
                </View>
                
                <View style={styles.verificationRow}>
                  <Text style={styles.verificationLabel}>API Balance:</Text>
                  <Text style={styles.verificationValue}>
                    {BalanceVerificationService.formatCurrency(verification.apiBalance)}
                  </Text>
                </View>
                
                <View style={styles.verificationRow}>
                  <Text style={styles.verificationLabel}>Difference:</Text>
                  <Text style={[
                    styles.verificationValue,
                    verification.isValid ? { color: COLORS.SUCCESS } : { color: COLORS.ERROR }
                  ]}>
                    {BalanceVerificationService.formatCurrency(verification.difference)}
                    {verification.isValid ? ' ✅' : ' ❌'}
                  </Text>
                </View>
                
                {verification.validationNote && (
                  <Text style={styles.verificationNote}>
                    Note: {verification.validationNote}
                  </Text>
                )}
                
                {verification.lastTxnAt && (
                  <Text style={styles.verificationLastTxn}>
                    Last Transaction: {verification.lastTxnAt}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Transfer Modal */}
        <TransferModal
          visible={transferModalVisible}
          onClose={() => setTransferModalVisible(false)}
          onTransferComplete={() => {
            // Refresh balances after successful transfer
            fetchBalances();
          }}
        />
      </ScrollView>

      {/* Branded Alert */}
      <BrandedAlert
        visible={alertVisible}
        title={alertConfig?.title || ''}
        message={alertConfig?.message || ''}
        type={alertConfig?.type}
        onClose={hideAlert}
        onConfirm={alertConfig?.onConfirm}
        confirmText={alertConfig?.confirmText}
        cancelText={alertConfig?.cancelText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.GREY_PRIMARY,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: COLORS.GREY_PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontFamily: 'MadeMirage-Regular',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Aileron-Light',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 24,
    textAlign: 'center',
  },
  totalCard: {
    backgroundColor: COLORS.YELLOW,
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    ...SHADOWS.YELLOW_GLOW,
  },
  totalLabel: {
    color: COLORS.BLACK,
    fontSize: 14,
    fontFamily: 'Aileron-Bold',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  totalAmount: {
    color: COLORS.BLACK,
    fontSize: 36,
    fontFamily: 'BebasNeue-Regular',
    fontWeight: '400',
  },
  balanceList: {
    gap: 12,
    marginBottom: 24,
  },
  balanceCard: {
    backgroundColor: COLORS.SURFACE_1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bankName: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
    fontFamily: 'Aileron-Bold',
    fontWeight: '600',
    flex: 1,
  },
  balanceAmount: {
    color: COLORS.YELLOW,
    fontSize: 18,
    fontFamily: 'BebasNeue-Regular',
    fontWeight: '400',
  },
  lastUpdated: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 12,
    fontFamily: 'Aileron-Light',
  },
  addButton: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.YELLOW,
    borderStyle: 'dashed',
  },
  addButtonText: {
    color: COLORS.YELLOW,
    fontSize: 16,
    fontFamily: 'Aileron-Bold',
    fontWeight: '600',
  },
  transferButton: {
    backgroundColor: COLORS.YELLOW,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
    ...SHADOWS.YELLOW_GLOW,
  },
  transferButtonText: {
    color: COLORS.BLACK,
    fontSize: 18,
    fontFamily: 'Aileron-Bold',
    fontWeight: '600',
  },
  // Verification Section Styles
  verificationSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  verificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  verificationTitle: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 20,
    fontFamily: 'Aileron-Bold',
    fontWeight: '600',
  },
  recalculateButton: {
    backgroundColor: COLORS.YELLOW,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  recalculateButtonText: {
    color: COLORS.BLACK,
    fontSize: 14,
    fontFamily: 'Aileron-Bold',
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: COLORS.SURFACE_1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    marginBottom: 16,
  },
  summaryTitle: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
    fontFamily: 'Aileron-Bold',
    fontWeight: '600',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
    fontFamily: 'Aileron-Regular',
  },
  summaryValue: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 14,
    fontFamily: 'Aileron-Bold',
    fontWeight: '600',
  },
  verificationCard: {
    backgroundColor: COLORS.SURFACE_1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    marginBottom: 12,
  },
  verificationCardError: {
    borderColor: COLORS.ERROR,
    backgroundColor: 'rgba(255, 99, 99, 0.05)',
  },
  verificationAccountName: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
    fontFamily: 'Aileron-Bold',
    fontWeight: '600',
    marginBottom: 12,
  },
  verificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  verificationLabel: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 13,
    fontFamily: 'Aileron-Regular',
  },
  verificationValue: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 13,
    fontFamily: 'Aileron-Bold',
    fontWeight: '600',
  },
  verificationLastTxn: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 11,
    fontFamily: 'Aileron-Light',
    marginTop: 8,
    fontStyle: 'italic',
  },
  verificationNote: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 12,
    fontFamily: 'Aileron-Regular',
    fontStyle: 'italic',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
});

