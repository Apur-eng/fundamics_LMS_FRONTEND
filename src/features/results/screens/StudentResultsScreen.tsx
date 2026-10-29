import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { Badge } from '../../../components/common/Badge';
import { studentService, computePerformanceMetrics, mapBackendResults, extractResultDocuments } from '../../../services/api/studentService';
import { RecentResultItem, PerformanceMetrics, ResultDocumentItem } from '../../../types/dashboard';
import { LoadingState } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { TestResultDetailSheet } from '../components/TestResultDetailSheet';
import { StudentResultDocumentsCard } from '../components/StudentResultDocumentsCard';

export interface StudentResultsScreenProps {
  onBack?: () => void;
}

export const StudentResultsScreen: React.FC<StudentResultsScreenProps> = ({ onBack }) => {
  const { colors, spacing, borderRadius, shadows } = useTheme();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [results, setResults] = useState<RecentResultItem[]>([]);
  const [documents, setDocuments] = useState<ResultDocumentItem[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics>(() => computePerformanceMetrics([]));
  const [selectedResult, setSelectedResult] = useState<RecentResultItem | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const rawResults = await studentService.getExamResults();
      if (rawResults && rawResults.length > 0) {
        const mapped = mapBackendResults(rawResults);
        setResults(mapped);
        setMetrics(computePerformanceMetrics(rawResults));
        setDocuments(extractResultDocuments(rawResults));
      } else {
        setResults([]);
        setMetrics(computePerformanceMetrics([]));
        setDocuments([]);
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to load examination results');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleSelectResult = (item: RecentResultItem) => {
    setSelectedResult(item);
    setDetailVisible(true);
  };

  if (loading && results.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
        <LoadingState message="Loading test records..." />
      </View>
    );
  }

  if (error && results.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
        <ErrorState message={error} onRetry={fetchData} />
      </View>
    );
  }

  const { averageScore, deltaTrend, trendDirection, testsCompleted, highestScore, trendPoints } = metrics;
  const isUp = trendDirection === 'UP';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingTop: Math.max(insets.top, 16),
          paddingHorizontal: spacing.screenPadding,
          paddingBottom: Math.max(insets.bottom, 16) + 80,
        },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.navy}
          colors={[colors.navy]}
        />
      }
    >
      {/* Navigation Header */}
      <View style={[styles.navHeader, { marginBottom: spacing.md }]}>
        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
            style={[styles.backBtn, { backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.full }]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
        <View style={{ flex: 1, marginLeft: onBack ? spacing.sm : 0 }}>
          <Text variant="caption" color="secondary" weight="700" style={{ letterSpacing: 0.8 }}>
            ACADEMIC PERFORMANCE
          </Text>
          <Text variant="h2" color="primary" weight="700">
            Examination Results
          </Text>
        </View>
      </View>

      {/* Background Sync Error Banner (Non-destructive) */}
      {error && results.length > 0 && (
        <View
          style={[
            styles.syncErrorBanner,
            {
              backgroundColor: colors.dangerContainer,
              borderColor: colors.danger,
              borderRadius: borderRadius.md,
              padding: spacing.sm,
              marginBottom: spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
            },
          ]}
        >
          <Ionicons name="alert-circle-outline" size={16} color={colors.danger} style={{ marginRight: 6 }} />
          <Text variant="caption" color="danger" style={{ flex: 1 }}>
            {error}
          </Text>
          <TouchableOpacity onPress={fetchData} activeOpacity={0.7}>
            <Text variant="caption" color="danger" weight="700">
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {results.length === 0 ? (
        <View
          style={[
            styles.emptyCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.lg,
              padding: spacing.cardPadding,
              marginBottom: spacing.lg,
              ...shadows.sm,
            },
          ]}
        >
          <EmptyState
            iconName="trophy-outline"
            title="No Test Results Available"
            description="No published test results or evaluations are available yet for this academic session."
          />
        </View>
      ) : (
        <>
        {/* Top Academic Performance Summary Card */}
        <View
          style={[
            styles.kpiCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.lg,
              padding: spacing.cardPadding,
              marginBottom: spacing.lg,
              ...shadows.sm,
            },
          ]}
        >
          <Text variant="caption" color="secondary" weight="700" style={{ letterSpacing: 0.8 }}>
            YOUR OVERALL PERFORMANCE
          </Text>

          <View style={styles.kpiScoreRow}>
            <Text variant="hero" color="primary" weight="700" style={{ fontSize: 36, lineHeight: 42 }}>
              {averageScore}
            </Text>
            <Text variant="h3" color="muted" weight="600" style={{ marginLeft: 6, marginBottom: 4 }}>
              / 100
            </Text>
            <Badge
              label="Average Score"
              variant="accent"
              size="md"
              style={{ marginLeft: 10 }}
            />
          </View>

          {/* Dual Meta Stats */}
          <View style={[styles.metaRow, { borderTopColor: colors.borderLight, marginTop: spacing.md, paddingTop: spacing.md }]}>
            <View style={styles.metaItem}>
              <Text variant="h3" color="primary" weight="700">
                {highestScore}%
              </Text>
              <Text variant="caption" color="muted" style={{ marginTop: 2 }}>
                Best Score
              </Text>
            </View>

            <View style={[styles.metaSeparator, { backgroundColor: colors.borderLight }]} />

            <View style={styles.metaItem}>
              <Text variant="h3" color="primary" weight="700">
                {testsCompleted}
              </Text>
              <Text variant="caption" color="muted" style={{ marginTop: 2 }}>
                Evaluations
              </Text>
            </View>

            <View style={[styles.metaSeparator, { backgroundColor: colors.borderLight }]} />

            <View style={styles.metaItem}>
              <Text variant="h3" color={isUp ? 'success' : 'secondary'} weight="700">
                {isUp ? `+${deltaTrend}` : deltaTrend}
              </Text>
              <Text variant="caption" color="muted" style={{ marginTop: 2 }}>
                Point Delta
              </Text>
            </View>
          </View>
        </View>

        {/* Performance Progression Trend Card */}
        {trendPoints.length >= 2 && (
          <View
            style={[
              styles.trendCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: borderRadius.lg,
                padding: spacing.cardPadding,
                marginBottom: spacing.lg,
                ...shadows.sm,
              },
            ]}
          >
            <View style={styles.trendHeader}>
              <View>
                <Text variant="caption" color="secondary" weight="700" style={{ letterSpacing: 0.8 }}>
                  SCORE PROGRESSION
                </Text>
                <Text variant="bodySmall" color="secondary" style={{ marginTop: 2 }}>
                  Evaluation by evaluation progression
                </Text>
              </View>
              <Badge
                label={isUp ? `+${deltaTrend} pts` : `${deltaTrend} pts`}
                variant={isUp ? 'success' : 'warning'}
                size="sm"
              />
            </View>

            {/* Bar track visualizer */}
            <View style={styles.chartContainer}>
              {trendPoints.map((point) => {
                const heightPct = Math.max(15, Math.min(100, ((point.percentage - 70) / 30) * 100));
                const isDistinction = point.percentage >= 90;

                return (
                  <View key={point.id} style={styles.chartCol}>
                    <Text variant="caption" color="primary" weight="700" style={{ fontSize: 10, marginBottom: 4 }}>
                      {point.percentage}%
                    </Text>
                    <View style={[styles.chartTrack, { backgroundColor: colors.surfaceVariant }]}>
                      <View
                        style={[
                          styles.chartFill,
                          {
                            height: `${heightPct}%`,
                            backgroundColor: isDistinction ? colors.distinction : colors.accent,
                          },
                        ]}
                      />
                    </View>
                    <Text variant="caption" color="secondary" weight="600" style={{ marginTop: 4, fontSize: 10 }}>
                      {point.label}
                    </Text>
                    <Text variant="caption" color="muted" style={{ fontSize: 9 }}>
                      {point.date}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Official Scorecards & PDF Reports */}
        <StudentResultDocumentsCard documents={documents} />

        {/* Test History List */}
        <View
          style={[
            styles.historyCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.lg,
              padding: spacing.cardPadding,
              marginBottom: spacing.lg,
              ...shadows.sm,
            },
          ]}
        >
          <Text variant="caption" color="secondary" weight="700" style={{ letterSpacing: 0.8 }}>
            TEST HISTORY
          </Text>

          {/* Table Column Header */}
          <View style={[styles.tableHeader, { borderBottomColor: colors.borderLight, marginTop: spacing.sm }]}>
            <Text variant="caption" color="muted" weight="700" style={{ width: 60 }}>
              DATE
            </Text>
            <Text variant="caption" color="muted" weight="700" style={{ flex: 1, paddingHorizontal: 8 }}>
              ASSESSMENT
            </Text>
            <Text variant="caption" color="muted" weight="700" align="right" style={{ width: 75 }}>
              SCORE
            </Text>
          </View>

          {/* Table Rows */}
          {results.map((item, index) => {
            const isLast = index === results.length - 1;
            const pct = Math.round((item.score / item.maxScore) * 100);
            const isDistinction = pct >= 90;

            const dateObj = new Date(item.date);
            const dateStr = !isNaN(dateObj.getTime())
              ? dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
              : item.date;

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleSelectResult(item)}
                activeOpacity={0.7}
                style={[
                  styles.tableRow,
                  !isLast && { borderBottomColor: colors.borderLight, borderBottomWidth: 1 },
                  { paddingVertical: spacing.md },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`View test result for ${item.testName}`}
              >
                <View style={{ width: 60 }}>
                  <Text variant="bodySmall" color="secondary" weight="600">
                    {dateStr}
                  </Text>
                </View>

                <View style={{ flex: 1, paddingHorizontal: 8 }}>
                  <Text variant="body" color="primary" weight="600" numberOfLines={1}>
                    {item.testName}
                  </Text>
                  {item.subject && (
                    <Text variant="caption" color="muted" style={{ marginTop: 2 }}>
                      {item.subject}
                    </Text>
                  )}
                </View>

                <View style={{ width: 75, alignItems: 'flex-end' }}>
                  <Text variant="body" color="primary" weight="700">
                    {item.score}/{item.maxScore}
                  </Text>
                  <Badge
                    label={`${pct}%`}
                    variant={isDistinction ? 'distinction' : 'accent'}
                    size="sm"
                    style={{ marginTop: 2 }}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        </>
      )}

      {/* Test Result Detail Modal Sheet */}
      <TestResultDetailSheet
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        result={selectedResult}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {},
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiCard: {
    borderWidth: 1,
  },
  kpiScoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
  },
  metaItem: {
    alignItems: 'center',
    flex: 1,
  },
  metaSeparator: {
    width: 1,
    height: 28,
  },
  trendCard: {
    borderWidth: 1,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 84,
    paddingHorizontal: 8,
  },
  chartCol: {
    alignItems: 'center',
    flex: 1,
  },
  chartTrack: {
    width: 10,
    height: 48,
    borderRadius: 5,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  chartFill: {
    width: '100%',
    borderRadius: 5,
  },
  historyCard: {
    borderWidth: 1,
  },
  emptyCard: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  syncErrorBanner: {
    borderWidth: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
