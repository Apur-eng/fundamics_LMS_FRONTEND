import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { ColorTheme, lightThemeColors, darkThemeColors } from './colors';
import { typography, Typography } from './typography';
import { spacing, Spacing } from './spacing';
import { borderRadius, BorderRadius } from './borderRadius';
import { shadows } from './shadows';

export interface Theme {
  colors: ColorTheme;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  shadows: typeof shadows;
  isDark: boolean;
}

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setScheme: (mode: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: 'light' | 'dark' | 'system';
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialMode = 'light',
}) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<'light' | 'dark' | 'system'>(initialMode);

  const isDark = useMemo(() => {
    if (mode === 'system') {
      return systemColorScheme === 'dark';
    }
    return mode === 'dark';
  }, [mode, systemColorScheme]);

  const theme: Theme = useMemo(() => ({
    colors: isDark ? darkThemeColors : lightThemeColors,
    typography,
    spacing,
    borderRadius,
    shadows,
    isDark,
  }), [isDark]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setScheme = (newMode: 'light' | 'dark' | 'system') => {
    setMode(newMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context.theme;
};

export const useThemeController = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeController must be used within a ThemeProvider');
  }
  return context;
};
