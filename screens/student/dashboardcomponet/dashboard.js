import { StatusBar } from "expo-status-bar";
import {
  Avatar,
  Surface,
  TextInput,
  Chip,
  Card,
  Button,
} from "react-native-paper";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
} from "react-native";
import { styles } from "../../../settings/layoutsetting";
import { colorred, grey } from "../../../constant/color";
import {
  FontAwesome5,
  FontAwesome,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Drawer } from "react-native-paper";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useState, useEffect } from "react";
import Header from "./header";
import Footer from "./footer";
import Categories from "./dashboard/categories";
import PopularCourses from "./dashboard/popularcourses";
import PopularCoursesdetails from "./dashboard/popularcoursedetails";
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

const Dashboard = () => {
  const [active, setActive] = useState("");
  const navigation = useNavigation();
  const [data, setdata] = useState([]);
  const [showpreloader, setshowpreloader] = useState(false);
  const [showmodalcourse, setshowmodalcourse] = useState(false);
  const [showopcity, setshowopcity] = useState(false);
  const [coursesdata, setcoursesdata] = useState([]);

  const fetchdata = async () => {
    try {
      setshowpreloader(true);
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(popularcourses, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.data);
      setdata(response.data.data);
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Error response:", error.response.data);
        console.log(error.response.data.error);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
      } else if (error.request) {
        // Request was made but no response received
        console.error("Error request:", error.request);
      } else {
        // Something else happened while setting up the request
        console.error("Error message:", error.message);
      }
    } finally {
      setshowpreloader(false);
    }
  };
  // to get student id
  const fetchStudentId = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.get(studentdetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response.data)
      if (response.status === 200) {
        const studentId = response.data.studentid;
        await AsyncStorage.setItem("studentid", studentId);
        console.log(studentId);
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Error response:", error.response.data);
        console.log(error.response.data.error);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
      } else if (error.request) {
        // Request was made but no response received
        console.error("Error request:", error.request);
      } else {
        // Something else happened while setting up the request
        console.error("Error message:", error.message);
      }
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
      const getdata = response.data.data;
      if (getdata.length > 0) {
        const getnewfilterarray = getdata.map((item, index) => item.course);
        console.log(getnewfilterarray);
        const uniqueSubjects = [...new Set(getnewfilterarray)];
        setcoursesdata(uniqueSubjects);
      } else {
        setcoursesdata([]);
        return;
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Error response:", error.response.data);
        console.log(error.response.data.error);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
      } else if (error.request) {
        // Request was made but no response received
        console.error("Error request:", error.request);
      } else {
        // Something else happened while setting up the request
        console.error("Error message:", error.message);
      }
    } finally {
      setshowpreloader(false);
    }
    translateY.value = withSpring(0);
    setshowmodalcourse(!showmodalcourse);
    setshowopcity(!showopcity);
  };
  const handlegetvalue = (value) => {
    const getvalue = value;
    console.log(value);
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
  return (
    <>
      {showopcity && (
        <View className="h-full w-full z-50  absolute bg-red-100 opacity-70" />
      )}
      {showmodalcourse && (
        <View className="bottom-0 absolute z-50">
          <Animated.View style={[animatedStyles]}>
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
        className="flex-1 flex w-full"
      >
        <StatusBar style="auto" />
        {showpreloader && (
          <View className="z-50 absolute h-full w-full">
            <Preloader />
          </View>
        )}
        <Header />
        <View className="items-center mt-3">
          <View className="w-full items-center justify-center flex">
            <View className="absolute z-50 top-3 right-16">
              <TouchableOpacity
                style={{ backgroundColor: colorred }}
                className="rounded-lg h-10 w-10 items-center flex justify-center"
              >
                <Text className="text-white">Go</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              label="Search"
              mode="outlined"
              theme={{ colors: { primary: grey, outline: grey } }}
              className="bg-white w-3/4 h-12"
              textColor="#000000"
            />
          </View>
        </View>
        <View className="flex-1">
          <ScrollView showsVerticalScrollIndicator={false}>
            <Categories
              handlecallbackvalue={(value) => handlepickcategories(value)}
            />
            <View className="px-3 mt-3">
              <View className="flex justify-between flex-row items-center">
                <Text style={{ fontSize: 16 }} className="font-semibold">
                  Popular Courses
                </Text>
                <TouchableOpacity>
                  <Text
                    style={{ color: colorred, fontSize: 14 }}
                    className="font-semibold"
                  >
                    See all
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                <PopularCourses data={data} />
              </ScrollView>
              <View className="mt-3 w-full">
                <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                  <PopularCoursesdetails data={data} />
                </ScrollView>
              </View>
            </View>
            <View className="mt-3 px-3">
              <View className="flex justify-between flex-row items-center">
                <Text style={{ fontSize: 16 }} className="font-semibold">
                  Top Trainers
                </Text>
                <TouchableOpacity>
                  <Text
                    style={{ color: colorred, fontSize: 14 }}
                    className="font-semibold"
                  >
                    See all
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="mt-2 w-full">
                <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                  <Toptrainer />
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        </View>
        <Footer />
      </SafeAreaView>
    </>
  );
};
export default Dashboard;
