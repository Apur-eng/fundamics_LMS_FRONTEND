import React, { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../../theme';
import { AuthProvider } from './AuthContext';

export interface StateProviderProps {
  children: ReactNode;
}

export const StateProvider: React.FC<StateProviderProps> = ({ children }) => {
  return (
    <SafeAreaProvider>
      <ThemeProvider initialMode="light">
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};
