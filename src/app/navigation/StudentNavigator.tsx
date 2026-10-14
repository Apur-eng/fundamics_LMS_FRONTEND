import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StudentTabParamList, StudentStackParamList } from './types';
import { useTheme } from '../../theme';
import { StudentDashboardScreen } from '../../features/dashboard';
import { ClassesPlaceholderScreen } from '../../features/classes';
import { AssignmentsPlaceholderScreen } from '../../features/assignments';
import { StudentResultsScreen } from '../../features/results';
import { NotificationsPlaceholderScreen } from '../../features/notifications';
import { StudentAttendanceScreen } from '../../features/attendance';

const Tab = createBottomTabNavigator<StudentTabParamList>();
const Stack = createNativeStackNavigator<StudentStackParamList>();

const StudentTabNavigator: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const tabPaddingBottom = Math.max(insets.bottom, 8);
  const tabHeight = 54 + tabPaddingBottom;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,       // Academic deep blue (#075B86)
        tabBarInactiveTintColor: '#A0B0BC',           // Muted blue-grey
        tabBarStyle: {
          backgroundColor: '#FFFFFF',               // Pure white bar
          borderTopColor: '#E4EBF0',                // Soft blue-grey border
          borderTopWidth: 1,
          height: tabHeight,
          paddingBottom: tabPaddingBottom,
          paddingTop: 6,
          // Subtle elevation for the bar
          shadowColor: '#087BAF',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.2,
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
        component={StudentResultsScreen}
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

export const StudentNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StudentTabs" component={StudentTabNavigator} />
      <Stack.Screen
        name="StudentAttendance"
        component={({ navigation }: any) => (
          <StudentAttendanceScreen onBack={() => navigation.goBack()} />
        )}
      />
    </Stack.Navigator>
  );
};
