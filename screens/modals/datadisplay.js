import { FontAwesome5 } from "@expo/vector-icons"
import { Text, View, TouchableOpacity, ScrollView } from "react-native"
import { colorred, grey } from "../../constant/color"
import { TextInput } from "react-native-paper"
import { useState } from "react"

const DisplayModal = ({ data, close, getvaluefunction }) => {
    const [searchdata, setsearchdata] = useState('')
    const [dataset, setdataset] = useState(data)
    const handleclose = () => {
        close(false)
    }
    const handlegetvalue = (value) => {
        getvaluefunction(value)
    }
    const handlesearch = () => {
        const dataview = data.filter((item) => item.toLowerCase().includes(searchdata.toLowerCase()))
        setdataset(dataview)
    }
    const handlechange = (text) => {

        const dataview = data.filter((item) => item.toLowerCase().includes(text.toLowerCase()))
        setdataset(dataview)
        setsearchdata(text)
    }

    return (
        <>
            <View className="w-screen h-screen">

                <View  style={{ zIndex: 50, elevation: 50 }} className="absolute bottom-0 w-full px-2 py-3  h-2/3 bg-red-100  border border-slate-400 rounded-xl shadow-lg">
                    <View>
                        <View className="items-end">
                            <TouchableOpacity onPress={handleclose}><FontAwesome5 size={20} color={colorred} name="times-circle" /></TouchableOpacity>
                        </View>
                        <View className="items-center">
                            <View  style={{ zIndex: 50, elevation: 50 }} className="absolute top-8 right-3 z-50"><TouchableOpacity onPress={handlesearch}><FontAwesome5 color={colorred} size={20} name="search" /></TouchableOpacity></View>
                            <View className="w-3/4">
                            <TextInput
                                placeholderTextColor={grey}
                                label="Search"
                                mode="outlined"
                                theme={{ colors: { primary: colorred } }}
                                onChangeText={text => handlechange(text)}
                                value={searchdata}
                                className="w-full mt-3"
                                textColor="#000000"

                            />
                            </View>
                        </View>
                        <View className="py-5 h-5/6">
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                            >
                                {dataset.length > 0 ? dataset.map((item, index) => {
                                    return (
                                        <TouchableOpacity key={index} onPress={() => handlegetvalue(item)} className="bg-slate-50 px-5 h-12 flex justify-center w-full border-b border-t border-lightred mt-2">
                                            <Text style={{ fontSize: 16 }}>
                                                {item}
                                            </Text>
                                        </TouchableOpacity>

                                    )
                                }) : <View><Text>No Records Found</Text></View>

                                }

                            </ScrollView>

                        </View>



                    </View>





                </View>


            </View>
        </>
    )
}
export default DisplayModal