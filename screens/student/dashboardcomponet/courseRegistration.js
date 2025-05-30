import { View, SafeAreaView, Text, ScrollView, TouchableOpacity, Platform ,RefreshControl } from "react-native";
import Header from "./header";
import { styles } from "../../../settings/layoutsetting";
import CoursesVerifyModal from "../../modals/courseverifyModal";
import Preloader from "../../preloadermodal/preloaderwhite";
import { Avatar, Divider,RadioButton } from "react-native-paper";
import { colorred } from "../../../constant/color";
import { useState,useCallback,useEffect } from 'react';
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { AvailableCourses, CoursesRegModalParttwo } from "../../modals/coursesRegmodal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { getCourseStatus } from "../../../settings/endpoint";
import PaymentScreenModal from "./dashboard/paymentScreen";
import SuccessModal from "../../modals/successfulmodal";
import { CourseDetailsModal } from "../../modals/coursesdetailsModal";

const CourseReg = () => {
    const [showLoader, setShowLoader] = useState(false);
    const [datareg, setdatareg] = useState([]);
    const [data,setData]=useState([])
    const [coursesData,setCoursesData]=useState([])
    const [selectedCourse, setSelectedCourse] = useState(null); // Store the index of the selected course
    const [selected,setSelected]=useState('')
    const [currency,setCurrency]=useState('')
    const [showpayment,setshowpayment]=useState(false)
    const [showsuccess,setshowsuccess]=useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const [content, setcontent] = useState('')
    const [showcontent, setshowcontent] = useState(false)

    const toggleModal = (index) => {
        try{
            setShowLoader(true);
            if (selectedCourse === index) {
                setSelectedCourse(null); // Close the modal if the same course is clicked again
            } else {
                setSelectedCourse(index); // Open the modal for the selected course
            }

        }catch(error){

        }finally{
            setShowLoader(false)

        }
       
    };
    const fetchData = useCallback(async () => {
        try {
          setShowLoader(true);
          const token = await AsyncStorage.getItem("token");
          const studentId = await AsyncStorage.getItem("studentid");
          const response = await axios.get(`${getCourseStatus}/approved?studentid=${studentId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setData(response.data);
          setCoursesData(response.data); // Default to all courses
          const dataall=response.data
          if(dataall.length>0){
            const newArray=dataall.filter((item,index)=>(
                item.status==='Approved'

            ))
            setdatareg(newArray)
          }
          else{
            setCoursesData([])
          }
   
        } catch (error) {
          console.error("Error fetching data:", error.message);
        } finally {
          setShowLoader(false);
        }
      }, []);
    
      useEffect(() => {
        fetchData();
      }, [selectedCourse]);

      const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData().finally(() => setRefreshing(false));
      }, [fetchData]);
    

      
  

     const handlecancel=()=>{
        setshowsuccess(false)

     }
    return (
        <>
        {showcontent && 
        <CourseDetailsModal
        content={content} 
        setshowcontent={setshowcontent}
        showcontent={showcontent}
        /> 
        }
            {showLoader && (
                <View style={{zIndex:50,elevation:50}}  className="absolute h-full w-full">
                    <Preloader />
                </View>
            )}
            
            <View className="w-full h-full justify-center items-center ">
            {showsuccess &&
             <View style={{zIndex:50,elevation:50}}  className="absolute  h-full w-full items-center justify-center">
            <SuccessModal
            message={'Payment Successful'}
            action={()=>handlecancel()}
            />

            </View>
          

}
                {showpayment &&
                    <PaymentScreenModal
                    selected={selected}
                    setshowpayment={setshowpayment}
                    setShowLoader={setShowLoader}
                    setshowsuccess={setshowsuccess}
                    />

                } 
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
                        <FontAwesome name="check-circle" size={30} color="orange" />
                            <Text className="text-red-500 ml-2">Await Payment</Text>
                        </View>
                        <View className="bg-slate-200 w-1 h-8 ml-2 mr-2" />
                        <View className="flex-row items-center">
                            <FontAwesome name="check-circle" size={30} color="green" />
                            <Text className="text-red-500 ml-2">Payment</Text>
                        </View>
                    </View>
                    <ScrollView 
                     style={{ marginTop: 16, paddingHorizontal: 12 }}
                     refreshControl={
                       <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colorred]} />
                     }
                    className="mt-10 px-3">
                        {datareg.map((item, index) => (
                            <View key={index} className="items-center w-full">
                                <View className="relative flex justify-center items-center h-28">
                               
                                    <View className={`${selectedCourse===index?'bg-red-300':'bg-red-200'} rounded-2xl h-20 w-[75vw] flex-row justify-center items-center`}>
                                        <TouchableOpacity
                                            onPress={() => toggleModal(index)}
                                            className="items-center"
                                        >
                                            <View >
                                                <Text style={{ fontSize: 20 }} className="font-semibold text-center">Select</Text>
                                                <Text style={{ fontSize: 14 }} className="font-semibold text-center">{item.course}</Text>
                                            </View>
                                         
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {/* Conditionally render the modal only for the selected course */}
                                {selectedCourse === index && (
                                    <View className="w-full items-center">
                                        
                                        <AvailableCourses
                                        setshowpayment={setshowpayment}
                                        item={item}
                                        setShowLoader={setShowLoader}
                                        setSelected={(value)=>setSelected(value)}
                                        showsuccess={showsuccess}
                                        showcontent={showcontent}
                                        setshowcontent={setshowcontent}
                                        content={content}
                                        setcontent={setcontent}
                                         />
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
