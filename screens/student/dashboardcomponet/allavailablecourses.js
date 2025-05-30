import {
    Dimensions,
    Image,
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    Platform,
} from "react-native";
import { styles } from "../../../settings/layoutsetting";
import { StatusBar } from "expo-status-bar";
import { FontAwesome } from "@expo/vector-icons";
import { colorred, lightred } from "../../../constant/color";
import { ScrollView } from "react-native-gesture-handler";
import { Avatar, Card, Divider } from "react-native-paper";
import Header from "./header";
import Footer from "./footer";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Preloader from "../../preloadermodal/preloaderwhite";
import { fieldtextfour, fieldtexttwo } from "../../../settings/fontsetting";
import PaymentScreenModal from "./dashboard/paymentScreen";
import { allavailablecourse } from "../../../settings/endpoint";

const AllCoursedetail = () => {
    const { height } = Dimensions.get("window");
    const [showpayment, setshowpayment] = useState(false)
    const [selected, setSelected] = useState('')
    const [showsuccess, setshowsuccess] = useState(false)
    const route = useRoute();
    const navigation = useNavigation();
    const { course } = route.params;
    const [coursesdata, setcoursesdata] = useState([]);
    const [showpreloader, setshowpreloader] = useState(false);
    const [data, setdata] = useState([]);
    const fetchdata = async () => {
        try {
            setshowpreloader(true);
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(`${allavailablecourse}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const filteredCourses = response.data.filter((item) => item.course === course);

            // Using a Set to remove duplicates
            const uniqueSet = new Set();
            const uniqueCourses = filteredCourses.filter((item) => {
                const key = `${item.tfirstname}-${item.tsurname}-${item.classType}-${item.duration}`;
                if (uniqueSet.has(key)) {
                    return false;
                }
                uniqueSet.add(key);
                return true;
            });

console.log(uniqueCourses)
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
    const handlenavigate = (value) => {
        navigation.navigate("coursesdetail", { course: value });
    };
    const handleselectItem = (value) => {
        setSelected(value)
    }
    const handlegoback = () => {
        navigation.goBack();
    };

    return (
        <>
            {showpayment &&
                <PaymentScreenModal
                    selected={selected}
                    setshowpayment={setshowpayment}
                    setShowLoader={setshowpreloader}
                    setshowsuccess={setshowsuccess}
                />

            }
            <View style={[styles.bgcolor]} className="flex-1 w-full">
                <StatusBar style="auto" />
                {showpreloader && (
                    <View className="z-50 absolute h-full w-full">
                        <Preloader />
                    </View>
                )}
                <SafeAreaView s className="flex-1 w-full">
                    <View>
                        <Header />
                        <TouchableOpacity
                            onPress={handlegoback}
                            className={`p-3 bg-red-500 w-20`}
                        >
                            <Text className={`${fieldtexttwo} text-white`}>Go Back</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="flex-1 w-full">
                        <View>
                            <Text
                                style={{ color: colorred, fontSize: 20 }}
                                className={`font-semibold px-5`}
                            >
                                {course}
                            </Text>
                        </View>
                        <ScrollView>
                            <View className="w-full  items-center">
                                {data.map((item, index) => (
                                    <View key={index} className="mt-3 w-full">
                                        <CardCourse item={item} />
                                    </View>

                                    //     <View className="p-2 items-center" key={index}>
                                    //         <TouchableOpacity
                                    //             onPress={() => handlenavigate(item.coursecode)}
                                    //         >
                                    //             <Card className="w-44 h-64 bg-white">
                                    //                 <Card.Cover
                                    //                     source={{
                                    //                         uri: `https://certmart.org/icon/${item.icon
                                    //                             }.jpeg?timestamp=${new Date().getTime()}`,
                                    //                     }}
                                    //                 />
                                    //                 <Card.Content>
                                    //                     <Text
                                    //                         style={{ color: colorred }}
                                    //                         className="font-semibold mt-2"
                                    //                         variant="titleLarge"
                                    //                     >
                                    //                         {item.course}
                                    //                     </Text>
                                    //                     <Text variant="bodyMedium">
                                    //                         ₦{item.cost} | Duration {item.duration} weeks
                                    //                     </Text>
                                    //                 </Card.Content>
                                    //                 <TouchableOpacity onPress={() => handleselectItem(item)} className="bg-red-500 px-2 py-2">
                                    //                     <Text className="text-white">Register</Text>
                                    //                 </TouchableOpacity>
                                    //             </Card>
                                    //         </TouchableOpacity>
                                    //   </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                    <Footer currentPage="home" />
                </SafeAreaView>
            </View>
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
