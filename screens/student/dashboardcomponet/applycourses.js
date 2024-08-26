import { SafeAreaView, View, Text } from "react-native"
import { styles } from "../../../settings/layoutsetting"
import Header from "./header"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { bluecolor, colorred, colorwhite, lightred } from "../../../constant/color"
import { Divider, TextInput } from "react-native-paper"
import { FontAwesome5 } from "@expo/vector-icons"
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useEffect, useState } from "react"
import Footer from "./footer"
import DisplayModal from "../../modals/datadisplay"
import { fetchData } from "../../jsondata/fetchfunction"
import * as DocumentPicker from 'expo-document-picker';
import { uploadFile } from "../../uploadfile/uploadfile"
import InputModal from "../../modals/inputmodal"

const ApplyCourses = () => {
    const [showphysical,setshowphysical]=useState(false)
    const [showmodalcourse,setshowmodalcourse]=useState(false)
    const [showmodalinput,setshowmodalinput]=useState(false)
    const [showopcity,setshowopcity]=useState(false)
    const [classtype,setclasstype]=useState('')
    const [course,setcourse]=useState('')
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [city,setcity]=useState('')
    const [computerlevel,setcomputerlevel]=useState('')
    const [addinfo,setaddinfo]=useState('')
    const [countryData, setCountryData] = useState([]);
    const [stateData, setStateData] = useState([]);
    const [cityData, setCityData] = useState([]);
    const [data,setdata]=useState([])
    const [selecttype,setselecttpe]=useState('')
    const [cvfilename,setcvfilename]=useState('')
    const [errormsg,seterrormsg]=useState('')
    

    const datacourse=['Advance Excel \n6 Weeks','Android App Development\n10 Weeks','Animation and Motion Graphics\n10 Weeks','Artificial Intelligence (AI) with python\n10 Weeks','Autocad\n10 Weeks','C# Programming']
    const computerliteracy=['Novice','Beginner','Basic','Intermediate','Advanced']
    useEffect(()=>{
     setdata(datacourse)

    },[])
    useEffect(()=>{
        if(showmodalcourse||showmodalinput){
            setshowopcity(true)
        } 
        else{
            setshowopcity(false)
        }
    },[showmodalcourse,showmodalinput])

    const hanleshowphsical=()=>{
        setclasstype('physical')
        setshowphysical(!showphysical)
    }
    const hanleshowvirtual=()=>{
        setclasstype('virtual')
        setshowphysical(!showphysical)
    }
  
    const translateY = useSharedValue(300);
    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));
    const translateYinput = useSharedValue(300);
    const animatedStylesinput = useAnimatedStyle(() => ({
        transform: [{ translateY: translateYinput.value }],
    }));
    const handlecourses=()=>{
        setdata(datacourse)
        setselecttpe('course')
        translateY.value = withSpring(0);
        setshowmodalcourse(!showmodalcourse)
       
    }
    const handlecountry=()=>{
        setselecttpe('country')
        setdata(countryData)
        translateY.value = withSpring(0);
        setshowmodalcourse(!showmodalcourse)
        setState('')
        setcity('')
    }
    const handlestate=async()=>{
        setselecttpe('state')
        const datastate=await fetchData(country)
        setdata(datastate)

        translateY.value = withSpring(0);
        setshowmodalcourse(!showmodalcourse)
        setcity('')
    
    }
    const handlecity = async() => {
        setselecttpe('city');
        const datastate=await fetchData(country,state)
        setdata(datastate)
        translateY.value = withSpring(0);
        setshowmodalcourse(!showmodalcourse);
    };
    const handlecomputer=()=>{
        setselecttpe('computer');
        setdata(computerliteracy);
        translateY.value = withSpring(0);
        setshowmodalcourse(!showmodalcourse);
    }
    const handleaddinfo=()=>{
        translateYinput.value = withSpring(0);
        setshowmodalinput(!showmodalinput);

    }

    const handleclose=(value)=>{
        setshowmodalcourse(value)
        translateY.value = withSpring(300);
    }
    const handlecloseinput=(value)=>{
        setshowmodalinput(value)
        translateYinput.value = withSpring(300);
    }
    const handlegetvalue=(value)=>{
        const getvalue=value
        if(selecttype==='course'){
            setcourse(getvalue)
            
        }
        else if (selecttype==='country'){
            setCountry(value)
           
        }
        else if(selecttype==='state'){
            setState(value)
            
        }
     else if (selecttype === 'city') {
        setcity(value);
    }
    else if(selecttype==='computer'){
        setcomputerlevel(value)
    }
       
        
        setshowmodalcourse(false)
        translateY.value = withSpring(300);
       
    }
    const getvalue=(value)=>{
        setaddinfo(value)
        setshowmodalinput(false)
        translateYinput.value = withSpring(300);
    }
    useEffect(() => {
        const getData = async () => {
            try {
                if (!country) {
                    const data = await fetchData();
                    setCountryData(data);
                } else if (country && !state) {
                    const data = await fetchData(country);
                    setStateData(data);
                } else if (country && state) {
                    const data = await fetchData(country, state);
                    setCityData(data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        getData();
    }, [country, state]);
    
   const getdocument=async()=>{
    const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });
      if(result.assets.length>0){
        const resultname=result.assets[0].name
        setcvfilename(resultname)
      }
     
      if(result.assets[0].size>512000){
        seterrormsg('File size should be less than 50kb')
        return
    }
    else{
        uploadFile(result.assets[0])
        seterrormsg('')
        
    }
      if (result.type === 'success') {
        // uploadFile(result)
        console.log('ok')
        setcvfilename(result.name)

      }
   }
     
    return (
        <>
        {showopcity &&<View className="h-full w-full z-50  absolute bg-red-100 opacity-70"/>}
        {showmodalcourse &&<View className="bottom-0 absolute z-50">
            <Animated.View style={[animatedStyles]}>
            <DisplayModal
            data={data} 
            close={(value)=>handleclose(value)}
            getvaluefunction={(value)=>handlegetvalue(value)}
           
            />
                    </Animated.View>
            </View>}
            {showmodalinput &&<View className="bottom-0 absolute z-50">
            <Animated.View style={[animatedStylesinput]}>
            <InputModal
            close={(value)=>handlecloseinput(value)}
            getvalue={(value)=>getvalue(value)}
            senddata={addinfo}
           
            />
                    </Animated.View>
            </View>}
        <SafeAreaView style={[styles.andriod, styles.bgcolor]} className="flex flex-1 w-full">
           
            <Header/>
            <View className="flex-1">
                <View className="mt-3 px-5">
                    <Text style={{ fontSize: 20, color: colorred }} className="font-semibold">Apply for Course</Text>
                    <Divider theme={{ colors: { primary: colorred } }} />
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                <View className="px-5 mt-10">
                    {course &&<View className="absolute z-50 left-8 -top-2 bg-white"><Text>Select Courses</Text></View>}
                    <TouchableOpacity onPress={handlecourses} className="h-12 rounded-2xl flex justify-center items-start px-3 border border-lightred bg-white">

                        <Text style={{ fontSize: 16 }} className="text-black">{course?course:<Text><FontAwesome5 size={20} color={colorred} name="arrow-circle-down" /> Select Courses</Text>}</Text>
                    </TouchableOpacity>


                </View>
                <View className="px-5 mt-5">
                    <Text style={{ fontSize: 16 }} className="text-black"> Select Class Type </Text>
                    <View className="w-full flex justify-center flex-row mt-1">
                        <TouchableOpacity onPress={hanleshowvirtual} style={{ backgroundColor:!showphysical?lightred:colorwhite }} className="h-12 w-44 flex justify-center items-center">
                            <Text style={{ fontSize: 16 }}>Virtual</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={hanleshowphsical} style={{ backgroundColor:showphysical?lightred:colorwhite}} className="h-12 w-44 flex justify-center border border-lightred items-center">
                            <Text style={{ fontSize: 16 }}>Physical</Text>
                        </TouchableOpacity>
                    </View>


                </View>
                {showphysical &&<View>
                    <View className="px-5 mt-5">
                        {country &&<View className="absolute z-50 left-8 -top-2 bg-white"><Text>Select Country</Text></View>}
                        <TouchableOpacity  onPress={handlecountry} className="h-12 rounded-2xl flex justify-center items-start px-3 border border-lightred bg-white">

                            <Text style={{ fontSize: 16 }} className="text-black">{country?country:<Text><FontAwesome5 size={20} color={colorred} name="arrow-circle-down" /> Select Country</Text>}</Text>
                        </TouchableOpacity>


                    </View>
                    <View className="px-5 mt-5">
                        {state &&<View className="absolute z-50 left-8 -top-2 bg-white"><Text>Select State</Text></View>}
                        <TouchableOpacity onPress={handlestate} className="h-12 rounded-2xl flex justify-center items-start px-3 border border-lightred bg-white">

                            <Text style={{ fontSize: 16 }} className="text-black">{state?state:<Text><FontAwesome5 size={20} color={colorred} name="arrow-circle-down" /> Select State</Text>}</Text>
                        </TouchableOpacity>


                    </View>
                    <View className="px-5 mt-5">
                    {city &&<View className="absolute z-50 left-8 -top-2 bg-white"><Text>Select City</Text></View>}
                        <TouchableOpacity onPress={handlecity} className="h-12 rounded-2xl flex justify-center items-start px-3 border border-lightred bg-white">
                            <Text style={{ fontSize: 16 }} className="text-black">{city?city:<Text><FontAwesome5 size={20} color={colorred} name="arrow-circle-down" /> Select City</Text>}</Text>
                        </TouchableOpacity>


                    </View>

                    <View className="px-5 mt-5">
                        {city &&<View className="absolute z-50 left-8 -top-2 bg-white"><Text>Select Study City</Text></View>}
                        <TouchableOpacity className="h-12 rounded-2xl flex justify-center items-start px-3 border border-lightred bg-white">
                            <Text style={{ fontSize: 16 }} className="text-black">{city?city:<Text><FontAwesome5 size={20} color={colorred} name="arrow-circle-down" /> Select Study City</Text>}</Text>
                        </TouchableOpacity>


                    </View>

                </View>}
                <View className="mt-3">
                    <View className="px-7"><Text>{cvfilename} <Text style={{color:colorred}}>{errormsg}</Text></Text></View>
                    <View className="px-5">
                        <TouchableOpacity onPress={getdocument} style={{ backgroundColor: lightred }} className="h-12 flex justify-center items-center w-full rounded-2xl mt-1">
                            <Text>Upload Cv</Text>
                        </TouchableOpacity>
                        <Text className="text-center">CV (PDFs only) *optional</Text>

                    </View>

                    <View className="px-5 mt-5">
                        {computerlevel &&<View className="absolute z-50 left-8 -top-2 bg-white"><Text>Select Computer Literacy</Text></View>}
                        <TouchableOpacity onPress={handlecomputer} className="h-12 rounded-2xl flex justify-center items-start px-3 border border-lightred bg-white">
                            <Text style={{ fontSize: 16 }} className="text-black">{computerlevel?computerlevel:<Text><FontAwesome5 size={20} color={colorred} name="arrow-circle-down" /> Select Computer Literacy</Text>}</Text>
                        </TouchableOpacity>


                    </View>
                    <View className="px-5 mt-3">
                        {addinfo &&<View><Text className="text-justify">{addinfo}</Text></View>}
                        <TouchableOpacity onPress={handleaddinfo} style={{ backgroundColor: lightred }} className="h-12 flex justify-center items-center w-full rounded-2xl mt-1">
                            <Text><FontAwesome5 name="plus" /> Additional info that could help your admission</Text>
                        </TouchableOpacity>

                    </View>


                    {/* <TextInput
                        label="Additional info that could help your admission"
                        mode="outlined"
                        theme={{ colors: { primary: colorred } }}
                        className="w-3/4 mt-3 bg-slate-50"
                        textColor="#000000"
                        multiline
                        numberOfLines={4}
                        

                    /> */}


                </View>
                <View className="mt-3 px-5">
                <TouchableOpacity style={{ backgroundColor: colorred }} className="h-12 flex justify-center items-center w-full rounded-2xl mt-1">
                            <Text style={{fontSize:16}} className="text-white font-semibold">Submit</Text>
                        </TouchableOpacity>

                </View>

                </ScrollView>
            </View>
            <Footer/>
            
        </SafeAreaView>
        </>
    )
}
export default ApplyCourses