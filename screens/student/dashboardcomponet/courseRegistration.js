import { View, SafeAreaView, Text, ScrollView, RefreshControl } from "react-native";
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

const CourseReg = () => {
   
    const [showLoader, setShowLoader] = useState(false);
    
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
                    <ScrollView className="mt-10 px-3"
                    
                    >
                        
                       
                    </ScrollView>
                </SafeAreaView>
            </View>
        </>
    );
};
export default CourseReg;
