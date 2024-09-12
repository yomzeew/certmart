import { Text, View, TouchableOpacity } from "react-native";
import {
    FontAwesome5,
    FontAwesome,
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import { colorred, lightred } from "../../../constant/color";
import { useState, useEffect } from 'react';
import { styles } from "../../../settings/layoutsetting";
import { useNavigation } from "@react-navigation/native";
const Footer = ({ currentPage }) => {
    const navigation = useNavigation();
    const [active, setActive] = useState("home"); // home, calendar, chats, profile
    useEffect(() => {
        setActive(currentPage);
    }, [currentPage, active])
    const handlePressHome = (route, itemName) => {
        setActive(itemName);
        navigation.navigate(route);
    };
    const getItemStyle = (itemName) => {
        return active === itemName
            ? { backgroundColor: colorred, color: "white" }
            : { backgroundColor: lightred, color: "black" };
    };

    return (
        <>
            <View className="px-5 py-2 bg-white flex flex-row justify-evenly">
                <TouchableOpacity
                    onPress={() => handlePressHome("dashboardstudent", "home")}
                    style={[getItemStyle("home"), styles.item]}
                    className="w-20 h-12 flex justify-center items-center rounded-xl"
                >
                    <FontAwesome5
                        size={20}
                        name="home"
                        color={active === "home" ? "white" : "black"}
                    />
                    <Text
                        style={[getItemStyle("home"), styles.item]}
                    >Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handlePressHome("calendar", "calendar")}
                    style={[getItemStyle("calendar"), styles.item]}
                    className="w-20 h-12 flex justify-center items-center  rounded-xl"
                >
                    <FontAwesome
                        size={20}
                        name="calendar"
                        color={active === "calendar" ? "white" : "black"}
                    />
                    <Text
                        style={[getItemStyle("calendar"), styles.item]}
                    >Calendar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handlePressHome("chats", "chats")}
                    style={[getItemStyle("chats"), styles.item]}
                    className="w-20 h-12 flex justify-center items-center  rounded-xl"
                >
                    <Ionicons
                        name="chatbubble-sharp"
                        size={24}
                        color={active === "chats" ? "white" : "black"}
                    />
                    <Text
                        style={[getItemStyle("chats"), styles.item]}
                    >Chats</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handlePressHome("profile", "profile")}
                    style={[getItemStyle("profile"), styles.item]}
                    className="w-20 h-12 flex justify-center items-center  rounded-xl"
                >
                    <MaterialCommunityIcons
                        name="face-man-profile"
                        size={24}
                        color={active === "profile" ? "white" : "black"}
                    />
                    <Text
                        style={[getItemStyle("profile"), styles.item]}
                    >Profile</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};
export default Footer;
