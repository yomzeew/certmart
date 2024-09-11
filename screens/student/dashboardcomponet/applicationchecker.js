import { View,SafeAreaView } from "react-native"
import Header from "./header"
import { styles } from "../../../settings/layoutsetting"
import CoursesVerifyModal from "../../modals/courseverifyModal"

const ApplicationCheckers=()=>{
    return(
        <>
        <View className="w-full h-full">
        <SafeAreaView
        style={[styles.andriod, styles.bgcolor]}
        className="flex flex-1 w-full"
      >
            <Header/>
            <View className="mt-3 px-3">
                <CoursesVerifyModal/>
            </View>
    </SafeAreaView>
            

        </View>

        </>
    )
}
export default ApplicationCheckers