import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../app/navigation/types';
import { useTheme } from '../../../theme';
import { useAuth } from '../../../app/providers/AuthContext';
import { Text } from '../../../components/common/Text';
import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { Input } from '../../../components/forms/Input';
import { authService } from '../../../services/api/authService';
import { ApplicationStatus, ApplicationStatusResult } from '../../../types/auth';

type NavProp = NativeStackNavigationProp<AuthStackParamList, 'ApplicationStatus'>;
type ScreenRouteProp = RouteProp<AuthStackParamList, 'ApplicationStatus'>;

export const ApplicationStatusScreen: React.FC = () => {
  const { colors, spacing, borderRadius } = useTheme();
  const navigation = useNavigation<NavProp>();
  const route = useRoute<ScreenRouteProp>();
  const { login } = useAuth();

  const [email, setEmail] = useState<string>(route.params?.email || '');
  const [password, setPassword] = useState<string>('');
  const [verificationToken, setVerificationToken] = useState<string>(route.params?.prefillToken || '');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);

  const [statusResult, setStatusResult] = useState<ApplicationStatusResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verificationSuccessMessage, setVerificationSuccessMessage] = useState<string | null>(null);

  // If initial status was passed (e.g. from registration or login redirect)
  useEffect(() => {
    if (route.params?.initialStatus && route.params?.email) {
      const initStatus = route.params.initialStatus;
      let msg = '';
      if (initStatus === 'PENDING_VERIFICATION') {
        msg = 'Email verification is required before administrative approval.';
      } else if (initStatus === 'PENDING_APPROVAL') {
        msg = 'Your application is awaiting administrative verification by the Fundamics Lucknow team.';
      } else if (initStatus === 'REJECTED') {
        msg = 'Your application was not approved by the administration team.';
      } else if (initStatus === 'APPROVED') {
        msg = 'Your application is approved!';
      }
      setStatusResult({
        status: initStatus,
        message: msg,
        email: route.params.email,
      });
    }
  }, [route.params]);

  const handleCheckStatus = async () => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    setErrorMessage(null);
    setVerificationSuccessMessage(null);

    if (!cleanEmail) {
      setErrorMessage('Please enter your registered email address');
      return;
    }
    if (!cleanPassword) {
      setErrorMessage('Please enter your password to check status');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.checkApplicationStatus({
        email: cleanEmail,
        password: cleanPassword,
      });

      setStatusResult(result);
      if (result.status === 'INVALID_CREDENTIALS') {
        setErrorMessage(result.message);
      } else if (result.status === 'ERROR') {
        setErrorMessage(result.message);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to check application status.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!verificationToken.trim()) {
      setErrorMessage('Please enter the verification token received in your email.');
      return;
    }

    setIsVerifyingEmail(true);
    setErrorMessage(null);
    try {
      const res = await authService.verifyEmail(verificationToken.trim(), email.trim());
      if (res.success) {
        setVerificationSuccessMessage(
          'Email verified successfully! Your account status has been updated to PENDING APPROVAL.'
        );
        setStatusResult((prev) =>
          prev
            ? {
                ...prev,
                status: 'PENDING_APPROVAL',
                message: 'Email verified. Application is under review by Fundamics administration.',
              }
            : {
                status: 'PENDING_APPROVAL',
                message: 'Email verified. Application is under review by Fundamics administration.',
                email: email.trim(),
              }
        );
      }
    } catch (err: any) {
      setErrorMessage(err?.rawMessage || err?.message || 'Failed to verify email token.');
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your registered email address first.');
      return;
    }

    setIsResending(true);
    setErrorMessage(null);
    try {
      const res = await authService.resendVerification(email.trim());
      if (res.success) {
        setVerificationSuccessMessage(
          'Verification instructions have been re-dispatched to your email address.'
        );
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to resend verification email.');
    } finally {
      setIsResending(false);
    }
  };

  const handleProceedToDashboard = async () => {
    if (statusResult?.status === 'APPROVED' && password) {
      setIsLoading(true);
      try {
        await login({
          identifier: email.trim(),
          password,
          selectedRole: 'STUDENT',
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      navigation.navigate('Login', { prefillEmail: email.trim() });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: spacing.screenPadding, paddingBottom: spacing.massive },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Navigation Header */}
        <View style={[styles.topHeader, { marginTop: spacing.xl, marginBottom: spacing.lg }]}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={[
              styles.backButton,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Back to sign in"
          >
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.headerTitleGroup}>
            <Text variant="h2" color="primary" weight="700">
              Application Status
            </Text>
            <Text variant="caption" color="secondary">
              Track your enrollment & verification progress
            </Text>
          </View>
        </View>

        {/* Credentials Form Card */}
        <Card elevation="sm" padding="lg" style={{ marginBottom: spacing.lg }}>
          <Text variant="subtitle" color="primary" weight="700" style={{ marginBottom: spacing.xs }}>
            Verify Applicant Identity
          </Text>
          <Text variant="bodySmall" color="secondary" style={{ marginBottom: spacing.md }}>
            Enter your registration email and password to securely inspect the institutional approval status.
          </Text>

          <Input
            label="Registered Email"
            placeholder="e.g. aryan.srivastava@example.com"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              if (errorMessage) setErrorMessage(null);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            required
            leftIcon={<Ionicons name="mail-outline" size={18} color={colors.textSecondary} />}
          />

          <Input
            label="Password"
            placeholder="Enter your registration password"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              if (errorMessage) setErrorMessage(null);
            }}
            isPassword
            required
            leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} />}
          />

          {errorMessage && (
            <View
              style={[
                styles.alertBox,
                {
                  backgroundColor: colors.dangerContainer,
                  borderColor: colors.danger,
                  borderRadius: borderRadius.sm,
                  padding: spacing.sm,
                  marginBottom: spacing.md,
                },
              ]}
            >
              <Ionicons name="alert-circle" size={18} color={colors.danger} />
              <Text variant="caption" color="danger" style={{ flex: 1, marginLeft: spacing.xs }}>
                {errorMessage}
              </Text>
            </View>
          )}

          {verificationSuccessMessage && (
            <View
              style={[
                styles.alertBox,
                {
                  backgroundColor: colors.successContainer,
                  borderColor: colors.success,
                  borderRadius: borderRadius.sm,
                  padding: spacing.sm,
                  marginBottom: spacing.md,
                },
              ]}
            >
              <Ionicons name="checkmark-circle" size={18} color={colors.success} />
              <Text variant="caption" color="secondary" style={{ flex: 1, marginLeft: spacing.xs }}>
                {verificationSuccessMessage}
              </Text>
            </View>
          )}

          <Button
            title="Check Application Status"
            onPress={handleCheckStatus}
            loading={isLoading}
            variant="primary"
            fullWidth
            icon={<Ionicons name="search" size={18} color={colors.onPrimary} />}
          />
        </Card>

        {/* Status Outcome Display */}
        {statusResult && (
          <View>
            {/* 1. PENDING VERIFICATION */}
            {statusResult.status === 'PENDING_VERIFICATION' && (
              <Card elevation="md" padding="lg" style={styles.statusCard}>
                <View
                  style={[
                    styles.statusIconWrap,
                    { backgroundColor: colors.warningContainer, marginBottom: spacing.md },
                  ]}
                >
                  <Ionicons name="mail-unread-outline" size={36} color={colors.warning} />
                </View>

                <Badge label="Action Required: Verify Email" variant="warning" size="sm" />

                <Text
                  variant="h3"
                  color="primary"
                  weight="700"
                  align="center"
                  style={{ marginTop: spacing.md, marginBottom: spacing.xs }}
                >
                  Email Verification Pending
                </Text>

                <Text
                  variant="bodySmall"
                  color="secondary"
                  align="center"
                  style={{ lineHeight: 20, marginBottom: spacing.lg }}
                >
                  We sent a 24-hour verification link to{' '}
                  <Text variant="bodySmall" color="primary" weight="700">
                    {statusResult.email}
                  </Text>
                  . Please check your inbox and spam folders. Once verified, your application moves directly to administrative review.
                </Text>

                {/* Direct Token Entry Box */}
                <View
                  style={[
                    styles.tokenVerificationBox,
                    {
                      backgroundColor: colors.surfaceVariant,
                      borderColor: colors.border,
                      borderRadius: borderRadius.md,
                      padding: spacing.md,
                      width: '100%',
                      marginBottom: spacing.md,
                    },
                  ]}
                >
                  <Text variant="subtitle" color="primary" weight="600" style={{ marginBottom: 4 }}>
                    Have your verification token?
                  </Text>
                  <Text variant="caption" color="secondary" style={{ marginBottom: spacing.sm }}>
                    Enter or paste the token received in your verification email:
                  </Text>
                  <Input
                    placeholder="Paste verification token here"
                    value={verificationToken}
                    onChangeText={setVerificationToken}
                    autoCapitalize="none"
                    leftIcon={<Ionicons name="key-outline" size={18} color={colors.textSecondary} />}
                  />
                  <Button
                    title="Confirm Email Verification"
                    variant="primary"
                    size="sm"
                    loading={isVerifyingEmail}
                    onPress={handleVerifyEmail}
                    fullWidth
                  />
                </View>

                {/* Resend Link */}
                <Button
                  title="Resend Verification Email"
                  variant="outline"
                  size="md"
                  loading={isResending}
                  onPress={handleResendEmail}
                  fullWidth
                  icon={<Ionicons name="refresh-outline" size={16} color={colors.primary} />}
                />
              </Card>
            )}

            {/* 2. PENDING APPROVAL */}
            {statusResult.status === 'PENDING_APPROVAL' && (
              <Card elevation="md" padding="lg" style={styles.statusCard}>
                <View
                  style={[
                    styles.statusIconWrap,
                    { backgroundColor: colors.primaryContainer, marginBottom: spacing.md },
                  ]}
                >
                  <Ionicons name="time-outline" size={36} color={colors.primary} />
                </View>

                <Badge label="Application Under Review" variant="accent" size="sm" />

                <Text
                  variant="h3"
                  color="primary"
                  weight="700"
                  align="center"
                  style={{ marginTop: spacing.md, marginBottom: spacing.xs }}
                >
                  Under Review by Administration
                </Text>

                <Text
                  variant="bodySmall"
                  color="secondary"
                  align="center"
                  style={{ lineHeight: 20, marginBottom: spacing.lg }}
                >
                  Your email is verified! The Fundamics Lucknow Flagship campus administration is reviewing your admission details and finalising batch capacity. You will be notified as soon as approval is granted.
                </Text>

                <View
                  style={[
                    styles.infoRowBox,
                    {
                      backgroundColor: colors.surfaceVariant,
                      borderColor: colors.border,
                      borderRadius: borderRadius.md,
                      padding: spacing.md,
                      width: '100%',
                      marginBottom: spacing.lg,
                    },
                  ]}
                >
                  <View style={styles.infoRowItem}>
                    <Text variant="caption" color="muted">
                      Application Status:
                    </Text>
                    <Text variant="bodySmall" color="primary" weight="600">
                      PENDING APPROVAL
                    </Text>
                  </View>
                  <View style={styles.infoRowItem}>
                    <Text variant="caption" color="muted">
                      Email Verification:
                    </Text>
                    <Text variant="bodySmall" color="secondary" weight="600">
                      Verified
                    </Text>
                  </View>
                  <View style={styles.infoRowItem}>
                    <Text variant="caption" color="muted">
                      Admissions Campus:
                    </Text>
                    <Text variant="bodySmall" color="secondary" weight="600">
                      Triveni Nagar Flagship
                    </Text>
                  </View>
                </View>

                <Button
                  title="Re-check Status"
                  variant="outline"
                  onPress={handleCheckStatus}
                  loading={isLoading}
                  fullWidth
                  icon={<Ionicons name="refresh" size={18} color={colors.primary} />}
                />
              </Card>
            )}

            {/* 3. APPROVED */}
            {statusResult.status === 'APPROVED' && (
              <Card elevation="md" padding="lg" style={styles.statusCard}>
                <View
                  style={[
                    styles.statusIconWrap,
                    { backgroundColor: colors.successContainer, marginBottom: spacing.md },
                  ]}
                >
                  <Ionicons name="school" size={40} color={colors.success} />
                </View>

                <Badge label="Admission Confirmed & Active" variant="neutral" size="sm" />

                <Text
                  variant="h2"
                  color="primary"
                  weight="700"
                  align="center"
                  style={{ marginTop: spacing.md, marginBottom: spacing.xs }}
                >
                  Application Approved!
                </Text>

                <Text
                  variant="bodySmall"
                  color="secondary"
                  align="center"
                  style={{ lineHeight: 20, marginBottom: spacing.lg }}
                >
                  Congratulations! Your student admission has been verified and approved by the Fundamics academic committee.
                </Text>

                {/* Authentic Student ID Badge */}
                {statusResult.studentCode && (
                  <View
                    style={[
                      styles.studentIdBox,
                      {
                        backgroundColor: colors.surfaceVariant,
                        borderColor: colors.primary,
                        borderRadius: borderRadius.lg,
                        padding: spacing.lg,
                        width: '100%',
                        marginBottom: spacing.xl,
                      },
                    ]}
                  >
                    <Text variant="caption" color="secondary" weight="700" align="center">
                      OFFICIAL STUDENT ID
                    </Text>
                    <Text
                      variant="h2"
                      color="primary"
                      weight="700"
                      align="center"
                      style={{ letterSpacing: 1.5, marginVertical: spacing.xs }}
                    >
                      {statusResult.studentCode}
                    </Text>
                    {statusResult.studentName && (
                      <Text variant="subtitle" color="secondary" align="center">
                        {statusResult.studentName}
                      </Text>
                    )}
                    <Text
                      variant="caption"
                      color="muted"
                      align="center"
                      style={{ marginTop: spacing.xs }}
                    >
                      Fundamics Lucknow Flagship Scholar
                    </Text>
                  </View>
                )}

                <Button
                  title="Proceed to Student Portal"
                  variant="primary"
                  size="lg"
                  loading={isLoading}
                  onPress={handleProceedToDashboard}
                  fullWidth
                  icon={<Ionicons name="arrow-forward" size={20} color={colors.onPrimary} />}
                  iconPosition="right"
                />
              </Card>
            )}

            {/* 4. REJECTED */}
            {statusResult.status === 'REJECTED' && (
              <Card elevation="md" padding="lg" style={styles.statusCard}>
                <View
                  style={[
                    styles.statusIconWrap,
                    { backgroundColor: colors.dangerContainer, marginBottom: spacing.md },
                  ]}
                >
                  <Ionicons name="close-circle-outline" size={40} color={colors.danger} />
                </View>

                <Badge label="Registration Not Approved" variant="danger" size="sm" />

                <Text
                  variant="h3"
                  color="danger"
                  weight="700"
                  align="center"
                  style={{ marginTop: spacing.md, marginBottom: spacing.xs }}
                >
                  Application Not Approved
                </Text>

                <Text
                  variant="bodySmall"
                  color="secondary"
                  align="center"
                  style={{ lineHeight: 20, marginBottom: spacing.lg }}
                >
                  Your registration could not be confirmed at this time. For details regarding prerequisite requirements or batch re-application, please speak directly with the campus administration.
                </Text>

                <View
                  style={[
                    styles.contactCard,
                    {
                      backgroundColor: colors.surfaceVariant,
                      borderColor: colors.border,
                      borderRadius: borderRadius.md,
                      padding: spacing.md,
                      width: '100%',
                      marginBottom: spacing.lg,
                    },
                  ]}
                >
                  <Text variant="subtitle" color="primary" weight="600">
                    Lucknow Admissions Office
                  </Text>
                  <Text variant="caption" color="secondary" style={{ marginTop: 2 }}>
                    Triveni Nagar Flagship Campus, Lucknow
                  </Text>
                  <Text variant="caption" color="primary" weight="700" style={{ marginTop: 4 }}>
                    Helpline: +91 7617018888
                  </Text>
                </View>

                <Button
                  title="Back to Sign In"
                  variant="outline"
                  onPress={() => navigation.navigate('Login')}
                  fullWidth
                />
              </Card>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitleGroup: {
    flex: 1,
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  statusCard: {
    alignItems: 'center',
  },
  statusIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tokenVerificationBox: {
    borderWidth: 1,
  },
  infoRowBox: {
    borderWidth: 1,
    gap: 8,
  },
  infoRowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentIdBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  contactCard: {
    borderWidth: 1,
    alignItems: 'center',
  },
});
