/**
 * Settings Screen - Fintech-Level UI
 * Professional settings interface matching Revolut/N26 style
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
  Linking,
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

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(err => 
      Alert.alert('Error', 'Failed to open link')
    );
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:shaun@siamoon.com').catch(err =>
      Alert.alert('Error', 'Could not open email client')
    );
  };

  const handleRateApp = () => {
    // iOS App Store link - replace with actual app ID when published
    const appStoreUrl = 'https://apps.apple.com/app/id123456789';
    handleOpenLink(appStoreUrl);
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
      {/* Header: Profile Card */}
      <TouchableOpacity style={styles.profileCard} activeOpacity={0.7}>
        <View style={styles.profileIconContainer}>
          <LogoBM size={40} />
        </View>
        <Text style={styles.profileName}>{user?.displayName || user?.name || 'User'}</Text>
        <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
        <Text style={styles.profileRole}>Role: {user?.role || 'Admin'}</Text>
      </TouchableOpacity>

      {/* Section: Account */}
      <Text style={styles.sectionLabel}>ACCOUNT</Text>
      <View style={styles.card}>
        <SettingsRow
          icon="business-outline"
          label="Company Name"
          value={account?.companyName || 'N/A'}
        />
        <View style={styles.divider} />
        <SettingsRow
          icon="card-outline"
          label="Account ID"
          value={account?.accountId || 'N/A'}
        />
        <View style={styles.divider} />
        <SettingsRow
          icon="person-outline"
          label="Role"
          value={user?.role || 'Admin'}
        />
        <View style={styles.divider} />
        <SettingsRow
          icon="ribbon-outline"
          label="Subscription"
          value="Free"
        />
      </View>

      {/* Section: Personalization */}
      <Text style={styles.sectionLabel}>PERSONALIZATION</Text>
      <View style={styles.card}>
        <SettingsRow
          icon="color-palette-outline"
          label="Theme"
          value="Dark"
        />
        <View style={styles.divider} />
        <SettingsRow
          icon="globe-outline"
          label="Language"
          value="English"
        />
        <View style={styles.divider} />
        <SettingsRow
          icon="cash-outline"
          label="Currency Format"
          value="THB"
        />
      </View>

      {/* Section: About */}
      <Text style={styles.sectionLabel}>ABOUT</Text>
      <View style={styles.card}>
        <SettingsRow
          icon="information-circle-outline"
          label="App Version"
          value="1.1.0"
        />
        <View style={styles.divider} />
        <SettingsRow
          icon="cloud-outline"
          label="API Endpoint"
          value="accounting.siamoon.com"
        />
        <View style={styles.divider} />
        <TouchableOpacity onPress={() => handleOpenLink('https://accounting.siamoon.com/terms')}>
          <SettingsRow
            icon="document-text-outline"
            label="Terms of Service"
            showChevron
          />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity onPress={() => handleOpenLink('https://accounting.siamoon.com/privacy')}>
          <SettingsRow
            icon="shield-checkmark-outline"
            label="Privacy Policy"
            showChevron
          />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity onPress={handleContactSupport}>
          <SettingsRow
            icon="mail-outline"
            label="Contact Support"
            showChevron
          />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity onPress={handleRateApp}>
          <SettingsRow
            icon="star-outline"
            label="Rate Us"
            showChevron
          />
        </TouchableOpacity>
      </View>

      {/* Section: Logout */}
      <Text style={styles.sectionLabel}>LOGOUT</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#fff" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>BookMate – Personal Expense Tracker</Text>
        <Text style={styles.footerTextSmall}>Powered by Sia Moon Company Limited</Text>
      </View>
    </ScrollView>
  );
}

// Reusable Settings Row Component
interface SettingsRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  showChevron?: boolean;
}

function SettingsRow({ icon, label, value, showChevron }: SettingsRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={22} color={COLORS.TEXT_SECONDARY} />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <View style={styles.rowRight}>
        {value && <Text style={styles.rowValue}>{value}</Text>}
        {showChevron && (
          <Ionicons name="chevron-forward" size={20} color={COLORS.TEXT_MUTED} />
        )}
      </View>
    </View>
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
    paddingTop: SPACING.LG,
  },

  // Profile Card (Header)
  profileCard: {
    backgroundColor: COLORS.CARD_SECONDARY,
    borderRadius: COMPONENT_RADIUS.card,
    padding: SPACING.XXL,
    marginBottom: SPACING.XXL,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    ...SHADOWS.MEDIUM,
  },
  profileIconContainer: {
    width: 80,
    height: 80,
    borderRadius: COMPONENT_RADIUS.avatarSquare,
    backgroundColor: COLORS.BRAND_YELLOW,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.LG,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  profileEmail: {
    fontSize: 15,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 6,
  },
  profileRole: {
    fontSize: 13,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_MUTED,
  },

  // Section Labels
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_MUTED,
    marginBottom: SPACING.MD,
    marginTop: SPACING.SM,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    paddingLeft: 4,
  },

  // Card Container
  card: {
    backgroundColor: COLORS.CARD_SECONDARY,
    borderRadius: COMPONENT_RADIUS.card,
    padding: SPACING.LG,
    marginBottom: SPACING.XXL,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    ...SHADOWS.SMALL,
  },

  // Settings Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.MD,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowLabel: {
    fontSize: 15,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_PRIMARY,
    marginLeft: SPACING.MD,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowValue: {
    fontSize: 15,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: COLORS.BORDER,
    marginVertical: 2,
  },

  // Logout Button
  logoutButton: {
    backgroundColor: COLORS.ERROR,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.LG + 2,
    borderRadius: COMPONENT_RADIUS.button,
    marginBottom: SPACING.XXL,
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

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.XXL,
    marginBottom: SPACING.XL,
  },
  footerText: {
    fontSize: 13,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_MUTED,
    marginBottom: 4,
  },
  footerTextSmall: {
    fontSize: 11,
    fontFamily: 'Aileron-Light',
    color: COLORS.TEXT_MUTED,
  },
});
