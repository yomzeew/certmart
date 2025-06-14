import {View,Text,TouchableOpacity} from 'react-native'
import { Avatar } from 'react-native-paper'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { topTrainers } from '../../../../settings/endpoint'
import { useState,useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'

const Toptrainer=()=>{
    const [showpreloader,setshowpreloader]=useState('')
    const [data,setdata]=useState([])
    const navigation=useNavigation()
    const fetchdata=async()=>{
   
        try{
            setshowpreloader(true)
            const token=await AsyncStorage.getItem('token')
            const response=await axios.get(topTrainers,{
                headers:{
                    "Authorization":`Bearer ${token}`
                }
    
            })
            setdata(response.data)
            console.log(response.data,'trainer')
    
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
    const hanldeTrainerProfile=(trainerid,trainerdp)=>{
        navigation.navigate('trainerProfileScreen',{trainerid,trainerdp})


    }
    
    return(
        <View className="flex flex-row">
        {data.map((item,index)=>(
        <TouchableOpacity onPress={()=>hanldeTrainerProfile(item.trainerid,item.dp)} className="items-center m-1" key={index}>
        {item.dp?<Avatar.Image source={{uri:`https://certmart.org/dps/${item.dp}.jpg?timestamp=${new Date().getTime()}`}}/>:<Avatar.Image source={require('../../../images/avatermale.png')}/>  }
        <Text className="font-semibold">{item.surname}</Text>
        </TouchableOpacity>
    ))}
        
   
   

    </View>
    )
}
export default Toptrainer