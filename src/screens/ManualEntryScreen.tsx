import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { apiService } from '../services/api';
import type { Transaction } from '../types';
import { PROPERTIES, TYPE_OF_OPERATIONS, TYPE_OF_PAYMENTS } from '../types';
import CustomPicker from '../components/CustomPicker';
import SearchableDropdown from '../components/SearchableDropdown';

export default function ManualEntryScreen() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Transaction>({
    day: new Date().getDate().toString(),
    month: (new Date().getMonth() + 1).toString(),
    year: new Date().getFullYear().toString(),
    property: PROPERTIES[0],
    typeOfOperation: '',
    typeOfPayment: TYPE_OF_PAYMENTS[0],
    detail: '',
    ref: '',
    debit: 0,
    credit: 0,
  });

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
      
      if (response.success) {
        Alert.alert('Success', 'Transaction added successfully!');
        // Reset form
        setFormData({
          day: new Date().getDate().toString(),
          month: (new Date().getMonth() + 1).toString(),
          year: new Date().getFullYear().toString(),
          property: PROPERTIES[0],
          typeOfOperation: '',
          typeOfPayment: TYPE_OF_PAYMENTS[0],
          detail: '',
          ref: '',
          debit: 0,
          credit: 0,
        });
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
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
              placeholderTextColor="#64748B"
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
              placeholderTextColor="#64748B"
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
              placeholderTextColor="#64748B"
            />
          </View>
        </View>

        {/* Property Picker */}
        <CustomPicker
          label="Property"
          selectedValue={formData.property}
          onValueChange={(value) => setFormData({ ...formData, property: value })}
          items={PROPERTIES}
          placeholder="Select property"
          required
        />

        {/* Category Searchable Dropdown */}
        <SearchableDropdown
          label="Category"
          value={formData.typeOfOperation}
          onValueChange={(value) => setFormData({ ...formData, typeOfOperation: value })}
          items={TYPE_OF_OPERATIONS}
          placeholder="Search category..."
          required
          dropdownPosition="top"
        />

        {/* Payment Type Picker */}
        <CustomPicker
          label="Payment Type"
          selectedValue={formData.typeOfPayment}
          onValueChange={(value) => setFormData({ ...formData, typeOfPayment: value })}
          items={TYPE_OF_PAYMENTS}
          placeholder="Select payment type"
          required
        />

        {/* Detail */}
        <View style={styles.field}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={styles.input}
            value={formData.detail}
            onChangeText={(text) => setFormData({ ...formData, detail: text })}
            placeholder="Enter description"
            placeholderTextColor="#64748B"
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
              placeholderTextColor="#64748B"
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
              placeholderTextColor="#64748B"
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
            placeholderTextColor="#64748B"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Transaction</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
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
    color: '#F1F5F9',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#334155',
    color: '#F1F5F9',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

