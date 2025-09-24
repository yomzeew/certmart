import { StatusBar } from "expo-status-bar";
import { SafeAreaView, View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { styles } from "../../../settings/layoutsetting";
import Header from "./header";
import { bluecolor } from "../../../constant/color";
import { Avatar, Divider } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import Preloader from "../../preloadermodal/preloaderwhite";
import PaymentScreenModal from "./dashboard/paymentScreen";
import { fetchTrainerProfile } from "../../../utils/api";
import { convertDate } from "../../../settings/dateformat";
import { getFirstLetter } from "../../../utility/firstletter";

const TrainerProfile = () => {
    const route = useRoute();
    const { trainerid, trainerdp } = route.params;

    const [showPayment, setShowPayment] = useState(false);
    const [selected, setSelected] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    const [trainerData, setTrainerData] = useState({});
    const [courses, setCourses] = useState([]);

    const fetchData = async () => {
        try {
            setShowLoader(true);
            const data = await fetchTrainerProfile(trainerid);
            setTrainerData({
                dp: data.dp,
                surname: data.surname,
                firstname: getFirstLetter(data.firstname),
                fullName: data.firstname,
                gender: data.gender,
                dob: convertDate(data.dob),
                phone: data.phone,
                email: data.email,
            });
            setCourses(data.availabilities ?? []);
        } catch (error) {
            console.error("Trainer fetch error:", error.message);
        } finally {
            setShowLoader(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [trainerid]);

    return (
        <>
            {showPayment && (
                <PaymentScreenModal
                    selected={selected}
                    setshowpayment={setShowPayment}
                    setShowLoader={setShowLoader}
                    setshowsuccess={setShowSuccess}
                />
            )}
            {showLoader && (
                <>
                    <View className="absolute z-50 elevation bg-white opacity-70" />
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
                        style={{ backgroundColor: bluecolor }}
                    >
                        <Text className="text-white text-xl font-light">
                            {trainerData.surname} {trainerData.firstname}'s Profile
                        </Text>
                    </View>
                    <View className="w-full justify-center items-center">
                        <View style={{ elevation: 4 }} className="absolute elevation z-50">
                            {trainerdp ? (
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
                </View>
                <View className="flex-1 px-5 mt-3">
                    <View className="flex-1 bg-slate-100 rounded-2xl px-4 py-3">
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <SectionTitle title="Biodata" />
                            <KeyValue left="Fullname" right={`${trainerData.surname} ${trainerData.firstname}`} />
                            <KeyValue left="Gender" right={trainerData.gender} />
                            <Divider style={{ marginVertical: 12 }} />
                            <SectionTitle title="Courses" />
                            <CoursesCard courses={courses} />
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
    if (!courses.length) {
        return <Text className="text-slate-500 italic">No courses found.</Text>;
    }

    return (
        <FlatList
            data={courses}
            keyExtractor={(_, idx) => idx.toString()}
            scrollEnabled={false}
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
    const bannerUri = course?.banner
        ? `https://certmart.org/${course.banner.startsWith("/") ? course.banner.slice(1) : course.banner}`
        : null;

    return (
        <View className="p-3 rounded-2xl" style={{ backgroundColor: "white", elevation: 3 }}>
            {bannerUri && (
                <Image
                    source={{ uri: bannerUri }}
                    style={{
                        width: "100%",
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
                {course.days ? <MetaChip label={course.days.trim()} /> : null}
            </View>
            <Text className="text-sm text-slate-600">{course.details || course.description}</Text>
        </View>
    );
};

