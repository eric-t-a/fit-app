import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Run',
          tabBarIcon: ({ color }) => <FontAwesome5 name="running" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="gym"
        options={{
          title: 'Gym',
          tabBarIcon: ({ color }) => <FontAwesome5 name="dumbbell" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="userConfig"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <FontAwesome5 name="cog" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
