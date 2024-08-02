import { FontAwesome5 } from "@expo/vector-icons"
import { Text, View,TouchableOpacity,ScrollView } from "react-native"
import { bluecolor, colorred, colorwhite } from "../../constant/color"
import { TextInput } from "react-native-paper"
import { useState } from "react"

const InputModal=({close,getvalue,senddata})=>{
    const [addinfo,setaddinfo]=useState(senddata)
    const handlechange=(text)=>{
        setaddinfo(text)
    }
    const handleclose=()=>{
        close(false)
    }
    const handgetvalue=()=>{
        getvalue(addinfo)

    }
    return(
        <>
        <View className="w-screen h-screen">
        
        <View className="absolute bottom-0 w-full px-2 py-3 h-2/3 bg-red-100  border border-slate-400 rounded-xl shadow-lg">
        <View>
             <View className="items-end">
        <TouchableOpacity onPress={handleclose}><FontAwesome5 size={20} color={colorred} name="times-circle"/></TouchableOpacity>
        </View>
        
        <View className="py-5 h-5/6 items-center">
        <TextInput
             label="Additional Info"
             mode="outlined"
             theme={{ colors: { primary: colorred} }}
             onChangeText={text => handlechange(text)}
             value={addinfo}
             className="w-full mt-3 bg-slate-50"
             textColor="#000000"
             multiline
             numberOfLines={4}
             
            />
            <View className="mt-3 items-start">
                <TouchableOpacity onPress={handgetvalue} style={{backgroundColor:colorred}} className="h-12 rounded-2xl w-12 flex justify-center items-center">
                    <Text style={{fontSize:16}} className="text-white"><FontAwesome5 color={colorwhite} size={20} name="check"/>OK</Text>
                    </TouchableOpacity>
            </View>
        

        </View>

        

        </View>
       

        
   
     
</View>


        </View>
        </>
    )
}
export default InputModal