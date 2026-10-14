import React from 'react';
import { View, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from './Text';
import { Badge, BadgeVariant } from './Badge';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badgeLabel?: string;
  badgeVariant?: BadgeVariant;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  badgeLabel,
  badgeVariant = 'neutral',
  actionLabel,
  onAction,
  style,
}) => {
  const { spacing } = useTheme();

  return (
    <View style={[styles.container, { marginBottom: spacing.sm }, style]}>
      <View style={styles.titleCol}>
        <View style={styles.titleRow}>
          <Text variant="h3" color="primary" weight="700">
            {title}
          </Text>
          {badgeLabel && (
            <Badge
              label={badgeLabel}
              variant={badgeVariant}
              size="sm"
              style={{ marginLeft: spacing.sm }}
            />
          )}
        </View>

        {subtitle && (
          <Text variant="caption" color="secondary" style={{ marginTop: 2 }}>
            {subtitle}
          </Text>
        )}
      </View>

      {actionLabel && onAction && (
        <TouchableOpacity
          onPress={onAction}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          style={styles.actionBtn}
        >
          <Text variant="buttonSmall" color="accent" weight="600">
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleCol: {
    flex: 1,
    paddingRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});
