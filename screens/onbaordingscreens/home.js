import { StatusBar } from "expo-status-bar"
import {View,Image, ImageBackground } from "react-native"
import { styles } from "../../settings/layoutsetting"
import { useEffect } from "react"
import { useIsFocused } from "@react-navigation/native";

const Home=({navigation})=>{
    const isFocused=useIsFocused()
    const goto = async () => {
        // const status = await getDeviceStatus();
        // if (status) {
          navigation.navigate('slider');
    //     } else {
    //       navigation.navigate('slider');
    //     }
     };
    useEffect(
        ()=>{
            if(isFocused){
                const mystart=setTimeout(()=>{
                    goto()
        
                },3000)
                return () => clearTimeout(mystart);
    
            }

    })
    return(
        <ImageBackground source={require('../images/bgground.png')} style={[styles.bgcolor]}  resizeMode="contain" className="flex-1 w-full justify-center items-center flex">
            <View className="absolute h-full w-full bg-slate-100 opacity-80"/>
            <StatusBar style="auto" />
            <Image source={require('../images/certmart-logo2.png')} className="h-12 w-32" resizeMode="contain"/>
        </ImageBackground>
    )
}
export default Home
