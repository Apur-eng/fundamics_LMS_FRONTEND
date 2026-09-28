import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme';
import { EmptyState } from '../../components/feedback/EmptyState';

export const NotificationsPlaceholderScreen: React.FC = () => {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
      <EmptyState
        iconName="notifications-outline"
        title="Institutional Notices"
        description="Official batch announcements, schedule changes, and parent communication updates will be shown here."
      />
    </View>
  );
};
