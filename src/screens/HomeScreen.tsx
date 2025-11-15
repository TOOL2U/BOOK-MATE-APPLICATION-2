import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../config/theme';
import { COMPONENT_RADIUS } from '../constants/borderRadius';
import { apiService } from '../services/api';
import { TransactionWithRow } from '../types';
import NetTrendChart from '../components/NetTrendChart';
import { useNetTrend } from '../hooks/useNetTrend';

type Period = 'this_month' | 'last_month' | 'this_year';

interface SummaryData {
  netResult: number;
  totalIncome: number;
  totalExpenses: number;
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('this_month');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summaryData, setSummaryData] = useState<SummaryData>({
    netResult: 0,
    totalIncome: 0,
    totalExpenses: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<TransactionWithRow[]>([]);
  const [currentAccount, setCurrentAccount] = useState('Sia Moon');
  const [currentPeriodLabel, setCurrentPeriodLabel] = useState('');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Fetch net trend data for the chart
  const { netTrendData, loading: chartLoading } = useNetTrend(selectedPeriod);

  // Calculate month progress
  const getMonthProgress = (): number => {
    if (selectedPeriod !== 'this_month') return 0;
    const now = new Date();
    const currentDay = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return (currentDay / daysInMonth) * 100;
  };

  useEffect(() => {
    if (isFocused) {
      // Animate values when period changes
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 150,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 150,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ]).start();
      
      fetchDashboardData();
    }
  }, [isFocused, selectedPeriod]);

  const getPeriodDates = (period: Period) => {
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-11
    const currentYear = now.getFullYear();

    switch (period) {
      case 'this_month': {
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        return {
          month: monthNames[currentMonth],
          year: currentYear.toString(),
          label: `${monthNames[currentMonth]} ${currentYear}`,
          isYear: false,
        };
      }
      case 'last_month': {
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        return {
          month: monthNames[lastMonth],
          year: lastMonthYear.toString(),
          label: `${monthNames[lastMonth]} ${lastMonthYear}`,
          isYear: false,
        };
      }
      case 'this_year': {
        return {
          month: 'ALL',
          year: currentYear.toString(),
          label: `${currentYear}`,
          isYear: true,
        };
      }
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const periodDates = getPeriodDates(selectedPeriod);
      setCurrentPeriodLabel(periodDates.label);

      // Fetch P&L summary for the selected period
      try {
        const plResponse = await apiService.getPnL(periodDates.month);

        if (plResponse.ok && plResponse.data) {
          // Use year data if period is 'this_year', otherwise use month data
          const plData = periodDates.isYear ? plResponse.data.year : plResponse.data.month;
          
          const income = plData.revenue || 0;
          // Overhead and property/person expenses are the same value, use from P&L data
          const expenses = plData.overheads || 0;
          
          setSummaryData({
            netResult: plData.gop || (income - expenses),
            totalIncome: income,
            totalExpenses: expenses,
          });
        }
      } catch (plError) {
        console.log('P&L data not available yet:', plError);
        // Keep default zero values
      }

      // Fetch recent transactions
      try {
        const inboxResponse = await apiService.getInbox();

        if (inboxResponse.ok && inboxResponse.data) {
          // Inbox already returns sorted by rowNumber descending (newest first)
          // Just take the first 5
          const recentFive = inboxResponse.data.slice(0, 5);
          setRecentTransactions(recentFive);
        }
      } catch (txError) {
        console.log('Transactions data not available yet:', txError);
        // Keep empty transactions array
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getMonthNumber = (monthAbbr: string): string => {
    const months: { [key: string]: string } = {
      JAN: '01', FEB: '02', MAR: '03', APR: '04',
      MAY: '05', JUN: '06', JUL: '07', AUG: '08',
      SEP: '09', OCT: '10', NOV: '11', DEC: '12',
    };
    return months[monthAbbr] || '01';
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  const formatDate = (day: string, month: string, year: string): string => {
    return `${day} ${month} ${year}`;
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const PeriodSelector = () => (
    <View style={styles.periodSelector}>
      <TouchableOpacity
        style={[
          styles.periodButton,
          selectedPeriod === 'this_month' && styles.periodButtonActive,
        ]}
        onPress={() => setSelectedPeriod('this_month')}
      >
        <Text
          style={[
            styles.periodButtonText,
            selectedPeriod === 'this_month' && styles.periodButtonTextActive,
          ]}
        >
          This Month
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.periodButton,
          selectedPeriod === 'last_month' && styles.periodButtonActive,
        ]}
        onPress={() => setSelectedPeriod('last_month')}
      >
        <Text
          style={[
            styles.periodButtonText,
            selectedPeriod === 'last_month' && styles.periodButtonTextActive,
          ]}
        >
          Last Month
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.periodButton,
          selectedPeriod === 'this_year' && styles.periodButtonActive,
        ]}
        onPress={() => setSelectedPeriod('this_year')}
      >
        <Text
          style={[
            styles.periodButtonText,
            selectedPeriod === 'this_year' && styles.periodButtonTextActive,
          ]}
        >
          This Year
        </Text>
      </TouchableOpacity>
    </View>
  );

  const KPICard = ({ label, value, isPositive, isNeutral }: { 
    label: string; 
    value: number; 
    isPositive?: boolean;
    isNeutral?: boolean;
  }) => (
    <View style={styles.kpiCard}>
      <Text style={styles.kpiLabel}>{label}</Text>
      <Text
        style={[
          styles.kpiValue,
          isPositive && styles.kpiValuePositive,
          !isPositive && !isNeutral && styles.kpiValueNegative,
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {label === 'Expenses' ? '-' : (value >= 0 ? '+' : '-')}฿{formatCurrency(value)}
      </Text>
    </View>
  );

// Helper function to format transaction row
const RecentTransactionRow: React.FC<{ transaction: TransactionWithRow }> = ({ transaction }) => {
  const isDebit = transaction.debit > 0;
  
  const getTransactionIcon = () => {
    // Use specific icons based on transaction type
    if (isDebit) {
      return 'remove-circle-outline'; // Expense icon
    } else {
      return 'add-circle-outline'; // Income icon
    }
  };

  const getIconBackgroundColor = () => {
    return isDebit ? 'rgba(244, 67, 54, 0.1)' : 'rgba(0, 255, 136, 0.1)';
  };

  const getIconColor = () => {
    return isDebit ? COLORS.EXPENSE_RED : COLORS.REVENUE_GREEN;
  };

  const amount = isDebit ? transaction.debit : transaction.credit;
  const displayAmount = isDebit ? `-฿${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `+฿${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const amountColor = isDebit ? COLORS.EXPENSE_RED : COLORS.REVENUE_GREEN;

  // Format date from day/month/year
  const formatDate = () => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].indexOf(transaction.month);
    const monthName = monthIndex !== -1 ? monthNames[monthIndex] : transaction.month;
    return `${monthName} ${transaction.day}, ${transaction.year}`;
  };

  return (
    <View style={styles.transactionRow}>
      <View style={[styles.transactionIcon, { backgroundColor: getIconBackgroundColor() }]}>
        <Ionicons name={getTransactionIcon()} size={20} color={getIconColor()} />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionDetail} numberOfLines={1}>{transaction.detail || 'Transaction'}</Text>
        <Text style={styles.transactionDate}>
          {formatDate()}
        </Text>
      </View>
      <Text style={[styles.transactionAmount, { color: amountColor }]} numberOfLines={1}>{displayAmount}</Text>
    </View>
  );
};  const QuickLinkCard = ({ 
    icon, 
    title, 
    onPress 
  }: { 
    icon: string; 
    title: string; 
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.quickLinkCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.quickLinkLeft}>
        <Ionicons name={icon as any} size={20} color={COLORS.BRAND_YELLOW} />
        <Text style={styles.quickLinkText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.TEXT_SECONDARY} />
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.BRAND_YELLOW} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.BRAND_YELLOW}
          colors={[COLORS.BRAND_YELLOW]}
        />
      }
    >
      {/* Header with Gradient Overlay */}
      <View style={styles.headerWrapper}>
        <LinearGradient
          colors={['rgba(255,255,255,0.06)', 'rgba(0,0,0,0)']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>DASHBOARD</Text>
            <Text style={styles.headerSubtitle}>
              {currentAccount} • {currentPeriodLabel}
            </Text>
            <Text style={styles.headerSummary}>
              You earned ฿{formatCurrency(summaryData.totalIncome)} and spent ฿{formatCurrency(summaryData.totalExpenses)} this {selectedPeriod === 'this_year' ? 'year' : 'month'}
            </Text>
          </View>
        </View>

        {/* Month Progress Bar */}
        {selectedPeriod === 'this_month' && (
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${getMonthProgress()}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {Math.round(getMonthProgress())}% of month complete
            </Text>
          </View>
        )}

        {/* Period Selector */}
        <PeriodSelector />
      </View>

      {/* KPI Summary Cards with Animation */}
      <Animated.View style={[styles.kpiContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <KPICard
          label="Net Result"
          value={summaryData.netResult}
          isPositive={summaryData.netResult >= 0}
        />
        <View style={styles.kpiRow}>
          <KPICard label="Income" value={summaryData.totalIncome} isPositive />
          <KPICard label="Expenses" value={summaryData.totalExpenses} isPositive={false} />
        </View>
      </Animated.View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Net Result Trend Chart with Animation */}
      <Animated.View style={[styles.chartSection, { opacity: fadeAnim }]}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Net Result Trend</Text>
          <Text style={styles.chartSubtitle}>{currentPeriodLabel}</Text>
        </View>
        <NetTrendChart data={netTrendData} height={260} />
      </Animated.View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Recent Activity */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Activity' as never)}
            style={styles.viewAllButton}
          >
            <Text style={styles.viewAllText}>View all</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.BRAND_YELLOW} />
          </TouchableOpacity>
        </View>

        {recentTransactions.length > 0 ? (
          <View style={styles.transactionsList}>
            {recentTransactions.map((transaction, index) => (
              <RecentTransactionRow 
                key={transaction.rowNumber || index} 
                transaction={transaction}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={48} color={COLORS.TEXT_MUTED} />
            <Text style={styles.emptyStateText}>No transactions for this period yet.</Text>
          </View>
        )}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Quick Links */}
      <View style={styles.quickLinksSection}>
        <QuickLinkCard
          icon="wallet-outline"
          title="View Full Balance"
          onPress={() => navigation.navigate('Balance' as never)}
        />
        <QuickLinkCard
          icon="stats-chart"
          title="Open P&L Report"
          onPress={() => navigation.navigate('P&L' as never)}
        />
      </View>

      {/* Bottom padding for FAB */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  contentContainer: {
    paddingBottom: SPACING.XL,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.LG,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'Aileron-Regular',
    fontSize: 14,
  },

  // Header
  headerWrapper: {
    position: 'relative',
    marginTop: 0,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    pointerEvents: 'none',
  },
  header: {
    paddingHorizontal: SPACING.XL,
    paddingTop: SPACING.LG,
    paddingBottom: SPACING.MD,
    zIndex: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'BebasNeue-Regular',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 1.5,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  headerSummary: {
    fontSize: 12,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
    marginTop: 6,
    opacity: 0.8,
  },

  // Month Progress Bar
  progressBarContainer: {
    paddingHorizontal: SPACING.XL,
    marginTop: SPACING.SM,
    marginBottom: SPACING.XS,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.BRAND_YELLOW,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_MUTED,
    marginTop: 4,
    textAlign: 'right',
  },

  // Period Selector
  periodSelector: {
    flexDirection: 'row',
    marginHorizontal: SPACING.XL,
    marginBottom: SPACING.LG,
    backgroundColor: COLORS.CARD_SECONDARY,
    borderRadius: COMPONENT_RADIUS.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: COMPONENT_RADIUS.card - 2,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: COLORS.BRAND_YELLOW,
  },
  periodButtonText: {
    fontSize: 13,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_SECONDARY,
  },
  periodButtonTextActive: {
    color: COLORS.BRAND_BLACK,
  },

  // KPI Cards
  kpiContainer: {
    paddingHorizontal: SPACING.XL,
    marginBottom: SPACING.LG,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: SPACING.MD,
    marginTop: SPACING.MD,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: COLORS.CARD_SECONDARY,
    borderRadius: COMPONENT_RADIUS.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: SPACING.MD,
    ...SHADOWS.SMALL,
  },
  kpiLabel: {
    fontSize: 12,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 6,
  },
  kpiValue: {
    fontSize: 20,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
  },
  kpiValuePositive: {
    color: COLORS.REVENUE_GREEN,
  },
  kpiValueNegative: {
    color: COLORS.EXPENSE_RED,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: SPACING.MD,
    marginHorizontal: SPACING.XL,
  },

  // Chart Placeholder
  chartSection: {
    marginHorizontal: SPACING.XL,
    marginBottom: SPACING.XL,
  },
  chartHeader: {
    marginBottom: SPACING.MD,
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 12,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
  },

  // Sections
  section: {
    marginBottom: SPACING.XL,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.XL,
    marginBottom: SPACING.MD,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Aileron-Regular',
    color: COLORS.BRAND_YELLOW,
  },

  // Transactions
  transactionsList: {
    paddingHorizontal: SPACING.XL,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.CARD_SECONDARY,
    borderRadius: COMPONENT_RADIUS.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: SPACING.MD,
    marginBottom: SPACING.SM,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.MD,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.MD,
  },
  transactionIconIncome: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  transactionIconExpense: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  transactionDetails: {
    flex: 1,
    marginRight: SPACING.SM,
  },
  transactionDetail: {
    fontSize: 13,
    fontFamily: 'Aileron-SemiBold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
  },
  transactionAmount: {
    fontSize: 14,
    fontFamily: 'Aileron-Bold',
    flexShrink: 0,
  },
  transactionAmountIncome: {
    color: COLORS.SUCCESS,
  },
  transactionAmountExpense: {
    color: COLORS.ERROR,
  },

  // Empty State
  emptyState: {
    paddingHorizontal: SPACING.XL,
    paddingVertical: SPACING.XXL,
    alignItems: 'center',
  },
  emptyStateText: {
    marginTop: SPACING.MD,
    fontSize: 14,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
  },

  // Quick Links
  quickLinksSection: {
    paddingHorizontal: SPACING.XL,
    gap: SPACING.MD,
  },
  quickLinkCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.CARD_SECONDARY,
    borderRadius: COMPONENT_RADIUS.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: SPACING.LG,
    ...SHADOWS.SMALL,
  },
  quickLinkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.MD,
  },
  quickLinkText: {
    fontSize: 15,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
  },
});
