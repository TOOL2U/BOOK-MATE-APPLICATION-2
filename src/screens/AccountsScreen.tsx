/**
 * Accounts Screen (formerly Balance Screen)
 * Revolut-style minimal account list - no balances shown on main screen
 * Tap an account to open AccountDetailModal with full details
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Animated,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { apiService } from '../services/api';
import { COLORS, SHADOWS, SPACING } from '../config/theme';
import { COMPONENT_RADIUS } from '../constants/borderRadius';
import AccountDetailModal from '../components/AccountDetailModal';
import PinModal from '../components/PinModal';
import LogoBM from '../components/LogoBM';

interface AccountSummary {
  id: string;
  name: string;
  balance: number;
  lastUpdated?: string;
}

interface AccountsScreenProps {
  onOpenWizardModal?: () => void;
  onOpenTransferModal?: () => void;
}

export default function AccountsScreen({ onOpenWizardModal, onOpenTransferModal }: AccountsScreenProps) {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [accounts, setAccounts] = useState<AccountSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<AccountSummary | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pendingAccount, setPendingAccount] = useState<AccountSummary | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await apiService.getBalances();
      if (response.ok) {
        // Transform to AccountSummary format
        const accountList: AccountSummary[] = response.balances.map((balance, index) => ({
          id: `account-${index}`,
          name: balance.bankName,
          balance: balance.balance,
          lastUpdated: balance.lastUpdated,
        }));
        setAccounts(accountList);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAccounts();
  };

  const handleAccountPress = (account: AccountSummary) => {
    // Store the account and show PIN modal first
    setPendingAccount(account);
    setPinModalVisible(true);
  };

  const handlePinSuccess = () => {
    // PIN correct - show account detail modal
    setPinModalVisible(false);
    if (pendingAccount) {
      setSelectedAccount(pendingAccount);
      setModalVisible(true);
      setPendingAccount(null);
    }
  };

  const handlePinCancel = () => {
    // PIN cancelled - clear pending account
    setPinModalVisible(false);
    setPendingAccount(null);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedAccount(null), 300); // Wait for animation
  };

  const filteredAccounts = accounts.filter((account) =>
    account.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAccountType = (name: string): string => {
    if (name.toLowerCase().includes('cash')) return 'Cash';
    if (name.toLowerCase().includes('bank')) return 'Bank account';
    return 'Account';
  };

  const getBankLogo = (name: string) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('bangkok bank')) {
      return require('../../assets/icons/Banks/Bangkok_Bank_2023_(English_version)-cropped (1).png');
    }
    if (nameLower.includes('krung thai')) {
      return require('../../assets/icons/Banks/Krung_Thai_Bank_logo.svg-removebg-preview.png');
    }
    return null; // Return null for non-bank accounts (Cash, etc.)
  };

  const renderAccountItem = ({ item }: { item: AccountSummary }) => (
    <PressableAccountCard item={item} onPress={() => handleAccountPress(item)} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="wallet-outline" size={64} color={COLORS.TEXT_MUTED} />
      <Text style={styles.emptyTitle}>No accounts yet</Text>
      <Text style={styles.emptySubtitle}>
        Add an account in the web app to see it here.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.YELLOW} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Premium gradient background */}
      <LinearGradient
        colors={['#2a2a2a', '#1a1a1a', '#0d0d0d', '#050505']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.3, 0.65, 1]}
      />

      <View style={styles.contentWrapper}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Accounts</Text>
          <Text style={styles.subtitle}>Select an account to view details</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={18}
            color={COLORS.TEXT_MUTED}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search accounts"
            placeholderTextColor={COLORS.TEXT_MUTED}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.TEXT_MUTED} />
            </TouchableOpacity>
          )}
        </View>

        {/* Section Label */}
        <Text style={styles.sectionLabel}>YOUR ACCOUNTS</Text>

        {/* Accounts List */}
        <FlatList
          data={filteredAccounts}
          renderItem={renderAccountItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.YELLOW}
            />
          }
          showsVerticalScrollIndicator={false}
        />

        {/* PIN Entry Modal */}
        <PinModal
          visible={pinModalVisible}
          onSuccess={handlePinSuccess}
          onCancel={handlePinCancel}
        />

        {/* Account Detail Modal */}
        <AccountDetailModal
          visible={modalVisible}
          account={selectedAccount}
          onClose={handleCloseModal}
          onAddEntry={onOpenWizardModal}
          onTransfer={onOpenTransferModal}
        />
      </View>
    </View>
  );
}

// Separate component for pressable animation to use hooks properly
const PressableAccountCard = ({ item, onPress }: { item: AccountSummary; onPress: () => void }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.98,
      duration: 120,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 120,
      useNativeDriver: true,
    }).start();
  };

  const getAccountType = (name: string): string => {
    if (name.toLowerCase().includes('cash')) return 'Cash';
    if (name.toLowerCase().includes('bank')) return 'Bank account';
    return 'Account';
  };

  const getBankLogo = (name: string) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('bangkok bank')) {
      return require('../../assets/icons/Banks/Bangkok_Bank_2023_(English_version)-cropped (1).png');
    }
    if (nameLower.includes('krung thai')) {
      return require('../../assets/icons/Banks/Krung_Thai_Bank_logo.svg-removebg-preview.png');
    }
    return null;
  };

  const bankLogo = getBankLogo(item.name);
  const isCash = item.name.toLowerCase().includes('cash');

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.accountCard}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.accountCardContent}>
          {/* Left: Icon */}
          <View style={[styles.accountIcon, (bankLogo || isCash) && styles.accountIconTransparent]}>
            {bankLogo ? (
              <Image 
                source={bankLogo} 
                style={styles.bankLogo}
                resizeMode="contain"
              />
            ) : isCash ? (
              <Ionicons name="cash-outline" size={28} color={COLORS.BRAND_YELLOW} />
            ) : (
              <Text style={styles.accountIconText}>
                {item.name.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>

          {/* Middle: Account name and type */}
          <View style={styles.accountInfo}>
            <Text style={styles.accountName} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.accountType}>{getAccountType(item.name)}</Text>
          </View>

          {/* Right: Chevron */}
          <Ionicons name="chevron-forward" size={20} color={COLORS.TEXT_SECONDARY} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

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
  contentWrapper: {
    flex: 1,
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.LG,
  },
  headerSection: {
    marginTop: 0,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'BebasNeue-Regular',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 1,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CARD_SECONDARY,
    borderRadius: COMPONENT_RADIUS.searchBar,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_PRIMARY,
    padding: 0,
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_MUTED,
    letterSpacing: 1,
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: SPACING.XL,
  },
  accountCard: {
    backgroundColor: COLORS.CARD_SECONDARY,
    borderRadius: COMPONENT_RADIUS.card,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 10,
    ...SHADOWS.SMALL,
  },
  accountCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.LG,
  },
  accountIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.CARD_SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.MD,
  },
  accountIconTransparent: {
    backgroundColor: 'transparent',
  },
  bankLogo: {
    width: 40,
    height: 40,
  },
  accountIconText: {
    fontSize: 20,
    fontFamily: 'BebasNeue-Regular',
    color: COLORS.BRAND_YELLOW,
  },
  accountInfo: {
    flex: 1,
    marginRight: SPACING.SM,
  },
  accountName: {
    fontSize: 16,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  accountType: {
    fontSize: 13,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_MUTED,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
    marginTop: SPACING.LG,
    marginBottom: SPACING.SM,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});
