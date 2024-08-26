import { SafeAreaView, Text,View,Dimensions } from "react-native"
import One from "../images/1.svg"
import Two from "../images/2.svg"
import Three  from "../images/3.svg"
import { fieldtextfour,fieldtextone, fieldtextthree, fieldtexttwo } from "../../settings/fontsetting"
import { colorred } from "../../constant/color"
import { StatusBar } from "expo-status-bar"
const Slidertwo=()=>{
    const { height } = Dimensions.get('window');
    const { width } = Dimensions.get('window');
return(
    <>
    
        <View style={{height:height*0.8}} className="px-2 flex ">
            <View className="w-full flex-1 justify-center flex items-center">
            <Two width={height*0.4} height={width*0.5} />

            </View>
           
        <View  className="items-center">
            <View style={{backgroundColor:colorred}} className="w-56  h-16 flex justify-center items-center rounded-xl">
            <Text style={{fontSize:20}} className="text-2xl font-semibold text-center text-white">
                  Introducing SkillHub by CertMart
                </Text>

            </View>
                
            </View>
            <View className="bg-slate-100 mt-3 py-3 px-3">
                <Text style={{fontSize:16}} className={`text-center`}>
                {`Are you a skilled expert in high-demand tech and vocational skills, eager to share your knowledge and earn extra income?\nJoin Certmart and share your expertise with enthusiastic learners both in local hubs and virtual spaces. Empower others while boosting your own income!`}
                </Text>
            </View>
            <View className="items-center mt-20">
            
        </View>

        </View>
        
    </>
)
}
export default Slidertwo