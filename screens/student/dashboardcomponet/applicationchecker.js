import {
    View,
    SafeAreaView,
    Text,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
  } from "react-native";
  import Header from "./header";
  import { styles } from "../../../settings/layoutsetting";
  import CoursesVerifyModal from "../../modals/courseverifyModal";
  import Preloader from "../../preloadermodal/preloaderwhite";
  import { getCourseStatus } from "../../../settings/endpoint";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { Divider } from "react-native-paper";
  import { colorred } from "../../../constant/color";
  import { useState, useEffect, useCallback } from "react";
  import axios from "axios";
  
  const ApplicationCheckers = () => {
    const [coursesData, setCoursesData] = useState([]);
    const [showLoader, setShowLoader] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState([]);
  
    const fetchData = useCallback(async () => {
      try {
        setShowLoader(true);
        const token = await AsyncStorage.getItem("token");
        const studentId = await AsyncStorage.getItem("studentid");
        const response = await axios.get(`${getCourseStatus}/all?studentid=${studentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data)
        setData(response.data);
        setCoursesData(response.data); // Default to all courses
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setShowLoader(false);
      }
    }, []);
  
    useEffect(() => {
      fetchData();
    }, [fetchData]);
  
    const onRefresh = useCallback(() => {
      setRefreshing(true);
      fetchData().finally(() => setRefreshing(false));
    }, [fetchData]);
  
    const handleData = useCallback(
      (status = "") => {
        if (data.length > 0) {
          const filteredData = status
            ? data.filter((item) => item.status === status)
            : data; // Default to all courses if no status
          setCoursesData(filteredData);
        }
      },
      [data]
    );
  
    return (
      <>
        {showLoader && (
          <View style={{ position: "absolute", zIndex: 50, height: "100%", width: "100%" }}>
            <Preloader />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <SafeAreaView style={[styles.andriod, styles.bgcolor]}>
            <Header />
            <View style={{ paddingHorizontal: 16 }}>
              <Text style={{ fontSize: 20, color: colorred, fontWeight: "bold" }}>
                Course Verification
              </Text>
              <Divider theme={{ colors: { primary: colorred } }} />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 12 }}>
              <TouchableOpacity onPress={() => handleData("")}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ backgroundColor: "gray", width: 16, height: 16 }} />
                  <Text style={{ fontSize: 16, marginLeft: 8 }}>All</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleData("Applied")}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ backgroundColor: "orange", width: 16, height: 16 }} />
                  <Text style={{ fontSize: 16, marginLeft: 8 }}>Pending</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleData("Approved")}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ backgroundColor: "green", width: 16, height: 16 }} />
                  <Text style={{ fontSize: 16, marginLeft: 8 }}>Approved</Text>
                </View>
              </TouchableOpacity>
            </View>
            <ScrollView
              style={{ marginTop: 16, paddingHorizontal: 12 }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colorred]} />
              }
            >
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {coursesData.length > 0 ? (
                  coursesData.map((row, index) => <CoursesVerifyModal key={index} data={row} />)
                ) : (
                  <View>
                    <Text style={{ color: colorred }}>There are no courses available</Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </>
    );
  };
  
  export default ApplicationCheckers;
  