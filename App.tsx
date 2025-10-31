import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Screens
import UploadScreen from './src/screens/UploadScreen';
import ManualEntryScreen from './src/screens/ManualEntryScreen';
import BalanceScreen from './src/screens/BalanceScreen';
import PLScreen from './src/screens/PLScreen';
import InboxScreen from './src/screens/InboxScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Tab.Navigator
          initialRouteName="Manual"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1E293B',
            },
            headerTintColor: '#F1F5F9',
            tabBarStyle: {
              backgroundColor: '#1E293B',
              borderTopColor: '#334155',
            },
            tabBarActiveTintColor: '#3B82F6',
            tabBarInactiveTintColor: '#94A3B8',
          }}
        >
          <Tab.Screen
            name="Manual"
            component={ManualEntryScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="create-outline" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Upload"
            component={UploadScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="camera" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Balance"
            component={BalanceScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="wallet-outline" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="P&L"
            component={PLScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="chart-line" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Inbox"
            component={InboxScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="list-outline" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

