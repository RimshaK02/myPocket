import { StyleSheet, View, Text, Image, ScrollView, Pressable, Dimensions } from "react-native";
import { PropsWithChildren, ReactNode, useState } from "react";
import { router } from "expo-router";
import Constants from "expo-constants";

// Local module/constants imports
import BackNavBtn from "@/components/ui/BackNavBtn";
import { CLR_LIGHT } from "@/assets/styles/global";
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Local image imports
import FAQIcon from '@/assets/images/faq.svg';
import CattleyticsLogo from "@/assets/images/cattleytics_logo.png";

// Local constants
const BODY_OVERLAP = 30;
const BANNER_VPADDING = 16;
const BANNER_LOGO_HEIGHT = 68;
const BANNER_HEIGHT = BANNER_LOGO_HEIGHT + (BANNER_VPADDING * 2) + Constants.statusBarHeight;


const AuthContainer = ({children}: PropsWithChildren) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return(
    <View style={styles.bg}>
      {/* Banner */}
      <View style={styles.banner}>
        <BackNavBtn style={styles.backBtn} isDark={true} />
        
        {/* Logo */}
        <Image
          source={CattleyticsLogo}
          style={styles.bannerLogo}
        />

        {/* FAQ button */}
        <Pressable 
          onPress={ 
              () => {
                // router.push("/")   replace with future faq page or function here
                alert("FAQ features are not implemented at this time.")
              }  
          }
          style={styles.faqBtnWrapper}
        >   
          {/* Nav arrow icon */}
          <View style={styles.faqIconWrapper}>
              <FAQIcon width="80%" height="80%" transform={[{rotateY: "180deg"}]} color={CLR_LIGHT} />
          </View>
        </Pressable>

      </View>

      {/* Form content */}
      <ScrollView 
        style={styles.formContainer}
        keyboardShouldPersistTaps="never"
      >
        {children}
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  bg: {
    height: "auto"
  },
  banner: {
    paddingHorizontal: 20,
    paddingTop: BANNER_VPADDING + Constants.statusBarHeight,
    paddingBottom: BANNER_VPADDING + BODY_OVERLAP,
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Colors["light"].primaryButton
  },
  bannerLogo: {
    width: 135,
    height: BANNER_LOGO_HEIGHT
  },
  formContainer: {
    flex: 1,
    backgroundColor: Colors["light"].background,
    marginTop: -BODY_OVERLAP,
    borderRadius: BODY_OVERLAP,
    width: "100%",
    minHeight: Dimensions.get("window").height - BANNER_HEIGHT,
    flexGrow: 0,
    paddingHorizontal: 20,
    paddingTop: 40,
    marginBottom: 100,
    boxShadow: "0px -1px 4px rgba(0, 0, 0, 0.10)"
  },
  backBtn: {
    width: 45,
    height: 45
  },
  faqBtnWrapper: {
      width: 45,
      height: 45,
      columnGap: 8,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 14,
      backgroundColor: "rgba(0, 0, 0, 0.18)"
  },
  faqIconWrapper: {
      width: "80%",
      height: "80%",
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
  },
});

export default AuthContainer;