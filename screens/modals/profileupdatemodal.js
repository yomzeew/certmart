import { Platform, Text, TouchableOpacity, View } from "react-native"
import { Button, RadioButton, TextInput } from "react-native-paper"
import { colorred } from "../../constant/color"
import { useEffect, useState } from "react"
import { FontAwesome5 } from "@expo/vector-icons"
import axios from "axios"
import { getotp, updatedetails } from "../../settings/endpoint"
import Preloader from "../preloadermodal/preloaderwhite"
import { useNavigation } from "@react-navigation/native"

const ProfileUpdateModal = ({ close, data }) => {
    const currentForm = data[0].title;
    const [errorMsg, seterrorMsg] = useState('')
    const [showpreloader, setshowpreloader] = useState(false)
    const navigation = useNavigation()
    const handleclose = () => {
        close(false)
    }
    const handlesubmit = async (Surname, Firstname, Middlename, Gender, DateOfBirth) => {
        setshowpreloader(false)
        console.log(Surname)
        // if (!Email) {
        //     seterrorMsg('Enter your Email')
        //     setshowloader(false)
        //     return

        // }
        // if (!Password) {
        //     seterrorMsg('Enter your Password')
        //     setshowloader(false)
        // }

        // try {
        //     const data = {
        //         email: Email,
        //         password: Password
        //     }
        //     const response = await axios.post(updatedetails, data, {
        //         headers: {
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json'
        //         }
        //     })
        //     console.log('check')
        //     if (response.status === 200) {
        //         const token = response.data.token
        //         await AsyncStorage.setItem('token', token)
        //         handleclose
        //     }


        // } catch (error) {
        //     if (error.response) {
        //         // Server responded with a status other than 2xx
        //         console.error('Error response:', error.response.data);
        //         console.log(error.response.data.error)
        //         seterrorMsg(error.response.data.error)
        //         console.error('Error status:', error.response.status);
        //         console.error('Error headers:', error.response.headers);
        //     } else if (error.request) {
        //         // Request was made but no response received
        //         console.error('Error request:', error.request);
        //     } else {
        //         // Something else happened while setting up the request
        //         console.error('Error message:', error.message);

        //     }
        // }
        // finally {
        //     setshowpreloader(false)
        // }

    }
    return (
        <>
            <View className="h-full w-full justify-center flex items-center">
                <View
                    onStartShouldSetResponder={() => true}
                    onResponderRelease={handleclose}
                    className="h-full absolute bottom-0 w-full px-2 py-3 opacity-80 bg-red-100  border border-slate-400 rounded-xl shadow-lg"></View>
                <View style={{ elevation: 6 }} className="w-4/5 relative h-2/3 bg-white shadow-md shadow-slate-400 rounded-2xl flex justify-center items-center">
                    {showpreloader && <View className="absolute z-50 h-full w-full flex justify-center items-center rounded-2xl"><Preloader /></View>}
                    <View className="absolute z-40 right-2 top-2">
                        <TouchableOpacity onPress={handleclose}><FontAwesome5 name="times" size={24} color={colorred} /></TouchableOpacity>
                    </View>
                    <View className="w-full px-5">
                        <View className="items-center">
                            <Text className="text-xl font-bold uppercase">Update {currentForm}</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-sm text-red-500">{errorMsg}</Text>
                        </View>

                        {currentForm === "Biodata" && (
                            <BiodataUpdateForm data={data}
                                handleCallBackValue={(Surname, Firstname, Middlename, Gender, DateOfBirth) => handlesubmit(Surname, Firstname, Middlename, Gender, DateOfBirth)}
                            />
                        )}
                        {currentForm === "Address" && (
                            <AddressUpdateForm data={data} />
                        )}
                        {currentForm === "Contact" && (
                            <BiodataUpdateForm data={data} />
                        )}
                        {currentForm === "Next of Kin's Details" && (
                            <BiodataUpdateForm data={data} />
                        )}

                        <Button
                            icon="login"
                            mode="contained"
                            onPress={handlesubmit}
                            theme={{ colors: { primary: colorred } }}
                            className="h-12 mt-3 w-full flex justify-center"
                            textColor="#ffffff"
                        >

                            <Text style={{ fontSize: 20 }}>Submit</Text>
                        </Button>
                    </View>

                </View>

            </View>
        </>

    )
}
export default ProfileUpdateModal

const BiodataUpdateForm = ({ data, handleCallBackValue }) => {
    const [Surname, setSurname] = useState(data[0].data.Surname);
    const [Firstname, setFirstname] = useState(data[0].data.Firstname);
    const [Middlename, setMiddlename] = useState(data[0].data.Middlename);
    const [Gender, setGender] = useState(data[0].data.Gender);
    const [DateOfBirth, setDateOfBirth] = useState(data[0].data.DateOfBirth);
    const passCallBackValue = () => {
        ()=>handleCallBackValue(Surname, Firstname, Middlename, Gender, DateOfBirth)
    }
//    useEffect(()=>{
//     passCallBackValue()
//    },[Surname, Firstname, Middlename, Gender, DateOfBirth])

    return (
        <>
            <TextInput
                label="Firstname"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={text => setFirstname(text)}
                value={Firstname}
                className="w-full mt-3 bg-slate-50"
                disabled
            />
            <TextInput
                label="Surname"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={text => setSurname(text)}
                value={Surname}
                className="w-full mt-3 bg-slate-50"
                disabled
            />
            <TextInput
                label="Middlename"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={text => setMiddlename(text)}
                value={Middlename}
                className="w-full mt-3 bg-slate-50"
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
                label="DateOfBirth"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={text => setDateOfBirth(text)}
                value={DateOfBirth}
                className="w-full mt-3 bg-slate-50"
            />
        </>
    )
}

const AddressUpdateForm = ({ data }) => {
    const [Country, setCountry] = useState(data[0].data.Country);
    const [State, setState] = useState(data[0].data.State);
    const [City, setCity] = useState(data[0].data.City);
    const [Address, setAddress] = useState(data[0].data.Address);
    return (
        <>
            <TextInput
                label="Country"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={text => setCountry(text)}
                value={Country}
                className="w-full mt-3 bg-slate-50"
                disabled
            />
            <TextInput
                label="Surname"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={text => setSurname(text)}
                value={Surname}
                className="w-full mt-3 bg-slate-50"
                disabled
            />
            <TextInput
                label="Middlename"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={text => setMiddlename(text)}
                value={Middlename}
                className="w-full mt-3 bg-slate-50"
            />
            <TextInput
                label="DateOfBirth"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={text => setDateOfBirth(text)}
                value={DateOfBirth}
                className="w-full mt-3 bg-slate-50"
            />
        </>
    )
}