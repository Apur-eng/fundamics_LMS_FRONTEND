import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TeacherTabParamList } from './types';
import { useTheme } from '../../theme';
import { TeacherDashboardScreen } from '../../features/dashboard';
import { AttendancePlaceholderScreen } from '../../features/attendance';
import { ClassesPlaceholderScreen } from '../../features/classes';
import { ExamsPlaceholderScreen } from '../../features/exams';
import { NotificationsPlaceholderScreen } from '../../features/notifications';

const Tab = createBottomTabNavigator<TeacherTabParamList>();

export const TeacherNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen
        name="TeacherDashboardTab"
        component={TeacherDashboardScreen}
        options={{
          tabBarLabel: 'Overview',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'grid' : 'grid-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="TeacherAttendanceTab"
        component={AttendancePlaceholderScreen}
        options={{
          tabBarLabel: 'Attendance',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="TeacherClassesTab"
        component={ClassesPlaceholderScreen}
        options={{
          tabBarLabel: 'Batches',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'book' : 'book-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="TeacherExamsTab"
        component={ExamsPlaceholderScreen}
        options={{
          tabBarLabel: 'Assessments',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'clipboard' : 'clipboard-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="TeacherNotificationsTab"
        component={NotificationsPlaceholderScreen}
        options={{
          tabBarLabel: 'Circulars',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'notifications' : 'notifications-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
