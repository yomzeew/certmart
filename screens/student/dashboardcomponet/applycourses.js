import { SafeAreaView, View, Text,ScrollView, TouchableOpacity  } from "react-native";
import { styles } from "../../../settings/layoutsetting";
import Header from "./header";

import {
  bluecolor,
  colorred,
  colorwhite,
  lightred,
} from "../../../constant/color";
import { Divider, TextInput } from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useEffect, useState,useCallback } from "react";
import Footer from "./footer";
import DisplayModal from "../../modals/datadisplay";
import { fetchData } from "../../jsondata/fetchfunction";
import * as DocumentPicker from "expo-document-picker";
import { uploadFile } from "../../uploadfile/uploadfile";
import InputModal from "../../modals/inputmodal";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { allavailablecourse, allcourses, applyAdmission } from "../../../settings/endpoint";
import {
  countrylist,
  fecthcountrysate,
  getallcountries,
  getallstates,
  getstudycenter,
} from "../../jsondata/country-states";
import Preloader from "../../preloadermodal/preloaderwhite";
import { currentDate } from "../../../utility/get-date-time";
import SuccessModal from "../../modals/successfulmodal";
import { useRoute } from "@react-navigation/native";


const ApplyCourses = () => {
  const route = useRoute();
  const { courseName,courseCodeName } = route.params;
 
  const [showLoader, setShowLoader] = useState(false);
  const [showphysical, setshowphysical] = useState(false);
  const [showmodalcourse, setshowmodalcourse] = useState(false);
  const [showmodalinput, setshowmodalinput] = useState(false);
  const [showopcity, setshowopcity] = useState(false);
  const [classtype, setclasstype] = useState("Virtual");
  const [course, setcourse] = useState(courseName);
  const [courseid, setcourseid] = useState(courseCodeName);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setcity] = useState("");
  const [computerlevel, setcomputerlevel] = useState("");
  const [addinfo, setaddinfo] = useState("");
  const [datacourse, setdatacourse] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [rawdata,setrawdata]=useState([])
  const [data, setdata] = useState([]);
  const [selecttype, setselecttpe] = useState("");
  const [cvfilename, setcvfilename] = useState("");
  const [errormsg, seterrormsg] = useState("");
  const [Duration, setDuration] = useState("");
  const [cvnewname, setcvnewname] = useState("");
  const [showsuccess, setshowsuccess] = useState(false);
  const [countryid,setcountryid]=useState('')
  const [stateid,setstateid]=useState('')
  const fetchdata = useCallback(async () => {
    try {
     setShowLoader(true);
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(allavailablecourse, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const getdata = response.data;
      console.log(getdata);
      if(course){
        if(getdata.length>0){
          const newArray=getdata.filter((item,index)=>(
            item.course===getvalue
          ))
          setcourseid(newArray[0].courses)
  
        }
        
      }
  
      setrawdata(getdata);
  
      const getcourse = new Set(getdata.map((item) => `${item.course}`));
  
      setdatacourse([...getcourse]);
      setdata([...getcourse]);
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    } finally {
      setShowLoader(false);
    }
  }, [allavailablecourse, setrawdata, setdatacourse, setdata]);
  useEffect(() => {
    fetchdata();
    setdata(datacourse);
  }, []);
  const computerliteracy = [
    "Novice",
    "Beginner",
    "Basic",
    "Intermediate",
    "Advanced",
  ];
  useEffect(() => {
    if (showmodalcourse || showmodalinput) {
      setshowopcity(true);
    } else {
      setshowopcity(false);
    }
  }, [showmodalcourse, showmodalinput]);

  const hanleshowphsical = () => {
    setclasstype("Physical");
    setshowphysical(!showphysical);
  };
  const hanleshowvirtual = () => {
    setclasstype("Virtual");
    setshowphysical(!showphysical);
  };

  const translateY = useSharedValue(300);
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  const translateYinput = useSharedValue(300);
  const animatedStylesinput = useAnimatedStyle(() => ({
    transform: [{ translateY: translateYinput.value }],
  }));
  const handlecourses = () => {
    setdata(datacourse);
    console.log(datacourse)
    setselecttpe("course");
    translateY.value = withSpring(0);
    setshowmodalcourse(!showmodalcourse);
  };
  const handlecountry = async () => {
    setselecttpe("country");
    try {
      setShowLoader(true);
      const countrylistone = await getallcountries();
      setdata(countrylistone);
    } catch (error) {
    } finally {
      setShowLoader(false);
    }

    translateY.value = withSpring(0);
    setshowmodalcourse(!showmodalcourse);
    setState("");
    setcity("");
  };
  const handlestate = async () => {
    setselecttpe("state");
    console.log(country);

    try {
      setShowLoader(true);

      const datastate = await getallstates(country);
      setdata(datastate);
    } catch (error) {
    } finally {
      setShowLoader(false);
    }

    translateY.value = withSpring(0);
    setshowmodalcourse(!showmodalcourse);
    setcity("");
  };
  const handlecity = async () => {
    setselecttpe("city");

    try {
      setShowLoader(true);
      const datastudy = await getstudycenter(state, country);

      setdata(datastudy[0]);
      const datastudycity=datastudy[1]
      setcountryid(datastudycity[0].country_id)
      setstateid(datastudycity[0].id)
    } catch (error) {
    } finally {
      setShowLoader(false);
    }

    translateY.value = withSpring(0);
    setshowmodalcourse(!showmodalcourse);
  };
  const handlecomputer = () => {
    setselecttpe("computer");
    setdata(computerliteracy);
    translateY.value = withSpring(0);
    setshowmodalcourse(!showmodalcourse);
  };
  const handleaddinfo = () => {
    translateYinput.value = withSpring(0);
    setshowmodalinput(!showmodalinput);
  };

  const handleclose = (value) => {
    setshowmodalcourse(value);
    translateY.value = withSpring(300);
  };
  const handlecloseinput = (value) => {
    setshowmodalinput(value);
    translateYinput.value = withSpring(300);
  };
  const handlegetvalue = (value) => {
    const getvalue = value;
    if (selecttype === "course") {
      if(rawdata.length>0){
        const newArray=rawdata.filter((item,index)=>(
          item.course===getvalue
        ))
        setcourseid(newArray[0].courses)

      }

      setcourse(getvalue);
    } else if (selecttype === "country") {
      setCountry(value);
    } else if (selecttype === "state") {
      setState(value);
    } else if (selecttype === "city") {
      setcity(value);
    } else if (selecttype === "computer") {
      setcomputerlevel(value);
    }

    setshowmodalcourse(false);
    translateY.value = withSpring(300);
  };
  const getvalue = (value) => {
    setaddinfo(value);
    setshowmodalinput(false);
    translateYinput.value = withSpring(300);
  };
  useEffect(() => {
    const getData = async () => {
      try {
        if (!country) {
          const data = await getallcountries();
          setCountryData(data);
        } else if (country && !state) {
          const data = await getallstates(country);
          setStateData(data);
        } else if (country && state) {
          const data = await getstudycenter(country, state);
          setCityData(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      console.log(classtype)
    };

    getData();
  }, [country, state]);

  const getdocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });
    if (result.assets.length > 0) {
      const resultname = result.assets[0].name;
      setcvfilename(resultname);
    }

    if (result.assets[0].size > 5120000) {
      seterrormsg("File size should be less than 50kb");
      return;
    } else {
      console.log(result.assets[0]);
      seterrormsg("");
      const filename = await uploadFile(result.assets[0]);
      setcvnewname(filename);
    }
  };

  const handlesubmit = async () => {  
    
    const token = await AsyncStorage.getItem("token");
    const studentId = await AsyncStorage.getItem("studentid");
    console.log(studentId);
    if (!course) {
      seterrormsg("Please select your course");
      return;
    }
    if(!city){
      setCountry("Virtual");
      setState("Virtual");
      setcity("Virtual");

    }
  if(!cvnewname){
    seterrormsg("Please Upload your Cv");
    return

  }
    let formData = {
      studentid: studentId,
      state:stateid,
      country:countryid,
      studycentre: city,
      course:courseid,
      cv: cvnewname,
      comment: addinfo,
      decisioncomment: "add decision comment",
      applicationdate: currentDate,
      approveddate: currentDate,
      status: "Applied",
      proceesFee: "Pending",
      classType: classtype,
      literacy_level: computerlevel, //nullable
    };
    if (classtype === "Virtual") {
      
     formData = {
      studentid: studentId,
      course:courseid,
      cv: cvnewname,
      comment: addinfo,
      decisioncomment: "add decision comment",
      applicationdate: currentDate,
      approveddate: currentDate,
      status: "Applied",
      proceesFee: "Pending",
      classType: classtype,
      literacy_level: computerlevel, //nullable
    };
    }
   
    try {
      setShowLoader(true);
      const data = formData;
      console.log(data);
      const response = await axios.post(applyAdmission, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (
        response.status === 201 ||
        response.status === 200 ||
        response.status === 203
      ) {
        console.log("ok");
        setshowsuccess(true);
        setcity("");
        setcourse("");
        setCountry("");
        setState("");
        setaddinfo("");
        setclasstype("Virtual");
        setcomputerlevel("");
        setcvnewname("");
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Error response:", error.response.data);
        console.log(error.response.data.error);
        seterrormsg(error.response.data.error);
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
      setShowLoader(false);
    }
  };

  return (
    <>
      {showsuccess && (
        <View  style={{ zIndex: 50, elevation: 50 }} className="absolute  flex justify-center items-center w-full h-full">
          <SuccessModal
            message={"Application Successful"}
            action={() => setshowsuccess(false)}
          />
        </View>
      )}
      {showLoader && (
        <View  style={{ zIndex: 50, elevation: 50 }} className="absolute w-full h-full">
          <Preloader />
        </View>
      )}
      {showopcity && (
        <View  style={{ zIndex: 50, elevation: 50 }} className="h-full w-full  absolute bg-red-100 opacity-70" />
      )}
      {showmodalcourse && (
        <View  style={{ zIndex: 50, elevation: 50 }} className="bottom-0 absolute">
          <Animated.View style={[animatedStyles]}>
            <DisplayModal
              data={data}
              close={(value) => handleclose(value)}
              getvaluefunction={(value) => handlegetvalue(value)}
            />
          </Animated.View>
        </View>
      )}
      {showmodalinput && (
        <View  style={{ zIndex: 50, elevation: 50 }} className="bottom-0 absolute">
          <Animated.View style={[animatedStylesinput]}>
            <InputModal
              close={(value) => handlecloseinput(value)}
              getvalue={(value) => getvalue(value)}
              senddata={addinfo}
            />
          </Animated.View>
        </View>
      )}
      <SafeAreaView
        style={[styles.andriod, styles.bgcolor]}
        className="flex flex-1 w-full"
      >
        <Header />
        <View className="flex-1">
          <View className="mt-3 px-5">
            <Text
              style={{ fontSize: 20, color: colorred }}
              className="font-semibold"
            >
              Apply for Course
            </Text>
            <Divider theme={{ colors: { primary: colorred } }} />
            <View className="items-center">
              <Text style={{ color: colorred }}>{errormsg}</Text>
            </View>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="px-5 mt-10">
              {course && (
                <View  style={{ zIndex: 50, elevation: 50 }} className="absolute left-8 -top-2 bg-white">
                  <Text>Select Courses</Text>
                </View>
              )}
              <TouchableOpacity
                onPress={handlecourses}
                className="h-12 rounded-2xl flex justify-center items-start px-3 border border-lightred bg-white"
              >
                <Text style={{ fontSize: 16 }} className="text-black">
                  {course ? (
                    course
                  ) : (
                    <Text>
                      <FontAwesome5
                        size={20}
                        color={colorred}
                        name="arrow-circle-down"
                      />{" "}
                      Select Courses
                    </Text>
                  )}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="px-5 mt-5">
              <Text style={{ fontSize: 16 }} className="text-black">
                {" "}
                Select Class Type{" "}
              </Text>
              <View className="w-full flex justify-center flex-row mt-1">
                <TouchableOpacity
                  onPress={hanleshowvirtual}
                  style={{
                    backgroundColor: showphysical ? colorwhite : lightred,
                  }}
                  className="h-12 w-44 flex justify-center items-center"
                >
                  <Text style={{ fontSize: 16 }}>Virtual</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={hanleshowphsical}
                  style={{
                    backgroundColor: showphysical ? lightred : colorwhite,
                  }}
                  className="h-12 w-44 flex justify-center border border-lightred items-center"
                >
                  <Text style={{ fontSize: 16 }}>Physical</Text>
                </TouchableOpacity>
              </View>
            </View>
            {showphysical && (
              <View>
                <View className="px-5 mt-5">
                  {country && (
                    <View  style={{ zIndex: 50, elevation: 50 }} className="absolute left-8 -top-2 bg-white">
                      <Text>Select Country</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    onPress={handlecountry}
                    className="h-12 rounded-2xl flex justify-center items-start px-3 border border-lightred bg-white"
                  >
                    <Text style={{ fontSize: 16 }} className="text-black">
                      {country ? (
                        country
                      ) : (
                        <Text>
                          <FontAwesome5
                            size={20}
                            color={colorred}
                            name="arrow-circle-down"
                          />{" "}
                          Select Country
                        </Text>
                      )}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="px-5 mt-5">
                  {state && (
                    <View  style={{ zIndex: 50, elevation: 50 }} className="absolute left-8 -top-2 bg-white">
                      <Text>Select State</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    onPress={handlestate}
                    className="h-12 rounded-2xl flex justify-center items-start px-3 border border-lightred bg-white"
                  >
                    <Text style={{ fontSize: 16 }} className="text-black">
                      {state ? (
                        state
                      ) : (
                        <Text>
                          <FontAwesome5
                            size={20}
                            color={colorred}
                            name="arrow-circle-down"
                          />{" "}
                          Select State
                        </Text>
                      )}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="px-5 mt-5">
                  {city && (
                    <View  style={{ zIndex: 50, elevation: 50 }} className="absolute left-8 -top-2 bg-white">
                      <Text>Select Study City</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    onPress={handlecity}
                    className="h-12 rounded-2xl flex justify-center items-start px-3 border border-lightred bg-white"
                  >
                    <Text style={{ fontSize: 16 }} className="text-black">
                      {city ? (
                        city
                      ) : (
                        <Text>
                          <FontAwesome5
                            size={20}
                            color={colorred}
                            name="arrow-circle-down"
                          />{" "}
                          Select Study City
                        </Text>
                      )}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            <View className="mt-3">
              <View className="px-7">
                <Text>{cvfilename} </Text>
              </View>
              <View className="px-5">
                <TouchableOpacity
                  onPress={getdocument}
                  style={{ backgroundColor: lightred }}
                  className="h-12 flex justify-center items-center w-full rounded-2xl mt-1"
                >
                  <Text>Upload Cv</Text>
                </TouchableOpacity>
                <Text className="text-center">CV (PDFs only) *optional</Text>
              </View>

              <View className="px-5 mt-5">
                {computerlevel && (
                  <View className="absolute z-50 left-8 -top-2 bg-white">
                    <Text>Select Computer Literacy</Text>
                  </View>
                )}
                <TouchableOpacity
                  onPress={handlecomputer}
                  className="h-12 rounded-2xl flex justify-center items-start px-3 border border-lightred bg-white"
                >
                  <Text style={{ fontSize: 16 }} className="text-black">
                    {computerlevel ? (
                      computerlevel
                    ) : (
                      <Text>
                        <FontAwesome5
                          size={20}
                          color={colorred}
                          name="arrow-circle-down"
                        />{" "}
                        Select Computer Literacy
                      </Text>
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="px-5 mt-3">
                {addinfo && (
                  <View>
                    <Text className="text-justify">{addinfo}</Text>
                  </View>
                )}
                <TouchableOpacity
                  onPress={handleaddinfo}
                  style={{ backgroundColor: lightred }}
                  className="h-12 flex justify-center items-center w-full rounded-2xl mt-1"
                >
                  <Text>
                    <FontAwesome5 name="plus" /> Additional info that could help
                    your admission
                  </Text>
                </TouchableOpacity>
              </View>

              {/* <TextInput
                        label="Additional info that could help your admission"
                        mode="outlined"
                        theme={{ colors: { primary: colorred } }}
                        className="w-3/4 mt-3 bg-slate-50"
                        textColor="#000000"
                        multiline
                        numberOfLines={4}
                        

                    /> */}
            </View>
            <View className="mt-3 px-5">
              <TouchableOpacity
                onPress={handlesubmit}
                style={{ backgroundColor: colorred }}
                className="h-12 flex justify-center items-center w-full rounded-2xl mt-1"
              >
                <Text
                  style={{ fontSize: 16 }}
                  className="text-white font-semibold"
                >
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
        <Footer currentPage="home" />
      </SafeAreaView>
    </>
  );
};
export default ApplyCourses;
