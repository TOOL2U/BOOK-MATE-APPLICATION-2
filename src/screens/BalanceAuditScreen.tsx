import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TextInput,
  Modal,
} from 'react-native';
import { StyleSheet } from 'react-native';

// Import services and components
import { BalanceAuditService, type FullAuditReport, type BalanceAuditResult } from '../services/balanceAuditService';
import BrandedAlert from '../components/BrandedAlert';

// Import theme and fonts
import { COLORS } from '../config/theme';

interface BalanceAuditScreenProps {}

export const BalanceAuditScreen: React.FC<BalanceAuditScreenProps> = () => {
  const [auditReport, setAuditReport] = useState<FullAuditReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMonthFilter, setSelectedMonthFilter] = useState('ALL');
  const [showTestModal, setShowTestModal] = useState(false);
  const [testAmount, setTestAmount] = useState('');
  const [testAccount, setTestAccount] = useState('');
  const [alertConfig, setAlertConfig] = useState<any>(null);
  const [alertVisible, setAlertVisible] = useState(false);

  // Available month filters
  const monthFilters = ['ALL', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  /**
   * Performs the balance audit
   */
  const performAudit = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }

    try {
      const report = await BalanceAuditService.performFullAudit(selectedMonthFilter);
      setAuditReport(report);
      
      if (report.balanceDiscrepancies === 0 && report.flowDiscrepancies === 0) {
        showAlert({
          title: 'Audit Complete ✅',
          message: `Perfect synchronization! All ${report.totalAccounts} accounts match 1:1 with Google Sheets.`,
          type: 'success'
        });
      } else {
        showAlert({
          title: 'Issues Detected ⚠️',
          message: `Found ${report.balanceDiscrepancies} balance and ${report.flowDiscrepancies} flow discrepancies. Review details below.`,
          type: 'warning'
        });
      }
    } catch (error) {
      showAlert({
        title: 'Audit Failed',
        message: `Unable to complete audit: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedMonthFilter]);

  /**
   * Handles refresh
   */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    performAudit(false);
  }, [performAudit]);

  /**
   * Creates a test transaction
   */
  const createTestTransaction = async () => {
    if (!testAmount || !testAccount) {
      showAlert({
        title: 'Invalid Input',
        message: 'Please enter both amount and account for test transaction.',
        type: 'error'
      });
      return;
    }

    try {
      setLoading(true);
      await BalanceAuditService.createTestTransaction(
        parseFloat(testAmount),
        testAccount,
        'Balance Audit Test Transaction'
      );
      
      // Close modal and refresh audit
      setShowTestModal(false);
      setTestAmount('');
      setTestAccount('');
      
      showAlert({
        title: 'Test Transaction Created',
        message: 'Test transaction created successfully. Running audit to verify data flow...',
        type: 'success'
      });
      
      // Wait a moment for processing then re-audit
      setTimeout(() => {
        performAudit(false);
      }, 2000);
      
    } catch (error) {
      showAlert({
        title: 'Test Failed',
        message: `Failed to create test transaction: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Shows alert
   */
  const showAlert = (config: any) => {
    setAlertConfig(config);
    setAlertVisible(true);
  };

  /**
   * Hides alert
   */
  const hideAlert = () => {
    setAlertVisible(false);
    setAlertConfig(null);
  };

  /**
   * Gets status color based on audit results
   */
  const getStatusColor = (isMatch: boolean): string => {
    return isMatch ? COLORS.SUCCESS : COLORS.ERROR;
  };

  /**
   * Gets system health color
   */
  const getHealthColor = (status: string): string => {
    switch (status) {
      case 'HEALTHY':
      case 'SYNCED':
      case 'VALID':
      case 'CURRENT':
        return COLORS.SUCCESS;
      case 'DEGRADED':
      case 'DELAYED':
      case 'STALE':
        return COLORS.WARNING;
      case 'DOWN':
      case 'ERROR':
      case 'ISSUES_FOUND':
        return COLORS.ERROR;
      default:
        return COLORS.TEXT_SECONDARY;
    }
  };

  // Run initial audit
  useEffect(() => {
    performAudit();
  }, [selectedMonthFilter]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Balance Audit</Text>
          <Text style={styles.subtitle}>1:1 Google Sheets Synchronization</Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          {/* Month Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Month Filter:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterButtons}>
                {monthFilters.map(month => (
                  <TouchableOpacity
                    key={month}
                    style={[
                      styles.filterButton,
                      selectedMonthFilter === month && styles.filterButtonActive
                    ]}
                    onPress={() => setSelectedMonthFilter(month)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      selectedMonthFilter === month && styles.filterButtonTextActive
                    ]}>
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.auditButton}
              onPress={() => performAudit()}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.BLACK} />
              ) : (
                <Text style={styles.auditButtonText}>Run Audit</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.testButton}
              onPress={() => setShowTestModal(true)}
              disabled={loading}
            >
              <Text style={styles.testButtonText}>Test Transaction</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Audit Results */}
        {auditReport && (
          <View style={styles.resultsSection}>
            {/* Summary Card */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Audit Summary</Text>
              
              <View style={styles.summaryStats}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Perfect Matches:</Text>
                  <Text style={[styles.statValue, { color: COLORS.SUCCESS }]}>
                    {auditReport.perfectMatches}/{auditReport.totalAccounts}
                  </Text>
                </View>
                
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Balance Discrepancies:</Text>
                  <Text style={[styles.statValue, { color: getStatusColor(auditReport.balanceDiscrepancies === 0) }]}>
                    {auditReport.balanceDiscrepancies}
                  </Text>
                </View>
                
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Flow Discrepancies:</Text>
                  <Text style={[styles.statValue, { color: getStatusColor(auditReport.flowDiscrepancies === 0) }]}>
                    {auditReport.flowDiscrepancies}
                  </Text>
                </View>
                
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Total Difference:</Text>
                  <Text style={[styles.statValue, { color: getStatusColor(auditReport.totalBalanceDifference === 0) }]}>
                    {BalanceAuditService.formatCurrency(auditReport.totalBalanceDifference)}
                  </Text>
                </View>
              </View>
            </View>

            {/* System Health */}
            <View style={styles.healthCard}>
              <Text style={styles.healthTitle}>System Health</Text>
              
              <View style={styles.healthStats}>
                <View style={styles.healthRow}>
                  <Text style={styles.healthLabel}>API Status:</Text>
                  <Text style={[styles.healthValue, { color: getHealthColor(auditReport.systemHealth.apiStatus) }]}>
                    {auditReport.systemHealth.apiStatus}
                  </Text>
                </View>
                
                <View style={styles.healthRow}>
                  <Text style={styles.healthLabel}>Sheet Sync:</Text>
                  <Text style={[styles.healthValue, { color: getHealthColor(auditReport.systemHealth.sheetSyncStatus) }]}>
                    {auditReport.systemHealth.sheetSyncStatus}
                  </Text>
                </View>
                
                <View style={styles.healthRow}>
                  <Text style={styles.healthLabel}>Transaction Integrity:</Text>
                  <Text style={[styles.healthValue, { color: getHealthColor(auditReport.systemHealth.transactionIntegrity) }]}>
                    {auditReport.systemHealth.transactionIntegrity}
                  </Text>
                </View>
                
                <View style={styles.healthRow}>
                  <Text style={styles.healthLabel}>Data Freshness:</Text>
                  <Text style={[styles.healthValue, { color: getHealthColor(auditReport.dataFreshness) }]}>
                    {auditReport.dataFreshness}
                  </Text>
                </View>
              </View>
            </View>

            {/* Account Details */}
            <Text style={styles.sectionTitle}>Account Comparison</Text>
            
            {auditReport.accountAudits.map((audit, index) => (
              <AccountAuditCard key={index} audit={audit} />
            ))}

            {/* Recommendations */}
            {auditReport.recommendations.length > 0 && (
              <View style={styles.recommendationsCard}>
                <Text style={styles.recommendationsTitle}>Recommendations</Text>
                {auditReport.recommendations.map((recommendation, index) => (
                  <Text key={index} style={styles.recommendation}>
                    • {recommendation}
                  </Text>
                ))}
              </View>
            )}

            {/* Data Totals */}
            <View style={styles.totalsCard}>
              <Text style={styles.totalsTitle}>Data Totals</Text>
              
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>App Total:</Text>
                <Text style={styles.totalValue}>
                  {BalanceAuditService.formatCurrency(auditReport.totalAppBalance)}
                </Text>
              </View>
              
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Sheet Total:</Text>
                <Text style={styles.totalValue}>
                  {BalanceAuditService.formatCurrency(auditReport.totalSheetBalance)}
                </Text>
              </View>
              
              <View style={[styles.totalRow, styles.totalRowFinal]}>
                <Text style={styles.totalLabelFinal}>Difference:</Text>
                <Text style={[
                  styles.totalValueFinal,
                  { color: getStatusColor(auditReport.totalBalanceDifference === 0) }
                ]}>
                  {BalanceAuditService.formatCurrency(auditReport.totalBalanceDifference)}
                </Text>
              </View>
            </View>

            {/* Audit Metadata */}
            <View style={styles.metadataCard}>
              <Text style={styles.metadataTitle}>Audit Details</Text>
              <Text style={styles.metadata}>
                Timestamp: {new Date(auditReport.auditTimestamp).toLocaleString()}
              </Text>
              <Text style={styles.metadata}>
                Filter: {selectedMonthFilter}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Test Transaction Modal */}
      <Modal
        visible={showTestModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTestModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Test Transaction</Text>
            
            <Text style={styles.inputLabel}>Amount (THB):</Text>
            <TextInput
              style={styles.input}
              value={testAmount}
              onChangeText={setTestAmount}
              keyboardType="numeric"
              placeholder="20000"
            />
            
            <Text style={styles.inputLabel}>Account:</Text>
            <TextInput
              style={styles.input}
              value={testAccount}
              onChangeText={setTestAccount}
              placeholder="Bank Transfer - Bangkok Bank - Shaun Ducker"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowTestModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalCreateButton}
                onPress={createTestTransaction}
              >
                <Text style={styles.modalCreateText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Branded Alert */}
      <BrandedAlert
        visible={alertVisible}
        title={alertConfig?.title || ''}
        message={alertConfig?.message || ''}
        type={alertConfig?.type}
        onClose={hideAlert}
      />
    </View>
  );
};

/**
 * Individual account audit card component
 */
const AccountAuditCard: React.FC<{ audit: BalanceAuditResult }> = ({ audit }) => {
  return (
    <View style={[
      styles.accountCard,
      audit.isPerfectMatch ? styles.accountCardValid : styles.accountCardInvalid
    ]}>
      <View style={styles.accountHeader}>
        <Text style={styles.accountName}>{audit.accountName}</Text>
        <View style={[
          styles.statusIndicator,
          audit.isPerfectMatch ? styles.statusValid : styles.statusInvalid
        ]}>
          <Text style={styles.statusText}>
            {audit.isPerfectMatch ? '✅ Perfect' : '❌ Issues'}
          </Text>
        </View>
      </View>
      
      {/* Balance Comparison */}
      <View style={styles.comparisonSection}>
        <Text style={styles.comparisonTitle}>Balance Comparison</Text>
        <View style={styles.comparisonRow}>
          <Text style={styles.comparisonLabel}>App Balance:</Text>
          <Text style={styles.comparisonValue}>
            {BalanceAuditService.formatCurrency(audit.appBalance)}
          </Text>
        </View>
        <View style={styles.comparisonRow}>
          <Text style={styles.comparisonLabel}>Sheet Balance:</Text>
          <Text style={styles.comparisonValue}>
            {BalanceAuditService.formatCurrency(audit.sheetBalance)}
          </Text>
        </View>
        <View style={styles.comparisonRow}>
          <Text style={styles.comparisonLabel}>Difference:</Text>
          <Text style={[
            styles.comparisonValue,
            { color: audit.isBalanceMatch ? COLORS.SUCCESS : COLORS.ERROR }
          ]}>
            {BalanceAuditService.formatCurrency(audit.balanceDifference)}
          </Text>
        </View>
      </View>

      {/* Flow Data */}
      <View style={styles.flowSection}>
        <Text style={styles.flowTitle}>Flow Data</Text>
        <View style={styles.flowGrid}>
          <View style={styles.flowItem}>
            <Text style={styles.flowLabel}>Inflow</Text>
            <Text style={styles.flowApp}>App: {BalanceAuditService.formatCurrency(audit.appInflow)}</Text>
            <Text style={styles.flowSheet}>Sheet: {BalanceAuditService.formatCurrency(audit.sheetInflow)}</Text>
          </View>
          <View style={styles.flowItem}>
            <Text style={styles.flowLabel}>Outflow</Text>
            <Text style={styles.flowApp}>App: {BalanceAuditService.formatCurrency(audit.appOutflow)}</Text>
            <Text style={styles.flowSheet}>Sheet: {BalanceAuditService.formatCurrency(audit.sheetOutflow)}</Text>
          </View>
        </View>
      </View>

      {/* Error Details */}
      {audit.errorDetails.length > 0 && (
        <View style={styles.errorSection}>
          <Text style={styles.errorTitle}>Issues Found:</Text>
          {audit.errorDetails.map((error, index) => (
            <Text key={index} style={styles.errorDetail}>• {error}</Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Made-Mirage-Bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
  },
  controls: {
    marginBottom: 24,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.CARD_PRIMARY,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  filterButtonActive: {
    backgroundColor: COLORS.YELLOW,
    borderColor: COLORS.BRAND_YELLOW,
  },
  filterButtonText: {
    fontSize: 12,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_PRIMARY,
  },
  filterButtonTextActive: {
    color: COLORS.BRAND_BLACK,
    fontFamily: 'Aileron-Bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  auditButton: {
    flex: 1,
    backgroundColor: COLORS.YELLOW,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  auditButtonText: {
    fontSize: 16,
    fontFamily: 'Aileron-Bold',
    color: COLORS.BRAND_BLACK,
  },
  testButton: {
    flex: 1,
    backgroundColor: COLORS.CARD_PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  testButtonText: {
    fontSize: 16,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
  },
  resultsSection: {
    gap: 16,
  },
  summaryCard: {
    backgroundColor: COLORS.CARD_PRIMARY,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: 'Bebas-Neue-Regular',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  summaryStats: {
    gap: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
  },
  statValue: {
    fontSize: 14,
    fontFamily: 'Aileron-Bold',
    fontWeight: '600',
  },
  healthCard: {
    backgroundColor: COLORS.CARD_PRIMARY,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  healthTitle: {
    fontSize: 18,
    fontFamily: 'Bebas-Neue-Regular',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  healthStats: {
    gap: 8,
  },
  healthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  healthLabel: {
    fontSize: 14,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
  },
  healthValue: {
    fontSize: 14,
    fontFamily: 'Aileron-Bold',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Bebas-Neue-Regular',
    color: COLORS.TEXT_PRIMARY,
    marginTop: 8,
    marginBottom: 16,
  },
  accountCard: {
    backgroundColor: COLORS.CARD_PRIMARY,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  accountCardValid: {
    borderColor: COLORS.SUCCESS,
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  accountCardInvalid: {
    borderColor: COLORS.ERROR,
    backgroundColor: 'rgba(255, 99, 99, 0.05)',
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  accountName: {
    fontSize: 16,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusValid: {
    backgroundColor: COLORS.SUCCESS,
  },
  statusInvalid: {
    backgroundColor: COLORS.ERROR,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
  },
  comparisonSection: {
    marginBottom: 12,
  },
  comparisonTitle: {
    fontSize: 14,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 6,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  comparisonLabel: {
    fontSize: 13,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
  },
  comparisonValue: {
    fontSize: 13,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
  },
  flowSection: {
    marginBottom: 12,
  },
  flowTitle: {
    fontSize: 14,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 6,
  },
  flowGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  flowItem: {
    flex: 1,
  },
  flowLabel: {
    fontSize: 12,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 2,
  },
  flowApp: {
    fontSize: 11,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 1,
  },
  flowSheet: {
    fontSize: 11,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
  },
  errorSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  errorTitle: {
    fontSize: 12,
    fontFamily: 'Aileron-Bold',
    color: COLORS.ERROR,
    marginBottom: 4,
  },
  errorDetail: {
    fontSize: 11,
    fontFamily: 'Aileron-Regular',
    color: COLORS.ERROR,
    marginBottom: 2,
  },
  recommendationsCard: {
    backgroundColor: COLORS.CARD_PRIMARY,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.WARNING,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  recommendation: {
    fontSize: 13,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  totalsCard: {
    backgroundColor: COLORS.CARD_PRIMARY,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  totalsTitle: {
    fontSize: 16,
    fontFamily: 'Bebas-Neue-Regular',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  totalRowFinal: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
  },
  totalValue: {
    fontSize: 14,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
  },
  totalLabelFinal: {
    fontSize: 16,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
  },
  totalValueFinal: {
    fontSize: 16,
    fontFamily: 'Aileron-Bold',
  },
  metadataCard: {
    backgroundColor: COLORS.SURFACE_2,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  metadataTitle: {
    fontSize: 14,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 6,
  },
  metadata: {
    fontSize: 12,
    fontFamily: 'Aileron-Light',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Bebas-Neue-Regular',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
    backgroundColor: COLORS.CARD_PRIMARY,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  modalCancelText: {
    fontSize: 16,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
  },
  modalCreateButton: {
    flex: 1,
    backgroundColor: COLORS.YELLOW,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCreateText: {
    fontSize: 16,
    fontFamily: 'Aileron-Bold',
    color: COLORS.BRAND_BLACK,
  },
});