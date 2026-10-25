import React from 'react';
import { View } from 'react-native';
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
        tabBarActiveTintColor: colors.navy,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: tabHeight,
          paddingBottom: tabPaddingBottom,
          paddingTop: 5,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 6,
          elevation: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.1,
          marginTop: 1,
        },
      }}
    >
      <Tab.Screen
        name="StudentDashboardTab"
        component={StudentDashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 2,
                borderRadius: 12,
                backgroundColor: focused ? colors.navyContainer : 'transparent',
              }}
            >
              <Ionicons name={focused ? 'home' : 'home-outline'} size={size - 1} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="StudentClassesTab"
        component={ClassesPlaceholderScreen}
        options={{
          tabBarLabel: 'Classes',
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 2,
                borderRadius: 12,
                backgroundColor: focused ? colors.navyContainer : 'transparent',
              }}
            >
              <Ionicons name={focused ? 'book' : 'book-outline'} size={size - 1} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="StudentAssignmentsTab"
        component={AssignmentsPlaceholderScreen}
        options={{
          tabBarLabel: 'Homework',
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 2,
                borderRadius: 12,
                backgroundColor: focused ? colors.navyContainer : 'transparent',
              }}
            >
              <Ionicons name={focused ? 'document-text' : 'document-text-outline'} size={size - 1} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="StudentResultsTab"
        component={StudentResultsScreen}
        options={{
          tabBarLabel: 'Results',
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 2,
                borderRadius: 12,
                backgroundColor: focused ? colors.navyContainer : 'transparent',
              }}
            >
              <Ionicons name={focused ? 'trophy' : 'trophy-outline'} size={size - 1} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="StudentNotificationsTab"
        component={NotificationsPlaceholderScreen}
        options={{
          tabBarLabel: 'Notices',
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 2,
                borderRadius: 12,
                backgroundColor: focused ? colors.navyContainer : 'transparent',
              }}
            >
              <Ionicons name={focused ? 'notifications' : 'notifications-outline'} size={size - 1} color={color} />
            </View>
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
