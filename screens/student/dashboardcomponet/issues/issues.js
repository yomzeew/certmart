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
import { FontAwesome5 } from "@expo/vector-icons";

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
            console.log(getdata,'fetched issue data')

            // Handle the response structure
            if (getdata && getdata.status && getdata.message) {
                setData(getdata.message); // Use the message array as data
            } else {
                setData([]);
                console.log('Invalid response structure:', getdata);
            }

        } catch (error) {
            console.error("Failed to fetch issues", error);
            setData([]);
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

                    <TouchableOpacity onPress={()=>handleSelection('View')} className={`${active==='View'?'bg-red-500 ':'bg-transparent border-b border-red-300'} justify-center items-center w-24 h-12 rounded-xl`}>
                        <Text className={`${active==='View'?'text-white':'text-black'}`}>View Issues</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>handleSelection('Create')} className={`${active==='Create'?'bg-red-500 ':'bg-transparent border-b border-red-300' } justify-center items-center w-24 h-12 rounded-xl`}>
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
                    {preloaderdata ? (
                        <View className="items-center justify-center py-10">
                            <ActivityIndicator size="large" color={colorred} />
                            <Text className="text-gray-600 mt-2">Loading issues...</Text>
                        </View>
                    ) : data.length > 0 ? (
                        data.map((item, index) => (
                            <IssueCard
                                key={item.issueid || index}
                                issue={item}
                            />
                        ))
                    ) : (
                        <View className="items-center justify-center py-16">
                            <FontAwesome5 name="inbox" size={48} color="#ccc" />
                            <Text className="text-gray-500 text-lg mt-4 text-center">No Issues Found</Text>
                            <Text className="text-gray-400 text-sm mt-1 text-center">
                                You haven't created any issues yet
                            </Text>
                        </View>
                    )}
                    </ScrollView>
                </View>
                }
                
                
            </View>
        </SafeAreaView>
        </>
    );
};

export default Issues;

const IssueCard = ({ issue }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Format date
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return dateString;
        }
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'opened':
            case 'open':
                return '#10b981'; // green
            case 'closed':
                return '#6b7280'; // gray
            case 'in_progress':
            case 'pending':
                return '#f59e0b'; // yellow
            default:
                return '#6b7280'; // gray
        }
    };

    // Truncate text
    const truncateText = (text, maxLength = 150) => {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <View className="w-full bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden">
            {/* Header */}
            <View className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-800 mb-1">
                            #{issue.issueid} - {issue.subject}
                        </Text>
                        <Text className="text-sm text-gray-600">
                            Created: {formatDate(issue.openeddate)}
                        </Text>
                    </View>
                    <View
                        className="px-3 py-1 rounded-full"
                        style={{ backgroundColor: getStatusColor(issue.status) + '20' }}
                    >
                        <Text
                            className="text-xs font-semibold"
                            style={{ color: getStatusColor(issue.status) }}
                        >
                            {issue.status?.toUpperCase()}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Issue Message */}
            <View className="px-4 py-3">
                <Text className="text-gray-700 leading-5">
                    {isExpanded ? issue.message : truncateText(issue.message)}
                </Text>

                {issue.message && issue.message.length > 150 && (
                    <TouchableOpacity
                        onPress={() => setIsExpanded(!isExpanded)}
                        className="mt-2"
                    >
                        <Text className="text-blue-500 font-medium text-sm">
                            {isExpanded ? 'Show Less' : 'Read More'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Responses Section */}
            {issue.response && issue.response.length > 0 && (
                <View className="px-4 pb-3">
                    <View className="flex-row items-center mb-3">
                        <FontAwesome5 name="reply" size={14} color="#6b7280" />
                        <Text className="text-sm font-semibold text-gray-700 ml-2">
                            Responses ({issue.response.length})
                        </Text>
                    </View>

                    {issue.response.map((response, index) => (
                        <View key={response.responseid || index} className="bg-red-100 rounded-lg p-3 mb-3">
                            <View className="flex-row justify-between items-start mb-2">
                                <View className="flex-1">
                                    <Text className="text-sm font-semibold text-red-800">
                                        Admin
                                    </Text>
                                    <Text className="text-xs text-gray-500">
                                        {formatDate(response.responsedate)}
                                    </Text>
                                </View>
                                {response.read === 0 && (
                                    <View className="w-2 h-2 bg-blue-500 rounded-full" />
                                )}
                            </View>
                            <Text className="text-sm text-gray-700 leading-5">
                                {response.response}
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Footer */}
            <View className="bg-gray-50 px-4 py-2 flex-row justify-between items-center">
                <View className="flex-row items-center">
                    <FontAwesome5 name="user" size={12} color="#6b7280" />
                    <Text className="text-xs text-gray-600 ml-1">
                        {issue.issuer}
                    </Text>
                </View>
                {issue.read && (
                    <View className="flex-row items-center">
                        <FontAwesome5 name="eye" size={12} color="#10b981" />
                        <Text className="text-xs text-green-600 ml-1">Read</Text>
                    </View>
                )}
            </View>
        </View>
    );
};
