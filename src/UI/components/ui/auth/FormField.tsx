import { StyleSheet, View, Text, Image, StyleProp, ViewStyle, TextInput, KeyboardTypeOptions } from "react-native";
import { ReactNode, useState, useEffect } from "react";
import { router } from "expo-router";
import Constants from "expo-constants";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

// Local module/constants imports
import BackNavBtn from "@/components/ui/BackNavBtn";
import AuthContainer from "@/components/ui/auth/AuthContainer";
import { CLR_LIGHT } from "@/assets/styles/global";
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface FormFieldProps {
    style?: StyleProp<ViewStyle>, 
    title: string,
    placeholder: string,
    setDataVar: React.Dispatch<React.SetStateAction<string>>,
    fieldType?: string
}

interface IFieldMapping {
    [id: string] : {
        keyboardType: KeyboardTypeOptions | undefined, 
        textContentType: string | any | undefined   // Yeah, i know this isn't great, but i'm not creating a string type alias specifically for 40+ strings
    }
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)

const FormField = ({style, title, placeholder, setDataVar, fieldType="default"}: FormFieldProps) => {
    // Animation-related variables
    const [isFocused, setIsFocused] = useState(false);
    const titleColor = useSharedValue(isFocused ? '#86AEBD' : '#9A9A9A');
    const fieldColor = useSharedValue(isFocused ? '#86AEBD' : '#CFCFCF');

    useEffect(() => {
        titleColor.value = withTiming(isFocused ? '#86AEBD' : '#9A9A9A', { duration: 100 });
        fieldColor.value = withTiming(isFocused ? '#86AEBD' : '#CFCFCF', { duration: 100 });
    }, [isFocused]);

    const animatedTextStyle = useAnimatedStyle(() => {
        return {
            color: titleColor.value
        };
    });

    const animatedFieldStyle = useAnimatedStyle(() => {
        return {
            borderColor: fieldColor.value
        };
    });

    // Mappings for field properties
    const fieldMapping: IFieldMapping = {
        "name": {
            keyboardType: "default",
            textContentType: "name"
        },
        "email": {
            keyboardType: "email-address",
            textContentType: "emailAddress"
        },
        "password": {
            keyboardType: "default",
            textContentType: "password"
        },
        "default": {
            keyboardType: "default",
            textContentType: "none"
        },

    }


    return (
        <View>
            <View style={styles.titleWrapper}>
                <Animated.Text style={[
                    styles.title,
                    animatedTextStyle
                ]}>
                    {title}
                </Animated.Text>
            </View>
            <View>
                <AnimatedTextInput
                    style={[
                        styles.input,
                        animatedFieldStyle
                    ]}
                    editable
                    placeholder={placeholder}
                    placeholderTextColor="#9A9A9A"
                    secureTextEntry={fieldType === "password"}
                    onFocus={() => {setIsFocused(true)}}
                    onChangeText={(newText) => {setDataVar(newText)}}
                    onEndEditing={() => {setIsFocused(false)}}

                    keyboardType={
                        fieldMapping[fieldType]?.keyboardType ?? fieldMapping["default"].keyboardType
                    }
                    textContentType={
                        fieldMapping[fieldType]?.textContentType ?? fieldMapping["default"].textContentType
                    }
                />
                <></>
            </View>

        </View>
    )

}

const styles = StyleSheet.create({

    input: {
        // Input container styling
        flexDirection: 'row',
        width: "100%",
        height: 50,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
        flexShrink: 0,
        borderRadius: 10,
        borderWidth: 1.5,
        borderStyle: 'solid',
        borderColor: '#CFCFCF',

        // Font styling
        color: "#3D3D3D",
        fontFamily: 'Poppins',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '300',
        letterSpacing: -0.14,        
    },
    titleWrapper: {
        position: 'absolute',
        zIndex: 20,
        paddingHorizontal: 4,
        alignItems: 'center',
        left: 12,
        top: -7.5,
        backgroundColor: Colors['light'].background,
    },
    title: {
        color: '#9A9A9A',
        fontFamily: 'Poppins',
        fontSize: 11.5,
        fontStyle: 'normal',
        fontWeight: '500',
        textAlign: "left"
    }
})

export default FormField;