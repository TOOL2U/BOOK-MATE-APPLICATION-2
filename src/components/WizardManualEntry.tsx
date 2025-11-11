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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../config/theme';
import type { Transaction } from '../types';
import CustomPicker from './CustomPicker';
import SearchableDropdown from './SearchableDropdown';
import BrandedAlert from './BrandedAlert';
import { useBrandedAlert } from '../hooks/useBrandedAlert';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface WizardManualEntryProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Transaction) => Promise<void | { ok: boolean; message?: string }>;
  onSuccess?: () => void; // Callback after successful submission
  properties: string[];
  typeOfOperations: string[];
  typeOfPayments: string[];
  months: string[];
}

export default function WizardManualEntry({
  visible,
  onClose,
  onSubmit,
  onSuccess,
  properties,
  typeOfOperations,
  typeOfPayments,
  months,
}: WizardManualEntryProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [slideAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0)); // Fade animation for modal
  const [scaleAnim] = useState(new Animated.Value(0.9)); // Scale animation for modal
  const descriptionInputRef = React.useRef<TextInput>(null); // Ref for auto-focus
  
  const {
    isVisible: alertVisible,
    alertConfig,
    showAlert,
    hideAlert,
  } = useBrandedAlert();

  // Get current month abbreviation
  const currentMonthIndex = new Date().getMonth();
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const currentMonth = monthNames[currentMonthIndex];

  const [formData, setFormData] = useState<Transaction>({
    day: new Date().getDate().toString(),
    month: currentMonth,
    year: new Date().getFullYear().toString(),
    property: 'Family',
    typeOfOperation: '',
    typeOfPayment: 'Bank Transfer - Krung Thai',
    detail: '',
    ref: '',
    debit: 0,
    credit: 0,
  });

  const totalSteps = 3; // Changed from 4 to 3 (removed ref step)

  // Set default payment type only once when modal opens and typeOfPayments are loaded
  const hasSetDefault = React.useRef(false);
  React.useEffect(() => {
    if (visible && typeOfPayments.length > 0 && !hasSetDefault.current) {
      const defaultPayment = typeOfPayments.find(payment => 
        payment.includes('Bank Transfer - Krung Thai')
      ) || typeOfPayments[0];
      setFormData(prev => ({ ...prev, typeOfPayment: defaultPayment }));
      hasSetDefault.current = true;
    }
    
    // Reset the flag when modal closes
    if (!visible) {
      hasSetDefault.current = false;
    }
  }, [visible, typeOfPayments]);

  // Fade in animation when modal becomes visible
  React.useEffect(() => {
    if (visible) {
      // Reset animations
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
      
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset when closing
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    }
  }, [visible]);

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
      
      // Auto-focus description field when moving to step 3
      if (currentStep + 1 === 3) {
        setTimeout(() => {
          descriptionInputRef.current?.focus();
        }, 200); // Delay to allow animation to complete
      }
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
      // Call the parent's submit handler
      await onSubmit(formData);
      
      // If we get here without error, the transaction was successful
      showAlert({
        title: 'Success!',
        message: 'Transaction added successfully',
        type: 'success',
        onConfirm: () => {
          hideAlert();
          // Navigate first, then close modal with a slight delay
          onSuccess?.();
          setTimeout(() => {
            handleClose();
          }, 100);
        },
      });
    } catch (error) {
      console.error('Submit error:', error);
      
      // Extract meaningful error message
      let errorMessage = 'Failed to add transaction. Please try again.';
      if (error instanceof Error) {
        try {
          // Try to extract error from HTTP error response
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
      
      showAlert({
        title: 'Error',
        message: errorMessage,
        type: 'error',
      });
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
      property: 'Family',
      typeOfOperation: '',
      typeOfPayment: 'Bank Transfer - Krung Thai',
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
        return formData.detail.trim() !== '' && (formData.debit > 0 || formData.credit > 0);
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
      <View style={styles.dropdownWrapper}>
        <SearchableDropdown
          label="Category"
          value={formData.typeOfOperation}
          onValueChange={(value) => setFormData({ ...formData, typeOfOperation: value })}
          items={typeOfOperations}
          placeholder="Search category..."
          required
          dropdownPosition="top"
          zIndex={9999}
        />
      </View>

      {/* Payment Type */}
      <CustomPicker
        label="Payment Type"
        selectedValue={formData.typeOfPayment}
        onValueChange={(value) => setFormData({ ...formData, typeOfPayment: value })}
        items={typeOfPayments}
        placeholder="Select payment type"
        required
      />
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View style={[styles.stepContainer, { transform: [{ translateX: slideAnim }] }]}>
      <Text style={styles.stepTitle}>Description & Amount</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Description *</Text>
        <TextInput
          ref={descriptionInputRef}
          style={[styles.input, styles.textArea]}
          value={formData.detail}
          onChangeText={(text) => setFormData({ ...formData, detail: text })}
          placeholder="Enter transaction description..."
          placeholderTextColor={COLORS.TEXT_SECONDARY}
          multiline
          numberOfLines={2}
          textAlignVertical="top"
        />
      </View>

      {/* Amount Field - Dynamic based on category */}
      {formData.typeOfOperation && (
        <View style={styles.field}>
          {formData.typeOfOperation.startsWith('Revenue') ? (
            <>
              <Text style={[styles.label, styles.creditLabel]}>
                Credit (Revenue) *
              </Text>
              <TextInput
                style={styles.input}
                value={formData.credit === 0 ? '' : formData.credit.toString()}
                onChangeText={(text) => {
                  if (text === '') {
                    setFormData({ ...formData, credit: 0, debit: 0 });
                    return;
                  }
                  const cleanText = text.replace(/[^0-9.]/g, '');
                  const decimalCount = (cleanText.match(/\./g) || []).length;
                  if (decimalCount <= 1) {
                    if (cleanText.endsWith('.') || cleanText.endsWith('.0')) {
                      setFormData({ ...formData, credit: cleanText as any, debit: 0 });
                    } else {
                      const num = parseFloat(cleanText);
                      setFormData({ ...formData, credit: isNaN(num) ? 0 : num, debit: 0 });
                    }
                  }
                }}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={COLORS.TEXT_SECONDARY}
              />
            </>
          ) : formData.typeOfOperation.toUpperCase().startsWith('EXP') || formData.typeOfOperation.toUpperCase().startsWith('OVERHEAD') ? (
            <>
              <Text style={[styles.label, styles.debitLabel]}>
                Debit (Expense) *
              </Text>
              <TextInput
                style={styles.input}
                value={formData.debit === 0 ? '' : formData.debit.toString()}
                onChangeText={(text) => {
                  if (text === '') {
                    setFormData({ ...formData, debit: 0, credit: 0 });
                    return;
                  }
                  const cleanText = text.replace(/[^0-9.]/g, '');
                  const decimalCount = (cleanText.match(/\./g) || []).length;
                  if (decimalCount <= 1) {
                    if (cleanText.endsWith('.') || cleanText.endsWith('.0')) {
                      setFormData({ ...formData, debit: cleanText as any, credit: 0 });
                    } else {
                      const num = parseFloat(cleanText);
                      setFormData({ ...formData, debit: isNaN(num) ? 0 : num, credit: 0 });
                    }
                  }
                }}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={COLORS.TEXT_SECONDARY}
              />
            </>
          ) : null}
        </View>
      )}
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
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.overlay}
          >
            <Animated.View style={[
              styles.modalContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              }
            ]}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>New Transaction</Text>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <Ionicons name="close" size={28} color={COLORS.TEXT_PRIMARY} />
                </TouchableOpacity>
              </View>

            {/* Progress Bar */}
            {renderProgressBar()}

            {/* Step Content - Scrollable */}
            <ScrollView
              style={styles.content}
              contentContainerStyle={styles.contentContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {renderCurrentStep()}
            </ScrollView>

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
        </Animated.View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      </Animated.View>
      
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
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-start',
  },
  modalContainer: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.65, // Use 65% of screen height - more compact
    backgroundColor: COLORS.SURFACE_1,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 2,
    borderColor: COLORS.YELLOW,
    marginTop: Platform.OS === 'ios' ? 140 : 100, // Position from top
    overflow: 'visible', // Allow dropdowns to appear outside
    ...SHADOWS.YELLOW_GLOW,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    minHeight: 60,
  },
  headerTitle: {
    fontSize: 22,
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
    paddingVertical: 12,
    gap: 8,
    minHeight: 40,
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
    overflow: 'visible', // Allow dropdowns to appear outside
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40, // Extra padding at bottom
    overflow: 'visible', // Allow dropdowns to appear outside
  },
  stepContainer: {
    width: '100%',
    overflow: 'visible', // Allow dropdowns to appear outside
  },
  dropdownWrapper: {
    zIndex: 9999,
    elevation: 9999,
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 18,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 20,
  },
  field: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  dateField: {
    flex: 1,
    minWidth: 0, // Allow flex shrinking
  },
  amountField: {
    flex: 1,
    minWidth: 0, // Allow flex shrinking
  },
  label: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 12,
    fontFamily: 'Aileron-Bold',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: COLORS.SURFACE_2,
    color: COLORS.TEXT_PRIMARY,
    padding: 14,
    borderRadius: 0,
    fontSize: 16,
    fontFamily: 'Aileron-Regular',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    minHeight: 48, // Ensure tappable area
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    backgroundColor: COLORS.SURFACE_1,
    minHeight: 70,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16, // Account for home indicator
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 48,
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
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 0,
    minHeight: 48,
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
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 0,
    minHeight: 48,
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
  helperTextContainer: {
    backgroundColor: COLORS.SURFACE_2,
    padding: 12,
    borderRadius: 0,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.YELLOW,
  },
  helperText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
    fontFamily: 'Aileron-Regular',
  },
  helperHighlight: {
    color: COLORS.YELLOW,
    fontFamily: 'Aileron-Bold',
    fontWeight: '600',
  },
  labelHighlight: {
    color: COLORS.YELLOW,
    fontSize: 12,
    fontFamily: 'Aileron-Bold',
  },
  debitLabel: {
    color: '#FF4444', // Red color
  },
  creditLabel: {
    color: '#4CAF50', // Green color
  },
  inputDisabled: {
    opacity: 0.4,
    backgroundColor: COLORS.SURFACE_2,
  },
});
