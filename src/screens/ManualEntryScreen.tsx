import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { apiService } from '../services/api';
import { COLORS, SHADOWS } from '../config/theme';
import type { Transaction } from '../types';
import CustomPicker from '../components/CustomPicker';
import SearchableDropdown from '../components/SearchableDropdown';
import BrandedAlert from '../components/BrandedAlert';
import { useBrandedAlert } from '../hooks/useBrandedAlert';
import LogoBM from '../components/LogoBM';

export default function ManualEntryScreen() {
  const isFocused = useIsFocused(); // Track if screen is focused
  const scrollViewRef = useRef<ScrollView>(null); // Ref for ScrollView
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(true);
  
  // Branded alert hook
  const {
    alertConfig,
    isVisible: alertVisible,
    hideAlert,
    showSuccess,
    showError,
  } = useBrandedAlert();
  
  // Dynamic dropdown options from API
  const [properties, setProperties] = useState<string[]>([]);
  const [typeOfOperations, setTypeOfOperations] = useState<string[]>([]);
  const [typeOfPayments, setTypeOfPayments] = useState<string[]>([]);
  const [months, setMonths] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<Transaction>({
    day: new Date().getDate().toString(),
    month: '',
    year: new Date().getFullYear().toString(),
    property: '',
    typeOfOperation: '',
    typeOfPayment: '',
    detail: '',
    ref: '',
    debit: 0,
    credit: 0,
  });

  // Fetch dropdown options from API
  const fetchDropdownOptions = async () => {
    try {
      setOptionsLoading(true);
      const response = await apiService.getOptions();
      
      if (response.data) {
        setProperties(response.data.properties || []);
        setMonths(response.data.months || ['ALL', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']);
        
        // Handle case where API returns rich objects with {name, monthly, yearTotal}
        const operations = response.data.typeOfOperations || [];
        const operationNames = operations.map((op: any) => 
          typeof op === 'string' ? op : op.name
        );
        setTypeOfOperations(operationNames);
        
        setTypeOfPayments(response.data.typeOfPayment || []); // Note: API returns 'typeOfPayment' (singular)
        
        // Get current month abbreviation (NOV for November)
        const currentMonthIndex = new Date().getMonth(); // 0-11
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const currentMonth = monthNames[currentMonthIndex];
        
        // Set default values once options are loaded
        setFormData(prev => ({
          ...prev,
          property: response.data.properties?.[0] || '',
          typeOfPayment: '', // Keep empty to show placeholder
          month: currentMonth, // Set current month (NOV)
        }));
      }
    } catch (error) {
      showError('Error', 'Failed to load dropdown options');
    } finally {
      setOptionsLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  // Auto-refresh dropdown options when screen comes into focus
  useEffect(() => {
    if (isFocused) {
      fetchDropdownOptions();
    }
  }, [isFocused]);

  const handleSubmit = async () => {
    // Comprehensive validation
    if (!formData.day || formData.day.trim() === '') {
      showError('Validation Error', 'Please enter a day');
      return;
    }

    if (!formData.month || formData.month.trim() === '') {
      showError('Validation Error', 'Please select a month');
      return;
    }

    if (!formData.year || formData.year.trim() === '') {
      showError('Validation Error', 'Please enter a year');
      return;
    }

    if (!formData.property || formData.property.trim() === '') {
      showError('Validation Error', 'Please select a property');
      return;
    }

    if (!formData.typeOfOperation || formData.typeOfOperation.trim() === '') {
      showError('Validation Error', 'Please select a category');
      return;
    }

    if (!formData.typeOfPayment || formData.typeOfPayment.trim() === '') {
      showError('Validation Error', 'Please select a payment type');
      return;
    }

    if (!formData.detail || formData.detail.trim() === '') {
      showError('Validation Error', 'Please enter a description');
      return;
    }

    if (formData.debit === 0 && formData.credit === 0) {
      showError('Validation Error', 'Please enter either debit or credit amount');
      return;
    }

    // Validate day is valid number (1-31)
    const dayNum = parseInt(formData.day);
    if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
      showError('Validation Error', 'Please enter a valid day (1-31)');
      return;
    }

    // Validate year is valid number
    const yearNum = parseInt(formData.year);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
      showError('Validation Error', 'Please enter a valid year');
      return;
    }

    setLoading(true);
    try {
      // Ensure debit and credit are numbers before submitting
      const submissionData = {
        ...formData,
        debit: typeof formData.debit === 'string' ? parseFloat(formData.debit) || 0 : formData.debit,
        credit: typeof formData.credit === 'string' ? parseFloat(formData.credit) || 0 : formData.credit,
      };
      
      // NOTE: Using legacy transaction format until API supports the new format
      // Future: Use new format with timestamp, fromAccount, transactionType, etc.
      const response = await apiService.submitTransaction(submissionData);
      
      if (response.ok) {
        showSuccess('Success', 'Transaction added successfully!');
        // Reset form
        const currentMonthIndex = new Date().getMonth(); // 0-11
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const currentMonth = monthNames[currentMonthIndex];
        
        setFormData({
          day: new Date().getDate().toString(),
          month: currentMonth,
          year: new Date().getFullYear().toString(),
          property: properties[0] || '',
          typeOfOperation: '',
          typeOfPayment: '', // Keep empty to show placeholder
          detail: '',
          ref: '',
          debit: 0,
          credit: 0,
        });
      } else {
        // Handle error from API response
        let errorMessage = response.message || 'Failed to submit transaction';
        showError('Submission Failed', errorMessage);
      }
    } catch (error) {
      let errorMessage = 'Failed to submit transaction';
      if (error instanceof Error) {
        try {
          // Try to extract meaningful error from HTTP error
          const match = error.message.match(/HTTP \d+ .+ :: (.+)/);
          if (match) {
            const errorBody = match[1];
            try {
              const parsed = JSON.parse(errorBody);
              errorMessage = parsed.message || parsed.error || errorMessage;
            } catch {
              errorMessage = errorBody.length > 100 ? 'Server error occurred' : errorBody;
            }
          } else {
            errorMessage = error.message;
          }
        } catch {
          errorMessage = 'Network error occurred';
        }
      }
      showError('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Get current month abbreviation (NOV for November)
    const currentMonthIndex = new Date().getMonth(); // 0-11
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const currentMonth = monthNames[currentMonthIndex];
    
    // Reset form to initial state and reload options
    setFormData({
      day: new Date().getDate().toString(),
      month: currentMonth,
      year: new Date().getFullYear().toString(),
      property: properties[0] || '',
      typeOfOperation: '',
      typeOfPayment: '', // Keep empty to show placeholder
      detail: '',
      ref: '',
      debit: 0,
      credit: 0,
    });
    fetchDropdownOptions().finally(() => setRefreshing(false));
  };

  const scrollToBottom = () => {
    // Scroll to bottom when description field is focused
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <View style={styles.container}>
      {optionsLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.YELLOW} />
          <Text style={styles.loadingText}>Loading form options...</Text>
        </View>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.YELLOW}
            />
          }
        >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <LogoBM size={64} />
        </View>
        
        {/* Header */}
        <Text style={styles.title}>Manual Entry</Text>
        <Text style={styles.subtitle}>Enter transaction details manually</Text>

        {/* Date Fields */}
        <View style={styles.row}>
          <View style={styles.dateField}>
            <Text style={styles.label}>Day</Text>
            <TextInput
              style={styles.input}
              value={formData.day}
              onChangeText={(text) => setFormData({ ...formData, day: text })}
              keyboardType="number-pad"
              maxLength={2}
              placeholderTextColor={COLORS.TEXT_SECONDARY}
            />
          </View>
          <View style={styles.dateField}>
            <Text style={styles.label}>Month</Text>
            <SearchableDropdown
              label=""
              value={formData.month}
              onValueChange={(value) => setFormData({ ...formData, month: value })}
              items={months.filter(month => month !== 'ALL')} // Exclude 'ALL' option for input
              placeholder="Select month"
              showClearButton={false}
              noMargin={true}
              borderColor={COLORS.BORDER}
              zIndex={2000}
            />
          </View>
          <View style={styles.dateField}>
            <Text style={styles.label}>Year</Text>
            <TextInput
              style={styles.input}
              value={formData.year}
              onChangeText={(text) => setFormData({ ...formData, year: text })}
              keyboardType="number-pad"
              maxLength={4}
              placeholderTextColor={COLORS.TEXT_SECONDARY}
            />
          </View>
        </View>

        {/* Property Picker */}
        <CustomPicker
          label="Property"
          selectedValue={formData.property}
          onValueChange={(value) => setFormData({ ...formData, property: value })}
          items={properties}
          placeholder="Select property"
          required
        />

        {/* Category Searchable Dropdown */}
        <SearchableDropdown
          label="Category"
          value={formData.typeOfOperation}
          onValueChange={(value) => setFormData({ ...formData, typeOfOperation: value })}
          items={typeOfOperations}
          placeholder="Search category..."
          required
          dropdownPosition="top"
        />

        {/* Payment Type Searchable Dropdown */}
        <SearchableDropdown
          label="Payment Type"
          value={formData.typeOfPayment}
          onValueChange={(value) => setFormData({ ...formData, typeOfPayment: value })}
          items={typeOfPayments}
          placeholder="Search payment type..."
          required
          dropdownPosition="top"
        />

        {/* Detail */}
        <View style={styles.field}>
          <Text style={styles.label}>
            Description <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, { borderColor: COLORS.YELLOW }]}
            value={formData.detail}
            onChangeText={(text) => setFormData({ ...formData, detail: text })}
            onFocus={scrollToBottom}
            placeholder="Enter description"
            placeholderTextColor={COLORS.TEXT_SECONDARY}
          />
        </View>

        {/* Amount Fields */}
        <View style={styles.row}>
          <View style={styles.amountField}>
            <Text style={styles.label}>Debit</Text>
            <TextInput
              style={styles.input}
              value={formData.debit === 0 ? '' : formData.debit.toString()}
              onChangeText={(text) => {
                // Allow empty, or valid decimal number
                if (text === '') {
                  setFormData({ ...formData, debit: 0 });
                  return;
                }
                // Allow only numbers and one decimal point
                const cleanText = text.replace(/[^0-9.]/g, '');
                // Count decimal points
                const decimalCount = (cleanText.match(/\./g) || []).length;
                if (decimalCount <= 1) {
                  // If it ends with a decimal point, store as string temporarily
                  if (cleanText.endsWith('.') || cleanText.endsWith('.0')) {
                    setFormData({ ...formData, debit: cleanText as any });
                  } else {
                    const num = parseFloat(cleanText);
                    setFormData({ ...formData, debit: isNaN(num) ? 0 : num });
                  }
                }
              }}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={COLORS.TEXT_SECONDARY}
            />
          </View>
          <View style={styles.amountField}>
            <Text style={styles.label}>Credit</Text>
            <TextInput
              style={styles.input}
              value={formData.credit === 0 ? '' : formData.credit.toString()}
              onChangeText={(text) => {
                // Allow empty, or valid decimal number
                if (text === '') {
                  setFormData({ ...formData, credit: 0 });
                  return;
                }
                // Allow only numbers and one decimal point
                const cleanText = text.replace(/[^0-9.]/g, '');
                // Count decimal points
                const decimalCount = (cleanText.match(/\./g) || []).length;
                if (decimalCount <= 1) {
                  // If it ends with a decimal point, store as string temporarily
                  if (cleanText.endsWith('.') || cleanText.endsWith('.0')) {
                    setFormData({ ...formData, credit: cleanText as any });
                  } else {
                    const num = parseFloat(cleanText);
                    setFormData({ ...formData, credit: isNaN(num) ? 0 : num });
                  }
                }
              }}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={COLORS.TEXT_SECONDARY}
            />
          </View>
        </View>

        {/* Reference */}
        <View style={styles.field}>
          <Text style={styles.label}>Reference (Optional)</Text>
          <TextInput
            style={styles.input}
            value={formData.ref}
            onChangeText={(text) => setFormData({ ...formData, ref: text })}
            placeholder="Enter reference number"
            placeholderTextColor={COLORS.TEXT_SECONDARY}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.BLACK} />
          ) : (
            <Text style={styles.submitButtonText}>Submit Transaction</Text>
          )}
        </TouchableOpacity>
        </ScrollView>
      )}
      
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 1,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
    marginTop: 16,
  },
  content: {
    padding: 20,
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
  field: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  dateField: {
    flex: 1,
  },
  amountField: {
    flex: 1,
  },
  label: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 14,
    fontFamily: 'Aileron-Bold',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  required: {
    color: COLORS.ERROR,
  },
  input: {
    backgroundColor: COLORS.SURFACE_1,
    color: COLORS.TEXT_PRIMARY,
    padding: 12,
    borderRadius: 0,
    fontSize: 16,
    fontFamily: 'Aileron-Regular',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  submitButton: {
    backgroundColor: COLORS.YELLOW,
    padding: 16,
    borderRadius: 0,
    alignItems: 'center',
    ...SHADOWS.YELLOW_GLOW,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: COLORS.BLACK,
    fontSize: 18,
    fontFamily: 'Aileron-Bold',
    fontWeight: '600',
  },
});

