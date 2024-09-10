import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { allcourses } from "./endpoint"

export const fetchdataall=async()=>{
    try{
       
        const token=await AsyncStorage.getItem('token')
        const response=await axios.get(allcourses,{
            headers:{
                "Authorization":`Bearer ${token}`
            }

        })
        console.log(response.data.data)
        const alldata=response.data.data
        return alldata

       
       

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
        
    }
   
}
