// SwitchCard.tsx: Component for cards with toggle switches on them. You can pass one or two functions through props to 
// be run everytime the switch is toggled on or off.

// React/React Native imports
import { Text, View, StyleProp, ViewStyle, TextStyle, Pressable, StyleSheet, Switch } from 'react-native';
import React, { ReactNode, useState } from 'react';

// Local imports
import GlobalStyles, { CLR_DARK, CLR_SECONDARY, CLR_LIGHT } from "@/assets/styles/global";

// Structure + types of props passed into card with switch
interface SwitchCardProps {
    cardStyle?: StyleProp<ViewStyle>,  // Optional extra styling components, if necessary
    titleStyle?: StyleProp<TextStyle>,  // Optional extra styling components, if necessary
    subtitleStyle?: StyleProp<TextStyle>,  // Optional extra styling components, if necessary
    title: string,                 // Title text in card
    subtitle?: string,             // Optional subtitle text in card
    icon?: ReactNode,              // SVG or PNG image, pass as React component in tags
    pos?: string,                   // top, middle, bottom, single; influences corner radius
    onFunc: () => any,             // Function called when switch is toggled on
    offFunc: () => any             // Function called when switch is toggled off
};

// For creating a "dictionary" mapping of string to stylesheet values, 
// maps styles based on given card order
interface IPosMapping {
    [id: string] : StyleProp<ViewStyle>
}

const styles = StyleSheet.create({
    contentWrapper: {
        width: "auto",
        height: "100%",
        columnGap: 8,
        flexDirection: "row",
    },
    textWrapper: {
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        gap: 3,
        width: "80%"
    },
    switchWrapper: {
        width: "auto",
        height: "auto",
        justifyContent: "center",
        alignContent: "center",
    },
    // switch: {
    //     position: "absolute",   
    //     right: "5%",
    // },
    img: {
        justifyContent: "center",
        alignContent: "center"
    },
    cardTop: {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    cardBottom: {
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8
    }
});

// Required to nest NestedNavBtn inside a Stack.Navigator tag somewhere
const SwitchCard = ({cardStyle, titleStyle, subtitleStyle, title, subtitle, icon, pos="single", onFunc, offFunc}: SwitchCardProps) => {
    // Switch constants
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => {
        isEnabled ? offFunc() : onFunc()
        setIsEnabled(!isEnabled);
    };

    const posMapping: IPosMapping = {
        "top": styles.cardTop,
        "middle": [{}],
        "bottom": styles.cardBottom,
        "single": [styles.cardBottom, styles.cardTop],
    }

    return(
        <View 
            style={[
                GlobalStyles.card,
                posMapping[pos],
                cardStyle,
            ]}
        >   
            <View style={styles.contentWrapper}>
                {/* Optional icon, if icon is passed through props */}
                {(typeof icon !== 'undefined') &&
                    <View style={styles.img}>   
                        {icon}
                    </View>
                }

                {/* Text wrapper */}
                <View style={styles.textWrapper}>
                    <Text style={[GlobalStyles.txtPnlTitle, titleStyle]}>
                        {title}
                    </Text>
                    {/* Optional subtitle, if it is passed through props */}
                    {(typeof subtitle !== 'undefined') &&
                        <Text style={[GlobalStyles.txtPnlSubtitle, subtitleStyle]}>
                            {subtitle}
                        </Text>
                    }
                </View>
            </View>


            {/* Switch */}
            <View style={styles.switchWrapper}>
                <Switch 
                    style={GlobalStyles.switchCard}
                    trackColor={{
                        false: "#9A9A9A",
                        true: "#6C8F9D"
                    }}            
                    thumbColor={CLR_LIGHT}
                    ios_backgroundColor="#EAEAEA"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
            </View>
        </View>
    )
}

export default SwitchCard; 