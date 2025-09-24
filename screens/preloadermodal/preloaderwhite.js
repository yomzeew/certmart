import { ProgressBar, MD3Colors } from 'react-native-paper';
import { View } from 'react-native';
import { colorred } from '../../constant/color';
const Preloader=()=>{
    return(
        <>
        <View className="h-full w-full justify-center flex items-center">
            <View 
            className="h-full w-full absolute bg-slate-200 opacity-80"
            />
            <View className="px-8 w-1/2">
            <ProgressBar
             theme={{ colors: { primary: colorred} }}
            color={MD3Colors.red800} indeterminate={true} 
            progress={0.5}
            />
            </View>
        </View>
        </>

    )
}
export default Preloader