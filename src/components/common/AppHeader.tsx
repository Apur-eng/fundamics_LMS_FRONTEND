import React from 'react';
import { View, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Text } from './Text';
import { Badge } from './Badge';

export interface AppHeaderProps {
  title: string;
  subtitle?: string;
  badgeLabel?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  badgeLabel,
  showBack = false,
  onBack,
  rightAction,
  style,
}) => {
  const { colors, spacing, borderRadius } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
          paddingTop: Math.max(insets.top, 12),
          paddingBottom: spacing.md,
          paddingHorizontal: spacing.screenPadding,
        },
        style,
      ]}
    >
      <View style={styles.contentRow}>
        {showBack && (
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
            style={[
              styles.backButton,
              {
                backgroundColor: colors.surfaceVariant,
                borderRadius: borderRadius.full,
                marginRight: spacing.sm,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        )}

        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <Text variant="h3" color="primary" weight="700" numberOfLines={1}>
              {title}
            </Text>
            {badgeLabel && (
              <Badge
                label={badgeLabel}
                variant="accent"
                size="sm"
                style={{ marginLeft: spacing.xs }}
              />
            )}
          </View>
          {subtitle && (
            <Text variant="caption" color="secondary" numberOfLines={1} style={{ marginTop: 2 }}>
              {subtitle}
            </Text>
          )}
        </View>

        {rightAction && <View style={styles.rightSlot}>{rightAction}</View>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSlot: {
    marginLeft: 12,
    alignItems: 'center',
  },
});
