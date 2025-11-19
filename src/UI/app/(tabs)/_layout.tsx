import { Tabs, router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text } from 'react-native';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MicIcon from '@/assets/images/mic.svg';
import ProfileIcon from "@/assets/images/profile.svg";
import LogsIcon from "@/assets/images/logs.svg";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].tabBar,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Logs',
          tabBarIcon: ({ color }) => (
            <LogsIcon color={color} />
            // <Image source={LogsIcon} style={{ tintColor: color }} />
          ),
        }}
      />
      <Tabs.Screen
        name="listening-trigger"
        options={{
          title: 'Start Listening',
          tabBarButton: () => (
            <Pressable style={styles.fabContainer} onPress={() => router.push('/modal')}>
              <Pressable style={styles.fab} onPress={() => router.push('/modal')}>
                <MicIcon width={32} height={32} color={'#fff'} />
              </Pressable>
              <Text style={styles.fabLabel}>Start Listening</Text>
            </Pressable>
          ),
        }}
        listeners={{
          tabPress: (e) => e.preventDefault(),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <ProfileIcon color={color} />
            // <Image source={} style={{ tintColor: color }} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  fab: {
    borderColor: '#fff',
    borderWidth: 2,
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primaryButton,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  fabLabel: {
    fontSize: 12,
    color: '#fff',
    marginTop: 32,
  },
});
