import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image
} from "react-native";
import { styles } from "../../../settings/layoutsetting";
import Header from "./header";
import { bluecolor } from "../../../constant/color";
import { Avatar, Divider } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { trainerByIdUrl } from "../../../settings/endpoint";
import { useCallback, useEffect, useState } from "react";
import { convertDate } from "../../../settings/dateformat";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import Preloader from "../../preloadermodal/preloaderwhite";
import { getFirstLetter } from "../../../utility/firstletter";


const TrainerProfile = () => {
  const route = useRoute();
  const { trainerid,trainerdp } = route.params;

  const [showloader, setshowloader] = useState(false);
  const [dp, setDp] = useState("");
  const [Surname, setSurname] = useState("");
  const [Firstname, setFirstname] = useState("");
  const [Middlename, setMiddlename] = useState("");
  const [Gender, setGender] = useState("");
  const [DateOfBirth, setDateOfBirth] = useState("");
  const [Phone, setPhone] = useState("");
  const [Email, setEmail] = useState("");

  // NEW: courses state
  const [courses, setCourses] = useState([]); // NEW

  const fetchdata = async () => {
    setshowloader(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const { data } = await axios.get(
        `${trainerByIdUrl}?trainerid=${trainerid}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDp(data.dp);
      setSurname(data.surname);
      setFirstname(getFirstLetter(data.firstname));
      setGender(data.gender);
      setDateOfBirth(convertDate(data.dob));
      setPhone(data.phone);
      setEmail(data.email);

      setCourses(data.availabilities ?? []); // NEW
    } catch (e) {
      console.log("Trainer fetch error:", e?.response ?? e);
    } finally {
      setshowloader(false);
    }
  };
 useEffect(()=>{
    fetchdata();
 },[trainerid,trainerdp])
 

  return (
    <>
       {showloader && (
<>
<View className="absolute z-50 elevation bg-white opacity-70"/>
        <View className="absolute z-50 w-full h-full elevation">
          <Preloader />
        </View>
        </>
      )}
    <SafeAreaView style={[styles.andriod, styles.bgcolor]} className="flex-1">
      <StatusBar style="auto" />
      <Header />
      <View className="px-5 mt-3">
        <Text className="text-2xl">Trainer's Profile</Text>
      </View>
      <View className="px-5 h-1/6 mt-3">
        <View
          className="h-full w-full rounded-2xl justify-center items-center"
          style={{ elevation: 4, backgroundColor: bluecolor }}
        >
          <Text className="text-white text-xl font-light">
            {Firstname}'s Profile
          </Text>
        </View>
        <View className="items-center -mt-10">
          {dp ? (
            <Avatar.Image
              size={96}
              source={{
                uri: `https://certmart.org/dps/${trainerdp}.jpg?ts=${Date.now()}`,
              }}
            />
          ) : (
            <Avatar.Image
              size={96}
              source={require("../../images/avatermale.png")}
            />
          )}
        </View>
      </View>
      <View className="flex-1 px-5 mt-16">
        <View className="flex-1 bg-slate-100 rounded-2xl px-4 py-3">
          <ScrollView showsVerticalScrollIndicator={false}>
            <SectionTitle title="Biodata" />
            <KeyValue left="Surname" right={Surname + Firstname+'.'} />
            <KeyValue left="Gender" right={Gender} />
            <Divider style={{ marginVertical: 12 }} />
            <SectionTitle title="Courses" />
            <CoursesCard courses={courses} /> {/* NEW */}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
    </>
  );
};

export default TrainerProfile;

const SectionTitle = ({ title }) => (
  <View className="mb-2">
    <Text className="font-bold text-lg">{title}</Text>
    <View className="border-b border-red-500 w-14 mt-1" />
  </View>
);

const KeyValue = ({ left, right }) => (
  <View className="flex-row justify-between mb-1">
    <Text className="text-slate-600">{left}:</Text>
    <Text className="text-slate-800">{right || "--"}</Text>
  </View>
);


const CoursesCard = ({ courses = [] }) => {
  // FlatList for better perf w/ many courses
  if (!courses.length) {
    return (
      <Text className="text-slate-500 italic">No courses found.</Text>
    );
  }

  return (
    <FlatList
      data={courses}
      keyExtractor={(_, idx) => idx.toString()}
      scrollEnabled={false} // inside ScrollView; let parent handle scroll
      renderItem={({ item }) => <CourseItem course={item} />}
      ItemSeparatorComponent={() => <Divider style={{ marginVertical: 10 }} />}
    />
  );
};
const MetaChip = ({ label }) => (
    <View className="border rounded-full px-2 py-0.5 border-slate-300 mr-1 mb-1">
      <Text className="text-xs text-slate-700">{label}</Text>
    </View>
  );

  const CourseItem = ({ course }) => {
    // Build banner URL if provided
    const bannerUri = course?.banner
      ? `https://certmart.org/${
          course.banner.startsWith('/') ? course.banner.slice(1) : course.banner
        }`
      : null;
  
    return (
      <View
        className="p-3 rounded-2xl"
        style={{ backgroundColor: 'white', elevation: 3 }}
      >
        {bannerUri && (
          <Image
            source={{ uri: bannerUri }}
            style={{
              width: '100%',
              height: 140,
              borderRadius: 12,
              marginBottom: 8,
            }}
            resizeMode="cover"
          />
        )}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="font-bold text-base">{course.course}</Text>
          <Text className="text-xs text-slate-500">{course.coursecode}</Text>
        </View>
        <View className="flex-row flex-wrap mb-2">
          <MetaChip label={course.classType} />
          <MetaChip label={`₦${Number(course.c_cost).toLocaleString()}`} />
          <MetaChip label={`${course.c_duration} wk`} />
          {course.days ? <MetaChip label={course.days.trim()} /> : <Text>{null}</Text>}
        </View>
        <Text numberOfLines={3} className="text-sm text-slate-600">
          {course.description}
        </Text>
      </View>
    );
  };
