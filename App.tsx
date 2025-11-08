import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator, Platform } from 'react-native';
import * as Font from 'expo-font';
import * as Haptics from 'expo-haptics';
import { OptionsProvider } from './src/contexts/OptionsContext';
import { ConnectivityBadge } from './src/components/ConnectivityBadge';
import { offlineQueue } from './src/services/offlineQueue';
import AnimatedTabIcon from './src/components/AnimatedTabIcon';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import UploadScreen from './src/screens/UploadScreen';
import ManualEntryScreen from './src/screens/ManualEntryScreen';
import BalanceScreen from './src/screens/BalanceScreen';
import PLScreen from './src/screens/PLScreen';
import InboxScreen from './src/screens/InboxScreen';

const Tab = createBottomTabNavigator();

// Font loading configuration
const loadFonts = async () => {
  await Font.loadAsync({
    'MadeMirage-Regular': require('./assets/fonts/MadeMirage-Regular.otf'),
    'BebasNeue-Regular': require('./assets/fonts/BebasNeue-Regular.ttf'),
    'Aileron-Regular': require('./assets/fonts/Aileron-Regular.otf'),
    'Aileron-Bold': require('./assets/fonts/Aileron-Bold.otf'),
    'Aileron-Light': require('./assets/fonts/Aileron-Light.otf'),
  });
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      // Load fonts
      await loadFonts();
      
      // Initialize offline queue
      await offlineQueue.initialize();
      
      setFontsLoaded(true);
    };

    initializeApp();
  }, []);

  // Handle splash screen finish
  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  // Show loading indicator while fonts are loading (before splash)
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
        <ActivityIndicator size="large" color="#FFF02B" />
      </View>
    );
  }

  // Show branded splash screen after fonts load
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <SafeAreaProvider>
      <OptionsProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Tab.Navigator
            initialRouteName="Manual"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#000000',  // Brand black for navbar
              },
              headerTintColor: '#FFFFFF',    // High-contrast white text
              headerTitleStyle: {
                fontFamily: 'BebasNeue-Regular',
                fontSize: 20,
                letterSpacing: 1,
                textTransform: 'uppercase',
              },
              headerRight: () => (
                <ConnectivityBadge style={{ marginRight: 16 }} />
              ),
              tabBarStyle: {
                backgroundColor: '#000000',  // Brand black background
                borderTopColor: '#4D4D4D',  // Secondary grey border
                height: 90,
                paddingBottom: 25,
                paddingTop: 10,
              },
              tabBarActiveTintColor: '#FFF02B',    // Brand yellow for active state
              tabBarInactiveTintColor: '#4D4D4D',  // Secondary grey for inactive
              tabBarLabelStyle: {
                fontFamily: 'Aileron-Regular',
                fontSize: 12,
                fontWeight: '500',
                letterSpacing: 0.5,
              },
              tabBarIconStyle: {
                marginTop: 5,
              },
            }}
            screenListeners={{
              tabPress: () => {
                // Haptic feedback on tab press (iOS only)
                if (Platform.OS === 'ios') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              },
            }}
          >
            <Tab.Screen
              name="Manual"
              component={ManualEntryScreen}
              options={{
                tabBarIcon: ({ color, size, focused }) => (
                  <AnimatedTabIcon
                    focused={focused}
                    color={color}
                    size={22}
                    name="create-outline"
                    // Enable Lottie when using Development Build or TestFlight
                    // useLottie={true}
                    // lottieSource={require('./assets/lottie/pen.json')}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Upload"
              component={UploadScreen}
              options={{
                tabBarIcon: ({ color, size, focused }) => (
                  <AnimatedTabIcon
                    focused={focused}
                    color={color}
                    size={22}
                    name="camera"
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Balance"
              component={BalanceScreen}
              options={{
                tabBarIcon: ({ color, size, focused }) => (
                  <AnimatedTabIcon
                    focused={focused}
                    color={color}
                    size={22}
                    name="wallet-outline"
                  />
                ),
              }}
            />
            <Tab.Screen
              name="P&L"
              component={PLScreen}
              options={{
                tabBarIcon: ({ color, size, focused }) => (
                  <AnimatedTabIcon
                    focused={focused}
                    color={color}
                    size={22}
                    iconType="material"
                    name="chart-line"
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Activity"
              component={InboxScreen}
              options={{
                tabBarIcon: ({ color, size, focused }) => (
                  <AnimatedTabIcon
                    focused={focused}
                    color={color}
                    size={22}
                    name="pulse-outline"
                  />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </OptionsProvider>
    </SafeAreaProvider>
  );
}

