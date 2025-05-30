
import { colorred, grey } from '../../../../constant/color'
import {View,Text,TouchableOpacity,ScrollView} from 'react-native'
import { useNavigation } from "@react-navigation/native";

const PopularCourses=({data,setshowModal,showModal,handleactionseeall})=>{
    const handleshowmodal=()=>{
        handleactionseeall()
        setshowModal(!showModal)


    }
        const navigation = useNavigation();
        const handlenavigate=(course)=>{
            navigation.navigate('coursesdetail',{course:course})
        }
    return(
        <View className="flex flex-row mt-3">
             <TouchableOpacity onPress={handleshowmodal} style={{ backgroundColor: grey }} className="flex-shrink rounded-xl h-8 flex flex-row justify-center items-center px-4">
                                <Text style={{ fontSize: 12 }} className="font-semibold">All</Text>
                            </TouchableOpacity>
                            {data.map((item,index)=>(
                                <TouchableOpacity onPress={()=>handlenavigate(item.coursecode)} key={index} style={{ backgroundColor: colorred }} className="flex-shrink rounded-xl h-8 flex flex-row justify-center items-center ml-3 px-4">
                                <Text style={{ fontSize: 12 }} className="font-semibold text-white">{item.course}</Text>
                            </TouchableOpacity>
                            )) }
        </View>
    )
}
export default PopularCourses