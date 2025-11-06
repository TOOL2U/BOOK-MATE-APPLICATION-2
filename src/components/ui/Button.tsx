import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../config/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  loading = false,
  style,
  textStyle
}: ButtonProps) {
  const getButtonStyle = () => {
    const baseStyle = [styles.base, styles[size]];
    
    switch (variant) {
      case 'primary':
        return [...baseStyle, styles.primary, disabled && styles.disabled];
      case 'secondary':
        return [...baseStyle, styles.secondary, disabled && styles.disabled];
      case 'outline':
        return [...baseStyle, styles.outline, disabled && styles.disabled];
      default:
        return [...baseStyle, styles.primary, disabled && styles.disabled];
    }
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text, styles[`${size}Text`]];
    
    switch (variant) {
      case 'primary':
        return [...baseTextStyle, styles.primaryText];
      case 'secondary':
        return [...baseTextStyle, styles.secondaryText];
      case 'outline':
        return [...baseTextStyle, styles.outlineText];
      default:
        return [...baseTextStyle, styles.primaryText];
    }
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'primary' ? COLORS.BLACK : COLORS.YELLOW} />
      ) : (
        <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.MD,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.SMALL,
  },
  
  // Sizes
  small: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    minHeight: 44,
  },
  large: {
    paddingHorizontal: SPACING.XL,
    paddingVertical: SPACING.LG,
    minHeight: 52,
  },
  
  // Variants
  primary: {
    backgroundColor: COLORS.YELLOW,  // Brand yellow background
    ...SHADOWS.YELLOW_GLOW,          // Yellow glow effect
  },
  secondary: {
    backgroundColor: COLORS.SURFACE_2,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.YELLOW,
  },
  
  // Text base
  text: {
    fontFamily: 'Aileron-Bold',
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  
  // Text sizes
  smallText: {
    fontSize: 14,
    lineHeight: 18,
  },
  mediumText: {
    fontSize: 16,
    lineHeight: 20,
  },
  largeText: {
    fontSize: 18,
    lineHeight: 22,
  },
  
  // Text variants
  primaryText: {
    color: COLORS.BLACK,  // Black text on yellow background
  },
  secondaryText: {
    color: COLORS.TEXT_PRIMARY,  // White text
  },
  outlineText: {
    color: COLORS.YELLOW,  // Yellow text for outline button
  },
  
  disabled: {
    opacity: 0.5,
  },
});