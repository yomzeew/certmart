import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { bluecolor, colorred, greencolor } from "../../constant/color";

const PLATFORM_OPTIONS = [
    { name: "Student", icon: "user-graduate", color: colorred, platform: "student" },
    { name: "Trainer", icon: "user", color: greencolor, platform: "trainer" },
    { name: "Study Center", icon: "building-columns", color: bluecolor, platform: "study-center" },
];

const PlatformCard = ({ name, icon, color, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        style={[styles.card, { backgroundColor: `${color}20` }]} // Light background color
    >
        <FontAwesome5 name={icon} size={60} color={color} />
        <Text style={styles.cardText}>{name}</Text>
    </TouchableOpacity>
);

const ChoosePlatform = () => {
    const navigation = useNavigation();

    const handleNavigate = (platform) => () => {
        navigation.navigate("welcome", { platform });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Choose your platform</Text>
            </View>
            <View style={styles.platformContainer}>
                {PLATFORM_OPTIONS.map((option) => (
                    <PlatformCard
                        key={option.platform}
                        name={option.name}
                        icon={option.icon}
                        color={option.color}
                        onPress={handleNavigate(option.platform)}
                    />
                ))}
            </View>
        </SafeAreaView>
    );
};

export default ChoosePlatform;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f1f5f9", // Tailwind's slate-100 equivalent
        width: "100%",
    },
    header: {
        backgroundColor: colorred,
        width: "70%",
        alignItems: "center",
        paddingVertical: 10,
        borderRadius: 10,
        marginBottom: 20,
    },
    headerText: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "bold",
    },
    platformContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    card: {
        width: 120,
        height: 120,
        alignItems: "center",
        justifyContent: "center",
        margin: 10,
        borderRadius: 10,
    },
    cardText: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 10,
        textAlign: "center",
    },
});