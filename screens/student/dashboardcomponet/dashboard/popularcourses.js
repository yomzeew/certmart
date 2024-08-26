import AsyncStorage from '@react-native-async-storage/async-storage'
import { coursescategories, popularcourses } from '../../../../settings/endpoint'
import { FontAwesome, FontAwesome5,Ionicons,MaterialCommunityIcons,MaterialIcons } from '@expo/vector-icons'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { colorred, grey } from '../../../../constant/color'
import {View,Text,TouchableOpacity,ScrollView} from 'react-native'
const PopularCourses=({data})=>{
    return(
        <View className="flex flex-row mt-3">
             <TouchableOpacity style={{ backgroundColor: grey }} className="flex-shrink rounded-xl h-8 flex flex-row justify-center items-center px-4">
                                <Text style={{ fontSize: 12 }} className="font-semibold">All</Text>
                            </TouchableOpacity>
                            {data.map((item,index)=>(
                                <TouchableOpacity style={{ backgroundColor: colorred }} className="flex-shrink rounded-xl h-8 flex flex-row justify-center items-center ml-3 px-4">
                                <Text style={{ fontSize: 12 }} className="font-semibold text-white">{item.course}</Text>
                            </TouchableOpacity>
                            )) }
        </View>
    )
}
export default PopularCourses