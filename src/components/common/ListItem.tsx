import React from 'react';
import { View, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Text } from './Text';
import { Badge, BadgeVariant } from './Badge';

export interface ListItemProps {
  title: string;
  subtitle?: string;
  caption?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  badgeLabel?: string;
  badgeVariant?: BadgeVariant;
  showChevron?: boolean;
  onPress?: () => void;
  bordered?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  caption,
  leftIcon,
  rightElement,
  badgeLabel,
  badgeVariant = 'neutral',
  showChevron = false,
  onPress,
  bordered = true,
  style,
}) => {
  const { colors, spacing, borderRadius } = useTheme();

  const content = (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.md,
          borderRadius: borderRadius.md,
          borderColor: colors.border,
          borderWidth: bordered ? 1 : 0,
        },
        style,
      ]}
    >
      {leftIcon && <View style={[styles.leftSlot, { marginRight: spacing.md }]}>{leftIcon}</View>}

      <View style={styles.centerSlot}>
        <View style={styles.titleRow}>
          <Text variant="body" color="primary" weight="600" numberOfLines={1} style={{ flex: 1 }}>
            {title}
          </Text>
          {badgeLabel && (
            <Badge label={badgeLabel} variant={badgeVariant} size="sm" style={{ marginLeft: spacing.xs }} />
          )}
        </View>

        {subtitle && (
          <Text variant="caption" color="secondary" numberOfLines={2} style={{ marginTop: 2 }}>
            {subtitle}
          </Text>
        )}

        {caption && (
          <Text variant="caption" color="muted" numberOfLines={1} style={{ marginTop: 4 }}>
            {caption}
          </Text>
        )}
      </View>

      {rightElement && (
        <View style={[styles.rightSlot, { marginLeft: spacing.sm }]}>{rightElement}</View>
      )}

      {showChevron && (
        <Ionicons
          name="chevron-forward"
          size={18}
          color={colors.textMuted}
          style={{ marginLeft: spacing.xs }}
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  leftSlot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerSlot: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rightSlot: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
