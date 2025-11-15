import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../config/theme';
import CategoryDetailModal from './CategoryDetailModal';

// FIX (2025-11-09): Updated to match webapp API response format
// See: MOBILE_TEAM_PROPERTY_PERSON_FIX.md
interface PropertyPersonExpense {
  name: string;        // Property name (e.g., "Alesia House", "Lanna House")
  expense: number;     // Expense amount for this property
  percentage: number;  // Percentage of total expenses
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_ABBREV = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

interface PropertyPersonModalProps {
  visible: boolean;
  onClose: () => void;
  expenses: PropertyPersonExpense[];
  total: number;
  period: 'month' | 'year';
}

export default function PropertyPersonModal({
  visible,
  onClose,
  expenses,
  total,
  period,
}: PropertyPersonModalProps) {
  const [categoryDetailVisible, setCategoryDetailVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<string>('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(amount);
  };

  // FIX (2025-11-09): Simplified - API now returns pre-calculated data
  // No need for month selection or manual calculations
  const displayedExpenses = expenses.filter(e => e.expense > 0);
  const displayedTotal = total;

  const handlePropertyPress = (propertyName: string) => {
    setSelectedProperty(propertyName);
    setCategoryDetailVisible(true);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {period === 'month' ? 'Monthly' : 'Yearly'} Property/Person Expenses
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* FIX (2025-11-09): Removed month picker - API handles period filtering */}

        <ScrollView style={styles.content}>
          {displayedExpenses.map((expense, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.expenseItem}
              onPress={() => handlePropertyPress(expense.name)}
              activeOpacity={0.7}
            >
              <Text style={styles.property}>{expense.name}</Text>
              <View style={styles.expenseRight}>
                <Text style={styles.expenseAmount}>{formatCurrency(expense.expense)}</Text>
                <Text style={styles.percentage}>{expense.percentage.toFixed(1)}%</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.totalLabel}>Total Property Person</Text>
          <Text style={styles.totalAmount}>{formatCurrency(displayedTotal)}</Text>
        </View>
      </View>

      {/* Category Detail Modal */}
      <CategoryDetailModal
        visible={categoryDetailVisible}
        onClose={() => setCategoryDetailVisible(false)}
        categoryName={selectedProperty}
        period={period}
        filterType="property"
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  title: {
    fontSize: 20,
    fontFamily: 'BebasNeue-Regular',
    color: COLORS.TEXT_PRIMARY,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: COLORS.TEXT_SECONDARY,
  },
  monthPickerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  monthPickerLabel: {
    fontSize: 14,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  monthPicker: {
    flexGrow: 0,
  },
  monthPickerContent: {
    paddingRight: 20,
  },
  monthButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: COLORS.CARD_PRIMARY,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  monthButtonActive: {
    backgroundColor: COLORS.YELLOW,
    borderColor: COLORS.BRAND_YELLOW,
  },
  monthButtonText: {
    fontSize: 14,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_PRIMARY,
  },
  monthButtonTextActive: {
    color: COLORS.BRAND_BLACK,
    fontFamily: 'Aileron-Bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  property: {
    fontSize: 16,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  expenseRight: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 16,
    fontFamily: 'Aileron-Bold',
    color: COLORS.YELLOW,
  },
  percentage: {
    fontSize: 14,
    fontFamily: 'Aileron-Light',
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    backgroundColor: COLORS.CARD_PRIMARY,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
  },
  totalAmount: {
    fontSize: 20,
    fontFamily: 'BebasNeue-Regular',
    color: COLORS.YELLOW,
  },
});
