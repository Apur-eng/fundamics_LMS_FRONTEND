import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Text } from '../common/Text';
import { Button } from '../common/Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  devDetails?: string;
  code?: string;
  onRetry?: () => void;
  style?: ViewStyle;
}

const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  devDetails,
  code,
  onRetry,
  style,
}) => {
  const { colors, spacing, borderRadius } = useTheme();

  // Deduce smart title and icon based on error message/code if title was not explicitly customized
  let resolvedTitle = title;
  let iconName: keyof typeof Ionicons.glyphMap = 'alert-circle-outline';

  const lowerMsg = (message || '').toLowerCase();
  const lowerCode = (code || '').toLowerCase();

  if (
    lowerMsg.includes('connect') ||
    lowerMsg.includes('network') ||
    lowerMsg.includes('cors') ||
    lowerCode.includes('connection') ||
    lowerCode.includes('network')
  ) {
    resolvedTitle = title || 'Connection Issue';
    iconName = 'cloud-offline-outline';
  } else if (
    lowerMsg.includes('session') ||
    lowerMsg.includes('sign in') ||
    lowerMsg.includes('unauthorized') ||
    lowerCode.includes('401')
  ) {
    resolvedTitle = title || 'Authentication Required';
    iconName = 'lock-closed-outline';
  } else if (
    lowerMsg.includes('permission') ||
    lowerMsg.includes('restricted') ||
    lowerMsg.includes('forbidden') ||
    lowerCode.includes('403')
  ) {
    resolvedTitle = title || 'Access Restricted';
    iconName = 'shield-half-outline';
  } else if (
    lowerMsg.includes('not found') ||
    lowerCode.includes('404')
  ) {
    resolvedTitle = title || 'Resource Not Found';
    iconName = 'search-outline';
  } else if (
    lowerMsg.includes('validation') ||
    lowerCode.includes('422')
  ) {
    resolvedTitle = title || 'Validation Error';
    iconName = 'document-text-outline';
  } else if (
    lowerMsg.includes('server') ||
    lowerCode.includes('500')
  ) {
    resolvedTitle = title || 'Server Error';
    iconName = 'server-outline';
  } else {
    resolvedTitle = title || 'Something went wrong';
    iconName = 'alert-circle-outline';
  }

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
        <Ionicons name={iconName} size={40} color={colors.danger} />
      </View>

      <Text variant="h3" color="danger" align="center" style={{ marginBottom: spacing.xs }}>
        {resolvedTitle}
      </Text>

      <Text
        variant="body"
        color="secondary"
        align="center"
        style={{ marginBottom: onRetry || (isDev && devDetails) ? spacing.md : 0, maxWidth: 320 }}
      >
        {message}
      </Text>

      {isDev && devDetails && (
        <Text
          variant="caption"
          color="muted"
          align="center"
          style={{ marginBottom: onRetry ? spacing.md : 0, maxWidth: 320, fontFamily: 'monospace' }}
        >
          {`[Dev Diagnostic: ${devDetails}]`}
        </Text>
      )}

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
