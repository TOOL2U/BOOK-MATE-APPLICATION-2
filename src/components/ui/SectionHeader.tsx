import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../../config/theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.XL,
  },
  title: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 24,
    fontWeight: '400',
    lineHeight: 32,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  subtitle: {
    fontFamily: 'Aileron-Light',
    fontSize: 16,
    fontWeight: '300',
    lineHeight: 24,
    color: COLORS.TEXT_SECONDARY,
  },
});