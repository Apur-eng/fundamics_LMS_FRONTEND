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
import { TeacherNavigator } from './TeacherNavigator';
import { AdminNavigator } from './AdminNavigator';

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, userRole } = useAuth();
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

  return (
    <NavigationContainer theme={navigationTheme}>
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : userRole === 'TEACHER' ? (
        <TeacherNavigator />
      ) : userRole === 'ADMIN' ? (
        <AdminNavigator />
      ) : (
        <StudentNavigator />
      )}
    </NavigationContainer>
  );
};
