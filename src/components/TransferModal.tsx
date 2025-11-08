import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { apiService } from '../services/api';
import { COLORS, SHADOWS, RADIUS, SPACING } from '../config/theme';
import CustomPicker from './CustomPicker';
import BrandedAlert from './BrandedAlert';
import { useBrandedAlert } from '../hooks/useBrandedAlert';
import { getMonthAbbreviation, getMonthNumber } from '../utils/dateUtils';

interface TransferModalProps {
  visible: boolean;
  onClose: () => void;
  onTransferComplete?: () => void;
}

export default function TransferModal({ 
  visible, 
  onClose, 
  onTransferComplete 
}: TransferModalProps) {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    isVisible: alertVisible,
    alertConfig,
    showError,
    showSuccess,
    hideAlert
  } = useBrandedAlert();

  // Fetch accounts when modal opens
  useEffect(() => {
    if (visible) {
      fetchAccounts();
    }
  }, [visible]);

  const fetchAccounts = async () => {
    try {
      const response = await apiService.getOptions();
      if (response.data?.typeOfPayments) {
        const paymentAccounts = response.data.typeOfPayments.map((payment: any) => payment.name);
        setAccounts(paymentAccounts);
        if (paymentAccounts.length > 0) {
          setFromAccount(paymentAccounts[0]);
          setToAccount(paymentAccounts[1] || paymentAccounts[0]);
        }
      }
    } catch (error) {
      showError('Error', 'Failed to fetch account options');
    }
  };

  const handleTransfer = async () => {
    // Validation
    if (!fromAccount || !toAccount) {
      showError('Validation Error', 'Please select both from and to accounts');
      return;
    }

    if (fromAccount === toAccount) {
      showError('Validation Error', 'From and to accounts must be different');
      return;
    }

    const transferAmount = parseFloat(amount);
    if (!transferAmount || transferAmount <= 0) {
      showError('Validation Error', 'Please enter a valid amount greater than 0');
      return;
    }

    setLoading(true);
    try {
      const today = new Date();
      const refId = `T-${today.getFullYear()}-${String(Date.now()).slice(-6)}`; // e.g., T-2025-123456

      // BACKEND V9.1 SPEC: Transfer = Two-Row Pattern
      // - typeOfOperation: "Transfer" (from Data!F2)
      // - Row A: Source (debit), Row B: Destination (credit)
      // - Both rows MUST have same ref ID
      // - Property field is OPTIONAL for transfers
      // - Detail must contain "Transfer to" or "Transfer from"
      
      // Row A: Source Transaction (Money Leaving - DEBIT)
      const sourceTransaction = {
        day: today.getDate().toString(),
        month: getMonthAbbreviation(today.getMonth() + 1),
        year: today.getFullYear().toString(),
        property: '', // OPTIONAL for transfers (V9.1)
        typeOfOperation: 'Transfer', // Must be "Transfer" from Data!F2
        typeOfPayment: fromAccount, // Source account
        detail: note || `Transfer to ${toAccount}`, // Must contain "Transfer to"
        ref: refId, // REQUIRED - links both rows
        debit: transferAmount, // Money LEAVING source
        credit: 0, // Must be 0 for source
      };

      // Row B: Destination Transaction (Money Entering - CREDIT)
      const destinationTransaction = {
        day: today.getDate().toString(),
        month: getMonthAbbreviation(today.getMonth() + 1),
        year: today.getFullYear().toString(),
        property: '', // OPTIONAL for transfers (V9.1)
        typeOfOperation: 'Transfer', // Must be "Transfer" from Data!F2
        typeOfPayment: toAccount, // Destination account
        detail: note || `Transfer from ${fromAccount}`, // Must contain "Transfer from"
        ref: refId, // SAME ref as Row A
        debit: 0, // Must be 0 for destination
        credit: transferAmount, // Money ENTERING destination
      };

      console.log('📤 Submitting transfer Row A (source):', sourceTransaction);

      // Submit Row A (source)
      const sourceResponse = await apiService.submitTransaction(sourceTransaction);
      
      if (!sourceResponse.ok) {
        const errorMsg = sourceResponse.message || 'Failed to record source transaction';
        showError('Transfer Failed', errorMsg);
        return;
      }

      console.log('✅ Row A submitted, now submitting Row B (destination):', destinationTransaction);

      // Submit Row B (destination)
      const destinationResponse = await apiService.submitTransaction(destinationTransaction);
      
      if (destinationResponse.ok) {
        showSuccess(
          'Transfer Successful',
          `₿${transferAmount.toLocaleString()} transferred from ${fromAccount} to ${toAccount}`,
          () => {
            onTransferComplete?.();
            onClose();
            // Reset form
            setAmount('');
            setNote('');
            if (accounts.length > 0) {
              setFromAccount(accounts[0]);
              setToAccount(accounts[1] || accounts[0]);
            }
          }
        );
      } else {
        const errorMsg = destinationResponse.message || 'Failed to record destination transaction';
        showError('Transfer Failed', `Source recorded but destination failed: ${errorMsg}`);
      }
    } catch (error) {
      showError('Transfer Failed', error instanceof Error ? error.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form and close
    setAmount('');
    setNote('');
    if (accounts.length > 0) {
      setFromAccount(accounts[0]);
      setToAccount(accounts[1] || accounts[0]);
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Transfer Money</Text>
          <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* From Account */}
          <View style={styles.field}>
            <Text style={styles.label}>From Account</Text>
            <CustomPicker
              label=""
              selectedValue={fromAccount}
              onValueChange={setFromAccount}
              items={accounts}
            />
          </View>

          {/* To Account */}
          <View style={styles.field}>
            <Text style={styles.label}>To Account</Text>
            <CustomPicker
              label=""
              selectedValue={toAccount}
              onValueChange={setToAccount}
              items={accounts}
            />
          </View>

          {/* Amount */}
          <View style={styles.field}>
            <Text style={styles.label}>Amount (THB)</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor="#64748B"
              keyboardType="decimal-pad"
            />
          </View>

          {/* Note */}
          <View style={styles.field}>
            <Text style={styles.label}>Note (Optional)</Text>
            <TextInput
              style={styles.input}
              value={note}
              onChangeText={setNote}
              placeholder="Transfer description"
              placeholderTextColor="#64748B"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Transfer Summary */}
          {amount && fromAccount && toAccount && fromAccount !== toAccount && (
            <View style={styles.summary}>
              <Text style={styles.summaryTitle}>Transfer Summary</Text>
              <Text style={styles.summaryText}>
                Transfer ₿{parseFloat(amount || '0').toLocaleString()} from{'\n'}
                <Text style={styles.fromAccount}>{fromAccount}</Text> to{'\n'}
                <Text style={styles.toAccount}>{toAccount}</Text>
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.transferButton, loading && styles.disabledButton]}
              onPress={handleTransfer}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.transferButtonText}>Transfer</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    backgroundColor: COLORS.GREY_PRIMARY,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.XL,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'BebasNeue-Regular',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.GREY_SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.XL,
    paddingBottom: SPACING.XXL,
  },
  field: {
    marginBottom: SPACING.XL,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
    fontFamily: 'Aileron-Bold',
  },
  input: {
    backgroundColor: COLORS.SURFACE_1,
    borderRadius: RADIUS.MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    padding: SPACING.LG,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    textAlignVertical: 'top',
    fontFamily: 'Aileron-Regular',
  },
  summary: {
    backgroundColor: COLORS.SURFACE_1,
    borderRadius: RADIUS.MD,
    padding: SPACING.LG,
    marginBottom: SPACING.XL,
    borderWidth: 1,
    borderColor: COLORS.YELLOW,
    ...SHADOWS.YELLOW_GLOW,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.YELLOW,
    marginBottom: SPACING.SM,
    fontFamily: 'Aileron-Bold',
  },
  summaryText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
    fontFamily: 'Aileron-Regular',
  },
  fromAccount: {
    color: COLORS.ERROR,
    fontWeight: '600',
  },
  toAccount: {
    color: COLORS.SUCCESS,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.MD,
    marginTop: 'auto',
    paddingBottom: SPACING.XL,
  },
  cancelButton: {
    flex: 1,
    padding: SPACING.LG,
    borderRadius: RADIUS.MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'Aileron-Bold',
  },
  transferButton: {
    flex: 1,
    padding: SPACING.LG,
    borderRadius: RADIUS.MD,
    backgroundColor: COLORS.YELLOW,
    alignItems: 'center',
    ...SHADOWS.SMALL,
  },
  transferButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.BLACK,
    fontFamily: 'Aileron-Bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
});