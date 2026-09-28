import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { Card } from '../../../components/common/Card';

export interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  iconName: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'accent' | 'distinction' | 'danger';
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  iconName,
  variant = 'primary',
  style,
}) => {
  const { colors, spacing, borderRadius } = useTheme();

  const getThemeProps = () => {
    switch (variant) {
      case 'accent':
        return {
          iconColor: colors.accent,
          iconBg: colors.accentContainer,
        };
      case 'distinction':
        return {
          iconColor: colors.distinction,
          iconBg: colors.distinctionContainer,
        };
      case 'danger':
        return {
          iconColor: colors.danger,
          iconBg: colors.dangerContainer,
        };
      case 'primary':
      default:
        return {
          iconColor: colors.primary,
          iconBg: colors.primaryContainer,
        };
    }
  };

  const { iconColor, iconBg } = getThemeProps();

  return (
    <Card elevation="sm" padding="md" style={[{ flex: 1 }, style]}>
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: iconBg,
              borderRadius: borderRadius.md,
            },
          ]}
        >
          <Ionicons name={iconName} size={20} color={iconColor} />
        </View>
      </View>

      <Text
        variant="h2"
        color="primary"
        weight="700"
        style={{ marginTop: spacing.sm }}
      >
        {value}
      </Text>

      <Text variant="caption" color="secondary" style={{ marginTop: 2 }}>
        {label}
      </Text>

      {subValue && (
        <Text variant="caption" color="muted" style={{ marginTop: 4 }}>
          {subValue}
        </Text>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
