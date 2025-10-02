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
import {  Divider } from "react-native-paper";
import { allavailablecourse } from "../../../settings/endpoint";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Preloader from "../../preloadermodal/preloaderwhite";
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
    const [courselength,setcourselength]=useState(0)
    const fetchdata = async () => {
        try {
          setshowpreloader(true);
          const token = await AsyncStorage.getItem("token");
          const response = await axios.get(`${allavailablecourse}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
      
          const filteredCourses = response.data.filter(
            (item) => item.courses === course
          );
      
          // ✅ Ensure uniqueness
          const uniqueCourses = filteredCourses.filter(
            (item, index, self) =>
              index ===
              self.findIndex(
                (c) =>
                  c.id
                    ? c.id === item.id
                    : c.courses === item.courses &&
                      c.tfirstname === item.tfirstname &&
                      c.tsurname === item.tsurname &&
                      c.classType === item.classType &&
                      c.duration === item.duration &&
                      c.cost === item.cost
              )
          );
          setcourselength(uniqueCourses.length)
          console.log( uniqueCourses[0],'uniqueCourse');
      
          // ✅ Replace state, not accumulate
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
        let isMounted = true;
      
        const run = async () => {
          await fetchdata();
        };
      
        if (isMounted) {
          run();
        }
      
        return () => {
          isMounted = false;
        };
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
             {showpreloader && (
                <View style={{zIndex:50,elevation:50}}  className=" absolute h-full w-full">
                    <Preloader />
                </View>
            )}
            <SafeAreaView style={[styles.andriod,styles.bgcolor, { flex: 1, width: '100%'}]}>
            <StatusBar style="dark" />
          <View className="w-full pt-[20px] ">
                    <View className=" w-full flex-row gap-x-2 items-center">
                        <TouchableOpacity
                            onPress={handlegoback}
                            className={`p-3 rounded-2xl item-center`}
                        >
                            <FontAwesome name="arrow-left" size={12} color={colorred} />
                            
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontWeight: '600',color:colorred }}>{courseTitle} </Text>
                    </View>
                     <Divider style={{marginVertical:10,backgroundColor:colorred}}/>
                    </View>

      
          
           
          <View className="flex-1">
      
                    <View className="px-5 w-full">
                        <View
                            style={{ elevation: 6, height:height * 0.9 }}
                            className="rounded-2xl  px-2 py-3  bg-slate-50 shadow-lg shadow-slate-500 "
                        >

                            <View className="h-full w-full">
                             
        <DirectPayment
            item={coursesdata[0]}
            setShowLoader={setshowpreloader}
            showcontent={showcontent}
            setshowcontent={setshowcontent}
            content={content}
            setcontent={setcontent}
            onClickPayment={(textdata) => handleshowpayment(textdata)}
        />
 
                            </View>
                         
                    </View>
                </View>
            </View> 
        </SafeAreaView>
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
