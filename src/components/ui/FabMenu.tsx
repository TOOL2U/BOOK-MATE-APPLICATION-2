import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SHADOWS } from '../../config/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FabMenuProps {
  onOpenManualEntry: () => void;
  onOpenTransfer: () => void;
}

export default function FabMenu({ onOpenManualEntry, onOpenTransfer }: FabMenuProps) {
  const navigation = useNavigation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(0));
  const [rotateAnim] = useState(new Animated.Value(0));

  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const openMenu = () => {
    setIsMenuOpen(true);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }),
      Animated.spring(rotateAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }),
    ]).start();
  };

  const closeMenu = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsMenuOpen(false);
    });
  };

  const handleManual = () => {
    closeMenu();
    setTimeout(() => {
      onOpenManualEntry();
    }, 250);
  };

  const handleTransfer = () => {
    closeMenu();
    setTimeout(() => {
      onOpenTransfer();
    }, 250);
  };

  const handleUpload = () => {
    closeMenu();
    setTimeout(() => {
      navigation.navigate('Upload' as never);
    }, 250);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const menuScale = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const menuOpacity = scaleAnim;

  return (
    <>
      {/* Menu Overlay Modal */}
      <Modal
        visible={isMenuOpen}
        transparent
        animationType="none"
        onRequestClose={closeMenu}
      >
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.menu,
                  {
                    transform: [{ scale: menuScale }],
                    opacity: menuOpacity,
                  },
                ]}
              >
                {/* Manual Option */}
                <TouchableOpacity
                  style={styles.menuOption}
                  onPress={handleManual}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuIconContainer}>
                    <Ionicons name="create-outline" size={22} color={COLORS.BRAND_YELLOW} />
                  </View>
                  <Text style={styles.menuOptionText}>Manual Entry</Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.menuDivider} />

                {/* Transfer Option */}
                <TouchableOpacity
                  style={styles.menuOption}
                  onPress={handleTransfer}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuIconContainer}>
                    <Ionicons name="swap-horizontal-outline" size={22} color={COLORS.BRAND_YELLOW} />
                  </View>
                  <Text style={styles.menuOptionText}>Transfer</Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.menuDivider} />

                {/* Upload Option */}
                <TouchableOpacity
                  style={styles.menuOption}
                  onPress={handleUpload}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuIconContainer}>
                    <Ionicons name="camera-outline" size={22} color={COLORS.BRAND_YELLOW} />
                  </View>
                  <Text style={styles.menuOptionText}>Upload Receipt</Text>
                </TouchableOpacity>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* FAB Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={toggleMenu}
          activeOpacity={0.8}
        >
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Ionicons name="add" size={28} color={COLORS.BRAND_YELLOW} />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  // Overlay
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    paddingBottom: 170, // Position menu above FAB
  },
  
  // Menu
  menu: {
    backgroundColor: COLORS.CARD_PRIMARY,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    marginHorizontal: 60,
    marginBottom: 20,
    overflow: 'hidden',
    ...SHADOWS.LARGE,
  },
  
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    minHeight: 56,
  },
  
  menuIconContainer: {
    width: 32,
    alignItems: 'center',
    marginRight: 16,
  },
  
  menuOptionText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
    fontFamily: 'Aileron-Regular',
    fontWeight: '500',
    flex: 1,
  },
  
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.BORDER,
    marginHorizontal: 20,
  },
  
  // FAB
  fabContainer: {
    position: 'absolute',
    bottom: 55, // Position above bottom nav bar
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
    pointerEvents: 'box-none', // Allow touches to pass through to elements below
  },
  
  fab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.CARD_PRIMARY,
    borderWidth: 2,
    borderColor: COLORS.BRAND_YELLOW,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.LARGE,
    // Additional elevation for Android
    elevation: 8,
    pointerEvents: 'auto', // FAB itself captures touches
  },
});
