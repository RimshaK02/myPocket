// Allows import statements for SVGs using react-native-svg-transformer, as well as other stuff
declare module "*.svg" {
    import React from "react";
    import { SvgProps } from "react-native-svg";
    const content: React.FC<SvgProps>;
    export default content;
}

declare module "*.png" {
    const content: any;
    export default content;
}