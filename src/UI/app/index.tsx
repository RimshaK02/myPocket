import { StyleSheet, View, Text, Image, Pressable, Platform } from "react-native";
import { ReactNode, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/theme";

import CattleyticsLogo from "@/assets/images/cattleytics_logo.png";
import { router } from "expo-router";


const SplashPage = () => {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{
                backgroundColor: "#92A684",
                height: "100%",
                width: "100%",
                paddingHorizontal: 30,
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center"
            }}>
                <View style={{
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10,
                }}>
                    <Image
                        source={CattleyticsLogo}
                        style={{
                            width: 243,
                            height: 122
                        }}
                    />
                    <Text
                        style={{
                            fontSize: 21,
                            fontFamily: "Poppins",
                            color: "#FFFFFF",
                            textAlign: "center",
                            fontWeight: 300,
                            width: 300,
                            flexWrap: 'wrap',
                        }}
                    >
                        Some sort of description here, lorem ipsem
                    </Text>
                </View>

                <View style={{
                    gap: 22, 
                    width: "100%", 
                    position: "absolute",
                    bottom: 56,
                }}>
                    <Pressable 
                        style={[styles.btn, {backgroundColor: "#6C8F9D"}]}
                        onPress={() => router.push('/(auth)/login')}
                    >
                        <Text style={styles.btnText}>Sign in</Text>
                    </Pressable>
                    <Pressable 
                        style={[styles.btn, {backgroundColor: "#405264"}]}
                        onPress={() => router.push('/(auth)/register')}
                    >
                        <Text style={styles.btnText}>Create an Account</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
  btn: {
    width: "100%",
    height: "auto",
    minHeight: 44,
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.30)",
    borderRadius: 10,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  btnText: {
    fontSize: 18,
    fontFamily: "Poppins",
    color: Colors['light'].textLight,
    fontWeight: Platform.OS === 'ios' ? 600 : 700,
    letterSpacing: -0.14
  },
});

export default SplashPage;