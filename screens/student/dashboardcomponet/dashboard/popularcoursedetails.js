import AsyncStorage from '@react-native-async-storage/async-storage'
import { coursescategories, popularcourses } from '../../../../settings/endpoint'
import { FontAwesome, FontAwesome5,Ionicons,MaterialCommunityIcons,MaterialIcons } from '@expo/vector-icons'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigation } from "@react-navigation/native";
import { colorred, grey } from '../../../../constant/color'
import {View,Text,TouchableOpacity,ScrollView} from 'react-native'
import { Card } from 'react-native-paper'
const PopularCoursesdetails=({data})=>{
    const navigation = useNavigation();
    const handlenavigate=(course)=>{
        navigation.navigate('coursesdetail',{course:course})
    }
    return(
        <View className="flex flex-row w-full py-2">
             {data.map((item,index)=>(
                <View className="p-2">
                        <TouchableOpacity onPress={()=>handlenavigate(item.coursecode)}>
               
               <Card className="w-56 h-64 bg-white">
                    <Card.Cover source={{uri: `https://certmart.org/icon/${item.icon}.jpeg` }} />
                    <Card.Content>
                        <Text style={{ color: colorred }} className="font-semibold mt-2" variant="titleLarge">{item.course}</Text>
                        <Text variant="bodyMedium">₦{item.cost} | Duration {item.duration} weeks</Text>
                    </Card.Content>
                </Card>
                </TouchableOpacity> 
                    </View>
         
             ))}
             
                            </View>
    )
}
export default PopularCoursesdetails