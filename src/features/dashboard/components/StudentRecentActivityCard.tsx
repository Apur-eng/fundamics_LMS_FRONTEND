import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { RecentResultItem, NoticeItem, StudentDashboardData } from '../../../types/dashboard';

export interface ActivityFeedItem {
  id: string;
  type: 'RESULT' | 'MATERIAL' | 'NOTICE';
  title: string;
  subtitle: string;
  date: string;
  rawItem?: any;
}

export interface StudentRecentActivityCardProps {
  recentResults?: RecentResultItem[];
  studyResources?: StudentDashboardData['studyResources'];
  notices?: NoticeItem[];
  onSelectResult: (item: RecentResultItem) => void;
  onNavigateStudyMaterial: () => void;
  onNavigateNotices: () => void;
  onNavigateResults: () => void;
}

export const StudentRecentActivityCard: React.FC<StudentRecentActivityCardProps> = ({
  recentResults = [],
  studyResources = [],
  notices = [],
  onSelectResult,
  onNavigateStudyMaterial,
  onNavigateNotices,
  onNavigateResults,
}) => {
  const { colors, spacing, borderRadius } = useTheme();

  // Combine real backend items into a concise chronological feed
  const feedItems: ActivityFeedItem[] = [];

  // 1. Recent Results
  for (const r of recentResults.slice(0, 2)) {
    feedItems.push({
      id: `res-${r.id}`,
      type: 'RESULT',
      title: r.testName,
      subtitle: `${r.subject} — Score ${r.score}/${r.maxScore}`,
      date: r.date,
      rawItem: r,
    });
  }

  // 2. Recent Study Resources
  for (const s of studyResources.slice(0, 2)) {
    feedItems.push({
      id: `mat-${s.id}`,
      type: 'MATERIAL',
      title: s.title,
      subtitle: s.subject || 'Academic Material',
      date: s.date || 'Recently added',
      rawItem: s,
    });
  }

  // 3. Recent Notices
  for (const n of notices.slice(0, 2)) {
    feedItems.push({
      id: `notif-${n.id}`,
      type: 'NOTICE',
      title: n.title,
      subtitle: n.category || 'Official Circular',
      date: n.date,
      rawItem: n,
    });
  }

  // If no items at all
  if (feedItems.length === 0) {
    return null;
  }

  const handleItemPress = (item: ActivityFeedItem) => {
    if (item.type === 'RESULT' && item.rawItem) {
      onSelectResult(item.rawItem);
    } else if (item.type === 'MATERIAL') {
      onNavigateStudyMaterial();
    } else if (item.type === 'NOTICE') {
      onNavigateNotices();
    }
  };

  const getItemIcon = (type: ActivityFeedItem['type']) => {
    switch (type) {
      case 'RESULT':
        return 'ribbon-outline';
      case 'MATERIAL':
        return 'library-outline';
      case 'NOTICE':
        return 'notifications-outline';
    }
  };

  const getItemIconColor = (type: ActivityFeedItem['type']) => {
    switch (type) {
      case 'RESULT':
        return colors.iconBlue;
      case 'MATERIAL':
        return colors.iconViolet;
      case 'NOTICE':
        return colors.iconAmber;
    }
  };

  const getItemIconBg = (type: ActivityFeedItem['type']) => {
    switch (type) {
      case 'RESULT':
        return colors.iconBlueBg;
      case 'MATERIAL':
        return colors.iconVioletBg;
      case 'NOTICE':
        return colors.iconAmberBg;
    }
  };

  const getItemTypeBadge = (type: ActivityFeedItem['type']) => {
    switch (type) {
      case 'RESULT':
        return 'Exam Result';
      case 'MATERIAL':
        return 'Study Resource';
      case 'NOTICE':
        return 'Notice';
    }
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
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: colors.surfaceVariant },
            ]}
          >
            <Ionicons name="time-outline" size={17} color={colors.navy} />
          </View>
          <View>
            <Text
              variant="caption"
              weight="700"
              style={[styles.sectionHeader, { color: colors.navy }]}
            >
              RECENT ACADEMIC ACTIVITY
            </Text>
            <Text variant="bodySmall" color="secondary" weight="500">
              Latest Results, Resources & Notices
            </Text>
          </View>
        </View>
      </View>

      {/* Activity List */}
      <View style={styles.list}>
        {feedItems.map((item, idx) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleItemPress(item)}
            activeOpacity={0.7}
            style={[
              styles.row,
              idx < feedItems.length - 1 && styles.rowBorder,
              { borderColor: colors.borderLight },
            ]}
          >
            <View style={[styles.itemIconBox, { backgroundColor: getItemIconBg(item.type) }]}>
              <Ionicons
                name={getItemIcon(item.type) as any}
                size={16}
                color={getItemIconColor(item.type)}
              />
            </View>

            <View style={styles.contentCol}>
              <View style={styles.metaRow}>
                <View style={[styles.typeBadge, { backgroundColor: getItemIconBg(item.type) }]}>
                  <Text variant="caption" weight="700" style={{ fontSize: 9.5, color: getItemIconColor(item.type) }}>
                    {getItemTypeBadge(item.type)}
                  </Text>
                </View>
                <Text variant="caption" color="muted" style={{ fontSize: 10 }}>
                  {item.date}
                </Text>
              </View>

              <Text variant="body" color="primary" weight="600" numberOfLines={1} style={styles.itemTitle}>
                {item.title}
              </Text>

              <Text variant="caption" color="secondary" numberOfLines={1}>
                {item.subtitle}
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        ))}
      </View>
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
    marginBottom: 10,
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
  list: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  rowBorder: {
    borderBottomWidth: 1,
  },
  itemIconBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  contentCol: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  itemTitle: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 1,
  },
});
