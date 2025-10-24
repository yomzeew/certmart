import { useSelector } from 'react-redux';
import { getCertificate } from './fetchdata';
import { useEffect, useState } from 'react';
import { styles } from '../../../settings/layoutsetting';
import { SafeAreaView, View, Text, ScrollView,TouchableOpacity, ActivityIndicator,Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Header from './header';
import { colorred } from '../../../constant/color';
import { Divider } from "react-native-paper";
import {  FontAwesome5 } from '@expo/vector-icons';
import { downloadFile } from '../../../utility/downloadfunction';
import showToast from '../../../utils/showToast';
import * as Linking from 'expo-linking';


const Certificate = () => {
    const [preloader, setPreloader] = useState(false)
    const [data,setdata]=useState([])
    const user = useSelector((state) => state.activePage.user);
    console.log(user)
    const studentId = user.studentid
    const handledata = async () => {
        const resdata = await getCertificate(studentId)
        console.log(resdata,'resata')
        setdata(resdata.data)
        console.log(resdata)

    }
    useEffect(() => {
        handledata()
    }, [])
    return (
        <>
            <SafeAreaView
                style={[styles.andriod, styles.bgcolor]}
                className="flex flex-1 w-full"
            >
                <StatusBar style="auto" />
                <Header />
                <View className="px-5">
                    <Text style={{ fontSize: 20, color: colorred }} className="font-semibold">
                        Certificate
                    </Text>
                    <Divider theme={{ colors: { primary: colorred } }} />
                </View>
                <View className="flex-1 w-full">
                    <ScrollView contentContainerStyle={{paddingVertical:10, paddingHorizontal: 12}}>
                        {preloader ? (
                            <View className="items-center justify-center py-16">
                                <ActivityIndicator size="large" color={colorred} />
                                <Text className="text-gray-600 mt-2">Loading certificates...</Text>
                            </View>
                        ) : data.length > 0 ? (
                            data.map((item, index) => (
                                <CertificateCard item={item} key={item.registrationid || index} />
                            ))
                        ) : (
                            <View className="items-center justify-center py-16">
                                <FontAwesome5 name="certificate" size={48} color="#ccc" />
                                <Text className="text-gray-500 text-lg mt-4 text-center">No Certificates Found</Text>
                                <Text className="text-gray-400 text-sm mt-1 text-center">
                                    Your completed courses will appear here as certificates
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                </View>

            </SafeAreaView>

        </>
    )
}
export default Certificate

const CertificateCard = ({ item }) => {
    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Not Available';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    };

    // Get completion status
    const getCompletionStatus = () => {
        const completed = [];
        if (item.endclassstudent === 1) completed.push('Student');
        if (item.endclasscentre === 1) completed.push('Centre');
        if (item.endclasstrainer === 1) completed.push('Trainer');

        return completed.length > 0 ? completed.join(', ') : 'In Progress';
    };

    // Get payment status color
    const getPaymentStatusColor = () => {
        return item.paymentstatus === 1 ? '#10b981' : '#f59e0b';
    };

    // Handle view certificate
    // const handleDownloadlLetter = (item) => {
    //     // This could open a certificate viewer or navigate to certificate details

    //     console.log('View certificate for:');
    //     if(!item.letterUrl){
    //           showToast("error", "Letter not ready", "Letter not ready until you finish your course 👌")
    //         return
    //     }
    //     const fileUrl = item.letterUrl;
    //     const fileName = `${item.course.replace(/\s+/g, "_")}.pdf`;
    //     downloadFile(fileUrl , fileName);
        
    // };

    // Handle download certificate
    // const handleDownloadCertificate = (item) => {
    //     // This would download the certificate - placeholder for now
    //     console.log('Download certificate for:', item.certificateUrl);
    //     if(!item.certificateUrl){
    //           showToast("error", "Certificate not ready", "Certificate not ready until you finish your course 👌");
    //         return
    //     }
    //     const fileUrl = item.certificateUrl;
    //     const fileName = `${item.course.replace(/\s+/g, "_")}.pdf`;
    //     downloadFile(fileUrl , fileName);
    // };

    const handleOpenCertificate = (resource) => {
        if (!resource.certificateUrl) {
          showToast("error", "Certificate not available", "Contact support 👌");
          return;
        }
        Linking.openURL(resource.certificateUrl);
      };
      const handleOpenLetter = (resource) => {
        if (!resource.letterUrl) {
          showToast("error", "Letter not available", "Contact support 👌");
          return;
        }
        Linking.openURL(resource.letterUrl);
      };

    return (
        <View className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden">
            {/* Header */}
            <View className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-800 mb-1">
                            {item.course}
                        </Text>
                    </View>

                </View>
            </View>

            {/* Course Details */}
            <View className="px-4 py-3">
                <View className="flex-row items-center mb-3">
                    <FontAwesome5 name="graduation-cap" size={14} color="#6b7280" />
                    <Text className="text-sm font-semibold text-gray-700 ml-2">Course Information</Text>
                </View>

                <View className="space-y-2">
                    <View className="flex-row items-center">
                        <FontAwesome5 name="calendar-alt" size={12} color="#6b7280" />
                        <Text className="text-sm text-gray-600 ml-2">
                            Start: {formatDate(item.startdate)}
                        </Text>
                    </View>

                    <View className="flex-row items-center">
                        <FontAwesome5 name="calendar-check" size={12} color="#6b7280" />
                        <Text className="text-sm text-gray-600 ml-2">
                            End: {formatDate(item.enddate)}
                        </Text>
                    </View>

                    <View className="flex-row items-center">
                        <FontAwesome5 name="check-circle" size={12} color="#6b7280" />
                        <Text className="text-sm text-gray-600 ml-2">
                            Completion: {getCompletionStatus()}
                        </Text>
                    </View>

                    <View className="flex-row items-center">
                        <FontAwesome5 name="credit-card" size={12} color={getPaymentStatusColor()} />
                        <Text
                            className="text-sm ml-2 font-medium"
                            style={{ color: getPaymentStatusColor() }}
                        >
                            Payment: {item.paymentstatus === 1 ? 'Completed' : 'Pending'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Center Information */}
            <View className="px-4 py-2 bg-red-50">
                <View className="flex-row items-center mb-2">
                    <FontAwesome5 name="map-marker-alt" size={14} color="red" />
                    <Text className="text-sm font-semibold text-red-800 ml-2">Center Information</Text>
                </View>

                <View className="space-y-1">
                    <Text className="text-sm text-gray-700">
                        <Text className="font-medium">Name:</Text> {item.c_name}
                    </Text>
                    <Text className="text-sm text-gray-700">
                        <Text className="font-medium">Location:</Text> {item.c_state}, {item.c_city}
                    </Text>
                    <Text className="text-sm text-gray-700">
                        <Text className="font-medium">Address:</Text> {item.c_address}
                    </Text>
                </View>
            </View>

            {/* IDs and Registration */}
            <View className="px-4 py-2 bg-gray-50">
                <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                        <FontAwesome5 name="id-badge" size={12} color="#6b7280" />
                        <Text className="text-xs text-gray-600 ml-1">
                            Event ID: {'#CM-'+item.eventid}
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <FontAwesome5 name="user" size={12} color="#6b7280" />
                        <Text className="text-xs text-gray-600 ml-1">
                            Student: {item.studentid}
                        </Text>
                    </View>
                </View>
            </View>
            <View className="flex-row gap-x-2 py-2 px-3">
                        <TouchableOpacity
                            onPress={()=>handleOpenLetter(item)}
                            className="bg-red-500 px-3 py-1 rounded-lg"
                        >
                            <Text className="text-white text-xs font-medium">Download letter</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=>handleOpenCertificate(item)}
                            className="bg-green-500 px-3 py-1 rounded-lg"
                        >
                            <Text className="text-white text-xs font-medium">Download certificate</Text>
                        </TouchableOpacity>
                    </View>
        </View>
    );
};