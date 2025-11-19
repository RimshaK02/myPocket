import { StyleSheet, View, Text, Image } from "react-native";
import { ReactNode, useState } from "react";
import BackNavBtn from "@/components/ui/BackNavBtn";
import { router } from "expo-router";

import CattleyticsLogo from "@/assets/images/cattleytics_logo.png";

const RegisterPage = () => {
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
});

export default RegisterPage;