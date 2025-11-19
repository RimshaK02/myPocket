// BtnCard.tsx: Component for cards to open submenus

// React/React Native imports
import { Text, View, StyleProp, ViewStyle,  Pressable, StyleSheet } from 'react-native';
import { ReactNode } from 'react';

// React navigation/expo router stuff
import { useNavigation } from '@react-navigation/native';

// Local imports
import GlobalStyles, { CLR_DARK } from "@/assets/styles/global";
import NavArrow from "@/assets/images/nav-arrow.svg";

interface BtnCardProps {
    style?: StyleProp<ViewStyle>,  // Optional extra styling components, if necessary
    title: string,                 // Title text in card
    subTitle?: string,             // Optional subtitle text in card
    icon?: ReactNode,              // SVG or PNG image, pass as React component in tags
    pos?: string,                   // top, middle, bottom, single; influences corner radius
    onPress: () => any             // Function called when button is pressed
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
        gap: 3
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
    card:{
        paddingRight: 15,
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
const BtnCard = ({style, title, subTitle, icon, pos="single", onPress}: BtnCardProps) => {
    const nav = useNavigation();

    const posMapping: IPosMapping = {
        "top": styles.cardTop,
        "middle": [{}],
        "bottom": styles.cardBottom,
        "single": [styles.cardBottom, styles.cardTop],
    }

    return(
        <Pressable 
            style={[
                GlobalStyles.card,
                styles.card,
                posMapping[pos],
                style,
            ]}
            onPress={onPress}
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
        </Pressable>
    )
}

export default BtnCard; 
