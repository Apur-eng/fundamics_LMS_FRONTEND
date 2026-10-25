import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import {
  SplashScreen,
  LoginScreen,
  RegisterScreen,
  ApplicationStatusScreen,
  ForgotPasswordScreen,
  ResetPasswordScreen,
} from '../../features/auth';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="ApplicationStatus"
        component={ApplicationStatusScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
};
