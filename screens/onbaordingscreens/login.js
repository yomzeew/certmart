import { SafeAreaView, View, Text, TouchableOpacity, Image } from "react-native"
import { styles } from "../../settings/layoutsetting"
import { FontAwesome } from "@expo/vector-icons"
import { useNavigation,useRoute } from "@react-navigation/native"
import { certblue, colorred, colorwhite } from "../../constant/color"
import { TextInput,Button } from "react-native-paper"
import { useState } from "react"
import { StatusBar } from "expo-status-bar"
import Preloader from "../preloadermodal/preloaderwhite"
const Login = () => {
    const [Email, setEmail] = useState('')
    const [Password, setPassword] = useState('')
    const [showloader,setshowloader]=useState(false)
    const navigation = useNavigation()
    const route = useRoute();
    const { platform } = route.params || {}; 
    const handleprevpage = () => {
        navigation.goBack()
    }
    
    const navigateToDashboard = () => {
        navigation.navigate('dashboard', { screen: 'dashboardstudent' });
      };

    return (
        <>
       {showloader &&<View className="absolute z-50 w-full h-full"><Preloader/></View>}
            <View  className="flex-1 flex w-full">
                <StatusBar style="light"/>
                <View style={{ backgroundColor: colorred }} className="items-center w-full px-3 h-1/6 flex-row flex justify-between">
                    <TouchableOpacity onPress={handleprevpage}><FontAwesome name="arrow-circle-left" size={40} color={colorwhite} /></TouchableOpacity>
                    <Image className="w-20 h-12" resizeMode="contain" source={require('../images/logowhite.png')} />
                </View>
                <View className="flex-1">
                    <View className="items-center mt-5">
                        <Text style={{ fontSize: 30 }} className="font-extralight"><FontAwesome name="sign-in" size={30} color={colorred} /> Login as {platform} </Text>
                        
                    </View>
                    <View className="items-center mt-5">
                    <View className="w-3/4 mt-3">
                    <TouchableOpacity><Text style={{color:colorred}}>I don't have an account</Text></TouchableOpacity>
                    </View>
                        <TextInput
                            label="Email"
                            mode="outlined"
                            theme={{ colors: { primary: colorred} }}
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
                     onPress={navigateToDashboard}
                     theme={{colors:{primary:colorred}}}
                     className="h-12 mt-3 w-3/4 flex justify-center"
                     textColor="#ffffff"
                     
                     >
                      <Text style={{fontSize:20}}>Login</Text> 
                    </Button>
                    <View className="w-3/4 flex justify-between flex-row mt-3">
                    <TouchableOpacity><Text style={{color:certblue}}>Switch Your Platform</Text></TouchableOpacity>
                    <TouchableOpacity><Text style={{color:colorred}}>Forgot Password</Text></TouchableOpacity>
                    </View>
                    
                    
                    </View>
                    
                   

                </View>

            </View>
        </>
    )
}
export default Login