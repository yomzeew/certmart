import { SafeAreaView, View, Text, TouchableOpacity, Image } from "react-native"
import { styles } from "../../settings/layoutsetting"
import { FontAwesome } from "@expo/vector-icons"
import { useNavigation,useRoute } from "@react-navigation/native"
import { certblue, colorred, colorwhite } from "../../constant/color"
import { TextInput,Button } from "react-native-paper"
import { useState,useEffect } from "react"
import { StatusBar } from "expo-status-bar"
import Preloader from "../preloadermodal/preloaderwhite"
import axios from "axios"
import { getotp, loginstudent, verifyotp } from "../../settings/endpoint"
import AsyncStorage from '@react-native-async-storage/async-storage'
import ForgotPasswordEmailModal from "./forgotpassword"
import NumericKeyboard from "../modals/customkeyboardnumeric"
import Animated, { useAnimatedStyle, useSharedValue,withSpring } from "react-native-reanimated"
const OtpPage = () => {
    const navigation=useNavigation()
    const route=useRoute()
    const {Email}=route.params
    const[otp,setOtp]=useState('')
    const [showkeyboard,setshowkeyboard]=useState(false)
    const [showpreloader, setshowpreloader]=useState(false)
    const [countdown,setCountdown]=useState(300)
    const [errorMsg,seterrorMsg]=useState('')
    useEffect(() => {
        // Start countdown
        const timer = countdown > 0 && setInterval(() => setCountdown(countdown - 1), 1000);
        return () => clearInterval(timer); // Cleanup timer on unmount
    }, [countdown]);
    const handleprevpage = () => {
        navigation.goBack()
    }
    const handleKeyPress = (digit) => {
        if (otp.length < 6) {
            setOtp(otp + digit);
        }
    };

    const handleBackspace = () => {
        setOtp(otp.slice(0, -1));
    };

    const translateY = useSharedValue(300);
    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));
    const handleshowkeyboard=()=>{
            translateY.value = withSpring(0);
            setshowkeyboard(true)
       
    }
    const handleclosekeyboard=()=>{
            translateY.value = withSpring(300);
            setshowkeyboard(false)
    }
    const handlesubmit=async() => {
        try{

            setshowpreloader(true)
            if(!Email){
                seterrorMsg('Enter Email')
                return
            }
            if(countdown<1){
                seterrorMsg('Otp Expired')
                return
            }
            const data={email:Email,otp:otp}
            const  response=await axios.post(verifyotp,data)
            console.log(response.status)
            if(response.status===200||response.status===203||response.status===201){
                const token=response.data.token
                navigation.navigate('newpassword',{token,Email,token,otp})
                

            }


        }catch(error){
            if (error.response) {
                // Server responded with a status other than 2xx
                console.error('Error response:', error.response.data);
                console.log(error.response.data.error)
                seterrorMsg( error.response.data.error)
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);
            } else if (error.request) {
                // Request was made but no response received
                console.error('Error request:', error.request);
            } else {
                // Something else happened while setting up the request
                console.error('Error message:', error.message);
               
            }

        }finally{
            setshowpreloader(false)

        }
       

    }
    const handleresend = async() => {
        setCountdown(300)
        try{

            
            if(!Email){
                seterrorMsg('Enter Email')
                return
            }
            const data={email:Email}
            const  response=await axios.post(getotp,data)
            console.log(response.status)
            if(response.status===200||response.status===203||response.status===201){
                navigation.navigate('otppage',{Email:Email})
            }


        }catch(error){
            if (error.response) {
                // Server responded with a status other than 2xx
                console.error('Error response:', error.response.data);
                console.log(error.response.data.error)
                seterrorMsg( error.response.data.error)
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);
            } else if (error.request) {
                // Request was made but no response received
                console.error('Error request:', error.request);
            } else {
                // Something else happened while setting up the request
                console.error('Error message:', error.message);
               
            }

        }finally{
           

        }
       

    }
    

    return (
        <>
            <View  className="flex-1 flex w-full">
                <StatusBar style="light"/>
                <View style={{ backgroundColor: colorred }} className="items-center w-full px-3 h-1/6 flex-row flex justify-between">
                    <TouchableOpacity onPress={handleprevpage}><FontAwesome name="arrow-circle-left" size={40} color={colorwhite} /></TouchableOpacity>
                    <Image className="w-20 h-12" resizeMode="contain" source={require('../images/logowhite.png')} />
                </View>
                <View className="flex-1 flex"
                  onStartShouldSetResponder={() => true}
                  onResponderRelease={handleclosekeyboard}
                >
                    <View 
                    className="flex-1 mt-16 items-center">
                    <View className="items-center mt-5">
                        <Text style={{ fontSize: 30 }} className="font-extralight">OTP VERIFICATION </Text>
                        
                    </View>
                    <View className="mt-10"><Text style={{color:colorred}}>{errorMsg}</Text></View>
                    <View className="items-center flex-row justify-center">
                    {Array(6)
                    .fill('')
                    .map((_, index) => (
                        <View 
                        onStartShouldSetResponder={() => true}
                        onResponderRelease={handleshowkeyboard}
                        key={index} className="w-12 h-12 items-center justify-center rounded-2xl bg-white m-1" >
                            <Text className="font-semibold">
                                {otp[index] || ''}
                            </Text>
                        </View>
                    ))}
                        
                      
                    
                    
                    </View>
                    <TouchableOpacity onPress={handleresend}>
                    <Text className="mt-4" style={{ fontSize: 16, color: countdown === 0 ? 'red' : 'black' }}>
                            {countdown > 0 ? `Resend OTP in ${countdown}s` : 'You can now resend the OTP'}
                        </Text>
                    </TouchableOpacity>
                    
                    <Button
                    icon="login" 
                    mode="contained"
                     onPress={handlesubmit}
                     theme={{colors:{primary:colorred}}}
                     className="h-12 mt-5 w-3/4 flex justify-center"
                     textColor="#ffffff"
                     
                     >
                         <Text style={{fontSize:20}}>Verify Otp</Text> 
                         </Button>
                    

                    </View>
                 {showkeyboard &&<View className="absolute bottom-8  items-center w-full">
                    <Animated.View style={[animatedStyles]} className="items-center">
                    <NumericKeyboard
                    onKeyPress={(value)=>handleKeyPress(value)}
                    onBackspace={handleBackspace}
                    />
                    <View>
                        <Text style={{color:colorred}}>Certmart keyboard</Text>
                    </View>

                    </Animated.View>

                 </View>}
                    
                   
                    
                   

                </View>

            </View>
        </>
    )
}
export default OtpPage