import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import LogoBM from '../components/LogoBM';
import { COLORS } from '../config/theme';

interface SplashScreenProps {
  onFinish?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Initial fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Single growing animation from small to big (no loop)
    Animated.timing(scaleAnim, {
      toValue: 1.3,
      duration: 2400,
      useNativeDriver: true,
    }).start();

    // Auto-dismiss after longer duration
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, 3000); // 3 seconds total

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, onFinish]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <LogoBM size={88} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BRAND_BLACK,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;
