// SwitchCard.tsx: Component for panels with toggle switches on them. You can pass one or two functions through props to 
// be run everytime the switch is toggled on or off.

// React/React Native imports
import { Text, View, StyleProp, ViewStyle,  Pressable, StyleSheet, Switch } from 'react-native';
import React, { ReactNode, useState } from 'react';

// Local imports
import GlobalStyles, { CLR_DARK, CLR_SECONDARY, CLR_LIGHT } from "@/assets/styles/global";

// Structure + types of props passed into card with switch
interface SwitchCardProps {
    style?: StyleProp<ViewStyle>,  // Optional extra styling components, if necessary
    title: string,                 // Title text in panel
    subTitle?: string,             // Optional subtitle text in panel
    icon?: ReactNode,              // SVG or PNG image, pass as React component in tags
    pos: string,                   // top, middle, bottom, single; influences corner radius
    onFunc: () => any,             // Function called when switch is toggled on
    offFunc: () => any             // Function called when switch is toggled off
};

// For creating a "dictionary" mapping of string to stylesheet values, 
// maps styles based on given panel order
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
    },
    switchWrapper: {
        width: "auto",
        height: "auto",
        justifyContent: "center",
        alignContent: "center",
    },
    img: {
        justifyContent: "center",
        alignContent: "center"
    },
    panelTop: {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    panelBottom: {
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8
    }
});

// Required to nest NestedNavBtn inside a Stack.Navigator tag somewhere
const SwitchCard = ({style, title, subTitle, icon, pos, onFunc, offFunc}: SwitchCardProps) => {
    // Switch constants
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => {
        isEnabled ? offFunc() : onFunc()
        setIsEnabled(!isEnabled);
    };

    const posMapping: IPosMapping = {
        "top": styles.panelTop,
        "middle": [{}],
        "bottom": styles.panelBottom,
        "single": [styles.panelBottom, styles.panelTop],
    }

    return(
        <View 
            style={[
                GlobalStyles.panel,
                posMapping[pos],
                style,
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
                    <Text style={GlobalStyles.txtPnlTitle}>
                        {title}
                    </Text>
                    {/* Optional subtitle, if it is passed through props */}
                    {(typeof subTitle !== 'undefined') &&
                        <Text style={GlobalStyles.txtPnlSubtitle}>
                            {subTitle}
                        </Text>
                    }
                </View>
            </View>


            {/* Switch */}
            <View style={styles.switchWrapper}>
                <Switch 
                    style={GlobalStyles.switch}
                    trackColor={{
                        false: "#9A9A9A",
                        true: CLR_SECONDARY
                    }}
                    thumbColor={CLR_LIGHT}
                    ios_backgroundColor="#9A9A9A"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
            </View>
        </View>
    )
}

export default SwitchCard; 