import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { UpcomingClassItem } from '../../../types/dashboard';

export interface StudentClassesCardProps {
  classes: UpcomingClassItem[];
  onViewAll: () => void;
}

export const StudentClassesCard: React.FC<StudentClassesCardProps> = ({
  classes = [],
  onViewAll,
}) => {
  const { colors, spacing, borderRadius } = useTheme();

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
              { backgroundColor: 'rgba(118, 168, 67, 0.10)' },
            ]}
          >
            <Ionicons name="calendar-outline" size={17} color={colors.brandGreen || '#76A843'} />
          </View>
          <View>
            <Text
              variant="caption"
              weight="700"
              style={[styles.sectionHeader, { color: colors.brandGreen || '#76A843' }]}
            >
              TODAY'S SCHEDULE
            </Text>
            <Text variant="bodySmall" color="secondary" weight="500">
              Classes & Timetable Ledger
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onViewAll}
          activeOpacity={0.7}
          style={styles.actionLink}
          accessibilityRole="button"
          accessibilityLabel="View full schedule"
        >
          <Text variant="caption" color="primaryBlue" weight="700">
            Full Schedule →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Class Items */}
      {classes.length > 0 ? (
        <View style={styles.classList}>
          {classes.map((cls, idx) => {
            const isLive = cls.status === 'LIVE';

            return (
              <View
                key={cls.id || `cls-${idx}`}
                style={[
                  styles.classRow,
                  idx < classes.length - 1 && styles.classRowBorder,
                  { borderColor: colors.borderLight },
                ]}
              >
                <View style={styles.classTimeCol}>
                  <Text variant="bodySmall" color="primary" weight="700">
                    {cls.time.split(' - ')[0]}
                  </Text>
                  <Text variant="caption" color="muted">
                    {cls.time.split(' - ')[1] || ''}
                  </Text>
                </View>

                <View style={styles.classInfoCol}>
                  <View style={styles.subjectRow}>
                    <Text variant="body" color="primary" weight="600" numberOfLines={1}>
                      {cls.subject}
                    </Text>
                    {isLive && (
                      <View style={[styles.liveTag, { backgroundColor: 'rgba(217, 72, 72, 0.12)' }]}>
                        <View style={[styles.liveDot, { backgroundColor: colors.danger }]} />
                        <Text variant="caption" color="danger" weight="700" style={{ fontSize: 9 }}>
                          LIVE
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text variant="caption" color="secondary" numberOfLines={1}>
                    {cls.topic} • {cls.teacherName}
                  </Text>
                  <Text variant="caption" color="muted" style={{ fontSize: 10, marginTop: 1 }}>
                    Room: {cls.room}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-clear-outline" size={20} color={colors.textMuted} />
          <Text variant="caption" color="muted" style={{ marginTop: 4 }}>
            No sessions scheduled for today.
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
    borderRadius: 8,
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
  classList: {
    marginTop: 2,
  },
  classRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  classRowBorder: {
    borderBottomWidth: 1,
  },
  classTimeCol: {
    width: 65,
    marginRight: 10,
  },
  classInfoCol: {
    flex: 1,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 4,
  },
  emptyContainer: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
