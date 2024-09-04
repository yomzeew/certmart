import {View,Text,TouchableOpacity} from 'react-native'
import { Avatar } from 'react-native-paper'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { topTrainers } from '../../../../settings/endpoint'
import { useState,useEffect } from 'react'

const Toptrainer=()=>{
    const [showpreloader,setshowpreloader]=useState('')
    const [data,setdata]=useState([])
    const fetchdata=async()=>{
   
        try{
            setshowpreloader(true)
            const token=await AsyncStorage.getItem('token')
            const response=await axios.get(topTrainers,{
                headers:{
                    "Authorization":`Bearer ${token}`
                }
    
            })
            console.log(response.data)
            setdata(response.data)
    
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
    
    },[])
    
    return(
        <View className="flex flex-row">
        {data.map((item,index)=>(
        <View className="items-center m-1">
        {item.dp?<Avatar.Image source={{uri:`https://certmart.org/dps/${item.dp}.jpg`}}/>:<Avatar.Image source={require('../../../images/avatermale.png')}/>  }
        <Text className="font-semibold">{item.surname}</Text>
        </View>
    ))}
        
   
   

    </View>
    )
}
export default Toptrainer