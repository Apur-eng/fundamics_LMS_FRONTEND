import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { Badge } from '../../../components/common/Badge';
import { PerformanceMetrics, RecentResultItem } from '../../../types/dashboard';

export interface AcademicExaminationRecordProps {
  metrics?: PerformanceMetrics;
  results: RecentResultItem[];
  onSelectResult?: (item: RecentResultItem) => void;
  onViewAll?: () => void;
}

export const AcademicExaminationRecord: React.FC<AcademicExaminationRecordProps> = ({
  metrics,
  results = [],
  onSelectResult,
  onViewAll,
}) => {
  const { colors, spacing, borderRadius, shadows } = useTheme();

  const latestResult = results.length > 0 ? results[0] : null;
  const previousResults = results.length > 1 ? results.slice(1, 4) : [];

  const latestPct = latestResult
    ? Math.round((latestResult.score / latestResult.maxScore) * 100)
    : 0;
  const isLatestDistinction = latestPct >= 90;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    }
    return dateStr;
  };

  const hasTrend = metrics && metrics.trendPoints && metrics.trendPoints.length >= 2;

  return (
    <View
      style={[
        styles.container,
        shadows.sm,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          padding: spacing.cardPadding,
          marginBottom: spacing.lg,
        },
      ]}
    >
      {/* 1. Clean Unboxed Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderLeft}>
          <Text variant="academicLabel" color="primary" style={styles.sectionTitle}>
            TEST PERFORMANCE
          </Text>
          <Text variant="caption" color="secondary" style={{ marginTop: 1 }}>
            Individual test evaluations & board simulations
          </Text>
        </View>

        {onViewAll && (
          <TouchableOpacity
            onPress={onViewAll}
            activeOpacity={0.7}
            style={[
              styles.allResultsBtn,
              {
                backgroundColor: colors.surfaceVariant,
                borderColor: colors.border,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="View all test results"
          >
            <Text variant="buttonSmall" color="secondary" weight="600">
              All Results
            </Text>
            <Ionicons name="arrow-forward" size={12} color={colors.textSecondary} style={{ marginLeft: 3 }} />
          </TouchableOpacity>
        )}
      </View>

      {/* Subtle Divider */}
      <View style={[styles.divider, { backgroundColor: colors.borderLight, marginVertical: spacing.md }]} />

      {/* 2. Content: Actual Assessment Information OR Compact Empty State */}
      {latestResult ? (
        <View>
          {/* Latest Evaluated Assessment Card */}
          <TouchableOpacity
            activeOpacity={onSelectResult ? 0.75 : 1}
            onPress={() => onSelectResult && onSelectResult(latestResult)}
            style={[
              styles.latestBlock,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: borderRadius.md,
                padding: spacing.cardPadding,
              },
            ]}
            accessibilityRole={onSelectResult ? 'button' : 'none'}
            accessibilityLabel={`Latest test: ${latestResult.testName}, score ${latestResult.score} of ${latestResult.maxScore}`}
          >
            {/* Top row */}
            <View style={styles.latestTopRow}>
              <View style={styles.latestLabel}>
                <View style={[styles.labelDot, { backgroundColor: colors.accent }]} />
                <Text variant="caption" color="secondary" weight="700" style={styles.latestLabelText}>
                  LATEST EVALUATION
                </Text>
              </View>
              <Text variant="caption" color="secondary" weight="600">
                {formatDate(latestResult.date)}
              </Text>
            </View>

            {/* Test name & subject */}
            <Text variant="h4" color="primary" weight="700" style={styles.testName} numberOfLines={1}>
              {latestResult.testName}
            </Text>

            {latestResult.subject && (
              <Text variant="caption" color="secondary" numberOfLines={1} style={{ marginTop: 2 }}>
                {latestResult.subject}
              </Text>
            )}

            {/* Score row */}
            <View style={[styles.scoreRow, { borderTopColor: colors.borderLight }]}>
              <View style={styles.scoreGroup}>
                <Text variant="h2" color="primary" weight="700" style={styles.scoreNum}>
                  {latestResult.score}
                </Text>
                <Text variant="bodySmall" color="secondary" style={styles.maxScore}>
                  /{latestResult.maxScore}
                </Text>
                <Badge
                  label={`${latestPct}%`}
                  variant={isLatestDistinction ? 'distinction' : 'emerald'}
                  size="sm"
                  style={{ marginLeft: 8 }}
                />
              </View>

              {onSelectResult && (
                <View style={styles.inspectLink}>
                  <Text variant="caption" color="secondary" weight="600">
                    Inspect sheet
                  </Text>
                  <Ionicons name="chevron-forward" size={13} color={colors.textSecondary} style={{ marginLeft: 2 }} />
                </View>
              )}
            </View>
          </TouchableOpacity>

          {/* 3. Micro Progression (if trend points exist) */}
          {hasTrend && metrics && (
            <View style={[styles.trendBlock, { borderTopColor: colors.borderLight, marginTop: spacing.md, paddingTop: spacing.md }]}>
              <View style={styles.trendRow}>
                <View>
                  <Text variant="caption" color="secondary" weight="700" style={{ fontSize: 10, letterSpacing: 0.8 }}>
                    RECENT PERFORMANCE TREND
                  </Text>
                  <Text variant="caption" color="muted" style={{ marginTop: 2 }}>
                    Average score: {metrics.averageScore}% across {metrics.testsCompleted} tests
                  </Text>
                </View>

                {metrics.deltaTrend > 0 && (
                  <View
                    style={[
                      styles.trendBadge,
                      {
                        backgroundColor: metrics.trendDirection === 'UP' ? colors.surfaceMint : colors.surfaceAmber,
                        borderColor: metrics.trendDirection === 'UP' ? colors.emerald : colors.accent,
                      },
                    ]}
                  >
                    <Ionicons
                      name={metrics.trendDirection === 'UP' ? 'arrow-up' : 'arrow-down'}
                      size={11}
                      color={metrics.trendDirection === 'UP' ? colors.emerald : colors.accent}
                      style={{ marginRight: 2 }}
                    />
                    <Text
                      variant="caption"
                      color={metrics.trendDirection === 'UP' ? 'emerald' : 'accent'}
                      weight="700"
                    >
                      {metrics.deltaTrend} pts
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* 4. Previous Results Ledger */}
          {previousResults.length > 0 && (
            <View style={[styles.previousSection, { borderTopColor: colors.borderLight, marginTop: spacing.md, paddingTop: spacing.sm }]}>
              <Text variant="academicLabel" color="secondary" style={styles.previousTitle}>
                PREVIOUS EVALUATIONS
              </Text>
              {previousResults.map((item, idx) => {
                const isLast = idx === previousResults.length - 1;
                const pct = Math.round((item.score / item.maxScore) * 100);
                const isDistinction = pct >= 90;

                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => onSelectResult && onSelectResult(item)}
                    activeOpacity={0.7}
                    style={[
                      styles.resultRow,
                      !isLast && { borderBottomColor: colors.borderLight, borderBottomWidth: 1 },
                      { paddingVertical: spacing.sm },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`${item.testName}, score ${item.score} out of ${item.maxScore}`}
                  >
                    <View style={styles.colDate}>
                      <Text variant="caption" color="secondary" weight="600">
                        {formatDate(item.date)}
                      </Text>
                    </View>

                    <View style={styles.colInfo}>
                      <Text variant="bodySmall" color="primary" weight="600" numberOfLines={1}>
                        {item.testName}
                      </Text>
                      {item.subject && (
                        <Text variant="caption" color="muted" numberOfLines={1}>
                          {item.subject}
                        </Text>
                      )}
                    </View>

                    <View style={styles.colScore}>
                      <Text variant="bodySmall" color="primary" weight="700">
                        {item.score}
                        <Text variant="caption" color="muted">/{item.maxScore}</Text>
                      </Text>
                      <Badge
                        label={`${pct}%`}
                        variant={isDistinction ? 'distinction' : 'emerald'}
                        size="sm"
                        style={{ marginTop: 2 }}
                      />
                    </View>

                    <Ionicons name="chevron-forward" size={13} color={colors.textMuted} style={{ marginLeft: 6 }} />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      ) : (
        /* Compact, intentional empty state */
        <View
          style={[
            styles.emptyCard,
            {
              backgroundColor: colors.surfaceVariant,
              borderColor: colors.border,
              borderRadius: borderRadius.md,
            },
          ]}
        >
          <View style={styles.emptyContent}>
            <View
              style={[
                styles.emptyIconCircle,
                { backgroundColor: colors.surfaceAmber, borderRadius: borderRadius.sm },
              ]}
            >
              <Ionicons name="trophy-outline" size={20} color={colors.accent} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text variant="bodySmall" color="primary" weight="700">
                No evaluations recorded yet
              </Text>
              <Text variant="caption" color="secondary" style={{ marginTop: 2 }}>
                Individual test scores and rankings will appear here after board simulations.
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Footer Link */}
      {onViewAll && (
        <TouchableOpacity
          onPress={onViewAll}
          activeOpacity={0.7}
          style={[styles.footerLink, { borderTopColor: colors.borderLight, marginTop: spacing.md, paddingTop: spacing.sm }]}
          accessibilityRole="button"
          accessibilityLabel="Open all results tab"
        >
          <Text variant="caption" color="secondary" weight="600">
            View full assessment archives & rank analysis →
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeaderLeft: {
    flex: 1,
    paddingRight: 8,
  },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 0.8,
  },
  allResultsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  divider: {
    height: 1,
  },
  latestBlock: {
    borderWidth: 1,
  },
  latestTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  latestLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 4,
  },
  latestLabelText: {
    fontSize: 9,
    letterSpacing: 0.7,
  },
  testName: {
    letterSpacing: -0.2,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    marginTop: 10,
    paddingTop: 8,
  },
  scoreGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreNum: {
    letterSpacing: -0.4,
  },
  maxScore: {
    marginLeft: 3,
  },
  inspectLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendBlock: {
    borderTopWidth: 1,
  },
  trendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  previousSection: {
    borderTopWidth: 1,
  },
  previousTitle: {
    fontSize: 9,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colDate: {
    width: 48,
  },
  colInfo: {
    flex: 1,
    paddingHorizontal: 6,
  },
  colScore: {
    alignItems: 'flex-end',
  },
  emptyCard: {
    borderWidth: 1,
    padding: 12,
  },
  emptyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyIconCircle: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLink: {
    borderTopWidth: 1,
    alignItems: 'center',
  },
});
