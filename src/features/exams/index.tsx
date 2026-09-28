import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme';
import { EmptyState } from '../../components/feedback/EmptyState';

export const ExamsPlaceholderScreen: React.FC = () => {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
      <EmptyState
        iconName="clipboard-outline"
        title="Exams & Test Series"
        description="Weekly board simulation tests and unit test schedules will be configured in Phase 2."
      />
    </View>
  );
};
