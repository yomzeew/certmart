import { SafeAreaView,View,Text, Linking, ScrollView } from "react-native"
import Header from "./header"
import { Avatar, Divider } from "react-native-paper"
import { colorred } from "../../../constant/color"
import { allTrainers, classes, getCourseStatus } from "../../../settings/endpoint"
import { useCallback, useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { TouchableOpacity } from "react-native-gesture-handler"
import { FontAwesome } from "@expo/vector-icons"




const Classes=()=>{

    const [data,setdata]=useState([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                const studentId = await AsyncStorage.getItem("studentid");
                if (!token || !studentId) {
                    throw new Error("Missing token or student ID");
                }

                const [approvedCourses, paidCourses, trainers] = await Promise.all([
                    axios.get(`${getCourseStatus}/approved?studentid=${studentId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }).then((res) => res.data),
                    axios.get(`${classes}/students?id=${studentId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }).then((res) => res.data),
                    axios.get(allTrainers).then((res) => res.data),
                ]);
                console.log('ok',paidCourses)
        
                const combinedData = paidCourses.map((classItem) => {
                    const matchingCourse = approvedCourses.find(
                        (course) => course.eventcode === classItem.eventid && course?.paymentstatus === 1
                    );


                    const matchingTrainer = trainers.data.find(
                        (trainer) => trainer.trainerid === classItem.t_id
                    );

                    return {
                        course: classItem.course,
                        amount: classItem.amountpaid,
                        eventId: classItem.eventid,
                        trainerSurname: classItem.t_surname,
                        trainerFirstname: classItem.t_firstname,
                        trainerId: classItem.t_id,
                        hubaddress: classItem.c_address,
                        city: classItem.c_city,
                        country: classItem.c_country,
                        hub: classItem.c_name,
                        state: classItem.c_state,
                        startdate: classItem.startdate,
                        canceled: classItem.canceled,
                        duration: matchingCourse?.duration || classItem.duration || null,
                        days: matchingCourse?.days || classItem.days || null,
                        classType: matchingCourse?.classType || classItem.classtype || null,
                        trainerName: matchingTrainer?.name || null,
                        trainerDp: matchingTrainer?.dp || null,
                        trainerEmail: matchingTrainer?.email,
                        trainerPhone: matchingTrainer?.phone,
                    };
                });
                

                setdata(combinedData);
            } catch (error) {
                console.error("Error combining data:", error.message);
            }
        };

        fetchData();
    }, []);
  
  
    
return(
    <>
    <View className="h-full w-full">
    <SafeAreaView >
        <Header/>
        <View className="px-5">
                        <Text style={{ fontSize: 20, color: colorred }} className="font-semibold">
                            Available Classes
                        </Text>
                        <Divider theme={{ colors: { primary: colorred } }} />
        </View>
        <View className="px-3">
        <TouchableOpacity className="relative mt-3">
            <View className="w-16 h-16 rounded-full items-center justify-center bg-red-400 absolute left-0 z-50">
                <Text className="text-lg">01</Text>
            </View>
            <View className="bg-red-200 h-16 w-full rounded-full justify-center items-center">
                <Text className="text-lg">Web Design</Text>
            </View>
        </TouchableOpacity>
        <View className="mt-5">
            <ClassesDetails/>
        </View>

        </View>
        
    </SafeAreaView>
    </View>

    </>
)}
export default Classes

const ClassesDetails=()=>{
    const item=0
  
    const handleEmailPress = () => {
        Linking.openURL('mailto:yomzeew@gmail.com');
    };

    const handlePhonePress = () => {
        Linking.openURL('tel:08166564618');
    };
    return(
        <>
        <View className="h-auto py-3 w-full bg-red-100 rounded-2xl">
            <View className="flex-row justify-around">
                <TouchableOpacity className="flex-row justify-around w-32 bg-red-400 h-8 items-center rounded-2xl -mt-3">
                    <Text>Course Details</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row justify-center w-32 bg-red-300 h-8 items-center rounded-2xl -mt-3">
                    <FontAwesome name="book" size={16} />
                    <Text>Receipt</Text>
                </TouchableOpacity>


            </View>
            <View className="w-full py-5 justify-center flex-row items-center"> 
            {item===1?<Avatar.Image source={{uri:`https://certmart.org/dps/${item.dp}.jpg?timestamp=${new Date().getTime()}`}}/>:<Avatar.Image source={require('../../images/avatermale.png')}/>}
            <View className="w-2" />
            <View className="items-center">
                <Text className="text-lg">Oluwasuyi Babayomi | Jit/t/0444</Text>
                <Text className="mt-1"><TouchableOpacity className="bg-red-300 py-1 rounded-2xl px-3" onPress={handleEmailPress}><Text>yomzeew@gmail.com</Text></TouchableOpacity>  <TouchableOpacity className="bg-red-300 py-1 rounded-2xl px-3"onPress={handlePhonePress}><Text>08166564618</Text></TouchableOpacity></Text>
            </View>
            </View>
            <View className="">
            <View className="items-center flex-row justify-between px-3 ">
                <Text className="text-xs">Class Type:Physical</Text>
                <View className="w-2" />
                <Text className="text-xs">No 1 Road 202 FHE </Text>
            </View>
            <View className="items-center flex-row justify-between px-3 ">
                <Text className="text-xs">Akure, Ondo State</Text>
                <View className="w-2" />
                <Text className="text-xs">Nigeria</Text>
            </View>

            </View>
            <View className="px-3 w-full mt-3">
            <View className=" flex-row justify-between">
                <Text>Start Date</Text>
                <Text>End Date</Text>
            </View>
            <View className="flex-row justify-between items-center">
                <View className="w-5 h-5 rounded-full bg-orange-500"/>
                <View className="bg-orange-200 flex-1 h-4">
                <View style={{ width:'80%'}} className="bg-green-500 h-4 items-end">
                    <Text>Day 15</Text>
                    </View>
                </View>
                
                <View className="w-5 h-5 rounded-full bg-green-500"/>
            </View>


            </View>
            <DayBooks/>
            <View className="mt-3 flex-row justify-around">
                <Text>Time:12:00-3:00</Text>
                <Text>Duration:3hours</Text>
            </View>
            
        </View>
        </>
    )
}

const DayBooks = ({ day }) => {
    const inputString = "Friday  Saturday  "; // Example booked days string
    const daysArray = inputString
        .trim()
        .split(/\s+/)
        .filter((day) => day); // Remove empty strings if present

    // Full day names and their corresponding short forms
    const dayMapping = {
        Sunday: 'Sun',
        Monday: 'Mon',
        Tuesday: 'Tues',
        Wednesday: 'Wed',
        Thursday: 'Thur',
        Friday: 'Fri',
        Saturday: 'Sat',
    };

    const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];

    // Map full names in daysArray to their short forms
    const bookedDaysShort = daysArray.map((fullDay) => dayMapping[fullDay]);

    // Get today's date and calculate dates for the current week
    const today = new Date();
    const weekDates = days.map((_, index) => {
        const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + index);
        return date.getDate().toString().padStart(2, '0'); // Format as two digits
    });

    return (
        <>
            <View className="items-center mt-3">
                <Text className="text-lg">Booked Days for Training</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row items-center justify-center">
                        {days.map((item, index) => {
                            const isBooked = bookedDaysShort.includes(item); // Check if the day is booked
                            return (
                                <TouchableOpacity
                                    key={index}
                                    className={`w-12 h-24 ${
                                        isBooked ? 'bg-green-300' : 'bg-red-300'
                                    } rounded-2xl ml-1 items-center justify-center`}
                                >
                                    <Text>{item}</Text>
                                    <Text>{weekDates[index]}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>
            </View>
        </>
    );
};

