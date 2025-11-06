import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../config/theme';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'error' | 'warning' | 'info' | 'default';
  size?: 'small' | 'medium' | 'large';
}

export function Badge({ label, variant = 'default', size = 'medium' }: BadgeProps) {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'success': return COLORS.SUCCESS;
      case 'error': return COLORS.ERROR;
      case 'warning': return COLORS.WARNING;
      case 'info': return COLORS.INFO;
      default: return COLORS.SURFACE_2;
    }
  };

  const getTextColor = () => {
    if (variant === 'default') return COLORS.TEXT_PRIMARY;
    return COLORS.BLACK;
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <Text style={[styles.text, { color: getTextColor() }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.XS,
    borderRadius: RADIUS.SM,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: 'Aileron-Bold',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    letterSpacing: 0.2,
  },
});
