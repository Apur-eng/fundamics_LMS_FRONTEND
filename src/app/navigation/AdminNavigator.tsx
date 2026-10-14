import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AdminTabParamList } from './types';
import { useTheme } from '../../theme';
import { AdminDashboardScreen } from '../../features/dashboard';
import { StudentsPlaceholderScreen } from '../../features/students';
import { FeesPlaceholderScreen } from '../../features/fees';
import { NotificationsPlaceholderScreen } from '../../features/notifications';

const Tab = createBottomTabNavigator<AdminTabParamList>();

export const AdminNavigator: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const tabPaddingBottom = Math.max(insets.bottom, 8);
  const tabHeight = 54 + tabPaddingBottom;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: tabHeight,
          paddingBottom: tabPaddingBottom,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="AdminDashboardTab"
        component={AdminDashboardScreen}
        options={{
          tabBarLabel: 'Command',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'analytics' : 'analytics-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AdminStudentsTab"
        component={StudentsPlaceholderScreen}
        options={{
          tabBarLabel: 'Directory',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'people' : 'people-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AdminFeesTab"
        component={FeesPlaceholderScreen}
        options={{
          tabBarLabel: 'Fees',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'wallet' : 'wallet-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AdminNotificationsTab"
        component={NotificationsPlaceholderScreen}
        options={{
          tabBarLabel: 'Broadcasts',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'megaphone' : 'megaphone-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
