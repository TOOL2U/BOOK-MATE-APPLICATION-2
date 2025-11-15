/**
 * Account Detail Modal
 * Revolut-style slide-up modal showing account details, balance, transactions, and insights
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
  Easing,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS, SPACING } from '../config/theme';
import { COMPONENT_RADIUS } from '../constants/borderRadius';
import { apiService } from '../services/api';
import { SparklineChart } from './ui/SparklineChart';

interface AccountDetailModalProps {
  visible: boolean;
  account: {
    id: string;
    name: string;
    balance: number;
    lastUpdated?: string;
  } | null;
  onClose: () => void;
  onAddEntry?: () => void;
  onTransfer?: () => void;
}

interface Transaction {
  day: string;
  month: string;
  year: string;
  property: string;
  typeOfOperation: string;
  typeOfPayment: string;
  detail: string;
  ref: string;
  debit: number;
  credit: number;
  rowNumber?: number;
}

export default function AccountDetailModal({
  visible,
  account,
  onClose,
  onAddEntry,
  onTransfer,
}: AccountDetailModalProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [slideAnim] = useState(new Animated.Value(40));
  const [opacityAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      // Premium fade + slide up animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 240,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();

      // Fetch transactions for this account
      if (account) {
        fetchTransactions();
      }
    } else {
      // Slide down with opacity drop on close
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 40,
          duration: 200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, account]);

  const fetchTransactions = async () => {
    if (!account) return;

    setLoading(true);
    try {
      const response = await apiService.getInbox();
      if (response.ok && response.data) {
        // Filter transactions for this specific account
        // Match by account name in typeOfPayment field
        const filtered = response.data
          .filter((tx) => {
            // Check if the transaction's typeOfPayment contains the account name
            // or if the account name is in the typeOfPayment string
            const paymentType = tx.typeOfPayment || '';
            return paymentType.includes(account.name) || 
                   account.name.includes(paymentType) ||
                   (account.name.toLowerCase().includes('cash') && paymentType.toLowerCase() === 'cash') ||
                   (account.name.toLowerCase().includes('bangkok bank - shaun') && paymentType.includes('Bangkok Bank - Shaun Ducker')) ||
                   (account.name.toLowerCase().includes('bangkok bank - maria') && paymentType.includes('Bangkok Bank - Maria Ren')) ||
                   (account.name.toLowerCase().includes('krung thai') && paymentType.includes('Krung Thai Bank'));
          })
          .slice(0, 10); // Show last 10 transactions
        
        console.log(`📊 Found ${filtered.length} transactions for account: ${account.name}`);
        setTransactions(filtered);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  const formatDate = (day: string, month: string, year: string) => {
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const monthIndex = monthNames.indexOf(month);
    if (monthIndex === -1) return 'Invalid Date';
    
    const date = new Date(parseInt(year), monthIndex, parseInt(day));
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getLastUpdatedText = () => {
    if (!account?.lastUpdated) return 'Updated recently';
    
    const lastUpdate = new Date(account.lastUpdated);
    const now = new Date();
    const diffMs = now.getTime() - lastUpdate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Updated just now';
    if (diffMins < 60) return `Updated ${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Updated ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `Updated ${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  // Calculate this month's insights
  const calculateInsights = () => {
    const currentMonth = new Date().toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const monthTransactions = transactions.filter((tx) => tx.month === currentMonth);
    
    const earned = monthTransactions.reduce((sum, tx) => sum + tx.credit, 0);
    const spent = monthTransactions.reduce((sum, tx) => sum + tx.debit, 0);
    const progress = earned - spent;

    return { earned, progress };
  };

  const insights = calculateInsights();

  // Mock data for sparkline chart - representing daily progress throughout the month
  const mockProgressData = [
    2500, 3200, 4100, 3800, 5200, 6100, 7300, 
    8200, 9500, 11000, 10800, 12500, 14200, 15800,
    17300, 18900, 20100, 21500, 22800, 24300, 25100,
    26800, 28200, 29500, 30800, 32100, 33500, 34200,
    35800, 37100
  ];

  const getBankLogo = (name: string) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('bangkok bank')) {
      return require('../../assets/icons/Banks/Bangkok_Bank_2023_(English_version)-cropped (1).png');
    }
    if (nameLower.includes('krung thai')) {
      return require('../../assets/icons/Banks/Krung_Thai_Bank_logo.svg-removebg-preview.png');
    }
    return null;
  };

  if (!account) return null;

  const bankLogo = getBankLogo(account.name);
  const isCash = account.name.toLowerCase().includes('cash');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: opacityAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <SafeAreaView style={styles.modalContent} edges={['bottom']}>
            {/* Premium gradient background */}
            <LinearGradient
              colors={['#2a2a2a', '#1a1a1a', '#0d0d0d', '#050505']}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              locations={[0, 0.3, 0.65, 1]}
              pointerEvents="none"
            />

            {/* Top Handle */}
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>

            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.TEXT_SECONDARY} />
            </TouchableOpacity>

            <ScrollView
              style={styles.scrollContent}
              contentContainerStyle={styles.scrollContentContainer}
              showsVerticalScrollIndicator={true}
              bounces={true}
              alwaysBounceVertical={true}
              keyboardShouldPersistTaps="handled"
            >
              {/* Account Header */}
              <View style={styles.header}>
                <View style={[styles.accountIcon, (bankLogo || isCash) && styles.accountIconTransparent]}>
                  {bankLogo ? (
                    <Image 
                      source={bankLogo} 
                      style={styles.bankLogo}
                      resizeMode="contain"
                    />
                  ) : isCash ? (
                    <Ionicons name="cash-outline" size={52} color={COLORS.BRAND_YELLOW} />
                  ) : (
                    <Text style={styles.accountIconText}>
                      {account.name.charAt(0).toUpperCase()}
                    </Text>
                  )}
                </View>
                <Text style={styles.accountName}>{account.name}</Text>
                <Text style={styles.balance}>฿{formatCurrency(account.balance)}</Text>
                <Text style={styles.lastUpdated}>{getLastUpdatedText()}</Text>
              </View>

              {/* Divider before transactions */}
              <View style={styles.divider} />

              {/* Quick Actions (Premium Polish) */}
              <View style={styles.actionsRow}>
                <TouchableOpacity 
                  style={styles.actionButton} 
                  activeOpacity={0.7}
                  onPress={() => {
                    if (onAddEntry) {
                      onClose(); // Close the detail modal first
                      setTimeout(() => onAddEntry(), 300); // Then open add entry modal
                    }
                  }}
                >
                  <View style={styles.actionCircle}>
                    <Ionicons name="add" size={22} color={COLORS.TEXT_PRIMARY} />
                  </View>
                  <Text style={styles.actionLabel}>Add entry</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton} 
                  activeOpacity={0.7}
                  onPress={() => {
                    if (onTransfer) {
                      onClose(); // Close the detail modal first
                      setTimeout(() => onTransfer(), 300); // Then open transfer modal
                    }
                  }}
                >
                  <View style={styles.actionCircle}>
                    <Ionicons name="swap-horizontal" size={22} color={COLORS.TEXT_PRIMARY} />
                  </View>
                  <Text style={styles.actionLabel}>Transfer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                  <View style={styles.actionCircle}>
                    <Ionicons name="information-circle-outline" size={22} color={COLORS.TEXT_PRIMARY} />
                  </View>
                  <Text style={styles.actionLabel}>Info</Text>
                </TouchableOpacity>
              </View>

              {/* Recent Transactions */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent transactions</Text>

                {loading ? (
                  <ActivityIndicator size="small" color={COLORS.YELLOW} style={styles.loader} />
                ) : transactions.length === 0 ? (
                  <View style={styles.emptyCard}>
                    <Ionicons name="receipt-outline" size={48} color={COLORS.TEXT_MUTED} />
                    <Text style={styles.emptyTitle}>No transactions yet</Text>
                    <Text style={styles.emptySubtitle}>
                      Add your first transaction to see it here.
                    </Text>
                  </View>
                ) : (
                  transactions.map((tx, index) => (
                    <View key={index} style={styles.transactionCard}>
                      <View style={styles.transactionLeft}>
                        <Text style={styles.transactionTitle} numberOfLines={1}>
                          {tx.detail || tx.typeOfOperation || 'Transaction'}
                        </Text>
                        <Text style={styles.transactionDate}>
                          {formatDate(tx.day, tx.month, tx.year)}
                        </Text>
                      </View>
                      <View style={styles.transactionRight}>
                        <Text
                          style={[
                            styles.transactionAmount,
                            { color: tx.credit > 0 ? COLORS.REVENUE_GREEN : COLORS.EXPENSE_RED },
                          ]}
                        >
                          {tx.credit > 0 ? '+' : '-'}฿{formatCurrency(tx.credit > 0 ? tx.credit : tx.debit)}
                        </Text>
                      </View>
                    </View>
                  ))
                )}
              </View>

              {/* Insights Row */}
              <View style={styles.insightsRow}>
                {/* Earned this month */}
                <View style={[styles.insightCard, { marginRight: 6 }]}>
                  <Text style={styles.insightLabel}>Earned this month</Text>
                  <Text style={styles.insightValue}>฿{formatCurrency(insights.earned)}</Text>
                  <Text style={styles.insightSubtext}>
                    All time: ฿{formatCurrency(account.balance)}
                  </Text>
                </View>

                {/* Progress this month */}
                <View style={[styles.insightCard, { marginLeft: 6 }]}>
                  <Text style={styles.insightLabel}>Progress this month</Text>
                  <Text style={styles.insightValue}>฿{formatCurrency(insights.progress)}</Text>
                  {/* Sparkline chart showing daily progress */}
                  <View style={styles.chartContainer}>
                    <SparklineChart
                      data={mockProgressData}
                      width={120}
                      height={40}
                      color={COLORS.BRAND_YELLOW}
                      showGradient={true}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    height: '90%',        // fixed bottom sheet height
    maxHeight: '90%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',   // keep for rounded corners
    backgroundColor: COLORS.BACKGROUND,
    ...SHADOWS.LARGE,
  },
  modalContent: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleContainer: {
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 2,
  },
  closeButton: {
    position: 'absolute',
    top: 18,
    right: 22,
    zIndex: 10,
    padding: 8,
  },
  scrollContent: {
    flex: 1, // let the ScrollView fill the vertical space
  },
  scrollContentContainer: {
    paddingHorizontal: SPACING.LG,
    paddingTop: 0,
    paddingBottom: 48, // a bit more bottom padding so the last cards are fully visible
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: 18,
  },
  header: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 64,
  },
  accountIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.CARD_SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  accountIconTransparent: {
    backgroundColor: 'transparent',
  },
  bankLogo: {
    width: 84,
    height: 84,
  },
  accountIconText: {
    fontSize: 44,
    fontFamily: 'BebasNeue-Regular',
    color: COLORS.BRAND_YELLOW,
  },
  accountName: {
    fontSize: 22,
    fontFamily: 'Aileron-SemiBold',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 16,
  },
  balance: {
    fontSize: 52,
    fontFamily: 'BebasNeue-Regular',
    color: COLORS.BRAND_YELLOW,
    letterSpacing: 1.5,
    marginTop: 8,
    marginBottom: 16,
  },
  lastUpdated: {
    fontSize: 12,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_MUTED,
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    marginBottom: 24,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.CARD_SECONDARY,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 12,
  },
  loader: {
    marginVertical: 20,
  },
  emptyCard: {
    backgroundColor: COLORS.CARD_SECONDARY,
    borderRadius: COMPONENT_RADIUS.card,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  transactionCard: {
    backgroundColor: COLORS.CARD_SECONDARY,
    borderRadius: COMPONENT_RADIUS.card,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flex: 1,
    marginRight: 12,
  },
  transactionTitle: {
    fontSize: 15,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: 'Aileron-Bold',
  },
  insightsRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  insightCard: {
    flex: 1,
    backgroundColor: COLORS.CARD_SECONDARY,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: 20,
    minHeight: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
  },
  insightLabel: {
    fontSize: 13,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
    opacity: 0.85,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  insightValue: {
    fontSize: 24,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  insightSubtext: {
    fontSize: 12,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
  },
  chartContainer: {
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
