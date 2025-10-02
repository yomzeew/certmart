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
import { fetchStudentProfile, uploadProfilePicture } from "../../../utils/api";
import { convertDate } from "../../../settings/dateformat";

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
            setProfileData({
                id: data.id,
                studentId: data.studentid,
                surname: data.surname,
                firstname: data.firstname,
                middlename: data.middlename,
                gender: data.gender,
                dob: convertDate(data.dob),
                // country: data.country,
                // state: data.state,
                city: data.city,
                address: data.address,
                phone: data.phone,
                email: data.email,
                nokName: data.nextOfKinName,
                nokPhone: data.nextOfKinPhoneNumber,
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
                setShowLoader(true);
                await uploadProfilePicture(result.assets[0].uri, profileData.studentId);
                fetchData(); // Refresh profile data
            } else {
                alert("You did not select any image.");
            }
        } catch (error) {
            console.error("Error uploading profile picture:", error.message);
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
                        <ScrollView showsVerticalScrollIndicator={false}>
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
                                    // { label: "Country", value: profileData.country || "---" },
                                    // { label: "State", value: profileData.state || "---" },
                                    { label: "City", value: profileData.city || "---" },
                                    { label: "Address", value: profileData.address || "---" },
                                ]}
                                onEdit={() =>
                                    handleProfileUpdate("Address", {
                                        // country: profileData.country,
                                        // state: profileData.state,
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