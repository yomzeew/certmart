import { StyleSheet, Platform } from "react-native";
import { colorwhite } from "../constant/color";
export const styles = StyleSheet.create({
    bgcolor: {
        backgroundColor: colorwhite,
        color: "black",
    },
    andriod: {
        paddingTop: Platform.OS === "android" ? 20 : 0,
    },
});
