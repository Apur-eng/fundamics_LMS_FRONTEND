import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { NoticeItem } from '../../../types/dashboard';

export interface StudentNoticesCardProps {
  notices: NoticeItem[];
  onViewAll: () => void;
}

export const StudentNoticesCard: React.FC<StudentNoticesCardProps> = ({
  notices = [],
  onViewAll,
}) => {
  const { colors, spacing, borderRadius } = useTheme();
  const displayNotices = notices.slice(0, 3);

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
              { backgroundColor: 'rgba(217, 154, 36, 0.08)' },
            ]}
          >
            <Ionicons name="notifications-outline" size={17} color={colors.warning || '#D99A24'} />
          </View>
          <View>
            <Text
              variant="caption"
              weight="700"
              style={[styles.sectionHeader, { color: colors.warning || '#D99A24' }]}
            >
              OFFICIAL CIRCULARS
            </Text>
            <Text variant="bodySmall" color="secondary" weight="500">
              Institutional Bulletins & Academic Notices
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onViewAll}
          activeOpacity={0.7}
          style={styles.actionLink}
          accessibilityRole="button"
          accessibilityLabel="View all notices"
        >
          <Text variant="caption" color="primaryBlue" weight="700">
            Archives →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notices List */}
      {displayNotices.length > 0 ? (
        <View style={styles.noticeList}>
          {displayNotices.map((notice, idx) => (
            <View
              key={notice.id || `not-${idx}`}
              style={[
                styles.noticeRow,
                idx < displayNotices.length - 1 && styles.noticeRowBorder,
                { borderColor: colors.borderLight },
              ]}
            >
              <View style={styles.noticeBulletCol}>
                <View
                  style={[
                    styles.bulletDot,
                    { backgroundColor: notice.isUrgent ? colors.danger : colors.warning },
                  ]}
                />
              </View>

              <View style={styles.noticeContentCol}>
                <View style={styles.noticeTitleRow}>
                  <Text
                    variant="body"
                    color="primary"
                    weight="600"
                    numberOfLines={2}
                    style={{ fontSize: 13, flex: 1 }}
                  >
                    {notice.title}
                  </Text>
                  {notice.isUrgent && (
                    <View style={[styles.urgentBadge, { backgroundColor: 'rgba(217, 72, 72, 0.12)' }]}>
                      <Text variant="caption" color="danger" weight="700" style={{ fontSize: 9 }}>
                        URGENT
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.noticeMetaRow}>
                  <Text variant="caption" color="secondary" weight="500">
                    {notice.category}
                  </Text>
                  <Text variant="caption" color="muted" style={{ marginHorizontal: 6 }}>
                    •
                  </Text>
                  <Text variant="caption" color="muted">
                    {notice.date}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="information-circle-outline" size={20} color={colors.textMuted} />
          <Text variant="caption" color="muted" style={{ marginTop: 4 }}>
            No circulars published at this time.
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
  noticeList: {
    marginTop: 2,
  },
  noticeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  noticeRowBorder: {
    borderBottomWidth: 1,
  },
  noticeBulletCol: {
    paddingTop: 5,
    marginRight: 8,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  noticeContentCol: {
    flex: 1,
  },
  noticeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  urgentBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6,
  },
  noticeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  emptyContainer: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
