import { Tabs, router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, Platform } from 'react-native';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MicIcon from '@/assets/images/mic.svg';
import ProfileIcon from '@/assets/images/profile.svg';
import LogsIcon from '@/assets/images/logs.svg';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export const TASKBAR_HEIGHT = 93;

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
          minHeight: TASKBAR_HEIGHT,
          height: 'auto',
          paddingTop: 8,
          paddingHorizontal: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Logs',
          tabBarLabelStyle: styles.tabLabel,
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
                <MicIcon width={40} height={40} color={'#fff'} />
              </Pressable>
              <Text style={[styles.tabLabel, styles.fabLabel]}>Start Listening</Text>
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
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
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
    bottom: Platform.OS === 'ios' ? 20 : 30,
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
    // fontSize: 12,
    color: '#fff',
    marginTop: Platform.OS === 'ios' ? 33 : 25,
  },
  tabLabel: {
    fontSize: 13,
    // fontFamily: "Poppins",
    fontWeight: 500,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
});
