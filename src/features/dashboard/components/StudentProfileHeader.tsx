import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { Avatar } from '../../../components/common/Avatar';

const BRAND_LOGO = require('../../../../assets/fundamics_logo.png');

export interface StudentProfileHeaderProps {
  studentName: string;
  greeting?: string;
  admissionNumber?: string;
  classGrade?: string;
  board?: string;
  branch?: string;
  avatarUrl?: string;
  hasUnreadNotifications?: boolean;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
  onSignOut?: () => void;
}

export const StudentProfileHeader: React.FC<StudentProfileHeaderProps> = ({
  studentName,
  greeting = 'Welcome back',
  admissionNumber,
  classGrade,
  board,
  branch,
  avatarUrl,
  hasUnreadNotifications = false,
  onNotificationPress,
  onProfilePress,
  onSignOut,
}) => {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  const safeTop = Math.max(insets.top, Platform.OS === 'web' ? 12 : 16);
  const programmeSubtitle = [classGrade, board].filter(Boolean).join(' • ');

  return (
    <LinearGradient
      colors={[colors.navyDeep, colors.navy]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.container,
        {
          paddingTop: safeTop + 2,
          paddingHorizontal: spacing.screenPadding,
          paddingBottom: 14,
        },
      ]}
    >
      {/* 1. TOP INSTITUTIONAL BRANDING & ACTIONS ROW */}
      <View style={styles.topRow}>
        <View style={styles.brandLockup}>
          <View style={styles.brandEmblemWrap}>
            <Image
              source={BRAND_LOGO}
              style={styles.brandEmblem}
              resizeMode="contain"
              accessibilityRole="image"
              accessibilityLabel="Fundamics official emblem"
            />
          </View>
          <Text style={styles.brandTitle}>
            FUNDAMICS{' '}
            <Text style={[styles.brandSubtitle, { color: colors.warmGold }]}>LMS</Text>
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={onNotificationPress}
            activeOpacity={0.75}
            style={styles.actionIconButton}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Ionicons name="notifications-outline" size={17} color="#FFFFFF" />
            {hasUnreadNotifications && (
              <View
                style={[
                  styles.notificationDot,
                  { backgroundColor: colors.danger },
                ]}
              />
            )}
          </TouchableOpacity>

          {onProfilePress ? (
            <TouchableOpacity
              onPress={onProfilePress}
              activeOpacity={0.75}
              style={[styles.actionIconButton, { marginLeft: 8 }]}
              accessibilityRole="button"
              accessibilityLabel="View profile"
            >
              <Ionicons name="person-outline" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          ) : onSignOut ? (
            <TouchableOpacity
              onPress={onSignOut}
              activeOpacity={0.75}
              style={[styles.actionIconButton, { marginLeft: 8 }]}
              accessibilityRole="button"
              accessibilityLabel="Sign out"
            >
              <Ionicons name="log-out-outline" size={17} color="rgba(255,255,255,0.85)" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* 2. COMPACT STUDENT IDENTITY ROW (Tapping navigates to Profile) */}
      <TouchableOpacity
        onPress={onProfilePress}
        disabled={!onProfilePress}
        activeOpacity={0.8}
        style={styles.profileRow}
        accessibilityRole="button"
        accessibilityLabel="Student profile shortcut"
      >
        <View style={styles.avatarWrapper}>
          <Avatar
            name={studentName}
            source={avatarUrl ? { uri: avatarUrl } : undefined}
            size={46}
            variant="circle"
            accent="primary"
          />
        </View>

        <View style={styles.nameBlock}>
          <Text
            variant="caption"
            weight="700"
            style={[styles.greetingLabel, { color: colors.warmGold }]}
          >
            {greeting.toUpperCase()}
          </Text>

          <View style={styles.nameChevronRow}>
            <Text
              variant="h3"
              color="inverse"
              weight="700"
              style={styles.studentName}
              numberOfLines={1}
            >
              {studentName}
            </Text>
            {onProfilePress && (
              <Ionicons
                name="chevron-forward"
                size={15}
                color="rgba(255,255,255,0.6)"
                style={{ marginLeft: 3 }}
              />
            )}
          </View>

          {/* Clean Student Details Row (No generic bullet dots, clean wrapped chips/labels) */}
          <View style={styles.idBatchRow}>
            {admissionNumber ? (
              <View style={styles.idChip}>
                <Text style={styles.idChipText}>ID: {admissionNumber}</Text>
              </View>
            ) : null}

            {programmeSubtitle ? (
              <Text
                variant="caption"
                color="inverseMuted"
                numberOfLines={1}
                style={styles.programmeText}
              >
                {programmeSubtitle}
              </Text>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  brandLockup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandEmblemWrap: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  brandEmblem: {
    width: 22,
    height: 22,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.1,
    marginLeft: 8,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 4,
    right: 5,
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#0D1B2A',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    borderWidth: 1.5,
    borderColor: 'rgba(197, 161, 90, 0.4)',
    borderRadius: 25,
    padding: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  nameBlock: {
    marginLeft: 10,
    flex: 1,
  },
  greetingLabel: {
    fontSize: 9,
    letterSpacing: 1.0,
    marginBottom: 1,
  },
  nameChevronRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentName: {
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  idBatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    flexWrap: 'wrap',
    gap: 6,
  },
  idChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  idChipText: {
    color: '#CBD5E1',
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  programmeText: {
    flexShrink: 1,
    fontSize: 11.5,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '500',
  },
});
