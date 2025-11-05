import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../config/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, style, elevated = false, padding = 'md' }: CardProps) {
  const getPaddingStyle = () => {
    if (padding === 'sm') return styles.paddingSM;
    if (padding === 'md') return styles.paddingMD;
    if (padding === 'lg') return styles.paddingLG;
    return null;
  };

  return (
    <View style={[styles.card, elevated && styles.elevated, padding !== 'none' && getPaddingStyle(), style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.SURFACE_1,
    borderRadius: RADIUS.LG,
    borderWidth: 1,
    borderColor: `${COLORS.YELLOW}80`,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 3,
  },
  elevated: {
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 6,
  },
  paddingSM: { padding: SPACING.MD },
  paddingMD: { padding: SPACING.LG },
  paddingLG: { padding: SPACING.XL },
});
