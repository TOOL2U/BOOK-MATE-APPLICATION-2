import React, { useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

interface AnimatedTabIconProps {
  focused: boolean;
  color: string;
  size: number;
  iconType?: 'ionicons' | 'material';
  name: string;
  useLottie?: boolean;
  lottieSource?: any;
}

export default function AnimatedTabIcon({
  focused,
  color,
  size,
  iconType = 'ionicons',
  name,
  useLottie = false,
  lottieSource,
}: AnimatedTabIconProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const lottieRef = useRef<LottieView>(null);
  const [lottieError, setLottieError] = useState(false);

  useEffect(() => {
    if (useLottie && lottieRef.current && !lottieError) {
      // Play Lottie animation when focused
      if (focused) {
        console.log('Playing Lottie animation for:', name);
        lottieRef.current.play();
      } else {
        lottieRef.current.reset();
      }
    }
    
    // Standard animation for non-Lottie icons
    if (!useLottie || lottieError) {
      if (focused) {
        // Animate icon when tab becomes active
        Animated.parallel([
          Animated.spring(scale, {
            toValue: 1.3,
            friction: 4,
            tension: 50,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.spring(translateY, {
              toValue: -6,
              friction: 4,
              tension: 50,
              useNativeDriver: true,
            }),
            Animated.spring(translateY, {
              toValue: 0,
              friction: 4,
              tension: 50,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      } else {
        // Return to normal
        Animated.parallel([
          Animated.spring(scale, {
            toValue: 1,
            friction: 5,
            tension: 100,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  }, [focused, scale, translateY, useLottie, lottieError, name]);

  const IconComponent = iconType === 'material' ? MaterialCommunityIcons : Ionicons;

  // If using Lottie, render Lottie animation with fallback
  if (useLottie && lottieSource && !lottieError) {
    return (
      <View style={{ width: size * 2, height: size * 2, justifyContent: 'center', alignItems: 'center' }}>
        <LottieView
          ref={lottieRef}
          source={lottieSource}
          style={{ width: size * 2, height: size * 2 }}
          loop={false}
          autoPlay={focused}
          resizeMode="contain"
          onAnimationFailure={(error) => {
            console.error('Lottie animation failed:', error);
            setLottieError(true);
          }}
        />
        {/* Fallback icon in case Lottie doesn't load */}
        {lottieError && (
          <View style={{ position: 'absolute' }}>
            <IconComponent name={name as any} size={size} color={color} />
          </View>
        )}
      </View>
    );
  }

  // Default: render standard animated icon
  return (
    <Animated.View
      style={{
        transform: [
          { scale },
          { translateY },
        ],
      }}
    >
      <IconComponent name={name as any} size={size} color={color} />
    </Animated.View>
  );
}
