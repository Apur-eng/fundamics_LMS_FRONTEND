import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { PerformanceMetrics } from '../../../types/dashboard';

export interface PerformanceOverviewBlockProps {
  metrics?: PerformanceMetrics;
  onViewAll?: () => void;
}

export const PerformanceOverviewBlock: React.FC<PerformanceOverviewBlockProps> = ({
  metrics,
  onViewAll,
}) => {
  const { colors, spacing, borderRadius, shadows } = useTheme();

  if (!metrics) return null;

  const {
    averageScore,
    deltaTrend,
    trendDirection,
    testsCompleted,
    trendPoints = [],
  } = metrics;

  const isUp = trendDirection === 'UP';
  const hasMultipleTests = trendPoints.length >= 2;

  // Find min and max for relative scaling in trend visualizer (e.g. baseline 75 to 100)
  const minBase = 70;
  const maxBase = 100;
  const range = maxBase - minBase;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          padding: spacing.cardPadding,
          marginBottom: spacing.lg,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.topRow}>
        <View style={styles.headerLeft}>
          <Text variant="academicLabel" color="secondary" style={{ letterSpacing: 1.1 }}>
            TEST PERFORMANCE RECORD
          </Text>
          <View style={styles.scoreRow}>
            <Text variant="metricHero" color="primary" weight="700">
              {averageScore}
            </Text>
            <Text variant="h3" color="muted" weight="600" style={{ marginLeft: 4, marginTop: 4 }}>
              / 100
            </Text>
          </View>
          <Text variant="caption" color="muted">
            Average Score Across {testsCompleted} Assessments
          </Text>
        </View>

        {hasMultipleTests && deltaTrend > 0 && (
          <View
            style={[
              styles.trendBadge,
              {
                backgroundColor: isUp ? colors.successContainer : colors.warningContainer,
                borderColor: isUp ? colors.success : colors.warning,
              },
            ]}
          >
            <Ionicons
              name={isUp ? 'arrow-up' : 'arrow-down'}
              size={12}
              color={isUp ? colors.success : colors.warning}
              style={{ marginRight: 2 }}
            />
            <Text
              variant="caption"
              color={isUp ? 'success' : 'warning'}
              weight="700"
            >
              {deltaTrend} pts
            </Text>
          </View>
        )}
      </View>

      {/* Subtle Trend Visualizer */}
      {hasMultipleTests ? (
        <View style={[styles.visualizerContainer, { marginTop: spacing.md, borderTopColor: colors.borderLight }]}>
          <View style={styles.chartHeader}>
            <Text variant="caption" color="secondary" weight="600">
              SCORE PROGRESSION
            </Text>
            <Text variant="caption" color="muted">
              {isUp ? `↑ +${deltaTrend} pts from previous period` : 'Performance tracking active'}
            </Text>
          </View>

          {/* Sparkline / Bar progression */}
          <View style={styles.progressionTrack}>
            {trendPoints.map((point, index) => {
              const heightPct = Math.max(15, Math.min(100, ((point.percentage - minBase) / range) * 100));
              const isLatest = index === trendPoints.length - 1;
              const isDistinction = point.percentage >= 90;

              return (
                <View key={point.id} style={styles.progressionCol}>
                  {/* Score Label above dot */}
                  <Text
                    variant="caption"
                    color={isLatest ? 'primary' : 'muted'}
                    weight={isLatest ? '700' : '500'}
                    style={{ fontSize: 10, marginBottom: 4 }}
                  >
                    {point.percentage}%
                  </Text>

                  {/* Vertical Track Column */}
                  <View style={[styles.barTrack, { backgroundColor: colors.surfaceVariant }]}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${heightPct}%`,
                          backgroundColor: isDistinction ? colors.distinction : colors.accent,
                          opacity: isLatest ? 1 : 0.65,
                        },
                      ]}
                    />
                  </View>

                  {/* Label (T1, T2...) */}
                  <Text
                    variant="caption"
                    color={isLatest ? 'primary' : 'secondary'}
                    weight={isLatest ? '700' : '500'}
                    style={{ marginTop: 4, fontSize: 10 }}
                  >
                    {point.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      ) : (
        <View style={[styles.singleTestNotice, { backgroundColor: colors.surfaceVariant, marginTop: spacing.sm }]}>
          <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} style={{ marginRight: 6 }} />
          <Text variant="caption" color="secondary">
            {testsCompleted === 1 ? '1 test recorded. Trends appear after 2 evaluations.' : 'No tests recorded yet.'}
          </Text>
        </View>
      )}

      {/* Footer Link */}
      {onViewAll && (
        <TouchableOpacity
          onPress={onViewAll}
          activeOpacity={0.7}
          style={[styles.footerLink, { borderTopColor: colors.borderLight }]}
          accessibilityRole="button"
          accessibilityLabel="View all test performance details"
        >
          <Text variant="buttonSmall" color="accent" weight="600">
            View full score history
          </Text>
          <Ionicons name="arrow-forward" size={14} color={colors.accent} style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  visualizerContainer: {
    borderTopWidth: 1,
    paddingTop: 12,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressionTrack: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 72,
    paddingHorizontal: 12,
  },
  progressionCol: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: 8,
    height: 44,
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 4,
  },
  singleTestNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
  },
  footerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    marginTop: 12,
    paddingTop: 8,
  },
});
