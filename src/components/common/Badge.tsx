import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from './Text';

export type BadgeVariant =
  | 'primary'
  | 'accent'
  | 'distinction'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';

export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  style,
  textStyle,
}) => {
  const { colors, spacing, borderRadius } = useTheme();

  const getVariantStyles = (): { bg: string; textCol: 'primary' | 'accent' | 'distinction' | 'success' | 'warning' | 'danger' | 'info' | 'secondary' } => {
    switch (variant) {
      case 'primary':
        return { bg: colors.primaryContainer, textCol: 'primary' };
      case 'accent':
        return { bg: colors.accentContainer, textCol: 'accent' };
      case 'distinction':
        return { bg: colors.distinctionContainer, textCol: 'distinction' };
      case 'success':
        return { bg: colors.successContainer, textCol: 'success' };
      case 'warning':
        return { bg: colors.warningContainer, textCol: 'warning' };
      case 'danger':
        return { bg: colors.dangerContainer, textCol: 'danger' };
      case 'info':
        return { bg: colors.infoContainer, textCol: 'info' };
      case 'neutral':
      default:
        return { bg: colors.surfaceVariant, textCol: 'secondary' };
    }
  };

  const { bg, textCol } = getVariantStyles();

  const paddingVertical = size === 'sm' ? 2 : 4;
  const paddingHorizontal = size === 'sm' ? spacing.xs + 2 : spacing.sm + 2;

  const containerStyle: ViewStyle = {
    backgroundColor: bg,
    paddingVertical,
    paddingHorizontal,
    borderRadius: borderRadius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  };

  return (
    <View style={[containerStyle, style]}>
      {icon && <View style={{ marginRight: 4 }}>{icon}</View>}
      <Text
        variant="badge"
        color={textCol}
        style={textStyle}
      >
        {label}
      </Text>
    </View>
  );
};
