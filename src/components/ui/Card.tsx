import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../config/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  glowEffect?: boolean;
}

export function Card({ children, style, elevated = false, padding = 'md', glowEffect = false }: CardProps) {
  const getPaddingStyle = () => {
    if (padding === 'sm') return styles.paddingSM;
    if (padding === 'md') return styles.paddingMD;
    if (padding === 'lg') return styles.paddingLG;
    return null;
  };

  const getShadowStyle = () => {
    if (glowEffect) return SHADOWS.YELLOW_GLOW;
    if (elevated) return SHADOWS.MEDIUM;
    return SHADOWS.BLACK_SMALL;
  };

  return (
    <View style={[
      styles.card, 
      elevated && getShadowStyle(), 
      glowEffect && getShadowStyle(),
      padding !== 'none' && getPaddingStyle(), 
      style
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.SURFACE_1,
    borderRadius: RADIUS.LG,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  paddingSM: { 
    padding: SPACING.MD 
  },
  paddingMD: { 
    padding: SPACING.LG 
  },
  paddingLG: { 
    padding: SPACING.XL 
  },
});