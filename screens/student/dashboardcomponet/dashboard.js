import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { styles } from "../../../settings/layoutsetting";
import { colorred } from "../../../constant/color";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withTiming,
  interpolate,
  Extrapolate,
  withSpring,
} from "react-native-reanimated";
import Header from "./header";
import Categories from "./dashboard/categories";
import PopularCourses from "./dashboard/popularcourses";
import {
  coursescategoriesfilter,
  popularcourses,
  studentdetails,
} from "../../../settings/endpoint";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Preloader from "../../preloadermodal/preloaderwhite";
import DisplayModal from "../../modals/datadisplay";
import Toptrainer from "./dashboard/toptrainer";
import { fetchallavailablecourse } from "./fetchdata";
import CustomTextInput from "../../../components/CustomTextInput";
import { useDispatch } from "react-redux";
import { login } from "../../../store/sliceReducer";
import PopularCoursesCard from "./dashboard/popularcourseCard";
import { FontAwesome5 } from "@expo/vector-icons";
import BannerDisplay from "../../modals/BannerDisplay";
import NextClassAppointment from "./dashboard/nextClassAppointment";
import ImageDisplay from "../../modals/imageDisplay";

const Dashboard = () => {
  const navigation = useNavigation();

  if (!navigation) {
    console.warn("Navigation context not available");
    return null;
  }

  const [data, setdata] = useState([]);
  const [showpreloader, setshowpreloader] = useState(false);
  const [showmodalcourse, setshowmodalcourse] = useState(false);
  const [showopcity, setshowopcity] = useState(false);
  const [coursesdata, setcoursesdata] = useState([]);
  const [showModal, setshowModal] = useState(false);
  const [availablecourse, setavailablecourse] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      setshowpreloader(false);
      setshowModal(false);
      setshowopcity(false);
      setshowmodalcourse(false);
    }, [])
  );

  const fetchdata = async () => {
    try {
      setshowpreloader(true);
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(popularcourses, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setdata(response.data.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setshowpreloader(false);
    }
  };

  const fetchStudentId = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(studentdetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        dispatch(login(response.data));
        await AsyncStorage.setItem("studentid", response.data.studentid);
      }
    } catch (error) {
      console.error("Error fetching student ID:", error);
    }
  };

  useEffect(() => {
    fetchdata();
    fetchStudentId();
  }, []);

  const translateY = useSharedValue(300);
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handlepickcategories = async (value) => {
    try {
      setshowpreloader(true);
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${coursescategoriesfilter}category=${value}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const getdata = response.data;
      if (getdata.length > 0) {
        const getnewfilterarray = getdata.map((item) => item.course);
        const uniqueSubjects = [...new Set(getnewfilterarray)];
        setcoursesdata(uniqueSubjects);
      } else {
        setcoursesdata([]);
      }
    } catch (error) {
      console.error("Error filtering category:", error);
    } finally {
      setshowpreloader(false);
    }
    translateY.value = withSpring(0);
    setshowmodalcourse(true);
    setshowopcity(true);
  };

  const handlegetvalue = (value) => {
    setshowmodalcourse(false);
    setshowopcity(false);
    translateY.value = withSpring(300);
    navigation.navigate("couseravailable", { course: value });
  };

  const handleclose = (value) => {
    setshowopcity(false);
    setshowmodalcourse(value);
    translateY.value = withSpring(300);
  };

  const handlegetallcourses = () => {
    fetchallavailablecourse(setshowpreloader)
      .then((courses) => {
        setavailablecourse(courses);
        setFilteredCourses(courses);
      })
      .catch((error) => {
        console.error("Failed to fetch courses:", error);
      });
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === "") {
      setFilteredCourses(availablecourse);
    } else {
      const filtered = availablecourse.filter((course) =>
        course.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  };

  useEffect(() => {
    handlegetallcourses();
  }, []);

  // 🔥 Reanimated scroll animation setup
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const fadeUpStyle = useAnimatedStyle(() => {
    // smoothly fade out after 150px scroll, and fade back in when scrolling down
    const opacity = interpolate(
      scrollY.value,
      [0, 100, 200],
      [1, 0.5, 0],
      Extrapolate.CLAMP
    );
  
    const translateY = interpolate(
      scrollY.value,
      [0, 200],
      [0, -30],
      Extrapolate.CLAMP
    );
  
    return {
      opacity: withTiming(opacity, { duration: 250 }),
      transform: [{ translateY: withTiming(translateY, { duration: 250 }) }],
    };
  });
  
  return (
    <>
      {showModal && (
        <>
          <View
            style={{
              zIndex: 50,
              elevation: 50,
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
            className="h-full w-full absolute justify-end"
          />

          <View
            style={{ zIndex: 50, elevation: 50 }}
            className="h-[85vh] w-full bg-white bottom-0 absolute rounded-t-3xl"
          >
            <TouchableOpacity
              onPress={() => {
                setshowModal(false);
                setSearchText("");
              }}
              className="absolute right-4 top-4 z-50"
            >
              <FontAwesome5 name="times" size={22} color="#333" />
            </TouchableOpacity>

            <View className="items-center pt-4 pb-2">
              <View className="w-12 h-1 bg-gray-300 rounded-full"></View>
            </View>
            <View className="px-4 pb-4">
              <Text className="text-lg font-bold text-gray-800 text-center mb-4">
                Available Courses
              </Text>
              <Text className="text-gray-600 text-center text-sm mb-4">
                Select a course to view details
              </Text>

              <View className="flex-row justify-between items-center bg-gray-50 rounded-xl px-3 py-2 mb-4 border border-gray-200">
                <CustomTextInput
                  placeholder="Search courses..."
                  value={searchText}
                  onChangeText={handleSearch}
                  className="flex-1 ml-3 bg-transparent w-64"
                  placeholderTextColor="#666"
                />
                <FontAwesome5 name="search" size={16} color="#666" />
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handlegetvalue(item)}
                    className="bg-gray-50 mx-4 mb-3 p-4 rounded-xl border border-gray-100"
                  >
                    <View className="flex-row items-center">
                      <View className="w-3 h-3 bg-green-500 rounded-full mr-3"></View>
                      <Text
                        style={{ fontSize: 16 }}
                        className="font-medium text-gray-800 flex-1"
                      >
                        {item}
                      </Text>
                      <FontAwesome5 name="chevron-right" size={14} color="#666" />
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View className="items-center justify-center py-10">
                  <FontAwesome5 name="search" size={48} color="#ccc" />
                  <Text className="text-gray-500 text-center mt-4">
                    {searchText ? "No courses found" : "No courses available"}
                  </Text>
                  <Text className="text-gray-400 text-center text-sm mt-1">
                    {searchText
                      ? "Try a different search term"
                      : "Courses will appear here when available"}
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </>
      )}

      {showmodalcourse && (
        <View
          style={{ zIndex: 50, elevation: 50 }}
          className="bottom-0 absolute h-full w-full "
        >
          <View className="z-50 absolute h-full w-full bg-black opacity-50" />
          <Animated.View style={[animatedStyles]} className="z-50 elevation-50">
            <DisplayModal
              data={coursesdata}
              close={(value) => handleclose(value)}
              getvaluefunction={(value) => handlegetvalue(value)}
            />
          </Animated.View>
        </View>
      )}

      <SafeAreaView
        style={[styles.andriod, styles.bgcolor]}
        className="flex-1 w-full"
      >
        <StatusBar style="dark" />
        {showpreloader && (
          <View
            style={{ zIndex: 50, elevation: 50 }}
            className=" absolute h-full w-full"
          >
            <Preloader />
          </View>
        )}

        <Header />

        {/* Animated ScrollView */}
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          {/* Animated Welcome + Banner */}
          <Animated.View style={[fadeUpStyle]}>
            <View className="px-4 mt-4">
              <View className="items-center mb-3">
                <Text className="text-2xl font-bold text-gray-800 mb-2">
                  Welcome Back! 👋
                </Text>
                <Text className="text-gray-600 text-center">
                  Discover amazing courses and enhance your skills
                </Text>
              </View>
            </View>
            <View className="px-4">
              <BannerDisplay />
            </View>
          </Animated.View>

          {/* Categories */}
          <View className="px-4 mt-3">
            <Categories
              handlecallbackvalue={(value) => handlepickcategories(value)}
              setshowModal={setshowModal}
              showModal={showModal}
              handleactionseeall={handlegetallcourses}
            />
          </View>

          <NextClassAppointment />

          {/* Popular Courses */}
          <View className="px-4 mt-3">
            <View className="flex-row justify-between items-center  ">
              <Text className="text-lg font-bold text-gray-800">
                ⭐ Popular Courses
              </Text>
            </View>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal>
              <PopularCourses
                data={data}
                setshowModal={setshowModal}
                showModal={showModal}
                handleactionseeall={handlegetallcourses}
              />
            </ScrollView>
            <View className="mt-4">
              <PopularCoursesCard
                data={data}
                setshowModal={setshowModal}
                showModal={showModal}
                handleshowmodal={handlegetallcourses}
              />
            </View>
          </View>

          {/* Top Trainers */}
          <View className="px-4 mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-800">
                👨‍🏫 Top Trainers
              </Text>
            </View>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal
              contentContainerStyle={{ paddingRight: 20 }}
            >
              <Toptrainer />
            </ScrollView>
          </View>
        </Animated.ScrollView>

        <ImageDisplay />
      </SafeAreaView>
    </>
  );
};

export default Dashboard;
