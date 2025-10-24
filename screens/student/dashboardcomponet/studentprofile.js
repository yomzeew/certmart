import { StatusBar } from "expo-status-bar";
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { styles } from "../../../settings/layoutsetting";
import Header from "./header";
import { colorred, colorreddark } from "../../../constant/color";
import { Avatar, Divider } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import Footer from "./footer";
import Preloader from "../../preloadermodal/preloaderwhite";
import ProfileUpdateModal from "../../modals/profileupdatemodal";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { fetchStudentProfile, uploadProfilePicture,uploadId } from "../../../utils/api";
import { convertDate } from "../../../settings/dateformat";
import { getcountrybyid, getstatebyid } from "../../jsondata/country-states";
import showToast from "../../../utils/showToast";


const StudentProfile = () => {
    const [showLoader, setShowLoader] = useState(false);
    const [showProfileUpdate, setShowProfileUpdate] = useState(false);
    const [formData, setFormData] = useState([]);
    const [profileData, setProfileData] = useState({});
    const [dp, setDp] = useState("");

    const fetchData = async () => {
        try {
            setShowLoader(true);
            const data = await fetchStudentProfile();
            const countrydata = await getcountrybyid(data.country);
            const statedata = await getstatebyid(data.state, data.country);
            const countryName = countrydata?.name || '';
            const stateName = statedata?.name || '';
            setProfileData({
                id: data.id,
                studentId: data.studentid,
                surname: data.surname,
                firstname: data.firstname,
                middlename: data.middlename,
                gender: data.gender,
                dob: convertDate(data.dob),
                country: countryName,
                state: stateName,
                countryId: data.country, // Keep original ID
                stateId: data.state, // Keep original ID
                city: data.city,
                address: data.address,
                phone: data.phone,
                email: data.email,
                nokName: data.nextOfKinName,
                nokPhone: data.nextOfKinPhoneNumber,
                verification: data.verify || '',
                status: data.status || '',
            });
            setDp(data.dp);
        } catch (error) {
            console.error("Error fetching profile data:", error.message);
        } finally {
            setShowLoader(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [showProfileUpdate]);

    const handleProfileUpdate = (title, data) => {
        setShowProfileUpdate(true);
        setFormData([{ title, data }]);
    };

    const handleImageUpload = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                const asset = result.assets[0];
                const fileSizeInKB = asset.fileSize / 1024;
                const maxSizeKB = 5120; // 5MB limit
                
                if (fileSizeInKB > maxSizeKB) {
                    showToast(
                        'error',
                        'File Too Large',
                        `Image size is ${(fileSizeInKB / 1024).toFixed(2)}MB. Maximum allowed size is 5MB. Please select a smaller image.`
                    );
                    return;
                }
                
                setShowLoader(true);
                await uploadProfilePicture(asset.uri, profileData.studentId);
                showToast('success', 'Success', 'Profile picture updated successfully!');
                fetchData(); // Refresh profile data
            } else {
                showToast('error', 'Cancelled', 'No image was selected.');
            }
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            const errorMessage = error.message || 'Failed to upload profile picture. Please try again.';
            showToast('error', 'Upload Failed', errorMessage);
        } finally {
            setShowLoader(false);
        }
    };

    const handleUploadId = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                const asset = result.assets[0];
                const fileSizeInKB = asset.fileSize / 1024;
                const maxSizeKB = 5120; // 5MB limit
                
                if (fileSizeInKB > maxSizeKB) {
                    showToast(
                        'error',
                        'File Too Large',
                        `Image size is ${(fileSizeInKB / 1024).toFixed(2)}MB. Maximum allowed size is 5MB. Please select a smaller image.`
                    );
                    return;
                }
                
                setShowLoader(true);
                await uploadId(asset.uri, profileData.studentId);
                showToast('success', 'Success', 'ID document uploaded successfully!');
                fetchData(); // Refresh profile data
            } else {
                showToast('error', 'Cancelled', 'No image was selected.');
            }
        } catch (error) {
            console.error('Error uploading ID:', error);
            const errorMessage = error.message || 'Failed to upload ID. Please try again.';
            showToast('error', 'Upload Failed', errorMessage);
        } finally {
            setShowLoader(false);
        }
    };

    return (
        <>
            
            <SafeAreaView style={[styles.andriod, styles.bgcolor]} className="flex flex-1 w-full">
                <StatusBar style="dark" />
                <Header />
                <View className="px-5 h-1/6 mt-3 relative">
                    <View
                        className="h-full w-full rounded-2xl flex flex-row justify-center"
                        style={{  backgroundColor: colorreddark }}
                    >
                        <Text style={{ fontSize: 24 }} className="font-extralight text-white mt-8">
                            {profileData.firstname}'s Profile
                        </Text>
                    </View>
                    <View className="items-center w-full -mt-10">
                        <View>
                            <TouchableOpacity
                                style={{ elevation: 30 }}
                                className="absolute right-0 bottom-0 z-50 bg-white w-8 h-8 rounded-full flex justify-center items-center"
                                onPress={handleImageUpload}
                            >
                                <FontAwesome size={20} color={colorred} name="pencil" />
                            </TouchableOpacity>
                            {dp ? (
                                <Avatar.Image
                                    source={{
                                        uri: `https://certmart.org/dps/${dp}.jpg?timestamp=${new Date().getTime()}`,
                                    }}
                                />
                            ) : (
                                <Avatar.Image source={require("../../images/avatermale.png")} />
                            )}
                        </View>
                    </View>
                </View>
                <View className="flex-1 px-5 mt-16 w-full">
                    <View className="h-full bg-slate-100 rounded-2xl px-3">
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:80}}
                        >
                            <Section
                                title="Biodata"
                                data={[
                                    { label: "Surname", value: profileData.surname },
                                    { label: "Firstname", value: profileData.firstname },
                                    { label: "Middlename", value: profileData.middlename },
                                    { label: "Gender", value: profileData.gender },
                                    { label: "Date of Birth", value: profileData.dob || "---" },
                                ]}
                                onEdit={() =>
                                    handleProfileUpdate("Biodata", {
                                        surname: profileData.surname,
                                        firstname: profileData.firstname,
                                        middlename: profileData.middlename,
                                        gender: profileData.gender,
                                        dob: profileData.dob,
                                    })
                                }
                            />
                            <Section
                                title="Address"
                                data={[
                                    { label: "Country", value: profileData.country || "---" },
                                    { label: "State", value: profileData.state || "---" },
                                    { label: "City", value: profileData.city || "---" },
                                    { label: "Address", value: profileData.address || "---" },
                                ]}
                                onEdit={() =>
                                    handleProfileUpdate("Address", {
                                        country: profileData.country,
                                        state: profileData.state,
                                        city: profileData.city,
                                        address: profileData.address,
                                    })
                                }
                            />
                            <Section
                                title="Contact"
                                data={[
                                    { label: "Phone", value: profileData.phone || "---" },
                                ]}
                                onEdit={() =>
                                    handleProfileUpdate("Contact", {
                                        phone: profileData.phone,
                                    })
                                }
                            />
                            <Section
                                title="Next of Kin's Details"
                                data={[
                                    { label: "Name", value: profileData.nokName || "---" },
                                    { label: "Phone number", value: profileData.nokPhone || "---" },
                                ]}
                                onEdit={() =>
                                    handleProfileUpdate("Next of Kin's Details", {
                                        nextOfKinName: profileData.nokName,
                                        nextOfKinPhoneNumber: profileData.nokPhone,
                                    })
                                }
                            />
                            
                            {/* Verification Status Section */}
                            <View className="mt-5">
                                <View className="flex flex-row justify-between">
                                    <Text style={{ fontSize: 16 }} className="font-bold">
                                        Verification Status
                                    </Text>
                                </View>
                                <View className="border-red-500 border-b-1" />
                                <View className="mt-3 w-full flex-row items-center justify-between">
                                    <Text style={{ fontSize: 14 }} className="text-slate-500">
                                        Account Status: {profileData.status || "Pending"}
                                    </Text>
                                </View>
                                <View className="mt-3 w-full flex-row items-center justify-between">
                                    <Text style={{ fontSize: 14 }} className="text-slate-500">
                                        ID Verification: {profileData.verification ? "✓ Verified" : "Not Uploaded"}
                                    </Text>
                                </View>
                                {!profileData.verification && (
                                    <TouchableOpacity
                                        onPress={handleUploadId}
                                        className="mt-4 bg-red-500 rounded-lg py-3 px-4 items-center"
                                    >
                                        <Text style={{ fontSize: 14, color: 'white', fontWeight: '600' }}>
                                            Upload ID Document
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                <Divider />
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </SafeAreaView>
            {showLoader && (
                <View className="absolute z-50 w-full h-full">
                    <Preloader />
                </View>
            )}
            {showProfileUpdate && (
                <View className="absolute z-40 w-full h-full">
                    <ProfileUpdateModal
                        close={(value) => setShowProfileUpdate(value)}
                        data={formData}
                        profileData={profileData}
                        id={profileData.id}
                    />
                </View>
            )}
        </>
    );
};

const Section = ({ title, data, onEdit }) => (
    <>
        <View className="mt-5 flex flex-row justify-between">
            <Text style={{ fontSize: 16 }} className="font-bold">
                {title}
            </Text>
            <TouchableOpacity onPress={onEdit}>
                <FontAwesome color={colorred} size={20} name="pencil" />
            </TouchableOpacity>
        </View>
        <View className="border-red-500 border-b-1" />
        {data.map((item, index) => (
            <View key={index} className="mt-3 w-full flex-row items-center justify-between">
                <Text style={{ fontSize: 14 }} className="text-slate-500">
                    {item.label}: {item.value}
                </Text>
            </View>
        ))}
        <Divider />
    </>
);

export default StudentProfile;