import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../config/theme';
import CategoryDetailModal from './CategoryDetailModal';

// FIX (2025-11-09): Updated to match webapp API response format
// See: MOBILE_TEAM_OVERHEAD_EXPENSES_FIX.md
interface OverheadExpense {
  name: string;        // Category name (e.g., "Utilities - Gas", "Marketing")
  expense: number;     // Expense amount for this category
  percentage: number;  // Percentage of total overhead expenses
}

interface OverheadExpensesModalProps {
  visible: boolean;
  onClose: () => void;
  expenses: OverheadExpense[];
  total: number;
  period: 'month' | 'year';
}

export default function OverheadExpensesModal({
  visible,
  onClose,
  expenses,
  total,
  period,
}: OverheadExpensesModalProps) {
  const [categoryDetailVisible, setCategoryDetailVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(amount);
  };

  // FIX (2025-11-09): Simplified - API now handles period filtering
  // No need for month picker or manual calculations
  const displayedExpenses = expenses.filter(e => e.expense > 0);

  const handleCategoryPress = (categoryName: string) => {
    setSelectedCategory(categoryName);
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
            {period === 'month' ? 'Monthly' : 'Yearly'} Overhead Expenses
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {displayedExpenses.map((expense, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.expenseItem}
              onPress={() => handleCategoryPress(expense.name)}
              activeOpacity={0.7}
            >
              <Text style={styles.expenseCategory}>{expense.name}</Text>
              <View style={styles.expenseRight}>
                <Text style={styles.expenseAmount}>{formatCurrency(expense.expense)}</Text>
                <Text style={styles.expensePercentage}>{expense.percentage.toFixed(1)}%</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.totalLabel}>Total Overhead</Text>
          <Text style={styles.totalAmount}>{formatCurrency(total)}</Text>
        </View>
      </View>

      {/* Category Detail Modal */}
      <CategoryDetailModal
        visible={categoryDetailVisible}
        onClose={() => setCategoryDetailVisible(false)}
        categoryName={selectedCategory}
        period={period}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.GREY_PRIMARY,
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
  expenseCategory: {
    fontSize: 16,
    fontFamily: 'Aileron-Regular',
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
  expensePercentage: {
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
    backgroundColor: COLORS.SURFACE_1,
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
