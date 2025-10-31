import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface CustomPickerProps {
  label: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  items: readonly string[];
  placeholder?: string;
  required?: boolean;
}

export default function CustomPicker({
  label,
  selectedValue,
  onValueChange,
  items,
  placeholder = 'Select an option',
  required = false,
}: CustomPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
          dropdownIconColor="#94A3B8"
          itemStyle={styles.pickerItem}
        >
          <Picker.Item
            label={placeholder}
            value=""
            color="#64748B"
            enabled={false}
          />
          {items.map((item) => (
            <Picker.Item
              key={item}
              label={item}
              value={item}
              color={Platform.OS === 'ios' ? '#F1F5F9' : '#0F172A'}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: '#F1F5F9',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  pickerContainer: {
    backgroundColor: '#334155',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#475569',
  },
  picker: {
    color: '#F1F5F9',
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        height: 180,
      },
      android: {
        height: 50,
      },
    }),
  },
  pickerItem: {
    color: '#F1F5F9',
    fontSize: 16,
    ...Platform.select({
      ios: {
        height: 180,
      },
    }),
  },
});

