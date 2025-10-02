
import {
    Dimensions,
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    ScrollView,
    Platform
} from "react-native";
import { styles } from "../../../settings/layoutsetting";
import { StatusBar } from "expo-status-bar";
import { colorred } from "../../../constant/color";
import { Divider } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Preloader from "../../preloadermodal/preloaderwhite";
import PaymentScreenModal from "./dashboard/paymentScreen";
import { allavailablecourse } from "../../../settings/endpoint";
import { CourseItem } from "../../modals/courseCardnew";
import { FontAwesome } from "@expo/vector-icons";

const AllCoursedetail = () => {
    const { height } = Dimensions.get("window");
    const [showpayment, setshowpayment] = useState(false);
    const [selected, setSelected] = useState("");
    const [showsuccess, setshowsuccess] = useState(false);
    const route = useRoute();
    const navigation = useNavigation();
    const { course } = route.params;
    const [data, setdata] = useState([]);
    const [showpreloader, setshowpreloader] = useState(false);

    // 🔹 active tab state
    const [activeClassType, setActiveClassType] = useState("All");

    const fetchdata = async () => {
        try {
            setshowpreloader(true);
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(`${allavailablecourse}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const filteredCourses = response.data.filter(
                (item) => item.course === course
            );

            // ✅ Remove duplicates
            const uniqueCourses = filteredCourses.filter(
                (item, index, self) =>
                    index === self.findIndex((c) =>
                        c.id
                            ? c.id === item.id
                            : (
                                c.course === item.course &&
                                c.tfirstname === item.tfirstname &&
                                c.tsurname === item.tsurname &&
                                c.classType === item.classType &&
                                c.duration === item.duration &&
                                c.cost === item.cost &&
                                c.details === item.details
                            )
                    )
            );

            setdata(uniqueCourses);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setshowpreloader(false);
        }
    };

    useEffect(() => {
        fetchdata();
    }, [course]);

    const handlegoback = () => {
        navigation.goBack();
    };

    // 🔹 fixed classType tabs
    const classTypes = ["All", "Virtual", "Physical", "Exam"];

    // 🔹 filter based on tab
    const filteredData =
        activeClassType === "All"
            ? data
            : data.filter(item => item.classType === activeClassType);

    return (
        <>
            {showpayment && (
                <PaymentScreenModal
                    selected={selected}
                    setshowpayment={setshowpayment}
                    setShowLoader={setshowpreloader}
                    setshowsuccess={setshowsuccess}
                />
            )}
                   {showpreloader && (
                    <View className="z-50 absolute h-full w-full">
                        <Preloader />
                    </View>
                )}
                   <SafeAreaView style={[styles.andriod,styles.bgcolor, { flex: 1, width: '100%'}]}>
                  <View className="w-full pt-[20px] ">
                    <View className=" w-full flex-row gap-x-2 items-center">
                        <TouchableOpacity
                            onPress={handlegoback}
                            className={`p-3 rounded-2xl item-center`}
                        >
                            <FontAwesome name="arrow-left" size={12} color={colorred} />
                            
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontWeight: '600',color:colorred }}>{course}</Text>
                    </View>
                    <Divider style={{marginVertical:10,backgroundColor:colorred}}/>
                    </View>

                        {/* 🔹 Tabs for ClassType */}
                        <View className="flex-row justify-center px-5 my-3">
                            {classTypes.map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    onPress={() => setActiveClassType(type)}
                                    className={`px-4 py-2 mx-1 rounded-full ${
                                        activeClassType === type
                                            ? "bg-red-500"
                                            : "bg-gray-200"
                                    }`}
                                >
                                    <Text
                                        className={`${
                                            activeClassType === type
                                                ? "text-white"
                                                : "text-slate-700"
                                        } font-semibold`}
                                    >
                                        {type}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* 🔹 Course List */}
                        
                            <View className="w-full items-center flex-1">
                                <FlatList
                                    data={filteredData}
                                    keyExtractor={(_, idx) => idx.toString()}
                                    scrollEnabled={true}
                                    contentContainerStyle={{paddingBottom:60}}
                                    renderItem={({ item }) => (
                                        <CourseItem
                                            showpayment={showpayment}
                                            setshowpayment={setshowpayment}
                                            course={item}
                                            setSelected={setSelected}
                                        />
                                    )}
                                    ItemSeparatorComponent={() => (
                                        <Divider style={{ marginVertical: 10 }} />
                                    )}
                                    ListEmptyComponent={() => (
                                        <View className="py-10">
                                            <Text className="text-gray-500 text-base font-semibold">
                                                No record found for {activeClassType}
                                            </Text>
                                        </View>
                                    )}
                                />
                            </View>
                       
                  

                  
                </SafeAreaView>
           
        </>
    );
};

export default AllCoursedetail;

const CardCourse = ({ item }) => {
    const navigation = useNavigation()

    const handleselectItem = (item) => {
        

        navigation.navigate('applycourses', { courseCodeName: item.courses, courseName: item.course })

    }
    return (
        <>
            <View className="w-full h-72 bg-black">
                <Image
                    className="h-[80%] w-full"
                    resizeMode="cover"
                    source={{
                        uri: `https://certmart.org/icon/${item.icon
                            }.jpeg?timestamp=${new Date().getTime()}`,
                    }}
                />
                <View style={{ backgroundColor: colorred }} className="h-[20%] w-full">
                    <View className="flex-row items-center justify-between h-full px-3">
                        <View>
                            <Text style={{ color: "#ffffff" }} variant="bodyMedium">
                                ₦{item.cost} | Duration {item.duration} weeks
                            </Text>

                        </View>

                        <TouchableOpacity onPress={() => handleselectItem(item)} className="bg-red-500 px-2 py-2">
                            <Text className="text-white">Register</Text>
                        </TouchableOpacity>


                    </View>


                </View>

            </View>
        </>
    )
}

const stylecustom = {
    spacetop: {
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
};
