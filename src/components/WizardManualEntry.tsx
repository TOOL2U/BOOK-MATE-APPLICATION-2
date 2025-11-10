import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../config/theme';
import type { Transaction } from '../types';
import CustomPicker from './CustomPicker';
import SearchableDropdown from './SearchableDropdown';

interface WizardManualEntryProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Transaction) => Promise<void>;
  properties: string[];
  typeOfOperations: string[];
  typeOfPayments: string[];
  months: string[];
}

export default function WizardManualEntry({
  visible,
  onClose,
  onSubmit,
  properties,
  typeOfOperations,
  typeOfPayments,
  months,
}: WizardManualEntryProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [slideAnim] = useState(new Animated.Value(0));

  // Get current month abbreviation
  const currentMonthIndex = new Date().getMonth();
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const currentMonth = monthNames[currentMonthIndex];

  const [formData, setFormData] = useState<Transaction>({
    day: new Date().getDate().toString(),
    month: currentMonth,
    year: new Date().getFullYear().toString(),
    property: properties[0] || '',
    typeOfOperation: '',
    typeOfPayment: '',
    detail: '',
    ref: '',
    debit: 0,
    credit: 0,
  });

  const totalSteps = 4;

  const animateTransition = (direction: 'forward' | 'backward') => {
    Animated.timing(slideAnim, {
      toValue: direction === 'forward' ? -20 : 20,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      slideAnim.setValue(0);
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      animateTransition('forward');
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      animateTransition('backward');
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({
      day: new Date().getDate().toString(),
      month: currentMonth,
      year: new Date().getFullYear().toString(),
      property: properties[0] || '',
      typeOfOperation: '',
      typeOfPayment: '',
      detail: '',
      ref: '',
      debit: 0,
      credit: 0,
    });
    onClose();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.day && formData.month && formData.year && formData.property;
      case 2:
        return formData.typeOfOperation && formData.typeOfPayment;
      case 3:
        return formData.detail.trim() !== '';
      case 4:
        return formData.debit > 0 || formData.credit > 0;
      default:
        return false;
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.progressDot,
            index + 1 === currentStep && styles.progressDotActive,
            index + 1 < currentStep && styles.progressDotCompleted,
          ]}
        />
      ))}
    </View>
  );

  const renderStep1 = () => (
    <Animated.View style={[styles.stepContainer, { transform: [{ translateX: slideAnim }] }]}>
      <Text style={styles.stepTitle}>Date & Property</Text>
      
      {/* Date Fields */}
      <View style={styles.row}>
        <View style={styles.dateField}>
          <Text style={styles.label}>Day *</Text>
          <TextInput
            style={styles.input}
            value={formData.day}
            onChangeText={(text) => setFormData({ ...formData, day: text })}
            keyboardType="number-pad"
            maxLength={2}
            placeholder="DD"
            placeholderTextColor={COLORS.TEXT_SECONDARY}
          />
        </View>
        <View style={styles.dateField}>
          <Text style={styles.label}>Month *</Text>
          <SearchableDropdown
            label=""
            value={formData.month}
            onValueChange={(value) => setFormData({ ...formData, month: value })}
            items={months.filter(month => month !== 'ALL')}
            placeholder="Month"
            showClearButton={false}
            noMargin={true}
            borderColor={COLORS.YELLOW}
            zIndex={2000}
          />
        </View>
        <View style={styles.dateField}>
          <Text style={styles.label}>Year *</Text>
          <TextInput
            style={styles.input}
            value={formData.year}
            onChangeText={(text) => setFormData({ ...formData, year: text })}
            keyboardType="number-pad"
            maxLength={4}
            placeholder="YYYY"
            placeholderTextColor={COLORS.TEXT_SECONDARY}
          />
        </View>
      </View>

      {/* Property */}
      <CustomPicker
        label="Property"
        selectedValue={formData.property}
        onValueChange={(value) => setFormData({ ...formData, property: value })}
        items={properties}
        placeholder="Select property"
        required
      />
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View style={[styles.stepContainer, { transform: [{ translateX: slideAnim }] }]}>
      <Text style={styles.stepTitle}>Category & Payment</Text>

      {/* Category */}
      <SearchableDropdown
        label="Category"
        value={formData.typeOfOperation}
        onValueChange={(value) => setFormData({ ...formData, typeOfOperation: value })}
        items={typeOfOperations}
        placeholder="Search category..."
        required
        dropdownPosition="top"
      />

      {/* Payment Type */}
      <SearchableDropdown
        label="Payment Type"
        value={formData.typeOfPayment}
        onValueChange={(value) => setFormData({ ...formData, typeOfPayment: value })}
        items={typeOfPayments}
        placeholder="Search payment type..."
        required
        dropdownPosition="top"
      />
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View style={[styles.stepContainer, { transform: [{ translateX: slideAnim }] }]}>
      <Text style={styles.stepTitle}>Description</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.detail}
          onChangeText={(text) => setFormData({ ...formData, detail: text })}
          placeholder="Enter transaction description..."
          placeholderTextColor={COLORS.TEXT_SECONDARY}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
    </Animated.View>
  );

  const renderStep4 = () => (
    <Animated.View style={[styles.stepContainer, { transform: [{ translateX: slideAnim }] }]}>
      <Text style={styles.stepTitle}>Amount & Reference</Text>

      {/* Amount Fields */}
      <View style={styles.row}>
        <View style={styles.amountField}>
          <Text style={styles.label}>Debit</Text>
          <TextInput
            style={styles.input}
            value={formData.debit === 0 ? '' : formData.debit.toString()}
            onChangeText={(text) => {
              if (text === '') {
                setFormData({ ...formData, debit: 0 });
                return;
              }
              const cleanText = text.replace(/[^0-9.]/g, '');
              const decimalCount = (cleanText.match(/\./g) || []).length;
              if (decimalCount <= 1) {
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
              if (text === '') {
                setFormData({ ...formData, credit: 0 });
                return;
              }
              const cleanText = text.replace(/[^0-9.]/g, '');
              const decimalCount = (cleanText.match(/\./g) || []).length;
              if (decimalCount <= 1) {
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
    </Animated.View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>New Transaction</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={COLORS.TEXT_PRIMARY} />
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          {renderProgressBar()}

          {/* Step Content */}
          <View style={styles.content}>
            {renderCurrentStep()}
          </View>

          {/* Navigation Buttons */}
          <View style={styles.footer}>
            {currentStep > 1 && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
              >
                <Ionicons name="arrow-back" size={20} color={COLORS.TEXT_PRIMARY} />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}

            <View style={{ flex: 1 }} />

            {currentStep < totalSteps ? (
              <TouchableOpacity
                style={[styles.nextButton, !canProceed() && styles.buttonDisabled]}
                onPress={handleNext}
                disabled={!canProceed()}
              >
                <Text style={styles.nextButtonText}>Next</Text>
                <Ionicons name="arrow-forward" size={20} color={COLORS.BLACK} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.submitButton, (!canProceed() || loading) && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={!canProceed() || loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.BLACK} />
                ) : (
                  <>
                    <Text style={styles.submitButtonText}>Submit</Text>
                    <Ionicons name="checkmark" size={20} color={COLORS.BLACK} />
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: COLORS.SURFACE_1,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: COLORS.YELLOW,
    ...SHADOWS.YELLOW_GLOW,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'MadeMirage-Regular',
    color: COLORS.TEXT_PRIMARY,
  },
  closeButton: {
    padding: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  progressDot: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.BORDER,
    borderRadius: 0,
  },
  progressDotActive: {
    backgroundColor: COLORS.YELLOW,
  },
  progressDotCompleted: {
    backgroundColor: COLORS.SUCCESS,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 20,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 20,
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
    backgroundColor: COLORS.SURFACE_2,
    color: COLORS.TEXT_PRIMARY,
    padding: 12,
    borderRadius: 0,
    fontSize: 16,
    fontFamily: 'Aileron-Regular',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  backButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
    fontFamily: 'Aileron-Bold',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.YELLOW,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 0,
    ...SHADOWS.YELLOW_GLOW,
  },
  nextButtonText: {
    color: COLORS.BLACK,
    fontSize: 16,
    fontFamily: 'Aileron-Bold',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.YELLOW,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 0,
    ...SHADOWS.YELLOW_GLOW,
  },
  submitButtonText: {
    color: COLORS.BLACK,
    fontSize: 16,
    fontFamily: 'Aileron-Bold',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
