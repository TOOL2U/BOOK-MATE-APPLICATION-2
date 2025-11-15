/**
 * Login Screen
 * User authentication with email and password
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { login } from '../services/authService';
import { COLORS, SHADOWS, SPACING } from '../config/theme';
import { COMPONENT_RADIUS } from '../constants/borderRadius';
import LogoBM from '../components/LogoBM';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validation
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setLoading(true);
    const startTime = Date.now();
    console.log('⏱️ Login started...');

    try {
      const loginStart = Date.now();
      const response = await login(email.trim().toLowerCase(), password);
      const loginEnd = Date.now();
      console.log(`⏱️ Login API call took: ${loginEnd - loginStart}ms`);

      if (response.success) {
        // Success - navigate to main app
        console.log('✅ Login successful:', response.user?.email);
        const beforeSuccess = Date.now();
        onLoginSuccess();
        const afterSuccess = Date.now();
        console.log(`⏱️ onLoginSuccess() took: ${afterSuccess - beforeSuccess}ms`);
        console.log(`⏱️ Total login process: ${afterSuccess - startTime}ms`);
      } else {
        // Show error message from API
        Alert.alert(
          'Login Failed',
          response.error || 'Unable to login. Please check your credentials and try again.'
        );
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Network error. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo/Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <LogoBM size={100} />
          </View>
          <Text style={styles.title}>BOOKMATE</Text>
          <Text style={styles.subtitle}>Personal Expense Tracker</Text>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="your.email@example.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textContentType="password"
              autoComplete="password"
              editable={!loading}
              onSubmitEditing={handleLogin}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Log In</Text>
            )}
          </TouchableOpacity>

          {/* Info Text */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Don't have an account? Contact your admin to set up BookMate for your business.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.LG,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: 'BebasNeue-Regular',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
    letterSpacing: 0.5,
  },
  form: {
    backgroundColor: COLORS.CARD_PRIMARY,
    borderRadius: COMPONENT_RADIUS.cardLarge,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    ...SHADOWS.MEDIUM,
  },
  inputContainer: {
    marginBottom: SPACING.LG,
  },
  label: {
    fontSize: 12,
    fontFamily: 'Aileron-Bold',
    fontWeight: '600',
    color: COLORS.BRAND_YELLOW,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: COLORS.CARD_SECONDARY,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: COMPONENT_RADIUS.input,
    padding: 14,
    fontSize: 16,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_PRIMARY,
  },
  button: {
    backgroundColor: COLORS.BRAND_YELLOW,
    borderRadius: COMPONENT_RADIUS.button,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    ...SHADOWS.YELLOW_GLOW,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.BRAND_BLACK,
    fontSize: 18,
    fontFamily: 'Aileron-Bold',
    fontWeight: '600',
    letterSpacing: 1,
  },
  infoContainer: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  infoText: {
    fontSize: 13,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 20,
  },
});
