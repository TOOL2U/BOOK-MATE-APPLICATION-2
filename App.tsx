import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { View, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import { OptionsProvider } from './src/contexts/OptionsContext';
import { ConnectivityBadge } from './src/components/ConnectivityBadge';
import { offlineQueue } from './src/services/offlineQueue';

// Screens
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

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
        <ActivityIndicator size="large" color="#FFF02B" />
      </View>
    );
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
          >
            <Tab.Screen
              name="Manual"
              component={ManualEntryScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="create-outline" size={22} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Upload"
              component={UploadScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="camera" size={22} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Balance"
              component={BalanceScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="wallet-outline" size={22} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="P&L"
              component={PLScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="chart-line" size={22} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Activity"
              component={InboxScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="pulse-outline" size={22} color={color} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </OptionsProvider>
    </SafeAreaProvider>
  );
}

