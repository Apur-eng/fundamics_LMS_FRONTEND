
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StateProvider } from './src/app/providers/StateProvider';
import { RootNavigator } from './src/app/navigation/RootNavigator';
import { useTheme } from './src/theme';

const MainApp: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator />
    </>
  );
};

export default function App() {
  return (
    <StateProvider>
      <MainApp />
    </StateProvider>
  );
}
