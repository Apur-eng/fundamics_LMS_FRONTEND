import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme';
import { EmptyState } from '../../components/feedback/EmptyState';

export const ResultsPlaceholderScreen: React.FC = () => {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
      <EmptyState
        iconName="trophy-outline"
        title="Results & Ranker Analytics"
        description="Detailed test score breakdowns, percentiles, and progress reports will be available here."
      />
    </View>
  );
};
