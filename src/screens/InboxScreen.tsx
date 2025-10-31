import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { apiService } from '../services/api';
import type { TransactionWithRow } from '../types';

export default function InboxScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<TransactionWithRow[]>([]);

  const fetchInbox = async () => {
    try {
      const response = await apiService.getInbox();
      if (response.ok) {
        setTransactions(response.data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch transactions');
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
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.deleteReceipt(rowNumber);
              Alert.alert('Success', 'Transaction deleted');
              fetchInbox();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete transaction');
            }
          },
        },
      ]
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
        <ActivityIndicator size="large" color="#3B82F6" />
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
            tintColor="#3B82F6"
          />
        }
      >
        <Text style={styles.title}>Inbox</Text>
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
                  <Text style={styles.metaText}>{transaction.typeOfPayment}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#F1F5F9',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#64748B',
    fontSize: 14,
    textAlign: 'center',
  },
  transactionList: {
    gap: 12,
  },
  transactionCard: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionDate: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  transactionDetail: {
    color: '#F1F5F9',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  transactionMeta: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  metaText: {
    color: '#64748B',
    fontSize: 12,
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryText: {
    color: '#94A3B8',
    fontSize: 12,
    flex: 1,
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  debitText: {
    color: '#EF4444',
  },
  creditText: {
    color: '#10B981',
  },
  refText: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 4,
    fontStyle: 'italic',
  },
});

