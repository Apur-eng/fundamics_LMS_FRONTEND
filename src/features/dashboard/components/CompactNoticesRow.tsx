import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { NoticeItem } from '../../../types/dashboard';

export interface CompactNoticesRowProps {
  notices: NoticeItem[];
  onViewAll?: () => void;
  onNoticePress?: (item: NoticeItem) => void;
}

export const CompactNoticesRow: React.FC<CompactNoticesRowProps> = ({
  notices,
  onViewAll,
  onNoticePress,
}) => {
  const { colors, spacing, borderRadius, shadows } = useTheme();

  // Show only if actual backend data exists per Phase 4 requirement
  if (!notices || notices.length === 0) return null;

  // Show at most 2 compact notices on the home screen
  const displayNotices = notices.slice(0, 2);

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
        <Text variant="academicLabel" color="primary" style={{ letterSpacing: 0.8, fontSize: 11 }}>
          OFFICIAL CIRCULARS & NOTICES
        </Text>
        {onViewAll && (
          <TouchableOpacity
            onPress={onViewAll}
            activeOpacity={0.7}
            style={styles.viewAllBtn}
            accessibilityRole="button"
            accessibilityLabel="View all notices"
          >
            <Text variant="caption" color="secondary" weight="700">
              Archives →
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Compact List */}
      <View style={{ marginTop: spacing.xs }}>
        {displayNotices.map((notice, index) => {
          const isLast = index === displayNotices.length - 1;

          return (
            <TouchableOpacity
              key={notice.id}
              onPress={() => onNoticePress && onNoticePress(notice)}
              activeOpacity={0.7}
              style={[
                styles.noticeItem,
                !isLast && { borderBottomColor: colors.borderLight, borderBottomWidth: 1 },
                { paddingVertical: spacing.sm },
              ]}
              accessibilityRole="button"
              accessibilityLabel={notice.title}
            >
              <View style={styles.noticeContent}>
                <Text variant="bodySmall" color="primary" weight="600" numberOfLines={1}>
                  {notice.title}
                </Text>
                <Text variant="caption" color="secondary" style={{ marginTop: 2 }}>
                  {notice.date} · {notice.category}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          );
        })}
      </View>
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
  viewAllBtn: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  noticeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  noticeContent: {
    flex: 1,
    paddingRight: 8,
  },
});
