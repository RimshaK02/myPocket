import React, { useMemo } from 'react';
import { useState } from 'react';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  ScrollView,
  StatusBar,
  View,
  Pressable,
  TextInput,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { LogProps } from '@/components/LogCard';
import Divider from '@/components/Divider';
import LogCard from '@/components/LogCard';
import ApprovedIcon from '@/assets/images/approved.svg';
import PendingIcon from '@/assets/images/pending.svg';
import InfoIcon from '@/assets/images/info.svg';
import { LogStatus } from '@/components/LogCard';
import LogTypeFilter from '@/components/LogTypeFilter';
import { LogType } from '@/components/LogCard';
import FilterIcon from '@/assets/images/filter.svg';

const ALL_LOG_TYPES: LogType[] = ['task', 'notes', 'animal', 'animalEvent'];

export default function LogsScreen() {
  const [selectedTypes, setSelectedTypes] = useState<Set<LogType>>(new Set(ALL_LOG_TYPES));
  const [searchText, setSearchText] = useState('');
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
  const filteredData = useMemo(() => {
    // Filter by type
    let result = dummyData.filter((item) => selectedTypes.has(item.type));

    // Filter by search text if not empty
    if (searchText.trim() !== '') {
      const searchLower = searchText.toLowerCase();
      result = result.filter((item) => item.transcription.toLowerCase().includes(searchLower));
    }

    return result;
  }, [dummyData, selectedTypes, searchText]);

  const pendingLogs = useMemo(
    () => filteredData.filter((i) => i.status === 'pending'),
    [filteredData],
  );
  const approvedLogs = useMemo(
    () => filteredData.filter((i) => i.status === 'approved'),
    [filteredData],
  );

  const handleTypeFilter = (item: LogType) => {
    const newSet = new Set(selectedTypes);
    if (newSet.has(item)) {
      newSet.delete(item);
    } else {
      newSet.add(item);
    }
    setSelectedTypes(newSet);
  };

  const handleApproveAll = () => {
    setDummyData((prev) => {
      return prev.map((log) => (log.status === 'pending' ? { ...log, status: 'approved' } : log));
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.text}>Logged Recordings</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10, height: 45 }}>
            <TextInput
              placeholder="🔍Search..."
              style={styles.textInput}
              value={searchText}
              onChangeText={(newText) => setSearchText(newText)}
            />
            <Pressable style={styles.searchButton}>
              <FilterIcon width={24} height={24} color={'white'} style={{ alignSelf: 'center' }} />
            </Pressable>
          </View>
          <FlatList
            horizontal
            contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}
            data={ALL_LOG_TYPES}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <LogTypeFilter
                type={item}
                selected={selectedTypes.has(item)}
                onPress={() => handleTypeFilter(item)}
              />
            )}
          />
        </View>
        <ScrollView>
          {pendingLogs.length > 0 ? (
            <>
              <Divider text="Pending Approvals" icon={<PendingIcon height={12} />} />
              <Pressable style={styles.approveAllButton} onPress={handleApproveAll}>
                <Text style={styles.approveAllButtonText}>Approve All Pending Tasks</Text>
              </Pressable>
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
      </SafeAreaView>
    </SafeAreaProvider>
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
    fontSize: 25,
    padding: 12,
    fontWeight: '600',
  },
  approveAllButtonText: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#92A684',
    fontWeight: 'bold',
  },
  approveAllButton: {
    borderWidth: 3,
    borderColor: '#92A684',
    marginTop: 10,
    borderRadius: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 3,
    borderColor: '#ABB7C2',
    borderRadius: 8,
    paddingLeft: 10,
  },
  searchButton: {
    width: 45,
    borderRadius: 8,
    backgroundColor: '#6C8F9D',
    justifyContent: 'center',
  },
});
