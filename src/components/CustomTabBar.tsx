import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import AnimatedTabIcon from './AnimatedTabIcon';
import { COLORS } from '../config/theme';

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  // Only show tabs that should be visible (Home, Balance, P&L, Activity)
  const visibleTabNames = ['Home', 'Balance', 'P&L', 'Activity'];
  const visibleRoutes = state.routes.filter(route => visibleTabNames.includes(route.name));

  return (
    <View style={styles.tabBar}>
      {visibleRoutes.map((route) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.routes.indexOf(route) === state.index;

        const onPress = () => {
          if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Get icon configuration for each tab
        const getIconProps = () => {
          switch (route.name) {
            case 'Home':
              return { name: 'home-outline', iconType: undefined };
            case 'Balance':
              return { name: 'wallet-outline', iconType: undefined };
            case 'P&L':
              return { name: 'chart-line', iconType: 'material' as const };
            case 'Activity':
              return { name: 'pulse-outline', iconType: undefined };
            default:
              return { name: 'ellipse-outline', iconType: undefined };
          }
        };

        const iconProps = getIconProps();

        // Adjust spacing for Balance (move left) and P&L (move right)
        const getTabStyle = () => {
          if (route.name === 'Balance') {
            return [styles.tabItem, { marginRight: 20 }];
          } else if (route.name === 'P&L') {
            return [styles.tabItem, { marginLeft: 20 }];
          }
          return styles.tabItem;
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={getTabStyle()}
          >
            <AnimatedTabIcon
              focused={isFocused}
              color={isFocused ? COLORS.BRAND_YELLOW : COLORS.TEXT_SECONDARY}
              size={20}
              name={iconProps.name}
              iconType={iconProps.iconType}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: isFocused ? COLORS.BRAND_YELLOW : COLORS.TEXT_SECONDARY },
              ]}
            >
              {label as string}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.BACKGROUND,
    borderTopColor: COLORS.BORDER,
    borderTopWidth: 1,
    height: 90,
    paddingBottom: 25,
    paddingTop: 10,
    paddingHorizontal: 0,
    width: '100%',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 0,
  },
  tabLabel: {
    fontFamily: 'Aileron-Regular',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.3,
    marginTop: 4,
  },
});
