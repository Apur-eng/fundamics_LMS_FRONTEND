import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StudentTabParamList } from './types';
import { useTheme } from '../../theme';
import { StudentDashboardScreen } from '../../features/dashboard';
import { ClassesPlaceholderScreen } from '../../features/classes';
import { AssignmentsPlaceholderScreen } from '../../features/assignments';
import { ResultsPlaceholderScreen } from '../../features/results';
import { NotificationsPlaceholderScreen } from '../../features/notifications';

const Tab = createBottomTabNavigator<StudentTabParamList>();

export const StudentNavigator: React.FC = () => {
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
        name="StudentDashboardTab"
        component={StudentDashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="StudentClassesTab"
        component={ClassesPlaceholderScreen}
        options={{
          tabBarLabel: 'Classes',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'book' : 'book-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="StudentAssignmentsTab"
        component={AssignmentsPlaceholderScreen}
        options={{
          tabBarLabel: 'Homework',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'document-text' : 'document-text-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="StudentResultsTab"
        component={ResultsPlaceholderScreen}
        options={{
          tabBarLabel: 'Results',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'trophy' : 'trophy-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="StudentNotificationsTab"
        component={NotificationsPlaceholderScreen}
        options={{
          tabBarLabel: 'Notices',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'notifications' : 'notifications-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
