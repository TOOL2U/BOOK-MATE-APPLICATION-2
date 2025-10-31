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
import type { Balance } from '../types';

export default function BalanceScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [balances, setBalances] = useState<Balance[]>([]);

  const fetchBalances = async () => {
    try {
      const response = await apiService.getBalances();
      if (response.ok) {
        setBalances(response.balances);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch balances');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

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
        <ActivityIndicator size="large" color="#3B82F6" />
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
            tintColor="#3B82F6"
          />
        }
      >
        <Text style={styles.title}>Balance</Text>
        <Text style={styles.subtitle}>Track your bank and cash balances</Text>

        {/* Total Balance Card */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Balance</Text>
          <Text style={styles.totalAmount}>{formatCurrency(totalBalance)}</Text>
        </View>

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

        {/* Add Balance Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => Alert.alert('Coming Soon', 'Add balance feature will be implemented')}
        >
          <Text style={styles.addButtonText}>+ Add Balance Entry</Text>
        </TouchableOpacity>
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
  totalCard: {
    backgroundColor: '#3B82F6',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  totalLabel: {
    color: '#BFDBFE',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  totalAmount: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  balanceList: {
    gap: 12,
    marginBottom: 24,
  },
  balanceCard: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bankName: {
    color: '#F1F5F9',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  balanceAmount: {
    color: '#10B981',
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastUpdated: {
    color: '#64748B',
    fontSize: 12,
  },
  addButton: {
    backgroundColor: '#334155',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#475569',
    borderStyle: 'dashed',
  },
  addButtonText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '600',
  },
});

