import { Text, TouchableOpacity, View } from "react-native"
import { Button, TextInput } from "react-native-paper"
import { colorred } from "../../constant/color"
import { useState } from "react"
import { FontAwesome5 } from "@expo/vector-icons"
import axios from "axios"
import { getotp } from "../../settings/endpoint"
import Preloader from "../preloadermodal/preloaderwhite"
import { useNavigation } from "@react-navigation/native"

const ForgotPasswordEmailModal = ({close}) => {
    const [Email, setEmail] = useState('')
    const [errorMsg,seterrorMsg]=useState('')
    const [showpreloader,setshowpreloader]=useState(false)
    const navigation=useNavigation()
    const handlesubmit = async() => {
        try{

            setshowpreloader(true)
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
            setshowpreloader(false)

        }
       

    }
    const handleclose=()=>{
        close(false)
    }
    return (
        <>
            <View className="h-full w-full justify-center flex items-center">
                <View
                onStartShouldSetResponder={() => true}
                onResponderRelease={handleclose}
                className="h-full absolute bottom-0 w-full px-2 py-3 opacity-80 bg-red-100  border border-slate-400 rounded-xl shadow-lg"></View>
                <View style={{ elevation: 6 }} className="w-4/5 relative h-1/3 bg-white shadow-md shadow-slate-400 rounded-2xl flex justify-center items-center">
                {showpreloader &&<View className="absolute z-50 h-full w-full flex justify-center items-center rounded-2xl"><Preloader/></View>}
                <View className="absolute z-40 right-2 top-2">
                    <TouchableOpacity onPress={handleclose}><FontAwesome5 name="times" size={24} color={colorred} /></TouchableOpacity>
                </View>
                <View className="w-full px-5">
                <View className="items-center">
                    <Text className="text-sm text-red-500">{errorMsg}</Text>
                </View>
             <View className="mt-3/4 mt-3">
             <TextInput
                        label="Email"
                        mode="outlined"
                        theme={{ colors: { primary: colorred } }}
                        onChangeText={text => setEmail(text)}
                        value={Email}
                        className="w-full mt-3"
                    />

             </View>
                   
                    
                    <Button
                        icon="login"
                        mode="contained"
                        onPress={handlesubmit}
                        theme={{ colors: { primary: colorred } }}
                        className="h-12 mt-3 w-full flex justify-center"
                        textColor="#ffffff"
                    >
                        <Text style={{ fontSize: 20 }}>Submit</Text>
                    </Button>
                    </View>





                </View>

            </View>
        </>

    )
}
export default ForgotPasswordEmailModal