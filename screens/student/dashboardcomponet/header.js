import { Text, TouchableOpacity, View } from "react-native"
import { FontAwesome5 } from "@expo/vector-icons"
import { colorred } from "../../../constant/color"
import { useNavigation } from "@react-navigation/native"

const Header=()=>{
    const navigation=useNavigation()
    return(
        <>
        
        <View className="w-full justify-between flex flex-row items-center px-5 mt-3">
                <TouchableOpacity onPress={() => navigation.openDrawer()}><FontAwesome5 size={24} name="bars" color={colorred} /></TouchableOpacity>
                 
                    <View className="flex flex-row items-center">
                        <TouchableOpacity><FontAwesome5 size={18} name="bell" color={colorred} /></TouchableOpacity>
                        <View className="w-5" />
                        <TouchableOpacity><FontAwesome5 size={24} name="cog" color={colorred} /></TouchableOpacity>

                    </View>





                </View>
        </>
    )
}
export default Header