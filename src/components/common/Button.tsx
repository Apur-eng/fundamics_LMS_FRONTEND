import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
  StyleProp,
} from 'react-native';
import { useTheme } from '../../theme';
import { Text, TextColor } from './Text';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'outline'
  | 'ghost'
  | 'danger';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const { colors, spacing, borderRadius, shadows } = useTheme();

  const getContainerStyle = (): ViewStyle => {
    let bg = colors.primary;
    let borderColor = 'transparent';
    let borderWidth = 0;
    let shadowStyle = shadows.none;

    switch (variant) {
      case 'primary':
        bg = disabled ? colors.border : colors.primary;
        shadowStyle = disabled ? shadows.none : shadows.sm;
        break;
      case 'accent':
        bg = disabled ? colors.border : colors.accent;
        shadowStyle = disabled ? shadows.none : shadows.sm;
        break;
      case 'secondary':
        bg = disabled ? colors.surfaceVariant : colors.surfaceVariant;
        borderColor = colors.border;
        borderWidth = 1;
        break;
      case 'outline':
        bg = 'transparent';
        borderColor = disabled ? colors.border : colors.primary;
        borderWidth = 1.5;
        break;
      case 'ghost':
        bg = 'transparent';
        break;
      case 'danger':
        bg = disabled ? colors.border : colors.danger;
        shadowStyle = disabled ? shadows.none : shadows.sm;
        break;
    }

    let paddingVertical: number = spacing.md;
    let paddingHorizontal: number = spacing.xl;
    let minHeight = 48;

    if (size === 'sm') {
      paddingVertical = spacing.xs + 2;
      paddingHorizontal = spacing.md;
      minHeight = 36;
    } else if (size === 'lg') {
      paddingVertical = spacing.lg;
      paddingHorizontal = spacing.xxl;
      minHeight = 54;
    }

    return {
      backgroundColor: bg,
      borderColor,
      borderWidth,
      borderRadius: borderRadius.md,
      paddingVertical,
      paddingHorizontal,
      minHeight,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: fullWidth ? 'stretch' : 'auto',
      opacity: disabled && variant !== 'primary' ? 0.6 : 1,
      ...shadowStyle,
    };
  };

  const getTextColor = (): TextColor => {
    if (disabled) return 'muted';
    switch (variant) {
      case 'primary':
      case 'accent':
      case 'danger':
        return 'inverse';
      case 'outline':
      case 'ghost':
        return 'primary';
      case 'secondary':
        return 'primary';
      default:
        return 'inverse';
    }
  };

  const textVariant = size === 'sm' ? 'buttonSmall' : 'button';

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled || loading}
      style={[getContainerStyle(), style]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.onPrimary}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && (
            <View style={[styles.iconLeft, { marginRight: spacing.sm }]}>{icon}</View>
          )}
          <Text
            variant={textVariant}
            color={getTextColor()}
            style={[styles.buttonText, textStyle]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <View style={[styles.iconRight, { marginLeft: spacing.sm }]}>{icon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
  },
});
