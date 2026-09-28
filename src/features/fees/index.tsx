import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme';
import { EmptyState } from '../../components/feedback/EmptyState';

export const FeesPlaceholderScreen: React.FC = () => {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
      <EmptyState
        iconName="receipt-outline"
        title="Fee Management"
        description="Fee installment schedules, digital receipts, and online fee reconciliation module in development."
      />
    </View>
  );
};
