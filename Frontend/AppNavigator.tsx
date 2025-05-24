import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ToastProvider } from './src/context/ToastContext';

import 'react-native-get-random-values'
import App from './App';

import Auth from './src/screens/Auth';
import Register from './src/screens/Register';
import ReportListScreen from './src/screens/ReportListScreen';


const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <ToastProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="App">
          <Stack.Screen name="App" component={App} options={{ headerShown: false }} />
          <Stack.Screen name="Auth" component={Auth} options={{ headerShown: false }} />
          <Stack.Screen name="ReportListScreen" component={ReportListScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  )
}