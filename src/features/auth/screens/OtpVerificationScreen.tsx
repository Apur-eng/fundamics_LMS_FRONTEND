import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
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

type OtpRouteProp = RouteProp<AuthStackParamList, 'OtpVerification'>;
type OtpNavProp = NativeStackNavigationProp<AuthStackParamList, 'OtpVerification'>;

export const OtpVerificationScreen: React.FC = () => {
  const { colors, spacing, borderRadius } = useTheme();
  const route = useRoute<OtpRouteProp>();
  const navigation = useNavigation<OtpNavProp>();

  const identifier = route.params?.identifier || 'your account';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(45);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    if (otp.length < 4) {
      setError('Please enter a valid verification code');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await authService.verifyOtp({ identifier, otp });
      if (res.success) {
        setSuccessMsg('Identity verified! Redirecting to login...');
        setTimeout(() => {
          navigation.navigate('Login');
        }, 1200);
      } else {
        setError(res.error || 'Invalid verification code');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setTimer(45);
    setError(null);
    await authService.requestPasswordReset({ identifier });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: spacing.screenPadding, paddingTop: spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <IconButton
          icon={<Ionicons name="arrow-back" size={24} color={colors.textPrimary} />}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Back"
          style={{ marginBottom: spacing.md }}
        />

        <View style={{ marginBottom: spacing.xl }}>
          <Text variant="h1" color="primary" weight="700">
            Verify OTP
          </Text>
          <Text variant="body" color="secondary" style={{ marginTop: 6, lineHeight: 22 }}>
            A 6-digit verification code has been dispatched to{' '}
            <Text variant="body" color="primary" weight="600">
              {identifier}
            </Text>
            .
          </Text>
        </View>

        <Card elevation="sm" padding="lg">
          <Input
            label="6-Digit Verification Code"
            placeholder="e.g. 123456"
            value={otp}
            onChangeText={(text) => {
              setOtp(text);
              if (error) setError(null);
            }}
            keyboardType="number-pad"
            maxLength={6}
            leftIcon={<Ionicons name="key-outline" size={18} color={colors.textSecondary} />}
            error={error}
          />

          {successMsg && (
            <View
              style={[
                styles.successBox,
                {
                  backgroundColor: colors.successContainer,
                  borderRadius: borderRadius.sm,
                  padding: spacing.sm,
                  marginBottom: spacing.md,
                },
              ]}
            >
              <Text variant="caption" color="success">
                {successMsg}
              </Text>
            </View>
          )}

          <Button
            title="Verify & Proceed"
            onPress={handleVerify}
            loading={loading}
            variant="accent"
            fullWidth
          />

          <View style={[styles.resendRow, { marginTop: spacing.lg }]}>
            <Text variant="bodySmall" color="muted">
              Didn't receive the code?{' '}
            </Text>
            {timer > 0 ? (
              <Text variant="bodySmall" color="secondary">
                Resend in {timer}s
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
                <Text variant="bodySmall" color="accent" weight="700">
                  Resend Code
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  successBox: {
    alignItems: 'center',
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
