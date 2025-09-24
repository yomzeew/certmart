import { SafeAreaView, View, Text, TouchableOpacity, Image } from "react-native";
import { styles } from "../../settings/layoutsetting";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { certblue, colorred, colorwhite } from "../../constant/color";
import { TextInput, Button } from "react-native-paper";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import Preloader from "../preloadermodal/preloaderwhite";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ForgotPasswordEmailModal from "./forgotpassword";
import { loginUser } from "../../utils/api";
import CustomTextInput from "../../components/CustomTextInput";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [showLoader, setShowLoader] = useState(false);
    const [showForgotPass, setShowForgotPass] = useState(false);
    const navigation = useNavigation();
    const route = useRoute();
    const { platform } = route.params || {};

    const handlePrevPage = () => {
        navigation.goBack();
    };

    const navigateToDashboard = () => {
        navigation.navigate("dashboard", { screen: "bottomnav" });
    };

    const handleSubmit = async () => {
        setShowLoader(true);

        if (!email) {
            setErrorMsg("Enter your Email");
            setShowLoader(false);
            return;
        }

        if (!password) {
            setErrorMsg("Enter your Password");
            setShowLoader(false);
            return;
        }

        try {
            const response = await loginUser(email, password); // Use the loginUser function
            const token = response.token;

            await AsyncStorage.setItem("token", token);
            navigateToDashboard();
        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            setShowLoader(false);
        }
    };

    const handleForgotPasswordShow = () => {
        setShowForgotPass(true);
    };

    const handleCloseForgotPassword = (value) => {
        setShowForgotPass(value);
    };

    return (
        <>
            {showLoader && (
                <View
                    style={{ zIndex: 50, elevation: 50 }}
                    className="absolute w-full h-full"
                >
                    <Preloader />
                </View>
            )}
            {showForgotPass && (
                <View
                    style={{ zIndex: 50, elevation: 50 }}
                    className="absolute z-50 w-full h-full"
                >
                    <ForgotPasswordEmailModal
                        close={(value) => handleCloseForgotPassword(value)}
                    />
                </View>
            )}
            <View className="flex-1 flex w-full">
                <StatusBar style="light" />
                <View
                    style={{ backgroundColor: colorred }}
                    className="items-center w-full px-3 h-1/6 flex-row flex justify-between"
                >
                    <TouchableOpacity onPress={handlePrevPage}>
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
                            <FontAwesome name="sign-in" size={30} color={colorred} /> Login
                            as {platform}
                        </Text>
                    </View>
                    <View className="items-center mt-5">
                        {/* Error Message */}
                        {errorMsg && (
                            <View>
                                <Text
                                    style={{ color: colorred }}
                                    className="text-center capitalize text-red-500"
                                >
                                    {errorMsg}
                                </Text>
                            </View>
                        )}

                        {/* Email Input */}
                        <View className="w-3/4 mt-3">
                            <CustomTextInput
                                label="Email"
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                            />
                        </View>

                        {/* Password Input */}
                        <View className="w-3/4 mt-3">
                            <CustomTextInput
                                label="Password"
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                                secureTextEntry
                            />
                        </View>

                        {/* Submit Button */}
                        <View className="w-3/4 mt-3">
                            <Button
                                icon="login"
                                mode="contained"
                                onPress={handleSubmit}
                                theme={{ colors: { primary: colorred } }}
                                className="h-12 w-full flex items-center justify-center"
                                textColor="#ffffff"
                            >
                                <Text style={{ fontSize: 20 }}>Login</Text>
                            </Button>
                        </View>

                        {/* Forgot Password and Register Links */}
                        <View className="w-3/4 flex justify-between flex-row mt-3">
                            <TouchableOpacity onPress={handleForgotPasswordShow}>
                                <Text style={{ color: colorred }}>Forgot Password</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => navigation.navigate("register")}
                            >
                                <Text style={{ color: colorred }}>Need an account?</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </>
    );
};

export default Login;