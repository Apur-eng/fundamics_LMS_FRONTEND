import React from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { Badge, BadgeVariant } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { AppHeader } from '../../../components/common/AppHeader';
import { ListItem } from '../../../components/common/ListItem';
import { ModalSheet } from '../../../components/common/ModalSheet';
import { Skeleton } from '../../../components/feedback/Skeleton';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationCategory, NotificationItem } from '../../../types/notifications';

const CATEGORIES: { key: NotificationCategory; label: string }[] = [
  { key: 'ALL', label: 'All Notices' },
  { key: 'ACADEMIC', label: 'Academic' },
  { key: 'EXAMINATIONS', label: 'Examinations' },
  { key: 'SCHEDULE', label: 'Schedules' },
  { key: 'ADMINISTRATIVE', label: 'Administrative' },
];

export const NotificationsScreen: React.FC = () => {
  const { colors, spacing, borderRadius } = useTheme();

  const {
    items,
    loading,
    refreshing,
    error,
    selectedCategory,
    selectedNotification,
    setSelectedCategory,
    openNotification,
    closeNotification,
    refetch,
    onRefresh,
  } = useNotifications();

  const getCategoryBadge = (category: NotificationCategory): { variant: BadgeVariant; icon: keyof typeof Ionicons.glyphMap } => {
    switch (category) {
      case 'EXAMINATIONS':
        return { variant: 'danger', icon: 'clipboard-outline' };
      case 'ACADEMIC':
        return { variant: 'accent', icon: 'school-outline' };
      case 'SCHEDULE':
        return { variant: 'warning', icon: 'time-outline' };
      case 'ADMINISTRATIVE':
      default:
        return { variant: 'primary', icon: 'business-outline' };
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppHeader
        title="Notice Board"
        subtitle="Official circulars & academic notices"
        badgeLabel="Lucknow Hub"
      />

      {/* Horizontal Category Filter Pills */}
      <View style={{ backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.filterScroll,
            { paddingHorizontal: spacing.screenPadding, paddingVertical: spacing.sm },
          ]}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                onPress={() => setSelectedCategory(cat.key)}
                activeOpacity={0.7}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surfaceVariant,
                    borderRadius: borderRadius.pill,
                    marginRight: spacing.xs + 2,
                    paddingHorizontal: spacing.md,
                    paddingVertical: 6,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                <Text
                  variant="buttonSmall"
                  color={isSelected ? 'inverse' : 'secondary'}
                  weight={isSelected ? '700' : '500'}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Content Area */}
      {loading && items.length === 0 ? (
        <ScrollView
          contentContainerStyle={{
            padding: spacing.screenPadding,
          }}
        >
          {[1, 2, 3, 4].map((idx) => (
            <View
              key={idx}
              style={[
                styles.skeletonItem,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  marginBottom: spacing.sm,
                },
              ]}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Skeleton width="60%" height={16} />
                <Skeleton width={50} height={18} borderRadius={borderRadius.pill} />
              </View>
              <Skeleton width="90%" height={12} style={{ marginBottom: 6 }} />
              <Skeleton width="40%" height={12} />
            </View>
          ))}
        </ScrollView>
      ) : error && items.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ErrorState message={error} onRetry={refetch} />
        </View>
      ) : items.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <EmptyState
            iconName="mail-unread-outline"
            title="No Circulars Found"
            description="There are currently no active notices in this department."
            actionTitle="Show All Notices"
            onAction={() => setSelectedCategory('ALL')}
          />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            padding: spacing.screenPadding,
            paddingBottom: spacing.massive,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          {items.map((item) => {
            const { variant, icon } = getCategoryBadge(item.category);
            return (
              <ListItem
                key={item.id}
                title={item.title}
                subtitle={item.content}
                caption={`${item.date} • ${item.signatory || 'Institutional Office'}`}
                badgeLabel={item.isUrgent ? 'Urgent' : item.category}
                badgeVariant={item.isUrgent ? 'danger' : variant}
                showChevron
                leftIcon={
                  <View
                    style={[
                      styles.iconWrap,
                      {
                        backgroundColor: colors.surfaceVariant,
                        borderRadius: borderRadius.md,
                      },
                    ]}
                  >
                    <Ionicons name={icon} size={18} color={colors.primary} />
                  </View>
                }
                rightElement={
                  !item.isRead ? (
                    <View
                      style={[
                        styles.unreadDot,
                        { backgroundColor: colors.accent, borderRadius: borderRadius.full },
                      ]}
                    />
                  ) : undefined
                }
                onPress={() => openNotification(item)}
              />
            );
          })}
        </ScrollView>
      )}

      {/* Notice Detail Bottom Modal */}
      {selectedNotification && (
        <ModalSheet
          visible={!!selectedNotification}
          onClose={closeNotification}
          title={selectedNotification.title}
          subtitle={`${selectedNotification.category} • ${selectedNotification.date}`}
        >
          <View style={{ marginTop: spacing.sm }}>
            {selectedNotification.isUrgent && (
              <View style={{ marginBottom: spacing.md }}>
                <Badge label="High Priority Notice" variant="danger" size="md" />
              </View>
            )}

            <Text
              variant="body"
              color="primary"
              style={{ lineHeight: 22, marginBottom: spacing.lg }}
            >
              {selectedNotification.content}
            </Text>

            {selectedNotification.attachmentName && (
              <View
                style={[
                  styles.attachmentBox,
                  {
                    backgroundColor: colors.surfaceVariant,
                    borderColor: colors.border,
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    marginBottom: spacing.lg,
                  },
                ]}
              >
                <Ionicons name="document-attach-outline" size={20} color={colors.primary} style={{ marginRight: spacing.sm }} />
                <View style={{ flex: 1 }}>
                  <Text variant="bodySmall" color="primary" weight="600" numberOfLines={1}>
                    {selectedNotification.attachmentName}
                  </Text>
                  <Text variant="caption" color="muted">
                    Official Board PDF Document
                  </Text>
                </View>
              </View>
            )}

            {selectedNotification.signatory && (
              <View
                style={[
                  styles.signatoryRow,
                  {
                    borderTopColor: colors.borderLight,
                    borderTopWidth: 1,
                    paddingTop: spacing.md,
                    marginBottom: spacing.lg,
                  },
                ]}
              >
                <Ionicons name="ribbon-outline" size={16} color={colors.accent} style={{ marginRight: 6 }} />
                <Text variant="caption" color="secondary">
                  Authorized by: {selectedNotification.signatory}
                </Text>
              </View>
            )}

            <Button
              title="Close Notice"
              onPress={closeNotification}
              variant="primary"
              fullWidth
            />
          </View>
        </ModalSheet>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  filterScroll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterPill: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  skeletonItem: {
    borderWidth: 1,
  },
  iconWrap: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    marginRight: 4,
  },
  attachmentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  signatoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
