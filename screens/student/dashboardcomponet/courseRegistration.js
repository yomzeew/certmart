import { View, SafeAreaView, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
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
      }, []);

      
  

     const handlecancel=()=>{
        setshowsuccess(false)

     }
    return (
        <>
            {showLoader && (
                <View className="z-50 absolute h-full w-full">
                    <Preloader />
                </View>
            )}
            
            <View className="w-full h-full justify-center items-center ">
            {showsuccess &&
             <View className="absolute z-50 h-full w-full items-center justify-center">
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
                                 
                                    <View className="rounded-2xl h-20 bg-red-200 w-[75vw] flex-row justify-center items-center">
                                        <TouchableOpacity
                                            onPress={() => toggleModal(index)}
                                            className="items-center"
                                        >
                                            <Text style={{ fontSize: 16 }} className="font-semibold text-center">
                                                {item.course}
                                            </Text>
                                         
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
