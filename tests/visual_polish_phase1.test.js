const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('Fundamics LMS — Frontend Visual Polish Phase 1 Verification', async (t) => {
  const rootDir = path.resolve(__dirname, '..');

  await t.test('1. Professional Icon Color System Tokens (#13866B, #527DA8, #C58A32, #7969A8, #718096)', () => {
    const colorsFile = fs.readFileSync(path.join(rootDir, 'src/theme/colors.ts'), 'utf8');

    // Token definitions in interface
    assert.ok(colorsFile.includes('iconNavy: string;'), 'iconNavy must exist in ColorTheme');
    assert.ok(colorsFile.includes('iconEmerald: string;'), 'iconEmerald must exist in ColorTheme');
    assert.ok(colorsFile.includes('iconEmeraldBg: string;'), 'iconEmeraldBg must exist in ColorTheme');
    assert.ok(colorsFile.includes('iconBlue: string;'), 'iconBlue must exist in ColorTheme');
    assert.ok(colorsFile.includes('iconBlueBg: string;'), 'iconBlueBg must exist in ColorTheme');
    assert.ok(colorsFile.includes('iconAmber: string;'), 'iconAmber must exist in ColorTheme');
    assert.ok(colorsFile.includes('iconAmberBg: string;'), 'iconAmberBg must exist in ColorTheme');
    assert.ok(colorsFile.includes('iconViolet: string;'), 'iconViolet must exist in ColorTheme');
    assert.ok(colorsFile.includes('iconVioletBg: string;'), 'iconVioletBg must exist in ColorTheme');
    assert.ok(colorsFile.includes('iconSlate: string;'), 'iconSlate must exist in ColorTheme');
    assert.ok(colorsFile.includes('iconSlateBg: string;'), 'iconSlateBg must exist in ColorTheme');

    // Values in lightThemeColors
    assert.ok(colorsFile.includes("iconNavy: '#142B45'"), 'iconNavy is Deep Navy');
    assert.ok(colorsFile.includes("iconEmerald: '#13866B'"), 'iconEmerald is Primary Emerald #13866B');
    assert.ok(colorsFile.includes("iconEmeraldBg: '#E8F4EF'"), 'iconEmeraldBg is Soft Green #E8F4EF');
    assert.ok(colorsFile.includes("iconBlue: '#527DA8'"), 'iconBlue is Muted Blue #527DA8');
    assert.ok(colorsFile.includes("iconBlueBg: '#EAF1F8'"), 'iconBlueBg is Soft Blue #EAF1F8');
    assert.ok(colorsFile.includes("iconAmber: '#C58A32'"), 'iconAmber is Warm Amber #C58A32');
    assert.ok(colorsFile.includes("iconAmberBg: '#FBF2E3'"), 'iconAmberBg is Soft Amber #FBF2E3');
    assert.ok(colorsFile.includes("iconViolet: '#7969A8'"), 'iconViolet is Muted Violet #7969A8');
    assert.ok(colorsFile.includes("iconVioletBg: '#F0EDFA'"), 'iconVioletBg is Soft Violet #F0EDFA');
    assert.ok(colorsFile.includes("iconSlate: '#718096'"), 'iconSlate is Slate #718096');
    assert.ok(colorsFile.includes("iconSlateBg: '#EDF1F5'"), 'iconSlateBg is Slate Container #EDF1F5');
  });

  await t.test('2. Brand Header Lockup & Removal of Generic Badge Outline', () => {
    const headerFile = fs.readFileSync(
      path.join(rootDir, 'src/features/dashboard/components/StudentProfileHeader.tsx'),
      'utf8'
    );

    // Brand lockup exists with official emblem and wordmark
    assert.ok(headerFile.includes('brandLockup'), 'brandLockup container must exist');
    assert.ok(headerFile.includes('brandEmblemWrap'), 'brandEmblemWrap must cleanly house official emblem');
    assert.ok(headerFile.includes('brandTitle'), 'brandTitle must display FUNDAMICS');
    assert.ok(headerFile.includes('brandSubtitle'), 'brandSubtitle must display LMS label');

    // Generic pill badge around logo must be removed
    assert.ok(!headerFile.includes('brandBadge: {'), 'brandBadge style must not enclose logo in a generic bordered pill');
  });

  await t.test('3. Elimination of Unnecessary Decorative Dots', () => {
    const headerFile = fs.readFileSync(
      path.join(rootDir, 'src/features/dashboard/components/StudentProfileHeader.tsx'),
      'utf8'
    );
    const perfFile = fs.readFileSync(
      path.join(rootDir, 'src/features/dashboard/components/StudentPerformanceCard.tsx'),
      'utf8'
    );
    const studyFile = fs.readFileSync(
      path.join(rootDir, 'src/features/studyMaterial/screens/StudentStudyMaterialScreen.tsx'),
      'utf8'
    );
    const activityFile = fs.readFileSync(
      path.join(rootDir, 'src/features/dashboard/components/StudentRecentActivityCard.tsx'),
      'utf8'
    );

    // No dotSeparator in header
    assert.ok(!headerFile.includes('dotSeparator: {'), 'dotSeparator style must be removed from header');
    assert.ok(headerFile.includes('idChip'), 'Student ID must use clean idChip container');

    // No floating bullet dot in examination result rows
    assert.ok(!perfFile.includes("•\n                    </Text>"), 'Floating bullet dot in performance card must be removed');
    assert.ok(perfFile.includes('subRowDivider'), 'Performance card must use subtle divider line');

    // No floating bullet dot in study material size
    assert.ok(!studyFile.includes('• {sizeStr}'), 'Floating bullet in study material size must be removed');

    // Activity card subtitle must not use awkward bullet dot
    assert.ok(!activityFile.includes("subtitle: `${r.subject} • Score:"), 'Activity card score must not use awkward bullet separator');
  });

  await t.test('4. Retention of Meaningful Status Indicators', () => {
    const headerFile = fs.readFileSync(
      path.join(rootDir, 'src/features/dashboard/components/StudentProfileHeader.tsx'),
      'utf8'
    );
    const attendanceFile = fs.readFileSync(
      path.join(rootDir, 'src/features/dashboard/components/StudentAttendanceSummaryCard.tsx'),
      'utf8'
    );
    const profileFile = fs.readFileSync(
      path.join(rootDir, 'src/features/profile/screens/StudentProfileScreen.tsx'),
      'utf8'
    );
    const notifFile = fs.readFileSync(
      path.join(rootDir, 'src/features/notifications/screens/NotificationsScreen.tsx'),
      'utf8'
    );

    // Unread notification badge on bell
    assert.ok(headerFile.includes('notificationDot'), 'Unread notification dot must be retained');

    // Attendance compliance status dot
    assert.ok(attendanceFile.includes('statusDot'), 'Compliance status dot must be retained in attendance card');

    // Student account active status dot
    assert.ok(profileFile.includes('statusDot'), 'Account active status dot must be retained in profile');

    // Unread circular indicator
    assert.ok(notifFile.includes('unreadDot'), 'Unread circular indicator must be retained');
  });

  await t.test('5. Coordinated Icon Palette Treatment by Feature', () => {
    const attendanceCard = fs.readFileSync(
      path.join(rootDir, 'src/features/dashboard/components/StudentAttendanceSummaryCard.tsx'),
      'utf8'
    );
    const perfCard = fs.readFileSync(
      path.join(rootDir, 'src/features/dashboard/components/StudentPerformanceCard.tsx'),
      'utf8'
    );
    const studyScreen = fs.readFileSync(
      path.join(rootDir, 'src/features/studyMaterial/screens/StudentStudyMaterialScreen.tsx'),
      'utf8'
    );
    const notifScreen = fs.readFileSync(
      path.join(rootDir, 'src/features/notifications/screens/NotificationsScreen.tsx'),
      'utf8'
    );
    const activityCard = fs.readFileSync(
      path.join(rootDir, 'src/features/dashboard/components/StudentRecentActivityCard.tsx'),
      'utf8'
    );

    // Attendance -> Emerald
    assert.ok(attendanceCard.includes('colors.iconEmeraldBg'), 'Attendance card icon background must be iconEmeraldBg');
    assert.ok(attendanceCard.includes('colors.iconEmerald'), 'Attendance card icon must be iconEmerald');

    // Examination Results -> Muted Blue
    assert.ok(perfCard.includes('colors.iconBlueBg'), 'Performance card icon background must be iconBlueBg');
    assert.ok(perfCard.includes('colors.iconBlue'), 'Performance card icon must be iconBlue');

    // Study Material -> Muted Violet
    assert.ok(studyScreen.includes('colors.iconVioletBg'), 'Study material icon background must be iconVioletBg');
    assert.ok(studyScreen.includes('colors.iconViolet'), 'Study material icon must be iconViolet');

    // Notices -> Warm Amber
    assert.ok(notifScreen.includes('colors.iconAmberBg'), 'Notices icon background must be iconAmberBg');
    assert.ok(notifScreen.includes('colors.iconAmber'), 'Notices icon must be iconAmber');

    // Recent Activity -> Dynamic Coordinated Icons
    assert.ok(activityCard.includes('getItemIconBg(item.type)'), 'Activity feed must dynamically tint icon background by item type');
    assert.ok(activityCard.includes('getItemIconColor(item.type)'), 'Activity feed must dynamically color icon by item type');
  });

  await t.test('6. Bottom Navigation Active Emerald and Inactive Slate Treatment', () => {
    const navFile = fs.readFileSync(
      path.join(rootDir, 'src/app/navigation/StudentNavigator.tsx'),
      'utf8'
    );

    assert.ok(navFile.includes('tabBarActiveTintColor: colors.iconEmerald'), 'Active tab must be iconEmerald');
    assert.ok(navFile.includes('tabBarInactiveTintColor: colors.iconSlate'), 'Inactive tabs must be iconSlate');
    assert.ok(navFile.includes('emeraldColor={colors.iconEmerald}'), 'Tab icon indicator must use iconEmerald');
  });
});
