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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../app/navigation/types';
import { useTheme } from '../../../theme';
import { Text } from '../../../components/common/Text';
import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { Input } from '../../../components/forms/Input';
import { authService } from '../../../services/api/authService';
import {
  academicService,
  AcademicClass,
  AcademicBatch,
  BOARDS,
} from '../../../services/api/academicService';
import { StudentRegistrationFormData } from '../../../types/auth';

type NavProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

const TOTAL_STEPS = 5;

const INITIAL_FORM: StudentRegistrationFormData = {
  name: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  password: '',
  confirmPassword: '',

  parentName: '',
  relationship: 'Father',
  parentPhone: '',
  parentEmail: '',
  emergencyContact: '',

  board: 'CBSE',
  classId: '',
  batchId: '',
  academicSession: '2026-2027',
  schoolName: '',

  addressLine: '',
  city: 'Lucknow',
  state: 'Uttar Pradesh',
  pinCode: '',

  consentAgreed: false,
};

const RELATIONSHIPS = ['Father', 'Mother', 'Legal Guardian'];
const GENDERS = ['Male', 'Female', 'Other'];

export const RegisterScreen: React.FC = () => {
  const { colors, spacing, borderRadius, typography } = useTheme();
  const navigation = useNavigation<NavProp>();

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<StudentRegistrationFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Dynamic academic data
  const [classes, setClasses] = useState<AcademicClass[]>([]);
  const [batches, setBatches] = useState<AcademicBatch[]>([]);
  const [isLoadingAcademics, setIsLoadingAcademics] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const loadAcademics = async () => {
      setIsLoadingAcademics(true);
      try {
        const clsList = await academicService.getClasses();
        if (isMounted) {
          setClasses(clsList);
          if (clsList.length > 0 && !formData.classId) {
            const defaultClass = clsList[0];
            const batchList = await academicService.getBatches(defaultClass.id);
            if (isMounted) {
              setBatches(batchList);
              setFormData((prev) => ({
                ...prev,
                classId: defaultClass.id,
                batchId: batchList[0]?.id || '',
              }));
            }
          }
        }
      } finally {
        if (isMounted) setIsLoadingAcademics(false);
      }
    };
    loadAcademics();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleClassChange = async (selectedClassId: string) => {
    setFormData((prev) => ({ ...prev, classId: selectedClassId, batchId: '' }));
    setIsLoadingAcademics(true);
    try {
      const batchList = await academicService.getBatches(selectedClassId);
      setBatches(batchList);
      if (batchList.length > 0) {
        setFormData((prev) => ({ ...prev, batchId: batchList[0].id }));
      }
    } finally {
      setIsLoadingAcademics(false);
    }
  };

  const updateField = (key: keyof StudentRegistrationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
    if (serverError) setServerError(null);
  };

  // Client-side step validation
  const validateStep = (currentStep: number): boolean => {
    const stepErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) {
        stepErrors.name = 'Full name is required';
      }
      if (!formData.email.trim()) {
        stepErrors.email = 'Email address is required';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
          stepErrors.email = 'Please enter a valid email address';
        }
      }
      if (!formData.phone.trim()) {
        stepErrors.phone = 'Phone number is required';
      } else {
        const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
        if (cleanPhone.length < 10) {
          stepErrors.phone = 'Please enter a valid 10-digit mobile number';
        }
      }
      if (!formData.password) {
        stepErrors.password = 'Password is required (min 8 characters)';
      } else if (formData.password.length < 8) {
        stepErrors.password = 'Password must be at least 8 characters long';
      }
      if (formData.password !== formData.confirmPassword) {
        stepErrors.confirmPassword = 'Passwords do not match';
      }
    } else if (currentStep === 2) {
      if (!formData.parentName.trim()) {
        stepErrors.parentName = 'Parent/Guardian name is required';
      }
      if (!formData.parentPhone.trim()) {
        stepErrors.parentPhone = 'Parent phone number is required';
      } else {
        const cleanPhone = formData.parentPhone.replace(/[^0-9]/g, '');
        if (cleanPhone.length < 10) {
          stepErrors.parentPhone = 'Please enter a valid 10-digit phone number';
        }
      }
    } else if (currentStep === 3) {
      if (!formData.classId) {
        stepErrors.classId = 'Please select your academic class';
      }
      if (!formData.batchId) {
        stepErrors.batchId = 'Please select a batch';
      }
    } else if (currentStep === 4) {
      if (!formData.addressLine?.trim()) {
        stepErrors.addressLine = 'Address is required';
      }
      if (!formData.city.trim()) {
        stepErrors.city = 'City is required';
      }
      if (!formData.pinCode.trim()) {
        stepErrors.pinCode = 'PIN code is required';
      } else if (!/^[0-9]{6}$/.test(formData.pinCode.trim())) {
        stepErrors.pinCode = 'PIN code must be exactly 6 digits';
      }
    } else if (currentStep === 5) {
      if (!formData.consentAgreed) {
        stepErrors.consentAgreed = 'You must confirm and agree to institutional guidelines to proceed';
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    }
  };

  const handleBack = () => {
    setServerError(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    setServerError(null);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        class_id: formData.classId,
        batch_id: formData.batchId,
      };

      const res = await authService.registerStudent(payload);
      if (res.success) {
        setIsSubmitted(true);
      } else {
        setServerError('Submission was not completed. Please try again.');
      }
    } catch (err: any) {
      setServerError(
        err?.rawMessage ||
        err?.message ||
        'Failed to submit registration. Please check your network connection and details.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Confirmation Screen Render ---
  if (isSubmitted) {
    return (
      <View style={[styles.screenContainer, { backgroundColor: colors.background }]}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: spacing.screenPadding, paddingVertical: spacing.massive },
          ]}
        >
          <Card elevation="sm" padding="lg" style={styles.confirmationCard}>
            <View
              style={[
                styles.successIconCircle,
                { backgroundColor: colors.successContainer, marginBottom: spacing.lg },
              ]}
            >
              <Ionicons name="checkmark-circle" size={48} color={colors.success} />
            </View>

            <Badge label="Registration Awaiting Verification" variant="accent" size="sm" />

            <Text
              variant="h2"
              color="primary"
              weight="700"
              align="center"
              style={{ marginTop: spacing.md, marginBottom: spacing.xs }}
            >
              Application Submitted
            </Text>

            <Text
              variant="body"
              color="secondary"
              align="center"
              style={{ lineHeight: 22, marginBottom: spacing.lg }}
            >
              Thank you for registering with Fundamics LMS. Your student profile has been submitted and is awaiting administrative verification.
            </Text>

            <View
              style={[
                styles.noticeBox,
                {
                  backgroundColor: colors.surfaceVariant,
                  borderColor: colors.border,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  marginBottom: spacing.xl,
                  width: '100%',
                },
              ]}
            >
              <View style={styles.noticeHeaderRow}>
                <Ionicons name="mail-outline" size={20} color={colors.primary} />
                <Text
                  variant="subtitle"
                  color="primary"
                  weight="600"
                  style={{ marginLeft: spacing.xs }}
                >
                  Email Verification Sent
                </Text>
              </View>
              <Text
                variant="bodySmall"
                color="secondary"
                style={{ marginTop: spacing.xs, lineHeight: 18 }}
              >
                A secure verification link has been sent to{' '}
                <Text variant="bodySmall" color="primary" weight="700">
                  {formData.email}
                </Text>
                . Please click the link to verify your email address. Once verified, our admissions team will activate your student ID.
              </Text>
            </View>

            <Button
              title="Check Application Status"
              variant="primary"
              fullWidth
              onPress={() =>
                navigation.navigate('ApplicationStatus', {
                  email: formData.email,
                  initialStatus: 'PENDING_VERIFICATION',
                })
              }
              icon={<Ionicons name="search-outline" size={18} color={colors.onPrimary} />}
              style={{ marginBottom: spacing.md }}
            />

            <Button
              title="Return to Sign In"
              variant="outline"
              fullWidth
              onPress={() => navigation.navigate('Login')}
            />
          </Card>
        </ScrollView>
      </View>
    );
  }

  const selectedClass = classes.find((c) => c.id === formData.classId);
  const selectedBatch = batches.find((b) => b.id === formData.batchId);

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
        {/* Top Header */}
        <View style={[styles.topHeader, { marginTop: spacing.xl, marginBottom: spacing.md }]}>
          <TouchableOpacity
            onPress={() => (step > 1 ? handleBack() : navigation.goBack())}
            style={[
              styles.backButton,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.headerTitleGroup}>
            <Text variant="h2" color="primary" weight="700">
              Student Registration
            </Text>
            <Text variant="caption" color="secondary">
              Fundamics Admissions Portal • Academic Year 2026-27
            </Text>
          </View>
        </View>

        {/* Step Progress Tracker */}
        <View
          style={[
            styles.progressContainer,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.md,
              padding: spacing.md,
              marginBottom: spacing.lg,
            },
          ]}
        >
          <View style={styles.stepInfoRow}>
            <Text variant="caption" color="primary" weight="700">
              STEP {step} OF {TOTAL_STEPS}
            </Text>
            <Text variant="caption" color="secondary" weight="600">
              {step === 1 && 'Student Details'}
              {step === 2 && 'Parent / Guardian Details'}
              {step === 3 && 'Academic Selection'}
              {step === 4 && 'Address Information'}
              {step === 5 && 'Review & Submission'}
            </Text>
          </View>

          {/* Progress Bar */}
          <View
            style={[
              styles.progressBarTrack,
              { backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.full },
            ]}
          >
            <View
              style={[
                styles.progressBarFill,
                {
                  backgroundColor: colors.primary,
                  width: `${(step / TOTAL_STEPS) * 100}%`,
                  borderRadius: borderRadius.full,
                },
              ]}
            />
          </View>
        </View>

        {/* Server Error Alert */}
        {serverError && (
          <View
            style={[
              styles.serverErrorBox,
              {
                backgroundColor: colors.dangerContainer,
                borderColor: colors.danger,
                borderRadius: borderRadius.sm,
                padding: spacing.md,
                marginBottom: spacing.md,
              },
            ]}
          >
            <Ionicons name="alert-circle" size={20} color={colors.danger} />
            <Text variant="bodySmall" color="danger" style={{ flex: 1, marginLeft: spacing.sm }}>
              {serverError}
            </Text>
          </View>
        )}

        {/* Step Content */}
        <Card elevation="sm" padding="lg">
          {/* STEP 1: STUDENT DETAILS */}
          {step === 1 && (
            <View>
              <Text variant="h3" color="primary" weight="600" style={{ marginBottom: spacing.xs }}>
                Student Identity
              </Text>
              <Text variant="bodySmall" color="secondary" style={{ marginBottom: spacing.lg }}>
                Enter the student's legal name, contact email, and secure account password.
              </Text>

              <Input
                label="Full Name"
                placeholder="e.g. Aryan Srivastava"
                value={formData.name}
                onChangeText={(t) => updateField('name', t)}
                error={errors.name}
                required
                leftIcon={<Ionicons name="person-outline" size={18} color={colors.textSecondary} />}
              />

              <Input
                label="Email Address"
                placeholder="e.g. aryan.srivastava@example.com"
                value={formData.email}
                onChangeText={(t) => updateField('email', t)}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                required
                helperText="Official notices and verification links will be sent here."
                leftIcon={<Ionicons name="mail-outline" size={18} color={colors.textSecondary} />}
              />

              <Input
                label="Student Mobile Number"
                placeholder="10-digit mobile number"
                value={formData.phone}
                onChangeText={(t) => updateField('phone', t)}
                keyboardType="phone-pad"
                maxLength={10}
                error={errors.phone}
                required
                leftIcon={<Ionicons name="call-outline" size={18} color={colors.textSecondary} />}
              />

              <View style={styles.genderRow}>
                <Text variant="subtitle" color="secondary" style={{ marginBottom: spacing.xs }}>
                  Gender (Optional)
                </Text>
                <View style={styles.pillGroup}>
                  {GENDERS.map((g) => (
                    <TouchableOpacity
                      key={g}
                      onPress={() => updateField('gender', g)}
                      style={[
                        styles.selectorPill,
                        {
                          backgroundColor:
                            formData.gender === g ? colors.primary : colors.surfaceVariant,
                          borderRadius: borderRadius.full,
                        },
                      ]}
                    >
                      <Text
                        variant="caption"
                        color={formData.gender === g ? 'inverse' : 'secondary'}
                        weight={formData.gender === g ? '700' : '500'}
                      >
                        {g}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <Input
                label="Date of Birth"
                placeholder="DD/MM/YYYY (Optional)"
                value={formData.dateOfBirth}
                onChangeText={(t) => updateField('dateOfBirth', t)}
                leftIcon={<Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />}
              />

              <Input
                label="Password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChangeText={(t) => updateField('password', t)}
                isPassword
                error={errors.password}
                required
                leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} />}
              />

              <Input
                label="Confirm Password"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChangeText={(t) => updateField('confirmPassword', t)}
                isPassword
                error={errors.confirmPassword}
                required
                leftIcon={<Ionicons name="shield-checkmark-outline" size={18} color={colors.textSecondary} />}
              />
            </View>
          )}

          {/* STEP 2: PARENT / GUARDIAN DETAILS */}
          {step === 2 && (
            <View>
              <Text variant="h3" color="primary" weight="600" style={{ marginBottom: spacing.xs }}>
                Parent & Guardian Details
              </Text>
              <Text variant="bodySmall" color="secondary" style={{ marginBottom: spacing.lg }}>
                Coaching progress reports and attendance SMS alerts will be addressed to the primary guardian.
              </Text>

              <Input
                label="Parent / Guardian Name"
                placeholder="e.g. Rajesh Srivastava"
                value={formData.parentName}
                onChangeText={(t) => updateField('parentName', t)}
                error={errors.parentName}
                required
                leftIcon={<Ionicons name="person-circle-outline" size={18} color={colors.textSecondary} />}
              />

              <View style={{ marginBottom: spacing.md }}>
                <Text variant="subtitle" color="secondary" style={{ marginBottom: spacing.xs }}>
                  Relationship to Student *
                </Text>
                <View style={styles.pillGroup}>
                  {RELATIONSHIPS.map((r) => (
                    <TouchableOpacity
                      key={r}
                      onPress={() => updateField('relationship', r)}
                      style={[
                        styles.selectorPill,
                        {
                          backgroundColor:
                            formData.relationship === r ? colors.primary : colors.surfaceVariant,
                          borderRadius: borderRadius.full,
                        },
                      ]}
                    >
                      <Text
                        variant="caption"
                        color={formData.relationship === r ? 'inverse' : 'secondary'}
                        weight={formData.relationship === r ? '700' : '500'}
                      >
                        {r}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <Input
                label="Parent Mobile Number"
                placeholder="10-digit mobile number"
                value={formData.parentPhone}
                onChangeText={(t) => updateField('parentPhone', t)}
                keyboardType="phone-pad"
                maxLength={10}
                error={errors.parentPhone}
                required
                leftIcon={<Ionicons name="call-outline" size={18} color={colors.textSecondary} />}
              />

              <Input
                label="Parent Email Address (Optional)"
                placeholder="e.g. rajesh@example.com"
                value={formData.parentEmail}
                onChangeText={(t) => updateField('parentEmail', t)}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<Ionicons name="mail-outline" size={18} color={colors.textSecondary} />}
              />

              <Input
                label="Emergency Contact Number (Optional)"
                placeholder="Alternate emergency phone"
                value={formData.emergencyContact}
                onChangeText={(t) => updateField('emergencyContact', t)}
                keyboardType="phone-pad"
                maxLength={10}
                leftIcon={<Ionicons name="alert-circle-outline" size={18} color={colors.textSecondary} />}
              />
            </View>
          )}

          {/* STEP 3: ACADEMIC DETAILS */}
          {step === 3 && (
            <View>
              <Text variant="h3" color="primary" weight="600" style={{ marginBottom: spacing.xs }}>
                Academic Course & Batch
              </Text>
              <Text variant="bodySmall" color="secondary" style={{ marginBottom: spacing.lg }}>
                Select your educational board and classroom batch at Fundamics Lucknow Flagship Campus.
              </Text>

              {/* Board Selection */}
              <View style={{ marginBottom: spacing.lg }}>
                <Text variant="subtitle" color="secondary" style={{ marginBottom: spacing.xs }}>
                  Educational Board *
                </Text>
                <View style={styles.pillWrapGroup}>
                  {BOARDS.map((b) => (
                    <TouchableOpacity
                      key={b}
                      onPress={() => updateField('board', b)}
                      style={[
                        styles.boardPill,
                        {
                          backgroundColor:
                            formData.board === b ? colors.primaryContainer : colors.surfaceVariant,
                          borderColor: formData.board === b ? colors.primary : colors.border,
                          borderRadius: borderRadius.md,
                        },
                      ]}
                    >
                      <Ionicons
                        name={formData.board === b ? 'checkmark-circle' : 'ellipse-outline'}
                        size={16}
                        color={formData.board === b ? colors.primary : colors.textMuted}
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        variant="caption"
                        color={formData.board === b ? 'primary' : 'secondary'}
                        weight={formData.board === b ? '700' : '400'}
                      >
                        {b}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Class Selection */}
              <View style={{ marginBottom: spacing.lg }}>
                <Text variant="subtitle" color="secondary" style={{ marginBottom: spacing.xs }}>
                  Academic Class / Grade *
                </Text>
                {isLoadingAcademics ? (
                  <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 10 }} />
                ) : (
                  <View style={styles.cardSelectGroup}>
                    {classes.map((cls) => {
                      const isSelected = formData.classId === cls.id;
                      return (
                        <TouchableOpacity
                          key={cls.id}
                          onPress={() => handleClassChange(cls.id)}
                          style={[
                            styles.academicOptionCard,
                            {
                              backgroundColor: isSelected ? colors.primaryContainer : colors.surface,
                              borderColor: isSelected ? colors.primary : colors.border,
                              borderRadius: borderRadius.md,
                            },
                          ]}
                        >
                          <View style={{ flex: 1 }}>
                            <Text
                              variant="subtitle"
                              color={isSelected ? 'primary' : 'primary'}
                              weight="700"
                            >
                              {cls.name}
                            </Text>
                            <Text variant="caption" color="secondary">
                              Code: {cls.code} • Board: {cls.board} • Year: {cls.academicYear}
                            </Text>
                          </View>
                          <Ionicons
                            name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                            size={20}
                            color={isSelected ? colors.primary : colors.textMuted}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
                {errors.classId && (
                  <Text variant="caption" color="danger" style={{ marginTop: 4 }}>
                    {errors.classId}
                  </Text>
                )}
              </View>

              {/* Batch Selection */}
              <View style={{ marginBottom: spacing.lg }}>
                <Text variant="subtitle" color="secondary" style={{ marginBottom: spacing.xs }}>
                  Classroom Batch *
                </Text>
                {batches.length === 0 ? (
                  <Text variant="caption" color="muted">
                    No active batches found for the selected class.
                  </Text>
                ) : (
                  <View style={styles.cardSelectGroup}>
                    {batches.map((b) => {
                      const isSelected = formData.batchId === b.id;
                      return (
                        <TouchableOpacity
                          key={b.id}
                          onPress={() => updateField('batchId', b.id)}
                          style={[
                            styles.academicOptionCard,
                            {
                              backgroundColor: isSelected ? colors.primaryContainer : colors.surface,
                              borderColor: isSelected ? colors.primary : colors.border,
                              borderRadius: borderRadius.md,
                            },
                          ]}
                        >
                          <View style={{ flex: 1 }}>
                            <Text
                              variant="subtitle"
                              color={isSelected ? 'primary' : 'primary'}
                              weight="600"
                            >
                              {b.name}
                            </Text>
                            {b.timings && (
                              <Text variant="caption" color="secondary">
                                Timings: {b.timings}
                              </Text>
                            )}
                          </View>
                          <Ionicons
                            name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                            size={20}
                            color={isSelected ? colors.primary : colors.textMuted}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
                {errors.batchId && (
                  <Text variant="caption" color="danger" style={{ marginTop: 4 }}>
                    {errors.batchId}
                  </Text>
                )}
              </View>

              <Input
                label="Previous / Current School (Optional)"
                placeholder="e.g. CMS Gomti Nagar"
                value={formData.schoolName}
                onChangeText={(t) => updateField('schoolName', t)}
                leftIcon={<Ionicons name="school-outline" size={18} color={colors.textSecondary} />}
              />
            </View>
          )}

          {/* STEP 4: ADDRESS DETAILS */}
          {step === 4 && (
            <View>
              <Text variant="h3" color="primary" weight="600" style={{ marginBottom: spacing.xs }}>
                Residential Address
              </Text>
              <Text variant="bodySmall" color="secondary" style={{ marginBottom: spacing.lg }}>
                Required for student records and study material dispatches.
              </Text>

              <Input
                label="Street Address / House No. / Area"
                placeholder="e.g. 45/B, Triveni Nagar"
                value={formData.addressLine}
                onChangeText={(t) => updateField('addressLine', t)}
                error={errors.addressLine}
                required
                leftIcon={<Ionicons name="home-outline" size={18} color={colors.textSecondary} />}
              />

              <Input
                label="City"
                placeholder="e.g. Lucknow"
                value={formData.city}
                onChangeText={(t) => updateField('city', t)}
                error={errors.city}
                required
                leftIcon={<Ionicons name="business-outline" size={18} color={colors.textSecondary} />}
              />

              <Input
                label="State"
                placeholder="e.g. Uttar Pradesh"
                value={formData.state}
                onChangeText={(t) => updateField('state', t)}
                required
                leftIcon={<Ionicons name="map-outline" size={18} color={colors.textSecondary} />}
              />

              <Input
                label="PIN Code"
                placeholder="6-digit PIN"
                value={formData.pinCode}
                onChangeText={(t) => updateField('pinCode', t)}
                keyboardType="number-pad"
                maxLength={6}
                error={errors.pinCode}
                required
                leftIcon={<Ionicons name="navigate-outline" size={18} color={colors.textSecondary} />}
              />
            </View>
          )}

          {/* STEP 5: REVIEW & DECLARATION */}
          {step === 5 && (
            <View>
              <Text variant="h3" color="primary" weight="600" style={{ marginBottom: spacing.xs }}>
                Review Application
              </Text>
              <Text variant="bodySmall" color="secondary" style={{ marginBottom: spacing.lg }}>
                Please review your details carefully before submitting your application.
              </Text>

              {/* Summary Box */}
              <View
                style={[
                  styles.summaryContainer,
                  {
                    backgroundColor: colors.surfaceVariant,
                    borderColor: colors.border,
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    marginBottom: spacing.lg,
                  },
                ]}
              >
                {/* Student Info */}
                <View style={styles.summarySection}>
                  <View style={styles.summaryHeaderRow}>
                    <Text variant="subtitle" color="primary" weight="700">
                      1. Student Identity
                    </Text>
                    <TouchableOpacity onPress={() => setStep(1)}>
                      <Text variant="caption" color="accent" weight="700">
                        Edit
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text variant="bodySmall" color="secondary">
                    Name: {formData.name}
                  </Text>
                  <Text variant="bodySmall" color="secondary">
                    Email: {formData.email}
                  </Text>
                  <Text variant="bodySmall" color="secondary">
                    Phone: {formData.phone}
                  </Text>
                  {formData.gender ? (
                    <Text variant="bodySmall" color="secondary">
                      Gender: {formData.gender}
                    </Text>
                  ) : null}
                </View>

                <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />

                {/* Parent Info */}
                <View style={styles.summarySection}>
                  <View style={styles.summaryHeaderRow}>
                    <Text variant="subtitle" color="primary" weight="700">
                      2. Parent / Guardian
                    </Text>
                    <TouchableOpacity onPress={() => setStep(2)}>
                      <Text variant="caption" color="accent" weight="700">
                        Edit
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text variant="bodySmall" color="secondary">
                    Name: {formData.parentName} ({formData.relationship})
                  </Text>
                  <Text variant="bodySmall" color="secondary">
                    Contact: {formData.parentPhone}
                  </Text>
                </View>

                <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />

                {/* Academic Selection */}
                <View style={styles.summarySection}>
                  <View style={styles.summaryHeaderRow}>
                    <Text variant="subtitle" color="primary" weight="700">
                      3. Academic Program
                    </Text>
                    <TouchableOpacity onPress={() => setStep(3)}>
                      <Text variant="caption" color="accent" weight="700">
                        Edit
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text variant="bodySmall" color="secondary">
                    Class: {selectedClass?.name || 'Class 10 - Science'}
                  </Text>
                  <Text variant="bodySmall" color="secondary">
                    Batch: {selectedBatch?.name || 'Morning Batch A'}
                  </Text>
                  <Text variant="bodySmall" color="secondary">
                    Board: {formData.board} • Session: {formData.academicSession}
                  </Text>
                </View>

                <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />

                {/* Address */}
                <View style={styles.summarySection}>
                  <View style={styles.summaryHeaderRow}>
                    <Text variant="subtitle" color="primary" weight="700">
                      4. Address
                    </Text>
                    <TouchableOpacity onPress={() => setStep(4)}>
                      <Text variant="caption" color="accent" weight="700">
                        Edit
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text variant="bodySmall" color="secondary">
                    {formData.addressLine}, {formData.city}, {formData.state} - {formData.pinCode}
                  </Text>
                </View>
              </View>

              {/* Institutional Declaration & Consent Checkbox */}
              <TouchableOpacity
                onPress={() => updateField('consentAgreed', !formData.consentAgreed)}
                activeOpacity={0.8}
                style={[
                  styles.consentRow,
                  {
                    backgroundColor: colors.surface,
                    borderColor: errors.consentAgreed ? colors.danger : colors.border,
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    marginBottom: spacing.md,
                  },
                ]}
              >
                <Ionicons
                  name={formData.consentAgreed ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={formData.consentAgreed ? colors.primary : colors.textMuted}
                  style={{ marginRight: spacing.sm }}
                />
                <Text variant="caption" color="secondary" style={{ flex: 1, lineHeight: 18 }}>
                  I solemnly declare that all information furnished is authentic. I agree to abide by the disciplinary and academic rules of Fundamics Coaching Institute.
                </Text>
              </TouchableOpacity>
              {errors.consentAgreed && (
                <Text variant="caption" color="danger" style={{ marginBottom: spacing.md }}>
                  {errors.consentAgreed}
                </Text>
              )}
            </View>
          )}

          {/* Step Actions */}
          <View style={[styles.stepActionsRow, { marginTop: spacing.lg }]}>
            {step > 1 && (
              <Button
                title="Back"
                variant="outline"
                onPress={handleBack}
                disabled={isSubmitting}
                style={{ flex: 1, marginRight: spacing.sm }}
              />
            )}

            {step < TOTAL_STEPS ? (
              <Button
                title="Continue"
                variant="primary"
                onPress={handleNext}
                style={{ flex: step > 1 ? 2 : 1 }}
                icon={<Ionicons name="arrow-forward" size={18} color={colors.onPrimary} />}
                iconPosition="right"
              />
            ) : (
              <Button
                title="Submit Application"
                variant="primary"
                loading={isSubmitting}
                onPress={handleSubmit}
                style={{ flex: 2 }}
                icon={<Ionicons name="send" size={18} color={colors.onPrimary} />}
                iconPosition="right"
              />
            )}
          </View>
        </Card>

        {/* Bottom Login Link */}
        <View style={[styles.bottomLoginRow, { marginTop: spacing.xl }]}>
          <Text variant="bodySmall" color="secondary">
            Already registered with Fundamics?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text variant="bodySmall" color="accent" weight="700">
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
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
  progressContainer: {
    borderWidth: 1,
  },
  stepInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBarTrack: {
    height: 6,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  serverErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  pillGroup: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
    marginBottom: 12,
  },
  pillWrapGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  selectorPill: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  boardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  genderRow: {
    marginBottom: 8,
  },
  cardSelectGroup: {
    gap: 8,
    marginTop: 4,
  },
  academicOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1.5,
  },
  summaryContainer: {
    borderWidth: 1,
  },
  summarySection: {
    paddingVertical: 4,
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  summaryDivider: {
    height: 1,
    marginVertical: 10,
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  stepActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomLoginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmationCard: {
    alignItems: 'center',
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeBox: {
    borderWidth: 1,
  },
  noticeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
