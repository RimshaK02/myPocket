import React, { useState, useImperativeHandle, forwardRef } from "react";
import { StatusBar, View, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface DynamicStatusBarProps {
    yPosThreshold: number,
    [x: string]: any;  // whatever standard props react native statusbar usually has
}

export type DynamicStatusBarHandle = {
    updateYPos: (y: number) => void
    getYPos: () => number
}

const DynamicStatusBar = forwardRef<DynamicStatusBarHandle, DynamicStatusBarProps>(
    ({ yPosThreshold, ...otherProps }, yPosRef) => {
        const [yScrollPos, setYScrollPos] = useState(0);

        // Define and expose method attached to ref to parent, to update yScrollPos state in child.
        // Allows status bar to fetch and set constantly updated y scroll position from parent, by calling
        // this method updateYPos in parent
        useImperativeHandle(yPosRef, () => ({
            updateYPos(yPos: number) {
                // console.log(`Test: ${StatusBar.currentHeight}`)
                setYScrollPos(yPos);
            },
            getYPos() {
                return(yScrollPos);
            }
        }), []);

        return (
            <StatusBar 
                barStyle={yScrollPos < yPosThreshold ? "light-content" : "dark-content"}
                translucent
                backgroundColor={yScrollPos < yPosThreshold ? "white" : "black"}
                {...otherProps} 
            />
        )
    }
);


export default DynamicStatusBar;