import { ScrollView, Text } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
export default function ProfileScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{backgroundColor: "white", flex: 1}}>
        <ScrollView>
          <Text>TODO: Profile Screen</Text>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
