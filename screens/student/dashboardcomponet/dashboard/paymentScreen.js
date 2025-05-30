import { View, SafeAreaView, Text, ScrollView, TouchableOpacity, Platform,Button } from "react-native";
import { Avatar, Divider,RadioButton } from "react-native-paper";
import { useState,useCallback,useEffect } from 'react';
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import PaystackWebView from 'react-native-paystack-webview';
import { colorred } from "../../../../constant/color";
import PaymentScreen from "../../../paystacks/paystackwebview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { conversion, studentdetails } from "../../../../settings/endpoint";

 const PaymentScreenModal=({selected,setshowpayment,setShowLoader,setshowsuccess})=>{
    const [Email, setEmail] = useState(""); // Email should be a string
    const [currency, setCurrency] = useState("NGN");
    const [amount,setamount]=useState(Number(selected?.taval_cost || 0))
    const [studentid,setstudentid]=useState('')
    const [showcurrency,setshowcurrency]=useState(false)
    const currencydata= [{country:'Nigeria',code:'NGN'},{country:'United State',code:'USD'},{country:'Ghana',code:'GHS'},{country:'Kenya',code:'KES'},{country:'South Africa',code:'ZAR'}]
    

    const fetchdata = async () => {
        console.log("Selected course:", selected);
        if (!selected) {
            console.error("Error: selected is null or undefined");
            return;
        }
     
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(studentdetails, {
                headers: { "Authorization": `Bearer ${token}` },
            });
            setEmail(response.data.email || ""); // Handle missing email
            setstudentid(response.data.studentid)
        } catch (error) {
            console.error("Error fetching student details:", error);
        } finally {
           
        }
    };

    useEffect(() => {
        fetchdata();
    },[]);
    const handleCurrency = async (object) => {
        setShowLoader(true);
        const currencyCurrency = object.code;
    
        try {
            const token = await AsyncStorage.getItem("token");
            const data = { amount_ngn: selected.taval_cost, convert_to: currencyCurrency };
    
            // Set timeout for the network request
            const response = await Promise.race([
                axios.post(conversion, data, {
                    headers: { "Authorization": `Bearer ${token}` },
                    timeout: 10000, // Timeout in milliseconds (10 seconds)
                }),
                new Promise((_, reject) => setTimeout(() => reject(new Error("Network Timeout")), 10000)),
            ]);
    
            setamount(response.data.amount_to);
            setCurrency(currencyCurrency);
            setshowcurrency(false);
        } catch (error) {
            if (error.message === "Network Timeout") {
                console.error("Request timed out.");
            } else {
                console.error("Error fetching student details:", error);
            }
        } finally {
            setShowLoader(false);
        }
    };
    
       

    return(
                <>
                <View  style={{ zIndex: 40, elevation: 40 }} className="bg-red-300 opacity-70 h-full w-full absolute z-40"/>
                <View  style={{ zIndex: 50, elevation: 50 }} className="absolute w-full justify-center h-full items-center ">
                <View className=" w-5/6  justify-center bg-white rounded-2xl h-auto border border-red-300 p-3">
                 <TouchableOpacity  style={{ zIndex: 50, elevation: 50 }} onPress={()=>setshowpayment(false)} className="absolute right-2 top-0 "><FontAwesome5 color={colorred} size={24} name="times" /></TouchableOpacity>
                 <View className="absolute w-full">

                 </View>
                
                <View className="items-center mt-10">
                    <Text>
                        You are Paying for {selected.duration} weeks Course on
                    </Text>
                    <Text className="text-lg">Mobile Application Development</Text>
                </View>
                <View className="items-center">
                 
                {selected.dp ? <Avatar.Image source={{ uri: `https://certmart.org/dps/${selected.dp}.jpg?timestamp=${new Date().getTime()}` }} /> : <Avatar.Image source={require('../../../images/avatermale.png')} />}
                <View className="ml-2 flex-row">
                    <Text className="mr-1">{selected.avg_rating}</Text>
                    <FontAwesome name="star" size={14} color="orange" />
                </View>
                <View>{selected.classtype}</View>
            </View>
            <View className="mt-3">
            <View className="mt-3 items-center">
                                    <Text style={{ fontSize: 16 }}>Change your Currency</Text>
                                    <TouchableOpacity onPress={()=>(setshowcurrency(!showcurrency))} className="bg-red-200 h-10 rounded-2xl w-full items-center justify-center">
                                        <Text>{currency?currency:'Choose your Currency'}</Text>
                                    </TouchableOpacity>
                                    {showcurrency &&<View className="bg-red-200  h-40 rounded-2xl w-full items-center justify-center py-3 px-3 mt-3">
                                        <ScrollView showsVerticalScrollIndicator={false} className="w-full">
                                           {currencydata.length>0 && currencydata.map((item,index)=>
                                           <TouchableOpacity  onPress={()=>handleCurrency(item)} className="bg-red-300 mt-2 w-full items-center justify-center rounded-full h-8">
                                            <Text className="text-sm">{item.code}-<Text className="text-xs">{item.country}</Text></Text>
                                           </TouchableOpacity>
                                           )}
                                        </ScrollView>

                                    </View>}
                                    <Text className="text-lg">Amount Due for Payment:</Text>
                                    <Text  className="text-lg">{currency} {Number(amount.toFixed(2))}</Text>
                                </View>
               
            </View>
            <PaymentScreen 
            email={Email}
            currency={currency}
            amount={amount+'.00'}
            classtype={selected.classType}
            eventcode={selected.eventcode}
            studentid={studentid}
            close={setshowpayment}
            setshowsuccess={setshowsuccess}
             />
           
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
     
    </View>
   

            </View>
                    
                </View>
                
                </>
               
    
    )
}
export default PaymentScreenModal