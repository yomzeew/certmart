import { View,SafeAreaView } from "react-native"
import Header from "../header"
import { styles } from "../../../../settings/layoutsetting"

const ApplicationCheckers=()=>{
    return(
        <>
        <View className="w-full h-full">
        <SafeAreaView
        style={[styles.andriod, styles.bgcolor]}
        className="flex flex-1 w-full"
      >
            <Header/>
    </SafeAreaView>
            

        </View>

        </>
    )
}
export default ApplicationCheckers