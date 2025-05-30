import { useSelector } from 'react-redux';
import { getEresource } from './fetchdata';
import { useEffect, useState } from 'react';
import { styles } from '../../../settings/layoutsetting';
import { SafeAreaView, View, Text, ScrollView,TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Header from './header';
import { colorred } from '../../../constant/color';
import { Divider } from "react-native-paper";
import { FontAwesome } from '@expo/vector-icons';
import { downloadFile } from '../../../utility/downloadfunction';



const Eresources = () => {
    const [preloader, setPreloader] = useState(false)
    const [data,setdata]=useState([])
    const user = useSelector((state) => state.activePage.user);
    console.log(user)
    const studentId = user.studentid
    const handledata = async () => {
        console.log(studentId, 'ok')
        const resdata = await getEresource(studentId)
        setdata(resdata)

    }
    useEffect(() => {
        handledata()
    }, [])
    return (
        <>
            <SafeAreaView
                style={[styles.andriod, styles.bgcolor]}
                className="flex flex-1 w-full"
            >
                <StatusBar style="auto" />
                <Header />
                <View className="px-5">
                    <Text style={{ fontSize: 20, color: colorred }} className="font-semibold">
                        E-Resources
                    </Text>
                    <Divider theme={{ colors: { primary: colorred } }} />
                </View>
                <View className="flex-1 w-full px-3">
                    <ScrollView contentContainerStyle={{paddingVertical:10}}>
                        {data.length>0?(
                            data.map((item,index)=>(
                                <EresourcesCard item={item} keyvalue={index}/>
                            ))):(
                            <View className="w-full items-center">
                            <Text>No Record</Text>
                            </View>
                        )}

                    </ScrollView>

                </View>

            </SafeAreaView>

        </>
    )
}
export default Eresources

const EresourcesCard = ({item,keyvalue}) => {
    // "course": "DAT034",
    // coursename:""
    // courselink:""
    // "id": 1,
    // "title": "Intro to data",
    // "trainer": "JIT/T/04",
    // "type": "txt",
    // "uploaddate": "2024-04-09 10:39:14"
    const handleselectItem=(value)=>{
        const fileUrl = `https://certmart.org/${item.courselink}`;
        const fileName = `${item.coursename.replace(/\s+/g, '_')}.pdf`;
        downloadFile(fileUrl,fileName)
       
    }
    return (
        <>
           
                <View key={keyvalue} style={{ backgroundColor: colorred }} className="h-[25%] w-full mt-3 rounded-2xl">
                    <View className="flex-row items-center justify-between h-full px-3">
                        <View>
                            <Text style={{ color: "#ffffff",fontSize:12 }} variant="bodyMedium">
                                {item.coursename}
                            </Text>

                        </View>

                        <TouchableOpacity onPress={() => handleselectItem(item)} className="bg-red-500 px-2 py-2 flex-row">
                            <FontAwesome size={20} color="black" name='download'/>
                            <Text className="text-white">Download</Text>
                        </TouchableOpacity>


                    </View>


                </View>

           
        </>
    )

}