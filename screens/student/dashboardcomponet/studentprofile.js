import { StatusBar } from "expo-status-bar"
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native"
import { styles } from "../../../settings/layoutsetting"
import Header from "./header"
import { colorred, colorreddark, colorredmedium } from "../../../constant/color"
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar, Divider } from "react-native-paper"
import { FontAwesome } from "@expo/vector-icons"
import { ScrollView } from "react-native-gesture-handler"
import Footer from "./footer"

const StudentProfile = () => {
    return (
        <>
            <SafeAreaView style={[styles.andriod, styles.bgcolor]}  className="flex flex-1 w-full">
                <StatusBar style="auto" />
                <Header />
                <View className="px-5 h-1/6 mt-3">
                <LinearGradient
                 colors={[colorred, colorredmedium, colorreddark]}
                 className="h-full w-full rounded-2xl flex flex-row justify-center" 
                 style={{elevation:4}}
                >
                    <Text style={{fontSize:24}} className="font-extralight text-white mt-8">Aloba's Profile</Text>
                    </LinearGradient>
                <View className="items-center w-full -mt-10">
                    <View>
                    <TouchableOpacity className="absolute right-0 bottom-0 z-50 bg-white w-8 h-8 rounded-full flex justify-center items-center">
                        <FontAwesome size={20} color={colorred} name="pencil"  />

                    </TouchableOpacity>
                    <Avatar.Image source={require('../../images/trainer.jpeg')} size={100} />

                    </View>
                   
                </View>
                   

                </View>
                <View className="flex-1 px-5 mt-16 w-full">
                    <View className="h-full  bg-slate-100 rounded-2xl px-3">
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View className="mt-3 flex  flex-row justify-between">
                            <Text style={{fontSize:16}} className="font-bold">Biodata</Text>
                           <TouchableOpacity><FontAwesome color={colorred} size={20} name="pencil"/></TouchableOpacity>
                           
                        </View>
                        <View className="border-red-500 border-b-1"/>
                        <View className="mt-5 w-full flex-row items-center  flex justify-between">
                            <Text style={{fontSize:14}} className="text-slate-500">Surname: Aloba</Text>
                            <Text style={{fontSize:14}} className="text-slate-500">Firstname: Olakunke</Text>
                            
                        </View>
                        <Divider />
                        <View className="mt-3 w-full flex-row items-center  flex justify-between">
                            <Text style={{fontSize:14}} className="text-slate-500">Middlename: Gideon</Text>
                            <Text style={{fontSize:14}} className="text-slate-500">Gender: Male</Text>
                            
                        </View>
                        <Divider />
                        <View className="mt-3 w-full flex-row items-center  flex justify-between">
                            <Text style={{fontSize:14}} className="text-slate-500">Date of Birth:18-July-2009</Text>
                            
                        </View>
                        <View className="mt-5 flex  flex-row justify-between">
                            <Text style={{fontSize:16}} className="font-bold">Address</Text>
                           <TouchableOpacity><FontAwesome color={colorred} size={20} name="pencil"/></TouchableOpacity>
                           
                        </View>
                        <View className="border-red-500 border-b-1"/>
                        <View className="mt-3 w-full flex-row items-center  flex justify-between">
                            <Text style={{fontSize:14}} className="text-slate-500">Country:Nigeria</Text>
                            <Text style={{fontSize:14}} className="text-slate-500">State:Ondo</Text>
                            
                            
                        </View>
                        <Divider />
                        <View className="mt-3 w-full flex-row items-center  flex justify-between">
                            <Text style={{fontSize:14}} className="text-slate-500">City: Akure</Text>  
                        </View>
                        <Divider />

                        <View className="mt-3 w-full">
                            <Text style={{fontSize:14}} className="text-slate-500">Address:128, oba-adesida road, akure's.</Text>    
                        </View> 
                        <Divider />
                        <View className="mt-5 flex  flex-row justify-between">
                            <Text style={{fontSize:16}} className="font-bold">Contact</Text>
                           <TouchableOpacity><FontAwesome color={colorred} size={20} name="pencil"/></TouchableOpacity>
                           
                        </View>
                        <View className="border-red-500 border-b-1"/>
                        <View className="mt-3 w-full ">
                            <Text style={{fontSize:14}} className="text-slate-500">Phone:+2348193984848</Text>
                           
                        </View>
                        <Divider />
                        <View className="mt-3 w-full">
                            <Text style={{fontSize:14}} className="text-slate-500">Email:olakunle.aloba@gmail.com</Text>
                        </View>
                        <View className="mt-5 flex  flex-row justify-between">
                            <Text style={{fontSize:16}} className="font-bold">Next of Kin's Details</Text>
                           <TouchableOpacity><FontAwesome color={colorred} size={20} name="pencil"/></TouchableOpacity>
                           
                        </View>
                        <View className="border-red-500 border-b-1"/>
                        <View className="mt-3 w-full flex-row items-center  flex justify-between">
                            <Text style={{fontSize:14}} className="text-slate-500">Name:AOG</Text>
                            <Text style={{fontSize:14}} className="text-slate-500">Phone number:234816647484</Text>
                            
                            
                        </View>
                        <Divider />
                      

                   </ScrollView>

                    </View>
                  
                </View>
                <Footer/>


            </SafeAreaView>
        </>
    )
}
export default StudentProfile