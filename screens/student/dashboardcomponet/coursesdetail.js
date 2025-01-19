import {
    Dimensions,
    Image,
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    Pressable,
} from "react-native";
import { styles } from "../../../settings/layoutsetting";
import { StatusBar } from "expo-status-bar";
import { FontAwesome } from "@expo/vector-icons";
import { colorred, lightred } from "../../../constant/color";
import { ScrollView } from "react-native-gesture-handler";
import { Avatar, Divider } from "react-native-paper";
import Header from "./header";
import Footer from "./footer";
import { allavailablecourse } from "../../../settings/endpoint";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Preloader from "../../preloadermodal/preloaderwhite";
import { fieldtexttwo } from "../../../settings/fontsetting";
import { AvailableCourses } from "../../modals/coursesRegmodal";
import { CourseDetailsModal } from "../../modals/coursesdetailsModal";

const Coursedetail = () => {
    const { height } = Dimensions.get("window");
    const route = useRoute();
    const navigation = useNavigation();
    const { course } = route.params;
    const [coursesdata, setcoursesdata] = useState([]);
    const [showpreloader, setshowpreloader] = useState(false);
    const [courseTitle,setcourseTitle]=useState('')
    const [content, setcontent] = useState('')
    const [showcontent, setshowcontent] = useState(false)
    const fetchdata = async () => {
        try {
            setshowpreloader(true);
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(`${allavailablecourse}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        
            
            const newArray=response.data.filter((item,index)=>(
                item.courses===course
              ))
              console.log(newArray)

            
              setcoursesdata(newArray);
              setcourseTitle(newArray[0].course)

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
            setshowpreloader(false);
        }
    };
    useEffect(() => {
        fetchdata();
    }, [course]);
    const handlegoback = () => {
        navigation.goBack();
    };
    return (
        <>
         {showcontent && 
        <CourseDetailsModal
        content={content} 
        setshowcontent={setshowcontent}
        showcontent={showcontent}
        /> 
        }

        <View style={[styles.bgcolor]} className="flex-1 w-full">
            <StatusBar style="auto" />
            {showpreloader && (
                <View className="z-50 absolute h-full w-full">
                    <Preloader />
                </View>
            )}
          <View className="flex-1">
              <View style={{ height: height * 0.2 }} className="w-full">
                    <View className="absolute z-50 top-10 w-full">
                        <View className="bg-slate-100 opacity-80 py-2">
                            <Header />
                        </View>
                        <TouchableOpacity
                            onPress={handlegoback}
                            className={`p-3 bg-red-500 w-20`}
                        >
                            <Text className={`${fieldtexttwo} text-white`}>Go Back</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                    <View className="px-5 w-full">
                        <View
                            style={{ elevation: 6, maxHeight: height * 0.7 }}
                            className="rounded-2xl flex px-2 py-3  bg-slate-50 shadow-lg shadow-slate-500 "
                        >
                            <View className="h-16 item-center  justify-center w-full">
                                    <Text className="text-2xl text-center">{courseTitle}</Text>
                                </View>
                            <View className="h-5/6 w-full">
                                <ScrollView>
                            {coursesdata.length>0&&coursesdata.map((item,index)=>
                             <View className="w-full items-center">          
                             <AvailableCourses
                            //  setshowpayment={setshowpayment}
                             item={item}
                             setShowLoader={setshowpreloader}
                             setSelected={(value)=>setSelected(value)}
                             showcontent={showcontent}
                             setshowcontent={setshowcontent}
                             content={content}
                             setcontent={setcontent}
                            //  showsuccess={showsuccess}
                              />
                         </View>
                            // <TouchableOpacity key={index} className="mt-3">
                            //     <View className="bg-red-300 h-20 w-full rounded-2xl flex-row items-center justify-around ">
                            //         <View className="h-12 w-12 rounded-full bg-red- items-center justify-center"><Text>{index+1}</Text></View>
                            //         <Text>N{item.cost}</Text>
                            //         <View className="items-center">
                            //         <Text>{item.duration}weeks</Text>
                            //         <Text>{item.classType}</Text>
                            //         </View>
                            //         <View className="items-center">
                            //         <Text>Trainer Name</Text>
                            //         <Text className="font-bold">{item.tfirstname+' '+item.tsurname}</Text>
                            //         </View>
                            //     </View>    
                            // </TouchableOpacity>
                            )}
                            </ScrollView>

                            </View>
                         
                            {/* <View className="mt-2 flex justify-between flex-row px-5">
                                <Text style={{ fontSize: 16, color: colorred }} className="">
                                    {coursesdata.category}
                                </Text>
                                <Text>
                                    <FontAwesome color="orange" size={24} name="star" />
                                    4.2
                                </Text>
                            </View>
                            <View className="mt-2 px-5">
                                <Text style={{ fontSize: 18 }} className="font-semibold">
                                    {coursesdata.course}
                                </Text>
                            </View>
                            <View className="mt-2 px-5">
                                <Text style={{ fontSize: 16 }} className="">
                                    <FontAwesome size={20} name="calendar" />{" "}
                                    {coursesdata.duration} weeks |{" "}
                                    <FontAwesome size={20} name="clock-o" /> 2 hours
                                </Text>
                            </View>
                            <View className="mt-3 flex flex-row justify-center">
                                <View className="w-1/2 items-center bg-slate-200 h-12 flex justify-center">
                                    <Text style={{ fontSize: 16 }} className="">
                                        Overview
                                    </Text>
                                </View>
                                <View
                                    style={{ backgroundColor: lightred }}
                                    className="w-1/2 items-center h-12 flex justify-center"
                                >
                                    <Text style={{ fontSize: 16 }}>Requirement</Text>
                                </View>
                            </View>
                            <View className="mt-3 px-5">
                                <Text className>{coursesdata.description}</Text>
                            </View>
                            <View className="px-5 mt-3">
                                <TouchableOpacity
                                    style={{ backgroundColor: colorred }}
                                    className="h-12 rounded-2xl flex justify-center items-center"
                                >
                                    <Text style={{ fontSize: 16 }} className="text-white">
                                        View Available Classes
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View className="px-5 mt-3">
                                <View>
                                    <Text style={{ fontSize: 16 }} className="font-semibold">
                                        Review
                                    </Text>
                                    <Divider />
                                </View>
                            </View>
                            <View className="flex-1 px-5 py-3">
                                <ScrollView showsVerticalScrollIndicator={false} className="">
                                    <View>
                                        <View className="w-full justify-between flex flex-row">
                                            <View>
                                                <Avatar.Image
                                                    size={70}
                                                    source={require("../../images/avatermale.png")}
                                                />
                                            </View>
                                            <View className="w-24" />
                                            <View>
                                                <Text
                                                    style={{ fontSize: 16 }}
                                                    className="font-semibold"
                                                >
                                                    William S. Cunningham
                                                </Text>
                                                <Text className="mt-2">
                                                    The Course is Very Good dolor sit amet, consect tur
                                                    adipiscing elit. Naturales divitias dixit parab les
                                                    esse, quod parvo
                                                </Text>
                                            </View>
                                        </View>
                                        <View className="w-full items-center flex flex-row mt-2">
                                            <View
                                                style={{ backgroundColor: lightred }}
                                                className="px-3 py-1 rounded-2xl border-blue-700 border"
                                            >
                                                <Text>
                                                    <FontAwesome size={20} name="star" color="orange" />
                                                    4.2
                                                </Text>
                                            </View>
                                            <View className="w-5" />
                                            <View>
                                                <Text className="font-semibold">1 months ago</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View className="mt-2">
                                        <View className="w-full justify-between flex flex-row">
                                            <View>
                                                <Avatar.Image
                                                    size={70}
                                                    source={require("../../images/avatermale.png")}
                                                />
                                            </View>
                                            <View className="w-24" />
                                            <View>
                                                <Text
                                                    style={{ fontSize: 16 }}
                                                    className="font-semibold"
                                                >
                                                    William S. Cunningham
                                                </Text>
                                                <Text className="mt-2">
                                                    The Course is Very Good dolor sit amet, consect tur
                                                    adipiscing elit. Naturales divitias dixit parab les
                                                    esse, quod parvo
                                                </Text>
                                            </View>
                                        </View>
                                        <View className="w-full items-center flex flex-row mt-2">
                                            <View
                                                style={{ backgroundColor: lightred }}
                                                className="px-3 py-1 rounded-2xl border-blue-700 border"
                                            >
                                                <Text>
                                                    <FontAwesome size={20} name="star" color="orange" />
                                                    4.2
                                                </Text>
                                            </View>
                                            <View className="w-5" />
                                            <View>
                                                <Text className="font-semibold">1 months ago</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View className="mt-2">
                                        <View className="w-full justify-between flex flex-row">
                                            <View>
                                                <Avatar.Image
                                                    size={70}
                                                    source={require("../../images/avatermale.png")}
                                                />
                                            </View>
                                            <View className="w-24" />
                                            <View>
                                                <Text
                                                    style={{ fontSize: 16 }}
                                                    className="font-semibold"
                                                >
                                                    William S. Cunningham
                                                </Text>
                                                <Text className="mt-2">
                                                    The Course is Very Good dolor sit amet, consect tur
                                                    adipiscing elit. Naturales divitias dixit parab les
                                                    esse, quod parvo
                                                </Text>
                                            </View>
                                        </View>
                                        <View className="w-full items-center flex flex-row mt-2">
                                            <View
                                                style={{ backgroundColor: lightred }}
                                                className="px-3 py-1 rounded-2xl border-blue-700 border"
                                            >
                                                <Text>
                                                    <FontAwesome size={20} name="star" color="orange" />
                                                    4.2
                                                </Text>
                                            </View>
                                            <View className="w-5" />
                                            <View>
                                                <Text className="font-semibold">1 months ago</Text>
                                            </View>
                                        </View>
                                    </View>
                                </ScrollView>
                            </View> */}
                    </View>
                </View>
            </View> 
            <Footer currentPage="home" />
        </View>
        </>
    );
};
export default Coursedetail;
