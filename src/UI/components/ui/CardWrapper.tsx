// CardWrapper.tsx: Wrapper for "Card"-type components (i.e. NestedNavCard, SwitchCard)

// React/React Native imports
import { Text, View, StyleProp, ViewStyle,  Pressable, StyleSheet } from 'react-native';
import React, { ReactNode, ReactElement, useRef } from 'react';
import { SvgProps } from "react-native-svg";

// React navigation/expo router stuff
import { createStaticNavigation, useNavigation, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Local imports
import GlobalStyles, { CLR_DARK, CLR_LIGHT, CLR_SECONDARY } from "@/assets/styles/global";
import NavArrow from "@/assets/images/nav-arrow.svg";

interface CardWrapperProps {
    style?: StyleProp<ViewStyle>,
    header?: string
};

// Required to nest NestedNavBtn inside a Stack.Navigator tag somewhere
const CardWrapper = ({children, style, header}: React.PropsWithChildren<CardWrapperProps>) => {

    const contentList: Array<React.ReactNode> = [];
    const listLen: number = React.Children.count(children);

    // Iterate through each panel/child and: 
    //   - Add separator between each panel, if more than one
    //   - Customize border radius styling based on child position/index, using childPos
    React.Children.forEach(children, (child, index) => {
        // Mainly type checking stuff (...ironically raising type-checking errors);
        // if 
        if (React.isValidElement(child)) {
            const childPos = (listLen - 1 === 0) ? "single" : (
                (index === 0) ? "top" : (
                    (index === listLen - 1) ? "bottom" : "middle"
                ) 
            );

            contentList.push(
                React.cloneElement(child, {
                    pos: childPos,                    
                    key: `child-${index}`
                })
            );
        } else {
            contentList.push(child)
        }

        if (index < listLen - 1) {
            contentList.push(
                <View
                    key={`divider-${index}`}
                    style={styles.divider}
                />
            ) 
        }
    });

    return(
        <View style={[styles.container, style]}>
            {(typeof header !== 'undefined') &&
                <View style={styles.headerWrapper}>
                    <Text style={[GlobalStyles.txt, styles.header]}>   
                        {header}
                    </Text>
                </View>
            }
            <View style={styles.contentWrapper}>
                {contentList}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        gap: 7,
        justifyContent: "center",
        alignContent: "center",
    },
    headerWrapper: {
        width: "100%",
        height: "auto",
        paddingLeft: 16.5
    },
    header: {
        fontSize: 13,
        color: CLR_DARK,
        fontWeight: 400,
        letterSpacing: -0.4
    },
    contentWrapper: {
        width: "100%",
        height: "auto",
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: CLR_SECONDARY,
        backgroundColor: "#FFFFFF"
    },
    divider: {
        width: "auto",
        height: 0,
        borderWidth: 0.75,
        borderColor: "#D9D9D9",
        marginLeft: 10,
        marginRight: 10
    }
});

export default CardWrapper; 
