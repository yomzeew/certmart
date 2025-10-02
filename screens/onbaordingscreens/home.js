import { StatusBar } from "expo-status-bar";
import { View, Image } from "react-native";
import { styles } from "../../settings/layoutsetting";
import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";

const Home = ({ navigation }) => {
    const isFocused = useIsFocused();

    const navigateToSlider = () => {
        navigation.navigate("slider");
    };

    useEffect(() => {
        if (isFocused) {
            const timeoutId = setTimeout(() => {
                navigateToSlider();
            }, 3000);

            return () => clearTimeout(timeoutId); // Cleanup timeout on unmount or focus change
        }
    }, [isFocused]); // Dependency array ensures effect runs only when `isFocused` changes

    return (
        <View
            style={[styles.bgcolor]}
            className="flex-1 w-full justify-center items-center flex"
        >
            {/* Background Overlay */}
            <View className="absolute h-full w-full bg-slate-100 opacity-80" />

            {/* Status Bar */}
            <StatusBar style="dark" />

            {/* Logo */}
            <Image
                source={require("../../assets/cm.png")}
                className="h-12 w-32"
                resizeMode="contain"
            />
        </View>
    );
};

export default Home;
