const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('Fundamics LMS — Professional Student App Redesign Verification', async (t) => {
  const rootDir = path.resolve(__dirname, '..');

  await t.test('1. Disciplined Institutional Color Palette (#142B45, #168575, #F5F7FA, #C5A15A)', () => {
    const colorsFile = fs.readFileSync(path.join(rootDir, 'src/theme/colors.ts'), 'utf8');

    // Primary Deep Navy
    assert.ok(colorsFile.includes("primary: '#142B45'"), 'Primary must be Deep Navy #142B45');
    assert.ok(colorsFile.includes("primaryDark: '#0D1B2A'"), 'PrimaryDark must be Darker Navy #0D1B2A');

    // Soft Neutral Background
    assert.ok(colorsFile.includes("background: '#F5F7FA'"), 'Background must be Soft Neutral #F5F7FA');
    assert.ok(colorsFile.includes("surface: '#FFFFFF'"), 'Surface must be Card Background #FFFFFF');
    assert.ok(colorsFile.includes("surfaceVariant: '#EDF1F5'"), 'SurfaceVariant must be Secondary Surface #EDF1F5');

    // Typography
    assert.ok(colorsFile.includes("textPrimary: '#182230'"), 'TextPrimary must be #182230');
    assert.ok(colorsFile.includes("textSecondary: '#667085'"), 'TextSecondary must be #667085');
    assert.ok(colorsFile.includes("textMuted: '#98A2B3'"), 'TextMuted must be #98A2B3');

    // Accent Muted Teal
    assert.ok(colorsFile.includes("accent: '#168575'"), 'Accent must be Muted Teal #168575');
    assert.ok(colorsFile.includes("accentContainer: '#E7F4F0'"), 'AccentContainer must be #E7F4F0');

    // Supporting Colors
    assert.ok(colorsFile.includes("distinction: '#C5A15A'"), 'Muted Gold #C5A15A for distinction');
    assert.ok(colorsFile.includes("danger: '#C43D4B'"), 'Error must be #C43D4B');
    assert.ok(colorsFile.includes("warning: '#B7791F'"), 'Warning must be #B7791F');
    assert.ok(colorsFile.includes("border: '#E4E9F0'"), 'Borders must be #E4E9F0');
  });

  await t.test('2. Main Navigation Reorganization (Exactly 5 Destinations)', () => {
    const navFile = fs.readFileSync(
      path.join(rootDir, 'src/app/navigation/StudentNavigator.tsx'),
      'utf8'
    );

    // Exactly 5 primary bottom tab destinations
    assert.ok(navFile.includes('StudentDashboardTab'), 'Home tab must exist');
    assert.ok(navFile.includes('StudentAttendanceTab'), 'Attendance tab must exist');
    assert.ok(navFile.includes('StudentStudyMaterialTab'), 'Study Material tab must exist');
    assert.ok(navFile.includes('StudentResultsTab'), 'Results tab must exist');
    assert.ok(navFile.includes('StudentNotificationsTab'), 'Notices tab must exist');

    // Classes and Homework must NOT be bottom tab destinations
    assert.ok(!navFile.includes('<Tab.Screen\n        name="StudentClassesTab"'), 'Classes tab must be removed from bottom tabs');
    assert.ok(!navFile.includes('<Tab.Screen\n        name="StudentAssignmentsTab"'), 'Homework tab must be removed from bottom tabs');

    // Profile screen must be registered in the student stack
    assert.ok(navFile.includes('name="StudentProfile"'), 'StudentProfile must be in the stack');
  });

  await t.test('3. Home Dashboard Visual Hierarchy & Restrained Components', () => {
    const dashboardFile = fs.readFileSync(
      path.join(rootDir, 'src/features/dashboard/screens/StudentDashboardScreen.tsx'),
      'utf8'
    );

    // Verified visual hierarchy
    assert.ok(dashboardFile.includes('StudentProfileHeader'), 'StudentProfileHeader must be present');
    assert.ok(dashboardFile.includes('StudentAttendanceSummaryCard'), 'Attendance Overview must be present');
    assert.ok(dashboardFile.includes('StudentPerformanceCard'), 'Examination Performance must be present');
    assert.ok(dashboardFile.includes('StudentRecentActivityCard'), 'Recent Academic Activity stream must be present');

    // Attendance Overview links to Attendance tab
    assert.ok(
      dashboardFile.includes("navigation.navigate('StudentAttendanceTab')"),
      'Attendance card must link to StudentAttendanceTab'
    );

    // Profile header links to Profile screen
    assert.ok(
      dashboardFile.includes("navigation.navigate('StudentProfile')"),
      'Profile header must link to StudentProfile'
    );
  });

  await t.test('4. Attendance Screen Dedicated Presentation & Backend Contract', () => {
    const attendanceFile = fs.readFileSync(
      path.join(rootDir, 'src/features/attendance/screens/StudentAttendanceScreen.tsx'),
      'utf8'
    );

    assert.ok(attendanceFile.includes('Attendance Ledger'), 'Screen title must be Attendance Ledger');
    assert.ok(attendanceFile.includes('VERIFIED ATTENDANCE RATE'), 'Prominent verified rate section');
    assert.ok(attendanceFile.includes('CHRONOLOGICAL SESSION LOG'), 'Chronological daily session log');
    assert.ok(attendanceFile.includes('studentService.getAttendanceSummary()'), 'Must call getAttendanceSummary');
    assert.ok(attendanceFile.includes('studentService.getDailyAttendance('), 'Must call getDailyAttendance');
  });

  await t.test('5. Study Material Screen & Note Download Integration', () => {
    const studyFile = fs.readFileSync(
      path.join(rootDir, 'src/features/studyMaterial/screens/StudentStudyMaterialScreen.tsx'),
      'utf8'
    );

    assert.ok(studyFile.includes('Study Material'), 'Must display Study Material title');
    assert.ok(studyFile.includes('searchQuery'), 'Must support search filtering');
    assert.ok(studyFile.includes('availableSubjects'), 'Must support subject filter chips');
    assert.ok(studyFile.includes('studentService.getStudentNotes()'), 'Must query backend notes');
    assert.ok(studyFile.includes('studentService.downloadNoteFile('), 'Must support downloading notes');
    assert.ok(studyFile.includes('studentService.viewNoteFile('), 'Must support previewing notes');
  });

  await t.test('6. Dedicated Profile Screen & Change Password API', () => {
    const profileFile = fs.readFileSync(
      path.join(rootDir, 'src/features/profile/screens/StudentProfileScreen.tsx'),
      'utf8'
    );

    assert.ok(profileFile.includes('Student Account'), 'Must display Student Account title');
    assert.ok(profileFile.includes('ACADEMIC ENROLLMENT'), 'Must display academic info');
    assert.ok(profileFile.includes('CONTACT & CREDENTIALS'), 'Must display contact info');
    assert.ok(profileFile.includes('Change Password'), 'Must support Change Password');
    assert.ok(profileFile.includes('Sign Out of Student Account'), 'Must support Sign Out');

    const authServiceFile = fs.readFileSync(
      path.join(rootDir, 'src/services/api/authService.ts'),
      'utf8'
    );
    assert.ok(authServiceFile.includes("'/auth/change-password'"), 'Must call backend /auth/change-password');
    assert.ok(authServiceFile.includes("'/auth/me'"), 'Must call backend /auth/me');
  });

  await t.test('7. Examination Results Screen Presentation', () => {
    const resultsFile = fs.readFileSync(
      path.join(rootDir, 'src/features/results/screens/StudentResultsScreen.tsx'),
      'utf8'
    );

    assert.ok(resultsFile.includes('Examination Results'), 'Title must be Examination Results');
    assert.ok(resultsFile.includes('StudentResultDocumentsCard'), 'Must mount StudentResultDocumentsCard');
    assert.ok(resultsFile.includes('TEST HISTORY'), 'Must display test history');
    assert.ok(resultsFile.includes('trendPoints.length >= 2'), 'Must only show trend with sufficient data');
  });
});
