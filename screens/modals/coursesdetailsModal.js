import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import { FontAwesome, FontAwesome5, AntDesign } from "@expo/vector-icons";
import { Avatar } from "react-native-paper";

export const CourseDetailsModal = ({ content, setshowcontent, showcontent }) => {
  const handleshow = () => {
    setshowcontent(!showcontent);
  };

  const courseOutline = content?.courseoutline || null;

  const handledownloadCourseOutline = async () => {
    if (courseOutline) {
      const supported = await Linking.canOpenURL(courseOutline);
      if (supported) {
        await Linking.openURL(courseOutline);
      } else {
        Alert.alert("Not available", "No course outline available.");
      }
    } else {
      Alert.alert("Not available", "No course outline available.");
    }
  };

  return (
    <>
      {/* Overlay */}
      <View
        style={{ zIndex: 50, elevation: 50 }}
        className="h-full w-full absolute bg-black opacity-30"
      />

      {/* Modal */}
      <View
        style={{ zIndex: 60, elevation: 60 }}
        className="h-[85vh] bg-white rounded-t-3xl shadow-2xl w-full absolute bottom-0"
      >
        {/* Close Button */}
        <View className="absolute top-4 right-4 z-20">
          <TouchableOpacity onPress={handleshow}>
            <AntDesign name="closecircleo" size={32} color="red" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          className="h-full w-full"
        >
          {/* Hero Header */}
          <View className="px-6 pt-10 pb-6 bg-red-50 rounded-t-3xl">
            <View className="flex-row items-center">
              {/* Avatar */}
              <View className="mr-4">
                {content?.dp ? (
                  <Avatar.Image
                    size={70}
                    source={{
                      uri: `https://certmart.org/dps/${content.dp}.jpg?timestamp=${new Date().getTime()}`,
                    }}
                  />
                ) : (
                  <Avatar.Image
                    size={70}
                    source={require("../images/avatermale.png")}
                  />
                )}
              </View>

              {/* Title & Instructor */}
              <View className="flex-1">
                <Text className="text-xl font-bold text-gray-900 mb-1">
                  {content?.course || "Course Title"}
                </Text>
                <Text className="text-sm text-gray-600">
                  by{" "}
                  <Text className="font-semibold text-gray-800">
                    {content?.surname}
                  </Text>
                </Text>

                {/* Rating */}
                <View className="flex-row items-center mt-1">
                  <FontAwesome name="star" size={14} color="orange" />
                  <Text className="ml-1 text-sm font-medium text-gray-700">
                    {content?.avg_rating || "0"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Stats */}
          <View className="px-6 mt-4 flex-row flex-wrap justify-between">
            <View className="bg-gray-100 rounded-xl p-3 w-[48%] mb-3">
              <Text className="text-xs text-gray-500">⏱ Duration</Text>
              <Text className="font-semibold text-gray-800">
                {content?.duration || "0"} weeks
              </Text>
            </View>

            <View className="bg-gray-100 rounded-xl p-3 w-[48%] mb-3">
              <Text className="text-xs text-gray-500">📚 Type</Text>
              <Text className="font-semibold text-gray-800">
                {content?.classType || "N/A"}
              </Text>
            </View>

            <View className="bg-gray-100 rounded-xl p-3 w-[48%] mb-3">
              <Text className="text-xs text-gray-500">📅 Days</Text>
              <Text className="font-semibold text-gray-800">
                {content?.days?.trim() || "Not available"}
              </Text>
            </View>

            <View className="bg-gray-100 rounded-xl p-3 w-[48%] mb-3">
              <Text className="text-xs text-gray-500">🕐 Time</Text>
              <Text className="font-semibold text-gray-800">
                {content?.starttime?.substring(0, 5) || "TBD"} -{" "}
                {content?.endtime?.substring(0, 5) || "TBD"}{" "}
                {content?.timezone || ""}
              </Text>
            </View>
          </View>

          {/* Pricing */}
          <View className="px-6 mt-4 flex-row justify-between items-center">
            <View>
              <Text className="text-xs text-gray-500">Course Cost</Text>
              <Text className="text-lg font-bold text-gray-600 line-through">
                ₦
                {content?.course_cost
                  ? parseFloat(content.course_cost).toLocaleString()
                  : "0"}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-xs text-gray-500">Offer Price</Text>
              <Text className="text-2xl font-bold text-green-600">
                ₦
                {content?.price
                  ? parseFloat(content.price).toLocaleString()
                  : "0"}
              </Text>
            </View>
          </View>

          {/* Course Description */}
          <View className="px-6 mt-6">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              About this course
            </Text>
            <View className="bg-gray-50 p-4 rounded-xl shadow-sm">
              <Text className="text-sm text-gray-700 leading-5">
                {content?.description ||
                  "No course description available at the moment."}
              </Text>
            </View>
          </View>

          {/* Course Details */}
          <View className="px-6 mt-6">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              What you’ll learn
            </Text>
            <View className="bg-gray-50 p-4 rounded-xl shadow-sm">
              <Text className="text-sm text-gray-700 leading-5">
                {content?.details ||
                  "No further details available for this course."}
              </Text>
            </View>
          </View>

          {/* Download Outline */}
          <View className="px-6 mt-8">
            <TouchableOpacity
              onPress={handledownloadCourseOutline}
              className="h-12 bg-red-600 rounded-2xl flex-row justify-center items-center shadow-md"
            >
              <FontAwesome5 name="file-pdf" size={18} color="white" />
              <Text className="ml-2 text-white font-semibold">
                Download Course Outline
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
};
