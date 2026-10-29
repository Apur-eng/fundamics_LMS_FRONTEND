import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StudentTabParamList, StudentStackParamList } from './types';
import { useTheme } from '../../theme';
import { StudentDashboardScreen } from '../../features/dashboard';
import { StudentAttendanceScreen } from '../../features/attendance';
import { StudentStudyMaterialScreen } from '../../features/studyMaterial';
import { StudentResultsScreen } from '../../features/results';
import { NotificationsScreen } from '../../features/notifications';
import { StudentProfileScreen } from '../../features/profile';

const Tab = createBottomTabNavigator<StudentTabParamList>();
const Stack = createNativeStackNavigator<StudentStackParamList>();

interface TabIconProps {
  nameOutline: keyof typeof Ionicons.glyphMap;
  nameFilled: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  color: string;
  size: number;
  emeraldColor: string;
}

const TabIconWithIndicator: React.FC<TabIconProps> = ({
  nameOutline,
  nameFilled,
  focused,
  color,
  size,
  emeraldColor,
}) => (
  <View style={styles.tabIconContainer}>
    <Ionicons
      name={focused ? nameFilled : nameOutline}
      size={22}
      color={color}
    />
    <View
      style={[
        styles.activeIndicator,
        { backgroundColor: focused ? emeraldColor : 'transparent' },
      ]}
    />
  </View>
);

const StudentTabNavigator: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const tabPaddingBottom = Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 6);
  const tabHeight = (Platform.OS === 'android' ? 58 : 56) + tabPaddingBottom;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.iconEmerald,
        tabBarInactiveTintColor: colors.iconSlate,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: tabHeight,
          paddingBottom: tabPaddingBottom,
          paddingTop: 5,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.03,
          shadowRadius: 3,
          elevation: 3,
        },
        tabBarHideOnKeyboard: true,
        tabBarAllowFontScaling: false,
        tabBarItemStyle: {
          paddingHorizontal: 0,
          paddingVertical: 2,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: -0.15,
          marginTop: 1,
          paddingBottom: Platform.OS === 'android' ? 2 : 0,
        },
      }}
    >
      {/* 1. HOME */}
      <Tab.Screen
        name="StudentDashboardTab"
        component={StudentDashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarAccessibilityLabel: 'Home tab',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIconWithIndicator
              nameOutline="home-outline"
              nameFilled="home"
              focused={focused}
              color={color}
              size={size}
              emeraldColor={colors.iconEmerald}
            />
          ),
        }}
      />

      {/* 2. ATTENDANCE */}
      <Tab.Screen
        name="StudentAttendanceTab"
        component={StudentAttendanceScreen}
        options={{
          tabBarLabel: 'Attendance',
          tabBarAccessibilityLabel: 'Attendance tab',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIconWithIndicator
              nameOutline="calendar-outline"
              nameFilled="calendar"
              focused={focused}
              color={color}
              size={size}
              emeraldColor={colors.iconEmerald}
            />
          ),
        }}
      />

      {/* 3. STUDY MATERIAL */}
      <Tab.Screen
        name="StudentStudyMaterialTab"
        component={StudentStudyMaterialScreen}
        options={{
          tabBarLabel: 'Study Material',
          tabBarAccessibilityLabel: 'Study Material tab',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIconWithIndicator
              nameOutline="library-outline"
              nameFilled="library"
              focused={focused}
              color={color}
              size={size}
              emeraldColor={colors.iconEmerald}
            />
          ),
        }}
      />

      {/* 4. RESULTS */}
      <Tab.Screen
        name="StudentResultsTab"
        component={StudentResultsScreen}
        options={{
          tabBarLabel: 'Results',
          tabBarAccessibilityLabel: 'Results tab',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIconWithIndicator
              nameOutline="ribbon-outline"
              nameFilled="ribbon"
              focused={focused}
              color={color}
              size={size}
              emeraldColor={colors.iconEmerald}
            />
          ),
        }}
      />

      {/* 5. NOTICES */}
      <Tab.Screen
        name="StudentNotificationsTab"
        component={NotificationsScreen}
        options={{
          tabBarLabel: 'Notices',
          tabBarAccessibilityLabel: 'Notices tab',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIconWithIndicator
              nameOutline="notifications-outline"
              nameFilled="notifications"
              focused={focused}
              color={color}
              size={size}
              emeraldColor={colors.iconEmerald}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Stable wrapper components outside render to avoid React Navigation inline definition warnings
const StudentProfileWrapper: React.FC<{ navigation: any }> = ({ navigation }) => (
  <StudentProfileScreen onBack={() => navigation.goBack()} />
);

const StudentAttendanceWrapper: React.FC<{ navigation: any }> = ({ navigation }) => (
  <StudentAttendanceScreen onBack={() => navigation.goBack()} />
);

const StudentStudyMaterialWrapper: React.FC<{ navigation: any }> = ({ navigation }) => (
  <StudentStudyMaterialScreen onBack={() => navigation.goBack()} />
);

export const StudentNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StudentTabs" component={StudentTabNavigator} />
      <Stack.Screen
        name="StudentProfile"
        component={StudentProfileWrapper}
      />
      <Stack.Screen
        name="StudentAttendance"
        component={StudentAttendanceWrapper}
      />
      <Stack.Screen
        name="StudentStudyMaterial"
        component={StudentStudyMaterialWrapper}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
  },
  activeIndicator: {
    width: 14,
    height: 2.5,
    borderRadius: 1.5,
    marginTop: 2,
  },
});
