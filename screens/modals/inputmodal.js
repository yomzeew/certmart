import { FontAwesome5 } from "@expo/vector-icons"
import { Text, View, TouchableOpacity } from "react-native"
import { colorred, colorwhite } from "../../constant/color"
import { useState } from "react"
import CustomTextInput from "../../components/CustomTextInput"

const InputModal = ({ close, getvalue, senddata }) => {
    const [addinfo, setaddinfo] = useState(senddata)

    const handlechange = (text) => {
        setaddinfo(text)
    }

    const handleclose = () => {
        close(false)
    }

    const handgetvalue = () => {
        getvalue(addinfo)
    }

    return (
        <View className="w-screen h-screen">
            <View className="absolute bottom-0 w-full px-4 py-4 h-2/3 bg-white border-t border-gray-200 rounded-t-3xl shadow-xl">
                <View className="items-center mb-4">
                    <View className="w-12 h-1 bg-gray-300 rounded-full"></View>
                </View>

                <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-800 text-center mb-4">Additional Information</Text>

                    <View className="px-2">
                        <CustomTextInput
                            label="Enter additional details..."
                            value={addinfo}
                            onChangeText={handlechange}
                            multiline
                            numberOfLines={6}
                            placeholder="Type your additional information here..."
                        />
                    </View>

                    <View className="flex-row justify-between mt-6 px-2">
                        <TouchableOpacity
                            onPress={handleclose}
                            className="flex-1 mr-2 py-3 bg-gray-200 rounded-xl items-center"
                        >
                            <Text className="text-gray-700 font-medium">Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handgetvalue}
                            className="flex-1 ml-2 py-3 bg-red-500 rounded-xl items-center"
                        >
                            <Text className="text-white font-medium">Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default InputModal