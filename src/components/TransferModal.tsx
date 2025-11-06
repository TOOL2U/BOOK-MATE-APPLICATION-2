import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { apiService } from '../services/api';
import { COLORS, SHADOWS, RADIUS, SPACING } from '../config/theme';
import CustomPicker from './CustomPicker';

interface TransferModalProps {
  visible: boolean;
  onClose: () => void;
  accounts: string[]; // List of available accounts (bank names + Cash)
  onTransferComplete?: () => void;
}

export default function TransferModal({ 
  visible, 
  onClose, 
  accounts, 
  onTransferComplete 
}: TransferModalProps) {
  const [fromAccount, setFromAccount] = useState(accounts[0] || '');
  const [toAccount, setToAccount] = useState(accounts[1] || '');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    // Validation
    if (!fromAccount || !toAccount) {
      Alert.alert('Validation Error', 'Please select both from and to accounts');
      return;
    }

    if (fromAccount === toAccount) {
      Alert.alert('Validation Error', 'From and to accounts must be different');
      return;
    }

    const transferAmount = parseFloat(amount);
    if (!transferAmount || transferAmount <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid amount greater than 0');
      return;
    }

    setLoading(true);
    try {
      const today = new Date();
      const transferNote = note || `Transfer from ${fromAccount} to ${toAccount}`;
      const refId = `TXF-${Date.now()}`;

      // Create debit transaction (money leaving fromAccount)
      const debitTransaction = {
        day: today.getDate().toString(),
        month: (today.getMonth() + 1).toString(),
        year: today.getFullYear().toString(),
        property: 'Family', // Using Family as default property for transfers
        typeOfOperation: 'EXP - Transfer', // Transfer expense operation
        typeOfPayment: fromAccount,
        detail: `${transferNote} (Debit)`,
        ref: refId,
        debit: transferAmount,
        credit: 0,
      };

      // Create credit transaction (money entering toAccount)
      const creditTransaction = {
        day: today.getDate().toString(),
        month: (today.getMonth() + 1).toString(),
        year: today.getFullYear().toString(),
        property: 'Family', // Using Family as default property for transfers
        typeOfOperation: 'Revenue - Transfer', // Transfer revenue operation
        typeOfPayment: toAccount,
        detail: `${transferNote} (Credit)`,
        ref: refId,
        debit: 0,
        credit: transferAmount,
      };

      // Submit both transactions
      const debitResponse = await apiService.submitTransaction(debitTransaction);
      const creditResponse = await apiService.submitTransaction(creditTransaction);
      
      if (debitResponse.ok && creditResponse.ok) {
        Alert.alert(
          'Transfer Successful',
          `₿${transferAmount.toLocaleString()} transferred from ${fromAccount} to ${toAccount}`,
          [
            {
              text: 'OK',
              onPress: () => {
                onTransferComplete?.();
                onClose();
                // Reset form
                setAmount('');
                setNote('');
                setFromAccount(accounts[0] || '');
                setToAccount(accounts[1] || '');
              }
            }
          ]
        );
      } else {
        const errorMsg = debitResponse.message || creditResponse.message || 'Unknown error occurred';
        Alert.alert('Transfer Failed', errorMsg);
      }
    } catch (error) {
      Alert.alert('Transfer Failed', error instanceof Error ? error.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form and close
    setAmount('');
    setNote('');
    setFromAccount(accounts[0] || '');
    setToAccount(accounts[1] || '');
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

        <View style={styles.content}>
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
    padding: SPACING.XL,
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