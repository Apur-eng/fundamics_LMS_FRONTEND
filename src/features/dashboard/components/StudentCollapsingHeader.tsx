import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { Avatar } from '../../../components/common/Avatar';

export interface StudentCollapsingHeaderProps {
  scrollY: Animated.Value;
  studentName: string;
  greeting: string;
  admissionNumber?: string;
  classGrade?: string;
  board?: string;
  branch?: string;
  academicYear?: string;
  avatarUrl?: string;
  hasUnreadNotifications?: boolean;
  onNotificationPress: () => void;
  onSignOut?: () => void;
}

export const StudentCollapsingHeader: React.FC<StudentCollapsingHeaderProps> = ({
  scrollY,
  studentName,
  greeting,
  admissionNumber,
  classGrade,
  board,
  branch,
  academicYear = '2026–27',
  avatarUrl,
  hasUnreadNotifications = true,
  onNotificationPress,
  onSignOut,
}) => {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  const safeTop = Math.max(insets.top, Platform.OS === 'web' ? 12 : 20);
  const COMPACT_HEADER_HEIGHT = safeTop + 56;
  const EXPANDED_HEADER_HEIGHT = safeTop + 224;
  const SCROLL_DISTANCE = EXPANDED_HEADER_HEIGHT - COMPACT_HEADER_HEIGHT;

  // 1. Container Height Animation (Supports overscroll bounce)
  const headerHeight = scrollY.interpolate({
    inputRange: [-100, 0, SCROLL_DISTANCE],
    outputRange: [EXPANDED_HEADER_HEIGHT + 100, EXPANDED_HEADER_HEIGHT, COMPACT_HEADER_HEIGHT],
    extrapolateRight: 'clamp',
  });

  // 2. Expanded Content Fade Out
  const expandedOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE * 0.55],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const expandedTranslateY = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE * 0.7],
    outputRange: [0, -18],
    extrapolate: 'clamp',
  });

  // 3. Compact Sticky Identity Fade In
  const compactOpacity = scrollY.interpolate({
    inputRange: [SCROLL_DISTANCE * 0.5, SCROLL_DISTANCE],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const compactTranslateY = scrollY.interpolate({
    inputRange: [SCROLL_DISTANCE * 0.5, SCROLL_DISTANCE],
    outputRange: [8, 0],
    extrapolate: 'clamp',
  });

  // 4. Brand Title in Top Bar: Fades as compact identity appears
  const brandOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE * 0.45],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // 5. Large Avatar Scale Down during downward scroll
  const avatarScale = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [1, 0.75],
    extrapolate: 'clamp',
  });

  const programmeSubtitle = [classGrade, board].filter(Boolean).join(' · ');

  return (
    <Animated.View
      style={[
        styles.container,
        {
          height: headerHeight,
          backgroundColor: colors.navy,
          zIndex: 100,
        },
      ]}
    >
      {/* Background Gradient */}
      <LinearGradient
        colors={[colors.navy, '#10223B', '#0B182B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* STICKY TOP BAR */}
      <View
        style={[
          styles.stickyTopBar,
          {
            paddingTop: safeTop,
            height: COMPACT_HEADER_HEIGHT,
            paddingHorizontal: spacing.screenPadding,
          },
        ]}
      >
        {/* Left Side: Brand (Expanded) / Compact Student Identity (Collapsed) */}
        <View style={styles.brandContainer}>
          {/* Brand State (Expanded) */}
          <Animated.View
            style={[
              styles.brandRow,
              {
                opacity: brandOpacity,
              },
            ]}
            pointerEvents="box-none"
          >
            <View style={styles.monogram}>
              <Text style={styles.monogramText} color="inverse" weight="800">
                FN
              </Text>
            </View>
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.brandTitle} color="inverse" weight="800">
                FUNDAMICS
              </Text>
              <Text style={styles.brandSub} color="inverseMuted" weight="500">
                Academic Portal · {academicYear}
              </Text>
            </View>
          </Animated.View>

          {/* Compact Student Identity State (Collapsed) */}
          <Animated.View
            style={[
              styles.compactIdentityRow,
              {
                opacity: compactOpacity,
                transform: [{ translateY: compactTranslateY }],
              },
            ]}
            pointerEvents="box-none"
          >
            <View style={styles.compactAvatarWrapper}>
              <Avatar
                name={studentName}
                source={avatarUrl ? { uri: avatarUrl } : undefined}
                size={34}
                variant="circle"
                accent="primary"
              />
            </View>
            <View style={styles.compactTextCol}>
              <Text
                variant="body"
                color="inverse"
                weight="700"
                numberOfLines={1}
                style={styles.compactName}
              >
                {studentName}
              </Text>
              {classGrade && (
                <Text
                  variant="caption"
                  color="inverseMuted"
                  weight="500"
                  numberOfLines={1}
                >
                  {classGrade}
                </Text>
              )}
            </View>
          </Animated.View>
        </View>

        {/* Right Side: Notification Action + Sign Out */}
        <View style={styles.rightActions}>
          <TouchableOpacity
            onPress={onNotificationPress}
            activeOpacity={0.75}
            style={styles.actionIconButton}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
            {hasUnreadNotifications && (
              <View
                style={[
                  styles.notificationDot,
                  { backgroundColor: colors.coral },
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
              <Ionicons name="log-out-outline" size={19} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* EXPANDED PROFILE SECTION */}
      <Animated.View
        style={[
          styles.expandedContent,
          {
            opacity: expandedOpacity,
            transform: [{ translateY: expandedTranslateY }],
            paddingHorizontal: spacing.screenPadding,
          },
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.profileRow}>
          {/* Large Student Profile Picture */}
          <Animated.View style={[styles.largeAvatarRing, { transform: [{ scale: avatarScale }] }]}>
            <Avatar
              name={studentName}
              source={avatarUrl ? { uri: avatarUrl } : undefined}
              size={68}
              variant="circle"
              accent="primary"
            />
          </Animated.View>

          {/* Student Identity Information */}
          <View style={styles.identityCol}>
            {/* Greeting */}
            <Text
              variant="caption"
              color="inverseMuted"
              weight="700"
              style={styles.greetingText}
            >
              {greeting.toUpperCase()}
            </Text>

            {/* Student Name */}
            <Text
              variant="h2"
              color="inverse"
              weight="700"
              style={styles.studentNameText}
              numberOfLines={1}
            >
              {studentName}
            </Text>

            {/* Academic Programme / Board */}
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

        {/* Academic Meta Chips */}
        <View style={styles.metaRow}>
          {admissionNumber ? (
            <View style={styles.metaChip}>
              <Ionicons name="id-card-outline" size={11} color="rgba(255,255,255,0.9)" style={{ marginRight: 4 }} />
              <Text style={styles.metaChipText} color="inverse" weight="600">
                {admissionNumber}
              </Text>
            </View>
          ) : null}

          {academicYear ? (
            <View style={styles.metaChip}>
              <Ionicons name="calendar-outline" size={11} color="rgba(255,255,255,0.9)" style={{ marginRight: 4 }} />
              <Text style={styles.metaChipText} color="inverse" weight="600">
                AY {academicYear}
              </Text>
            </View>
          ) : null}

          {branch ? (
            <View style={[styles.metaChip, { flexShrink: 1 }]}>
              <Ionicons name="business-outline" size={11} color="rgba(255,255,255,0.9)" style={{ marginRight: 4 }} />
              <Text style={styles.metaChipText} color="inverse" weight="600" numberOfLines={1}>
                {branch.split('(')[0].trim()}
              </Text>
            </View>
          ) : null}
        </View>
      </Animated.View>

      {/* Subtle Bottom Border on Navy Header */}
      <View style={styles.bottomBorderLine} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    shadowColor: '#0B182B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  decorativeCircleTopRight: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(36, 99, 166, 0.12)',
  },
  decorativeCircleBottomLeft: {
    position: 'absolute',
    bottom: -50,
    left: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(57, 134, 215, 0.08)',
  },
  stickyTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  brandContainer: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
  },
  brandRow: {
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  monogram: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramText: {
    fontSize: 10,
    letterSpacing: 0.5,
  },
  brandTitle: {
    fontSize: 12,
    letterSpacing: 1.6,
  },
  brandSub: {
    fontSize: 9,
    letterSpacing: 0.3,
    marginTop: 1,
  },
  compactIdentityRow: {
    position: 'absolute',
    left: 0,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactAvatarWrapper: {
    borderWidth: 1.5,
    borderColor: 'rgba(57, 134, 215, 0.6)',
    borderRadius: 18,
    padding: 1,
  },
  compactTextCol: {
    marginLeft: 8,
    flex: 1,
  },
  compactName: {
    fontSize: 14,
    letterSpacing: -0.2,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#142B4A',
  },
  expandedContent: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  largeAvatarRing: {
    borderWidth: 2.5,
    borderColor: 'rgba(57, 134, 215, 0.55)',
    borderRadius: 38,
    padding: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  identityCol: {
    marginLeft: 14,
    flex: 1,
  },
  greetingText: {
    letterSpacing: 1.2,
    fontSize: 10,
    marginBottom: 2,
  },
  studentNameText: {
    letterSpacing: -0.3,
    fontSize: 20,
    lineHeight: 24,
  },
  programmeText: {
    marginTop: 2,
    fontSize: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 6,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  metaChipText: {
    fontSize: 10,
    letterSpacing: 0.3,
  },
  bottomBorderLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
});
