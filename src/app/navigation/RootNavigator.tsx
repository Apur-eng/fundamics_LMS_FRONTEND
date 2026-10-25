import React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  Theme as NavigationThemeType,
} from '@react-navigation/native';
import { useAuth } from '../providers/AuthContext';
import { useTheme } from '../../theme';
import { AuthNavigator } from './AuthNavigator';
import { StudentNavigator } from './StudentNavigator';
import { SplashScreen } from '../../features/auth/screens/SplashScreen';

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isHydrating } = useAuth();
  const { colors, isDark } = useTheme();

  const baseTheme = isDark ? DarkTheme : DefaultTheme;

  const navigationTheme: NavigationThemeType = {
    ...baseTheme,
    dark: isDark,
    colors: {
      ...baseTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.border,
      notification: colors.accent,
    },
  };

  const linking = {
    prefixes: [
      'fundamics://',
      'https://*.fundamics.in',
      'http://localhost:8081',
      'http://localhost:19006',
    ],
    config: {
      screens: {
        ResetPassword: 'reset-password',
        ForgotPassword: 'forgot-password',
        Login: 'login',
        Register: 'register',
        ApplicationStatus: 'status',
      },
    },
  };

  if (isHydrating) {
    return <SplashScreen standalone />;
  }

  return (
    <NavigationContainer theme={navigationTheme} linking={linking}>
      {!isAuthenticated ? <AuthNavigator /> : <StudentNavigator />}
    </NavigationContainer>
  );
};
