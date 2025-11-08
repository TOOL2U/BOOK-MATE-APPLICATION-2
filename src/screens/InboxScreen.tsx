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
import { COLORS, SHADOWS } from '../config/theme';
import type { TransactionWithRow } from '../types';
import BrandedAlert from '../components/BrandedAlert';
import { useBrandedAlert } from '../hooks/useBrandedAlert';
import LogoBM from '../components/LogoBM';

export default function InboxScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<TransactionWithRow[]>([]);

  // Branded alert hook
  const {
    alertConfig,
    isVisible: alertVisible,
    hideAlert,
    showSuccess,
    showError,
    showConfirm,
  } = useBrandedAlert();

  const fetchInbox = async () => {
    try {
      const response = await apiService.getInbox();
      
      if (response.ok && response.data) {
        setTransactions(response.data || []);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error('InboxScreen: Fetch error:', error);
      showError('Error', 'Failed to fetch transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchInbox();
  };

  const handleDelete = (rowNumber: number) => {
    showConfirm(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      async () => {
        try {
          await apiService.deleteReceipt(rowNumber);
          showSuccess('Success', 'Transaction deleted');
          fetchInbox();
        } catch (error) {
          showError('Error', 'Failed to delete transaction');
        }
      },
      'Delete',
      'Cancel'
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(amount);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.YELLOW} />
      </View>
    );
  }

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
        <Text style={styles.title}>Activity</Text>
        <Text style={styles.subtitle}>
          {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
        </Text>

        {transactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions yet</Text>
            <Text style={styles.emptySubtext}>
              Upload a receipt or add a manual entry to get started
            </Text>
          </View>
        ) : (
          <View style={styles.transactionList}>
            {transactions.map((transaction) => (
              <View key={transaction.rowNumber} style={styles.transactionCard}>
                <View style={styles.transactionHeader}>
                  <Text style={styles.transactionDate}>
                    {transaction.day}/{transaction.month}/{transaction.year}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleDelete(transaction.rowNumber)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.transactionDetail}>{transaction.detail}</Text>

                <View style={styles.transactionMeta}>
                  <Text style={styles.metaText}>{transaction.property}</Text>
                  <Text style={styles.metaText}>•</Text>
                  <Text style={styles.metaText} numberOfLines={2}>
                    {transaction.typeOfPayment}
                  </Text>
                </View>

                <View style={styles.transactionFooter}>
                  <Text style={styles.categoryText}>
                    {transaction.typeOfOperation}
                  </Text>
                  <Text
                    style={[
                      styles.amountText,
                      transaction.debit > 0 ? styles.debitText : styles.creditText,
                    ]}
                  >
                    {transaction.debit > 0
                      ? `-${formatCurrency(transaction.debit)}`
                      : `+${formatCurrency(transaction.credit)}`}
                  </Text>
                </View>

                {transaction.ref && (
                  <Text style={styles.refText}>Ref: {transaction.ref}</Text>
                )}
              </View>
            ))}
          </View>
        )}
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
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 18,
    fontFamily: 'Aileron-Bold',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
    fontFamily: 'Aileron-Light',
    textAlign: 'center',
  },
  transactionList: {
    gap: 12,
  },
  transactionCard: {
    backgroundColor: COLORS.SURFACE_1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionDate: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
    fontFamily: 'Aileron-Bold',
    fontWeight: '600',
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 18,
    color: COLORS.ERROR,
  },
  transactionDetail: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
    fontFamily: 'Aileron-Bold',
    fontWeight: '600',
    marginBottom: 8,
  },
  transactionMeta: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  metaText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 12,
    fontFamily: 'Aileron-Light',
    flexShrink: 1,
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 12,
    fontFamily: 'Aileron-Light',
    flex: 1,
  },
  amountText: {
    fontSize: 18,
    fontFamily: 'BebasNeue-Regular',
    fontWeight: '400',
  },
  debitText: {
    color: COLORS.ERROR,
  },
  creditText: {
    color: COLORS.SUCCESS,
  },
  refText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 11,
    fontFamily: 'Aileron-Light',
    marginTop: 4,
    fontStyle: 'italic',
  },
});

