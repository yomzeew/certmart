import { useSelector } from 'react-redux';
import { getCertificate } from './fetchdata';
import { useEffect, useState } from 'react';
import { styles } from '../../../settings/layoutsetting';
import { SafeAreaView, View, Text, ScrollView,TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Header from './header';
import { colorred } from '../../../constant/color';
import { Divider } from "react-native-paper";
import { FontAwesome } from '@expo/vector-icons';
import { downloadFile } from '../../../utility/downloadfunction';


const Certificate = () => {
    const [preloader, setPreloader] = useState(false)
    const [data,setdata]=useState([])
    const user = useSelector((state) => state.activePage.user);
    console.log(user)
    const studentId = user.studentid
    const handledata = async () => {
        const resdata = await getCertificate(studentId)
        console.log(resdata,'resata')
        setdata(resdata)
        console.log(resdata)

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
                        Certificate
                    </Text>
                    <Divider theme={{ colors: { primary: colorred } }} />
                </View>
                <View className="flex-1 w-full">
                    <ScrollView contentContainerStyle={{paddingVertical:10}}>
                        {data.length>0?(
                            data.map((item,index)=>(
                                <CertificateCard item={item} keyvalue={index}/>
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
export default Certificate

const CertificateCard = ({item,keyvalue}) => {
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
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        downloadFile(fileUrl,fileName,fileUri)
       
    }
    return (
        <>
           
                <View key={keyvalue} style={{ backgroundColor: colorred }} className="h-[20%] w-full">
                    <View className="flex-row items-center justify-between h-full px-3">
                        <View>
                            <Text style={{ color: "#ffffff" }} variant="bodyMedium">
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