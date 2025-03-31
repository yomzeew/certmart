import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator,TouchableWithoutFeedback,Keyboard,KeyboardAvoidingView } from "react-native";
import Header from "../header";
import { StatusBar } from "expo-status-bar";
import { TextInput, Button } from "react-native-paper";
import { colorred } from "../../../../constant/color";
import { styles } from "../../../../settings/layoutsetting";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createIssue, getIssuesByemail } from "../fetchdata";
import SuccessModal from "../../../modals/successfulmodal";
import Preloader from "../../../preloadermodal/preloaderwhite";

const Issues = () => {
    const [active,setactive]=useState('View')
    const email = useSelector((state) => state.activePage.email);
    const [data,setData]=useState([])
    const [subject,setSubject]=useState("")
    const [message,setMessage]=useState("")
    const [errorMsg,seterrorMsg]=useState("")
    const [preloader,setpreloader]=useState(false)
    const [showsuccess,setshowsuccess]=useState(false)
    const [preloaderdata,setpreloaderdata]=useState(false)
    const handleSelection=(value)=>{
        setactive(value)
        
    }
    const fetchIssuees=async()=>{
        try {
            setpreloaderdata(true)
            const getdata = await getIssuesByemail(email);
            console.log(getdata)
            setData(getdata.data)
            
        } catch (error) {
            console.error("Failed to fetch issues", error);
        }finally{
            setpreloaderdata(false)
        }
    }
    useEffect(()=>{
        fetchIssuees();
    },[])

    const submitIssue = async () => {
        if (!subject) {
            seterrorMsg("Please Enter Subject");
            return;
        }
        if (!message) {
            seterrorMsg("Please Enter Message");
            return;
        }
    
        const dataone = { issuer: email, subject, message, status: "Opened" };
    
        console.log("Issue Data:", dataone); // Debugging Step
    
        try {
            setpreloader(true);
            const getdata = await createIssue(dataone);
            if(getdata){
                setshowsuccess(true)
                setMessage("")
                setSubject("")
            }


        } catch (error) {
            console.error("Failed to fetch issues", error);
        } finally {
            setpreloader(false);
        }
    };
    

    return (
        <>
        {preloaderdata &&
         <>
            <Preloader/>
         
         </>

        }
        {showsuccess && 
        <>
        <View className="h-full w-full absolute z-50 bg-red-200 opacity-70"/>
        <View className="h-full w-full items-center justify-center z-50 absolute">
             <SuccessModal
             message={'Issues Sent'}
             action={()=>setshowsuccess(false)}
             />
        </View>
        </>
       
        }
        <SafeAreaView style={[styles.andriod, styles.bgcolor, { flex: 1, width: "100%" }]}>
            <StatusBar style="auto" />
            <Header />
            
            <View style={{ padding: 16 }} className="h-full w-full">
                <View className="w-full">
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Issues</Text>
                </View>
                
                <View className="w-full mt-3 gap-x-3 flex-row  justify-center">

                    <TouchableOpacity onPress={()=>handleSelection('View')} className={`${active==='View'?'bg-red-500 ':'bg-transparent border-b border-red-300'} justify-center items-center w-20 h-12 rounded-xl`}>
                        <Text className={`${active==='View'?'text-white':'text-black'}`}>View Issues</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>handleSelection('Create')} className={`${active==='Create'?'bg-red-500 ':'bg-transparent border-b border-red-300' } justify-center items-center w-20 h-12 rounded-xl`}>
                        <Text className={`${active==='Create'?'text-white':'text-black'}`}>Create Issues</Text>
                    </TouchableOpacity>

                </View>

                {active==='Create'?
                <View className="h-[60%]">
               <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
               <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                   <ScrollView 
                       contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 12 }}
                       keyboardShouldPersistTaps="handled"
                   >
                       <View className="w-full px-3">
                           <View className="w-full items-center">
                               <Text className="text-center text-red-300">{errorMsg}</Text>
                           </View> 
           
                           <TextInput 
                               placeholder="Enter your Subject" 
                               multiline={true} 
                               mode="outlined" 
                               style={{ marginTop: 12 }} 
                               value={subject}
                               onChangeText={(text)=>setSubject(text)}
                           />
                           
                           <TextInput 
                               placeholder="Enter your Issues" 
                               multiline={true} 
                               mode="outlined" 
                               style={{ marginTop: 12 }} 
                               value={message}
                               onChangeText={(text)=>setMessage(text)}
                           />
           
                           <Button
                               mode="contained"
                               theme={{ colors: { primary: colorred } }}
                               textColor="#ffffff"
                               style={{ height: 48, marginTop: 16, justifyContent: "center", width: "100%" }}
                               disabled={preloader}
                               onPress={submitIssue}
                           >
                               <Text style={{ fontSize: 18 }}>
                                   {preloader ? <ActivityIndicator /> : "Submit"}
                               </Text>
                           </Button>
                       </View>
                   </ScrollView>
               </TouchableWithoutFeedback>
           </KeyboardAvoidingView>
           </View>:
                <View className="w-full mt-3 h-[80%]">
                    <ScrollView showsVerticalScrollIndicator={false}>
                    {data.length>0?data.map((item,index)=>(
                        <>
                        <CardDisplayIssue
                        subject={item.subject}
                        statusget={item.status}
                        message={item.message}

                        />
                        </>
                    )):
                    <>
                    <View className="items-center w-full mt-3">
                        <Text className="text-center">
                            No Records
                        </Text>
                    </View>
                    </>

                    }
                </ScrollView>
                </View>
                }
                
                
            </View>
        </SafeAreaView>
        </>
    );
};

export default Issues;

const CardDisplayIssue=({message,statusget,subject})=>{
    return(
        <>
        <View className="w-full h-auto rounded-xl bg-slate-200 px-3 py-3 mt-3">
            <View className="mt-3 w-full items-end">
                <View className="bg-red-400 rounded-2xl py-2  w-20 items-center">
                <Text>
                    {statusget}
                </Text>
                </View>
            </View>
            <View className="w-full px-3 rounded-2xl h-10 justify-center bg-red-200 items-center mt-3">
            <Text>{subject}</Text> 
            </View>
            <View className="mt-3 w-full items-center">
                <Text className="text-lg text-center">
                    {message}
                </Text>

            </View>
             
        </View>
        </>

    )
}
