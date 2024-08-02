import { SafeAreaView, ImageBackground,Text,View } from "react-native"
import { styles } from "../../settings/layoutsetting"
import { certblue, colorred } from "../../constant/color"
import { TouchableOpacity } from "react-native-gesture-handler"
import { FontAwesome } from "@expo/vector-icons"
import { useRoute,useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { StatusBar } from "expo-status-bar"

const Welcomepage=()=>{
    const navigation=useNavigation()
    const route = useRoute();
    const { platform } = route.params || {}; 
    const [getplatform,setplatform]=useState('')
    const handleprevpage=()=>{
        navigation.goBack()
    }
    const handlelogin=()=>{
        navigation.navigate('login',{platform:platform})
    }
    const handleregister=()=>{
        navigation.navigate('register',{platform:platform})
    }

    return(
        <>
         <ImageBackground source={require('../images/welcome.jpeg')} className="h-full w-full bg-bottom absolute -bottom-32" resizeMode="contain"/>
         <View className="w-full h-full bg-slate-200 opacity-80 absolute"></View>
        <SafeAreaView style={styles.andriod} className="flex-1 justify-center items-center flex w-full">
            <StatusBar style="auto"/>
            <View className="items-start w-full px-3 h-1/6 flex justify-center">
            <TouchableOpacity onPress={handleprevpage}><FontAwesome name="arrow-circle-left" size={40} color={colorred} /></TouchableOpacity>
                </View>
            <View className="flex-1 flex justify-center items-center">
                
                <Text style={{fontSize:35}} className="font-extralight">Welcome To</Text>
                <View className="flex flex-row">
                <Text style={{fontSize:60,color:certblue}} className="font-medium">Cert</Text>
                <Text style={{fontSize:60,color:colorred}} className="font-medium">Mart</Text>
                </View>
                
              

            </View>

            <View className="w-full items-center mb-5">
                <TouchableOpacity onPress={handlelogin}  style={{backgroundColor:colorred}} className="rounded-xl w-64 items-center flex justify-center h-12">
                    <Text style={{fontSize:20}} className="text-white">Login as {platform}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleregister} style={{backgroundColor:certblue}} className="rounded-xl w-64 items-center flex justify-center h-12 mt-3">
                    <Text style={{fontSize:20}} className="text-white">Register as {platform}</Text>
                </TouchableOpacity>
            </View>

            
            
        </SafeAreaView>
        </>
        
    )
}
export default Welcomepage