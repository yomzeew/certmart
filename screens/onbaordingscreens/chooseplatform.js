import { SafeAreaView,View,Text,TouchableOpacity } from "react-native"
import { styles } from "../../settings/layoutsetting"
import { FontAwesome5,FontAwesome6 } from '@expo/vector-icons';
import { bluecolor, colorred, greencolor } from "../../constant/color";
import { useNavigation } from '@react-navigation/native';

const Chooseplaform=()=>{
    const navigation=useNavigation()
    const handlenavigate = (platform) => () => {
        console.log('ok');
        navigation.navigate("welcome", { platform: platform });
    };
   
    return(
    <SafeAreaView style={styles.andriod} className="flex-1 items-center justify-center bg-slate-100 w-full flex">
        <View style={{backgroundColor:colorred}} className="w-56 items-center px-2 py-3 rounded-xl">
            <Text style={{fontSize:16}} className="text-white">Choose your platform</Text>
            </View>
        <View className="flex flex-col flex-wrap">
            <TouchableOpacity onPress={handlenavigate('student')} className="w-32 h-32 items-center mt-5 rounded-xl bg-red-200 justify-center">
            <FontAwesome5 name="user-graduate" size={60} color={colorred} />
            <Text style={{fontSize:16}} className="font-semibold">Student</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={handlenavigate('trainer')} className="w-32 h-32 items-center mt-3 rounded-xl bg-green-200 justify-center">
            <FontAwesome5 name="user" size={60} color={greencolor} />
            <Text style={{fontSize:16}} className="font-semibold">Trainer</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlenavigate('study-center')} className="w-32 h-32 items-center mt-3 rounded-xl bg-cyan-200 justify-center">
            <FontAwesome6 name="building-columns" size={60} color={bluecolor} />
            <Text style={{fontSize:16}} className="font-semibold">Study Center</Text>
            </TouchableOpacity> */}


        </View>

    </SafeAreaView>
)
}
export default Chooseplaform