import { View, SafeAreaView, Text, ScrollView } from "react-native";
import Header from "./header";
import { styles } from "../../../settings/layoutsetting";
import CoursesVerifyModal from "../../modals/courseverifyModal";
import Preloader from "../../preloadermodal/preloaderwhite";
import { getCourseStatus } from "../../../settings/endpoint";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Divider } from "react-native-paper";
import { colorred } from "../../../constant/color";
import { useState, useEffect } from 'react';
import axios from "axios";

const ApplicationCheckers = () => {
    const [coursesData, setCoursesData] = useState([]);
    const [showLoader, setShowLoader] = useState(false);
    const fetchData = async () => {
        try {
            setShowLoader(true);
            const token = await AsyncStorage.getItem("token");
            const studentId = await AsyncStorage.getItem("studentid");
            const response = await axios.get(`${getCourseStatus}?studentid=${studentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);
            setCoursesData(response.data);
        } catch (error) {
            if (error.response) {
                // Server responded with a status other than 2xx
                console.error("Error response:", error.response.data);
                console.log(error.response.data.error);
                console.error("Error status:", error.response.status);
                console.error("Error headers:", error.response.headers);
            } else if (error.request) {
                // Request was made but no response received
                console.error("Error request:", error.request);
            } else {
                // Something else happened while setting up the request
                console.error("Error message:", error.message);
            }
        } finally {
            setShowLoader(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <>
            {showLoader && (
                <View className="z-50 absolute h-full w-full">
                    <Preloader />
                </View>
            )}
            <View className="w-full h-full">
                <SafeAreaView
                    style={[styles.andriod, styles.bgcolor]}
                    className="flex flex-1 w-full"
                >
                    <Header />
                    <View className="px-5">
                        <Text style={{ fontSize: 20, color: colorred }} className="font-semibold">
                            Course Verification
                        </Text>
                        <Divider theme={{ colors: { primary: colorred } }} />
                    </View>
                    <ScrollView className="mt-10 px-3">
                        {coursesData?.map((row, index) => (
                            <CoursesVerifyModal
                                key={index}
                                data={row}
                            />
                        ))}
                        {!!(coursesData.length == 0) && (
                            <View>
                                <Text style={{ color: colorred }}>
                                    There are no courses available
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                </SafeAreaView>
            </View>
        </>
    );
};
export default ApplicationCheckers;
