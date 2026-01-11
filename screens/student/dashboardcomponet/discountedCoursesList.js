import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { styles } from "../../../settings/layoutsetting";
import { StatusBar } from "expo-status-bar";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { colorred, certblue } from "../../../constant/color";
import { Divider, Avatar } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import Preloader from "../../preloadermodal/preloaderwhite";
import { fetchDiscountedCourses } from "../../../utils/api";
import { CourseDetailsModal } from "../../modals/coursesdetailsModal";
import PaymentScreenModal from "./dashboard/paymentScreen";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ITEMS_PER_PAGE = 5;

const DiscountedCoursesList = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const filterCourse = route.params?.filterCourse || null;
    
    const [courses, setCourses] = useState([]);
    const [showpreloader, setshowpreloader] = useState(false);
    const [showcontent, setshowcontent] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showpayment, setshowpayment] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [showsuccess, setshowsuccess] = useState(false);
    const [selected, setSelected] = useState(null);

    const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);
    const paginatedCourses = courses.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const fetchData = async () => {
        try {
            setshowpreloader(true);
            const response = await fetchDiscountedCourses();
            console.log("response.data", response);
            if (filterCourse) {
                const filtered = response.filter(item => item.courses === filterCourse);
                setCourses(filtered);
            } else {
                setCourses(response);
            }
        } catch (error) {
            console.error("Error fetching discounted courses:", error);
        } finally {
            setshowpreloader(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filterCourse]);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleCourseDetails = (course) => {
        const content = {
            ...course,
            dp: course.trainerdp?.replace(/^dps\//, '').replace(/\.jpg$/i, ''),
            surname: course.tsurname,
            course_cost: course.cost,
        };
        setSelectedCourse(content);
        setshowcontent(true);
    };

    const handlePayNow = (course) => {
        const paymentData = {
            ...course,
            dp: course.trainerdp?.replace(/^dps\//, '').replace(/\.jpg$/i, ''),
            c_course: course.course,
        };
        setSelected(paymentData);
        setshowpayment(true);
    };

    return (
        <>
            {showpreloader && (
                <View style={{ zIndex: 50, elevation: 50 }} className="absolute h-full w-full">
                    <Preloader />
                </View>
            )}
            <SafeAreaView style={[styles.andriod, styles.bgcolor, { flex: 1, width: '100%' }]}>
                <StatusBar style="dark" />
                <View className="w-full pt-[20px]">
                    <View className="w-full flex-row gap-x-2 items-center">
                        <TouchableOpacity
                            onPress={handleGoBack}
                            className="p-3 rounded-2xl item-center"
                        >
                            <FontAwesome name="arrow-left" size={12} color={colorred} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontWeight: '600', color: colorred }}>
                            🏷️ Discounts & Offers
                        </Text>
                    </View>
                    <Divider style={{ marginVertical: 10, backgroundColor: colorred }} />
                </View>

                <ScrollView className="flex-1 px-4">
                    {courses.length > 0 ? (
                        <>
                            {paginatedCourses.map((course, index) => (
                                <CourseDiscountCard 
                                    key={course.id || index}
                                    course={course}
                                    onPressDetails={handleCourseDetails}
                                    onPayNow={handlePayNow}
                                />
                            ))}
                            
                            {totalPages > 1 && (
                                <View style={{ paddingBottom: insets.bottom + 20 }} className="flex-row justify-center items-center py-4">
                                    <TouchableOpacity
                                        onPress={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
                                        className="px-4 py-2 bg-gray-200 rounded-l-lg"
                                    >
                                        <FontAwesome name="chevron-left" size={14} color="#374151" />
                                    </TouchableOpacity>
                                    
                                    <View className="px-4 py-2 bg-gray-100">
                                        <Text className="text-gray-700 font-semibold">
                                            {currentPage} / {totalPages}
                                        </Text>
                                    </View>
                                    
                                    <TouchableOpacity
                                        onPress={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
                                        className="px-4 py-2 bg-gray-200 rounded-r-lg"
                                    >
                                        <FontAwesome name="chevron-right" size={14} color="#374151" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </>
                    ) : (
                        <View className="items-center justify-center py-20">
                            <Text className="text-gray-500 text-center text-lg">
                                No discounted courses available
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>

            {showcontent && selectedCourse && (
                <CourseDetailsModal
                    content={selectedCourse}
                    setshowcontent={setshowcontent}
                    showcontent={showcontent}
                />
            )}

            {showpayment && selected && (
                <PaymentScreenModal
                    selected={selected}
                    setshowpayment={setshowpayment}
                    setShowLoader={setShowLoader}
                    setshowsuccess={setshowsuccess}
                />
            )}
        </>
    );
};



export default DiscountedCoursesList;

const CourseDiscountCard = ({ course, onPressDetails, onPayNow }) => {
  const navigation = useNavigation();

  const handleTrainerProfile = () => {
    if (course?.trainerid) {
      navigation.navigate("trainerProfileScreen", { 
        trainerid: course.trainerid, 
        trainerdp: course.trainerdp?.replace(/^dps\//, '').replace(/\.jpg$/i, '') 
      });
    }
  };

  const offer = parseFloat(course?.offer) || 1;

  return (
    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
      <View className="flex-row">
        <TouchableOpacity onPress={handleTrainerProfile}>
          <View>
            <Avatar.Image
              size={70}
              source={
                course?.trainerdp
                  ? {
                      uri: `https://certmart.org/${course.trainerdp}?timestamp=${new Date().getTime()}`,
                    }
                  : require("../../images/avatermale.png")
              }
            />
          </View>
        </TouchableOpacity>

        <View className="ml-4 flex-1">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-lg font-semibold">{course?.tsurname} {course?.tfirstname}</Text>
              <Text className="text-sm text-gray-600">
                {course?.classType} • {course?.duration} months
              </Text>
              <Text className="text-sm font-medium text-gray-800 mt-1">
                {course?.course}
              </Text>
            </View>
            {offer < 1 && (
              <View className="bg-red-100 px-2 py-1 rounded">
                <Text className="text-xs font-semibold text-red-600">
                  {((1 - offer) * 100).toFixed(0)}% OFF
                </Text>
              </View>
            )}
          </View>

          <View className="flex-row items-center justify-between mt-3">
            <View className="flex-row items-center">
              <Text className="text-base font-bold text-gray-900">
                ₦{course?.price?.toLocaleString()}
              </Text>
              {offer < 1 && (
                <Text className="text-xs text-gray-500 line-through ml-2">
                  ₦{parseInt(course?.cost)?.toLocaleString()}
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={() => onPressDetails(course)}
              className="px-3 py-2 rounded-lg bg-gray-100 items-center"
            >
              <FontAwesome5 name="file-alt" size={16} color={certblue} />
              <Text className="text-xs mt-1">Details</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => onPayNow(course)}
            style={{ backgroundColor: colorred }}
            className="w-full h-11 rounded-2xl mt-4 items-center justify-center"
          >
            <Text className="text-white font-medium text-base">
              Pay ₦{course?.price?.toLocaleString()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
