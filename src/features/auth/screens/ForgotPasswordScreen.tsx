import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
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

type ForgotPasswordNavProp = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const navigation = useNavigation<ForgotPasswordNavProp>();

  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!identifier.trim()) {
      setError('Please provide your registered mobile number or email');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await authService.requestPasswordReset({ identifier });
      if (res.success) {
        navigation.navigate('OtpVerification', { identifier: identifier.trim() });
      } else {
        setError(res.error || 'Failed to dispatch verification code');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
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
          { paddingHorizontal: spacing.screenPadding, paddingTop: spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <IconButton
          icon={<Ionicons name="arrow-back" size={24} color={colors.textPrimary} />}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Back to Login"
          style={{ marginBottom: spacing.md }}
        />

        <View style={{ marginBottom: spacing.xl }}>
          <Text variant="h1" color="primary" weight="700">
            Reset Password
          </Text>
          <Text variant="body" color="secondary" style={{ marginTop: 6, lineHeight: 22 }}>
            Enter your registered student admission number, mobile number, or faculty email. We will send you an OTP to verify your account.
          </Text>
        </View>

        <Card elevation="sm" padding="lg">
          <Input
            label="Registered Mobile / Email / ID"
            placeholder="e.g. 9876543210 or FND-2025-1042"
            value={identifier}
            onChangeText={(text) => {
              setIdentifier(text);
              if (error) setError(null);
            }}
            autoCapitalize="none"
            leftIcon={<Ionicons name="mail-outline" size={18} color={colors.textSecondary} />}
            error={error}
          />

          <Button
            title="Send Verification Code"
            onPress={handleSubmit}
            loading={loading}
            variant="primary"
            fullWidth
            icon={<Ionicons name="send-outline" size={18} color={colors.onPrimary} />}
            iconPosition="right"
          />
        </Card>

        <View style={[styles.helpContainer, { marginTop: spacing.xxl }]}>
          <Text variant="bodySmall" color="muted" align="center">
            Facing trouble? Contact your branch coordinator at{' '}
            <Text variant="bodySmall" color="accent" weight="700">
              +91 7800001288
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
  },
  helpContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});
