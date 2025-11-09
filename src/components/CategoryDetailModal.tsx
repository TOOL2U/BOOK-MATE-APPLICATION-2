import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { COLORS } from '../config/theme';
import { apiService } from '../services/api';

interface Transaction {
  id?: string;
  date: string;
  detail: string;
  debit: number;
  credit: number;
  typeOfOperation?: string;
  property?: string;
}

interface CategoryDetailModalProps {
  visible: boolean;
  onClose: () => void;
  categoryName: string;
  period: 'month' | 'year';
}

export default function CategoryDetailModal({
  visible,
  onClose,
  categoryName,
  period,
}: CategoryDetailModalProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && categoryName) {
      fetchCategoryTransactions();
    }
  }, [visible, categoryName, period]);

  const fetchCategoryTransactions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all transactions from inbox
      const response = await apiService.getInbox();
      
      console.log('CategoryDetailModal: Response:', response.ok, 'Data count:', response.data?.length);
      
      if (response.ok && response.data && Array.isArray(response.data)) {
        console.log('CategoryDetailModal: Looking for category:', categoryName);
        console.log('CategoryDetailModal: Sample typeOfOperation values:', 
          response.data.slice(0, 5).map((t: any) => t.typeOfOperation)
        );
        
        // Filter transactions by category (typeOfOperation)
        // Match exact category name or if category is contained in typeOfOperation
        const filtered = response.data.filter((t: any) => {
          const matches = t.typeOfOperation === categoryName || 
                         t.typeOfOperation?.includes(categoryName) ||
                         categoryName.includes(t.typeOfOperation);
          
          if (matches) {
            console.log('CategoryDetailModal: Matched transaction:', {
              typeOfOperation: t.typeOfOperation,
              detail: t.detail,
              debit: t.debit
            });
          }
          
          return matches;
        });
        
        console.log('CategoryDetailModal: Filtered count:', filtered.length);
        
        // NOTE: Don't filter by month here - the overhead expenses data is already
        // filtered by period (month/year) when the user tapped the category.
        // We just show all matching transactions for that category.
        setTransactions(filtered);
        
        console.log('CategoryDetailModal: Final transaction count:', filtered.length);
      } else {
        setError(response.error || 'No transactions found');
        setTransactions([]);
      }
    } catch (err) {
      console.error('Error fetching category transactions:', err);
      setError('Failed to load transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(amount);
  };

  const formatDate = (transaction: any) => {
    try {
      // Prefer day/month/year fields if available (matching InboxScreen format)
      if (transaction.day && transaction.month && transaction.year) {
        return `${transaction.day}/${transaction.month}/${transaction.year}`;
      }
      // Otherwise try parsing date string
      const date = new Date(transaction.date);
      return date.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch {
      return transaction.date || 'Unknown date';
    }
  };

  const getTotalExpense = () => {
    return transactions.reduce((sum, t) => sum + (t.debit || 0), 0);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>{categoryName}</Text>
            <Text style={styles.subtitle}>
              {period === 'month' ? 'This Month' : 'This Year'} • {transactions.length} transactions
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.YELLOW} />
            <Text style={styles.loadingText}>Loading transactions...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchCategoryTransactions}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : transactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions found for this category</Text>
          </View>
        ) : (
          <ScrollView style={styles.content}>
            {transactions.map((transaction, index) => (
              <View key={index} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <Text style={styles.transactionDate}>{formatDate(transaction)}</Text>
                  <Text style={styles.transactionDetail} numberOfLines={2}>
                    {transaction.detail || 'No description'}
                  </Text>
                  {transaction.property && (
                    <Text style={styles.transactionProperty}>{transaction.property}</Text>
                  )}
                </View>
                <View style={styles.transactionRight}>
                  {transaction.debit > 0 && (
                    <Text style={styles.transactionDebit}>
                      {formatCurrency(transaction.debit)}
                    </Text>
                  )}
                  {transaction.credit > 0 && (
                    <Text style={styles.transactionCredit}>
                      {formatCurrency(transaction.credit)}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        <View style={styles.footer}>
          <Text style={styles.totalLabel}>Total Expense</Text>
          <Text style={styles.totalAmount}>{formatCurrency(getTotalExpense())}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.GREY_PRIMARY,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: 'BebasNeue-Regular',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
  },
  closeButton: {
    padding: 8,
    marginLeft: 12,
  },
  closeButtonText: {
    fontSize: 24,
    color: COLORS.TEXT_SECONDARY,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: COLORS.YELLOW,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: 'Aileron-Bold',
    color: COLORS.BLACK,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  transactionLeft: {
    flex: 1,
    marginRight: 16,
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  transactionDetail: {
    fontSize: 16,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  transactionProperty: {
    fontSize: 12,
    fontFamily: 'Aileron-Light',
    color: COLORS.TEXT_SECONDARY,
  },
  transactionRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  transactionDebit: {
    fontSize: 16,
    fontFamily: 'Aileron-Bold',
    color: COLORS.YELLOW,
  },
  transactionCredit: {
    fontSize: 16,
    fontFamily: 'Aileron-Bold',
    color: '#4CAF50',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    backgroundColor: COLORS.SURFACE_1,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
  },
  totalAmount: {
    fontSize: 20,
    fontFamily: 'BebasNeue-Regular',
    color: COLORS.YELLOW,
  },
});
