import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Modal,
    TouchableWithoutFeedback
} from "react-native";
import { styles } from "../../settings/layoutsetting";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { certblue, colorred, colorwhite } from "../../constant/color";
import { TextInput, Button, RadioButton, Checkbox } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import Preloader from "../preloadermodal/preloaderwhite";
import SuccessModal from "../modals/successfulmodal";
import TermsModal from "../modals/termsModal";
import { registerUser, fetchReferralSources } from "../../utils/api";
import CustomTextInput from "../../components/CustomTextInput";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const RegisterPage = () => {
    const [Email, setEmail] = useState("");
    const [Surname, setSurname] = useState("");
    const [Middlename, setMiddlename] = useState("");
    const [Firstname, setFirstname] = useState("");
    const [Gender, setGender] = useState("");
    const [phonenumber, setphonenumber] = useState("");
    const [Agreement, setAgreement] = useState(false);
    const [errormsg, seterrormsg] = useState("");
    const [showloader, setshowloader] = useState(false);
    const [showsuccessmodal, setshowsuccessmodal] = useState(false);
    const [visible, setVisible] = useState(false);
    const [referralSources, setReferralSources] = useState([]);
    const [selectedReferral, setSelectedReferral] = useState("");
    const [customReferral, setCustomReferral] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const navigation = useNavigation();
    const route = useRoute();
    const { platform } = route.params || {};
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const loadReferralSources = async () => {
            try {
                const response = await fetchReferralSources();
                if (response.status && response.data) {
                    setReferralSources(response.data);
                }
            } catch (error) {
                console.log("Error fetching referral sources:", error);
            }
        };
        loadReferralSources();
    }, []);

    const handleprevpage = () => {
        navigation.goBack();
    };

    const handlesubmit = async () => {
       

        if (!Surname) return seterrormsg("Enter Surname");
        if (!Firstname) return seterrormsg("Enter Firstname");
        if (!phonenumber) return seterrormsg("Enter Phone Number");
        if (!Agreement) return seterrormsg("Check the box for agreement and policy");
        if (!Gender) return seterrormsg("Select your gender");
        if (!Email) return seterrormsg("Enter your Email");

        let referralValue = selectedReferral;
        if (selectedReferral === "Others" && customReferral) {
            referralValue = `Others: ${customReferral}`;
        }

        const data = {
            surname: Surname,
            firstname: Firstname,
            middlename: Middlename,
            email: Email,
            gender: Gender.toLowerCase(),
            phone: phonenumber,
            Agreement: true,
            referral: referralValue,
        };

       try {
  setshowloader(true);
  const response = await registerUser(data); // Use the registerUser function
  console.log("✅ Backend response:", response);
  setshowsuccessmodal(true);
} catch (error) {
  console.log("❌ Error during registration:", error?.response?.data || error);
  
  // Handle backend-provided error message
  if (error.response && error.response.data) {
    // If backend sends message as { message: "something went wrong" }
    seterrormsg(error.response.data.message || JSON.stringify(error.response.data));
  } else {
    // Otherwise show a fallback
    seterrormsg(error.message || "An unexpected error occurred");
  }
} finally {
  setshowloader(false);
}
    };

    const handleaction = () => {
        navigation.navigate("login");
    };

    const onCancel = () => {
        setAgreement(false);
        setVisible(false);
    };

    const onAgree = () => {
        setAgreement(true);
        setVisible(false);
    };

    return (
        <>
            {showloader && (
                <View
                    style={{ zIndex: 50, elevation: 50 }}
                    className="absolute w-full h-full"
                >
                    <Preloader />
                </View>
            )}
            {showsuccessmodal && (
                <View className="absolute w-full h-full flex justify-center items-center">
                    <SuccessModal
                        message={"Registration Successful. Check your Email for Password"}
                        action={() => handleaction()}
                    />
                </View>
            )}
            <TermsModal
                visible={visible}
                onCancel={() => onCancel()}
                onAgree={() => onAgree()}
            />
            <SafeAreaView className="flex-1">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <StatusBar style="light" />
                    <View
                        style={{
                            backgroundColor: colorred,
                            marginTop: Platform.OS === "ios" ? -65 : 0,
                        }}
                        className="items-center w-full px-3 h-1/6 flex-row flex justify-between"
                    >
                        <TouchableOpacity onPress={handleprevpage}>
                            <FontAwesome
                                name="arrow-circle-left"
                                size={40}
                                color={colorwhite}
                            />
                        </TouchableOpacity>
                        <Image
                            className="w-20 h-12"
                            resizeMode="contain"
                            source={require("../images/logowhite.png")}
                        />
                    </View>
                    <View className="flex-1">
                        <View className="items-center mt-5">
                            <Text style={{ fontSize: 30 }} className="font-extralight">
                                <FontAwesome name="sign-in" size={30} color={colorred} />{" "}
                                Register as {platform}
                            </Text>
                        </View>
                        <View className="items-center mt-5 flex-1">
                            <View>
                                <Text className="text-red-500 text-center">{errormsg}</Text>
                            </View>
                            <ScrollView className="w-full">
                                <View className="items-center">
                                    {/* Input Fields */}
                                    {[
                                        { label: "Surname", value: Surname, setter: setSurname },
                                        { label: "Firstname", value: Firstname, setter: setFirstname },
                                        { label: "Middlename", value: Middlename, setter: setMiddlename },
                                        { label: "Email", value: Email, setter: setEmail },
                                        {
                                            label: "Phone Number",
                                            value: phonenumber,
                                            setter: setphonenumber,
                                        },
                                    ].map((field, index) => (
                                        <View key={index} className="w-3/4 mt-3">
                                            <CustomTextInput
                                                label={field.label}
                                                value={field.value}
                                                onChangeText={(text) => field.setter(text)}
                                            />
                                        </View>
                                    ))}

                                    {/* Gender Selection */}
                                    <View className="w-3/4 mt-3">
                                        <Text style={{ fontSize: 16 }}>Choose your Gender</Text>
                                        <View className="flex flex-row items-center mt-2">
                                            {["Male", "Female"].map((gender) => (
                                                <View key={gender} className="flex flex-row items-center">
                                                    <RadioButton
                                                        value={gender}
                                                        status={
                                                            Gender === gender ? "checked" : "unchecked"
                                                        }
                                                        onPress={() => setGender(gender)}
                                                        color={colorred}
                                                    />
                                                    <Text>{gender}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>

                                    {/* Referral Source Selection */}
                                    <View className="w-3/4 mt-3">
                                        <Text style={{ fontSize: 16, marginBottom: 8 }}>How did you hear about us?</Text>
                                        
                                        {/* Dropdown Trigger */}
                                        <TouchableOpacity 
                                            onPress={() => setShowDropdown(!showDropdown)}
                                            style={{
                                                borderWidth: 1,
                                                borderColor: colorred,
                                                borderRadius: 5,
                                                padding: 12,
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                backgroundColor: 'white'
                                            }}
                                        >
                                            <Text style={{ color: selectedReferral ? 'black' : 'gray' }}>
                                                {selectedReferral || 'Select an option'}
                                            </Text>
                                            <FontAwesome 
                                                name={showDropdown ? 'chevron-up' : 'chevron-down'} 
                                                size={16} 
                                                color="gray" 
                                            />
                                        </TouchableOpacity>

                                        {/* Dropdown List Modal */}
                                        <Modal
                                            visible={showDropdown}
                                            transparent={true}
                                            animationType="fade"
                                            onRequestClose={() => setShowDropdown(false)}
                                        >
                                            <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
                                                <View style={{
                                                    flex: 1,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                                                }}>
                                                    <TouchableWithoutFeedback>
                                                        <View style={{
                                                            width: '80%',
                                                            maxHeight: '60%',
                                                            backgroundColor: 'white',
                                                            borderRadius: 10,
                                                            padding: 15
                                                        }}>
                                                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' }}>
                                                                How did you hear about us?
                                                            </Text>
                                                            <ScrollView>
                                                                {referralSources.map((item) => (
                                                                    <TouchableOpacity
                                                                        key={item.id}
                                                                        onPress={() => {
                                                                            setSelectedReferral(item.source);
                                                                            setShowDropdown(false);
                                                                            if (item.source !== "Others") {
                                                                                setCustomReferral("");
                                                                            }
                                                                        }}
                                                                        style={{
                                                                            padding: 15,
                                                                            borderBottomWidth: 1,
                                                                            borderBottomColor: '#f0f0f0'
                                                                        }}
                                                                    >
                                                                        <Text style={{ fontSize: 16 }}>{item.source}</Text>
                                                                    </TouchableOpacity>
                                                                ))}
                                                            </ScrollView>
                                                            <TouchableOpacity
                                                                onPress={() => setShowDropdown(false)}
                                                                style={{
                                                                    marginTop: 15,
                                                                    padding: 12,
                                                                    backgroundColor: colorred,
                                                                    borderRadius: 5,
                                                                    alignItems: 'center'
                                                                }}
                                                            >
                                                                <Text style={{ color: 'white', fontWeight: 'bold' }}>Close</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </TouchableWithoutFeedback>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        </Modal>

                                        {/* Other Source Input */}
                                        {selectedReferral === "Others" && (
                                            <View className="mt-2">
                                                <CustomTextInput
                                                    label="Please specify"
                                                    value={customReferral}
                                                    onChangeText={(text) => setCustomReferral(text)}
                                                />
                                            </View>
                                        )}
                                    </View>

                                    {/* Agreement Checkbox */}
                                    <TouchableOpacity onPress={() => setVisible(true)} className="w-3/4 flex flex-row items-center">
                                        <Checkbox
                                            status={Agreement ? "checked" : "unchecked"}
                                            theme={{ colors: { primary: colorred } }}
                                        />
                                       
                                            <Text style={{ color: certblue }}>
                                                Agree to terms and conditions
                                            </Text>
                                        
                                    </TouchableOpacity>

                                    {/* Submit Button */}
                                    <View className="w-3/4 mt-3">
                                        <Button
                                            mode="contained"
                                            onPress={handlesubmit}
                                            theme={{ colors: { primary: colorred } }}
                                            className="h-12 w-full flex justify-center"
                                            textColor="#ffffff"
                                        >
                                            <Text style={{ fontSize: 20 }}>Register</Text>
                                        </Button>
                                    </View>
                                </View>
                                <View className="items-center" style={{ paddingBottom: insets.bottom + 20 }}>
                                    <View className="w-3/4 flex justify-between flex-row mt-3">
                                        <TouchableOpacity onPress={handleaction}>
                                            <Text style={{ color: colorred }}>
                                                I have an account Login
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
};

export default RegisterPage;
