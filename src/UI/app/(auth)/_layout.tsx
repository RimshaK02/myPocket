import { Tabs, router, Stack } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, Platform } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';



const AuthLayout = () => {
    return(
        <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />            
            <Stack.Screen name="register" options={{ headerShown: false }} />
        </Stack>
    );
};

export default AuthLayout;