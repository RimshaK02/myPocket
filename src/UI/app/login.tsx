import { StyleSheet, View, Text, Image } from "react-native";
import { ReactNode, useState } from "react";
import BackNavBtn from "@/components/ui/BackNavBtn";
import { router } from "expo-router";

import CattleyticsLogo from "@/assets/images/cattleytics_logo.png";

const LoginPage = () => {
  return(
    <View style={styles.bg}>
      {/* Banner */}
      <View style={[styles.banner]}>
        <BackNavBtn isDark={true} />
        <Image
          source={CattleyticsLogo}
          style={styles.bannerLogo}
        />
        <View style={styles.faqBtn}
        >
        </View>
      </View>

      {/* Form content */}
      <View style={styles.contentContainer}>
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
});

export default LoginPage;