import { grommet } from "grommet";
import { deepMerge } from "grommet/utils";

const theme = deepMerge(grommet, {
    global: {
        colors: {
            brand: '#34344E',
            "accent-1": {
                dark: "#80FFDB",
                light: "#FFFFFF"
            },
            "background-back": {
                dark: "linear-gradient(180deg, #3E436B 0%, #24263D 100%)",
                light: "#EFEFEF"
            },
            "background-front": {
                dark: "#24263D",
                light: "#FFFFFF"
            },
            "background-contrast": {
                dark: "#FFFFFF08",
                light: "#11111108"
            },
            "background-custom": {
                dark: "#0E5265",
                light: "#00C8FF"
            },
            "background-sidebar": {
                dark: "#22252B",
                light: "#00C8FF"
            },
            "active-sidebar": {
                dark: '#1C1E24',
                light: "#00C8FF"
            }
        },
        font: {
            family: 'Poppins',
            size: '18px',
            height: '20px',
        },
    },
    box: {
        border: {
            radius: '13px'
        }
    }
});

console.log({ theme })
console.log({ grommet })

export default theme