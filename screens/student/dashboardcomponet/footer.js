import {Text,View,TouchableOpacity} from 'react-native';
import { FontAwesome5,FontAwesome,Ionicons,MaterialCommunityIcons } from '@expo/vector-icons';
import { colorred } from '../../../constant/color';
const Footer=()=>{

    return(
        <>
         <View className="px-5 py-2 bg-white flex flex-row justify-evenly">
                    <TouchableOpacity style={{backgroundColor:colorred}} className="w-20 h-12 flex justify-center items-center rounded-xl">
                        <FontAwesome5 size={20} name="home" color="#ffffff" />
                        <Text className="text-white">Home</Text>

                    </TouchableOpacity>
                    <TouchableOpacity  className="w-20 h-12 flex justify-center items-center  rounded-xl">
                        <FontAwesome size={20} name="calendar" color="#000000" />
                        <Text className="text-black">Calendar</Text>

                    </TouchableOpacity>
                    <TouchableOpacity  className="w-20 h-12 flex justify-center items-center  rounded-xl">
                        <Ionicons name="chatbubble-sharp" size={24} color="black" />
                        <Text className="text-black">Chats</Text>

                    </TouchableOpacity>
                    <TouchableOpacity  className="w-20 h-12 flex justify-center items-center  rounded-xl">
                    <MaterialCommunityIcons name="face-man-profile" size={24} color="black" />
                        <Text className="text-black">Profile</Text>

                    </TouchableOpacity>
                    
                    
                    
            
                </View>
        </>
    )
}
export default Footer