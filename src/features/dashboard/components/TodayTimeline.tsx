import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { UpcomingClassItem } from '../../../types/dashboard';

export interface TodayTimelineProps {
  classes: UpcomingClassItem[];
  onClassPress?: (item: UpcomingClassItem) => void;
}

export const TodayTimeline: React.FC<TodayTimelineProps> = ({
  classes,
  onClassPress,
}) => {
  const { colors, spacing, borderRadius, shadows } = useTheme();

  // Format today's date
  const today = new Date();
  const dateFormatted = today.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

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
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text variant="academicLabel" color="secondary" style={{ letterSpacing: 1.1 }}>
            TIMETABLE · TODAY'S SESSIONS
          </Text>
          <Text variant="h4" color="primary" weight="700" style={{ marginTop: 2 }}>
            {dateFormatted}
          </Text>
        </View>

        <View style={[styles.countBadge, { backgroundColor: colors.surfaceVariant, borderColor: colors.border, borderWidth: 1 }]}>
          <Text variant="caption" color="secondary" weight="700">
            {classes.length} {classes.length === 1 ? 'Session' : 'Sessions'}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: colors.borderLight, marginVertical: spacing.md }]} />

      {/* Classes Timeline */}
      {classes && classes.length > 0 ? (
        <View style={styles.timelineList}>
          {classes.map((cls, index) => {
            const isLive = cls.status === 'LIVE';
            const isLast = index === classes.length - 1;

            return (
              <TouchableOpacity
                key={cls.id}
                onPress={() => onClassPress && onClassPress(cls)}
                activeOpacity={onClassPress ? 0.7 : 1}
                style={styles.timelineRow}
                accessibilityRole={onClassPress ? 'button' : 'none'}
              >
                {/* Left Timeline Indicator Column */}
                <View style={styles.indicatorCol}>
                  <View
                    style={[
                      styles.timelineNode,
                      {
                        backgroundColor: isLive ? colors.danger : colors.accent,
                        borderColor: isLive ? colors.dangerContainer : colors.accentContainer,
                      },
                    ]}
                  >
                    {isLive && <View style={styles.innerLivePulse} />}
                  </View>
                  {!isLast && (
                    <View
                      style={[
                        styles.timelineConnector,
                        { backgroundColor: colors.borderLight },
                      ]}
                    />
                  )}
                </View>

                {/* Right Class Details Content */}
                <View style={[styles.detailsCol, { paddingBottom: isLast ? 0 : spacing.lg }]}>
                  {/* Time + Status */}
                  <View style={styles.metaRow}>
                    <Text variant="bodySmall" color="primary" weight="700">
                      {cls.time}
                    </Text>
                    {isLive && (
                      <View style={[styles.liveBadge, { backgroundColor: colors.dangerContainer }]}>
                        <View style={[styles.liveDot, { backgroundColor: colors.danger }]} />
                        <Text variant="caption" color="danger" weight="700" style={{ fontSize: 10 }}>
                          LIVE
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Subject Title */}
                  <Text variant="h4" color="primary" weight="700" style={{ marginTop: 2 }}>
                    {cls.subject}
                  </Text>

                  {/* Topic */}
                  <Text variant="caption" color="secondary" numberOfLines={1} style={{ marginTop: 2 }}>
                    {cls.topic}
                  </Text>

                  {/* Faculty & Venue Metadata */}
                  <View style={styles.venueRow}>
                    <View style={styles.metaItem}>
                      <Ionicons name="person-outline" size={12} color={colors.textMuted} style={{ marginRight: 4 }} />
                      <Text variant="caption" color="muted">
                        {cls.teacherName.split('(')[0].trim()}
                      </Text>
                    </View>
                    <Text variant="caption" color="muted" style={{ marginHorizontal: 6 }}>
                      •
                    </Text>
                    <View style={styles.metaItem}>
                      <Ionicons name="location-outline" size={12} color={colors.textMuted} style={{ marginRight: 4 }} />
                      <Text variant="caption" color="muted">
                        {cls.room}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={24} color={colors.textMuted} style={{ marginBottom: 6 }} />
          <Text variant="bodySmall" color="secondary" align="center">
            No classes scheduled today.
          </Text>
          <Text variant="caption" color="muted" align="center" style={{ marginTop: 2 }}>
            Review study materials or practice mock test papers.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  divider: {
    height: 1,
  },
  timelineList: {},
  timelineRow: {
    flexDirection: 'row',
  },
  indicatorCol: {
    width: 24,
    alignItems: 'center',
  },
  timelineNode: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3,
  },
  innerLivePulse: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  timelineConnector: {
    width: 2,
    flex: 1,
    marginVertical: 2,
  },
  detailsCol: {
    flex: 1,
    marginLeft: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    marginLeft: 8,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 4,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
});
