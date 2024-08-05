import { Image, Text, View } from "react-native"
import { Button } from "react-native-paper"
import { colorred } from "../../constant/color"
import { fieldtexttwo } from "../../settings/fontsetting"

const SuccessModal=({message,action})=>{
    return(
        <>
        <View className="h-full w-full bg-red-200 opacity-70 absolute" />
        <View style={{elevation:4}} className="w-64 px-3 py-3 h-56 flex justify-center flex-row items-center bg-white rounded-2xl shadow-md shadow-red-900">
            <View className="items-center">
                <View>
                    <Text className={`${fieldtexttwo} capitalize text-center`}>{message}</Text>
                </View>
            <Image source={require('../images/successicon.gif')} resizeMode="contain" className="w-24 h-24" />
            
            <View>
                <Button
                onPress={()=>{action()}}
                 mode="contained"
                 theme={{ colors: { primary: colorred } }}
                 className="h-12 mt-3  flex justify-center"
                 textColor="#ffffff"
                >
                    <Text>Ok</Text>
                </Button>
            </View>

            </View>
  

        </View>

        </>
    )

}
export default SuccessModal