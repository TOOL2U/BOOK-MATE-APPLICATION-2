/**
 * PIN Entry Modal
 * Simple 4-digit PIN verification modal
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING } from '../config/theme';
import { COMPONENT_RADIUS } from '../constants/borderRadius';

interface PinModalProps {
  visible: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const CORRECT_PIN = '1234';

export default function PinModal({ visible, onSuccess, onCancel }: PinModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [opacityAnim] = useState(new Animated.Value(0));
  const [shakeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      setPin('');
      setError(false);
      // Fade in animation
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      // Fade out animation
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  useEffect(() => {
    if (pin.length === 4) {
      // Check PIN
      if (pin === CORRECT_PIN) {
        setError(false);
        // Success - close modal and trigger callback
        setTimeout(() => {
          onSuccess();
          setPin('');
        }, 200);
      } else {
        // Wrong PIN - shake animation
        setError(true);
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: 10,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: -10,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 10,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 50,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Clear PIN after shake
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 300);
        });
      }
    }
  }, [pin]);

  const handleNumberPress = (num: string) => {
    if (pin.length < 4) {
      setPin(pin + num);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const renderPinDots = () => {
    return (
      <Animated.View
        style={[
          styles.pinDotsContainer,
          {
            transform: [{ translateX: shakeAnim }],
          },
        ]}
      >
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              styles.pinDot,
              pin.length > index && styles.pinDotFilled,
              error && styles.pinDotError,
            ]}
          />
        ))}
      </Animated.View>
    );
  };

  const renderKeypad = () => {
    const numbers = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['', '0', 'delete'],
    ];

    return (
      <View style={styles.keypad}>
        {numbers.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map((key, keyIndex) => {
              if (key === '') {
                return <View key={keyIndex} style={styles.keypadButton} />;
              }

              if (key === 'delete') {
                return (
                  <TouchableOpacity
                    key={keyIndex}
                    style={styles.keypadButton}
                    onPress={handleDelete}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="backspace-outline" size={24} color={COLORS.TEXT_PRIMARY} />
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={keyIndex}
                  style={styles.keypadButton}
                  onPress={() => handleNumberPress(key)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.keypadText}>{key}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="none"
      onRequestClose={onCancel}
    >
      <View style={styles.fullScreenContainer}>
        {/* Premium gradient background */}
        <LinearGradient
          colors={['#2a2a2a', '#1a1a1a', '#0d0d0d', '#050505']}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          locations={[0, 0.3, 0.65, 1]}
        />

        <Animated.View
          style={[
            styles.content,
            {
              opacity: opacityAnim,
            },
          ]}
        >
          {/* Top Section - Icon and Title */}
          <View style={styles.topSection}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
              <Ionicons name="close" size={28} color={COLORS.TEXT_SECONDARY} />
            </TouchableOpacity>

            <View style={styles.header}>
              <Ionicons name="lock-closed" size={64} color={COLORS.BRAND_YELLOW} />
              <Text style={styles.title}>Enter PIN</Text>
              <Text style={styles.subtitle}>
                {error ? 'Incorrect PIN. Try again.' : 'Enter your 4-digit PIN to continue'}
              </Text>

              {/* PIN Dots */}
              {renderPinDots()}
            </View>
          </View>

          {/* Bottom Section - Keypad */}
          <View style={styles.bottomSection}>
            {renderKeypad()}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 12,
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
    marginTop: 24,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 48,
    paddingHorizontal: 40,
  },
  pinDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  pinDotFilled: {
    backgroundColor: COLORS.BRAND_YELLOW,
    borderColor: COLORS.BRAND_YELLOW,
  },
  pinDotError: {
    backgroundColor: COLORS.ERROR,
    borderColor: COLORS.ERROR,
  },
  bottomSection: {
    paddingBottom: 40,
    paddingHorizontal: SPACING.LG,
  },
  keypad: {
    alignItems: 'center',
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginBottom: 20,
  },
  keypadButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.CARD_SECONDARY,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadText: {
    fontSize: 28,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
  },
});
