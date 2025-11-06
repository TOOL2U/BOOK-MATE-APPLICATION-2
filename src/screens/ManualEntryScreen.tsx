import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { apiService } from '../services/api';
import { COLORS, SHADOWS } from '../config/theme';
import type { Transaction } from '../types';
import CustomPicker from '../components/CustomPicker';
import SearchableDropdown from '../components/SearchableDropdown';

export default function ManualEntryScreen() {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(true);
  
  // Dynamic dropdown options from API
  const [properties, setProperties] = useState<string[]>([]);
  const [typeOfOperations, setTypeOfOperations] = useState<string[]>([]);
  const [typeOfPayments, setTypeOfPayments] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<Transaction>({
    day: new Date().getDate().toString(),
    month: (new Date().getMonth() + 1).toString(),
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
        
        // Handle case where API returns rich objects with {name, monthly, yearTotal}
        const operations = response.data.typeOfOperations || [];
        const operationNames = operations.map((op: any) => 
          typeof op === 'string' ? op : op.name
        );
        setTypeOfOperations(operationNames);
        
        setTypeOfPayments(response.data.typeOfPayment || []); // Note: API returns 'typeOfPayment' (singular)
        
        // Set default values once options are loaded
        setFormData(prev => ({
          ...prev,
          property: response.data.properties?.[0] || '',
          typeOfPayment: response.data.typeOfPayment?.[0] || '',
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load dropdown options');
    } finally {
      setOptionsLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  const handleSubmit = async () => {
    // Validation
    if (!formData.typeOfOperation) {
      Alert.alert('Validation Error', 'Please select a category');
      return;
    }

    if (formData.debit === 0 && formData.credit === 0) {
      Alert.alert('Validation Error', 'Please enter either debit or credit amount');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.submitTransaction(formData);
      
      if (response.ok) {
        Alert.alert('Success', 'Transaction added successfully!');
        // Reset form
        setFormData({
          day: new Date().getDate().toString(),
          month: (new Date().getMonth() + 1).toString(),
          year: new Date().getFullYear().toString(),
          property: properties[0] || '',
          typeOfOperation: '',
          typeOfPayment: typeOfPayments[0] || '',
          detail: '',
          ref: '',
          debit: 0,
          credit: 0,
        });
      } else {
        Alert.alert('Error', response.message || 'Failed to submit transaction');
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Reset form to initial state and reload options
    setFormData({
      day: new Date().getDate().toString(),
      month: (new Date().getMonth() + 1).toString(),
      year: new Date().getFullYear().toString(),
      property: properties[0] || '',
      typeOfOperation: '',
      typeOfPayment: typeOfPayments[0] || '',
      detail: '',
      ref: '',
      debit: 0,
      credit: 0,
    });
    fetchDropdownOptions().finally(() => setRefreshing(false));
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
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.YELLOW}
            />
          }
        >
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
            <TextInput
              style={styles.input}
              value={formData.month}
              onChangeText={(text) => setFormData({ ...formData, month: text })}
              keyboardType="number-pad"
              maxLength={2}
              placeholderTextColor={COLORS.TEXT_SECONDARY}
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
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={styles.input}
            value={formData.detail}
            onChangeText={(text) => setFormData({ ...formData, detail: text })}
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
              value={formData.debit.toString()}
              onChangeText={(text) =>
                setFormData({ ...formData, debit: parseFloat(text) || 0 })
              }
              keyboardType="decimal-pad"
              placeholderTextColor={COLORS.TEXT_SECONDARY}
            />
          </View>
          <View style={styles.amountField}>
            <Text style={styles.label}>Credit</Text>
            <TextInput
              style={styles.input}
              value={formData.credit.toString()}
              onChangeText={(text) =>
                setFormData({ ...formData, credit: parseFloat(text) || 0 })
              }
              keyboardType="decimal-pad"
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
  loadingText: {
    fontSize: 16,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
    marginTop: 16,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'MadeMirage-Regular',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
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
  input: {
    backgroundColor: COLORS.SURFACE_1,
    color: COLORS.TEXT_PRIMARY,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    fontFamily: 'Aileron-Regular',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  submitButton: {
    backgroundColor: COLORS.YELLOW,
    padding: 16,
    borderRadius: 12,
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

