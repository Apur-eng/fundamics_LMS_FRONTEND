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

// Official Fundamics Wings Mark for the top insignia
const WINGS_FAVICON = require('../../../../assets/favicon.png');

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
  onSignOut,
}) => {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  const safeTop = Math.max(insets.top, Platform.OS === 'web' ? 12 : 16);
  const programmeSubtitle = [classGrade, board].filter(Boolean).join(' • ');

  return (
    <LinearGradient
      colors={[colors.navyDeep || '#0B2948', colors.navy || '#12365A']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.container,
        {
          paddingTop: safeTop + 4,
          paddingHorizontal: spacing.screenPadding,
        },
      ]}
    >
      {/* 1. TOP INSTITUTIONAL BRANDING & ACTIONS ROW */}
      <View style={styles.topRow}>
        <View style={styles.brandBadge}>
          <Image
            source={WINGS_FAVICON}
            style={styles.brandIcon}
            resizeMode="contain"
          />
          <Text
            variant="caption"
            weight="700"
            style={styles.brandTitle}
          >
            FUNDAMICS LMS
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
            <Ionicons name="notifications-outline" size={18} color="#FFFFFF" />
            {hasUnreadNotifications && (
              <View
                style={[
                  styles.notificationDot,
                  { backgroundColor: colors.danger || '#D94848' },
                ]}
              />
            )}
          </TouchableOpacity>

          {onSignOut && (
            <TouchableOpacity
              onPress={onSignOut}
              activeOpacity={0.75}
              style={[styles.actionIconButton, { marginLeft: 8 }]}
              accessibilityRole="button"
              accessibilityLabel="Sign out"
            >
              <Ionicons name="log-out-outline" size={18} color="rgba(255,255,255,0.85)" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 2. STUDENT PROFILE ROW (Compact, High-Hierarchy) */}
      <View style={styles.profileRow}>
        {/* Profile Picture or Restrained Initials Avatar */}
        <View style={styles.avatarWrapper}>
          <Avatar
            name={studentName}
            source={avatarUrl ? { uri: avatarUrl } : undefined}
            size={54}
            variant="circle"
            accent="primary"
          />
        </View>

        {/* Name and Personalized Greeting */}
        <View style={styles.nameBlock}>
          <Text
            variant="caption"
            weight="700"
            style={[styles.greetingLabel, { color: colors.warmGold || '#F2C94C' }]}
          >
            {greeting.toUpperCase()}
          </Text>

          <Text
            variant="h2"
            color="inverse"
            weight="700"
            style={styles.studentName}
            numberOfLines={1}
          >
            {studentName}
          </Text>

          {programmeSubtitle ? (
            <Text
              variant="bodySmall"
              color="inverseMuted"
              style={styles.programmeText}
              numberOfLines={1}
            >
              {programmeSubtitle}
            </Text>
          ) : null}
        </View>
      </View>

      {/* 3. SECONDARY ACADEMIC IDENTITY CHIPS */}
      <View style={styles.chipsRow}>
        {admissionNumber ? (
          <View style={styles.chip}>
            <Ionicons name="id-card-outline" size={11} color="rgba(255,255,255,0.85)" style={{ marginRight: 4 }} />
            <Text variant="caption" color="inverse" weight="600">
              {admissionNumber}
            </Text>
          </View>
        ) : null}

        {branch ? (
          <View style={[styles.chip, { flexShrink: 1 }]}>
            <Ionicons name="location-outline" size={11} color="rgba(255,255,255,0.85)" style={{ marginRight: 4 }} />
            <Text variant="caption" color="inverse" weight="600" numberOfLines={1}>
              {branch.split('(')[0].trim()}
            </Text>
          </View>
        ) : null}

        <View style={[styles.chip, styles.statusChip]}>
          <Ionicons name="checkmark-circle" size={11} color={colors.brandGreen || '#76A843'} style={{ marginRight: 4 }} />
          <Text variant="caption" color="inverse" weight="600">
            Active
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.09)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  brandIcon: {
    width: 18,
    height: 18,
    marginRight: 6,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 10,
    letterSpacing: 1.1,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 5,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    borderWidth: 1,
    borderColor: '#0B2948',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarWrapper: {
    borderWidth: 2,
    borderColor: 'rgba(242, 201, 76, 0.35)',
    borderRadius: 30,
    padding: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  nameBlock: {
    marginLeft: 12,
    flex: 1,
  },
  greetingLabel: {
    fontSize: 9.5,
    letterSpacing: 1.1,
    marginBottom: 2,
  },
  studentName: {
    fontSize: 19,
    lineHeight: 23,
    letterSpacing: -0.3,
  },
  programmeText: {
    fontSize: 11.5,
    marginTop: 1,
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusChip: {
    backgroundColor: 'rgba(118, 168, 67, 0.16)',
    borderColor: 'rgba(118, 168, 67, 0.32)',
  },
});
