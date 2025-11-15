import React, { useEffect, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import * as Font from 'expo-font';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { OptionsProvider, useOptions } from './src/contexts/OptionsContext';
import { offlineQueue } from './src/services/offlineQueue';
import { isAuthenticated } from './src/services/authService';
import { apiService } from './src/services/api';
import AnimatedTabIcon from './src/components/AnimatedTabIcon';
import FabMenu from './src/components/ui/FabMenu';
import WizardManualEntry from './src/components/WizardManualEntry';
import TransferModal from './src/components/TransferModal';
import CustomTabBar from './src/components/CustomTabBar';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import UploadScreen from './src/screens/UploadScreen';
import ManualEntryScreen from './src/screens/ManualEntryScreen';
import BalanceScreen from './src/screens/BalanceScreen';
import PLScreen from './src/screens/PLScreen';
import InboxScreen from './src/screens/InboxScreen';
import SettingsScreen from './src/screens/SettingsScreen';

import { COLORS } from './src/config/theme';

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

// Settings button component for header
const SettingsButton = ({ navigation }: any) => (
  <TouchableOpacity
    onPress={() => {
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      navigation.navigate('Settings');
    }}
    style={{ marginRight: 16 }}
  >
    <Ionicons name="settings-outline" size={24} color={COLORS.TEXT_PRIMARY} />
  </TouchableOpacity>
);

// Main navigation component with FAB and modals
function MainNavigator({ onLogout }: { onLogout: () => void }) {
  const [wizardModalVisible, setWizardModalVisible] = useState(false);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  
  // Get dropdown options from context
  const { properties, typeOfOperations, typeOfPayments, months } = useOptions();
  
  // Months array for the wizard (now from API)
  // const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  
  // Handle wizard submission
  const handleWizardSubmit = async (data: any) => {
    console.log('🎯 App.tsx: handleWizardSubmit called with data:', JSON.stringify(data, null, 2));
    
    // Log available options for debugging
    console.log('📋 Available months:', months);
    console.log('📋 Available properties:', properties);
    console.log('📋 Available typeOfOperations:', typeOfOperations);
    console.log('📋 Available typeOfPayments:', typeOfPayments);
    
    // Check if submitted values are in the available options
    console.log('✅ Month match:', months.includes(data.month), `"${data.month}"`);
    console.log('✅ Property match:', properties.includes(data.property), `"${data.property}"`);
    console.log('✅ TypeOfOperation match:', typeOfOperations.includes(data.typeOfOperation), `"${data.typeOfOperation}"`);
    console.log('✅ TypeOfPayment match:', typeOfPayments.includes(data.typeOfPayment), `"${data.typeOfPayment}"`);
    
    // Ensure debit and credit are numbers before submitting
    const submissionData = {
      ...data,
      debit: typeof data.debit === 'string' ? parseFloat(data.debit) || 0 : data.debit,
      credit: typeof data.credit === 'string' ? parseFloat(data.credit) || 0 : data.credit,
    };
    
    console.log('📤 App.tsx: Calling apiService.submitTransaction');
    
    const response = await apiService.submitTransaction(submissionData);
    
    console.log('📬 App.tsx: Received response:', JSON.stringify(response, null, 2));
    
    if (!response.ok) {
      console.error('❌ App.tsx: Response not OK, throwing error');
      throw new Error(response.message || 'Failed to submit transaction');
    }
    
    console.log('✅ App.tsx: Transaction submitted successfully');
    return response;
  };

  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        backBehavior="history"
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={({ navigation }) => ({
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
          headerRight: () => <SettingsButton navigation={navigation} />,
          tabBarStyle: {
            backgroundColor: COLORS.BACKGROUND,
            borderTopColor: COLORS.BORDER,
            borderTopWidth: 1,
            height: 90,
            paddingBottom: 25,
            paddingTop: 10,
            paddingLeft: 0,
            paddingRight: 0,
            paddingHorizontal: 0,
          },
          tabBarItemStyle: {
            flex: 1,
          },
          tabBarActiveTintColor: COLORS.BRAND_YELLOW,
          tabBarInactiveTintColor: COLORS.TEXT_SECONDARY,
          tabBarLabelStyle: {
            fontFamily: 'Aileron-Regular',
            fontSize: 11,
            fontWeight: '500',
            letterSpacing: 0.3,
            marginTop: 4,
          },
          tabBarIconStyle: {
            marginTop: 5,
          },
          tabBarAllowFontScaling: false,
        })}
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
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <AnimatedTabIcon
                focused={focused}
                color={color}
                size={20}
                name="home-outline"
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
                size={20}
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
                size={20}
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
                size={20}
                name="pulse-outline"
              />
            ),
          }}
        />
        <Tab.Screen
          name="Manual"
          component={ManualEntryScreen}
          options={{
            tabBarButton: () => null, // Hide from tab bar
          }}
        />
        <Tab.Screen
          name="Upload"
          component={UploadScreen}
          options={{
            tabBarButton: () => null, // Hide from tab bar
          }}
        />
        <Tab.Screen
          name="Settings"
          options={{
            tabBarButton: () => null, // Hide from tab bar
          }}
        >
          {(props) => <SettingsScreen {...props} onLogout={onLogout} />}
        </Tab.Screen>
      </Tab.Navigator>
      
      {/* FAB Menu - Center + Button */}
      <FabMenu
        onOpenManualEntry={() => {
          console.log('FAB: onOpenManualEntry callback triggered');
          setWizardModalVisible(true);
        }}
        onOpenTransfer={() => {
          console.log('FAB: onOpenTransfer callback triggered');
          setTransferModalVisible(true);
        }}
      />
      
      {/* Modals */}
      <WizardManualEntry
        visible={wizardModalVisible}
        onClose={() => {
          console.log('Wizard modal onClose called');
          setWizardModalVisible(false);
        }}
        onSubmit={handleWizardSubmit}
        properties={properties}
        typeOfOperations={typeOfOperations}
        typeOfPayments={typeOfPayments}
        months={months}
      />
      
      <TransferModal
        visible={transferModalVisible}
        onClose={() => {
          console.log('Transfer modal onClose called');
          setTransferModalVisible(false);
        }}
      />
    </>
  );
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [userKey, setUserKey] = useState(0); // Key to force remount on user change

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load fonts (required)
        await loadFonts();
        
        // Initialize offline queue (graceful failure - non-blocking)
        await offlineQueue.initialize().catch((error) => {
          console.warn('Offline queue initialization failed, continuing...', error);
          // Don't block app launch - queue can sync later
        });
        
        // Check authentication status
        const isAuth = await isAuthenticated();
        setAuthenticated(isAuth);
        setAuthChecked(true);
        
        setFontsLoaded(true);
      } catch (error) {
        console.error('App initialization failed:', error);
        // Even if fonts fail, still allow app to try loading
        // User will see fallback system fonts
        setFontsLoaded(true);
        setAuthChecked(true);
      }
    };

    initializeApp();
  }, []);

  // Handle splash screen finish
  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  // Handle successful login - increment key to force fresh data load
  const handleLoginSuccess = () => {
    const startTime = Date.now();
    console.log('🔑 User logged in - forcing fresh data load');
    setAuthenticated(true);
    setUserKey(prev => prev + 1); // Force remount with fresh data
    const endTime = Date.now();
    console.log(`⏱️ handleLoginSuccess took: ${endTime - startTime}ms`);
  };

  // Handle logout (can be called from any screen)
  const handleLogout = () => {
    console.log('🚪 User logged out - clearing cached data');
    setAuthenticated(false);
    setUserKey(prev => prev + 1); // Force remount to clear old data
  };

  // Show loading indicator while fonts are loading (before splash)
  if (!fontsLoaded || !authChecked) {
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

  // Show login screen if not authenticated
  if (!authenticated) {
    return (
      <SafeAreaProvider>
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <OptionsProvider key={userKey}>
        <NavigationContainer>
          <StatusBar style="light" />
          <MainNavigator onLogout={handleLogout} />
        </NavigationContainer>
      </OptionsProvider>
    </SafeAreaProvider>
  );
}


