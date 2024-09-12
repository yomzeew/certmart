import { View, SafeAreaView, Text, ScrollView, RefreshControl, TouchableOpacity } from "react-native";

import { useState, useEffect } from 'react';
import { Entypo, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { colorred } from "../../constant/color";
import PaymentScreen from "../paystacks/paystackwebview";

export const CoursesRegModalPartone=()=>{
    return(
        <View className="relative flex justify-center  items-center h-28">
        <View className="absolute right-0 z-50 bg-slate-50 rounded-full top-0">
            <FontAwesome name="check-circle" size={30} color="green" />
        </View>
        {/* <FontAwesome name="warning" size={24} color="red" /> */}
        <View className="rounded-full h-24 w-24 bg-red-300 absolute -left-5 z-50 flex justify-center items-center">
            <TouchableOpacity className="w-24 items-center">
                <FontAwesome5 name="file" size="30" />
                <Text className="text-xs text-center">View Course Outlined</Text>
            </TouchableOpacity>
        </View>
        <View className="rounded-2xl h-20 bg-red-200 w-5/6 flex-row justify-center items-center">
            <TouchableOpacity className="px-3 w-56 items-center">
                <Text style={{ fontSize: 16 }} className="font-semibold text-center">Introduction to Machine Learning & AI</Text>
                <View className="flex-row items-center justify-center mt-2">
                    <FontAwesome5 name="user" size={16} />
                    <Text className="text-xs ml-2">Adewale Femi</Text>
                    <View className="ml-2 flex-row">
                    <Text className="mr-1">4.2</Text>
                    <FontAwesome name="star" size={14} color="orange" />
                    </View>

                </View>


            </TouchableOpacity>





        </View>


    </View>
    )
}




export const CoursesRegModalParttwo=()=>{
    const handleshowpayment=()=>{
    
    }
  
    return(
        <>
        {/* <View className="absolute z-50 w-full">
            <PaymentScreen/>
        </View> */}
        <View className="bg-red-100 h-auto w-3/4 rounded-2xl p-3 ">
                                <View className="">
                                    <View className="flex-row">
                                    <Entypo name="circle" size={14} color="red" />
                                    <Text  style={{fontSize:16}} className="font-semibold ml-2">Course Introduction</Text>
                                    </View>
                                    <View className="px-5" >
                                    <Text className="text-justify">
                                    
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et odio leo. 
                                    Nullam vulputate pulvinar elit sed elementum. Suspendisse odio nibh, pellentesque
                                    ut malesuada at, eleifend eget lorem. Proin at nibh diam. Mauris at fermentum quam.
                                    Proin neque dolor, consequat pellentesque tellus ac, eleifend aliquam dolor. 
                                    </Text>

                                    </View>
                                   
                                </View>
                                <View className="mt-2">
                                    <View className="flex-row">
                                    <Entypo name="circle" size={14} color="red" />
                                    <Text  style={{fontSize:16}} className="font-semibold ml-2">Mode</Text>
                                    </View>
                                    <View className="px-5" >
                                    <Text className=" font-semibold">
                                    Physical
                                    </Text>

                                    </View>
                                    
                                </View>
                                <View className="mt-2">
                                    <View className="flex-row">
                                    <Entypo name="circle" size={14} color="red" />
                                    <Text  style={{fontSize:16}} className="font-semibold ml-2">Hub Center</Text>
                                    </View>
                                    <View className="px-5 flex-row" >
                                    <Text className=" font-semibold">
                                    Jit Solutions Akure
                                    </Text>
                                    <View className="ml-2 flex-row">
                                            <Text className="mr-1">4.2</Text>
                                            <FontAwesome name="star" size={14} color="orange" />
                                            </View>

                                    </View>
                                    
                                </View>
                                <View className="mt-2">
                                    <View className="flex-row">
                                    <Entypo name="circle" size={14} color="red" />
                                    <Text  style={{fontSize:16}} className="font-semibold ml-2">Timing</Text>
                                    </View>
                                    <View className="px-5 flex-row" >
                                    <Text className=" font-semibold">
                                    3 Hours
                                    </Text>

                                    </View>
                                    
                                </View>
                                <View className="items-center w-full px-2 mt-3">
                                <TouchableOpacity onPress={handleshowpayment} style={{backgroundColor:colorred}} className="w-full h-12 rounded-2xl items-center justify-center">
                                    <Text className="text-white">Make Payment of N30,000.00</Text>
                                </TouchableOpacity>

                                </View>
                               

                            </View>
        </>
        
    )
}
