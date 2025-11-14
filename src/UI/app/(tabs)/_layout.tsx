import { Tabs, router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

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
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="text.document" color={color} />,
        }}
      />
      <Tabs.Screen
        name="listening-trigger"
        options={{
          title: 'Start Listening',
          tabBarButton: () => (
            <Pressable style={styles.fabContainer} onPress={() => router.push('/modal')}>
              <Pressable style={styles.fab} onPress={() => router.push('/modal')}>
                <IconSymbol name="mic" color="#fff" size={32} />
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
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  fab: {
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
