// BackNavBtn.tsx: Simple nav button to return to previous page

// React/React Native imports
import { View, StyleProp, ViewStyle,  Pressable, StyleSheet, DimensionValue } from 'react-native';

// React navigation/expo router stuff
import { useNavigation } from '@react-navigation/native';

// Local imports
import { CLR_DARK, CLR_LIGHT } from "@/assets/styles/global";
import NavArrow from "@/assets/images/nav-arrow.svg";

interface BackNavBtnProps {
    style?: StyleProp<ViewStyle>,  // Optional extra styling components, if necessary
    isDark?: boolean
};

// Unused
const dimValToNumber = (dimVal: DimensionValue, refDim?: number) => {
    if (typeof dimVal === 'number') {
        return dimVal; 
    }

    if (typeof dimVal === 'string' && dimVal.endsWith('%')) {
        if (refDim) {
            const percent = parseFloat(dimVal);

            if (!isNaN(percent)) {
                return (percent / 100) * refDim;
            }
            throw new Error("Invalid string format; 'dimVal' must be a percentage")
        }
        throw new Error("Parameter 'dimVal' was given as a string, but no argument passed for parameter 'refDim'");
    }
};

// Required to nest NestedNavBtn inside a Stack.Navigator tag somewhere
const BackNavBtn = ({style, isDark=false}: BackNavBtnProps) => {
    const nav = useNavigation();
    
    return(
        <Pressable 
            onPress={  // Have to double check later WHY the heck .navigate() is a 'never' type... it should accept strings
                () => {nav.goBack()}  
            }
            style={[
                styles.btnWrapper,
                style,
                (isDark && styles.darkBtn)
            ]}
        >   
            {/* Nav arrow icon */}
            <View style={styles.arrowWrapper}>
                <NavArrow width="100%" height="100%" transform={[{rotateY: "180deg"}]} fill={isDark ? CLR_LIGHT : CLR_DARK} />
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    btnWrapper: {
        width: 40,
        height: 40,
        columnGap: 8,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#DFDFDF",
        borderRadius: 14
    },
    arrowWrapper: {
        width: "80%",
        height: "80%",
        justifyContent: "center",
        alignContent: "center",
    },
    darkBtn: {
        backgroundColor: "rgba(0, 0, 0, 0.18)"
    }
});

export default BackNavBtn; 
