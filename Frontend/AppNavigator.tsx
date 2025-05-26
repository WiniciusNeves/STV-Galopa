import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { ToastProvider } from './src/context/ToastContext';
import { AuthProvider } from './src/context/AuthContext';

import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
enableScreens(); // Precisa estar antes da navegação

import 'react-native-get-random-values';

import App from './App';
import Auth from './src/screens/Auth';
import Register from './src/screens/Register';
import ReportListScreen from './src/screens/ReportListScreen';

// ⬅️ Adicione isso
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <SafeAreaProvider> {/* ✅ Adicionado aqui */}
      <AuthProvider>
        <ToastProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="App" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="App" component={App} />
              <Stack.Screen name="Auth" component={Auth} />
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen name="ReportListScreen" component={ReportListScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </ToastProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
