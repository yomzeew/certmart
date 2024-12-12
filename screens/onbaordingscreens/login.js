import { SafeAreaView, View, Text, TouchableOpacity, Image } from "react-native"
import { styles } from "../../settings/layoutsetting"
import { FontAwesome } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import { certblue, colorred, colorwhite } from "../../constant/color"
import { TextInput, Button } from "react-native-paper"
import { useState } from "react"
import { StatusBar } from "expo-status-bar"
import Preloader from "../preloadermodal/preloaderwhite"
import axios from "axios"
import { loginstudent } from "../../settings/endpoint"
import AsyncStorage from '@react-native-async-storage/async-storage'
import ForgotPasswordEmailModal from "./forgotpassword"
const Login = () => {
    const [Email, setEmail] = useState('')
    const [Password, setPassword] = useState('')
    const [errorMsg, seterrorMsg] = useState('')
    const [showloader, setshowloader] = useState(false)
    const [showforgotpass, setshowforgotpass] = useState(false)
    const navigation = useNavigation()
    const route = useRoute();
    const { platform } = route.params || {};
    const handleprevpage = () => {
        navigation.goBack()
    }

    const navigateToDashboard = () => {
        navigation.navigate('dashboard', { screen: 'dashboardstudent' });
    };
    

    const handlesubmit = async () => {
        setshowloader(true);
    
        if (!Email) {
            seterrorMsg('Enter your Email');
            setshowloader(false);
            return;
        }
    
        if (!Password) {
            seterrorMsg('Enter your Password');
            setshowloader(false);
            return;
        }
    
        try {
            const data = {
                email: Email,
                password: Password,
            };
    
            // Set timeout for the network request
            const response = await Promise.race([
                axios.post(loginstudent, data, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    timeout: 20000, // Timeout in milliseconds (10 seconds)
                }),
                new Promise((_, reject) => setTimeout(() => reject(new Error("Network Timeout")), 10000)),
            ]);
    
            if (response.status === 200) {
                const token = response.data.token;
                await AsyncStorage.setItem('token', token);
                navigateToDashboard();
            }
        } catch (error) {
            if (error.message === "Network Timeout") {
                console.error("Request timed out.");
                seterrorMsg("The request timed out. Please try again.");
            } else if (error.response) {
                // Server responded with a status other than 2xx
                console.error('Error response:', error.response.data);
                seterrorMsg(error.response.data.error);
            } else if (error.request) {
                // Request was made but no response received
                console.error('Error request:', error.request);
                seterrorMsg("No response from server. Please try again.");
            } else {
                // Something else happened while setting up the request
                console.error('Error message:', error.message);
                seterrorMsg("An error occurred. Please try again.");
            }
        } finally {
            setshowloader(false);
        }
    };
    
    const handleforgowshow = () => {
        setshowforgotpass(true)
    }
    const handleclose = (value) => {
        setshowforgotpass(value)
    }

    return (
        <>
            {showloader && <View className="absolute z-50 w-full h-full"><Preloader /></View>}
            {showforgotpass && <View className="absolute z-50 w-full h-full">
                <ForgotPasswordEmailModal
                    close={(value) => handleclose(value)}
                />
            </View>
            }
            <View className="flex-1 flex w-full">
                <StatusBar style="light" />
                <View style={{ backgroundColor: colorred }} className="items-center w-full px-3 h-1/6 flex-row flex justify-between">
                    <TouchableOpacity onPress={handleprevpage}><FontAwesome name="arrow-circle-left" size={40} color={colorwhite} /></TouchableOpacity>
                    <Image className="w-20 h-12" resizeMode="contain" source={require('../images/logowhite.png')} />
                </View>
                <View className="flex-1">
                    <View className="items-center mt-5">
                        <Text style={{ fontSize: 30 }} className="font-extralight"><FontAwesome name="sign-in" size={30} color={colorred} /> Login as {platform} </Text>

                    </View>
                    <View className="items-center mt-5">
                        <View>
                            <Text style={{ textColor: colorred }} className={`text-center capitalize text-red-500`}>{errorMsg}</Text>
                        </View>
                        <View className="w-3/4 mt-3">
                            <TouchableOpacity><Text style={{ color: colorred }}>I don't have an account</Text></TouchableOpacity>
                        </View>
                        <TextInput
                            label="Email"
                            mode="outlined"
                            theme={{ colors: { primary: colorred } }}
                            onChangeText={text => setEmail(text)}
                            value={Email}
                            className="w-3/4 mt-3 bg-slate-50"
                            textColor="#000000"



                        />
                        <TextInput
                            label="Password"
                            mode="outlined"
                            theme={{ colors: { primary: colorred } }}
                            onChangeText={text => setPassword(text)}
                            value={Password}
                            className="w-3/4 mt-3 bg-slate-50"
                            textColor="#000000"
                            secureTextEntry

                        />
                        <Button
                            icon="login"
                            mode="contained"
                            onPress={handlesubmit}
                            theme={{ colors: { primary: colorred } }}
                            className="h-12 mt-3 w-3/4 flex justify-center"
                            textColor="#ffffff"

                        >
                            <Text style={{ fontSize: 20 }}>Login</Text>
                        </Button>
                        <View className="w-3/4 flex justify-between flex-row mt-3">
                            <TouchableOpacity><Text style={{ color: certblue }}>Switch Your Platform</Text></TouchableOpacity>
                            <TouchableOpacity onPress={handleforgowshow}><Text style={{ color: colorred }}>Forgot Password</Text></TouchableOpacity>
                        </View>


                    </View>



                </View>

            </View>
        </>
    )
}
export default Login