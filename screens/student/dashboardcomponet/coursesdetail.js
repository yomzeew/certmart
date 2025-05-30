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
import { DirectPayment } from "../../modals/coursedetailwithamount";
import PaymentScreenModal from "./dashboard/paymentScreen";

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
    const [showpayment,setshowpayment]=useState(false)
    const [showloader,setShowLoader]=useState(false)
    const [selected,setSelected]=useState('')
    const [showsuccess,setshowsuccess]=useState(false)
    const fetchdata = async () => {
        try {
            setshowpreloader(true);
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(`${allavailablecourse}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            const filteredCourses = response.data.filter((item) => item.courses === course);
            
            
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
    
            setcoursesdata(uniqueCourses);
            
            if (uniqueCourses.length > 0) {
                setcourseTitle(uniqueCourses[0].course);
            }
    
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
        setcoursesdata([])
        navigation.goBack();
    };
    const handleshowpayment=(value)=>{
        setshowpayment(true)
        setSelected(value)
    }
    return (
        <> 
            
       

        <View style={[styles.bgcolor]} className="flex-1 w-full">
            <StatusBar style="auto" />
            {showpreloader && (
                <View style={{zIndex:50,elevation:50}}  className=" absolute h-full w-full">
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
                             <DirectPayment
                             item={item}   
                             setShowLoader={setshowpreloader}
                             showcontent={showcontent}
                             setshowcontent={setshowcontent}
                             content={content}
                             setcontent={setcontent}
                             onClickPayment={(textdata)=>handleshowpayment(textdata)}
                              />
                         </View>
                            )}
                            </ScrollView>

                            </View>
                         
                    </View>
                </View>
            </View> 
            <Footer currentPage="home" />
        </View>
        {showcontent && 
        <CourseDetailsModal //attention neeeded
        content={content} 
        setshowcontent={setshowcontent}
        showcontent={showcontent}
        /> 
        }
        {showpayment &&
                    <PaymentScreenModal
                    selected={selected}
                    setshowpayment={setshowpayment}
                    setShowLoader={setShowLoader}
                    setshowsuccess={setshowsuccess}
                          />

                }    
        </>
    );
};
export default Coursedetail;
