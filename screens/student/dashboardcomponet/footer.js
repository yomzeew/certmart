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
const Footer = () => {
    const navigation = useNavigation();
    const [active, setActive] = useState("dashboardstudent"); // home, calendar, chats, profile
    
    const handlePressHome = (route, itemName) => {
        console.log(route)
        setActive(itemName);
        navigation.navigate('bottomnav', { screen: route })
    };
    const getItemStyle = (itemName) => {
        return active === itemName
            ? { backgroundColor: colorred, color: "white" }
            : { backgroundColor: lightred, color: "black" };
    };

    return (
        <>
            <View className=" py-2 bg-white  items-center w-full flex-row justify-evenly">
                <TouchableOpacity
                    onPress={() => handlePressHome("dashboardstudent", "dashboardstudent")}
                    style={[getItemStyle("dashboardstudent"), styles.item]}
                    className="w-20 h-12 flex justify-center items-center rounded-xl"
                >
                    <FontAwesome5
                        size={20}
                        name="home"
                        color={active === "home" ? "white" : "black"}
                    />
                    <Text
                        style={[getItemStyle("dashboardstudent"), styles.item]}
                    >Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handlePressHome("classes", "classes")}
                    style={[getItemStyle("classes"), styles.item]}
                    className="w-20 h-12 flex justify-center items-center  rounded-xl"
                >
                    <FontAwesome
                        size={20}
                        name="calendar"
                        color={active === "classes" ? "white" : "black"}
                    />
                    <Text
                        style={[getItemStyle("classes"), styles.item]}
                    >Classes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handlePressHome("issues", "issues")}
                    style={[getItemStyle("issues"), styles.item]}
                    className="w-20 h-12 flex justify-center items-center  rounded-xl"
                >
                    <Ionicons
                        name="chatbubble-sharp"
                        size={24}
                        color={active === "issues" ? "white" : "black"}
                    />
                    <Text
                        style={[getItemStyle("issues"), styles.item]}
                    >Issues</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handlePressHome("studentprofile", "studentprofile")}
                    style={[getItemStyle("studentprofile"), styles.item]}
                    className="w-20 h-12 flex justify-center items-center  rounded-xl"
                >
                    <MaterialCommunityIcons
                        name="face-man-profile"
                        size={24}
                        color={active === "studentprofile" ? "white" : "black"}
                    />
                    <Text
                        style={[getItemStyle("studentprofile"), styles.item]}
                    >Profile</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};
export default Footer;
