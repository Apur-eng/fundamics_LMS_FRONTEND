import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme';
import { EmptyState } from '../../components/feedback/EmptyState';

export const AssignmentsPlaceholderScreen: React.FC = () => {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
      <EmptyState
        iconName="document-text-outline"
        title="Assignments & Problem Sets"
        description="Homework, daily practice problem sheets (DPPs), and chapter notes will appear here."
      />
    </View>
  );
};
