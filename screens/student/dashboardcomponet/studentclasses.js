import { SafeAreaView, View, Text, Linking, ScrollView } from "react-native"
import Header from "./header"
import { Avatar, Divider } from "react-native-paper"
import { colorred } from "../../../constant/color"
import { allTrainers, BaseURi, classes, getCourseStatus } from "../../../settings/endpoint"
import { useCallback, useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { TouchableOpacity } from "react-native-gesture-handler"
import { FontAwesome } from "@expo/vector-icons"




const Classes = () => {

    const [data, setdata] = useState([])
    const [currentindex, setcurrentindex] = useState('')
    const [objectdata, setobjectdata] = useState('')
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

                const trainerAvailabilitiesPromises = approvedCourses.map((course) =>
                    axios.get(`${BaseURi}/traineravailabilites/${course.courseid}?orderBy=${course.classtype}`)
                        .then((res) => res.data)
                        .catch((error) => {
                            console.error(`Failed to get availability for course ${course.courseid}`, error.message);
                            return null; // Return null if the request fails
                        })
                );

                const trainerAvailabilities = await Promise.all(trainerAvailabilitiesPromises);
                // filter where payment paid
               
                const combinedData = paidCourses.map((classItem) => {
                    const validAvailabilities = trainerAvailabilities.filter(courseList => Array.isArray(courseList));

                        const matchingCourse=validAvailabilities[0].length>0 && validAvailabilities[0].filter((a)=>(
                            a.eventcode===classItem.eventid
                        ))
                        console.log(matchingCourse[0]?.duration )
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
                        duration: matchingCourse[0]?.duration || classItem.duration || null,
                        days: matchingCourse[0]?.days || classItem.days || null,
                        classType: matchingCourse[0]?.classType || classItem.classtype || null,
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
    const handleshowdetails = (object, index) => {
        setcurrentindex(index)
        setobjectdata(object)

    }


    return (
        <>
            <View className="h-full w-full">
                <View className="mt-[44px]">
                    <Header />
                </View>

                <View className="px-5">
                    <Text style={{ fontSize: 20, color: colorred }} className="font-semibold">
                        Available Classes
                    </Text>
                    <Divider theme={{ colors: { primary: colorred } }} />
                </View>
                <View className="flex-1">
                    <ScrollView className="px-3 pb-20">
                        {data.length > 0 &&
                            data.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleshowdetails(item, index)}
                                    className="relative mt-3"
                                >
                                    <View className="w-16 h-16 rounded-full items-center justify-center bg-red-400 absolute left-0 z-50">
                                        <Text className="text-lg">{index + 1}</Text>
                                    </View>
                                    <View className="bg-red-200 h-16 w-full rounded-full justify-center items-center pl-5">
                                        <Text className="text-sm">{item.course}</Text>
                                    </View>
                                    {currentindex === index && (
                                        <View className="mt-5">
                                            <ClassesDetails item={item} />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                    </ScrollView>

                </View>

            </View>

        </>
    )
}
export default Classes

const ClassesDetails = ({ item }) => {


    const handleEmailPress = () => {
        Linking.openURL('mailto:yomzeew@gmail.com');
    };

    const handlePhonePress = () => {
        Linking.openURL('tel:08166564618');
    };
 const getDateEnddate=(inputDate,weeks)=>{
    const baseDate = new Date(inputDate);
baseDate.setDate(baseDate.getDate() + weeks*7 ); // Add 14 days

const resultDate = baseDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
return resultDate;

    }
    return (
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
                    {item === 1 ? <Avatar.Image source={{ uri: `https://certmart.org/dps/${item.dp}.jpg?timestamp=${new Date().getTime()}` }} /> : <Avatar.Image source={require('../../images/avatermale.png')} />}
                    <View className="w-2" />
                    <View className="items-center">
                        <Text className="text-lg">{item.trainerSurname} {item.trainerFirstname} | {item.trainerId}</Text>
                        <Text className="mt-1"><TouchableOpacity className="bg-red-300 py-1 rounded-2xl px-3" onPress={handleEmailPress}><Text>{item.trainerEmail}</Text></TouchableOpacity>  <TouchableOpacity className="bg-red-300 py-1 rounded-2xl px-3" onPress={handlePhonePress}><Text>{item.trainerPhone}</Text></TouchableOpacity></Text>
                    </View>
                </View>
                <View className="">
                    <View className="items-center flex-row justify-between px-3 ">
                        <Text className="text-xs">Class Type:{item.classType}</Text>
                        {item.classType !== 'Virtual' && (
                            <>
                                <View className="w-2" />
                                <Text className="text-xs">
                                    {item.hubaddress}
                                </Text>
                            </>
                        )}
                    </View>
                      {item.classType !== 'Virtual' && (<View className="items-center flex-row justify-between px-3 ">
                        <Text className="text-xs">{item.city}</Text>
                        <View className="w-2" />
                        <Text className="text-xs">{item.country}</Text>
                    </View>)}

                </View>
                <View className="px-3 w-full mt-3">
                    <View className=" flex-row justify-between">
                        <Text>{item.startdate.split(" ")[0]}</Text>
                        <Text>{getDateEnddate(item.startdate.split(" ")[0],item.duration)}</Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                        <View className="w-5 h-5 rounded-full bg-orange-500" />
                        <View className="bg-orange-200 flex-1 h-4">
                            <View style={{ width: '80%' }} className="bg-green-500 h-4 items-end">
                                <Text>Day 15</Text>
                            </View>
                        </View>

                        <View className="w-5 h-5 rounded-full bg-green-500" />
                    </View>
                </View> 
                <DayBooks />
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
                                    className={`w-12 h-24 ${isBooked ? 'bg-green-300' : 'bg-red-300'
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

