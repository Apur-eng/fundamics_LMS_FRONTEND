import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/common/Card';
import { Input } from '../../../components/forms/Input';
import { IconButton } from '../../../components/common/IconButton';
import { authService } from '../../../services/api/authService';
import { AuthStackParamList } from '../../../app/navigation/types';

type ForgotPasswordRouteProp = RouteProp<AuthStackParamList, 'ForgotPassword'>;
type ForgotPasswordNavProp = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

// RFC 5322 compliant regex pattern for standard email format validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ForgotPasswordScreen: React.FC = () => {
  const { colors, spacing, borderRadius } = useTheme();
  const navigation = useNavigation<ForgotPasswordNavProp>();
  const route = useRoute<ForgotPasswordRouteProp>();

  const initialEmail = typeof route.params?.email === 'string' ? route.params.email.trim() : '';

  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const validate = (): boolean => {
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please enter your registered email address.');
      return false;
    }

    // Check if user entered a phone number or admission/student code instead of email
    if (/^\+?\d{7,15}$/.test(trimmed) || /^[A-Za-z]{2,5}-\d{4}-\d+$/i.test(trimmed)) {
      setError(
        'Password recovery requires your registered email address. Admission numbers and phone numbers are not supported.'
      );
      return false;
    }

    if (!EMAIL_REGEX.test(trimmed)) {
      setError('Please enter a valid email address (e.g. scholar@fundamics.in).');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (loading) return;
    setError(null);

    if (!validate()) {
      return;
    }

    setLoading(true);
    const trimmedEmail = email.trim().toLowerCase();

    try {
      const res = await authService.requestPasswordReset({ email: trimmedEmail });
      if (res.success) {
        setIsSuccess(true);
        setSuccessMessage(
          res.data?.message ||
            'If this account is registered and active, password reset instructions have been dispatched.'
        );
      } else {
        setError(res.error || 'Failed to dispatch password recovery request.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while requesting password reset.');
    } finally {
      setLoading(false);
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
          { paddingHorizontal: spacing.screenPadding, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <IconButton
          icon={<Ionicons name="arrow-back" size={24} color={colors.textPrimary} />}
          onPress={() => navigation.navigate('Login')}
          accessibilityLabel="Back to Login"
          style={{ marginBottom: spacing.md }}
        />

        {isSuccess ? (
          /* Truthful confirmation state rendered only after backend accepts the request */
          <Card elevation="sm" padding="lg">
            <View style={styles.confirmationContainer}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: colors.accent + '20', marginBottom: spacing.md },
                ]}
              >
                <Ionicons name="mail-open-outline" size={48} color={colors.accent} />
              </View>

              <Text variant="h2" color="primary" weight="700" align="center">
                Instructions Dispatched
              </Text>

              <Text
                variant="body"
                color="secondary"
                align="center"
                style={{ marginTop: spacing.sm, marginBottom: spacing.lg, lineHeight: 22 }}
              >
                {successMessage}
              </Text>

              <View
                style={[
                  styles.noticeBox,
                  {
                    backgroundColor: colors.surfaceVariant,
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    marginBottom: spacing.xl,
                  },
                ]}
              >
                <Text variant="caption" color="secondary" align="center">
                  Check your inbox and spam folder for an email containing your secure password reset token.
                </Text>
              </View>

              <Button
                title="Enter Reset Token & Set Password"
                onPress={() =>
                  navigation.navigate('ResetPassword', { email: email.trim().toLowerCase() })
                }
                variant="primary"
                fullWidth
                icon={<Ionicons name="key-outline" size={18} color={colors.onPrimary} />}
                iconPosition="right"
                style={{ marginBottom: spacing.md }}
              />

              <Button
                title="Back to Login"
                onPress={() => navigation.navigate('Login')}
                variant="outline"
                fullWidth
              />

              <TouchableOpacity
                onPress={() => {
                  setIsSuccess(false);
                  setError(null);
                }}
                activeOpacity={0.7}
                style={{ marginTop: spacing.lg }}
              >
                <Text variant="bodySmall" color="accent" align="center" weight="600">
                  Try another email address
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        ) : (
          <>
            <View style={{ marginBottom: spacing.xl }}>
              <Text variant="h1" color="primary" weight="700">
                Recover Password
              </Text>
              <Text variant="body" color="secondary" style={{ marginTop: 6, lineHeight: 22 }}>
                Enter your registered email address. If your email is registered with Fundamics LMS, password reset instructions and a reset token will be dispatched.
              </Text>
            </View>

            <Card elevation="sm" padding="lg">
              <Input
                label="Registered Email Address"
                placeholder="e.g. scholar@fundamics.in"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) setError(null);
                }}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                editable={!loading}
                leftIcon={<Ionicons name="mail-outline" size={18} color={colors.textSecondary} />}
                error={error}
                helperText="Must be the email registered on your Fundamics account"
              />

              <Button
                title={loading ? 'Sending Instructions...' : 'Send Reset Instructions'}
                onPress={handleSubmit}
                loading={loading}
                disabled={loading}
                variant="primary"
                fullWidth
                icon={<Ionicons name="paper-plane-outline" size={18} color={colors.onPrimary} />}
                iconPosition="right"
              />

              <View style={[styles.bottomRow, { marginTop: spacing.xl }]}>
                <Text variant="bodySmall" color="muted">
                  Already have a reset token?{' '}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ResetPassword', {
                      email: email.trim() ? email.trim().toLowerCase() : undefined,
                    })
                  }
                  activeOpacity={0.7}
                  disabled={loading}
                >
                  <Text variant="bodySmall" color="accent" weight="700">
                    Set New Password
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>

            <View style={[styles.helpContainer, { marginTop: spacing.xxl }]}>
              <Text variant="bodySmall" color="muted" align="center">
                Need academic support? Contact your branch coordinator at{' '}
                <Text variant="bodySmall" color="accent" weight="700">
                  +91 7800001288
                </Text>
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  confirmationContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeBox: {
    width: '100%',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});
