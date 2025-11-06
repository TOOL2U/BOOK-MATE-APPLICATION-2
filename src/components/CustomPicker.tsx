import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../config/theme';

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
          dropdownIconColor={COLORS.TEXT_SECONDARY}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item
            label={placeholder}
            value=""
            color={COLORS.TEXT_SECONDARY}
            enabled={false}
          />
          {items.map((item) => (
            <Picker.Item
              key={item}
              label={item}
              value={item}
              color={Platform.OS === 'ios' ? COLORS.TEXT_PRIMARY : COLORS.GREY_PRIMARY}
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
  pickerContainer: {
    backgroundColor: COLORS.SURFACE_1,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.YELLOW,
  },
  picker: {
    color: COLORS.TEXT_PRIMARY,
    backgroundColor: 'transparent',
    fontFamily: 'Aileron-Regular',
    ...Platform.select({
      ios: {
        height: 120,
      },
      android: {
        height: 50,
      },
    }),
  },
  pickerItem: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
    fontFamily: 'Aileron-Regular',
    ...Platform.select({
      ios: {
        height: 120,
      },
    }),
  },
});

