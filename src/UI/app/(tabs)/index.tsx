import React from 'react';
import { StyleSheet, Text, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { LogProps } from '@/components/LogCard';
import { router } from 'expo-router';
import { Button } from '@react-navigation/elements';

const dummyData: LogProps[] = [
  {
    id: '1',
    title: 'Feed Cows',
    date: '2025-11-13',
    time: '06:00',
    transcription: 'Fed 30 Holstein cows with silage and grain mix in barn A.',
  },
  {
    id: '2',
    title: 'Milking',
    date: '2025-11-13',
    time: '07:00',
    transcription: 'Completed morning milking for all cows. Noted cow 537 had reduced yield.',
  },
  {
    id: '3',
    title: 'Health Check',
    date: '2025-11-13',
    time: '09:30',
    transcription:
      'Checked all cows for signs of lameness. Cow 214 limping, needs further inspection.',
  },
  {
    id: '4',
    title: 'Clean Barn',
    date: '2025-11-13',
    time: '11:00',
    transcription: 'Removed manure and refreshed bedding in barn B.',
  },
];

export default function LogsScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView>
          <Text style={styles.text}>TODO: Logged Recordings</Text>
          <Button 
            style={{ width: "90%", alignSelf: "center" }} 
            onPressOut={() => router.push("/(auth)/login")} 
          >
            Auth Pages Test
          </Button>
          {/* TODO: Implement a list of log cards using FlatList and single BackNavBtn components nested in CardWrapper containers. 
          Populate the list with dummyData. */}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "white"
  },
  text: {
    fontSize: 42,
    padding: 12,
  },
});
