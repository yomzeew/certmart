import { SafeAreaView, View, Text, Linking, ScrollView, TouchableOpacity, Modal } from "react-native";
import Header from "./header";
import { Avatar, Divider } from "react-native-paper";
import { colorred } from "../../../constant/color";
import { useCallback, useEffect, useState } from "react";
import { fetchStudentClasses } from "../../../utils/api";
import moment from "moment";
import { FontAwesome } from "@expo/vector-icons";

const Classes = () => {
    const [data, setData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const fetchData = useCallback(async () => {
        try {
            const combinedData = await fetchStudentClasses();
            setData(combinedData,'0o');
            console.log(combinedData,'combinedData')
            setErrorMsg("");
        } catch (error) {
            
            setErrorMsg(error.message);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    const handleShowDetails = (item) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedItem(null);
    };

    return (
        <>
            <Modal
                visible={modalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={closeModal}
            >
                <View className="flex-1 bg-red-100">
                    <SafeAreaView className="flex-1">
                        <View className="px-4 py-3 bg-white shadow-sm">
                            <View className="flex-row items-center justify-between">
                                <TouchableOpacity onPress={closeModal} className="p-2">
                                    <Text className="text-lg font-bold text-gray-600">← Back</Text>
                                </TouchableOpacity>
                                <Text className="text-lg font-bold text-gray-800">Class Details</Text>
                                <View className="w-12" />
                            </View>
                        </View>

                        <ScrollView className="flex-1 px-3" showsVerticalScrollIndicator={false}>
                            {selectedItem && (
                                <View className="mt-4">
                                    <ClassesDetails item={selectedItem} onClose={closeModal} />
                                </View>
                            )}
                        </ScrollView>
                    </SafeAreaView>
                </View>
            </Modal>

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
                                    onPress={() => handleShowDetails(item)}
                                    className="relative mt-3"
                                >
                                    <View className="w-16 h-16 rounded-full items-center justify-center bg-red-400 absolute left-0 z-50">
                                        <Text className="text-lg">{index + 1}</Text>
                                    </View>
                                    <View className="bg-red-200 h-16 w-full rounded-full justify-center items-center pl-5">
                                        <Text className="text-sm">{item.course}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        }
                    </ScrollView>
                </View>
            </View>
        </>
    );
};

export default Classes;

const ClassesDetails = ({ item, onClose }) => {
    const handleEmailPress = () => {
        Linking.openURL(`mailto:${item.trainerEmail}`);
    };

    const handlePhonePress = () => {
        Linking.openURL(`tel:${item.trainerPhone}`);
    };

    const startDate = moment(item.startdate.split(" ")[0], "YYYY-MM-DD");
    const today = moment();
    const totalWeeks = item.duration;
    const totalDays = totalWeeks * 7; // Convert weeks to days
    const daysUsed = today.diff(startDate, "days");
    const percentageUsed = Math.min((daysUsed / totalDays) * 100, 100);

    return (
        <>
            <View className="h-auto py-4 w-full bg-white rounded-3xl px-4  shadow-lg border border-gray-100">
                {/* Header Section with Trainer Info */}
                <View className="w-full justify-center items-center">
                    {item.trainerDp ? (
                        <Avatar.Image
                            source={{
                                uri: `https://certmart.org/dps/${item.trainerDp}.jpg?timestamp=${new Date().getTime()}`,
                            }}
                            size={80}
                            className="shadow-md"
                        />
                    ) : (
                        <Avatar.Image
                            source={require("../../images/avatermale.png")}
                            size={80}
                            className="shadow-md"
                        />
                    )}
                    <View className="items-center mt-3">
                        <Text className="text-xl font-bold text-gray-800">
                            {item.trainerSurname} {item.trainerFirstname} {}
                        </Text>
                        <Text className="text-sm text-gray-500 mt-1">
                            Trainer ID: {item.trainerId}
                        </Text>

                        {/* Contact Buttons */}
                        <View className="flex-row mt-3 space-x-2">
                            <TouchableOpacity
                                className="bg-red-500 py-2 px-4 rounded-xl items-center shadow-sm border border-red-700"
                                onPress={handleEmailPress}
                                
                            >
                                <Text className="text-white font-medium text-sm">📧 Email</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="bg-blue-500 py-2 px-4 rounded-xl items-center shadow-sm"
                                onPress={handlePhonePress}
                            >
                                <Text className="text-white font-medium text-sm">📞 Call</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Course Progress Section */}
                <View className="mt-5 p-4 bg-gray-50 rounded-2xl">
                    <Text className="text-lg font-semibold text-gray-800 mb-3">Course Progress</Text>

                    {/* Date Range */}
                    <View className="flex-row justify-between items-center mb-4">
                        <View className="flex-row items-center">
                            <Text className="text-sm font-medium text-gray-600">Start:</Text>
                            <Text className="text-sm font-bold text-gray-800 ml-2">{startDate.format("MMM DD, YYYY")}</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Text className="text-sm font-medium text-gray-600">End:</Text>
                            <Text className="text-sm font-bold text-gray-800 ml-2">{startDate.add(totalDays, "days").format("MMM DD, YYYY")}</Text>
                        </View>
                    </View>

                    {/* Progress Bar */}
                    <View className="mb-2">
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-sm font-medium text-gray-600">Progress</Text>
                            <Text className="text-sm font-bold text-gray-800">{Math.round(percentageUsed)}% Complete</Text>
                        </View>
                        <View className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                            <View
                                style={{
                                    width: `${percentageUsed}%`,
                                    backgroundColor: percentageUsed >= 100 ? '#10b981' :  // Full green at 100%
                                                   percentageUsed >= 70 ? '#f59e0b' :   // Orange at 70%+
                                                   percentageUsed >= 50 ? '#3b82f6' :   // Blue at 50%+
                                                   percentageUsed >= 30 ? '#8b5cf6' :   // Purple at 30%+
                                                   '#ef4444'                            // Red below 30%
                                }}
                                className="h-3 rounded-full shadow-sm transition-all duration-300"
                            />
                        </View>
                        <Text className="text-xs text-gray-500 mt-1 text-center">{daysUsed} days elapsed</Text>
                    </View>
                </View>

                {/* Duration Info */}
                <View className="mt-4 p-3 bg-red-50 rounded-xl">
                    <View className="flex-row items-center justify-center">
                        <Text className="text-sm font-medium text-red-700">⏰ Course Duration</Text>
                        <Text className="text-lg font-bold text-red-800 ml-2">{item.duration} weeks</Text>
                    </View>
                </View>

                <DayBooks day={item.days} />
            </View>
        </>
    );
};

const DayBooks = ({ day }) => {
    const daysArray = day
        .trim()
        .split(/\s+/)
        .filter((day) => day);

    const dayMapping = {
        Sunday: "Sun",
        Monday: "Mon",
        Tuesday: "Tues",
        Wednesday: "Wed",
        Thursday: "Thur",
        Friday: "Fri",
        Saturday: "Sat",
    };

    const days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
    const bookedDaysShort = daysArray.map((fullDay) => dayMapping[fullDay]);

    const today = new Date();
    const weekDates = days.map((_, index) => {
        const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + index);
        return {
            day: date.getDate().toString().padStart(2, "0"),
            month: (date.getMonth() + 1).toString().padStart(2, "0"),
            isToday: date.toDateString() === today.toDateString()
        };
    });

    return (
        <>
            <View className="mt-5 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
                <Text className="text-lg font-bold text-gray-800 mb-4 text-center">📅 Training Schedule</Text>
                <Text className="text-sm text-gray-600 text-center mb-4">
                    Your booked training days for this week
                </Text>

                <View className="flex-row justify-center w-full">
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 16 }}
                        className="w-full"
                    >
                        <View className="flex-row justify-center">
                            {days.map((dayName, index) => {
                                const isBooked = bookedDaysShort.includes(dayName);
                                const dateInfo = weekDates[index];

                                return (
                                    <View key={index} className="items-center mx-1">
                                        <Text className={`text-xs font-medium mb-1 ${dateInfo.isToday ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                                            {dayName}
                                        </Text>
                                        <TouchableOpacity
                                            className={`w-14 h-16 rounded-2xl items-center justify-center shadow-sm ${
                                                isBooked
                                                    ? 'bg-gradient-to-br from-green-400 to-green-500 shadow-green-200'
                                                    : 'bg-gray-100 shadow-gray-200'
                                            } ${dateInfo.isToday ? 'ring-2 ring-blue-400' : ''}`}
                                        >
                                            <Text className={`text-xs font-bold ${isBooked ? 'text-white' : 'text-gray-400'}`}>
                                                {dateInfo.day}
                                            </Text>
                                            <Text className={`text-xs ${isBooked ? 'text-green-100' : 'text-gray-300'}`}>
                                                {dateInfo.month}
                                            </Text>
                                            {isBooked && (
                                                <View className="absolute -top-1 -right-1 w-4 h-4 bg-green-600 rounded-full items-center justify-center">
                                                    <Text className="text-white text-xs">✓</Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </View>
                    </ScrollView>
                </View>

                <View className="flex-row justify-center mt-4 space-x-4">
                    <View className="flex-row items-center">
                        <View className="w-3 h-3 bg-green-500 rounded-full mr-2"></View>
                        <Text className="text-xs text-gray-600">Booked Days</Text>
                    </View>
                    <View className="flex-row items-center">
                        <View className="w-3 h-3 bg-gray-300 rounded-full mr-2"></View>
                        <Text className="text-xs text-gray-600">Available</Text>
                    </View>
                </View>
            </View>
        </>
    );
};

