/**
 * Settings Screen
 * User profile and app settings including logout
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { logout, getUser, getAccount } from '../services/authService';
import type { User, Account } from '../types/session';
import { COLORS, SHADOWS, SPACING } from '../config/theme';
import { COMPONENT_RADIUS } from '../constants/borderRadius';
import LogoBM from '../components/LogoBM';

interface SettingsScreenProps {
  onLogout: () => void;
}

export default function SettingsScreen({ onLogout }: SettingsScreenProps) {
  const [user, setUser] = useState<User | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const [userData, accountData] = await Promise.all([
        getUser(),
        getAccount(),
      ]);
      setUser(userData);
      setAccount(accountData);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              onLogout();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.YELLOW} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* User Profile Section */}
      <View style={styles.section}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <LogoBM size={48} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>
      </View>

      {/* Account Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="business-outline" size={20} color={COLORS.GREY_SECONDARY} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Company</Text>
            <Text style={styles.infoValue}>{account?.companyName || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="document-text-outline" size={20} color={COLORS.GREY_SECONDARY} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Account ID</Text>
            <Text style={styles.infoValue}>{account?.accountId || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* App Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Application</Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="information-circle-outline" size={20} color={COLORS.GREY_SECONDARY} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.1.0 (Multi-Tenant)</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="cloud-outline" size={20} color={COLORS.GREY_SECONDARY} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>API</Text>
            <Text style={styles.infoValue}>accounting.siamoon.com</Text>
          </View>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#fff" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>BookMate - Personal Expense Tracker</Text>
        <Text style={styles.footerTextSmall}>Powered by Sia Moon Company Limited</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    padding: SPACING.LG,
  },
  section: {
    backgroundColor: COLORS.CARD_PRIMARY,
    borderRadius: COMPONENT_RADIUS.cardLarge,
    padding: SPACING.LG,
    marginBottom: SPACING.LG,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Aileron-Bold',
    color: COLORS.YELLOW,
    marginBottom: SPACING.LG,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: COMPONENT_RADIUS.avatarSquare,
    backgroundColor: COLORS.CARD_PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.LG,
    borderWidth: 2,
    borderColor: COLORS.BRAND_YELLOW,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'BebasNeue-Regular',
    color: COLORS.YELLOW,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.LG,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 10,
    fontFamily: 'Aileron-Bold',
    color: COLORS.YELLOW,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_PRIMARY,
  },
  logoutButton: {
    backgroundColor: COLORS.ERROR,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.LG,
    borderRadius: COMPONENT_RADIUS.button,
    marginTop: 8,
    marginBottom: 24,
    ...SHADOWS.MEDIUM,
  },
  logoutButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 18,
    fontFamily: 'Aileron-Bold',
    fontWeight: '600',
    marginLeft: 8,
    letterSpacing: 1,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  footerTextSmall: {
    fontSize: 12,
    fontFamily: 'Aileron-Light',
    color: COLORS.TEXT_MUTED,
  },
});
