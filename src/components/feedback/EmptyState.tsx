import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Text } from '../common/Text';
import { Button } from '../common/Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  actionTitle?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  iconName = 'file-tray-outline',
  actionTitle,
  onAction,
  style,
}) => {
  const { colors, spacing, borderRadius } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: colors.surfaceVariant,
            borderRadius: borderRadius.full,
            marginBottom: spacing.lg,
          },
        ]}
      >
        <Ionicons name={iconName} size={40} color={colors.textSecondary} />
      </View>

      <Text variant="h3" color="primary" align="center" style={{ marginBottom: spacing.xs }}>
        {title}
      </Text>

      <Text
        variant="body"
        color="secondary"
        align="center"
        style={{ marginBottom: actionTitle && onAction ? spacing.lg : 0, maxWidth: 280 }}
      >
        {description}
      </Text>

      {actionTitle && onAction && (
        <Button
          title={actionTitle}
          onPress={onAction}
          variant="outline"
          size="sm"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
