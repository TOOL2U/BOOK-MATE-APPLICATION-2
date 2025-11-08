import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

export default function LottieTestScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lottie Test Screen</Text>
      <Text style={styles.subtitle}>If you see a yellow pen animating below, Lottie is working!</Text>
      
      <View style={styles.animationContainer}>
        <LottieView
          source={require('../assets/lottie/pen.json')}
          autoPlay
          loop
          style={{ width: 100, height: 100 }}
        />
      </View>

      <Text style={styles.note}>
        Note: Lottie animations do NOT work in Expo Go.{'\n'}
        You must use a Development Build or TestFlight.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 32,
    color: '#FFF02B',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'Aileron-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  animationContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#121212',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  note: {
    fontFamily: 'Aileron-Regular',
    fontSize: 14,
    color: '#4D4D4D',
    textAlign: 'center',
    marginTop: 20,
  },
});
