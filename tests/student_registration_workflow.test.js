const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('Student Registration & Approval Workflow Tests', async (t) => {
  const rootDir = path.resolve(__dirname, '..');

  await t.test('1. Backend API Alignment for Registration', () => {
    const authServiceFile = fs.readFileSync(
      path.join(rootDir, 'src/services/api/authService.ts'),
      'utf8'
    );

    assert.ok(
      authServiceFile.includes("'/auth/register/student'"),
      'authService must call /auth/register/student'
    );
    assert.ok(
      authServiceFile.includes("'/auth/verify-email'"),
      'authService must call /auth/verify-email'
    );
    assert.ok(
      authServiceFile.includes("'/auth/resend-verification'"),
      'authService must call /auth/resend-verification'
    );
    assert.ok(
      authServiceFile.includes('checkApplicationStatus'),
      'authService must export checkApplicationStatus'
    );
  });

  await t.test('2. Academic Offerings match genuine PostgreSQL UUIDs', () => {
    const academicFile = fs.readFileSync(
      path.join(rootDir, 'src/services/api/academicService.ts'),
      'utf8'
    );

    // Verified UUIDs from database
    assert.ok(
      academicFile.includes('19a9272b-bc31-41eb-be47-e0c7bb06c0cd'),
      'Must contain Class 10 Science UUID'
    );
    assert.ok(
      academicFile.includes('df719a08-d9c7-4c98-a244-faa015400601'),
      'Must contain Morning Batch A UUID'
    );
    assert.ok(
      academicFile.includes('65bc73ea-e64a-4a0f-9e93-1c62216683e3'),
      'Must contain Class XII Science UUID'
    );
  });

  await t.test('3. Removal of Admin & Teacher login from Student App', () => {
    const loginScreen = fs.readFileSync(
      path.join(rootDir, 'src/features/auth/screens/LoginScreen.tsx'),
      'utf8'
    );

    // Must NOT contain ROLES selector
    assert.ok(
      !loginScreen.includes('const ROLES:'),
      'LoginScreen must NOT contain ROLES selector'
    );
    assert.ok(
      !loginScreen.includes("role: 'ADMIN'"),
      'LoginScreen must NOT contain Admin role option'
    );
    assert.ok(
      !loginScreen.includes("role: 'TEACHER'"),
      'LoginScreen must NOT contain Teacher role option'
    );

    // Must contain New Student Registration CTA
    assert.ok(
      loginScreen.includes("navigation.navigate('Register')"),
      'LoginScreen must navigate to Register'
    );
    assert.ok(
      loginScreen.includes("navigation.navigate('ApplicationStatus'"),
      'LoginScreen must provide entry point to check application status'
    );
  });

  await t.test('4. Status-aware Login Handling', () => {
    const loginScreen = fs.readFileSync(
      path.join(rootDir, 'src/features/auth/screens/LoginScreen.tsx'),
      'utf8'
    );

    assert.ok(
      loginScreen.includes('PENDING_VERIFICATION'),
      'LoginScreen must handle PENDING_VERIFICATION'
    );
    assert.ok(
      loginScreen.includes('PENDING_APPROVAL'),
      'LoginScreen must handle PENDING_APPROVAL'
    );
    assert.ok(
      loginScreen.includes('REJECTED'),
      'LoginScreen must handle REJECTED'
    );
  });

  await t.test('5. Multi-Step RegisterScreen Integrity', () => {
    const regScreen = fs.readFileSync(
      path.join(rootDir, 'src/features/auth/screens/RegisterScreen.tsx'),
      'utf8'
    );

    assert.ok(
      regScreen.includes('Student Identity'),
      'Step 1 must have Student Identity'
    );
    assert.ok(
      regScreen.includes('Parent & Guardian Details'),
      'Step 2 must have Parent/Guardian details'
    );
    assert.ok(
      regScreen.includes('Academic Course & Batch'),
      'Step 3 must have Academic Course & Batch'
    );
    assert.ok(
      regScreen.includes('Residential Address'),
      'Step 4 must have Address'
    );
    assert.ok(
      regScreen.includes('Review Application'),
      'Step 5 must have Review & Consent'
    );
    assert.ok(
      regScreen.includes('Application Submitted'),
      'Must contain genuine confirmation state'
    );
    assert.ok(
      regScreen.includes('consentAgreed'),
      'Must require explicit consent'
    );
  });

  await t.test('6. ApplicationStatusScreen Integrity', () => {
    const statusScreen = fs.readFileSync(
      path.join(rootDir, 'src/features/auth/screens/ApplicationStatusScreen.tsx'),
      'utf8'
    );

    assert.ok(
      statusScreen.includes('PENDING_VERIFICATION'),
      'Must support PENDING_VERIFICATION'
    );
    assert.ok(
      statusScreen.includes('PENDING_APPROVAL'),
      'Must support PENDING_APPROVAL'
    );
    assert.ok(
      statusScreen.includes('APPROVED'),
      'Must support APPROVED'
    );
    assert.ok(
      statusScreen.includes('REJECTED'),
      'Must support REJECTED'
    );
    assert.ok(
      statusScreen.includes('studentCode'),
      'Must display backend provided studentCode on approval'
    );
    assert.ok(
      statusScreen.includes('authService.verifyEmail'),
      'Must allow instant email token verification'
    );
    assert.ok(
      statusScreen.includes('authService.resendVerification'),
      'Must allow resending verification email'
    );
  });

  await t.test('7. AuthNavigator and Exports Integrity', () => {
    const navFile = fs.readFileSync(
      path.join(rootDir, 'src/app/navigation/AuthNavigator.tsx'),
      'utf8'
    );
    const authIndex = fs.readFileSync(
      path.join(rootDir, 'src/features/auth/index.ts'),
      'utf8'
    );

    assert.ok(navFile.includes('RegisterScreen'), 'AuthNavigator must register RegisterScreen');
    assert.ok(navFile.includes('ApplicationStatusScreen'), 'AuthNavigator must register ApplicationStatusScreen');
    assert.ok(authIndex.includes('RegisterScreen'), 'features/auth must export RegisterScreen');
    assert.ok(authIndex.includes('ApplicationStatusScreen'), 'features/auth must export ApplicationStatusScreen');
  });

  await t.test('8. RootNavigator Student Focus', () => {
    const rootNav = fs.readFileSync(
      path.join(rootDir, 'src/app/navigation/RootNavigator.tsx'),
      'utf8'
    );

    assert.ok(
      !rootNav.includes('<AdminNavigator'),
      'RootNavigator must not embed AdminNavigator in student app'
    );
  });
});
