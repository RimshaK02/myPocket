import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import ModalButton from '@/components/ModalButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import PhoneLockIcon from '@/assets/images/phone-lock.svg';
import TriggerIcon from '@/assets/images/ear.svg';
import MicStopIcon from '@/assets/images/mic-stop.svg';

export default function ModalScreen() {
  const [triggered, setTriggered] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  return (
    <>
      <ThemedView style={styles.container}>
        <Pressable
          style={styles.exit}
          onPress={() => {
            router.back();  // close the modal and return to previous page
          }}
        >
          <Entypo name="cross" size={20} color="#FFFFFF" />
        </Pressable>
        <View style={styles.pulse}>
          <Image
            source={require('@/assets/images/pixel_cow_sprite_3.png')}
            style={{ width: 100, height: 100 }}
          />
        </View>
        {triggered ? (
          <>
            <ThemedText type="subtitle">Trigger word detected, recording...</ThemedText>
            <Text style={[styles.secondaryText, { color: '#44869F' }]}>
              ... Pocket AI, cow 420 seems to have a limp, assign Jason to take a look at it late in
              the
            </Text>
          </>
        ) : (
          <>
            <ThemedText type="subtitle">Listening for the trigger word...</ThemedText>
            <Text style={styles.secondaryText}>
              Say "Hey Pocket", followed by a phrase or command
            </Text>
          </>
        )}
      </ThemedView>
      <View
        style={{
          height: 140,
          width: '100%',
          backgroundColor: colors.tabBar,
          justifyContent: 'center',
          alignItems: 'flex-end',
          flexDirection: 'row',
          paddingBottom: 12
        }}
      >
        <ModalButton
          onPress={() => {}}
          color={colors.secondaryButton}
          title="Lock Screen"
          size={50}
          icon={<PhoneLockIcon color={"white"} width={26} height={26}/>}
        />
        <ModalButton
          onPress={() => {
            router.back();
          }}
          color={colors.primaryButton}
          title="Stop Listening"
          size={70}
          icon={<MicStopIcon color={"white"} width={36} height={36} />}
        />
        <ModalButton
          onPress={() => {
            setTriggered(!triggered);
          }}
          color={colors.secondaryButton}
          title="Manual Trigger"
          size={50}
          icon={<TriggerIcon color={"white"} width={26} height={26}/>}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  pulse: {
    backgroundColor: '#9DB38D',
    height: 200,
    width: 200,
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  exit: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    position: 'absolute',
    top: 24,
    left: 24,
    backgroundColor: '#DFDFDF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});
