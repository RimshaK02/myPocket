// test-component.tsx: A test page to showcase how certain components should be utilized. 
// Remove this file when unneeded later

import { Text, View, StyleProp, ViewStyle, Animated, Pressable, StyleSheet } from 'react-native';
import React, { useRef, useState } from 'react';
import { SvgProps } from "react-native-svg";

import { createStaticNavigation, useNavigation, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Local component imports
import GlobalStyles, { CLR_BG } from "@/assets/styles/global";
import NestedNavCard from '@/components/ui/cards/NestedNavCard';
import CardWrapper from '@/components/ui/CardWrapper';
import SwitchCard from '@/components/ui/cards/SwitchCard';

// Image imports
import EditDetailsIcon from '@/assets/images/details-edit.svg';
import EditSpeechIcon from '@/assets/images/message-edit.svg';
import SwitchIcon from '@/assets/images/change.svg'; 
import AudioIcon from '@/assets/images/audio-setting-2.svg';
import NavArrow from "@/assets/images/nav-arrow.svg";

import { SafeAreaView } from 'react-native-safe-area-context';
import BackNavBtn from '@/components/ui/BackNavBtn';
import BtnCard from '@/components/ui/cards/BtnCard';

interface SubPageProps {
    header: string
}

// Main page, containing components of different types (i.e. card + sections and their usage)
const TestMain = () => {
    return(
        <SafeAreaView style={{ 
            width: "100%", 
            height: "100%",
            backgroundColor: CLR_BG,
            // justifyContent: "center",
            alignContent: "center",
            paddingVertical: 60,
            paddingHorizontal: 25
        }}>
            <BackNavBtn 
                style={{
                    marginBottom: 17
                }}
                isDark={false}
            />
            <Text
                style={[GlobalStyles.txt, GlobalStyles.txtHeaderPage, {
                    marginBottom: 30
                }]}
            >
                Components Testing
            </Text>

            {/* Cards are passed children components to a wrapper CardWrapper */}
            <CardWrapper
                header='Command Settings'   // Optional
            >
                <NestedNavCard
                    submenuRef='Sub1'                                           // Name of page to link to
                    icon={<EditSpeechIcon />}                                   // Vector/PNG icon to display, pass as component
                    title='Edit Transcription'                                  // Title in card
                    subtitle='Correct any errors made during transcription'     // Subtitle in card
                />
                <NestedNavCard
                    submenuRef='Sub2'
                    icon={<EditDetailsIcon />}
                    title='Edit Task Details'
                    subtitle='Manually edit attributes unique to command type'
                />
                <SwitchCard 
                    icon={<AudioIcon />}
                    title='Store Audio Recordings'
                    subtitle='For your own reviewing later. More details in Privacy Policy'
                    onFunc={() => alert("On")}
                    offFunc={() => alert("Off")}
                />
                <BtnCard
                    icon={<SwitchIcon />}
                    title='Change Log Type'
                    subtitle='Logged entry current identified as "Task"'
                    onPress={() => alert("Button pressed!")}
                />
            </CardWrapper>
        </SafeAreaView>
    );
};

const SubPage = ({header}: SubPageProps) => {
    return(
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
                <BackNavBtn isDark={false}/>
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

const RootStack = () => {
    const Stack = createNativeStackNavigator();

    // Creating a list of subpages just for demo purposes
    const subpageList: Array<React.ReactNode> = []
    const subpageNums: Array<number> = [1, 2, 3]

    subpageNums.forEach(num => {
        subpageList.push(
            <Stack.Screen 
                name={`Sub${num}`}
                options={{headerShown: false}}
                key={`subpage-${num}`}
            >
                {() => SubPage({header: `Subpage #${num}`})}
            </Stack.Screen>
        )
    });

    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="Main"
                component={TestMain}
                options={{ headerShown: false }}
            />
            {subpageList}
        </Stack.Navigator>
    )
};

const styles = StyleSheet.create({
    
});

export default RootStack;