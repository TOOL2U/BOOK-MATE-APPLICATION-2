import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../config/theme';
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

  // Fetch net trend data for the chart
  const { netTrendData, loading: chartLoading } = useNetTrend(selectedPeriod);

  useEffect(() => {
    if (isFocused) {
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
    return isDebit ? COLORS.ERROR : COLORS.SUCCESS;
  };

  const amount = isDebit ? transaction.debit : transaction.credit;
  const displayAmount = isDebit ? `-฿${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `+฿${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const amountColor = isDebit ? COLORS.ERROR : COLORS.SUCCESS;

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
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>BookMate</Text>
          <Text style={styles.headerSubtitle}>
            {currentAccount} • {currentPeriodLabel}
          </Text>
        </View>
      </View>

      {/* Period Selector */}
      <PeriodSelector />

      {/* KPI Summary Cards */}
      <View style={styles.kpiContainer}>
        <KPICard
          label="Net Result"
          value={summaryData.netResult}
          isPositive={summaryData.netResult >= 0}
        />
        <View style={styles.kpiRow}>
          <KPICard label="Income" value={summaryData.totalIncome} isPositive />
          <KPICard label="Expenses" value={summaryData.totalExpenses} isPositive={false} />
        </View>
      </View>

      {/* Net Result Trend Chart */}
      <View style={styles.chartSection}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Net Result Trend</Text>
          <Text style={styles.chartSubtitle}>{currentPeriodLabel}</Text>
        </View>
        <NetTrendChart data={netTrendData} height={260} />
      </View>

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
              <RecentTransactionRow key={transaction.rowNumber || index} transaction={transaction} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={48} color={COLORS.TEXT_MUTED} />
            <Text style={styles.emptyStateText}>No transactions for this period yet.</Text>
          </View>
        )}
      </View>

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
  header: {
    paddingHorizontal: SPACING.XL,
    paddingTop: SPACING.LG,
    paddingBottom: SPACING.MD,
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

  // Period Selector
  periodSelector: {
    flexDirection: 'row',
    marginHorizontal: SPACING.XL,
    marginBottom: SPACING.LG,
    backgroundColor: COLORS.CARD_SECONDARY,
    borderRadius: RADIUS.LG,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.MD,
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
    backgroundColor: COLORS.CARD_PRIMARY,
    borderRadius: RADIUS.LG,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
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
    color: COLORS.SUCCESS,
  },
  kpiValueNegative: {
    color: COLORS.ERROR,
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
    backgroundColor: COLORS.CARD_PRIMARY,
    borderRadius: RADIUS.MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
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
    fontFamily: 'Aileron-Regular',
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
    borderRadius: RADIUS.MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    padding: SPACING.LG,
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
