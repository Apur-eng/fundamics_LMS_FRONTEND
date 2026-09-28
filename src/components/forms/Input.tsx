import React, { useState } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Text } from '../common/Text';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string | null;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  isPassword = false,
  containerStyle,
  inputStyle,
  required = false,
  secureTextEntry,
  onFocus,
  onBlur,
  ...rest
}) => {
  const { colors, spacing, borderRadius, typography } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureVisible, setIsSecureVisible] = useState(false);

  const isActuallySecure = isPassword ? !isSecureVisible : secureTextEntry;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const getBorderColor = (): string => {
    if (error) return colors.danger;
    if (isFocused) return colors.borderFocus;
    return colors.border;
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <View style={styles.labelRow}>
          <Text variant="subtitle" color="secondary" style={styles.labelText}>
            {label}
          </Text>
          {required && (
            <Text variant="caption" color="danger" style={{ marginLeft: 2 }}>
              *
            </Text>
          )}
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.surface,
            borderColor: getBorderColor(),
            borderWidth: isFocused || error ? 1.5 : 1,
            borderRadius: borderRadius.md,
            paddingHorizontal: spacing.md,
          },
          inputStyle,
        ]}
      >
        {leftIcon && <View style={[styles.iconLeft, { marginRight: spacing.sm }]}>{leftIcon}</View>}

        <TextInput
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isActuallySecure}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            styles.textInput,
            {
              ...typography.body,
              color: colors.textPrimary,
              height: 48,
            },
          ]}
          {...rest}
        />

        {isPassword ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsSecureVisible((prev) => !prev)}
            style={[styles.iconRight, { marginLeft: spacing.sm }]}
            accessibilityRole="button"
            accessibilityLabel={isSecureVisible ? 'Hide password' : 'Show password'}
          >
            <Ionicons
              name={isSecureVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        ) : (
          rightIcon && (
            <View style={[styles.iconRight, { marginLeft: spacing.sm }]}>{rightIcon}</View>
          )
        )}
      </View>

      {error ? (
        <Text variant="caption" color="danger" style={{ marginTop: spacing.xs }}>
          {error}
        </Text>
      ) : helperText ? (
        <Text variant="caption" color="muted" style={{ marginTop: spacing.xs }}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  labelText: {
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    paddingVertical: 0,
  },
  iconLeft: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
