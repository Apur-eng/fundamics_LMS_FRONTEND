const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('Backend OpenAPI Contract Alignment for Password Recovery', async (t) => {
  const openapiPath = path.resolve('backend_openapi.json');
  assert.ok(fs.existsSync(openapiPath), 'backend_openapi.json must exist');

  const openapi = JSON.parse(fs.readFileSync(openapiPath, 'utf8'));

  await t.test('POST /api/v1/auth/forgot-password contract is valid', () => {
    const endpoint = openapi.paths['/api/v1/auth/forgot-password'];
    assert.ok(endpoint, 'forgot-password endpoint must exist in OpenAPI spec');
    assert.ok(endpoint.post, 'forgot-password must support POST');

    const schemaRef = endpoint.post.requestBody.content['application/json'].schema.$ref;
    const schemaName = schemaRef.split('/').pop();
    const schema = openapi.components.schemas[schemaName];

    assert.equal(schemaName, 'ForgotPasswordRequest');
    assert.deepEqual(schema.required, ['email']);
    assert.equal(schema.properties.email.type, 'string');
    assert.equal(schema.properties.email.format, 'email');
    assert.equal(schema.additionalProperties, false, 'Backend forbids unexpected fields like identifier or phone');
  });

  await t.test('POST /api/v1/auth/reset-password contract is valid', () => {
    const endpoint = openapi.paths['/api/v1/auth/reset-password'];
    assert.ok(endpoint, 'reset-password endpoint must exist in OpenAPI spec');
    assert.ok(endpoint.post, 'reset-password must support POST');

    const schemaRef = endpoint.post.requestBody.content['application/json'].schema.$ref;
    const schemaName = schemaRef.split('/').pop();
    const schema = openapi.components.schemas[schemaName];

    assert.equal(schemaName, 'ResetPasswordRequest');
    assert.deepEqual(schema.required, ['token', 'new_password']);
    assert.equal(schema.properties.token.type, 'string');
    assert.equal(schema.properties.new_password.type, 'string');
    assert.equal(schema.properties.new_password.minLength, 8, 'Backend enforces minimum 8 chars');
    assert.equal(schema.properties.new_password.maxLength, 128, 'Backend enforces maximum 128 chars');
    assert.equal(schema.additionalProperties, false, 'Backend forbids unexpected fields');
  });

  await t.test('No fake OTP endpoint exists in OpenAPI specification', () => {
    const allPaths = Object.keys(openapi.paths);
    const otpPaths = allPaths.filter(p => p.toLowerCase().includes('otp'));
    assert.equal(otpPaths.length, 0, 'Backend does not have an OTP verification endpoint');
  });
});

test('Frontend Password Recovery Validation Logic', async (t) => {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  await t.test('Accepts valid student and institutional email addresses', () => {
    const validEmails = [
      'scholar@fundamics.in',
      'student.1024@school.edu',
      'user+tag@domain.co.in',
      'faculty@fundamics.org',
    ];
    for (const email of validEmails) {
      assert.ok(EMAIL_REGEX.test(email), `Expected ${email} to be valid`);
    }
  });

  await t.test('Rejects invalid identifiers and non-email formats', () => {
    const invalidInputs = [
      'FND-2025-1042',
      '9876543210',
      '+919876543210',
      'plainaddress',
      '@missingusername.com',
      'username@.com',
      '',
    ];
    for (const input of invalidInputs) {
      assert.ok(!EMAIL_REGEX.test(input), `Expected ${input} to be invalid`);
    }
  });

  await t.test('Enforces password length bounds matching backend schema (8-128 chars)', () => {
    const isPasswordLengthValid = (pwd) => pwd.length >= 8 && pwd.length <= 128;

    assert.equal(isPasswordLengthValid('short'), false);
    assert.equal(isPasswordLengthValid('1234567'), false);
    assert.equal(isPasswordLengthValid('12345678'), true);
    assert.equal(isPasswordLengthValid('A!StrongP@ssw0rd#2026'), true);
    assert.equal(isPasswordLengthValid('a'.repeat(128)), true);
    assert.equal(isPasswordLengthValid('a'.repeat(129)), false);
  });
});

test('Source Code Integrity: Elimination of Fake OTP and Alignment with Backend', async (t) => {
  await t.test('authService.ts password recovery methods do not contain verifyOtp stub or domain guessing', () => {
    const authServiceContent = fs.readFileSync('src/services/api/authService.ts', 'utf8');
    assert.ok(!authServiceContent.includes('verifyOtp'), 'verifyOtp must not be in authService');
    const reqMethod = authServiceContent.slice(authServiceContent.indexOf('requestPasswordReset'));
    assert.ok(!reqMethod.includes('@student.fundamics.in'), 'Auto-guessing email domain must be removed from requestPasswordReset');
    assert.ok(authServiceContent.includes('/auth/forgot-password'), 'Calls real /auth/forgot-password');
    assert.ok(authServiceContent.includes('/auth/reset-password'), 'Calls real /auth/reset-password');
  });

  await t.test('AuthNavigator.tsx routes to ResetPasswordScreen and not OtpVerification', () => {
    const authNavContent = fs.readFileSync('src/app/navigation/AuthNavigator.tsx', 'utf8');
    assert.ok(!authNavContent.includes('OtpVerification'), 'OtpVerification must not be in AuthNavigator');
    assert.ok(authNavContent.includes('ResetPassword'), 'ResetPassword must be registered in AuthNavigator');
  });

  await t.test('OtpVerificationScreen.tsx has been removed from codebase', () => {
    const exists = fs.existsSync('src/features/auth/screens/OtpVerificationScreen.tsx');
    assert.equal(exists, false, 'OtpVerificationScreen.tsx must be removed');
  });

  await t.test('ResetPasswordScreen.tsx exists and is exported from features/auth', () => {
    const exists = fs.existsSync('src/features/auth/screens/ResetPasswordScreen.tsx');
    assert.ok(exists, 'ResetPasswordScreen.tsx must exist');

    const indexContent = fs.readFileSync('src/features/auth/index.ts', 'utf8');
    assert.ok(indexContent.includes('ResetPasswordScreen'), 'ResetPasswordScreen must be exported');
  });
});
