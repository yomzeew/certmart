import { View, SafeAreaView, Text, ScrollView, RefreshControl, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect } from 'react';
import { Entypo, FontAwesome, FontAwesome5, AntDesign } from "@expo/vector-icons";
import { colorred } from "../../constant/color";
import PaymentScreen from "../paystacks/paystackwebview";
import axios from "axios";
import { BaseURi, classes } from "../../settings/endpoint";
import { Avatar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const CoursesRegModalPartone = () => {
    return (
        <View className="relative flex justify-center  items-center h-28">
            <View className="absolute right-0 z-50 bg-slate-50 rounded-full top-0">
                <FontAwesome name="check-circle" size={30} color="green" />
            </View>
            {/* <FontAwesome name="warning" size={24} color="red" /> */}
            <View className="rounded-full h-24 w-24 bg-red-300 absolute -left-5 z-50 flex justify-center items-center">
                <TouchableOpacity className="w-24 items-center">
                    <FontAwesome5 name="file" size="30" />
                    <Text className="text-xs text-center">View Course Outlined</Text>
                </TouchableOpacity>
            </View>
            <View className="rounded-2xl h-20 bg-red-200 w-5/6 flex-row justify-center items-center">
                <TouchableOpacity className="px-3 w-56 items-center">
                    <Text style={{ fontSize: 16 }} className="font-semibold text-center">Introduction to Machine Learning & AI</Text>
                    <View className="flex-row items-center justify-center mt-2">
                        <FontAwesome5 name="user" size={16} />
                        <Text className="text-xs ml-2">Adewale Femi</Text>
                        <View className="ml-2 flex-row">
                            <Text className="mr-1">4.2</Text>
                            <FontAwesome name="star" size={14} color="orange" />
                        </View>

                    </View>


                </TouchableOpacity>





            </View>


        </View>
    )
}




export const CoursesRegModalParttwo = ({ item }) => {

    const handleshowpayment = (value) => {
        console.log(value)

    }

    return (
        <>
            {/* <View className="absolute z-50 w-full">
            <PaymentScreen/>
        </View> */}
            <View className="bg-red-100 h-auto w-3/4 rounded-2xl p-3 ">
                <View className="">
                    <View className="flex-row">
                        <Entypo name="circle" size={14} color="red" />
                        <Text style={{ fontSize: 16 }} className="font-semibold ml-2">Course Introduction</Text>
                    </View>
                    <View className="px-5" >
                        <Text className="text-justify">
                            {item.description}
                        </Text>

                    </View>

                </View>
                <View className="mt-2">
                    <View className="flex-row">
                        <Entypo name="circle" size={14} color="red" />
                        <Text style={{ fontSize: 16 }} className="font-semibold ml-2">Mode</Text>
                    </View>
                    <View className="px-5" >
                        <Text className=" font-semibold">
                            {item.classType}
                        </Text>

                    </View>

                </View>
                <View className="mt-2">
                    <View className="flex-row">
                        <Entypo name="circle" size={14} color="red" />
                        <Text style={{ fontSize: 16 }} className="font-semibold ml-2">Hub Center</Text>
                    </View>
                    <View className="px-5 flex-row" >
                        <Text className=" font-semibold">
                            {item.center}
                        </Text>
                        <View className="ml-2 flex-row">
                            <Text className="mr-1">4.2</Text>
                            <FontAwesome name="star" size={14} color="orange" />
                        </View>

                    </View>

                </View>
                <View className="mt-2">
                    <View className="flex-row">
                        <Entypo name="circle" size={14} color="red" />
                        <Text style={{ fontSize: 16 }} className="font-semibold ml-2">Timing</Text>
                    </View>
                    <View className="px-5 flex-row" >
                        <Text className=" font-semibold">
                            3 Hours
                        </Text>

                    </View>

                </View>
                <View className="items-center w-full px-2 mt-3">
                    <TouchableOpacity style={{ backgroundColor: colorred }} className="w-full h-12 rounded-2xl items-center justify-center">
                        <Text className="text-white">Make Payment of {item.cost}</Text>
                    </TouchableOpacity>

                </View>


            </View>
        </>

    )
}
export const AvailableCourses = ({ setshowpayment, item, setShowLoader, setSelected, showsuccess }) => {
    const courseid = item.courseid
    console.log(courseid)
    const classtype = item.classtype
    const [data, setdata] = useState([])
    const [trainerdata, settrainerdata] = useState([])
    const [content, setcontent] = useState('')
    const [showcontent, setshowcontent] = useState(false)

    const fetchlistcourse = async () => {
        try {
            setShowLoader(true);

            const response = await axios.get(
                `${BaseURi}/traineravailabilites/${courseid}?orderBy=${classtype}`
            );

            setdata(response.data); // Set initial data
            console.log(response.data)
            if (response.data.length === 0) {
                Alert.alert('No Trainer available for this course at this time');
            }

        } catch (error) {
            console.error("Error fetching course list:", error.message);
        } finally {
            setShowLoader(false);
        }
    };

    const getalleventidforpaidcourse = async () => {
        try {
            const studentId = await AsyncStorage.getItem("studentid");
            if (!studentId) {
                throw new Error("Student ID not found");
            }

            const token = await AsyncStorage.getItem("token");
            if (!token) {
                throw new Error("Authorization token not found");
            }

            console.log("Fetching paid courses...");
            const response = await axios.get(
                `${classes}/students?id=${studentId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const paidCourses = response.data;
            console.log("Fetched paid courses:", paidCourses);

            if (Array.isArray(paidCourses) && paidCourses.length > 0) {
                setdata((prevData) => {
                    const updatedData = prevData.map((course) => {
                        const matchingPaidCourse = paidCourses.find(
                            (paid) => paid.eventid === course.eventcode
                        );

                        if (matchingPaidCourse) {
                            return {
                                ...course,
                                paymentstatus: matchingPaidCourse.paymentstatus,
                            };
                        }

                        return course;
                    });

                    console.log("Updated data after merge:", updatedData);
                    if (updatedData.length > 0) {
                        return updatedData;
                    }
                    else {
                        return data
                    }


                });
            } else {
                console.warn("No paid courses found or empty response.");
            }
        } catch (error) {
            console.error("Error fetching paid courses or merging data:", error.message);
        }
    };


    useEffect(() => {
        fetchlistcourse();
        getalleventidforpaidcourse()
    }, []);

    useEffect(() => {
        getalleventidforpaidcourse()
    }, [item, showsuccess])

    const handleshow = (value = '') => {
        setcontent(value)
        setshowcontent(!showcontent)

    }
    const handlepayment = (item) => {
        setshowpayment(true)
        setSelected(item)

    }
    return (
        <>
            {showcontent && <View className="h-auto  justify-center bg-red-300 rounded-2xl   w-full absolute z-50 flex items-center py-3">


                <View className="absolute right-0 -top-2">
                    <TouchableOpacity onPress={() => handleshow()}><AntDesign name="upcircle" size={30} color="red" /></TouchableOpacity>
                </View>
                <View className="items-start">
                    <View className="flex-row items-center">
                        <View className="items-center">
                            {content.dp ? <Avatar.Image source={{ uri: `https://certmart.org/dps/${content.dp}.jpg?timestamp=${new Date().getTime()}` }} /> : <Avatar.Image source={require('../images/avatermale.png')} />}
                            <View className="ml-2 flex-row">
                                <Text className="mr-1">{content.avg_rating}</Text>
                                <FontAwesome name="star" size={14} color="orange" />
                            </View>
                        </View>
                        <View className="w-2" />
                        <View>
                            <View className="flex-row items-center  mt-2">
                                <FontAwesome5 name="user" size={16} />
                                <Text className="text-xs ml-2">{content.firstname} {content.surname}</Text>

                            </View>

                            <View className="mt-2">
                                <Text>{content.classType} </Text>
                                <Text>Duration:{content.duration}weeks</Text>
                            </View>
                            <View className="mt-2">
                                <Text>{content.days} </Text>
                                <Text>Time:{content.starttime}-{content.endtime} {content.timezone}</Text>
                                <Text></Text>
                            </View>

                        </View>

                    </View>
                    <View className="w-[75vw] border border-red-200" />
                    <View><Text className="font-semibold">Description:</Text></View>
                    <View className="bg-white px-3 py-3 rounded-2xl w-5/6 ">
                        <Text>{content.description}</Text>

                    </View>

                </View>


            </View>}
            <ScrollView>
                {data.length > 0 && data.map((item, index) =>

                (
                    <View className="rounded-2xl w-[75vw] p-3 bg-red-200 mt-3">
                        <View className="absolute right-0 z-50 bg-slate-50 rounded-full top-0">
                            {item?.paymentstatus === undefined ? <FontAwesome name="check-circle" size={30} color="orange" /> : <FontAwesome name="check-circle" size={30} color="green" />}
                        </View>
                        <View className="flex-row relative items-center">
                            <View className="rounded-full h-24 w-24 bg-red-300 absolute -right-5 z-50 flex justify-center items-center">
                                <TouchableOpacity onPress={() => handleshow(item)} className="w-24 items-center">
                                    <FontAwesome5 name="file" size={30} />
                                    <Text className="text-sm text-center">View More Details</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="items-center">
                                {item.dp ? <Avatar.Image source={{ uri: `https://certmart.org/dps/${item.dp}.jpg?timestamp=${new Date().getTime()}` }} /> : <Avatar.Image source={require('../images/avatermale.png')} />}
                                <View className="ml-2 flex-row">
                                    <Text className="mr-1">
                                        {item?.avg_rating
                                            ? parseFloat(item.avg_rating).toFixed(2).replace(/\.00$/, '')  // Convert back to float, remove trailing .00
                                            : 'N/A'}</Text>
                                    <FontAwesome name="star" size={14} color="orange" />
                                </View>
                            </View>
                            <View className="w-2" />
                            <View>
                                <View className="flex-row items-center justify-center mt-2">
                                    <FontAwesome5 name="user" size={16} />
                                    <Text className="text-xs ml-2">{item.firstname} {item.surname}</Text>

                                </View>

                                <View className="mt-2">
                                    <Text>{item.classType} </Text>
                                    <Text>Duration:{item.duration}weeks</Text>
                                    <Text></Text>
                                </View>
                            </View>

                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                if (item?.paymentstatus === undefined) handlepayment(item);
                            }}
                            className={`w-full h-10 rounded-2xl mt-2 items-center justify-center ${item?.paymentstatus === undefined ? 'bg-red-500' : 'bg-green-500'
                                }`}
                        >
                            <Text className="text-white">
                                {item?.paymentstatus === undefined
                                    ? `Make payment of ₦${item.taval_cost}.00`
                                    : 'Payment Complete'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                ))}
            </ScrollView>
        </>
    )
}
