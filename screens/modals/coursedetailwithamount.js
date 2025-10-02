import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect } from "react";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import { BaseURi, classes } from "../../settings/endpoint";
import { Avatar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const DirectPayment = ({
  item,
  setShowLoader,
  showcontent,
  content,
  setcontent,
  setshowcontent,
  onClickPayment,
}) => {
  const [data, setdata] = useState([]);
  const [showsuccess, setshowsuccess] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Virtual");
  const [isLoading, setIsLoading] = useState(true);

  const courseid = item?.courseid || item?.courses;
  const classtype = item?.classtype;

  const fetchlistcourse = async () => {
    if (!courseid) {
      setIsLoading(false);
      return;
    }

    try {
      setShowLoader(true);
      const token = await AsyncStorage.getItem("token");

      const response = await axios.get(`${BaseURi}/traineravailabilites/${courseid}?orderBy=${classtype}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setdata(response.data || []);
    } catch (error) {
      console.error("Error fetching course list:", error.message);
      setdata([]);
    } finally {
      setShowLoader(false);
      setIsLoading(false);
    }
  };

  const getalleventidforpaidcourse = async () => {
    try {
      const studentId = await AsyncStorage.getItem("studentid");
      const token = await AsyncStorage.getItem("token");
      if (!studentId || !token) return;

      const response = await axios.get(`${classes}/students?id=${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const paidCourses = response.data;
      if (Array.isArray(paidCourses) && paidCourses.length > 0) {
        setdata((prevData) =>
          prevData.map((course) => {
            const matchingPaidCourse = paidCourses.find(
              (paid) => paid.eventid === course.eventcode
            );
            return matchingPaidCourse
              ? { ...course, paymentstatus: matchingPaidCourse.paymentstatus }
              : course;
          })
        );
      }
    } catch (error) {
      console.error("Error fetching paid courses:", error.message);
    }
  };

  useEffect(() => {
    fetchlistcourse();
    getalleventidforpaidcourse();
  }, [courseid]);

  useEffect(() => {
    getalleventidforpaidcourse();
  }, [item, showsuccess]);

  const handleshow = (value = "") => {
    setcontent(value);
    setshowcontent(!showcontent);
  };

  const filteredData = data.filter(
    (trainer) => trainer.classType?.toLowerCase() === selectedTab.toLowerCase()
  );

  if (isLoading) {
    return (
      <View className="w-full items-center flex-1 py-10">
        <Text className="text-gray-500">Loading trainers...</Text>
      </View>
    );
  }

  return (
    <View className="w-full items-center flex-1">
      <View className="flex-row justify-around w-full bg-gray-200 py-2 rounded-xl mb-3">
        {["Virtual", "Physical", "Exam"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-lg ${
              selectedTab === tab ? "bg-red-500" : "bg-white"
            }`}
          >
            <Text
              className={`${
                selectedTab === tab ? "text-white font-bold" : "text-black"
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView 
      contentContainerStyle={{paddingBottom:60}}
      className="w-full"
      >
        {filteredData.length > 0 ? (
          filteredData.map((trainer, index) => (
            <View
              key={index}
              className="rounded-2xl w-full p-4 bg-white mt-4 shadow-md"
            >
              <View className="absolute right-3 top-3">
                {trainer?.paymentstatus === undefined ? (
                  <FontAwesome name="exclamation-circle" size={24} color="orange" />
                ) : (
                  <FontAwesome name="check-circle" size={24} color="green" />
                )}
              </View>

              <View className="flex-row items-center">
                <Avatar.Image
                  size={70}
                  source={
                    trainer.dp
                      ? {
                          uri: `https://certmart.org/dps/${trainer.dp}.jpg?timestamp=${new Date().getTime()}`,
                        }
                      : require("../images/avatermale.png")
                  }
                />

                <View className="ml-4 flex-1">
                  <Text className="text-lg font-semibold">{trainer.surname}</Text>
                  <Text className="text-sm text-gray-600">
                    {trainer.classType} • {trainer.duration} weeks
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="mr-1 text-sm">
                      {trainer?.avg_rating
                        ? parseFloat(trainer.avg_rating)
                            .toFixed(1)
                            .replace(/\.0$/, "")
                        : "N/A"}
                    </Text>
                    <FontAwesome name="star" size={14} color="orange" />
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => handleshow(trainer)}
                  className="px-3 py-2 rounded-lg bg-gray-100"
                >
                  <FontAwesome5 name="file-alt" size={16} />
                  <Text className="text-xs mt-1">Details</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => {
                  if (trainer?.paymentstatus === undefined)
                    onClickPayment(trainer);
                }}
                className={`w-full h-11 rounded-2xl mt-4 items-center justify-center ${
                  trainer?.paymentstatus === undefined
                    ? "bg-red-500"
                    : "bg-green-500"
                }`}
              >
                <Text className="text-white font-medium text-base">
                  {trainer?.paymentstatus === undefined
                    ? `Pay ₦${trainer.price}.00`
                    : "Payment Complete"}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text className="text-center text-gray-500 mt-5">
            No trainers available for {selectedTab}.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};
