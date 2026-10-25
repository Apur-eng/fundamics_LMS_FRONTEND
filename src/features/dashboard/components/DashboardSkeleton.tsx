import React from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme';
import { Skeleton } from '../../../components/feedback/Skeleton';

export const DashboardSkeleton: React.FC = () => {
  const { colors, spacing, borderRadius } = useTheme();
  const insets = useSafeAreaInsets();
  const safeTop = Math.max(insets.top, Platform.OS === 'web' ? 12 : 20);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Navy Header Skeleton */}
      <View
        style={[
          styles.headerSkeleton, { borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
          {
            backgroundColor: colors.navyDeep || colors.navy,
            paddingTop: safeTop,
            paddingHorizontal: spacing.screenPadding,
          },
        ]}
      >
        {/* Top bar */}
        <View style={styles.topBarRow}>
          <Skeleton width={120} height={20} style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
          <Skeleton width={36} height={36} borderRadius={18} style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
        </View>

        {/* Profile row */}
        <View style={styles.profileRow}>
          <Skeleton width={54} height={54} borderRadius={27} style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <View style={{ marginLeft: 14, flex: 1 }}>
            <Skeleton width="40%" height={12} style={{ marginBottom: 6, backgroundColor: 'rgba(255,255,255,0.15)' }} />
            <Skeleton width="70%" height={20} style={{ marginBottom: 6, backgroundColor: 'rgba(255,255,255,0.2)' }} />
            <Skeleton width="50%" height={12} style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
          </View>
        </View>

        {/* Chips */}
        <View style={styles.chipsRow}>
          <Skeleton width={80} height={22} borderRadius={6} style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
          <Skeleton width={70} height={22} borderRadius={6} style={{ marginLeft: 8, backgroundColor: 'rgba(255,255,255,0.15)' }} />
          <Skeleton width={90} height={22} borderRadius={6} style={{ marginLeft: 8, backgroundColor: 'rgba(255,255,255,0.15)' }} />
        </View>
      </View>

      {/* Cards Skeleton */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.cardsContainer,
          { paddingHorizontal: spacing.screenPadding, paddingTop: 14, paddingBottom: spacing.massive },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Academic Overview Skeleton (2 cards) */}
        <View style={styles.twoCardsRow}>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: borderRadius.md, flex: 1, marginRight: 8, padding: spacing.cardPadding }]}>
            <Skeleton width="50%" height={12} style={{ marginBottom: 8 }} />
            <Skeleton width="80%" height={16} style={{ marginBottom: 4 }} />
            <Skeleton width="60%" height={12} />
          </View>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: borderRadius.md, flex: 1, padding: spacing.cardPadding }]}>
            <Skeleton width="50%" height={12} style={{ marginBottom: 8 }} />
            <Skeleton width="75%" height={16} style={{ marginBottom: 4 }} />
            <Skeleton width="55%" height={12} />
          </View>
        </View>

        {/* Attendance Card Skeleton */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: borderRadius.md, padding: spacing.cardPadding, marginBottom: 14 }]}>
          <Skeleton width="45%" height={14} style={{ marginBottom: 12 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Skeleton width="35%" height={36} />
            <Skeleton width="45%" height={36} />
          </View>
          <Skeleton width="100%" height={6} style={{ marginTop: 14 }} />
        </View>

        {/* Performance Card Skeleton */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: borderRadius.md, padding: spacing.cardPadding, marginBottom: 14 }]}>
          <Skeleton width="55%" height={14} style={{ marginBottom: 12 }} />
          <Skeleton width="40%" height={32} style={{ marginBottom: 12 }} />
          <Skeleton width="100%" height={24} style={{ marginBottom: 8 }} />
          <Skeleton width="100%" height={24} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerSkeleton: {
    paddingBottom: 18,
  },
  topBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardsContainer: {},
  twoCardsRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  card: {
    borderWidth: 1,
  },
});
