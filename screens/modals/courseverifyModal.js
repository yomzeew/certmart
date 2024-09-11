import { View,Text, TouchableOpacity } from "react-native"
import { colorred } from "../../constant/color"
import { useState } from "react"
import { FontAwesome,MaterialIcons } from "@expo/vector-icons"

const CoursesVerifyModal=({data})=>{
    const[type,settype]=useState('Virtual')

    return(
        <>
        <View className="w-44 h-auto rounded-2xl border-2 border-red-500 p-3 bg-slate-50 flex justify-center items-center">
        <View className="absolute right-0 -top-3 z-50">
            <FontAwesome name="check-circle" size={30} color="green" />
            <MaterialIcons name="pending" size={24} color="orange" />
            <FontAwesome name="warning" size={24} color="red" />
            </View>
                      <View> 
            <View className="items-center">
                <Text style={{fontSize:16}} className="text-center font-semibold ">Web Design - HTML and CSS</Text>
                </View>
                <View className=" bg-green-900 items-center py-2 rounded-2xl mt-3">
                <Text className="text-white" >Approved</Text>
            </View>
                <View className="items-center mt-3">
                    <Text style={{fontSize:16,color:colorred}} className="font-semibold">Phyiscal</Text>
                </View>
                <View className="mt-3">
                <View><Text>Nigeria</Text></View>
                <View><Text>Ondo State</Text></View>
                <View><Text>JIT -Adesida Road</Text></View>
                </View>
            <View className="mt-3"><Text>Decision Comment</Text></View>
            <View className="mt-3">
            <TouchableOpacity
            style={{backgroundColor:colorred}}
            className="py-2  rounded-2xl  px-3 flex justify-center items-center"
            >
                <Text className="text-white">View CV</Text>
            </TouchableOpacity>

            </View>

            </View>
            
        

            

            
        </View>
        </>
    )

}
export default CoursesVerifyModal