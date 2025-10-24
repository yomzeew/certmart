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
import DateModal from "./datemodal"
import CustomTextInput from "../../components/CustomTextInput"
import { getallcountries, getallstates } from "../jsondata/country-states"
import { countrieslist, statelist } from "../../settings/endpoint"

const ProfileUpdateModal = ({ close, data, profileData, id }) => {
    // Add safety checks for data
    if (!data || !Array.isArray(data) || data.length === 0) {
        console.error('ProfileUpdateModal: Invalid or missing data prop');
        return null;
    }

    const currentForm = data[0]?.title || 'Profile';
    const [errorMsg, seterrorMsg] = useState('');
    const [showpreloader, setshowpreloader] = useState(false);
    
    // Seed formData with complete profile to preserve all fields across form switches
    const [formData, setFormData] = useState({
        surname: profileData?.surname || '',
        firstname: profileData?.firstname || '',
        middlename: profileData?.middlename || '',
        email: profileData?.email || '',
        gender: profileData?.gender || '',
        dob: profileData?.dob || '',
        address: profileData?.address || '',
        city: profileData?.city || '',
        phone: profileData?.phone || '',
        nextOfKinName: profileData?.nokName || '',
        nextOfKinPhoneNumber: profileData?.nokPhone || '',
    });
    const [showmodalcourse,setshowmodalcourse]=useState(false)
    const [selectdata, setselectdata] = useState([])
    const [State, setState] = useState(data[0]?.data?.state || profileData?.state || '');
    const [Country, setCountry] = useState(data[0]?.data?.country || profileData?.country || '');
    // keep underlying IDs to submit back to API - initialize from profileData
    const [StateId, setStateId] = useState(profileData?.stateId || data[0]?.data?.stateId || data[0]?.data?.state_id || null);
    const [CountryId, setCountryId] = useState(profileData?.countryId || data[0]?.data?.countryId || data[0]?.data?.country_id || null);
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
            const countrylistone = await getallcountries();
            setselectdata(countrylistone);
        } else if (type === 'state') {
            const datastate = await getallstates(Country);
            setselectdata(datastate);
        }
    };

    const handleshowmodallist = (value) => {
        translateY.value = withSpring(0);
        setshowmodalcourse(value);
    };
    const getAuthHeaders = async () => {
        const token = await AsyncStorage.getItem("token");
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
    };

    const resolveCountryIdByName = async (countryName) => {
        const headers = await getAuthHeaders();
        const res = await axios.get(countrieslist, { headers });
        const list = res?.data?.data ?? res?.data ?? [];
        const match = Array.isArray(list)
          ? list.find((c) => (c?.name || "").toLowerCase() === (countryName || "").toLowerCase())
          : null;
        return match?.id ?? null;
    };

    const resolveStateIdByName = async (stateName, countryId) => {
        if (!countryId) return null;
        const headers = await getAuthHeaders();
        const res = await axios.get(`${statelist}/${countryId}`, { headers });
        const list = res?.data?.data ?? res?.data ?? [];
        const match = Array.isArray(list)
          ? list.find((s) => (s?.name || "").toLowerCase() === (stateName || "").toLowerCase())
          : null;
        return match?.id ?? null;
    };

    const handlegetvalue = async (value) => {
        if (selecttype === 'country') {
            setCountry(value);
            const cid = await resolveCountryIdByName(value);
            setCountryId(cid);
            setState('');
            setStateId(null);
        } else if (selecttype === 'state') {
            setState(value);
            const sid = await resolveStateIdByName(value, CountryId);
            setStateId(sid);
        }

        setshowmodalcourse(false)
        translateY.value = withSpring(300);

    }
    const handleclosemodal=()=>{
        setshowmodalcourse(false)
    }

    // Always preserve required biodata fields
    const requiredData = {
        surname: formData.surname || profileData?.surname || '',
        firstname: formData.firstname || profileData?.firstname || '',
        email: formData.email || profileData?.email || '',
        gender: (formData.gender || profileData?.gender || '').toLowerCase()
    };

    const navigation = useNavigation();

    const formatServerError = (data, status) => {
        try {
            if (!data) return `Request failed${status ? ` (status ${status})` : ''}`;
            // Laravel-style validation
            if (data.errors && typeof data.errors === 'object') {
                const lines = [];
                Object.keys(data.errors).forEach((field) => {
                    const msgs = Array.isArray(data.errors[field]) ? data.errors[field] : [String(data.errors[field])];
                    msgs.forEach((m) => lines.push(`${field}: ${m}`));
                });
                return lines.join('\n');
            }
            if (typeof data.message === 'string') return data.message;
            if (typeof data.error === 'string') return data.error;
            // Fallback to compact JSON
            return JSON.stringify(data);
        } catch {
            return 'Unexpected error while parsing server response';
        }
    };

    const handleclose = () => {
        close(false);
    };
  

    const handlesubmit = async () => {
        // Build complete payload with all possible fields
        const payload = {
            // Required biodata
            surname: (requiredData.surname || '').trim(),
            firstname: (requiredData.firstname || '').trim(),
            email: (requiredData.email || '').trim(),
            gender: (requiredData.gender || '').trim(),
            // Optional biodata
            middlename: (formData.middlename || '').trim(),
            dob: (formData.dob || '').trim(),
            // Address - convert IDs to strings
            address: (formData.address || '').trim(),
            city: (formData.city || '').trim(),
            country: CountryId ? String(CountryId) : '',
            state: StateId ? String(StateId) : '',
            // Contact
            phone: (formData.phone || '').trim(),
            // Next of Kin
            nextOfKinName: (formData.nextOfKinName || '').trim(),
            nextOfKinPhoneNumber: (formData.nextOfKinPhoneNumber || '').trim(),
        };
        
        // Remove empty values to avoid sending empty strings
        const cleanPayload = Object.fromEntries(
            Object.entries(payload).filter(([key, val]) => val !== '' && val !== null && val !== undefined)
        );
        
        console.log('Submitting payload:', cleanPayload)

        //! Perform validation, set errors, or submit data here
        // setshowpreloader(true);
        const token = await AsyncStorage.getItem('token')
        try {
            const data = cleanPayload
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
                const { status, data, headers } = error.response || {};
                console.error('Error response:', data);
                console.error('Error status:', status);
                console.error('Error headers:', headers);
                const msg = formatServerError(data, status);
                seterrorMsg(msg || `Request failed (status ${status})`);
            } else if (error.request) {
                // Request was made but no response received
                console.error('Error request:', error.request);
                seterrorMsg('No response from server. Please check your connection and try again.');
            } else {
                // Something else happened while setting up the request
                console.error('Error message:', error.message);
                seterrorMsg(error.message || 'Unexpected error occurred.');

            }
        } finally {
            // setshowpreloader(false);
        }
    };

    const handleCallBackValue = (updatedValues) => {
        // Merge updates from child forms to preserve all fields
        setFormData((prev) => ({ ...prev, ...updatedValues }));
    };

    return (
        <>
        {showmodalcourse && <View style={{zIndex:12000,elevation:12000}} className="bottom-0 absolute">
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
                    {showpreloader && <View style={{zIndex:50,elevation:50}}  className="absolute h-full w-full flex justify-center items-center rounded-2xl"><Preloader /></View>}
                    <View  className="absolute z-40 right-2 top-2">
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
                              data={data}
                              handleCallBackValue={handleCallBackValue}
                              Country={Country}
                              State={State}
                              CountryId={CountryId}
                              StateId={StateId}
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
    // Add safety checks
    if (!data || !Array.isArray(data) || data.length === 0) {
        console.error('BiodataUpdateForm: Invalid or missing data prop');
        return null;
    }

    const [Surname, setSurname] = useState(data[0]?.data?.surname || '');
    const [Firstname, setFirstname] = useState(data[0]?.data?.firstname || '');
    const [Middlename, setMiddlename] = useState(data[0]?.data?.middlename || '');
    const [Gender, setGender] = useState(data[0]?.data?.gender || 'Male');
    const [DateOfBirth, setDateOfBirth] = useState(data[0]?.data?.dob || '');
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
    <View className="w-full mt-3">
            <CustomTextInput
                label="Firstname"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={(text) => setFirstname(text)}
                value={Firstname}
                className="w-full mt-3 "
                disabled
            />
             </View>
             <View className="w-full mt-3">
            <CustomTextInput
                label="Surname"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={(text) => setSurname(text)}
                value={Surname}
                className="w-full mt-3 "
                disabled
            />
            </View>
            <View className="w-full mt-3">
            <CustomTextInput
                label="Middlename"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={(text) => setMiddlename(text)}
                value={Middlename}
                className="w-full mt-3 "
            />
            </View>
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
    // Add safety checks
    if (!data || !Array.isArray(data) || data.length === 0) {
        console.error('AddressUpdateForm: Invalid or missing data prop');
        return null;
    }

    const [City, setCity] = useState(data[0]?.data?.city || '');
    const [Address, setAddress] = useState(data[0]?.data?.address || '');
    const [CountryId, setCountryId] = useState(data[0]?.data?.countryId || '');
    const [StateId, setStateId] = useState(data[0]?.data?.stateId || '');

    useEffect(() => {
        handleCallBackValue({
            country: Country,
            state: State,
            countryId: CountryId,
            stateId: StateId,
            city: City,
            address: Address,
        });
    }, [Country, State, CountryId, StateId, City, Address]);

   
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
        //setselecttpe('state')
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
            <View className="w-full mt-3">
            <CustomTextInput
                label="City"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={(text) => setCity(text)}
                value={City}
                className="w-full mt-3 "
            />
            </View>
            <View className="w-full mt-3 mb-3">
            <CustomTextInput
                label="Address"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={(text) => setAddress(text)}
                value={Address}
                className="w-full mt-3 "
            />
            </View>
        </>
    );
}
const ContactUpdateForm = ({ data, handleCallBackValue }) => {
    // Add safety checks
    if (!data || !Array.isArray(data) || data.length === 0) {
        console.error('ContactUpdateForm: Invalid or missing data prop');
        return null;
    }

    const [Phone, setPhone] = useState(data[0]?.data?.phone || '');
    

    useEffect(() => {
        handleCallBackValue({
            phone: Phone,
        });
    }, [Phone]);

    return (
        <>
            <CustomTextInput
                label="Phone number"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={(text) => setPhone(text)}
                value={Phone}
                className="w-full mt-3 bg-slate-50"
            />
          
        </>
    )
}

const NOKUpdateForm = ({ data, handleCallBackValue }) => {
    // Add safety checks
    if (!data || !Array.isArray(data) || data.length === 0) {
        console.error('NOKUpdateForm: Invalid or missing data prop');
        return null;
    }

    const [NOKName, setNOKName] = useState(data[0]?.data?.nextOfKinName || '');
    const [NOKPhone, setNOKPhone] = useState(data[0]?.data?.nextOfKinPhoneNumber || '');

    useEffect(() => {
        handleCallBackValue({
            nextOfKinName: NOKName,
            nextOfKinPhoneNumber: NOKPhone
        });
    }, [NOKName, NOKPhone]);

    return (
        <>
            <CustomTextInput
                label="Next of Kin's Name"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={(text) => setNOKName(text)}
                value={NOKName}
                className="w-full mt-3 bg-slate-50"
            />
            <CustomTextInput
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