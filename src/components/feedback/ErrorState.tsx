import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Text } from '../common/Text';
import { Button } from '../common/Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  style?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  style,
}) => {
  const { colors, spacing, borderRadius } = useTheme();

  return (
    <View style={[styles.container, style]} accessibilityRole="alert">
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: colors.dangerContainer,
            borderRadius: borderRadius.full,
            marginBottom: spacing.lg,
          },
        ]}
      >
        <Ionicons name="alert-circle-outline" size={40} color={colors.danger} />
      </View>

      <Text variant="h3" color="danger" align="center" style={{ marginBottom: spacing.xs }}>
        {title}
      </Text>

      <Text
        variant="body"
        color="secondary"
        align="center"
        style={{ marginBottom: onRetry ? spacing.lg : 0, maxWidth: 300 }}
      >
        {message}
      </Text>

      {onRetry && (
        <Button
          title="Try Again"
          onPress={onRetry}
          variant="secondary"
          size="sm"
          icon={<Ionicons name="reload-outline" size={16} color={colors.textPrimary} />}
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
