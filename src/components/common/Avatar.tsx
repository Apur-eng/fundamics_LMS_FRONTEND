import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import { useTheme } from '../../theme';
import { Text } from './Text';

export interface AvatarProps {
  name: string;
  source?: ImageSourcePropType | { uri: string };
  size?: number;
  variant?: 'circle' | 'rounded';
  accent?: 'primary' | 'accent' | 'distinction';
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  source,
  size = 44,
  variant = 'circle',
  accent = 'primary',
  style,
}) => {
  const { colors, borderRadius } = useTheme();

  const getInitials = (fullName: string): string => {
    if (!fullName) return 'FU';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getBackgroundColor = (): string => {
    switch (accent) {
      case 'accent':
        return colors.accentContainer;
      case 'distinction':
        return colors.distinctionContainer;
      case 'primary':
      default:
        return colors.primaryContainer;
    }
  };

  const getTextColor = (): 'accent' | 'distinction' | 'primary' => {
    switch (accent) {
      case 'accent':
        return 'accent';
      case 'distinction':
        return 'distinction';
      case 'primary':
      default:
        return 'primary';
    }
  };

  const radius = variant === 'circle' ? size / 2 : borderRadius.md;

  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: radius,
    backgroundColor: getBackgroundColor(),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  if (source) {
    return (
      <View style={[containerStyle, style]}>
        <Image
          source={source}
          style={{ width: size, height: size, borderRadius: radius }}
          resizeMode="cover"
        />
      </View>
    );
  }

  const fontSize = Math.round(size * 0.38);

  return (
    <View style={[containerStyle, style]}>
      <Text
        color={getTextColor()}
        weight="700"
        style={{ fontSize, lineHeight: fontSize + 4 }}
      >
        {getInitials(name)}
      </Text>
    </View>
  );
};
