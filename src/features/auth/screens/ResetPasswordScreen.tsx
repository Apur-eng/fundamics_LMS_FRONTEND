import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
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

type ResetPasswordRouteProp = RouteProp<AuthStackParamList, 'ResetPassword'>;
type ResetPasswordNavProp = NativeStackNavigationProp<AuthStackParamList, 'ResetPassword'>;

export const ResetPasswordScreen: React.FC = () => {
  const { colors, spacing, borderRadius } = useTheme();
  const route = useRoute<ResetPasswordRouteProp>();
  const navigation = useNavigation<ResetPasswordNavProp>();

  // Safely extract token and email from route or deep link parameters
  const routeToken = typeof route.params?.token === 'string' ? route.params.token.trim() : '';
  const routeEmail = typeof route.params?.email === 'string' ? route.params.email.trim() : '';

  const [token, setToken] = useState(routeToken);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const validate = (): boolean => {
    if (!token.trim()) {
      setError('Please provide the reset token received in your email.');
      return false;
    }
    if (!newPassword) {
      setError('Please enter your new password.');
      return false;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }
    if (newPassword.length > 128) {
      setError('Password cannot exceed 128 characters.');
      return false;
    }
    if (!confirmPassword) {
      setError('Please confirm your new password.');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation password do not match.');
      return false;
    }
    return true;
  };

  const handleResetPassword = async () => {
    if (loading) return;
    setError(null);

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      const res = await authService.resetPassword({
        token: token.trim(),
        newPassword,
      });

      if (res.success) {
        setIsSuccess(true);
        setSuccessMessage(
          res.data?.message || 'Password reset successful. Please login with your new credentials.'
        );
      } else {
        setError(res.error || 'Failed to reset password. Please check your token and try again.');
      }
    } catch (err: any) {
      setError(
        err.message || 'Failed to complete password reset. The token may be invalid or expired.'
      );
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
          /* Truthful confirmation state rendered only after backend confirms password reset */
          <Card elevation="sm" padding="lg">
            <View style={styles.successIconContainer}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: colors.accent + '20', marginBottom: spacing.md },
                ]}
              >
                <Ionicons name="checkmark-circle" size={48} color={colors.accent} />
              </View>
              <Text variant="h2" color="primary" weight="700" align="center">
                Password Reset Complete
              </Text>
              <Text
                variant="body"
                color="secondary"
                align="center"
                style={{ marginTop: spacing.sm, marginBottom: spacing.xl, lineHeight: 22 }}
              >
                {successMessage}
              </Text>

              <Button
                title="Proceed to Login"
                onPress={() => navigation.navigate('Login')}
                variant="primary"
                fullWidth
                icon={<Ionicons name="log-in-outline" size={18} color={colors.onPrimary} />}
                iconPosition="right"
              />
            </View>
          </Card>
        ) : (
          <>
            <View style={{ marginBottom: spacing.xl }}>
              <Text variant="h1" color="primary" weight="700">
                Set New Password
              </Text>
              <Text variant="body" color="secondary" style={{ marginTop: 6, lineHeight: 22 }}>
                Enter the password reset token received by email and choose a strong new password (minimum 8 characters).
              </Text>
            </View>

            <Card elevation="sm" padding="lg">
              <Input
                label="Reset Token"
                placeholder="Paste the reset token from your email"
                value={token}
                onChangeText={(text) => {
                  setToken(text);
                  if (error) setError(null);
                }}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                leftIcon={<Ionicons name="key-outline" size={18} color={colors.textSecondary} />}
                helperText={
                  routeToken
                    ? 'Reset token prefilled from link'
                    : 'Check your email inbox or spam folder for your reset token'
                }
              />

              <Input
                label="New Password"
                placeholder="Minimum 8 characters"
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  if (error) setError(null);
                }}
                isPassword
                editable={!loading}
                leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} />}
                helperText="Must be between 8 and 128 characters"
              />

              <Input
                label="Confirm New Password"
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (error) setError(null);
                }}
                isPassword
                editable={!loading}
                leftIcon={<Ionicons name="shield-checkmark-outline" size={18} color={colors.textSecondary} />}
              />

              {error && (
                <View
                  style={[
                    styles.errorBanner,
                    {
                      backgroundColor: colors.danger + '18',
                      borderColor: colors.danger,
                      borderRadius: borderRadius.sm,
                      padding: spacing.sm,
                      marginBottom: spacing.md,
                    },
                  ]}
                >
                  <Ionicons name="alert-circle-outline" size={18} color={colors.danger} style={{ marginRight: 6 }} />
                  <Text variant="bodySmall" color="danger" style={{ flex: 1 }}>
                    {error}
                  </Text>
                </View>
              )}

              <Button
                title={loading ? 'Updating Password...' : 'Save New Password'}
                onPress={handleResetPassword}
                loading={loading}
                disabled={loading}
                variant="primary"
                fullWidth
                icon={<Ionicons name="save-outline" size={18} color={colors.onPrimary} />}
                iconPosition="right"
              />

              <View style={[styles.bottomRow, { marginTop: spacing.lg }]}>
                <Text variant="bodySmall" color="muted">
                  Need a new reset token?{' '}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ForgotPassword', { email: routeEmail || undefined })
                  }
                  activeOpacity={0.7}
                  disabled={loading}
                >
                  <Text variant="bodySmall" color="accent" weight="700">
                    Request Again
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
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
  successIconContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
