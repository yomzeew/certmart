import { View, SafeAreaView, Text, ScrollView, TouchableOpacity ,RefreshControl } from "react-native";
import Header from "./header";
import { styles } from "../../../settings/layoutsetting";
import Preloader from "../../preloadermodal/preloaderwhite";
import { Divider} from "react-native-paper";
import { colorred } from "../../../constant/color";
import { useState,useCallback,useEffect } from 'react';
import {  FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { getCourseStatus } from "../../../settings/endpoint";
import { useNavigation } from "@react-navigation/native";

const CourseReg = () => {
    const navigation = useNavigation();
    const [showLoader, setShowLoader] = useState(false);
    const [datareg, setdatareg] = useState([]);
    const [data,setData]=useState([])
    const [coursesData,setCoursesData]=useState([])
    const [selectedCourse, setSelectedCourse] = useState(null); // Store the index of the selected course
    const [showsuccess,setshowsuccess]=useState(false)
    const [refreshing, setRefreshing] = useState(false);


    const handlenavigate=(courseid)=>{
        navigation.navigate('coursesdetail',{course:courseid})
    }
    const fetchData = useCallback(async () => {
        try {
          setShowLoader(true);
          const token = await AsyncStorage.getItem("token");
          const studentId = await AsyncStorage.getItem("studentid");
          const response = await axios.get(`${getCourseStatus}/approved?studentid=${studentId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(response.data,'response.dataokkkk')
          setData(response.data);
          setCoursesData(response.data); // Default to all courses
          const dataall=response.data
          if(dataall.length>0){
            const newArray=dataall.filter((item,index)=>(
                item.status==='Approved'

            ))
            setdatareg(newArray)
          }
          else{
            setCoursesData([])
          }
   
        } catch (error) {
          console.error("Error fetching data:", error.message);
        } finally {
          setShowLoader(false);
        }
      }, []);
    
      useEffect(() => {
        fetchData();
      }, [selectedCourse]);

      const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData().finally(() => setRefreshing(false));
      }, [fetchData]);
    

      
  

     const handlecancel=()=>{
        setshowsuccess(false)

     }
    return (
        <>
            {showLoader && (
                <View style={{zIndex:50,elevation:50}}  className="absolute h-full w-full">
                    <Preloader />
                </View>
            )}
            
            <View className="w-full h-full justify-center items-center ">
           
                <SafeAreaView
                    style={[styles.andriod, styles.bgcolor]}
                    className="flex flex-1 w-full"
                >
                    <Header />
                    <View className="px-5">
                        <Text style={{ fontSize: 20, color: colorred }} className="font-semibold">
                            Course Registration
                        </Text>
                        <Divider theme={{ colors: { primary: colorred } }} />
                    </View>
                    <ScrollView
                     style={{ marginTop: 16, paddingHorizontal: 12 }}
                     refreshControl={
                       <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colorred]} />
                     }
                    className="mt-10 px-3">
                        {datareg.length > 0 ? (
                            datareg.map((item, index) => (
                                <CourseRegistrationCard
                                    key={`${item.courseid}-${index}`}
                                    item={item}
                                    onPress={() => handlenavigate(item.courseid)}
                                />
                            ))
                        ) : (
                            <View className="items-center justify-center py-16">
                                <FontAwesome5 name="clipboard-list" size={48} color="#ccc" />
                                <Text className="text-gray-500 text-lg mt-4 text-center">No Course Registrations</Text>
                                <Text className="text-gray-400 text-sm mt-1 text-center">
                                    Your approved course registrations will appear here
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                </SafeAreaView>
            </View>
        </>
    );
};

const CourseRegistrationCard = ({ item, onPress }) => {
    // Get status color
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return '#10b981'; // green
            case 'pending':
            case 'in_progress':
                return '#f59e0b'; // yellow
            case 'rejected':
            case 'declined':
                return '#ef4444'; // red
            default:
                return '#6b7280'; // gray
        }
    };

    // Get class type icon
    const getClassTypeIcon = (classType) => {
        return classType?.toLowerCase() === 'virtual' ? 'laptop' : 'users';
    };

    // Format location
    const formatLocation = (item) => {
        if (item.centre === 'Virtual') {
            return 'Virtual';
        }
        return `${item.state || ''}, ${item.country || ''}`.replace(/^,|,$/g, '');
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden"
        >
            {/* Header */}
            <View className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-800 mb-1">
                            {item.course}
                        </Text>
                        <Text className="text-sm text-gray-600">
                            ID: {item.courseid}
                        </Text>
                    </View>
                    <View
                        className="px-3 py-1 rounded-full"
                        style={{ backgroundColor: getStatusColor(item.status) + '20' }}
                    >
                        <Text
                            className="text-xs font-semibold"
                            style={{ color: getStatusColor(item.status) }}
                        >
                            {item.status?.toUpperCase()}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Course Details */}
            <View className="px-4 py-3">
                <View className="flex-row items-center mb-3">
                    <FontAwesome5 name="book" size={14} color="#6b7280" />
                    <Text className="text-sm font-semibold text-gray-700 ml-2">Course Details</Text>
                </View>

                <View className="space-y-2">
                    <View className="flex-row items-center">
                        <FontAwesome5 name="map-marker-alt" size={12} color="#6b7280" />
                        <Text className="text-sm text-gray-600 ml-2">
                            Location: {formatLocation(item)}
                        </Text>
                    </View>

                    <View className="flex-row items-center">
                        <FontAwesome5 name={getClassTypeIcon(item.classType)} size={12} color="#6b7280" />
                        <Text className="text-sm text-gray-600 ml-2">
                            Class Type: {item.classType}
                        </Text>
                    </View>

                    <View className="flex-row items-center">
                        <FontAwesome5 name="id-card" size={12} color="#6b7280" />
                        <Text className="text-sm text-gray-600 ml-2">
                            CV: {item.cv}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Comment Section */}
            {item.comment && (
                <View className="px-4 py-2 bg-blue-50">
                    <View className="flex-row items-start">
                        <FontAwesome5 name="comment" size={12} color="#3b82f6" />
                        <Text className="text-sm text-gray-700 ml-2 flex-1">
                            {item.comment}
                        </Text>
                    </View>
                </View>
            )}

            {/* Decision Comment */}
            {item.decisioncomment && (
                <View className="px-4 py-2 bg-green-50">
                    <View className="flex-row items-start">
                        <FontAwesome5 name="check-circle" size={12} color="#10b981" />
                        <Text className="text-sm font-medium text-green-800 ml-2 flex-1">
                            Decision: {item.decisioncomment}
                        </Text>
                    </View>
                </View>
            )}

            {/* Footer */}
            <View className="bg-gray-50 px-4 py-3 flex-row justify-start items-center">
                <View className="flex-row items-center">
                    <FontAwesome5 name="user" size={12} color="#6b7280" />
                    <Text className="text-xs text-gray-600 ml-1">
                        Student ID: {item.studentid}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};
export default CourseReg;
