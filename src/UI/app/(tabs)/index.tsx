import React, { useMemo } from 'react';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, ScrollView, StatusBar, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { LogProps } from '@/components/LogCard';
import Divider from '@/components/Divider';
import LogCard from '@/components/LogCard';
import ApprovedIcon from '@/assets/images/approved.svg';
import PendingIcon from '@/assets/images/pending.svg';
import InfoIcon from '@/assets/images/info.svg';
import { LogStatus } from '@/components/LogCard';

export default function LogsScreen() {
  const [dummyData, setDummyData] = useState<LogProps[]>([
    {
      id: '1',
      type: 'task',
      title: 'Feed Cows',
      date: '2025-11-13',
      time: '06:00',
      transcription: 'Fed 30 Holstein cows with silage and grain mix in barn A.',
      status: 'approved',
    },
    {
      id: '2',
      type: 'task',
      title: 'Milking',
      date: '2025-11-13',
      time: '07:00',
      transcription: 'Completed morning milking for all cows. Noted cow 537 had reduced yield.',
      status: 'approved',
    },
    {
      id: '3',
      type: 'animalEvent',
      title: 'Health Check',
      date: '2025-11-13',
      time: '09:30',
      transcription:
        'Checked all cows for signs of lameness. Cow 214 limping, needs further inspection.',
      status: 'pending',
    },
    {
      id: '4',
      type: 'task',
      title: 'Clean Barn',
      date: '2025-11-13',
      time: '11:00',
      transcription: 'Removed manure and refreshed bedding in barn B.',
      status: 'approved',
    },
    {
      id: '5',
      type: 'notes',
      title: 'Repair Fence',
      date: '2025-11-13',
      time: '14:00',
      transcription: 'Fixed broken section of pasture fence near north gate.',
      status: 'approved',
    },
    {
      id: '6',
      type: 'animal',
      title: 'New Calf Born',
      date: '2025-11-14',
      time: '03:15',
      transcription: 'Cow 302 gave birth to a healthy heifer calf. Both are doing well.',
      status: 'approved',
    },
    {
      id: '7',
      type: 'animalEvent',
      title: 'Vaccination',
      date: '2025-11-14',
      time: '10:00',
      transcription: 'Administered routine vaccinations to herd. All animals responded well.',
      status: 'pending',
    },
  ]);
  const pendingLogs = useMemo(() => dummyData.filter((i) => i.status === 'pending'), [dummyData]);
  const approvedLogs = useMemo(() => dummyData.filter((i) => i.status === 'approved'), [dummyData]);
  return (
    <View style={styles.container}>
      {/* // <SafeAreaProvider>
    //   <SafeAreaView style={styles.container}> */}
      <ScrollView>
        {pendingLogs.length > 0 ? (
          <>
            <Divider text="Pending Approvals" icon={<PendingIcon height={12} />} />
            {pendingLogs.map((item) => (
              <LogCard key={item.id} {...item} />
            ))}
          </>
        ) : null}
        {approvedLogs.length > 0 ? (
          <>
            <Divider text="Approved Entries" icon={<ApprovedIcon height={12} />} />
            {approvedLogs.map((item) => (
              <LogCard key={item.id} {...item} />
            ))}
          </>
        ) : null}
      </ScrollView>
      {/* </SafeAreaView> */}
      {/* </SafeAreaProvider> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: 'white',
    paddingHorizontal: 25,
  },
  text: {
    fontSize: 42,
    padding: 12,
  },
});
