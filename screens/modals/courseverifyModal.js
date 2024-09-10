import { View,Text, TouchableOpacity } from "react-native"
import { colorred } from "../../constant/color"

const CoursesVerifyModal=({data})=>{
    const[type,settype]=useState('Virtual')
    return(
        <>
        <View className="w-32 h-64 rounded-2xl border-2 border-red-500">
            <View><Text>Web Design - HTML and CSS</Text></View>
            <View><Text>Nigeria</Text></View>
            <View><Text>Ondo State</Text></View>
            <View><Text>Decision Comment</Text></View>
            <View className="mt-3">
            <TouchableOpacity
            style={{color:colorred}}
            className="h-12 mt-3 w-3/4 flex justify-center"
            >
                <Text>View CV</Text>
            </TouchableOpacity>

            </View>
        

            

            
        </View>
        </>
    )

}
export default CoursesVerifyModal