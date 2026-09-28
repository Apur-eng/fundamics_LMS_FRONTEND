import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../theme';

export type IconButtonVariant = 'ghost' | 'filled' | 'outline';

export interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: number;
  variant?: IconButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel: string;
  style?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 44, // Minimum accessible touch target per WCAG guidelines
  variant = 'ghost',
  disabled = false,
  loading = false,
  accessibilityLabel,
  style,
}) => {
  const { colors, borderRadius } = useTheme();

  const getContainerStyle = (): ViewStyle => {
    let backgroundColor = 'transparent';
    let borderColor = 'transparent';
    let borderWidth = 0;

    if (variant === 'filled') {
      backgroundColor = colors.surfaceVariant;
    } else if (variant === 'outline') {
      borderColor = colors.border;
      borderWidth = 1;
    }

    return {
      width: size,
      height: size,
      borderRadius: borderRadius.full,
      backgroundColor,
      borderColor,
      borderWidth,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? 0.5 : 1,
    };
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || loading}
      style={[getContainerStyle(), style]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : (
        icon
      )}
    </TouchableOpacity>
  );
};
