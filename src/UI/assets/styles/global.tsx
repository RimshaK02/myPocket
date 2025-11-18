'use strict';
import { StyleSheet, Platform } from 'react-native';

// Get rid of this later, replace this system with David's theme.ts file
const CLR_DARK = "#3D3D3D";
const CLR_LIGHT = "#FFFFFF";
const CLR_BG = "#F5FCFF";
const CLR_PRIMARY = "#92A684";
const CLR_SECONDARY = "#6C8F9D";
const CLR_TERTIARY = "#465262";

// Global styles
export default StyleSheet.create({
    pageBG: {
        flex: 1,
        backgroundColor: CLR_BG,
        width: "100%", 
        height: "100%",
        alignContent: "center",
        paddingVertical: 60,
        paddingHorizontal: 25
    },
    txt: {
        fontFamily: "Poppins-Regular",
        wordWrap: 'break-word'
    },
    txtHeaderPage: {
        color: CLR_DARK, 
        fontFamily: "Poppins-SemiBold",
        fontSize: 25, 
        fontWeight: 600, 
        lineHeight: 27.50, 
    },
    txtPnlTitle: {
        color: CLR_DARK, 
        fontFamily: 'Poppins-Medium',
        fontSize: 14, 
        fontWeight: 500, 
    },
    txtPnlSubtitle: {
        color: CLR_DARK,
        fontFamily: 'Poppins-Light',
        fontSize: 8,
        fontStyle: 'normal',
        fontWeight: 300,
        letterSpacing: -0.16,
    },
    panel: {
        width: "100%",
        height: "auto",
        minHeight: 66,
        flexShrink: 0,
        backgroundColor: CLR_LIGHT,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 17,
        paddingRight: 7,
        paddingTop: 15,
        paddingBottom: 18,
    },
    button: {
        flexDirection: 'row',
        width: "90%",
        paddingTop: 9.5,
        paddingBottom: 9.5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        // backgroundColor: 'rgba(108, 143, 157, 1)',
        shadowColor: 'rgba(0, 0, 0, 0.3019607961177826)',
        shadowRadius: 2,
        shadowOffset: {
            "width": 0,
            "height": 1
        }
    },
    txtButton: {
        // color: 'rgba(255, 255, 255, 1)',
        // fontSize: 16,
        fontFamily: "Poppins-SemiBold",
        fontStyle: 'normal',
        fontWeight: '600',
        letterSpacing: -0.16,
    },
    switch: {
        transform: Platform.OS === 'ios' ? [
            { scaleX: 0.7 }, 
            { scaleY: 0.7 }
        ] : [
            { scaleX: 1.1 }, 
            { scaleY: 1.1 }
        ]
    }

});

export {
    CLR_BG, CLR_DARK, 
    CLR_LIGHT, CLR_PRIMARY, CLR_SECONDARY, 
    CLR_TERTIARY
}