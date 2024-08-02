import { Dimensions, Image, SafeAreaView,View,Text,TouchableOpacity } from "react-native"
import { styles } from "../../../settings/layoutsetting"
import { StatusBar } from "expo-status-bar"
import { FontAwesome } from "@expo/vector-icons"
import { colorred, lightred } from "../../../constant/color"
import { ScrollView } from "react-native-gesture-handler"
import { Avatar, Divider } from "react-native-paper"
import Header from "./header"
import Footer from "./footer"


const Coursedetail=()=>{
    const {height}=Dimensions.get('window')
    return(
        <View style={[styles.bgcolor]} className="flex-1 w-full">
            <StatusBar style="auto" />
            <View className="flex-1">
            <View style={{height:height*0.3}} className="w-full">
            <View className="absolute z-50 top-10"><Header/></View>
            <Image source={require('../../images/productdesign.jpeg')} className="h-full w-full"/>
            <View className="px-5 w-full -mt-10">
              <View style={{elevation:6,height:height*0.6}} className="rounded-2xl flex  bg-slate-50 shadow-lg shadow-slate-500 ">
                <View className="mt-2 flex justify-between flex-row px-5">
                    <Text style={{fontSize:16,color:colorred}} className="">
                        Product Design
                    </Text>
                    <Text><FontAwesome color="orange" size={24} name="star"/>4.2</Text>

                </View>
                <View className="mt-2 px-5">
                    <Text style={{fontSize:18}} className="font-semibold">Introduction to UI</Text>
                </View>
                <View className="mt-2 px-5">
                   <Text style={{fontSize:16}} className=""><FontAwesome size={20} name="calendar"/> 3 weeks | <FontAwesome size={20} name="clock-o" /> 2 hours</Text> 
                </View>
                <View className="mt-3 flex flex-row justify-center">
                    <View className="w-1/2 items-center bg-slate-200 h-12 flex justify-center">
                        <Text style={{fontSize:16}} className="">
                            About
                        </Text>

                    </View>
                    <View style={{backgroundColor:lightred}} className="w-1/2 items-center h-12 flex justify-center">
                        <Text style={{fontSize:16}}>
                            Curriculum
                        </Text>
                    </View>
           

                </View>
                <View className="mt-3 px-5">
                        <Text className>
                        UI design in a course that focuses on user-centered design by 
                        understanding user needs and behaviors. It includes an intuitive UI 
                        with a clean layout and consistent design language, interactive elements
                         such as quizzes, personalized learning paths, 
                        accessibility features, performance tracking, and seamless integration with other platforms.
                        </Text>
                    </View>
                    <View className="px-5 mt-3">
                    <TouchableOpacity style={{backgroundColor:colorred}} className="h-12 rounded-2xl flex justify-center items-center">
                        <Text style={{fontSize:16}} className="text-white">Enroll</Text>
                    </TouchableOpacity>


                    </View>
                    <View className="px-5 mt-3">
                        <View>
                            <Text style={{fontSize:16}} className="font-semibold">Review</Text>
                            <Divider/>
                        </View>

                       
                    </View>
                    <View className="flex-1 px-5 py-3">
                    <ScrollView showsVerticalScrollIndicator={false} className="">
                            <View>
                            <View className="w-full justify-between flex flex-row">
                                <View>
                                    <Avatar.Image size={70} source={require('../../images/avatermale.png')} />
                                    </View>
                                    <View className="w-24"/>
                                    <View>
                                        <Text style={{fontSize:16}} className="font-semibold">
                                        William S. Cunningham
                                        </Text>
                                        <Text className="mt-2">
                                        The Course is Very Good dolor sit amet, consect tur 
                                        adipiscing elit. Naturales divitias dixit parab les esse, 
                                        quod parvo
                                        </Text>
                                    </View>
                     
                            </View>
                            <View className="w-full items-center flex flex-row mt-2">
                                        <View style={{backgroundColor:lightred}} className="px-3 py-1 rounded-2xl border-blue-700 border"><Text><FontAwesome size={20} name="star" color='orange'/>4.2</Text></View>
                                        <View className="w-5"/>
                                        <View><Text className="font-semibold">1 months ago</Text></View>

                                    </View>
                        

                            </View>
                            <View  className="mt-2">
                            <View className="w-full justify-between flex flex-row">
                                <View>
                                    <Avatar.Image size={70} source={require('../../images/avatermale.png')} />
                                    </View>
                                    <View className="w-24"/>
                                    <View>
                                        <Text style={{fontSize:16}} className="font-semibold">
                                        William S. Cunningham
                                        </Text>
                                        <Text className="mt-2">
                                        The Course is Very Good dolor sit amet, consect tur 
                                        adipiscing elit. Naturales divitias dixit parab les esse, 
                                        quod parvo
                                        </Text>
                                    </View>
                     
                            </View>
                            <View className="w-full items-center flex flex-row mt-2">
                                        <View style={{backgroundColor:lightred}} className="px-3 py-1 rounded-2xl border-blue-700 border"><Text><FontAwesome size={20} name="star" color='orange'/>4.2</Text></View>
                                        <View className="w-5"/>
                                        <View><Text className="font-semibold">1 months ago</Text></View>

                                    </View>
                        

                            </View>
                            <View className="mt-2">
                            <View className="w-full justify-between flex flex-row">
                                <View>
                                    <Avatar.Image size={70} source={require('../../images/avatermale.png')} />
                                    </View>
                                    <View className="w-24"/>
                                    <View>
                                        <Text style={{fontSize:16}} className="font-semibold">
                                        William S. Cunningham
                                        </Text>
                                        <Text className="mt-2">
                                        The Course is Very Good dolor sit amet, consect tur 
                                        adipiscing elit. Naturales divitias dixit parab les esse, 
                                        quod parvo
                                        </Text>
                                    </View>
                     
                            </View>
                            <View className="w-full items-center flex flex-row mt-2">
                                        <View style={{backgroundColor:lightred}} className="px-3 py-1 rounded-2xl border-blue-700 border"><Text><FontAwesome size={20} name="star" color='orange'/>4.2</Text></View>
                                        <View className="w-5"/>
                                        <View><Text className="font-semibold">1 months ago</Text></View>

                                    </View>
                        

                            </View>
                            

                        </ScrollView>

                    </View>
                    
                 
              </View>
            </View>

            </View>

            </View>
            <Footer/>
            

        </View>
    )
}
export default Coursedetail