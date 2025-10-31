import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { apiService } from '../services/api';
import type { PLData } from '../types';

export default function PLScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [monthData, setMonthData] = useState<PLData | null>(null);
  const [yearData, setYearData] = useState<PLData | null>(null);

  const fetchPLData = async () => {
    try {
      const response = await apiService.getPL();
      if (response.ok) {
        setMonthData(response.data.month);
        setYearData(response.data.year);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch P&L data');
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
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  const KPICard = ({
    label,
    value,
    isPercentage = false,
    color = '#3B82F6',
  }: {
    label: string;
    value: number;
    isPercentage?: boolean;
    color?: string;
  }) => (
    <View style={[styles.kpiCard, { borderLeftColor: color }]}>
      <Text style={styles.kpiLabel}>{label}</Text>
      <Text style={[styles.kpiValue, { color }]}>
        {isPercentage ? formatPercentage(value) : formatCurrency(value)}
      </Text>
    </View>
  );

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
        <Text style={styles.title}>P&L Dashboard</Text>
        <Text style={styles.subtitle}>Profit & Loss Overview</Text>

        {/* Month Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Month</Text>
          {monthData && (
            <View style={styles.kpiGrid}>
              <KPICard
                label="Revenue"
                value={monthData.revenue}
                color="#10B981"
              />
              <KPICard
                label="Overheads"
                value={monthData.overheads}
                color="#EF4444"
              />
              <KPICard
                label="Property Expenses"
                value={monthData.propertyPersonExpense}
                color="#F59E0B"
              />
              <KPICard
                label="GOP"
                value={monthData.gop}
                color="#3B82F6"
              />
              <KPICard
                label="EBITDA Margin"
                value={monthData.ebitdaMargin}
                isPercentage
                color="#8B5CF6"
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
                label="Revenue"
                value={yearData.revenue}
                color="#10B981"
              />
              <KPICard
                label="Overheads"
                value={yearData.overheads}
                color="#EF4444"
              />
              <KPICard
                label="Property Expenses"
                value={yearData.propertyPersonExpense}
                color="#F59E0B"
              />
              <KPICard
                label="GOP"
                value={yearData.gop}
                color="#3B82F6"
              />
              <KPICard
                label="EBITDA Margin"
                value={yearData.ebitdaMargin}
                isPercentage
                color="#8B5CF6"
              />
            </View>
          )}
        </View>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F1F5F9',
    marginBottom: 16,
  },
  kpiGrid: {
    gap: 12,
  },
  kpiCard: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  kpiLabel: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

