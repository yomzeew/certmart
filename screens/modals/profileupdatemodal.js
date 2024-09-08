import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { Button, RadioButton, TextInput } from "react-native-paper"
import { colorred } from "../../constant/color"
import { useEffect, useState } from "react"
import { FontAwesome5 } from "@expo/vector-icons"
import axios from "axios"
import { getotp, updatedetails } from "../../settings/endpoint"
import Preloader from "../preloadermodal/preloaderwhite"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import DisplayModal from "./datadisplay"
import { countrylist, fecthcountrysate } from "../jsondata/country-states"
import DateModal from "./datemodal"

const ProfileUpdateModal = ({ close, data, id }) => {
    const currentForm = data[0].title;
    const [errorMsg, seterrorMsg] = useState('');
    const [showpreloader, setshowpreloader] = useState(false);
    const [formData, setFormData] = useState({});
    const [showmodalcourse,setshowmodalcourse]=useState(false)
    const [selectdata, setselectdata] = useState([])
    const [State, setState] = useState(data[0].data.state);
    const [Country, setCountry] = useState(data[0].data.country);
    const [selecttype, setselecttpe] = useState('')
  
    const handleselectfunc=(value)=>{
        console.log(value)
        setselecttpe(value)

    }



    const translateY = useSharedValue(300);
    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));
    const handlegetdata = async (type) => {
        if (type === 'country') {
            const countrylistone = countrylist;
            setselectdata(countrylistone);
        } else if (type === 'state') {
            const datastate = await fecthcountrysate(Country);
            setselectdata(datastate);
        }
    };

    const handleshowmodallist = (value) => {
        translateY.value = withSpring(0);
        setshowmodalcourse(value);
    };
    const handlegetvalue = (value) => {
        if (selecttype === 'country') {
            setCountry(value)
            setState('');
        }
        else if (selecttype === 'state') {
            setState(value)

        }

        setshowmodalcourse(false)
        translateY.value = withSpring(300);

    }
    const handleclosemodal=()=>{
        setshowmodalcourse(false)
    }

    const requiredData = {
        surname: data[0].data.surname,
        firstname: data[0].data.firstname,
        email: data[0].data.email,
        gender: data[0].data.gender.toLowerCase()
    };

    const navigation = useNavigation();

    const handleclose = () => {
        close(false);
    };
  

    const handlesubmit = async () => {
        const updatedFormData = {
            ...formData,
            ...requiredData
        };
        setFormData(updatedFormData);
        console.log(updatedFormData)

        //! Perform validation, set errors, or submit data here
        // setshowpreloader(true);
        const token = await AsyncStorage.getItem('token')
        try {
            const data = updatedFormData
            const response = await axios.put(`${updatedetails}/${id}`, data, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log('check')
            if (response.status === 200) {
                handleclose()
            }
        } catch (error) {
            if (error.response) {
                // Server responded with a status other than 2xx
                console.error('Error response:', error.response.data);
                console.log(error.response.data.error)
                seterrorMsg(error.response.data.error)
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);
            } else if (error.request) {
                // Request was made but no response received
                console.error('Error request:', error.request);
            } else {
                // Something else happened while setting up the request
                console.error('Error message:', error.message);

            }
        } finally {
            // setshowpreloader(false);
        }
    };

    const handleCallBackValue = (updatedValues) => {
        setFormData(updatedValues)
    };

    return (
        <>
        {showmodalcourse && <View className="bottom-0 absolute z-50 ">
                <Animated.View style={[animatedStyles]}>
                    <DisplayModal
                        data={selectdata}
                        close={(value) => handleclosemodal(value)}
                        getvaluefunction={(value) => handlegetvalue(value)}

                    />
                </Animated.View>
            </View>}
            <View className="h-full w-full justify-center flex items-center">
                <View
                    onStartShouldSetResponder={() => true}
                    onResponderRelease={handleclose}
                    className="h-full absolute bottom-0 w-full px-2 py-3 opacity-80 bg-red-100 border border-slate-400 rounded-xl shadow-lg"></View>
                <View style={{ elevation: 6 }} className="w-4/5 relative h-3/4 py-4 overflow-y-scroll bg-white shadow-md shadow-slate-400 rounded-2xl flex justify-center items-center">
                    {showpreloader && <View className="absolute z-50 h-full w-full flex justify-center items-center rounded-2xl"><Preloader /></View>}
                    <View className="absolute z-40 right-2 top-2">
                        <TouchableOpacity onPress={handleclose}><FontAwesome5 name="times" size={24} color={colorred} /></TouchableOpacity>
                    </View>
                   
                     <View className="w-full px-5 flex-1">
                     <View className="items-center">
                            <Text className="text-xl font-bold uppercase">Update {currentForm}</Text>
                        </View>
                     <KeyboardAvoidingView        
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // Adjust this if needed
    >
                     <ScrollView contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled">
                      
                        <View className="items-center">
                            <Text className="text-sm text-red-500">{errorMsg}</Text>
                        </View>

                        {currentForm === "Biodata" && (
                            <BiodataUpdateForm data={data} handleCallBackValue={handleCallBackValue} />
                        )}
                        {currentForm === "Address" && (
                            <AddressUpdateForm
                            handleshowmodal={(value)=>handleshowmodallist(value)}
                             data={data} handleCallBackValue={handleCallBackValue}
                             Country={Country}
                             State={State}
                             selecttypefunc={(value)=>handleselectfunc(value)}
                             handlegetdata={(value)=>handlegetdata(value)}
                              />
                        )}
                        {currentForm === "Contact" && (
                            <ContactUpdateForm data={data} handleCallBackValue={handleCallBackValue} />
                        )}
                        {currentForm === "Next of Kin's Details" && (
                            <NOKUpdateForm data={data} handleCallBackValue={handleCallBackValue} />
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
                        </ScrollView>
                        </KeyboardAvoidingView>
                    </View>
                    
                </View>
            </View>
        </>
    );
};
export default ProfileUpdateModal

const BiodataUpdateForm = ({ data, handleCallBackValue }) => {
    const [Surname, setSurname] = useState(data[0].data.surname);
    const [Firstname, setFirstname] = useState(data[0].data.firstname);
    const [Middlename, setMiddlename] = useState(data[0].data.middlename);
    const [Gender, setGender] = useState(data[0].data.gender);
    const [DateOfBirth, setDateOfBirth] = useState(data[0].data.dob);
    const [showdate,setshowdate]=useState(false)

    useEffect(() => {
        handleCallBackValue({
            surname: Surname,
            firstname: Firstname,
            middlename: Middlename,
            gender: Gender.toLowerCase(),
            dob: DateOfBirth
        });
    }, [Surname, Firstname, Middlename, Gender, DateOfBirth]);

    return (
        <>
            <TextInput
                label="Firstname"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={(text) => setFirstname(text)}
                value={Firstname}
                className="w-full mt-3 bg-slate-50"
                disabled
            />
            <TextInput
                label="Surname"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={(text) => setSurname(text)}
                value={Surname}
                className="w-full mt-3 bg-slate-50"
                disabled
            />
            <TextInput
                label="Middlename"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={(text) => setMiddlename(text)}
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
            <TouchableOpacity onPress={()=>setshowdate(true)} className="h-12 rounded-md flex justify-center items-start px-3 border border-lightred bg-white m-2">
            <Text style={{ fontSize: 16 }} className="text-black">
            <FontAwesome5 size={20} color={colorred} name="arrow-circle-down" />
                {DateOfBirth||'---'}
                </Text>
            </TouchableOpacity>
            {showdate &&<DateModal
            setDateOfBirth={(value)=>setDateOfBirth(value)}
            DateOfBirth={DateOfBirth}
            closetwo={(value)=>setshowdate(value)}
            />}
      
        </>
    );
}


const AddressUpdateForm = ({ data, handleCallBackValue, handleshowmodal,Country,State,selecttypefunc,handlegetdata }) => {
    const [City, setCity] = useState(data[0].data.city);
    const [Address, setAddress] = useState(data[0].data.address);

    useEffect(() => {
        handleCallBackValue({
            country: Country,
            state: State,
            city: City,
            address: Address
        });
    }, [Country, State, City, Address]);

   
    const translateYinput = useSharedValue(300);
    const animatedStylesinput = useAnimatedStyle(() => ({
        transform: [{ translateY: translateYinput.value }],
    }));

    const handlecountry = async() => {
        selecttypefunc('country')
        await handlegetdata('country'); 
        handleshowmodal(true)
        
      
  

    }
    const handlestate = async () => {
        selecttypefunc('state')
        await handlegetdata('state'); 
        handleshowmodal(true)
        // setselecttpe('state')
        console.log(Country)

        

    }


    return (
        <>
            <TouchableOpacity onPress={handlecountry} className="h-12 rounded-md flex justify-center items-start px-3 border border-lightred bg-white m-2">
                <Text style={{ fontSize: 16 }} className="text-black">
                    <Text className="">
                        <FontAwesome5 size={20} color={colorred} name="arrow-circle-down" />
                        {Country ? Country : "Select Country"}
                    </Text>
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlestate} className="h-12 rounded-md flex justify-center items-start px-3 border border-lightred bg-white m-2">

                <Text style={{ fontSize: 16 }} className="text-black">
                    <Text className="">
                        <FontAwesome5 size={20} color={colorred} name="arrow-circle-down" />
                        {State ? State : "Select State"}
                    </Text>
                </Text>
            </TouchableOpacity>
            <TextInput
                label="City"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={(text) => setCity(text)}
                value={City}
                className="w-full mt-3 bg-slate-50"
            />
           
            <TextInput
                label="Address"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={(text) => setAddress(text)}
                value={Address}
                className="w-full mt-3 bg-slate-50"
            />
        </>
    );
}
const ContactUpdateForm = ({ data, handleCallBackValue }) => {
    const [Phone, setPhone] = useState(data[0].data.phone);
    const [Email, setEmail] = useState(data[0].data.email);

    useEffect(() => {
        handleCallBackValue({
            phone: Phone,
            email: Email
        });
    }, [Phone, Email]);

    return (
        <>
            <TextInput
                label="Phone number"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={(text) => setPhone(text)}
                value={Phone}
                className="w-full mt-3 bg-slate-50"
            />
            <TextInput
                label="Email"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={(text) => setEmail(text)}
                value={Email}
                className="w-full mt-3 bg-slate-50"
            />
        </>
    )
}

const NOKUpdateForm = ({ data, handleCallBackValue }) => {
    const [NOKName, setNOKName] = useState(data[0].data.nextOfKinName);
    const [NOKPhone, setNOKPhone] = useState(data[0].data.nextOfKinPhoneNumber);

    useEffect(() => {
        handleCallBackValue({
            nextOfKinName: NOKName,
            nextOfKinPhoneNumber: NOKPhone
        });
    }, [NOKName, NOKPhone]);

    return (
        <>
            <TextInput
                label="Next of Kin's Name"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={(text) => setNOKName(text)}
                value={NOKName}
                className="w-full mt-3 bg-slate-50"
            />
            <TextInput
                label="Next of Kin's phone number"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={(text) => setNOKPhone(text)}
                value={NOKPhone}
                className="w-full mt-3 bg-slate-50"
            />
        </>
    )
}