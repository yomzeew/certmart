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
    const [errorMsg, seterrorMsg] = useState('');
    const [showpreloader, setshowpreloader] = useState(false);
    const [formData, setFormData] = useState({
        Surname: data[0].data.Surname,
        Firstname: data[0].data.Firstname,
        Middlename: data[0].data.Middlename,
        Gender: data[0].data.Gender,
        DateOfBirth: data[0].data.DateOfBirth,
        Country: data[0].data.Country,
        State: data[0].data.State,
        City: data[0].data.City,
        Address: data[0].data.Address
    });

    const navigation = useNavigation();

    const handleclose = () => {
        close(false);
    };

    const handlesubmit = async () => {
        console.log(formData);
        // Perform validation, set errors, or submit data here
    };

    const handleCallBackValue = (updatedValues) => {
        setFormData(prevState => ({
            ...prevState,
            ...updatedValues
        }));
    };

    return (
        <>
            <View className="h-full w-full justify-center flex items-center">
                <View
                    onStartShouldSetResponder={() => true}
                    onResponderRelease={handleclose}
                    className="h-full absolute bottom-0 w-full px-2 py-3 opacity-80 bg-red-100 border border-slate-400 rounded-xl shadow-lg"></View>
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
                            <BiodataUpdateForm data={data} handleCallBackValue={handleCallBackValue} />
                        )}
                        {currentForm === "Address" && (
                            <AddressUpdateForm data={data} handleCallBackValue={handleCallBackValue} />
                        )}
                        {currentForm === "Contact" && (
                            <BiodataUpdateForm data={data} handleCallBackValue={handleCallBackValue} />
                        )}
                        {currentForm === "Next of Kin's Details" && (
                            <BiodataUpdateForm data={data} handleCallBackValue={handleCallBackValue} />
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
    );
};
export default ProfileUpdateModal

const BiodataUpdateForm = ({ data, handleCallBackValue }) => {
    const [Surname, setSurname] = useState(data[0].data.Surname);
    const [Firstname, setFirstname] = useState(data[0].data.Firstname);
    const [Middlename, setMiddlename] = useState(data[0].data.Middlename);
    const [Gender, setGender] = useState(data[0].data.Gender);
    const [DateOfBirth, setDateOfBirth] = useState(data[0].data.DateOfBirth);

    // Directly call handleCallBackValue when input changes
    const handleInputChange = (key, value) => {
        handleCallBackValue({ [key]: value });
    };

    return (
        <>
            <TextInput
                label="Firstname"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={(text) => { setFirstname(text); handleInputChange('Firstname', text); }}
                value={Firstname}
                className="w-full mt-3 bg-slate-50"
            />
            <TextInput
                label="Surname"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={(text) => { setSurname(text); handleInputChange('Surname', text); }}
                value={Surname}
                className="w-full mt-3 bg-slate-50"
            />
            <TextInput
                label="Middlename"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={(text) => { setMiddlename(text); handleInputChange('Middlename', text); }}
                value={Middlename}
                className="w-full mt-3 bg-slate-50"
            />
            <View className="w-3/4 mt-3">
                <Text style={{ fontSize: 16 }}>Choose your Gender</Text>
                <View className="flex flex-row items-center mt-2">
                    <RadioButton
                        value="Male"
                        status={Gender === 'Male' ? 'checked' : 'unchecked'}
                        onPress={() => { setGender('Male'); handleInputChange('Gender', 'Male'); }}
                        color={colorred}
                    />
                    {Platform.OS === 'ios' && <TouchableOpacity onPress={() => { setGender('Male'); handleInputChange('Gender', 'Male'); }} style={{ marginRight: 10 }} className="bg-red-300 w-12 items-center h-5 justify-center rounded-xl"><Text>Male</Text></TouchableOpacity>}
                    {Platform.OS === 'android' && <Text style={{ marginRight: 10 }}>Male</Text>}
                    <RadioButton
                        value="Female"
                        status={Gender === 'Female' ? 'checked' : 'unchecked'}
                        onPress={() => { setGender('Female'); handleInputChange('Gender', 'Female'); }}
                        color={colorred}
                    />
                    {Platform.OS === 'ios' && <TouchableOpacity onPress={() => { setGender('Female'); handleInputChange('Gender', 'Female'); }} style={{ marginRight: 10 }} className="bg-red-300 w-12 items-center h-5 justify-center rounded-xl"><Text>Female</Text></TouchableOpacity>}
                    {Platform.OS === 'android' && <Text style={{ marginRight: 10 }}>Female</Text>}
                </View>
            </View>
            <TextInput
                label="DateOfBirth"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={(text) => { setDateOfBirth(text); handleInputChange('DateOfBirth', text); }}
                value={DateOfBirth}
                className="w-full mt-3 bg-slate-50"
            />
        </>
    );
}

const AddressUpdateForm = ({ data, handleCallBackValue }) => {
    const [Country, setCountry] = useState(data[0].data.Country);
    const [State, setState] = useState(data[0].data.State);
    const [City, setCity] = useState(data[0].data.City);
    const [Address, setAddress] = useState(data[0].data.Address);

    const handleInputChange = (key, value) => {
        handleCallBackValue({ [key]: value });
    };

    return (
        <>
            <TextInput
                label="Country"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                value={Country}
                className="w-full mt-3 bg-slate-50"
                disabled
            />
            <TextInput
                label="State"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={(text) => { setState(text); handleInputChange('State', text); }}
                value={State}
                className="w-full mt-3 bg-slate-50"
            />
            <TextInput
                label="City"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={(text) => { setCity(text); handleInputChange('City', text); }}
                value={City}
                className="w-full mt-3 bg-slate-50"
            />
            <TextInput
                label="Address"
                mode="outlined"
                theme={{ colors: { primary: colorred } }}
                onChangeText={(text) => { setAddress(text); handleInputChange('Address', text); }}
                value={Address}
                className="w-full mt-3 bg-slate-50"
            />
        </>
    );
}
