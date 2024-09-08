import { Dimensions, Image, SafeAreaView,View,Text,TouchableOpacity, Platform } from "react-native"
import { styles } from "../../../settings/layoutsetting"
import { StatusBar } from "expo-status-bar"
import { FontAwesome } from "@expo/vector-icons"
import { colorred, lightred } from "../../../constant/color"
import { ScrollView } from "react-native-gesture-handler"
import { Avatar, Card, Divider } from "react-native-paper"
import Header from "./header"
import Footer from "./footer"
import { allcourses } from "../../../settings/endpoint"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useEffect,useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import Preloader from "../../preloadermodal/preloaderwhite"
import { fieldtextfour, fieldtexttwo } from "../../../settings/fontsetting"


const AllCoursedetail=()=>{
    const {height}=Dimensions.get('window')
    const route = useRoute();
    const navigation=useNavigation()
    const { course } = route.params;
    const [coursesdata,setcoursesdata]=useState([])
    const [showpreloader,setshowpreloader]=useState(false)
    const [data,setdata]=useState([])
    const fetchdata=async()=>{
        try{
            setshowpreloader(true)
            const token=await AsyncStorage.getItem('token')
            const response=await axios.get(allcourses,{
                headers:{
                    "Authorization":`Bearer ${token}`
                }
    
            })
            console.log(response.data.data)
            const alldata=response.data.data
            if(alldata.length>0){
                const getfiltercourse=alldata.filter((item)=>(
                    item.course.toLowerCase()===course.toLowerCase()
                ))
                setdata(getfiltercourse)

            }else{
                setdata([])
            }
           

        }catch(error){
            if (error.response) {
                // Server responded with a status other than 2xx
                console.error('Error response:', error.response.data);
                console.log(error.response.data.error)
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
    useEffect(()=>{
        fetchdata()

    },[course])
    const handlenavigate=(value)=>{
        navigation.navigate('coursesdetail',{course:value})
    }
    
    return(
        
        <View style={[styles.bgcolor]} className="flex-1 w-full">
            <StatusBar style="auto" />
           {showpreloader &&<View className="z-50 absolute h-full w-full"><Preloader/></View> }
           <SafeAreaView s className="flex-1 w-full">
           <View>
            <Header/>
           </View>
            <View className="flex-1 w-full">
                <View><Text style={{color:colorred,fontSize:20}} className={`font-semibold px-5`}>{course}</Text></View>
                <ScrollView>
                    <View className="w-full flex flex-row flex-wrap items-center px-3">
                    {data.map((item,index)=>(
                <View className="p-2 items-center" key={index}>
                        <TouchableOpacity onPress={()=>handlenavigate(item.coursecode)}>
               
               <Card className="w-44 h-64 bg-white">
                    <Card.Cover source={{uri: `https://certmart.org/icon/${item.icon}.jpeg?timestamp=${new Date().getTime()}` }} />
                    <Card.Content>
                        <Text style={{ color: colorred }} className="font-semibold mt-2" variant="titleLarge">{item.course}</Text>
                        <Text variant="bodyMedium">₦{item.cost} | Duration {item.duration} weeks</Text>
                    </Card.Content>
                </Card>
                </TouchableOpacity> 
                    </View>
         
             ))}


                    </View>
               
                </ScrollView>
            </View>
            <Footer/>

           </SafeAreaView>
           
            

        </View>
    )
}
export default AllCoursedetail
const stylecustom = {
    spacetop: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
};