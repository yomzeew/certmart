import { Image, Text, View } from "react-native"
import { Button } from "react-native-paper"
import { colorred } from "../../constant/color"
import { fieldtexttwo } from "../../settings/fontsetting"
import LottieView from "lottie-react-native";
import {useRef,useEffect} from "react"

const SuccessModal=({message,action})=>{
    const animationRef = useRef(null);
    useEffect(() => {
        animationRef.current?.play();
      }, []);
    

    return(
        <>
       <View style={{elevation:50, zIndex:50}} className="relative justify-center items-center">
       <View className="w-64 px-3 py-3 h-56 flex justify-center flex-row items-center bg-white rounded-2xl shadow-md shadow-red-900">
            <View className="items-center">
                <View>
                    <Text className={`${fieldtexttwo} capitalize text-center`}>{message}</Text>
                </View>
                <LottieView
            ref={animationRef}
            source={require('../../assets/animations/success.json')}
            style={{ width: 50, height: 50 }}
            loop={false}
          />
           
            
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

       </View>
       
        <View  style={{ zIndex: 40, elevation: 40 }} className="h-full w-full bg-red-200 opacity-70 absolute" />

        </>
    )

}
export default SuccessModal