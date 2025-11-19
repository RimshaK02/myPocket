import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import { ReactNode, useState } from "react";
import BackNavBtn from "@/components/ui/BackNavBtn";
import { router } from "expo-router";

// Local module/constants imports
import { CLR_LIGHT } from "@/assets/styles/global";

// Local image imports
import FAQIcon from '@/assets/images/faq.svg';
import CattleyticsLogo from "@/assets/images/cattleytics_logo.png";

const LoginPage = () => {
  return(
    <View style={styles.bg}>
      {/* Banner */}
      <View style={[styles.banner]}>
        <BackNavBtn isDark={true} />
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
          <View style={styles.faqWrapper}>
              <FAQIcon width="80%" height="80%" transform={[{rotateY: "180deg"}]} color={CLR_LIGHT} />
          </View>
        </Pressable>
        <Image
          source={CattleyticsLogo}
          style={styles.bannerLogo}
        />
        <View style={styles.faqBtn}

        >

        </View>
      </View>

      {/* Form content */}
      <View style={styles.formContainer}>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bg: {

  },
  banner: {

  },
  bannerLogo: {

  },
  faqBtn: {

  },
  formContainer: {

  },
  faqBtnWrapper: {
      width: 40,
      height: 40,
      columnGap: 8,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 14,
      backgroundColor: "rgba(0, 0, 0, 0.18)"
  },
  faqWrapper: {
      width: "80%",
      height: "80%",
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
  },
});

export default LoginPage;