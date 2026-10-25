import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '../../theme';
import { TypographyVariant } from '../../theme/typography';

export type TextColor =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'inverse'
  | 'inverseMuted'
  | 'accent'
  | 'distinction'
  | 'gold'
  | 'emerald'
  | 'navy'
  | 'primaryBlue'
  | 'violet'
  | 'skyBlue'
  | 'amber'
  | 'coral'
  | 'brandBlue'
  | 'brandGreen'
  | 'warmGold'
  | 'danger'
  | 'warning'
  | 'success'
  | 'info';

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: TextColor;
  align?: TextStyle['textAlign'];
  weight?: TextStyle['fontWeight'];
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = 'primary',
  align,
  weight,
  style,
  children,
  ...rest
}) => {
  const { colors, typography } = useTheme();

  const getColor = (): string => {
    switch (color) {
      case 'primary':
        return colors.textPrimary;
      case 'secondary':
        return colors.textSecondary;
      case 'muted':
        return colors.textMuted;
      case 'inverse':
        return colors.textInverse;
      case 'inverseMuted':
        return colors.textInverseMuted;
      case 'emerald':
        return colors.emerald;
      case 'navy':
        return colors.navy;
      case 'primaryBlue':
        return colors.primaryBlue;
      case 'violet':
        return colors.violet;
      case 'skyBlue':
        return colors.skyBlue;
      case 'amber':
        return colors.amber;
      case 'coral':
        return colors.coral;
      case 'brandBlue':
        return colors.brandBlue;
      case 'brandGreen':
        return colors.brandGreen;
      case 'warmGold':
        return colors.warmGold;
      case 'accent':
        return colors.accent;
      case 'gold':
      case 'distinction':
        return colors.distinction;
      case 'danger':
        return colors.danger;
      case 'warning':
        return colors.warning;
      case 'success':
        return colors.success;
      case 'info':
        return colors.info;
      default:
        return colors.textPrimary;
    }
  };

  const textStyle: TextStyle = {
    ...typography[variant],
    color: getColor(),
    ...(align ? { textAlign: align } : {}),
    ...(weight ? { fontWeight: weight } : {}),
  };

  return (
    <RNText style={[textStyle, style]} {...rest}>
      {children}
    </RNText>
  );
};
