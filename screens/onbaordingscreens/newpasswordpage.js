import { SafeAreaView, View, Text, TouchableOpacity, Image } from "react-native"
import { styles } from "../../settings/layoutsetting"
import { FontAwesome } from "@expo/vector-icons"
import { useNavigation,useRoute } from "@react-navigation/native"
import { certblue, colorred, colorwhite } from "../../constant/color"
import { TextInput,Button } from "react-native-paper"
import { useState } from "react"
import { StatusBar } from "expo-status-bar"
import Preloader from "../preloadermodal/preloaderwhite"
import axios from "axios"
import { loginstudent, resetpassword, verifyotp } from "../../settings/endpoint"
import AsyncStorage from '@react-native-async-storage/async-storage'
import ForgotPasswordEmailModal from "./forgotpassword"
import NumericKeyboard from "../modals/customkeyboardnumeric"
import Animated, { useAnimatedStyle, useSharedValue,withSpring } from "react-native-reanimated"
const NewPasswordPage = () => {
    const navigation=useNavigation()
    const route=useRoute()
    const {Email}=route.params
    const {token}=route.params
    const {otp}=route.params
    const [showkeyboard,setshowkeyboard]=useState(false)
    const [Password,setPassword]=useState('')
    const [ConfirmPassword,setConfirmPassword]=useState('')
    const [showpreloader,setshowpreloader]=useState(false)
    const [errorMsg,seterrorMsg]=useState('')

    const handleprevpage = () => {
        navigation.goBack()
    }

    const handlesubmit=async() => {
        try{

            setshowpreloader(true)
            if(Password!==ConfirmPassword){
                seterrorMsg('Password Not Match')
                return
            }
            if(!Password){
                seterrorMsg('Enter Password')
                return
            }

            const data={email:Email,token:token,password:Password, password_confirmation:ConfirmPassword,otp}
            console.log(data)
            const  response=await axios.post(resetpassword,data)
            console.log(response.status)
            if(response.status===200||response.status===203||response.status===201){
                navigation.navigate('login')
                

            }


        }catch(error){
            if (error.response) {
                // Server responded with a status other than 2xx
                console.error('Error response:', error.response.data);
                console.log(error.response.data.error)
                seterrorMsg( error.response.data.error)
                seterrorMsg(error.response.data.message)
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
    

    return (
        <>
            <View  className="flex-1 flex w-full">
                <StatusBar style="light"/>
                <View style={{ backgroundColor: colorred }} className="items-center w-full px-3 h-1/6 flex-row flex justify-between">
                    <TouchableOpacity onPress={handleprevpage}><FontAwesome name="arrow-circle-left" size={40} color={colorwhite} /></TouchableOpacity>
                    <Image className="w-20 h-12" resizeMode="contain" source={require('../images/logowhite.png')} />
                </View>
                <View className="flex-1">
                    <View className="items-center mt-5">
                        <Text style={{ fontSize: 30 }} className="font-extralight"><FontAwesome name="sign-in" size={30} color={colorred} /> Set New Password </Text>
                        
                    </View>
                    <View className="items-center mt-5">
                        <View>
                            <Text style={{textColor:colorred}} className={`text-center capitalize text-red-500`}>{errorMsg}</Text>
                        </View>
                    <View className="w-3/4 mt-3">
                    <TextInput
                            label="Password"
                            mode="outlined"
                            theme={{ colors: { primary: colorred} }}
                            onChangeText={text => setPassword(text)}
                            value={Password}
                            className="w-3/4 mt-3 bg-slate-50"
                            textColor="#000000"
                            secureTextEntry
                            
                            

                        />
                    </View>
                    <View className="w-3/4 mt-3">
                    <TextInput
                            label="Confirm Password"
                            mode="outlined"
                            theme={{ colors: { primary: colorred } }}
                            onChangeText={text => setConfirmPassword(text)}
                            value={ConfirmPassword}
                            className="w-3/4 mt-3 bg-slate-50"
                            textColor="#000000"
                            secureTextEntry

                            
                        />
                    
                    
                        
                    </View>
                        
                       
                    <Button
                    icon="login" 
                    mode="contained"
                     onPress={handlesubmit}
                     theme={{colors:{primary:colorred}}}
                     className="h-12 mt-3 w-3/4 flex justify-center"
                     textColor="#ffffff"
                     
                     >
                      <Text style={{fontSize:20}}>Submit</Text> 
                    </Button>
                    
                    
                    
                    </View>
                    
                   

                </View>

            </View>

           
        </>
    )
}
export default NewPasswordPage