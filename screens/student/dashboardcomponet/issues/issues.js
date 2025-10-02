import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator,TouchableWithoutFeedback,Keyboard,KeyboardAvoidingView,Platform,RefreshControl,FlatList,Modal } from "react-native";
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
import showToast from "../../../../utils/showToast";
import CustomTextInput from "../../../../components/CustomTextInput";

const Issues = () => {
    const [active,setactive]=useState('View')
    const email = useSelector((state) => state.activePage.email);
    const [data,setData]=useState([])
    const [subject,setSubject]=useState("")
    const [message,setMessage]=useState("")
    const [errorMsg,seterrorMsg]=useState("")
    const [refreshing, setRefreshing] = useState(false);
    const [showsuccess,setshowsuccess]=useState(false)
    const [preloader, setpreloader] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [showIssueDetail, setShowIssueDetail] = useState(false);
    const [replyMessage, setReplyMessage] = useState('');

    const fetchIssues=async()=>{
        try {
            setpreloader(true)
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
            setpreloader(false)
        }
    }
    useEffect(()=>{
        fetchIssues();
    },[])

    const fetchSingleIssue = async (issueId) => {
        try {
          const res = await getIssuesByemail(email); 
          if (res?.status && res?.message) {
            const found = res.message.find((item) => item.issueid === issueId);
            if (found) setSelectedIssue(found); // update modal data
          }
        } catch (error) {
          console.error("Failed to fetch single issue", error);
        }
      };
      
    const onRefresh = async () => {
        console.log('ok')
        setRefreshing(true);
        // Refresh issues data
        await fetchIssues();
        // Clear form fields
        setSubject('');
        setMessage('');
        seterrorMsg('');
        setRefreshing(false);
    };

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
                showToast('success','Success','Issue Created Successfully')
                setshowsuccess(true)
                setMessage("")
                setSubject("")
            }


        } catch (error) {
            console.error("Failed to fetch issues", error);
            showToast('error','Error','Failed to Create Issue')
        } finally {
            setpreloader(false);
        }
    };

    const handleSelection=(value)=>{
        setactive(value)
        fetchIssues()
        
    }

    const handleIssuePress = (issue) => {
        setSelectedIssue(issue);
        setShowIssueDetail(true);
    };

    const handleCloseIssueDetail = () => {
        setShowIssueDetail(false);
        setSelectedIssue(null);
        setReplyMessage('');
    };

    const handleSendReply = async () => {
        if (!replyMessage.trim() || !selectedIssue) return;
    
        try {
            setpreloader(true);

            const replyData = {
                subject: subject || null,
                message: replyMessage,
                issuer: email,
                email: email,
                issueid: selectedIssue.issueid || null,
                status: selectedIssue.status
              };
              console.log(replyData)
    
         
          // If you have a replyIssue API, call that instead
          const serverResponse = await createIssue(replyData);
    
          console.log("Reply saved:", serverResponse);
    
          await fetchIssues();
          await fetchSingleIssue(selectedIssue.issueid);
    
          setReplyMessage("");
          setpreloader(false);
        } catch (error) {
          console.error("Error sending reply:", error);
          setpreloader(false);
        }
      };

    return (
        <>
        {preloader &&
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
            <StatusBar style="dark" />
            <Header />
            
            <View style={{ padding: 16 }}>
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
           
                           <CustomTextInput
                               placeholder="Enter your Subject" 
                               multiline={true} 
                               mode="outlined" 
                               style={{ marginTop: 12 }} 
                               value={subject}
                               onChangeText={(text)=>setSubject(text)}
                           />
                           
                           <CustomTextInput
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
                     <FlatList
  data={preloader ? [] : data}
  keyExtractor={(item, index) =>
    // prefer unique id, fallback to index
    (item?.issueid ?? item?.id ?? index).toString()
  }
  style={{ flex: 1 }}                     // ensure the list can take available height
  nestedScrollEnabled={true}              // helpful on Android if nested
  keyboardShouldPersistTaps="handled"
  keyboardDismissMode="on-drag"
  showsVerticalScrollIndicator={false}
  initialNumToRender={8}
  windowSize={11}
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={[colorred]}
      tintColor={colorred}
    />
  }
  ListEmptyComponent={
    preloader ? (
      <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 30 }}>
        <ActivityIndicator size="large" color={colorred} />
        <Text style={{ color: "#6B7280", marginTop: 8 }}>Loading issues...</Text>
      </View>
    ) : (
      <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 40 }}>
        <FontAwesome5 name="inbox" size={48} color="#ccc" />
        <Text style={{ color: "#6B7280", fontSize: 16, marginTop: 12 }}>No Issues Found</Text>
        <Text style={{ color: "#9CA3AF", fontSize: 12, marginTop: 6 }}>You haven't created any issues yet</Text>
      </View>
    )
  }
  renderItem={({ item }) => <IssueCard issue={item} onPress={() => handleIssuePress(item)} />}
  contentContainerStyle={
    // when empty, center the empty component; otherwise let content scroll
    (!data || data.length === 0)
      ? { flex: 1, justifyContent: "center" }
      : { paddingBottom: 20 }
  }
/>
                    
                    
                </View>
                }
                
                
            </View>
            {/* Issue Detail Modal */}
            {selectedIssue && (
                <IssueDetailModal
                    issue={selectedIssue}
                    visible={showIssueDetail}
                    onClose={handleCloseIssueDetail}
                    replyMessage={replyMessage}
                    setReplyMessage={setReplyMessage}
                    onSendReply={handleSendReply}
                    isLoading={preloader}
                    email={email}
                />
            )}
        </SafeAreaView>
        </>
    );
};

export default Issues;


const IssueDetailModal = ({ visible, issue, onClose, replyMessage, setReplyMessage, onSendReply, isLoading, email }) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1, justifyContent: "flex-end" }}
        >
          <View className="bg-white rounded-t-3xl w-full max-h-[95%] min-h-[70%]">
            {/* Header */}
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
              <Text className="text-lg font-bold text-gray-800">
                #{issue.issueid} - {issue.subject}
              </Text>
              <TouchableOpacity onPress={onClose} className="p-2">
                <FontAwesome5 name="times" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Messages */}
            <ScrollView
              className="flex-1 px-4 py-2"
              showsVerticalScrollIndicator={false}
            >
              {/* Original issue */}
              <View className="mb-4 self-end max-w-[80%]">
                <View className="bg-blue-500 rounded-lg p-3">
                  <Text className="text-white text-sm">{issue.message}</Text>
                  <Text className="text-xs text-blue-200 mt-1 text-right">
                    {formatDate(issue.openeddate)}
                  </Text>
                </View>
              </View>

              {/* Responses */}
              {issue.response && issue.response.length > 0 ? (
                issue.response.map((res, index) => (
                  <View key={index} className="mb-4 max-w-[100%]">
                    {res.responder === email ? (
                      <View className="bg-blue-100 rounded-lg p-3 items-end">
                        <Text className="text-gray-800 text-sm">
                          {res.response}
                        </Text>
                        <Text className="text-xs text-gray-500 mt-1">
                          {formatDate(res.responsedate)}
                        </Text>
                      </View>
                    ) : (
                      <View className="bg-red-100 rounded-lg p-3 items-start">
                        <Text className="text-xs text-gray-500 mt-1">Admin</Text>
                        <Text className="text-gray-800 text-sm">
                          {res.response}
                        </Text>
                        <Text className="text-xs text-gray-500 mt-1">
                          {formatDate(res.responsedate)}
                        </Text>
                      </View>
                    )}
                  </View>
                ))
              ) : (
                <View className="items-center justify-center py-8">
                  <FontAwesome5 name="comments" size={48} color="#d1d5db" />
                  <Text className="text-gray-500 text-center mt-2">
                    No responses yet
                  </Text>
                  <Text className="text-gray-400 text-sm text-center">
                    Admin will respond soon
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* Reply input */}
            <View className="border-t border-gray-200 p-4 flex-row items-center">
              <TextInput
                placeholder="Type your reply..."
                value={replyMessage}
                onChangeText={setReplyMessage}
                multiline
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  borderRadius: 20,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  marginRight: 8,
                  maxHeight: 60,
                }}
                textAlignVertical="top"
              />
              <TouchableOpacity
                onPress={onSendReply}
                disabled={!replyMessage.trim() || isLoading}
                className={`p-3 rounded-full ${
                  replyMessage.trim() && !isLoading ? "bg-red-500" : "bg-gray-300"
                }`}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <FontAwesome5 name="paper-plane" size={16} color="white" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};





const IssueCard = ({ issue, onPress }) => {
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

    // Get latest message (either the original message or latest response)
    const getLatestMessage = () => {
        if (issue.response && issue.response.length > 0) {
            // Get the latest response
            const latestResponse = issue.response[issue.response.length - 1];
            return {
                text: latestResponse.response,
                date: latestResponse.responsedate,
                type: 'response'
            };
        } else {
            // Return the original issue message
            return {
                text: issue.message,
                date: issue.openeddate,
                type: 'issue'
            };
        }
    };

    // Truncate text
    const truncateText = (text, maxLength = 100) => {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const latestMessage = getLatestMessage();

    return (
        <TouchableOpacity
            onPress={() => onPress && onPress(issue)}
            className="w-full bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden"
        >
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

            {/* Latest Message Preview */}
            <View className="px-4 py-3">
                <View className="flex-row items-start">
                    <View className="flex-1">
                        <View className="flex-row items-center mb-1">
                            <FontAwesome5
                                name={latestMessage.type === 'response' ? 'reply' : 'user'}
                                size={12}
                                color={latestMessage.type === 'response' ? '#ef4444' : '#6b7280'}
                            />
                            <Text className="text-xs text-gray-500 ml-1">
                                {latestMessage.type === 'response' ? 'Admin' : 'You'}
                            </Text>
                            <Text className="text-xs text-gray-400 ml-2">
                                {formatDate(latestMessage.date)}
                            </Text>
                        </View>
                        <Text className="text-gray-700 leading-5">
                            {truncateText(latestMessage.text, 120)}
                        </Text>
                    </View>
                    <View className="ml-2">
                        <FontAwesome5 name="chevron-right" size={12} color="#9ca3af" />
                    </View>
                </View>

                {/* Response count indicator */}
                {issue.response && issue.response.length > 0 && (
                    <View className="flex-row items-center mt-2">
                        <FontAwesome5 name="comments" size={12} color="#6b7280" />
                        <Text className="text-xs text-gray-500 ml-1">
                            {issue.response.length} response{issue.response.length !== 1 ? 's' : ''}
                        </Text>
                    </View>
                )}
            </View>

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
        </TouchableOpacity>
    );
};
