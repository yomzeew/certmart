import { View, SafeAreaView, Text, ScrollView, TouchableOpacity } from "react-native";
import Header from "./header";
import { styles } from "../../../settings/layoutsetting";
import CoursesVerifyModal from "../../modals/courseverifyModal";
import Preloader from "../../preloadermodal/preloaderwhite";
import { Divider } from "react-native-paper";
import { colorred } from "../../../constant/color";
import { useState } from 'react';
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { CoursesRegModalParttwo } from "../../modals/coursesRegmodal";

const CourseReg = () => {
    const [showLoader, setShowLoader] = useState(false);
    const [datareg, setdatareg] = useState([2, 3, 4, 5]);
    const [selectedCourse, setSelectedCourse] = useState(null); // Store the index of the selected course

    const toggleModal = (index) => {
        if (selectedCourse === index) {
            setSelectedCourse(null); // Close the modal if the same course is clicked again
        } else {
            setSelectedCourse(index); // Open the modal for the selected course
        }
    };

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
                            Course Registration
                        </Text>
                        <Divider theme={{ colors: { primary: colorred } }} />
                    </View>
                    <View className="items-center flex-row mt-3 justify-center">
                        <View className="flex-row items-center">
                            <FontAwesome name="warning" size={16} color="red" />
                            <Text className="text-red-500 ml-2">Await Payment</Text>
                        </View>
                        <View className="bg-slate-200 w-1 h-8 ml-2 mr-2" />
                        <View className="flex-row items-center">
                            <FontAwesome name="check-circle" size={30} color="green" />
                            <Text className="text-red-500 ml-2">Payment</Text>
                        </View>
                    </View>
                    <ScrollView className="mt-10 px-3">
                        {datareg.map((item, index) => (
                            <View key={index} className="items-center w-full">
                                <View className="relative flex justify-center items-center h-28">
                                    <View className="absolute right-0 z-50 bg-slate-50 rounded-full top-0">
                                        <FontAwesome name="check-circle" size={30} color="green" />
                                    </View>
                                    <View className="rounded-full h-24 w-24 bg-red-300 absolute -left-5 z-50 flex justify-center items-center">
                                        <TouchableOpacity className="w-24 items-center">
                                            <FontAwesome5 name="file" size={30} />
                                            <Text className="text-xs text-center">View Course Outlined</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View className="rounded-2xl h-20 bg-red-200 w-5/6 flex-row justify-center items-center">
                                        <TouchableOpacity
                                            onPress={() => toggleModal(index)}
                                            className="px-3 w-56 items-center"
                                        >
                                            <Text style={{ fontSize: 16 }} className="font-semibold text-center">
                                                Introduction to Machine Learning & AI
                                            </Text>
                                            <View className="flex-row items-center justify-center mt-2">
                                                <FontAwesome5 name="user" size={16} />
                                                <Text className="text-xs ml-2">Adewale Femi</Text>
                                                <View className="ml-2 flex-row">
                                                    <Text className="mr-1">4.2</Text>
                                                    <FontAwesome name="star" size={14} color="orange" />
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {/* Conditionally render the modal only for the selected course */}
                                {selectedCourse === index && (
                                    <View className="w-full items-center">
                                        <CoursesRegModalParttwo />
                                    </View>
                                )}
                            </View>
                        ))}
                    </ScrollView>
                </SafeAreaView>
            </View>
        </>
    );
};

export default CourseReg;
