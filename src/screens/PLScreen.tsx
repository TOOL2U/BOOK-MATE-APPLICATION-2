/**
 * P&L Overview Dashboard (Revolut Style)
 * Clean, premium dashboard showing high-level P&L metrics, insights, and preview items
 */

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
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { apiService } from '../services/api';
import { COMPONENT_RADIUS } from '../constants/borderRadius';
import type { PLData } from '../types';
import LogoBM from '../components/LogoBM';

// Local interfaces for modal compatibility
// FIX (2025-11-09): Updated to match webapp API response format
// See: MOBILE_TEAM_OVERHEAD_EXPENSES_FIX.md
interface OverheadExpense {
  name: string;        // Category name (e.g., "Utilities - Gas", "Marketing")
  expense: number;     // Expense amount for this category
  percentage: number;  // Percentage of total overhead expenses
}

// FIX (2025-11-09): Updated to match webapp API response format
// See: MOBILE_TEAM_PROPERTY_PERSON_FIX.md
interface PropertyPersonExpense {
  name: string;        // Property name (e.g., "Alesia House", "Lanna House")
  expense: number;     // Expense amount for this property
  percentage: number;  // Percentage of total expenses
}
import { COLORS, SHADOWS } from '../config/theme';
import { Card } from '../components/ui/Card';
import OverheadExpensesModal from '../components/OverheadExpensesModal';
import PropertyPersonModal from '../components/PropertyPersonModal';
import BrandedAlert from '../components/BrandedAlert';
import { useBrandedAlert } from '../hooks/useBrandedAlert';

export default function PLScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [monthData, setMonthData] = useState<PLData | null>(null);
  const [yearData, setYearData] = useState<PLData | null>(null);
  const [period, setPeriod] = useState<'month' | 'year'>('month');
  
  // Branded Alert
  const {
    isVisible: alertVisible,
    alertConfig,
    showError,
    hideAlert
  } = useBrandedAlert();
  
  // Overhead expenses modal state
  const [overheadModalVisible, setOverheadModalVisible] = useState(false);
  const [overheadExpenses, setOverheadExpenses] = useState<OverheadExpense[]>([]);
  const [overheadTotal, setOverheadTotal] = useState(0);
  const [loadingOverheads, setLoadingOverheads] = useState(false);

  // Property/Person expenses modal state
  const [propertyModalVisible, setPropertyModalVisible] = useState(false);
  const [propertyExpenses, setPropertyExpenses] = useState<PropertyPersonExpense[]>([]);
  const [propertyTotal, setPropertyTotal] = useState(0);
  const [loadingProperty, setLoadingProperty] = useState(false);

  const fetchPLData = async () => {
    try {
      const response = await apiService.getPL();
      if (response.ok && response.data?.data) {
        setMonthData(response.data.data.month);
        setYearData(response.data.data.year);
      } else {
        showError('Error', 'Failed to fetch P&L data: Invalid response');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showError('Error', `Failed to fetch P&L data: ${errorMessage}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPLData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPLData();
  };

  const handleOverheadCardPress = async () => {
    setOverheadModalVisible(true);
    setLoadingOverheads(true);
    
    try {
      const response = await apiService.getOverheadExpenses(period);
      if (response.ok && response.data && Array.isArray(response.data)) {
        setOverheadExpenses(response.data);
        const total = response.totalExpense || response.data.reduce((sum: number, item: any) => sum + (item.expense || 0), 0);
        setOverheadTotal(total);
      } else {
        setOverheadExpenses([]);
        setOverheadTotal(0);
        showError('Error', response.error || 'Failed to fetch overhead expenses');
      }
    } catch (error) {
      setOverheadExpenses([]);
      setOverheadTotal(0);
      showError('Error', 'Failed to fetch overhead expenses');
    } finally {
      setLoadingOverheads(false);
    }
  };

  const handlePropertyCardPress = async () => {
    setPropertyModalVisible(true);
    setLoadingProperty(true);
    
    try {
      const response = await apiService.getPropertyPersonExpenses(period);
      if (response.ok && response.data && Array.isArray(response.data)) {
        setPropertyExpenses(response.data);
        const total = response.totalExpense || response.data.reduce((sum: number, item: any) => sum + (item.expense || 0), 0);
        setPropertyTotal(total);
      } else {
        setPropertyExpenses([]);
        setPropertyTotal(0);
        showError('Error', response.error || 'Failed to fetch property/person expenses');
      }
    } catch (error) {
      setPropertyExpenses([]);
      setPropertyTotal(0);
      showError('Error', 'Failed to fetch property/person expenses');
    } finally {
      setLoadingProperty(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.BRAND_YELLOW} />
      </View>
    );
  }

  const currentData = period === 'month' ? monthData : yearData;
  if (!currentData) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No data available</Text>
      </View>
    );
  }

  // GOP (Gross Operating Profit) = Revenue - Overheads
  // Property/Person expenses are tracked separately and NOT included in GOP
  const netResult = currentData.gop;
  const isPositive = netResult >= 0;

  // Get top 3 items for preview (will be fetched when modal opens)
  const getTopPreviewText = (type: 'overhead' | 'property') => {
    return `Tap to view breakdown`;
  };

  return (
    <View style={styles.container}>
      {/* Premium gradient background */}
      <LinearGradient
        colors={['#2a2a2a', '#1a1a1a', '#0d0d0d', '#050505']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.3, 0.65, 1]}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
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
            <Text style={styles.title}>Profit & Loss</Text>
            <Text style={styles.subtitle}>
              {period === 'month' ? 'This month' : 'This year'} • THB
            </Text>
          </View>
          <TouchableOpacity
            style={styles.periodSelector}
            onPress={() => setPeriod(period === 'month' ? 'year' : 'month')}
          >
            <Text style={styles.periodText}>
              {period === 'month' ? 'This month' : 'This year'}
            </Text>
            <Ionicons name="chevron-down" size={18} color={COLORS.TEXT_SECONDARY} />
          </TouchableOpacity>
        </View>

        {/* Hero Net Result Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <Text style={styles.heroLabel}>Gross Operating Profit {period === 'month' ? 'this month' : 'this year'}</Text>
          </View>
          <Text style={[styles.heroValue, { color: isPositive ? COLORS.REVENUE_GREEN : COLORS.EXPENSE_RED }]}>
            ฿{formatCurrency(Math.abs(netResult))}
          </Text>
          <Text style={styles.heroSubtext}>Revenue – Overheads</Text>
        </View>

        {/* Metric Row - 4 Small Cards */}
        <View style={styles.metricRow}>
          <View style={[styles.metricCard, styles.metricCardHalf]}>
            <Text style={styles.metricLabel}>Revenue</Text>
            <Text style={[styles.metricValue, { color: COLORS.REVENUE_GREEN }]}>
              ฿{formatCurrency(currentData.revenue)}
            </Text>
            <Text style={styles.metricPeriod}>Total income {period === 'month' ? 'this month' : 'this year'}</Text>
          </View>

          <View style={[styles.metricCard, styles.metricCardHalf]}>
            <Text style={styles.metricLabel}>Overheads</Text>
            <Text style={[styles.metricValue, { color: COLORS.EXPENSE_RED }]}>
              ฿{formatCurrency(currentData.overheads)}
            </Text>
            <Text style={styles.metricPeriod}>All operating expenses</Text>
          </View>
        </View>

        <View style={[styles.metricRow, styles.metricRowSpaced]}>
          <View style={[styles.metricCard, styles.metricCardHalf]}>
            <Text style={styles.metricLabel}>Property / Person</Text>
            <Text style={[styles.metricValue, { color: COLORS.EXPENSE_RED }]}>
              ฿{formatCurrency(currentData.propertyPersonExpense)}
            </Text>
            <Text style={styles.metricPeriod}>Property-related costs</Text>
          </View>

          <View style={[styles.metricCard, styles.metricCardHalf]}>
            <Text style={styles.metricLabel}>EBITDA</Text>
            <Text style={[styles.metricValue, { color: COLORS.BRAND_YELLOW }]}>
              {formatPercentage(currentData.ebitdaMargin)}
            </Text>
            <Text style={styles.metricPeriod}>Earnings before depreciation</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Insights Pair */}
        <View style={styles.insightsRow}>
          <View style={[styles.insightCard, { marginRight: 6 }]}>
            <Text style={styles.insightLabel}>Earned {period === 'month' ? 'this month' : 'this year'}</Text>
            <Text style={styles.insightValue}>฿{formatCurrency(currentData.revenue)}</Text>
            <Text style={styles.insightSubtext}>
              {period === 'month' 
                ? `All time: ฿${formatCurrency(yearData?.revenue || 0)}`
                : `GOP: ฿${formatCurrency(currentData.gop)}`
              }
            </Text>
          </View>

          <View style={[styles.insightCard, { marginLeft: 6 }]}>
            <Text style={styles.insightLabel}>Progress {period === 'month' ? 'this month' : 'this year'}</Text>
            <Text style={styles.insightValue}>฿{formatCurrency(currentData.gop)}</Text>
            <Text style={styles.insightSubtext}>
              EBITDA: {formatPercentage(currentData.ebitdaMargin)}
            </Text>
          </View>
        </View>

        {/* Overheads Summary Card */}
        <TouchableOpacity
          style={styles.summaryCard}
          onPress={handleOverheadCardPress}
          activeOpacity={0.7}
        >
          <View style={styles.summaryHeader}>
            <View>
              <Text style={styles.summaryLabel}>Overheads ({period === 'month' ? 'this month' : 'this year'})</Text>
              <Text style={[styles.summaryValue, { color: COLORS.EXPENSE_RED }]}>
                ฿{formatCurrency(currentData.overheads)}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.TEXT_SECONDARY} />
          </View>
          <View style={styles.summaryPreview}>
            <Text style={styles.summaryPreviewText}>{getTopPreviewText('overhead')}</Text>
          </View>
          <View style={styles.summaryFooter}>
            <Text style={styles.summaryLink}>View full breakdown</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.BRAND_YELLOW} />
          </View>
        </TouchableOpacity>

        {/* Property / Person Summary Card */}
        <TouchableOpacity
          style={styles.summaryCard}
          onPress={handlePropertyCardPress}
          activeOpacity={0.7}
        >
          <View style={styles.summaryHeader}>
            <View>
              <Text style={styles.summaryLabel}>Property / Person ({period === 'month' ? 'this month' : 'this year'})</Text>
              <Text style={[styles.summaryValue, { color: COLORS.EXPENSE_RED }]}>
                ฿{formatCurrency(currentData.propertyPersonExpense)}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.TEXT_SECONDARY} />
          </View>
          <View style={styles.summaryPreview}>
            <Text style={styles.summaryPreviewText}>{getTopPreviewText('property')}</Text>
          </View>
          <View style={styles.summaryFooter}>
            <Text style={styles.summaryLink}>View full breakdown</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.BRAND_YELLOW} />
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Overhead Expenses Modal */}
      <OverheadExpensesModal
        visible={overheadModalVisible}
        onClose={() => setOverheadModalVisible(false)}
        expenses={overheadExpenses}
        period={period}
        total={overheadTotal}
      />

      {/* Property/Person Expenses Modal */}
      <PropertyPersonModal
        visible={propertyModalVisible}
        onClose={() => setPropertyModalVisible(false)}
        expenses={propertyExpenses}
        period={period}
        total={propertyTotal}
      />

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
    backgroundColor: COLORS.BACKGROUND,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    marginTop: 0,
  },
  title: {
    fontSize: 28,
    fontFamily: 'BebasNeue-Regular',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 1,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CARD_SECONDARY,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 6,
  },
  periodText: {
    fontSize: 13,
    fontFamily: 'Aileron-SemiBold',
    color: COLORS.TEXT_PRIMARY,
  },
  heroCard: {
    backgroundColor: COLORS.CARD_SECONDARY,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: 24,
    marginBottom: 16,
    ...SHADOWS.LARGE,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroLabel: {
    fontSize: 14,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroValue: {
    fontSize: 48,
    fontFamily: 'BebasNeue-Regular',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  heroSubtext: {
    fontSize: 13,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_MUTED,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  metricRowSpaced: {
    marginTop: 4,
  },
  metricCard: {
    backgroundColor: COLORS.CARD_SECONDARY,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: 16,
    ...SHADOWS.SMALL,
  },
  metricCardHalf: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 11,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 22,
    fontFamily: 'Aileron-Bold',
    marginBottom: 6,
  },
  metricPeriod: {
    fontSize: 10,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 16,
  },
  insightsRow: {
    flexDirection: 'row',
    marginTop: 4,
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
    ...SHADOWS.SMALL,
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
  summaryCard: {
    backgroundColor: COLORS.CARD_SECONDARY,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: 18,
    marginBottom: 16,
    ...SHADOWS.SMALL,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 26,
    fontFamily: 'Aileron-Bold',
  },
  summaryPreview: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    marginBottom: 14,
  },
  summaryPreviewText: {
    fontSize: 13,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  summaryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  summaryLink: {
    fontSize: 13,
    fontFamily: 'Aileron-SemiBold',
    color: COLORS.BRAND_YELLOW,
  },
});


