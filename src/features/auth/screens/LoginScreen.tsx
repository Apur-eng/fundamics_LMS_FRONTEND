import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { Input } from '../../../components/forms/Input';
import { useAuth } from '../../../app/providers/AuthContext';
import { UserRole } from '../../../types/auth';
import { AuthStackParamList } from '../../../app/navigation/types';

type LoginNavProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

const ROLES: { role: UserRole; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { role: 'STUDENT', label: 'Student', icon: 'school-outline' },
  { role: 'TEACHER', label: 'Faculty', icon: 'person-outline' },
  { role: 'ADMIN', label: 'Admin', icon: 'shield-checkmark-outline' },
];

export const LoginScreen: React.FC = () => {
  const { colors, spacing, borderRadius } = useTheme();
  const navigation = useNavigation<LoginNavProp>();
  const { login, isLoading, error, clearError } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    clearError();
    setValidationError(null);
  };

  const handleLogin = async () => {
    setValidationError(null);
    clearError();

    // Default credentials for seamless Phase 1 evaluation
    const idToUse = identifier.trim() || (selectedRole === 'STUDENT' ? 'FND-2025-1042' : '9876543210');
    const pwdToUse = password.trim() || 'password123';

    await login({
      identifier: idToUse,
      password: pwdToUse,
      selectedRole,
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
            <Ionicons name="book-outline" size={32} color={colors.primary} />
          </View>
          <Text variant="h1" color="primary" weight="700">
            Fundemics LMS
          </Text>
          <Text variant="body" color="secondary" style={{ marginTop: 4 }}>
            Sign in to access your coaching portal
          </Text>
        </View>

        {/* Role Segmented Selector */}
        <View
          style={[
            styles.roleSelector,
            {
              backgroundColor: colors.surfaceVariant,
              borderRadius: borderRadius.md,
              padding: 4,
              marginBottom: spacing.lg,
            },
          ]}
        >
          {ROLES.map((r) => {
            const isSelected = selectedRole === r.role;
            return (
              <TouchableOpacity
                key={r.role}
                onPress={() => handleRoleSelect(r.role)}
                activeOpacity={0.8}
                style={[
                  styles.roleTab,
                  {
                    backgroundColor: isSelected ? colors.surface : 'transparent',
                    borderRadius: borderRadius.sm,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                <Ionicons
                  name={r.icon}
                  size={16}
                  color={isSelected ? colors.primary : colors.textMuted}
                  style={{ marginRight: 6 }}
                />
                <Text
                  variant="buttonSmall"
                  color={isSelected ? 'primary' : 'muted'}
                  weight={isSelected ? '600' : '400'}
                >
                  {r.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Form Container */}
        <Card elevation="sm" padding="lg">
          <Input
            label={selectedRole === 'STUDENT' ? 'Admission No / Mobile' : 'Mobile / Official Email'}
            placeholder={
              selectedRole === 'STUDENT'
                ? 'e.g. FND-2025-1042 or 9876543210'
                : 'e.g. manish.verma@fundamics.in'
            }
            value={identifier}
            onChangeText={(text) => {
              setIdentifier(text);
              if (validationError) setValidationError(null);
            }}
            autoCapitalize="none"
            leftIcon={<Ionicons name="person-outline" size={18} color={colors.textSecondary} />}
            helperText="Press Sign In with empty fields to auto-fill mock credentials"
          />

          <Input
            label="Password"
            placeholder="Enter password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (validationError) setValidationError(null);
            }}
            isPassword
            leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} />}
          />

          <View style={styles.forgotRow}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <Text variant="bodySmall" color="accent" weight="600">
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>

          {(validationError || error) && (
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
              <Text variant="caption" color="danger">
                {validationError || error}
              </Text>
            </View>
          )}

          <Button
            title={`Sign In as ${selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase()}`}
            onPress={handleLogin}
            loading={isLoading}
            variant="primary"
            fullWidth
            icon={<Ionicons name="arrow-forward-outline" size={18} color={colors.onPrimary} />}
            iconPosition="right"
          />
        </Card>

        {/* Institutional Contact Bar */}
        <View style={[styles.contactCard, { marginTop: spacing.xl }]}>
          <Badge label="Lucknow Flagship Campus" variant="neutral" size="sm" />
          <Text variant="caption" color="muted" align="center" style={{ marginTop: spacing.xs }}>
            For admissions or portal access support, call{' '}
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
  roleSelector: {
    flexDirection: 'row',
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  forgotRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
    marginTop: -8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactCard: {
    alignItems: 'center',
  },
});
