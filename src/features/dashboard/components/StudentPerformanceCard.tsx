import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { PerformanceMetrics, RecentResultItem } from '../../../types/dashboard';

export interface StudentPerformanceCardProps {
  metrics?: PerformanceMetrics;
  results: RecentResultItem[];
  onSelectResult: (item: RecentResultItem) => void;
  onViewAll: () => void;
}

export const StudentPerformanceCard: React.FC<StudentPerformanceCardProps> = ({
  metrics,
  results = [],
  onSelectResult,
  onViewAll,
}) => {
  const { colors, spacing, borderRadius } = useTheme();

  const averageScore = metrics?.averageScore ?? (results.length > 0 ? results[0].score : null);
  const isUp = metrics?.trendDirection === 'UP';
  const delta = metrics?.deltaTrend;
  const testsCompleted = metrics?.testsCompleted ?? results.length;
  const recentItems = results.slice(0, 2);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    }
    return dateStr;
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: borderRadius.md,
          padding: spacing.cardPadding,
          marginBottom: 14,
        },
      ]}
    >
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: colors.iconBlueBg },
            ]}
          >
            <Ionicons name="ribbon-outline" size={17} color={colors.iconBlue} />
          </View>
          <View>
            <Text
              variant="caption"
              weight="700"
              style={[styles.sectionHeader, { color: colors.iconBlue }]}
            >
              EXAMINATION PERFORMANCE
            </Text>
            <Text variant="bodySmall" color="secondary" weight="500">
              Evaluations & Academic Benchmarks
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onViewAll}
          activeOpacity={0.7}
          style={styles.actionLink}
          accessibilityRole="button"
          accessibilityLabel="View all test results"
        >
          <Text variant="caption" color="primary" weight="700">
            All Results →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={styles.scoreBlock}>
          <Text variant="caption" color="secondary" weight="600">
            Average Score
          </Text>
          <View style={styles.scoreNumberRow}>
            <Text
              style={[
                styles.scoreText,
                { color: colors.navy },
              ]}
              weight="800"
            >
              {averageScore !== null ? (typeof averageScore === 'number' ? averageScore.toFixed(1) : averageScore) : '—'}
            </Text>
            {averageScore !== null && (
              <Text
                style={[
                  styles.scoreUnit,
                  { color: colors.textSecondary },
                ]}
                weight="600"
              >
                %
              </Text>
            )}
          </View>
        </View>

        {delta !== undefined && delta > 0 && (
          <View
            style={[
              styles.trendBadge,
              {
                backgroundColor: isUp ? colors.accentContainer : colors.dangerContainer,
                borderColor: isUp ? 'rgba(22, 133, 117, 0.3)' : 'rgba(196, 61, 75, 0.3)',
              },
            ]}
          >
            <Ionicons
              name={isUp ? 'trending-up' : 'trending-down'}
              size={13}
              color={isUp ? colors.accent : colors.danger}
              style={{ marginRight: 4 }}
            />
            <Text
              variant="caption"
              weight="700"
              style={{ color: isUp ? colors.accent : colors.danger, fontSize: 10 }}
            >
              {isUp ? `+${delta}%` : `-${delta}%`} vs prev
            </Text>
          </View>
        )}

        <View style={styles.completedBlock}>
          <Text variant="caption" color="secondary" weight="600">
            Tests Evaluated
          </Text>
          <Text variant="body" color="primary" weight="700" style={{ marginTop: 2 }}>
            {testsCompleted} {testsCompleted === 1 ? 'test' : 'tests'}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.cardDivider, { backgroundColor: colors.borderLight }]} />

      {/* Recent Test Items */}
      {recentItems.length > 0 ? (
        <View style={styles.recentList}>
          {recentItems.map((item, idx) => {
            const pct = Math.round((item.score / item.maxScore) * 100);
            const isDistinction = pct >= 90;

            return (
              <TouchableOpacity
                key={item.id || `res-${idx}`}
                onPress={() => onSelectResult(item)}
                activeOpacity={0.7}
                style={[
                  styles.resultItem,
                  idx < recentItems.length - 1 && styles.resultItemBorder,
                  { borderColor: colors.borderLight },
                ]}
              >
                <View style={styles.resultItemLeft}>
                  <Text
                    variant="body"
                    color="primary"
                    weight="600"
                    numberOfLines={1}
                    style={{ fontSize: 13 }}
                  >
                    {item.testName}
                  </Text>
                  <View style={styles.resultSubRow}>
                    <Text variant="caption" color="secondary" weight="500">
                      {item.subject}
                    </Text>
                    <View style={[styles.subRowDivider, { backgroundColor: colors.border }]} />
                    <Text variant="caption" color="muted">
                      {formatDate(item.date)}
                    </Text>
                  </View>
                </View>

                <View style={styles.resultItemRight}>
                  <Text
                    variant="body"
                    weight="700"
                    style={{
                      color: isDistinction ? colors.warmGold : colors.textPrimary,
                      fontSize: 14,
                    }}
                  >
                    {item.score}
                    <Text variant="caption" color="muted" style={{ fontSize: 11 }}>
                      /{item.maxScore}
                    </Text>
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={14}
                    color={colors.textMuted}
                    style={{ marginLeft: 6 }}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={18} color={colors.textMuted} />
          <Text variant="caption" color="muted" style={{ marginTop: 4 }}>
            No recent examination results published.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sectionHeader: {
    letterSpacing: 0.8,
    fontSize: 11,
  },
  actionLink: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  scoreBlock: {
    flex: 1,
  },
  scoreNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  scoreText: {
    fontSize: 26,
    lineHeight: 30,
    letterSpacing: -0.5,
  },
  scoreUnit: {
    fontSize: 15,
    marginLeft: 2,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
  },
  completedBlock: {
    alignItems: 'flex-end',
  },
  cardDivider: {
    height: 1,
    marginVertical: 12,
  },
  recentList: {},
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  resultItemBorder: {
    borderBottomWidth: 1,
  },
  resultItemLeft: {
    flex: 1,
    marginRight: 10,
  },
  resultSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  subRowDivider: {
    width: 1,
    height: 10,
    marginHorizontal: 8,
  },
  resultItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
});
