import React from 'react';
import {
  View,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '../../theme';

export interface CardProps {
  children: React.ReactNode;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  bordered?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  accessibilityLabel?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  elevation = 'sm',
  bordered = true,
  padding = 'md',
  style,
  onPress,
  accessibilityLabel,
}) => {
  const { colors, spacing, borderRadius, shadows } = useTheme();

  const getPaddingValue = (): number => {
    switch (padding) {
      case 'none':
        return 0;
      case 'sm':
        return spacing.sm;
      case 'md':
        return spacing.md;
      case 'lg':
        return spacing.lg;
      default:
        return spacing.md;
    }
  };

  const cardStyle: ViewStyle = {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: getPaddingValue(),
    borderWidth: bordered ? 1 : 0,
    borderColor: colors.border,
    ...shadows[elevation],
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[cardStyle, style]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
};
