import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../../theme';
import { Skeleton } from '../../../components/feedback/Skeleton';

export const DashboardSkeleton: React.FC = () => {
  const { colors, spacing, borderRadius } = useTheme();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.container,
        { paddingHorizontal: spacing.screenPadding, paddingTop: spacing.lg, paddingBottom: spacing.massive },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Skeleton */}
      <View
        style={[
          styles.blockPlaceholder,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: borderRadius.lg,
            marginBottom: spacing.lg,
            padding: spacing.cardPadding,
            overflow: 'hidden',
          },
        ]}
      >
        {/* Header top bar — mimics the blue brand band */}
        <Skeleton width="100%" height={44} style={{ marginBottom: 12, marginHorizontal: -16, marginTop: -16, width: undefined, borderRadius: 0 }} />
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Skeleton width="45%" height={12} style={{ marginBottom: 6 }} />
            <Skeleton width="60%" height={22} style={{ marginBottom: 6 }} />
            <Skeleton width="40%" height={12} style={{ marginBottom: 10 }} />
            <Skeleton width="55%" height={24} />
          </View>
        </View>
      </View>

      {/* Day-Wise Attendance Block Skeleton */}
      <View
        style={[
          styles.blockPlaceholder,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: borderRadius.lg,
            marginBottom: spacing.lg,
            padding: spacing.cardPadding,
            overflow: 'hidden',
          },
        ]}
      >
        <Skeleton width="100%" height={40} style={{ marginBottom: 12, marginHorizontal: -16, marginTop: -16, width: undefined, borderRadius: 0 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <Skeleton width="38%" height={40} />
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <Skeleton width={44} height={40} />
            <Skeleton width={44} height={40} />
            <Skeleton width={44} height={40} />
          </View>
        </View>
        <Skeleton width="100%" height={8} style={{ marginBottom: 8, borderRadius: 4 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} width={26} height={11} />
          ))}
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
          {Array.from({ length: 28 }).map((_, i) => (
            <Skeleton key={i} width="12.5%" height={28} borderRadius={borderRadius.xs} style={{ marginVertical: 2, marginHorizontal: '1%' }} />
          ))}
        </View>
      </View>

      {/* Examination Dossier Skeleton */}
      <View
        style={[
          styles.blockPlaceholder,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: borderRadius.lg,
            marginBottom: spacing.lg,
            padding: spacing.cardPadding,
            overflow: 'hidden',
          },
        ]}
      >
        <Skeleton width="100%" height={40} style={{ marginBottom: 12, marginHorizontal: -16, marginTop: -16, width: undefined, borderRadius: 0 }} />
        <View style={{ backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.md, padding: 12, marginBottom: 12 }}>
          <Skeleton width="30%" height={12} style={{ marginBottom: 8 }} />
          <Skeleton width="55%" height={28} style={{ marginBottom: 6 }} />
          <Skeleton width="45%" height={12} style={{ marginBottom: 12 }} />
          <Skeleton width="100%" height={1} style={{ marginBottom: 8 }} />
          <Skeleton width="40%" height={36} />
        </View>
        <Skeleton width="100%" height={36} style={{ marginBottom: 6 }} />
        <Skeleton width="100%" height={36} />
      </View>

      {/* Today's Schedule Timeline Skeleton */}
      <View
        style={[
          styles.blockPlaceholder,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: borderRadius.lg,
            marginBottom: spacing.lg,
            padding: spacing.cardPadding,
          },
        ]}
      >
        <Skeleton width={130} height={14} style={{ marginBottom: 6 }} />
        <Skeleton width="50%" height={20} style={{ marginBottom: 16 }} />
        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
          <Skeleton width={12} height={12} borderRadius={borderRadius.full} style={{ marginRight: 12, marginTop: 4 }} />
          <View style={{ flex: 1 }}>
            <Skeleton width="40%" height={14} style={{ marginBottom: 4 }} />
            <Skeleton width="70%" height={18} style={{ marginBottom: 4 }} />
            <Skeleton width="55%" height={12} />
          </View>
        </View>
      </View>

      {/* Notices Skeleton */}
      <View
        style={[
          styles.blockPlaceholder,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: borderRadius.md,
            padding: spacing.cardPadding,
          },
        ]}
      >
        <Skeleton width={110} height={14} style={{ marginBottom: 12 }} />
        <Skeleton width="100%" height={24} style={{ marginBottom: 8 }} />
        <Skeleton width="100%" height={24} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  blockPlaceholder: {
    borderWidth: 1,
  },
});
