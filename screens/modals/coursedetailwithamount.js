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
  const [selectedTab, setSelectedTab] = useState("Virtual"); // 👈 Default tab

  const courseid = item?.courseid || item?.courses;
  const classtype = item?.classtype;

  const fetchlistcourse = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      setShowLoader(true);

      const response = await axios.get(`${BaseURi}/traineravailabilites/${courseid}?orderBy=${classtype}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setdata(response.data);
      if (response.data.length === 0) {
       return
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

  // ✅ Filter trainers by selected tab
  const filteredData = data.filter(
    (trainer) => trainer.classType?.toLowerCase() === selectedTab.toLowerCase()
  );

  console.log(filteredData, "filteredData");

  return (
    <View className="w-full items-center flex-1">
      {/* 👇 Tabs Section */}
      <View className="flex-row justify-around w-full bg-gray-200 py-2 rounded-xl">
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

      <ScrollView className="w-full mt-3">
        {filteredData.length > 0 ? (
          filteredData.map((trainer, index) => (
            <View
              key={index}
              className="rounded-2xl w-full p-3 bg-red-200 mt-3"
            >
              {/* Payment Status Icon */}
              <View
                style={{ zIndex: 50, elevation: 50 }}
                className="absolute right-0 bg-slate-50 rounded-full top-0"
              >
                {trainer?.paymentstatus === undefined ? (
                  <FontAwesome
                    name="check-circle"
                    size={30}
                    color="orange"
                  />
                ) : (
                  <FontAwesome name="check-circle" size={30} color="green" />
                )}
              </View>

              {/* Trainer Info */}
              <View className="flex-row relative items-center">
                <View
                  style={{ zIndex: 40, elevation: 40 }}
                  className="rounded-full h-24 w-24 bg-red-300 absolute -right-5 flex justify-center items-center"
                >
                  <TouchableOpacity
                    onPress={() => handleshow(trainer)}
                    className="w-24 items-center"
                  >
                    <FontAwesome5 name="file" size={30} />
                    <Text className="text-sm text-center">
                      View More Details 
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="items-center">
                  {trainer.dp ? (
                    <Avatar.Image
                      source={{
                        uri: `https://certmart.org/dps/${trainer.dp}.jpg?timestamp=${new Date().getTime()}`,
                      }}
                    />
                  ) : (
                    <Avatar.Image
                      source={require("../images/avatermale.png")}
                    />
                  )}
                  <View className="ml-2 flex-row">
                    <Text className="mr-1">
                      {trainer?.avg_rating
                        ? parseFloat(trainer.avg_rating)
                            .toFixed(2)
                            .replace(/\.00$/, "")
                        : "N/A"}
                    </Text>
                    <FontAwesome name="star" size={14} color="orange" />
                  </View>
                </View>

                <View className="w-2" />
                <View>
                  <View className="flex-row items-center justify-center mt-2">
                    <FontAwesome5 name="user" size={16} />
                    <Text className="text-xs ml-2">{trainer.surname}</Text>
                  </View>

                  <View className="mt-2">
                    <Text>{trainer.classType} </Text>
                    <Text>Duration: {trainer.duration} weeks</Text>
                  </View>
                </View>
              </View>

              {/* Payment Button */}
              <TouchableOpacity
                onPress={() => {
                  if (trainer?.paymentstatus === undefined)
                    onClickPayment(trainer);
                }}
                className={`w-full h-10 rounded-2xl mt-2 items-center justify-center ${
                  trainer?.paymentstatus === undefined
                    ? "bg-red-500"
                    : "bg-green-500"
                }`}
              >
                <Text className="text-white">
                  {trainer?.paymentstatus === undefined
                    ? `Make payment of ₦${trainer.price}.00`
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
