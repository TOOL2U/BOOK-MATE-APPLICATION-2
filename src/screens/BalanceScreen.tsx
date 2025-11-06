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
import { COLORS, SHADOWS, SPACING, RADIUS } from '../config/theme';
import type { Balance } from '../types';
import TransferModal from '../components/TransferModal';

export default function BalanceScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [transferModalVisible, setTransferModalVisible] = useState(false);

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

        {/* Transfer Modal */}
        <TransferModal
          visible={transferModalVisible}
          onClose={() => setTransferModalVisible(false)}
          accounts={balances?.map(b => b.bankName) || []}
          onTransferComplete={() => {
            // Refresh balances after successful transfer
            fetchBalances();
          }}
        />
      </ScrollView>
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
  title: {
    fontSize: 32,
    fontFamily: 'MadeMirage-Regular',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
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
    padding: SPACING.LG,
    borderRadius: RADIUS.MD,
    alignItems: 'center',
    marginTop: SPACING.MD,
    marginBottom: SPACING.LG,
    borderWidth: 1,
    borderColor: COLORS.YELLOW,
    ...SHADOWS.YELLOW_GLOW,
  },
  transferButtonText: {
    color: COLORS.GREY_PRIMARY,
    fontSize: 16,
    fontFamily: 'Aileron-Bold',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

