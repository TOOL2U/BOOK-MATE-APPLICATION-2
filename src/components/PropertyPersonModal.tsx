import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../config/theme';

interface PropertyPersonExpense {
  property: string;
  person: string;
  amount: number;
  monthly?: number[]; // Array of 12 months (0-11)
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
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(amount);
  };

  const getDisplayedExpenses = () => {
    if (period === 'year') {
      return expenses;
    }
    
    // For monthly period, use direct month index mapping (0-11 for Jan-Dec)
    const monthlyExpenses = expenses.map(expense => {
      // Ensure monthly array exists and has valid data
      if (!expense.monthly || !Array.isArray(expense.monthly) || expense.monthly.length < 12) {
        console.warn(`Invalid monthly data for property/person expense: ${expense.property} - ${expense.person}`);
        return {
          property: expense.property,
          person: expense.person,
          amount: 0
        };
      }
      
      const monthlyAmount = expense.monthly[selectedMonth] || 0;
      
      return {
        property: expense.property,
        person: expense.person,
        amount: monthlyAmount
      };
    }).filter(expense => expense.amount > 0);
    
    return monthlyExpenses;
  };

  const getDisplayedTotal = () => {
    if (period === 'year') {
      return total;
    }
    
    const displayedExpenses = getDisplayedExpenses();
    return displayedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const displayedExpenses = getDisplayedExpenses();
  const displayedTotal = getDisplayedTotal();

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
            {period === 'month' ? 'Monthly' : 'Yearly'} Property Person Expenses
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Month Picker - Only show for monthly view */}
        {period === 'month' && (
          <View style={styles.monthPickerContainer}>
            <Text style={styles.monthPickerLabel}>
              Select Month: {MONTH_NAMES[selectedMonth]}
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.monthPicker}
              contentContainerStyle={styles.monthPickerContent}
            >
              {MONTH_NAMES.map((month, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.monthButton,
                    selectedMonth === index && styles.monthButtonActive
                  ]}
                  onPress={() => setSelectedMonth(index)}
                >
                  <Text style={[
                    styles.monthButtonText,
                    selectedMonth === index && styles.monthButtonTextActive
                  ]}>
                    {MONTH_ABBREV[index]}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <ScrollView style={styles.content}>
          {displayedExpenses.map((expense, index) => (
            <View key={index} style={styles.expenseItem}>
              <View style={styles.expenseInfo}>
                <Text style={styles.property}>{expense.property}</Text>
                <Text style={styles.person}>{expense.person}</Text>
              </View>
              <Text style={styles.expenseAmount}>{formatCurrency(expense.amount)}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.totalLabel}>Total Property Person</Text>
          <Text style={styles.totalAmount}>{formatCurrency(displayedTotal)}</Text>
        </View>
      </View>
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
    backgroundColor: COLORS.SURFACE_1,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  monthButtonActive: {
    backgroundColor: COLORS.YELLOW,
    borderColor: COLORS.YELLOW,
  },
  monthButtonText: {
    fontSize: 14,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_PRIMARY,
  },
  monthButtonTextActive: {
    color: COLORS.BLACK,
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
  expenseInfo: {
    flex: 1,
  },
  property: {
    fontSize: 16,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
  },
  person: {
    fontSize: 14,
    fontFamily: 'Aileron-Light',
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  expenseAmount: {
    fontSize: 16,
    fontFamily: 'Aileron-Bold',
    color: COLORS.YELLOW,
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
