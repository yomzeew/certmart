import { View, SafeAreaView, Text, ScrollView, RefreshControl, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect } from 'react';
import { Entypo, FontAwesome, FontAwesome5, AntDesign } from "@expo/vector-icons";
import { colorred } from "../../constant/color";
import PaymentScreen from "../paystacks/paystackwebview";
import axios from "axios";
import { BaseURi, classes } from "../../settings/endpoint";
import { Avatar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PaymentScreenModal from "../student/dashboardcomponet/dashboard/paymentScreen";
export const DirectPayment = ({  item, setShowLoader,showcontent,content,setcontent,setshowcontent }) => {
    const [selected,setSelected]=useState('')
    const [showpayment,setshowpayment]=useState(false)
    const [showsuccess,setshowsuccess]=useState(false)
    const courseid = item?.courseid || item?.courses
    console.log('coursenew',courseid)
    const classtype = item.classtype
    const [data, setdata] = useState([])
    const [trainerdata, settrainerdata] = useState([])


    const fetchlistcourse = async () => {
        try {
            setShowLoader(true);

            const response = await axios.get(
                `${BaseURi}/traineravailabilites/${courseid}?orderBy=${classtype}`
            );

            setdata(response.data); // Set initial data
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
    }, [courseid]);

    useEffect(() => {
        getalleventidforpaidcourse()
    }, [item, showsuccess])

    const handleshow = (value = '') => {
        setcontent(value)
        setshowcontent(!showcontent)
        console.log('fd')
    }
    const handlepayment = (item) => {
        setshowpayment(true)
        setSelected(item)

    }
    return (
        <>
            {showpayment &&
                    <PaymentScreenModal
                    selected={selected}
                    setshowpayment={setshowpayment}
                    setShowLoader={setShowLoader}
                    setshowsuccess={setshowsuccess}
                    />

                } 
            <ScrollView>
                {data.length > 0 && data.map((item, index) =>

                (
                    <View className="rounded-2xl w-[75vw] p-3 bg-red-200 mt-3">
                        <View className="absolute right-0 z-50 bg-slate-50 rounded-full top-0">
                            {item?.paymentstatus === undefined ? <FontAwesome name="check-circle" size={30} color="orange" /> : <FontAwesome name="check-circle" size={30} color="green" />}
                        </View>
                        <View className="flex-row relative items-center">
                            <View className="rounded-full h-24 w-24 bg-red-300 absolute -right-5 z-40 flex justify-center items-center">
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