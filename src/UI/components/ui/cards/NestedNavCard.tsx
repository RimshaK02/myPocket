// NestedNavCard.tsx: Component for panels to open submenus

// React/React Native imports
import { Text, View, StyleProp, ViewStyle,  Pressable, StyleSheet } from 'react-native';
import { ReactNode } from 'react';

// React navigation/expo router stuff
import { useNavigation } from '@react-navigation/native';

// Local imports
import GlobalStyles, { CLR_DARK } from "@/assets/styles/global";
import NavArrow from "@/assets/images/nav-arrow.svg";

interface NestedNavCardProps {
    style?: StyleProp<ViewStyle>,  // Optional extra styling components, if necessary
    submenuRef: string,            // String referencing name field of stack to direct to
    title: string,                 // Title text in panel
    subTitle?: string,             // Optional subtitle text in panel
    icon?: ReactNode,              // SVG or PNG image, pass as React component in tags
    pos?: string                    // top, middle, bottom, single; influences corner radius
};

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
    arrowWrapper: {
        width: "auto",
        height: "auto",
        justifyContent: "center",
        alignContent: "center",
    },
    img: {
        justifyContent: "center",
        alignContent: "center"
    },
    panel:{
        paddingRight: 15,
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
const NestedNavCard = ({style, submenuRef, title, subTitle, icon, pos="single"}: NestedNavCardProps) => {
    const nav = useNavigation();

    const posMapping: IPosMapping = {
        "top": styles.panelTop,
        "middle": [{}],
        "bottom": styles.panelBottom,
        "single": [styles.panelBottom, styles.panelTop],
    }

    return(
        <Pressable 
            onPress={  // Have to double check later WHY the heck .navigate() is a 'never' type... it should accept strings
                () => {nav.navigate(submenuRef)}  
            }
            style={[
                GlobalStyles.panel,
                styles.panel,
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


            {/* Sideways nav arrow */}
            <View style={styles.arrowWrapper}>
                <NavArrow width={30} height={30} fill={CLR_DARK} />
            </View>
        </Pressable>
    )
}

export default NestedNavCard; 