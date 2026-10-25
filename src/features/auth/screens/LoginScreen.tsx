import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { Input } from '../../../components/forms/Input';
import { useAuth } from '../../../app/providers/AuthContext';
import { AuthStackParamList } from '../../../app/navigation/types';

type LoginNavProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;
type LoginRouteProp = RouteProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const { colors, spacing, borderRadius } = useTheme();
  const navigation = useNavigation<LoginNavProp>();
  const route = useRoute<LoginRouteProp>();
  const { login, isLoading, error, clearError } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // If navigated with prefilled email
  useEffect(() => {
    if (route.params?.prefillEmail) {
      setIdentifier(route.params.prefillEmail);
    }
  }, [route.params?.prefillEmail]);

  const isPendingVerification = error?.includes('PENDING_VERIFICATION');
  const isPendingApproval = error?.includes('PENDING_APPROVAL');
  const isRejected = error?.includes('REJECTED');

  const handleLogin = async () => {
    setValidationError(null);
    clearError();

    const trimmedId = identifier.trim();
    const trimmedPwd = password.trim();

    if (!trimmedId) {
      setValidationError('Please enter your Student Email or Admission No.');
      return;
    }

    if (!trimmedPwd) {
      setValidationError('Please enter your password');
      return;
    }

    await login({
      identifier: trimmedId,
      password: trimmedPwd,
      selectedRole: 'STUDENT',
    });
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
        {/* Header Branding */}
        <View style={[styles.header, { marginTop: spacing.xxl, marginBottom: spacing.xl }]}>
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: colors.primaryContainer,
                borderRadius: borderRadius.lg,
                marginBottom: spacing.md,
              },
            ]}
          >
            <Ionicons name="school-outline" size={34} color={colors.primary} />
          </View>
          <Text variant="h1" color="primary" weight="700">
            Fundamics LMS
          </Text>
          <Text variant="body" color="secondary" style={{ marginTop: 4 }}>
            Student Academic Portal • Lucknow Campus
          </Text>
        </View>

        {/* Student Sign In Card */}
        <Card elevation="sm" padding="lg">
          <Text variant="subtitle" color="primary" weight="700" style={{ marginBottom: spacing.xs }}>
            Student Sign In
          </Text>
          <Text variant="bodySmall" color="secondary" style={{ marginBottom: spacing.md }}>
            Access your classes, attendance records, study material, and test scorecards.
          </Text>

          <Input
            label="Student Email or Admission No."
            placeholder="e.g. aryan@example.com or STU-2026-6BDD84"
            value={identifier}
            onChangeText={(text) => {
              setIdentifier(text);
              if (validationError) setValidationError(null);
              if (error) clearError();
            }}
            autoCapitalize="none"
            leftIcon={<Ionicons name="person-outline" size={18} color={colors.textSecondary} />}
          />

          <Input
            label="Password"
            placeholder="Enter your student password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (validationError) setValidationError(null);
              if (error) clearError();
            }}
            isPassword
            leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} />}
          />

          <View style={styles.actionRow}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword', { email: identifier.trim() })}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <Text variant="bodySmall" color="secondary" weight="600">
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Dedicated Status Banner for Pending/Rejected Applicants */}
          {(isPendingVerification || isPendingApproval || isRejected) && (
            <View
              style={[
                styles.statusBanner,
                {
                  backgroundColor: isRejected
                    ? colors.dangerContainer
                    : isPendingVerification
                    ? colors.warningContainer
                    : colors.primaryContainer,
                  borderColor: isRejected
                    ? colors.danger
                    : isPendingVerification
                    ? colors.warning
                    : colors.primary,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  marginBottom: spacing.md,
                },
              ]}
            >
              <View style={styles.statusBannerHeader}>
                <Ionicons
                  name={
                    isRejected
                      ? 'close-circle-outline'
                      : isPendingVerification
                      ? 'mail-unread-outline'
                      : 'time-outline'
                  }
                  size={20}
                  color={
                    isRejected
                      ? colors.danger
                      : isPendingVerification
                      ? colors.warning
                      : colors.primary
                  }
                />
                <Text
                  variant="subtitle"
                  color={isRejected ? 'danger' : 'primary'}
                  weight="700"
                  style={{ marginLeft: spacing.xs }}
                >
                  {isPendingVerification
                    ? 'Email Verification Required'
                    : isPendingApproval
                    ? 'Application Under Review'
                    : 'Registration Not Approved'}
                </Text>
              </View>

              <Text variant="caption" color="secondary" style={{ marginVertical: spacing.xs, lineHeight: 18 }}>
                {isPendingVerification
                  ? 'Your account has been registered, but your email address has not yet been verified.'
                  : isPendingApproval
                  ? 'Your registration is awaiting approval by the Fundamics Lucknow Campus administration team.'
                  : 'Your student application could not be approved at this time. Please contact the campus office.'}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ApplicationStatus', {
                    email: identifier.trim(),
                    initialStatus: isPendingVerification
                      ? 'PENDING_VERIFICATION'
                      : isPendingApproval
                      ? 'PENDING_APPROVAL'
                      : 'REJECTED',
                  })
                }
                style={[
                  styles.statusBannerButton,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderRadius: borderRadius.sm,
                    marginTop: spacing.xs,
                  },
                ]}
              >
                <Ionicons name="search-outline" size={14} color={colors.primary} />
                <Text variant="caption" color="primary" weight="700" style={{ marginLeft: 6 }}>
                  {isPendingVerification ? 'Verify Email / Check Status' : 'Check Application Status'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Standard Error Notice */}
          {!isPendingVerification && !isPendingApproval && !isRejected && (validationError || error) && (
            <View
              style={[
                styles.errorContainer,
                {
                  backgroundColor: colors.dangerContainer,
                  borderRadius: borderRadius.sm,
                  padding: spacing.sm,
                  marginBottom: spacing.md,
                },
              ]}
            >
              <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
              <Text variant="caption" color="danger" style={{ flex: 1, marginLeft: spacing.xs }}>
                {validationError || error}
              </Text>
            </View>
          )}

          <Button
            title="Sign In to Student Portal"
            onPress={handleLogin}
            loading={isLoading}
            variant="primary"
            fullWidth
            icon={<Ionicons name="arrow-forward-outline" size={18} color={colors.onPrimary} />}
            iconPosition="right"
          />
        </Card>

        {/* New Student Registration Banner */}
        <Card
          elevation="none"
          padding="md"
          style={[
            styles.registerCard,
            {
              backgroundColor: colors.surfaceVariant,
              borderColor: colors.border,
              borderRadius: borderRadius.md,
              marginTop: spacing.lg,
            },
          ]}
        >
          <View style={styles.registerRow}>
            <View style={{ flex: 1 }}>
              <Text variant="subtitle" color="primary" weight="700">
                New to Fundamics?
              </Text>
              <Text variant="caption" color="secondary" style={{ marginTop: 2 }}>
                Apply for admission in Class 10 & 12 Science batches.
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              style={[
                styles.registerButton,
                {
                  backgroundColor: colors.primary,
                  borderRadius: borderRadius.sm,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Register as new student"
            >
              <Text variant="buttonSmall" color="inverse" weight="700">
                Register Here
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Track Application Status Shortcut */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ApplicationStatus', {
              email: identifier.trim() || undefined,
            })
          }
          style={[styles.statusLinkRow, { marginTop: spacing.md }]}
          activeOpacity={0.7}
        >
          <Ionicons name="clipboard-outline" size={16} color={colors.primary} />
          <Text variant="bodySmall" color="primary" weight="600" style={{ marginLeft: 6 }}>
            Already applied? Check Application Status
          </Text>
        </TouchableOpacity>

        {/* Institutional Contact Bar */}
        <View style={[styles.contactCard, { marginTop: spacing.xl }]}>
          <Badge label="Lucknow Flagship Campus • Triveni Nagar" variant="neutral" size="sm" />
          <Text variant="caption" color="muted" align="center" style={{ marginTop: spacing.xs }}>
            For admissions inquiry or portal access assistance, call{' '}
            <Text variant="caption" color="accent" weight="700">
              +91 7617018888
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
  },
  iconWrapper: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: -4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBanner: {
    borderWidth: 1,
  },
  statusBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  registerCard: {
    borderWidth: 1,
  },
  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  registerButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginLeft: 8,
  },
  statusLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  contactCard: {
    alignItems: 'center',
  },
});
