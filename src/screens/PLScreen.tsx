import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../services/api';
import type { PLData, OverheadExpense, PropertyPersonExpense } from '../types';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../config/theme';
import { Card } from '../components/ui/Card';
import { SectionHeader } from '../components/ui/SectionHeader';
import OverheadExpensesModal from '../components/OverheadExpensesModal';
import PropertyPersonModal from '../components/PropertyPersonModal';

export default function PLScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [monthData, setMonthData] = useState<PLData | null>(null);
  const [yearData, setYearData] = useState<PLData | null>(null);
  
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
        Alert.alert('Error', 'Failed to fetch P&L data: Invalid response');
      }
    } catch (error) {
      console.error('P&L fetch error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', `Failed to fetch P&L data: ${errorMessage}`);
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
      if (response.ok && response.data) {
        // Use the P&L data directly since overhead expenses are just returning P&L data
        const plData = period === 'month' ? monthData : yearData;
        setOverheadExpenses([]); // No detailed breakdown available yet
        setOverheadTotal(plData?.overheads || 0);
      } else {
        Alert.alert('Error', 'Failed to fetch overhead expenses');
      }
    } catch (error) {
      console.error('Overhead expenses fetch error:', error);
      Alert.alert('Error', 'Failed to fetch overhead expenses');
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
      if (response.ok && response.data) {
        // Use the P&L data directly since property expenses are just returning P&L data
        const plData = period === 'month' ? monthData : yearData;
        setPropertyExpenses([]); // No detailed breakdown available yet
        setPropertyTotal(plData?.propertyPersonExpense || 0);
      } else {
        Alert.alert('Error', 'Failed to fetch property/person expenses');
      }
    } catch (error) {
      console.error('Property/person expenses fetch error:', error);
      Alert.alert('Error', 'Failed to fetch property/person expenses');
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
        <SectionHeader title="P&L DASHBOARD" subtitle="Profit & Loss Overview" />

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
        totalExpense={overheadTotal}
        loading={loadingOverheads}
      />

      {/* Property/Person Expenses Modal */}
      <PropertyPersonModal
        visible={propertyModalVisible}
        onClose={() => setPropertyModalVisible(false)}
        expenses={propertyExpenses}
        period={propertyPeriod}
        totalExpense={propertyTotal}
        loading={loadingProperty}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: COLORS.BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: SPACING.LG,
  },
  title: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 24,
    fontWeight: '400',
    lineHeight: 32,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  subtitle: {
    fontFamily: 'Aileron-Light',
    fontSize: 16,
    fontWeight: '300',
    lineHeight: 24,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XXL,
  },
  section: {
    marginBottom: SPACING.XXL + SPACING.SM,
  },
  sectionTitle: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.LG,
  },
  kpiGrid: {
    gap: SPACING.MD,
  },
  kpiCard: {
    backgroundColor: COLORS.SURFACE_1,
    padding: SPACING.LG,
    borderRadius: RADIUS.LG,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.YELLOW,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    ...SHADOWS.SMALL,
  },
  kpiLabel: {
    fontFamily: 'Aileron-Regular',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
    letterSpacing: 0.2,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.SM,
  },
  kpiValue: {
    fontFamily: 'Aileron-Bold',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    letterSpacing: 0.2,
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
    marginLeft: SPACING.MD,
  },
});


