import React from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from '../common/Text';

export interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  fullScreen = false,
  style,
}) => {
  const { colors, spacing } = useTheme();

  return (
    <View
      style={[
        styles.container,
        fullScreen && [styles.fullScreen, { backgroundColor: colors.background }],
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityLabel={message}
    >
      <ActivityIndicator size="large" color={colors.primary} />
      {message && (
        <Text
          variant="subtitle"
          color="secondary"
          style={{ marginTop: spacing.md, textAlign: 'center' }}
        >
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
