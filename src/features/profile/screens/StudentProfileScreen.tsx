import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { Avatar } from '../../../components/common/Avatar';
import { useAuth } from '../../../app/providers/AuthContext';
import { authService } from '../../../services/api/authService';
import { BackendUserProfileResponse } from '../../../types/backend';
import { LoadingState } from '../../../components/feedback/LoadingState';

export interface StudentProfileScreenProps {
  onBack: () => void;
}

export const StudentProfileScreen: React.FC<StudentProfileScreenProps> = ({ onBack }) => {
  const { colors, spacing, borderRadius } = useTheme();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const [profileData, setProfileData] = useState<BackendUserProfileResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Change Password Modal State
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await authService.getProfile();
      if (res.success && res.data) {
        setProfileData(res.data);
      }
    } catch {
      // Gracefully retain cached user from session
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const studentName = profileData?.name || user?.name || 'Enrolled Student';
  const studentEmail = profileData?.email || user?.email || 'student@fundamics.in';
  const studentPhone = profileData?.phone || user?.phone || null;
  const studentCode = profileData?.student_code || user?.admissionNo || null;
  const accountStatus = profileData?.status || 'ACTIVE';

  const classOrDept = user?.classOrDept || null;
  const branchName = user?.branchName || 'Triveni Nagar (Flagship Campus)';

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to log out of Fundamics LMS?');
      if (confirmed) {
        logout();
      }
    } else {
      Alert.alert(
        'Confirm Sign Out',
        'Are you sure you want to sign out of your student account?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign Out', style: 'destructive', onPress: logout },
        ]
      );
    }
  };

  const handleChangePasswordSubmit = async () => {
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!oldPassword.trim()) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters in length.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      setPasswordLoading(true);
      const res = await authService.changePassword(oldPassword.trim(), newPassword.trim());
      if (res.success) {
        setPasswordSuccess(res.data?.message || 'Password successfully updated.');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setPasswordModalVisible(false);
          setPasswordSuccess(null);
        }, 1500);
      } else {
        setPasswordError(res.error || 'Failed to update password.');
      }
    } catch (err: any) {
      setPasswordError(err?.message || 'Failed to update password. Verify your current password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* 1. TOP APP BAR */}
      <View
        style={[
          styles.appBar,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
            paddingTop: Math.max(insets.top, 16) + 4,
            paddingHorizontal: spacing.screenPadding,
          },
        ]}
      >
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.7}
          style={[styles.backBtn, { backgroundColor: colors.surfaceVariant }]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text variant="h3" color="primary" weight="700" style={styles.appBarTitle}>
          Student Account
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: spacing.screenPadding, paddingBottom: Math.max(insets.bottom, 24) + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. STUDENT HERO CARD (Clean Identity Header) */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.md,
              marginTop: spacing.md,
              padding: spacing.cardPadding,
            },
          ]}
        >
          <View style={styles.heroTop}>
            <Avatar
              name={studentName}
              size={56}
              variant="circle"
              accent="primary"
            />
            <View style={styles.heroMeta}>
              <Text variant="h3" color="primary" weight="700" numberOfLines={2} style={styles.studentNameText}>
                {studentName}
              </Text>
              <Text variant="caption" color="secondary" numberOfLines={1} style={{ marginTop: 2 }}>
                {studentEmail}
              </Text>

              <View style={styles.badgeRow}>
                {studentCode && (
                  <View style={[styles.codeBadge, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}>
                    <Text variant="caption" color="secondary" weight="700" style={{ fontSize: 10 }}>
                      ID: {studentCode}
                    </Text>
                  </View>
                )}

                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: accountStatus === 'ACTIVE' ? colors.accentContainer : colors.surfaceVariant,
                      borderColor: accountStatus === 'ACTIVE' ? 'rgba(22, 133, 117, 0.3)' : colors.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: accountStatus === 'ACTIVE' ? colors.accent : colors.textMuted },
                    ]}
                  />
                  <Text
                    variant="caption"
                    style={{
                      color: accountStatus === 'ACTIVE' ? colors.accent : colors.textMuted,
                      fontWeight: '700',
                      fontSize: 10,
                    }}
                  >
                    {accountStatus}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 3. ACADEMIC ENROLLMENT SECTION (Supports wrapping without clipping) */}
        <View style={styles.sectionHeaderWrap}>
          <Text variant="caption" color="secondary" weight="700" style={styles.sectionTitle}>
            ACADEMIC ENROLLMENT
          </Text>
        </View>

        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.md,
            },
          ]}
        >
          {/* Class / Programme */}
          <View style={styles.infoRowStacked}>
            <View style={styles.infoLabelRow}>
              <Ionicons name="school-outline" size={15} color={colors.textSecondary} style={styles.infoIcon} />
              <Text variant="caption" color="secondary" weight="600">
                Batch / Programme
              </Text>
            </View>
            <Text variant="body" color={classOrDept ? 'primary' : 'muted'} weight="600" style={styles.infoValueText}>
              {classOrDept || 'General Academic Enrollee'}
            </Text>
          </View>

          {/* Campus / Branch */}
          <View style={[styles.infoRowStacked, { borderTopWidth: 1, borderTopColor: colors.borderLight }]}>
            <View style={styles.infoLabelRow}>
              <Ionicons name="business-outline" size={15} color={colors.textSecondary} style={styles.infoIcon} />
              <Text variant="caption" color="secondary" weight="600">
                Campus / Branch
              </Text>
            </View>
            <Text variant="body" color="primary" weight="600" style={styles.infoValueText}>
              {branchName}
            </Text>
          </View>

          {/* Curriculum Board */}
          <View style={[styles.infoRowStacked, { borderTopWidth: 1, borderTopColor: colors.borderLight }]}>
            <View style={styles.infoLabelRow}>
              <Ionicons name="ribbon-outline" size={15} color={colors.textSecondary} style={styles.infoIcon} />
              <Text variant="caption" color="secondary" weight="600">
                Curriculum Board
              </Text>
            </View>
            <Text variant="body" color="primary" weight="600" style={styles.infoValueText}>
              CBSE / ISC / ICSE
            </Text>
          </View>
        </View>

        {/* 4. CONTACT & CREDENTIALS SECTION */}
        <View style={styles.sectionHeaderWrap}>
          <Text variant="caption" color="secondary" weight="700" style={styles.sectionTitle}>
            CONTACT & CREDENTIALS
          </Text>
        </View>

        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.md,
            },
          ]}
        >
          {/* Email Address */}
          <View style={styles.infoRowStacked}>
            <View style={styles.infoLabelRow}>
              <Ionicons name="mail-outline" size={15} color={colors.textSecondary} style={styles.infoIcon} />
              <Text variant="caption" color="secondary" weight="600">
                Email Address
              </Text>
            </View>
            <Text variant="body" color="primary" weight="600" style={styles.infoValueText}>
              {studentEmail}
            </Text>
          </View>

          {/* Registered Mobile */}
          <View style={[styles.infoRowStacked, { borderTopWidth: 1, borderTopColor: colors.borderLight }]}>
            <View style={styles.infoLabelRow}>
              <Ionicons name="call-outline" size={15} color={colors.textSecondary} style={styles.infoIcon} />
              <Text variant="caption" color="secondary" weight="600">
                Registered Mobile
              </Text>
            </View>
            <Text variant="body" color={studentPhone ? 'primary' : 'muted'} weight="600" style={styles.infoValueText}>
              {studentPhone || 'Not Registered'}
            </Text>
          </View>
        </View>

        {/* 5. ACCOUNT SETTINGS & ACTIONS */}
        <View style={styles.sectionHeaderWrap}>
          <Text variant="caption" color="secondary" weight="700" style={styles.sectionTitle}>
            ACCOUNT SETTINGS
          </Text>
        </View>

        <View
          style={[
            styles.actionsCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.md,
            },
          ]}
        >
          {/* Change Password */}
          <TouchableOpacity
            onPress={() => setPasswordModalVisible(true)}
            activeOpacity={0.7}
            style={styles.actionRow}
            accessibilityRole="button"
            accessibilityLabel="Change Password"
          >
            <View style={styles.actionLeft}>
              <View style={[styles.actionIconBox, { backgroundColor: colors.surfaceVariant }]}>
                <Ionicons name="lock-closed-outline" size={16} color={colors.navy} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="body" color="primary" weight="600">
                  Change Password
                </Text>
                <Text variant="caption" color="muted">
                  Update your authentication credentials
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Institutional Helpdesk */}
          <View style={[styles.actionRow, { borderTopWidth: 1, borderTopColor: colors.borderLight }]}>
            <View style={styles.actionLeft}>
              <View style={[styles.actionIconBox, { backgroundColor: colors.iconBlueBg }]}>
                <Ionicons name="help-buoy-outline" size={16} color={colors.iconBlue} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="body" color="primary" weight="600">
                  Academic Helpdesk
                </Text>
                <Text variant="caption" color="muted">
                  Triveni Nagar Hub • +91 76170 18888
                </Text>
              </View>
            </View>
            <Text variant="caption" color="accent" weight="700">
              Campus Office
            </Text>
          </View>
        </View>

        {/* 6. LOGOUT BUTTON (Distinguished from ordinary actions) */}
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.8}
          style={[
            styles.logoutBtn,
            {
              backgroundColor: colors.surface,
              borderColor: colors.danger,
              borderRadius: borderRadius.md,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Sign Out of Student Account"
        >
          <Ionicons name="log-out-outline" size={18} color={colors.danger} style={{ marginRight: 8 }} />
          <Text variant="buttonSmall" color="danger" weight="700">
            Sign Out of Student Account
          </Text>
        </TouchableOpacity>

        {/* Institution Accreditation Footnote */}
        <Text variant="caption" color="muted" style={styles.footerNotice}>
          Fundamics Tutorials LLP • ISO 9001:2015 Certified Coaching Institute
        </Text>
      </ScrollView>

      {/* CHANGE PASSWORD MODAL */}
      <Modal
        visible={passwordModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: colors.surface,
                borderRadius: borderRadius.lg,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text variant="h3" color="primary" weight="700">
                  Change Password
                </Text>
                <Text variant="caption" color="secondary" style={{ marginTop: 2 }}>
                  Ensure your new password has at least 8 characters.
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setPasswordModalVisible(false)}
                activeOpacity={0.7}
                style={[styles.modalCloseBtn, { backgroundColor: colors.surfaceVariant }]}
                accessibilityRole="button"
                accessibilityLabel="Close password modal"
              >
                <Ionicons name="close" size={18} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {passwordError && (
              <View style={[styles.modalAlert, { backgroundColor: colors.dangerContainer, borderColor: colors.danger }]}>
                <Ionicons name="alert-circle-outline" size={15} color={colors.danger} style={{ marginRight: 6 }} />
                <Text variant="caption" color="danger" style={{ flex: 1 }}>
                  {passwordError}
                </Text>
              </View>
            )}

            {passwordSuccess && (
              <View style={[styles.modalAlert, { backgroundColor: colors.successContainer, borderColor: colors.success }]}>
                <Ionicons name="checkmark-circle-outline" size={15} color={colors.success} style={{ marginRight: 6 }} />
                <Text variant="caption" color="success" style={{ flex: 1 }}>
                  {passwordSuccess}
                </Text>
              </View>
            )}

            <View style={styles.formGroup}>
              <Text variant="caption" color="secondary" weight="600" style={{ marginBottom: 4 }}>
                Current Password
              </Text>
              <TextInput
                secureTextEntry
                value={oldPassword}
                onChangeText={setOldPassword}
                placeholder="Enter current password"
                placeholderTextColor={colors.textMuted}
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.surfaceVariant,
                    color: colors.textPrimary,
                    borderRadius: borderRadius.sm,
                  },
                ]}
              />
            </View>

            <View style={styles.formGroup}>
              <Text variant="caption" color="secondary" weight="600" style={{ marginBottom: 4 }}>
                New Password (min 8 chars)
              </Text>
              <TextInput
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor={colors.textMuted}
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.surfaceVariant,
                    color: colors.textPrimary,
                    borderRadius: borderRadius.sm,
                  },
                ]}
              />
            </View>

            <View style={styles.formGroup}>
              <Text variant="caption" color="secondary" weight="600" style={{ marginBottom: 4 }}>
                Confirm New Password
              </Text>
              <TextInput
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor={colors.textMuted}
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.surfaceVariant,
                    color: colors.textPrimary,
                    borderRadius: borderRadius.sm,
                  },
                ]}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setPasswordModalVisible(false)}
                activeOpacity={0.7}
                style={[styles.modalCancelBtn, { borderColor: colors.border }]}
              >
                <Text variant="buttonSmall" color="secondary" weight="600">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleChangePasswordSubmit}
                disabled={passwordLoading}
                activeOpacity={0.8}
                style={[
                  styles.modalSubmitBtn,
                  {
                    backgroundColor: colors.navy,
                    borderRadius: borderRadius.sm,
                    opacity: passwordLoading ? 0.7 : 1,
                  },
                ]}
              >
                {passwordLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text variant="buttonSmall" color="inverse" weight="700">
                    Update Password
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appBarTitle: {
    letterSpacing: -0.2,
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroCard: {
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroMeta: {
    marginLeft: 14,
    flex: 1,
  },
  studentNameText: {
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    flexWrap: 'wrap',
    gap: 6,
  },
  codeBadge: {
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 4,
  },
  sectionHeaderWrap: {
    marginTop: 18,
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    letterSpacing: 0.8,
    fontSize: 10.5,
  },
  infoCard: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  infoRowStacked: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  infoLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  infoIcon: {
    marginRight: 6,
  },
  infoValueText: {
    fontSize: 14,
    lineHeight: 19,
    flexWrap: 'wrap',
  },
  actionsCard: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 52,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  actionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginTop: 22,
    paddingVertical: 12,
    minHeight: 48,
  },
  footerNotice: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
    fontSize: 10.5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    padding: 20,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 12,
  },
  formGroup: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 10,
  },
  modalCancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    minHeight: 40,
    justifyContent: 'center',
  },
  modalSubmitBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
});
