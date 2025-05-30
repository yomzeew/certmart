import { StatusBar } from "expo-status-bar";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { styles } from "../../../settings/layoutsetting";
import Header from "./header";
import {
  colorred,
  colorreddark,
  colorredmedium,
} from "../../../constant/color";
import { LinearGradient } from "expo-linear-gradient";
import { Avatar, Divider } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import Footer from "./footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {
  studentdetails,
  updatedetails,
  updateProfilePic,
} from "../../../settings/endpoint";
import { useEffect, useState } from "react";
import ProfileUpdateModal from "../../modals/profileupdatemodal";
import Preloader from "../../preloadermodal/preloaderwhite";
import * as ImagePicker from "expo-image-picker";
import { uploadImage } from "../../uploadfile/uploadfile";
import { convertDate } from "../../../settings/dateformat";

const StudentProfile = () => {
  const [showloader, setshowloader] = useState(false);
  const [showProfileUpdate, setShowProfileUpdate] = useState(false);
  const [formData, setFormData] = useState([]);
  const [dp, setDp] = useState("");
  const [id, setId] = useState();
  const [studentid, setstudentid] = useState("");
  //biodata
  const [Surname, setSurname] = useState("");
  const [Firstname, setFirstname] = useState("");
  const [Middlename, setMiddlename] = useState("");
  const [Gender, setGender] = useState("");
  const [DateOfBirth, setDateOfBirth] = useState("");
  //address
  const [Country, setCountry] = useState("");
  const [State, setState] = useState("");
  const [City, setCity] = useState("");
  const [Address, setAddress] = useState("");
  //contact
  const [Phone, setPhone] = useState("");
  const [Email, setEmail] = useState("");
  //next of kin data
  const [NOKName, setNOKName] = useState("");
  const [NOKPhone, setNOKPhone] = useState("");
  const fetchdata = async () => {
    console.log("ok");
    setshowloader(true);
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.get(studentdetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setDp(response.data.dp);
      setId(response.data.id);
      setstudentid(response.data.studentid);
      setSurname(response.data.surname);
      setFirstname(response.data.firstname);
      setMiddlename(response.data.middlename);
      setGender(response.data.gender);
      const dobformat = convertDate(response.data.dob);
      setDateOfBirth(dobformat);
      setCountry(response.data.country);
      setState(response.data.state);
      setCity(response.data.city);
      setAddress(response.data.address);
      setPhone(response.data.phone);
      setEmail(response.data.email);
      setNOKName(response.data.nextOfKinName);
      setNOKPhone(response.data.nextOfKinPhoneNumber);
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Error response:", error.response.data);
        console.log(error.response.data.error);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
      } else if (error.request) {
        // Request was made but no response received
        console.error("Error request:", error.request);
      } else {
        // Something else happened while setting up the request
        console.error("Error message:", error.message);
      }
    } finally {
      setshowloader(false);
    }
  };
  useEffect(() => {
    fetchdata();
  }, [showProfileUpdate]);
  const handleclose = (value) => {
    setShowProfileUpdate(value);
  };
  const handleBiodata = () => {
    setShowProfileUpdate(true);
    setFormData([
      {
        title: "Biodata",
        data: {
          surname: Surname,
          firstname: Firstname,
          email: Email,
          middlename: Middlename,
          gender: Gender,
          dob: DateOfBirth,
        },
      },
    ]);
  };
  const handleAddress = () => {
    setShowProfileUpdate(true);
    setFormData([
      {
        title: "Address",
        data: {
          surname: Surname,
          firstname: Firstname,
          email: Email,
          gender: Gender,
          country: Country,
          state: State,
          city: City,
          address: Address,
        },
      },
    ]);
  };
  const handleContact = () => {
    setShowProfileUpdate(true);
    setFormData([
      {
        title: "Contact",
        data: {
          surname: Surname,
          firstname: Firstname,
          gender: Gender,
          phone: Phone,
          email: Email,
        },
      },
    ]);
  };
  const handleNOK = () => {
    setShowProfileUpdate(true);
    setFormData([
      {
        title: "Next of Kin's Details",
        data: {
          surname: Surname,
          firstname: Firstname,
          email: Email,
          gender: Gender,
          nextOfKinName: NOKName,
          nextOfKinPhoneNumber: NOKPhone,
        },
      },
    ]);
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log("ok");
      console.log(result);
      console.log(result.assets[0].uri);
      try {
        setshowloader(true);
        await uploadImage(result.assets[0].uri, studentid);
      } catch (error) {
      } finally {
        setshowloader(false);
      }

      //upload file
    } else {
      alert("You did not select any image");
    }
  };

  return (
    <>
      {showloader && (
        <View className="absolute z-50 w-full h-full">
          <Preloader />
        </View>
      )}
      {showProfileUpdate && (
        <View className="absolute z-40 w-full h-full">
          <ProfileUpdateModal
            close={(value) => handleclose(value)}
            data={formData}
            id={id}
          />
        </View>
      )}
      <SafeAreaView
        style={[styles.andriod, styles.bgcolor]}
        className="flex flex-1 w-full"
      >
        <StatusBar style="auto" />
        <Header />
        <View className="px-5 h-1/6 mt-3">
          <View
            className="h-full w-full rounded-2xl flex flex-row justify-center"
            style={{ elevation: 4,backgroundColor:colorreddark }}
          
          >
            <Text
              style={{ fontSize: 24 }}
              className="font-extralight text-white mt-8"
            >
              {Firstname}'s Profile
            </Text>
          </View>
          <View className="items-center w-full -mt-10">
            <View>
              <TouchableOpacity
               style={{ zIndex: 40, elevation: 40 }}
                className="absolute right-0 bottom-0  bg-white w-8 h-8 rounded-full flex justify-center items-center"
                onPress={pickImageAsync}
              >
                <FontAwesome size={20} color={colorred} name="pencil" />
              </TouchableOpacity>
              {dp ? (
                <Avatar.Image
                  source={{
                    uri: `https://certmart.org/dps/${dp}.jpg?timestamp=${new Date().getTime()}`,
                  }}
                />
              ) : (
                <Avatar.Image source={require("../../images/avatermale.png")} />
              )}
            </View>
          </View>
        </View>
        <View className="flex-1 px-5 mt-16 w-full">
          <View className="h-full  bg-slate-100 rounded-2xl px-3">
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mt-3 flex  flex-row justify-between">
                <Text style={{ fontSize: 16 }} className="font-bold">
                  Biodata
                </Text>
                <TouchableOpacity onPress={handleBiodata}>
                  <FontAwesome color={colorred} size={20} name="pencil" />
                </TouchableOpacity>
              </View>
              <View className="border-red-500 border-b-1" />
              <View className="mt-5 w-full flex-row items-center  flex justify-between">
                <Text style={{ fontSize: 14 }} className="text-slate-500">
                  Surname: {Surname}
                </Text>
                <Text style={{ fontSize: 14 }} className="text-slate-500">
                  Firstname: {Firstname}
                </Text>
              </View>
              <Divider />
              <View className="mt-3 w-full flex-row items-center  flex justify-between">
                <Text style={{ fontSize: 14 }} className="text-slate-500">
                  Middlename: {Middlename}
                </Text>
                <Text style={{ fontSize: 14 }} className="text-slate-500">
                  Gender: {Gender}
                </Text>
              </View>
              <Divider />
              <View className="mt-3 w-full flex-row items-center  flex justify-between">
                <Text style={{ fontSize: 14 }} className="text-slate-500">
                  Date of Birth: {DateOfBirth || "---"}
                </Text>
              </View>
              <View className="mt-5 flex  flex-row justify-between">
                <Text style={{ fontSize: 16 }} className="font-bold">
                  Address
                </Text>
                <TouchableOpacity onPress={handleAddress}>
                  <FontAwesome color={colorred} size={20} name="pencil" />
                </TouchableOpacity>
              </View>
              <View className="border-red-500 border-b-1" />
              <View className="mt-3 w-full flex-row items-center  flex justify-between">
                <Text style={{ fontSize: 14 }} className="text-slate-500">
                  Country: {Country || "---"}
                </Text>
                <Text style={{ fontSize: 14 }} className="text-slate-500">
                  State: {State || "---"}
                </Text>
              </View>
              <Divider />
              <View className="mt-3 w-full flex-row items-center  flex justify-between">
                <Text style={{ fontSize: 14 }} className="text-slate-500">
                  City: {City || "---"}
                </Text>
              </View>
              <Divider />

              <View className="mt-3 w-full">
                <Text style={{ fontSize: 14 }} className="text-slate-500">
                  Address: {Address || "---"}
                </Text>
              </View>
              <Divider />
              <View className="mt-5 flex  flex-row justify-between">
                <Text style={{ fontSize: 16 }} className="font-bold">
                  Contact
                </Text>
                <TouchableOpacity onPress={handleContact}>
                  <FontAwesome color={colorred} size={20} name="pencil" />
                </TouchableOpacity>
              </View>
              <View className="border-red-500 border-b-1" />
              <View className="mt-3 w-full ">
                <Text style={{ fontSize: 14 }} className="text-slate-500">
                  Phone: {Phone || "---"}
                </Text>
              </View>
              <Divider />
              <View className="mt-3 w-full">
                <Text style={{ fontSize: 14 }} className="text-slate-500">
                  Email: {Email}
                </Text>
              </View>
              <View className="mt-5 flex  flex-row justify-between">
                <Text style={{ fontSize: 16 }} className="font-bold">
                  Next of Kin's Details
                </Text>
                <TouchableOpacity onPress={handleNOK}>
                  <FontAwesome color={colorred} size={20} name="pencil" />
                </TouchableOpacity>
              </View>
              <View className="border-red-500 border-b-1" />
              <View className="mt-3 w-full flex-row items-center  flex justify-between">
                <Text style={{ fontSize: 14 }} className="text-slate-500">
                  Name: {NOKName || "---"}
                </Text>
                <Text style={{ fontSize: 14 }} className="text-slate-500">
                  Phone number: {NOKPhone || "---"}
                </Text>
              </View>
              <Divider />
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};
export default StudentProfile;
