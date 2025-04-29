import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ToastProvider } from './src/context/ToastContext';

import App from './App';
import ReportListScreen from './src/screens/ReportListScreen';

import Auth from './src/screens/Auth';


const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <ToastProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="App">
          <Stack.Screen name="App" component={App} options={{ headerShown: false }} />
          <Stack.Screen name="Auth" component={Auth} options={{ headerShown: false }} />
          <Stack.Screen name="ReportListScreen" component={ReportListScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  )
}