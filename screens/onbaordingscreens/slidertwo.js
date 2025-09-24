import { SafeAreaView, Text,View,Dimensions } from "react-native"
import Exam from "../images/exam.svg"
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
            <Exam width={height*0.4} height={width*0.5} />

            </View>
           
        <View  className="items-center">
            <View style={{backgroundColor:colorred}} className="w-56  h-16 flex justify-center items-center rounded-xl">
            <Text style={{fontSize:20}} className="text-2xl font-semibold text-center text-white">
                Introducing TestSkill by CertMart
                </Text>

            </View>
                
            </View>
            <View className="bg-slate-100 mt-3 py-3 px-3">
                <Text style={{fontSize:16}} className={`text-center`}>
                {`Do you want to validate your skills and earn industry-recognised certification? With CertMart exams, you can showcase your competence in tech, vocational, and academic fields.
Sit for your certification exam, receive the prestigious CertMart Certification Award, and access your official result—all to boost your career and credibility.
`}
                </Text>
            </View>
            <View className="items-center mt-20">
            
        </View>

        </View>
        
    </>
)
}
export default Slidertwo

