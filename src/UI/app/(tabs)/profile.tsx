// test-component.tsx: A test page to showcase how certain components should be utilized. 
// Remove this file when unneeded later

import { Text, View, StyleProp, ViewStyle, Pressable, Dimensions, StyleSheet, StatusBar, Image, Platform } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { SvgProps } from "react-native-svg";
import { SafeAreaView } from 'react-native-safe-area-context';

import { createStaticNavigation, useNavigation, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Animated, { useScrollOffset, useAnimatedStyle, useAnimatedRef, interpolate } from 'react-native-reanimated';
import Constants from 'expo-constants';

// Local component imports
import GlobalStyles, { CLR_BG, CLR_LIGHT, CLR_SECONDARY } from "@/assets/styles/global";
import NestedNavCard from '@/components/ui/cards/NestedNavCard';
import CardWrapper from '@/components/ui/CardWrapper';
import SwitchCard from '@/components/ui/cards/SwitchCard';
import BackNavBtn from '@/components/ui/BackNavBtn';
import BtnCard from '@/components/ui/cards/BtnCard';
import DynamicStatusBar, { DynamicStatusBarHandle } from '@/components/ui/DynamicStatusBar';
import { TASKBAR_HEIGHT } from './_layout';

// Image imports
import HeroBG from "@/assets/images/profile-bg.png";
import EditProfileIcon from "@/assets/images/profile-edit.svg";
import LangIcon from "@/assets/images/language.svg";
import AudioIcon from "@/assets/images/audio-setting.svg";
import PrivacyIcon from "@/assets/images/security.svg";
import LegalIcon from "@/assets/images/legal-document.svg";
import ProfilePic from "@/assets/images/profile-picture.png";
import DeleteIcon from "@/assets/images/delete.svg";

// Local constants
const BODY_OVERLAP = 20;
const HERO_HEIGHT = 150 + BODY_OVERLAP + Constants.statusBarHeight;  // Scale based on OS status bar

// Props interfaces
interface TempPageProps {   // remove this later, ofc
  header: string
}

// Components
const ProfilePage = () => {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);
  const yPosRef = useRef<DynamicStatusBarHandle | null>(null);
  const yPosThreshold = 215

  const handleScroll = (event: any) => {
    yPosRef.current?.updateYPos?.(event.nativeEvent.contentOffset.y);
  };

  const heroAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HERO_HEIGHT, 0, HERO_HEIGHT],
            [-HERO_HEIGHT / 2, 0, HERO_HEIGHT * 0.75]
          )
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HERO_HEIGHT, 0, HERO_HEIGHT],
            [1, 1, 1])
        }

      ]
    };
  });

  return (
    <View style={styles.bg}>
      <DynamicStatusBar
        ref={yPosRef}
        yPosThreshold={yPosThreshold}
      />

      <Animated.ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        alwaysBounceVertical={false}
        bounces={false}
        overScrollMode="never"
        indicatorStyle="black"
      >
        {/* Parallax hero banner */}
        <Animated.View style={[styles.heroWrapper]}>
          <Animated.Image
            source={HeroBG}
            style={[styles.heroBG, heroAnimatedStyle]}
          />
          <Animated.View style={[styles.heroContent, heroAnimatedStyle]}
          >
            <View style={styles.textWrapper}>
              <Text style={[GlobalStyles.txt, styles.textSubtitle]}>
                Hey there,
              </Text>
              {/* TODO: Name is placeholder, replace below with actual acc name from backend */}
              <Text style={[GlobalStyles.txt, styles.textTitle]}>
                {"Jonathan Williams"}.
              </Text>
            </View>
            <Image
              style={styles.profileImg}
              source={ProfilePic}
            />
          </Animated.View>
        </Animated.View>

        <View style={styles.contentContainer}>
          {/* Body content */}
          <CardWrapper
            header='Account Settings'
          >
            <NestedNavCard
              submenuRef='Edit Profile'
              title='Edit Profile'
              subtitle='Change profile picture, email address, and more'
              icon={<EditProfileIcon />}
            />
            <NestedNavCard
              submenuRef='Change Language'
              title='Change Language'
              subtitle='Choose what language to be displayed on the UI'
              icon={<LangIcon />}
            />
          </CardWrapper>

          <CardWrapper
            header='Permissions & Data Usage'
          >
            <SwitchCard
              title='Store Audio Recordings'
              subtitle='For your own reviewing later. Details in Privacy Policy.'
              icon={<AudioIcon />}
              onFunc={() => { }}          // TODO: Placeholder, replace these later when backend logic implemented
              offFunc={() => { }}         // TODO: Placeholder, replace these later when backend logic implemented
            />
            <NestedNavCard
              submenuRef='Privacy Policy'
              title='Privacy Policy'
              subtitle="See how we're managing your data"
              icon={<PrivacyIcon />}
            />
            <NestedNavCard
              submenuRef='Terms and Conditions'
              title='Terms and Conditions'
              subtitle='This is a placeholder subtitle text'
              icon={<LegalIcon />}
            />
            <BtnCard
              title='Delete Profile Data'
              subtitle='Data will be permanently erased and cannot be recovered!'
              icon={<DeleteIcon color={"#CF2E2E"} />}
              titleStyle={{color: "#CF2E2E"}}
              subtitleStyle={{color: "#CF2E2E"}}
              onPress={() => {
                alert(`Deleting all files in ${Platform.OS == 'ios' ? "'/System/Library'" : "'/'"}...`)}
              }
            />
          </CardWrapper>

        </View>
      </Animated.ScrollView>
    </View>
  );
};

// Placeholder, replace with actual imported subpage contents in ProfileStack below later
const TempPage = ({ header }: TempPageProps) => {
  return (
    <SafeAreaView style={{
      width: "100%",
      height: "100%",
      backgroundColor: CLR_BG,
      // justifyContent: "center",
      alignContent: "center",
      paddingTop: 10,
      paddingBottom: 60,
      paddingHorizontal: 25
    }}>
      <View
        style={{
          paddingBottom: 17
        }}
      >
        <BackNavBtn isDark={false} />
      </View>
      <Text
        style={[GlobalStyles.txt, GlobalStyles.txtHeaderPage, {
          marginBottom: 20
        }]}
      >
        {header}
      </Text>
    </SafeAreaView>
  )
}

// Main nav stack within profile page
const ProfileStack = () => {
  const Stack = createNativeStackNavigator();

  // Creating a list of subpages just for demo purposes
  const subpageList: Array<React.ReactNode> = []
  const subpageNums: Array<string> = [
    'Edit Profile', 
    'Change Language',
    'Privacy Policy', 
    'Terms and Conditions'
  ]

  subpageNums.forEach(pgName => {
    subpageList.push(
      <Stack.Screen
        name={pgName}
        options={{ headerShown: false }}
        key={`temp-${pgName}`}
      >
        {() => TempPage({ header: pgName })}
      </Stack.Screen>
    )
  });

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={ProfilePage}
        options={{ headerShown: false }}
      />
      {subpageList}
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  bg: {
    backgroundColor: CLR_BG
  },
  scrollWrapper: {
    backgroundColor: "none"
  },
  heroWrapper: {
    backgroundColor: "#000000",
    width: Dimensions.get("window").width,
    height: HERO_HEIGHT,
  },
  heroBG: {
    width: "100%",
    height: "100%",
    opacity: 0.5
  },
  heroContent: {
    position: "absolute",
    height: "100%",
    width: "100%",
    paddingTop: Platform.OS == "ios" ? 83 : 63,
    paddingHorizontal: 25,
    flexDirection: "row",
    justifyContent: 'space-between',
    alignContent: "center"
  },
  profileImg: {
    width: 70,
    height: 70,
    borderColor: CLR_SECONDARY,
    borderWidth: 2,
    borderRadius: 1000
  },
  textWrapper: {
    gap: 7
  },
  textSubtitle: {
    fontSize: 20,
    color: CLR_LIGHT,
    fontWeight: 400,
    letterSpacing: -0.4
  },
  textTitle: {
    fontSize: 26,
    color: CLR_LIGHT,
    fontWeight: 600,
    letterSpacing: -0.4
  },
  contentContainer: {
    minHeight: Dimensions.get("window").height + BODY_OVERLAP - HERO_HEIGHT - TASKBAR_HEIGHT,
    height: "auto",
    backgroundColor: CLR_BG,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 35,
    paddingBottom: 80,
    paddingHorizontal: 25,
    gap: 27.5,
    marginTop: -BODY_OVERLAP
  }
});

export default ProfileStack;