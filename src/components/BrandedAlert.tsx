import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import { COLORS, SHADOWS, SPACING, RADIUS } from '../config/theme';

interface BrandedAlertProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function BrandedAlert({
  visible,
  title,
  message,
  type = 'info',
  onClose,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel',
}: BrandedAlertProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          iconColor: COLORS.SUCCESS,
          borderColor: COLORS.SUCCESS,
          icon: '✓',
        };
      case 'error':
        return {
          iconColor: COLORS.ERROR,
          borderColor: COLORS.ERROR,
          icon: '✕',
        };
      case 'warning':
        return {
          iconColor: COLORS.YELLOW,
          borderColor: COLORS.YELLOW,
          icon: '⚠',
        };
      default:
        return {
          iconColor: COLORS.YELLOW,
          borderColor: COLORS.YELLOW,
          icon: 'ℹ',
        };
    }
  };

  const typeStyles = getTypeStyles();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { borderColor: typeStyles.borderColor }]}>
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: typeStyles.iconColor }]}>
            <Text style={styles.icon}>{typeStyles.icon}</Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {onConfirm && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                { backgroundColor: typeStyles.iconColor },
                !onConfirm && styles.singleButton,
              ]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.XL,
  },
  container: {
    backgroundColor: COLORS.GREY_PRIMARY,
    borderRadius: RADIUS.LG,
    borderWidth: 2,
    width: Math.min(width - 40, 320),
    maxWidth: '90%',
    ...SHADOWS.LARGE,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: -30,
    marginBottom: SPACING.LG,
  },
  icon: {
    fontSize: 28,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: SPACING.XL,
    paddingBottom: SPACING.LG,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'BebasNeue-Regular',
    marginBottom: SPACING.SM,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'Aileron-Regular',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.LG,
    paddingBottom: SPACING.LG,
    gap: SPACING.MD,
  },
  button: {
    flex: 1,
    paddingVertical: SPACING.MD,
    borderRadius: RADIUS.MD,
    alignItems: 'center',
  },
  singleButton: {
    marginHorizontal: SPACING.LG,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  confirmButton: {
    // backgroundColor set dynamically based on type
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'Aileron-Bold',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'Aileron-Bold',
  },
});