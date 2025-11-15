/**
 * Activity Screen (Revolut-Style)
 * Upgraded to match the premium polish of Accounts & P&L screens
 * Features: Activity summary, search/filters, grouped transactions, detail modal
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Modal,
  Animated,
  Easing,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { apiService } from '../services/api';
import { COLORS, SHADOWS, SPACING } from '../config/theme';
import { COMPONENT_RADIUS } from '../constants/borderRadius';
import type { TransactionWithRow } from '../types';
import BrandedAlert from '../components/BrandedAlert';
import { useBrandedAlert } from '../hooks/useBrandedAlert';

type InboxScreenRouteProp = RouteProp<{ Inbox: { highlightLatest?: boolean } }, 'Inbox'>;
type FilterType = 'all' | 'income' | 'expense' | 'transfer';

interface GroupedTransaction {
  title: string;
  data: TransactionWithRow[];
}

export default function InboxScreen() {
  const route = useRoute<InboxScreenRouteProp>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<TransactionWithRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithRow | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(40));
  const [opacityAnim] = useState(new Animated.Value(0));

  // Branded alert hook
  const {
    alertConfig,
    isVisible: alertVisible,
    hideAlert,
    showSuccess,
    showError,
    showConfirm,
  } = useBrandedAlert();

  const fetchInbox = async () => {
    try {
      const response = await apiService.getInbox();
      
      if (response.ok && response.data) {
        setTransactions(response.data || []);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error('InboxScreen: Fetch error:', error);
      showError('Error', 'Failed to fetch transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  useEffect(() => {
    if (route.params?.highlightLatest) {
      fetchInbox();
    }
  }, [route.params?.highlightLatest]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchInbox();
  };

  const handleDelete = (rowNumber: number) => {
    showConfirm(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      async () => {
        try {
          await apiService.deleteReceipt(rowNumber);
          showSuccess('Success', 'Transaction deleted');
          fetchInbox();
        } catch (error) {
          showError('Error', 'Failed to delete transaction');
        }
      },
      'Delete',
      'Cancel'
    );
  };

  const handleTransactionPress = (transaction: TransactionWithRow) => {
    setSelectedTransaction(transaction);
    setDetailModalVisible(true);
    
    // Animate modal
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDetailModal = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 40,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setDetailModalVisible(false);
      setSelectedTransaction(null);
      slideAnim.setValue(40);
      opacityAnim.setValue(0);
    });
  };

  // Helper functions
  const getMonthNumber = (month: string) => {
    const months: { [key: string]: string } = {
      JAN: '01', FEB: '02', MAR: '03', APR: '04', MAY: '05', JUN: '06',
      JUL: '07', AUG: '08', SEP: '09', OCT: '10', NOV: '11', DEC: '12',
    };
    return months[month] || '01';
  };

  const formatDateHeader = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/');
    const date = new Date(year + '-' + getMonthNumber(month) + '-' + day);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  };

  const parseDate = (dateHeader: string): Date => {
    if (dateHeader === 'Today') {
      return new Date();
    } else if (dateHeader === 'Yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday;
    } else {
      // Parse format like "15 Nov 2025"
      return new Date(dateHeader);
    }
  };

  // Calculate monthly summary
  const monthlySummary = useMemo(() => {
    const currentMonth = new Date().toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const currentYear = new Date().getFullYear().toString();
    
    const thisMonthTransactions = transactions.filter(
      tx => tx.month === currentMonth && tx.year === currentYear
    );
    
    // Calculate income from pure income transactions only (credit > 0 and debit === 0)
    const totalIncome = thisMonthTransactions.reduce((sum, tx) => {
      return tx.credit > 0 && tx.debit === 0 ? sum + tx.credit : sum;
    }, 0);
    
    // Calculate expenses from pure expense transactions only (debit > 0 and credit === 0)
    const totalExpenses = thisMonthTransactions.reduce((sum, tx) => {
      return tx.debit > 0 && tx.credit === 0 ? sum + tx.debit : sum;
    }, 0);
    
    const net = totalIncome - totalExpenses;
    
    return {
      count: thisMonthTransactions.length,
      income: totalIncome,
      expenses: totalExpenses,
      net,
    };
  }, [transactions]);

  // Filter and group transactions
  const groupedTransactions = useMemo(() => {
    let filtered = transactions;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tx =>
        tx.detail?.toLowerCase().includes(query) ||
        tx.property?.toLowerCase().includes(query) ||
        tx.typeOfOperation?.toLowerCase().includes(query) ||
        tx.typeOfPayment?.toLowerCase().includes(query) ||
        tx.ref?.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(tx => {
        const isTransfer = tx.typeOfOperation?.toLowerCase().includes('transfer');
        const hasBothValues = tx.debit > 0 && tx.credit > 0;
        
        if (filterType === 'income') {
          // Only show pure income: credit > 0, debit must be 0, and NOT a transfer
          return tx.credit > 0 && tx.debit === 0 && !isTransfer && !hasBothValues;
        }
        if (filterType === 'expense') {
          // Only show pure expenses: debit > 0, credit must be 0, and NOT a transfer
          return tx.debit > 0 && tx.credit === 0 && !isTransfer && !hasBothValues;
        }
        if (filterType === 'transfer') {
          // Transfers can be identified by typeOfOperation or having both debit and credit
          return isTransfer || hasBothValues;
        }
        return true;
      });
    }

    // Group by date
    const groups: { [key: string]: TransactionWithRow[] } = {};
    filtered.forEach(tx => {
      const dateKey = tx.day + '/' + tx.month + '/' + tx.year;
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(tx);
    });

    // Convert to section list format
    return Object.entries(groups)
      .map(([date, data]) => ({
        title: formatDateHeader(date),
        data,
      }))
      .sort((a, b) => {
        // Sort by date descending (newest first)
        const dateA = parseDate(a.title);
        const dateB = parseDate(b.title);
        return dateB.getTime() - dateA.getTime();
      });
  }, [transactions, searchQuery, filterType]);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getBankLogo = (typeOfPayment: string) => {
    const nameLower = typeOfPayment?.toLowerCase() || '';
    if (nameLower.includes('bangkok bank')) {
      return require('../../assets/icons/Banks/Bangkok_Bank_2023_(English_version)-cropped (1).png');
    }
    if (nameLower.includes('krung thai')) {
      return require('../../assets/icons/Banks/Krung_Thai_Bank_logo.svg-removebg-preview.png');
    }
    return null;
  };

  const isCashTransaction = (typeOfPayment: string) => {
    return typeOfPayment?.toLowerCase().includes('cash');
  };

  const getTransactionType = (tx: TransactionWithRow): 'income' | 'expense' | 'transfer' => {
    if (tx.typeOfOperation?.toLowerCase().includes('transfer')) return 'transfer';
    if (tx.credit > 0) return 'income';
    return 'expense';
  };

  const renderFilterChip = (type: FilterType, label: string) => (
    <TouchableOpacity
      key={type}
      style={[styles.filterChip, filterType === type && styles.filterChipActive]}
      onPress={() => setFilterType(type)}
      activeOpacity={0.7}
    >
      <Text style={[styles.filterChipText, filterType === type && styles.filterChipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderTransactionCard = (transaction: TransactionWithRow) => {
    const txType = getTransactionType(transaction);
    const amount = txType === 'expense' ? transaction.debit : transaction.credit;
    const bankLogo = getBankLogo(transaction.typeOfPayment);
    const isCash = isCashTransaction(transaction.typeOfPayment);

    return (
      <TouchableOpacity
        style={styles.transactionCard}
        onPress={() => handleTransactionPress(transaction)}
        activeOpacity={0.7}
      >
        {/* Left: Account Avatar */}
        <View style={[styles.accountAvatar, (bankLogo || isCash) && styles.accountAvatarTransparent]}>
          {bankLogo ? (
            <Image source={bankLogo} style={styles.bankLogoSmall} resizeMode="contain" />
          ) : isCash ? (
            <Ionicons name="cash-outline" size={20} color={COLORS.BRAND_YELLOW} />
          ) : (
            <Text style={styles.accountAvatarText}>
              {transaction.typeOfPayment?.charAt(0).toUpperCase() || 'T'}
            </Text>
          )}
        </View>

        {/* Middle: Info Block */}
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionTitle} numberOfLines={1}>
            {transaction.detail || transaction.typeOfOperation || 'Transaction'}
          </Text>
          <Text style={styles.transactionMeta} numberOfLines={1}>
            {transaction.property} · {transaction.typeOfPayment}
          </Text>
          {transaction.ref && (
            <Text style={styles.transactionDetail} numberOfLines={1}>
              {transaction.typeOfOperation} · Ref: {transaction.ref}
            </Text>
          )}
        </View>

        {/* Right: Amount & Delete */}
        <View style={styles.transactionRight}>
          <View style={styles.amountContainer}>
            <Ionicons
              name={
                txType === 'income'
                  ? 'arrow-up'
                  : txType === 'expense'
                  ? 'arrow-down'
                  : 'swap-horizontal'
              }
              size={12}
              color={
                txType === 'income'
                  ? COLORS.REVENUE_GREEN
                  : txType === 'expense'
                  ? COLORS.EXPENSE_RED
                  : COLORS.BRAND_YELLOW
              }
              style={styles.amountIcon}
            />
            <Text
              style={[
                styles.transactionAmount,
                {
                  color:
                    txType === 'income'
                      ? COLORS.REVENUE_GREEN
                      : txType === 'expense'
                      ? COLORS.EXPENSE_RED
                      : COLORS.BRAND_YELLOW,
                },
              ]}
            >
              {txType === 'expense' ? '-' : '+'}฿{formatCurrency(amount)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDelete(transaction.rowNumber)}
            style={styles.deleteIconButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={16} color={COLORS.EXPENSE_RED} style={{ opacity: 0.6 }} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.BRAND_YELLOW} />
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
        {/* Header Section - Activity Summary */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Activity</Text>
          <Text style={styles.subtitle}>
            This month • {monthlySummary.count} transaction{monthlySummary.count !== 1 ? 's' : ''}
          </Text>
          <Text
            style={[
              styles.netAmount,
              {
                color:
                  monthlySummary.net > 0
                    ? COLORS.REVENUE_GREEN
                    : monthlySummary.net < 0
                    ? COLORS.EXPENSE_RED
                    : COLORS.TEXT_SECONDARY,
              },
            ]}
          >
            Net: {monthlySummary.net >= 0 ? '+' : ''}฿{formatCurrency(Math.abs(monthlySummary.net))}
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={COLORS.TEXT_MUTED} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions"
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

        {/* Filter Chips */}
        <View style={styles.filterRow}>
          {renderFilterChip('all', 'All')}
          {renderFilterChip('income', 'Income')}
          {renderFilterChip('expense', 'Expenses')}
          {renderFilterChip('transfer', 'Transfers')}
        </View>

        {/* Grouped Transaction List */}
        {groupedTransactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color={COLORS.TEXT_MUTED} />
            <Text style={styles.emptyTitle}>No transactions yet</Text>
            <Text style={styles.emptySubtitle}>Add your first transaction to see it here</Text>
          </View>
        ) : (
          <SectionList
            sections={groupedTransactions}
            keyExtractor={(item) => item.rowNumber.toString()}
            renderItem={({ item }) => renderTransactionCard(item)}
            renderSectionHeader={({ section }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{section.title}</Text>
                <View style={styles.sectionHeaderDivider} />
              </View>
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={COLORS.BRAND_YELLOW}
                colors={[COLORS.BRAND_YELLOW]}
              />
            }
          />
        )}
      </View>

      {/* Transaction Detail Modal */}
      <Modal
        visible={detailModalVisible}
        transparent
        animationType="none"
        onRequestClose={closeDetailModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={closeDetailModal}
          />

          <Animated.View
            style={[
              styles.modalContainer,
              {
                opacity: opacityAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <SafeAreaView style={styles.modalContent} edges={['bottom']}>
              {/* Premium gradient background */}
              <LinearGradient
                colors={['#2a2a2a', '#1a1a1a', '#0d0d0d', '#050505']}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                locations={[0, 0.3, 0.65, 1]}
                pointerEvents="none"
              />

              {/* Handle */}
              <View style={styles.modalHandle} />

              {/* Close Button */}
              <TouchableOpacity style={styles.modalCloseButton} onPress={closeDetailModal}>
                <Ionicons name="close" size={24} color={COLORS.TEXT_SECONDARY} />
              </TouchableOpacity>

              {selectedTransaction && (
                <View style={styles.modalBody}>
                  {/* Big Amount */}
                  <Text
                    style={[
                      styles.modalAmount,
                      {
                        color:
                          getTransactionType(selectedTransaction) === 'income'
                            ? COLORS.REVENUE_GREEN
                            : getTransactionType(selectedTransaction) === 'expense'
                            ? COLORS.EXPENSE_RED
                            : COLORS.BRAND_YELLOW,
                      },
                    ]}
                  >
                    {getTransactionType(selectedTransaction) === 'expense' ? '-' : '+'}฿
                    {formatCurrency(
                      getTransactionType(selectedTransaction) === 'expense'
                        ? selectedTransaction.debit
                        : selectedTransaction.credit
                    )}
                  </Text>

                  {/* Date */}
                  <Text style={styles.modalDate}>
                    {selectedTransaction.day} {selectedTransaction.month} {selectedTransaction.year}
                  </Text>

                  {/* Details Section */}
                  <View style={styles.modalDetailsSection}>
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Property / Person</Text>
                      <Text style={styles.modalDetailValue}>{selectedTransaction.property}</Text>
                    </View>

                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Type of Operation</Text>
                      <Text style={styles.modalDetailValue}>{selectedTransaction.typeOfOperation}</Text>
                    </View>

                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Type of Payment</Text>
                      <Text style={styles.modalDetailValue}>{selectedTransaction.typeOfPayment}</Text>
                    </View>

                    {selectedTransaction.ref && (
                      <View style={styles.modalDetailRow}>
                        <Text style={styles.modalDetailLabel}>Reference</Text>
                        <Text style={styles.modalDetailValue}>{selectedTransaction.ref}</Text>
                      </View>
                    )}

                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Detail</Text>
                      <Text style={[styles.modalDetailValue, styles.modalDetailValueMultiline]}>
                        {selectedTransaction.detail}
                      </Text>
                    </View>
                  </View>

                  {/* Footer */}
                  <Text style={styles.modalFooter}>Synced to: BookMate P&L 2025</Text>
                </View>
              )}
            </SafeAreaView>
          </Animated.View>
        </View>
      </Modal>

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
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
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
  netAmount: {
    fontSize: 20,
    fontFamily: 'Aileron-Bold',
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
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  filterChip: {
    backgroundColor: COLORS.CARD_SECONDARY,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterChipActive: {
    borderColor: COLORS.BRAND_YELLOW,
    backgroundColor: COLORS.CARD_SECONDARY,
  },
  filterChipText: {
    fontSize: 13,
    fontFamily: 'Aileron-SemiBold',
    color: COLORS.TEXT_SECONDARY,
  },
  filterChipTextActive: {
    color: COLORS.BRAND_YELLOW,
  },
  listContent: {
    paddingBottom: SPACING.XL,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  sectionHeaderText: {
    fontSize: 13,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_SECONDARY,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginRight: 12,
  },
  sectionHeaderDivider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CARD_SECONDARY,
    borderRadius: COMPONENT_RADIUS.card,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: 14,
    marginBottom: 10,
    ...SHADOWS.SMALL,
  },
  accountAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.CARD_PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountAvatarTransparent: {
    backgroundColor: 'transparent',
  },
  accountAvatarText: {
    fontSize: 16,
    fontFamily: 'BebasNeue-Regular',
    color: COLORS.BRAND_YELLOW,
  },
  bankLogoSmall: {
    width: 32,
    height: 32,
  },
  transactionInfo: {
    flex: 1,
    marginRight: 12,
  },
  transactionTitle: {
    fontSize: 15,
    fontFamily: 'Aileron-SemiBold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  transactionMeta: {
    fontSize: 12,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 2,
  },
  transactionDetail: {
    fontSize: 11,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_MUTED,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  amountIcon: {
    marginRight: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: 'Aileron-Bold',
  },
  deleteIconButton: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Aileron-Bold',
    color: COLORS.TEXT_PRIMARY,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    height: '80%',
    maxHeight: '80%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    backgroundColor: COLORS.BACKGROUND,
    ...SHADOWS.LARGE,
  },
  modalContent: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 18,
    right: 22,
    zIndex: 10,
    padding: 8,
  },
  modalBody: {
    paddingHorizontal: SPACING.LG,
    paddingTop: 32,
  },
  modalAmount: {
    fontSize: 48,
    fontFamily: 'BebasNeue-Regular',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalDate: {
    fontSize: 14,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 32,
  },
  modalDetailsSection: {
    gap: 20,
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  modalDetailLabel: {
    fontSize: 13,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_SECONDARY,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  modalDetailValue: {
    fontSize: 14,
    fontFamily: 'Aileron-SemiBold',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'right',
    flex: 1,
  },
  modalDetailValueMultiline: {
    fontFamily: 'Aileron-Regular',
  },
  modalFooter: {
    fontSize: 11,
    fontFamily: 'Aileron-Regular',
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
  },
});
