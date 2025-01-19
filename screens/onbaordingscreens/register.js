import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, } from "react-native";
import { styles } from "../../settings/layoutsetting";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { certblue, colorred, colorwhite } from "../../constant/color";
import { TextInput, Button, RadioButton, Checkbox } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import Preloader from "../preloadermodal/preloaderwhite";
import { registerstudent } from '../../settings/endpoint';
import axios from "axios"
import SuccessModal from '../modals/successfulmodal';

const RegisterPage = () => {
    const [Email, setEmail] = useState('');
    const [Surname, setSurname] = useState('');
    const [Middlename, setMiddlename] = useState('');
    const [Firstname, setFirstname] = useState('');
    const [Gender, setGender] = useState('');
    const [phonenumber,setphonenumber]=useState('')
    const [Agreement, setAgreement] = useState(false);
    const [errormsg,seterrormsg]=useState('')
    const [showloader, setshowloader] = useState(false);
    const [showsuccessmodal,setshowsuccessmodal]=useState(false)
    const navigation = useNavigation();
    const route = useRoute();
    const { platform } = route.params || {};

    const handleprevpage = () => {
        navigation.goBack();
    };
    const handlesubmit=async()=>{
    setshowloader(true)
    if(!Surname){
        seterrormsg('Enter Surname')
        return
    }
    if(!Middlename){
        seterrormsg('Enter Middlename')
        return
    }
    if(!Firstname){
        seterrormsg('Enter Firstname')
        return
    }
    if(!Gender){
        seterrormsg('Select your gender')
        return
    }
    if(!Email){
        seterrormsg('Enter your Email')
        return
    }
    const data = {
        surname: Surname,
        firstname: Firstname,
        middlename: Middlename,
        email: Email,
        gender: Gender.toLowerCase()
    };
    console.log(data);
        try {
        const response = await axios.post(registerstudent, data, {
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            }
        });
        if (response.status === 200) {
            console.log('Response Status:', response.status);
            console.log('Response Data:', response.data);
            setshowsuccessmodal(true)
        } else {
            console.log('Unexpected Response Status:', response.status);
        }
    } catch (error) {
        if (error.response) {
            // Server responded with a status other than 2xx
            console.error('Error response:', error.response.data);
            seterrormsg(error.response.data.message)
            console.error('Error status:', error.response.status);
            console.error('Error headers:', error.response.headers);
        } else if (error.request) {
            // Request was made but no response received
            console.error('Error request:', error.request);
        } else {
            // Something else happened while setting up the request
            console.error('Error message:', error.message);
        }
    }
    finally{
        setshowloader(false)

    }
    
}
const handleaction=()=>{
    navigation.navigate('login')
}
   

    return (
        <>
            {showloader && <View className="absolute z-50 w-full h-full"><Preloader /></View>}
            {showsuccessmodal &&<View className="absolute z-50 w-full h-full flex justify-center items-center">
                <SuccessModal 
                message={'Registration Successfull check your Email for Password'}
                action={()=>handleaction()}
                />
            </View>
                }

            <SafeAreaView className="flex-1">
               
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <StatusBar style="light" />
                    <View style={{ backgroundColor: colorred, marginTop: Platform.OS === 'ios' ? -50 : 0 }} className="items-center w-full px-3 h-1/6 flex-row flex justify-between">
                        <TouchableOpacity onPress={handleprevpage}>
                            <FontAwesome name="arrow-circle-left" size={40} color={colorwhite} />
                        </TouchableOpacity>
                        <Image className="w-20 h-12" resizeMode="contain" source={require('../images/logowhite.png')} />
                    </View>
                    <View className="flex-1">
                        <View className="items-center mt-5">
                            <Text style={{ fontSize: 30 }} className="font-extralight">
                                <FontAwesome name="sign-in" size={30} color={colorred} /> Register as {platform}
                            </Text>
                        </View>
                        <View className="items-center mt-5 flex-1">
                            <View><Text className="text-red-500 text-center">{errormsg}</Text></View>
                            <ScrollView className="w-full">
                                <View className="items-center">
                                    <TextInput
                                        label="Surname"
                                        mode="outlined"
                                        theme={{ colors: { primary: colorred } }}
                                        onChangeText={text => setSurname(text)}
                                        value={Surname}
                                        className="w-3/4 mt-3 bg-slate-50"
                                        textColor="#000000"
                                    />
                                    <TextInput
                                        label="Firstname"
                                        mode="outlined"
                                        theme={{ colors: { primary: colorred } }}
                                        onChangeText={text => setFirstname(text)}
                                        value={Firstname}
                                        className="w-3/4 mt-3 bg-slate-50"
                                        textColor="#000000"
                                    />
                                    <TextInput
                                        label="Middlename"
                                        mode="outlined"
                                        theme={{ colors: { primary: colorred } }}
                                        onChangeText={text => setMiddlename(text)}
                                        value={Middlename}
                                        className="w-3/4 mt-3 bg-slate-50"
                                        textColor="#000000"
                                    />
                                    <View className="w-3/4 mt-3">
                                        <Text style={{ fontSize: 16 }}>Choose your Gender</Text>
                                        <View className="flex flex-row items-center mt-2">
                                            <RadioButton
                                                value="Male"
                                                status={Gender === 'Male' ? 'checked' : 'unchecked'}
                                                onPress={() => setGender('Male')}
                                                color={colorred}
                                            />
                                            {Platform.OS === 'ios' && <TouchableOpacity onPress={() => setGender('Male')} style={{ marginRight: 10 }} className="bg-red-300 w-12 items-center h-5 justify-center rounded-xl"><Text>Male</Text></TouchableOpacity>}
                                            {Platform.OS === 'android' && <Text style={{ marginRight: 10 }}>Male</Text>}
                                            <RadioButton
                                                value="Female"
                                                status={Gender === 'Female' ? 'checked' : 'unchecked'}
                                                onPress={() => setGender('Female')}
                                                color={colorred}
                                            />
                                            {Platform.OS === 'ios' && <TouchableOpacity onPress={() => setGender('Female')} style={{ marginRight: 10 }} className="bg-red-300 w-12 items-center h-5 justify-center rounded-xl"><Text>Female</Text></TouchableOpacity>}
                                            {Platform.OS === 'android' && <Text style={{ marginRight: 10 }}>Female</Text>}
                                        </View>
                                    </View>
                                    <TextInput
                                        label="Email"
                                        mode="outlined"
                                        theme={{ colors: { primary: colorred } }}
                                        onChangeText={text => setEmail(text)}
                                        value={Email}
                                        className="w-3/4 mt-3 bg-slate-50"
                                        textColor="#000000"
                                    />
                                     <TextInput
                                        label="Phone Number"
                                        mode="outlined"
                                        theme={{ colors: { primary: colorred } }}
                                        onChangeText={text => setphonenumber(text)}
                                        value={phonenumber}
                                        className="w-3/4 mt-3 bg-slate-50"
                                        textColor="#000000"
                                    />
                                    <View className="w-3/4 flex flex-row  items-center ">
                                        <Checkbox
                                            status={Agreement ? 'checked' : 'unchecked'}
                                            onPress={() => {
                                                setAgreement(!Agreement);
                                            }}
                                            theme={{ colors: { primary: colorred } }}
                                        />
                                        <TouchableOpacity onPress={() => {
                                                setAgreement(!Agreement);
                                            }}>
                                        <Text style={{color:certblue}}>
                                          Agree to terms and conditions
                                        </Text>
                                        </TouchableOpacity>


                                    </View>

                                    <Button
                                        icon="plus"
                                        mode="contained"
                                        onPress={handlesubmit}
                                        theme={{ colors: { primary: colorred } }}
                                        className="h-12 mt-3 w-3/4 flex justify-center"
                                        textColor="#ffffff"
                                    >
                                        <Text style={{ fontSize: 20 }}>Register</Text>
                                    </Button>
                                </View>
                                <View className="items-center">
                                    <View className="w-3/4 flex justify-between  flex-row mt-3">
                                        <TouchableOpacity><Text style={{ color: certblue }}>Switch Your Platform</Text></TouchableOpacity>
                                        <TouchableOpacity><Text style={{ color: colorred }}>I have an account Login</Text></TouchableOpacity>
                                    </View>

                                </View>


                            </ScrollView>

                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>

        </>
    );
}

export default RegisterPage;
