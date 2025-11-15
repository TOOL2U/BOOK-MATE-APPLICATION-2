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
import { COMPONENT_RADIUS, BORDER_RADIUS } from '../constants/borderRadius';
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
    property: '',
    typeOfOperation: '',
    typeOfPayment: '',
    detail: '',
    ref: '',
    debit: 0,
    credit: 0,
  });

  const totalSteps = 3; // Changed from 4 to 3 (removed ref step)

  // Set default values from API data when modal opens
  const hasSetDefaults = React.useRef(false);
  React.useEffect(() => {
    if (visible && !hasSetDefaults.current) {
      // Set first property as default
      if (properties.length > 0) {
        setFormData(prev => ({ ...prev, property: properties[0] }));
      }
      
      // Set first payment type as default
      if (typeOfPayments.length > 0) {
        setFormData(prev => ({ ...prev, typeOfPayment: typeOfPayments[0] }));
      }
      
      hasSetDefaults.current = true;
    }
    
    // Reset the flag when modal closes
    if (!visible) {
      hasSetDefaults.current = false;
    }
  }, [visible, properties, typeOfPayments]);

  // Fade in animation when modal becomes visible
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
    console.log('🔵 WizardManualEntry: handleSubmit called');
    console.log('📋 Form data:', JSON.stringify(formData, null, 2));
    console.log('🔍 onSubmit prop type:', typeof onSubmit);
    console.log('🔍 onSubmit prop value:', onSubmit);
    
    setLoading(true);
    try {
      console.log('⏳ Calling parent onSubmit handler...');
      
      if (typeof onSubmit !== 'function') {
        console.error('❌ onSubmit is not a function!', typeof onSubmit);
        throw new Error('onSubmit is not a function');
      }
      
      // Call the parent's submit handler
      const result = await onSubmit(formData);
      
      console.log('✅ Parent onSubmit completed successfully, result:', result);
      // If we get here without error, the transaction was successful
      showAlert({
        title: 'Success!',
        message: 'Transaction added successfully',
        type: 'success',
        onConfirm: () => {
          hideAlert();
          
          // Call success callback if provided
          if (onSuccess && typeof onSuccess === 'function') {
            try {
              onSuccess();
            } catch (err) {
              console.error('Error in onSuccess callback:', err);
            }
          }
          
          // Close modal (handleClose will reset form state)
          handleClose();
        },
      });
    } catch (error) {
      console.error('❌ WizardManualEntry: Submit error:', error);
      
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
      property: properties.length > 0 ? properties[0] : '',
      typeOfOperation: '',
      typeOfPayment: typeOfPayments.length > 0 ? typeOfPayments[0] : '',
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
    <Animated.View style={[styles.stepContainer, styles.step3Container, { transform: [{ translateX: slideAnim }] }]}>
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
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>New Transaction</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={COLORS.TEXT_PRIMARY} />
          </TouchableOpacity>
        </View>

        {/* Show loading if required data not available */}
        {(!properties || properties.length === 0 || !typeOfPayments || typeOfPayments.length === 0) && visible ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.YELLOW} />
            <Text style={styles.loadingText}>Loading account data...</Text>
          </View>
        ) : (
          <>
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
        <View style={styles.buttonContainer}>
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
          </>
        )}
      </View>
      
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
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'BebasNeue-Regular',
    letterSpacing: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.CARD_PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderRadius: BORDER_RADIUS.xs,
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
    flexGrow: 1,
    justifyContent: 'center', // Center content vertically
    padding: 20,
    paddingTop: 60,  // Push content down from top
    paddingBottom: 80, // Extra padding at bottom to center better
    overflow: 'visible', // Allow dropdowns to appear outside
  },
  stepContainer: {
    width: '100%',
    overflow: 'visible', // Allow dropdowns to appear outside
  },
  step3Container: {
    marginTop: -120, // Move step 3 content upwards
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
    borderRadius: COMPONENT_RADIUS.input,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    backgroundColor: COLORS.CARD_PRIMARY,
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
    borderRadius: COMPONENT_RADIUS.button,
    minHeight: 48,
    ...SHADOWS.YELLOW_GLOW,
  },
  nextButtonText: {
    color: COLORS.BRAND_BLACK,
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
    borderRadius: COMPONENT_RADIUS.button,
    minHeight: 48,
    ...SHADOWS.YELLOW_GLOW,
  },
  submitButtonText: {
    color: COLORS.BRAND_BLACK,
    fontSize: 16,
    fontFamily: 'Aileron-Bold',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'Aileron-Regular',
  },
  helperTextContainer: {
    backgroundColor: COLORS.SURFACE_2,
    padding: 12,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.BRAND_YELLOW,
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
