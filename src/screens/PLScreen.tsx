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
import { apiService } from '../services/api';
import type { PLData } from '../types';
import LogoBM from '../components/LogoBM';

// Local interfaces for modal compatibility
interface OverheadExpense {
  category: string;
  amount: number;
}

interface PropertyPersonExpense {
  property: string;
  person: string;
  amount: number;
  monthly?: number[]; // Array of 12 months (0-11)
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
  
  // Branded Alert
  const {
    isVisible: alertVisible,
    alertConfig,
    showError,
    hideAlert
  } = useBrandedAlert();
  
  // Overhead expenses modal state
  const [overheadModalVisible, setOverheadModalVisible] = useState(false);
  const [overheadPeriod, setOverheadPeriod] = useState<'month' | 'year'>('month');
  const [overheadExpenses, setOverheadExpenses] = useState<OverheadExpense[]>([]);
  const [overheadTotal, setOverheadTotal] = useState(0);
  const [loadingOverheads, setLoadingOverheads] = useState(false);

  // Property/Person expenses modal state
  const [propertyModalVisible, setPropertyModalVisible] = useState(false);
  const [propertyPeriod, setPropertyPeriod] = useState<'month' | 'year'>('month');
  const [propertyExpenses, setPropertyExpenses] = useState<PropertyPersonExpense[]>([]);
  const [propertyTotal, setPropertyTotal] = useState(0);
  const [loadingProperty, setLoadingProperty] = useState(false);

  const fetchPLData = async () => {
    try {
      const response = await apiService.getPL();
      if (response.ok && response.data?.data) {
        // Handle nested data structure: response.data.data.month/year
        setMonthData(response.data.data.month);
        setYearData(response.data.data.year);
      } else {
        console.error('P&L response not ok:', response);
        showError('Error', 'Failed to fetch P&L data: Invalid response');
      }
    } catch (error) {
      console.error('P&L fetch error:', error);
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

    const handleOverheadCardPress = async (period: 'month' | 'year') => {
    setOverheadPeriod(period);
    setOverheadModalVisible(true);
    setLoadingOverheads(true);
    
    try {
      const response = await apiService.getOverheadExpenses(period);
      if (response.ok && response.data && Array.isArray(response.data)) {
        // The API service already returns the correctly formatted data
        // No need for additional transformation - data is already in format:
        // [{ category: string, amount: number }, ...]
        setOverheadExpenses(response.data);
        const total = response.data.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
        setOverheadTotal(total);
      } else {
        // Handle case where no data is available
        console.warn('No overhead expenses data available:', response.error || 'Unknown error');
        setOverheadExpenses([]);
        setOverheadTotal(0);
        showError('Error', response.error || 'Failed to fetch overhead expenses');
      }
    } catch (error) {
      console.error('Overhead expenses fetch error:', error);
      setOverheadExpenses([]);
      setOverheadTotal(0);
      showError('Error', 'Failed to fetch overhead expenses');
    } finally {
      setLoadingOverheads(false);
    }
  };

  const handlePropertyCardPress = async (period: 'month' | 'year') => {
    setPropertyPeriod(period);
    setPropertyModalVisible(true);
    setLoadingProperty(true);
    
    try {
      const response = await apiService.getPropertyPersonExpenses(period);
      if (response.ok && response.data && Array.isArray(response.data)) {
        // The API service already returns the correctly formatted data
        // No need for additional transformation - data is already in format:
        // [{ property: string, person: string, amount: number, monthly: number[] }, ...]
        setPropertyExpenses(response.data);
        const total = response.data.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
        setPropertyTotal(total);
      } else {
        // Handle case where no data is available
        console.warn('No property/person expenses data available:', response.error || 'Unknown error');
        setPropertyExpenses([]);
        setPropertyTotal(0);
        showError('Error', response.error || 'Failed to fetch property/person expenses');
      }
    } catch (error) {
      console.error('Property/person expenses fetch error:', error);
      setPropertyExpenses([]);
      setPropertyTotal(0);
      showError('Error', 'Failed to fetch property/person expenses');
    } finally {
      setLoadingProperty(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.YELLOW} />
      </View>
    );
  }

  const KPICard = ({
    label,
    value,
    isPercentage = false,
    color = COLORS.YELLOW,
    onPress,
  }: {
    label: string;
    value: number;
    isPercentage?: boolean;
    color?: string;
    onPress?: () => void;
  }) => {
    const content = (
      <View style={styles.kpiContent}>
        <View style={styles.kpiTextContainer}>
          <Text style={styles.kpiLabel}>{label}</Text>
          <Text style={[styles.kpiValue, { color }]}>
            {isPercentage ? formatPercentage(value) : formatCurrency(value)}
          </Text>
        </View>
        {onPress && (
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color={COLORS.YELLOW}
            style={styles.kpiIcon}
          />
        )}
      </View>
    );

    if (onPress) {
      return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
          <Card glowEffect={true} elevated={true}>
            {content}
          </Card>
        </TouchableOpacity>
      );
    }

    return <Card>{content}</Card>;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.YELLOW}
            colors={[COLORS.YELLOW]}
          />
        }
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <LogoBM size={64} />
        </View>
        
        {/* Header */}
        <Text style={styles.title}>P&L Dashboard</Text>
        <Text style={styles.subtitle}>Profit & Loss Overview</Text>

        {/* Month Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Month to Date</Text>
          {monthData && (
            <View style={styles.kpiGrid}>
              <KPICard
                label="Total Revenue"
                value={monthData.revenue}
                color={COLORS.SUCCESS}
              />
              <KPICard
                label="Total Overheads"
                value={monthData.overheads}
                color={COLORS.ERROR}
                onPress={() => handleOverheadCardPress('month')}
              />
              <KPICard
                label="Property/Person Expense"
                value={monthData.propertyPersonExpense}
                color={COLORS.WARNING}
                onPress={() => handlePropertyCardPress('month')}
              />
              <KPICard
                label="Gross Operating Profit"
                value={monthData.gop}
                color={COLORS.YELLOW}
              />
              <KPICard
                label="EBITDA Margin"
                value={monthData.ebitdaMargin}
                isPercentage
                color={COLORS.INFO}
              />
            </View>
          )}
        </View>

        {/* Year Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Year to Date</Text>
          {yearData && (
            <View style={styles.kpiGrid}>
              <KPICard
                label="Total Revenue"
                value={yearData.revenue}
                color={COLORS.SUCCESS}
              />
              <KPICard
                label="Total Overheads"
                value={yearData.overheads}
                color={COLORS.ERROR}
                onPress={() => handleOverheadCardPress('year')}
              />
              <KPICard
                label="Property/Person Expense"
                value={yearData.propertyPersonExpense}
                color={COLORS.WARNING}
                onPress={() => handlePropertyCardPress('year')}
              />
              <KPICard
                label="Gross Operating Profit"
                value={yearData.gop}
                color={COLORS.YELLOW}
              />
              <KPICard
                label="EBITDA Margin"
                value={yearData.ebitdaMargin}
                isPercentage
                color={COLORS.INFO}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Overhead Expenses Modal */}
      <OverheadExpensesModal
        visible={overheadModalVisible}
        onClose={() => setOverheadModalVisible(false)}
        expenses={overheadExpenses}
        period={overheadPeriod}
        total={overheadTotal}
      />

      {/* Property/Person Expenses Modal */}
      <PropertyPersonModal
        visible={propertyModalVisible}
        onClose={() => setPropertyModalVisible(false)}
        expenses={propertyExpenses}
        period={propertyPeriod}
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Aileron-Bold',
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  kpiGrid: {
    gap: 16,
  },
  kpiCard: {
    backgroundColor: COLORS.SURFACE_1,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.YELLOW,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    ...SHADOWS.SMALL,
  },
  kpiLabel: {
    fontSize: 14,
    fontFamily: 'Aileron-Bold',
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  kpiValue: {
    fontSize: 24,
    fontFamily: 'Aileron-Bold',
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
  },
  kpiContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kpiTextContainer: {
    flex: 1,
  },
  kpiIcon: {
    marginLeft: 12,
  },
});


