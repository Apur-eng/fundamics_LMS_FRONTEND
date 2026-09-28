import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme';
import { EmptyState } from '../../components/feedback/EmptyState';

export const AttendancePlaceholderScreen: React.FC = () => {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
      <EmptyState
        iconName="calendar-outline"
        title="Attendance Tracking"
        description="Daily biometric & batch attendance logs will be integrated with the FastAPI backend in Phase 2."
      />
    </View>
  );
};
