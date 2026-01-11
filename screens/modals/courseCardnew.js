import { View, Text, Image, TouchableOpacity,Linking,Alert } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

const MetaChip = ({ label }) => (
  <View className="border rounded-full px-2 py-0.5 border-slate-300 mr-1 mb-1">
    <Text className="text-xs text-slate-700">{label}</Text>
  </View>
);

export const CourseItem = ({ course, showpayment, setshowpayment, setSelected  }) => {
  console.log(course,'course')
  const [isExpanded, setIsExpanded] = useState(false);
  const navigation = useNavigation();

  const handleTrainerProfile = () => {
    if (course?.trainerid) {
      navigation.navigate("trainerProfileScreen", { 
        trainerid: course.trainerid, 
        trainerdp: course.trainerdp?.replace(/^dps\//, '').replace(/\.jpg$/i, '') 
      });
    }
  };

  const bannerUri = course?.banner
  ? `https://certmart.org/${course.banner.startsWith("/") ? course.banner.slice(1) : course.banner}`
  : null;

const trainerAvatarUri = course?.trainerdp
  ? `https://certmart.org/${course.trainerdp.startsWith("/") ? course.trainerdp.slice(1) : course.trainerdp}`
  : null;

const costValue = Number(course?.price || course?.price || 0);

const courseOutline = `${course.courseoutline}` || null

// ✅ Download/View course outline
const handledownloadCourseOutline = async () => {
  console.log('Downloading course outline from:', courseOutline);
  
  if (courseOutline) {
    const supported = await Linking.canOpenURL(courseOutline);
    if (supported) {
      await Linking.openURL(courseOutline);
    } else {
      Alert.alert("Not available", "No course outline available.");
    }
  } else {
    Alert.alert("Not available", "No course outline available.");
  }
};

// Word count function
const getWordCount = (text) => {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

// Truncate text to 50 words
const truncateText = (text, maxWords) => {
  if (!text) return '';
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
};

const detailsText = course?.details || '';
const wordCount = getWordCount(detailsText);
const shouldShowReadMore = wordCount > 50;

const cleanImagePath = (path) => {
  if (typeof path !== 'string') return '';
  return path.replace(/^dps\//, '').replace(/\.jpg$/i, '');
}

 

  return (
    <View className="p-3 rounded-2xl mb-3" style={{ backgroundColor: "white", elevation: 3 }}>
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

      <View className="flex-row justify-between items-center mb-2">
        <Text className="font-bold text-base w-[80%]">{course.course}</Text>
        <Text className="text-xs text-slate-500">{"#CM"+course.id}</Text>
      </View>

      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center">
        {trainerAvatarUri && (
          <TouchableOpacity onPress={handleTrainerProfile}>
            <View>
              <Image
                source={{ uri: trainerAvatarUri }}
                className="w-8 h-8 rounded-full mr-2"
                resizeMode="cover"
              />
              {course.verified === 1 && (
                <View style={{ position: 'absolute', bottom: -2, right: 4, backgroundColor: '#3B82F6', borderRadius: 8, padding: 2 }}>
                  <Text style={{ fontSize: 8, color: 'white' }}>✓</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
        <Text className="text-sm font-semibold">{course.tsurname?.trim()}</Text>

        </View>
        {
        <TouchableOpacity onPress={handledownloadCourseOutline}>
         <MetaChip label={"Course Outline"}/>
          </TouchableOpacity>}
      </View>

      <View className="flex-row flex-wrap mb-2">
        <MetaChip label={course.classType} />
        <MetaChip label={`₦${costValue.toLocaleString()}`} />
        <MetaChip label={`${course.c_duration || course.duration} wk`} />
        {course.days ? <MetaChip label={course.days.trim()} /> : null}
      </View>
     <View className="mb-2">
      <Text className="text-sm text-slate-600 mb-2">
        {shouldShowReadMore && !isExpanded
          ? truncateText(detailsText, 50)
          : detailsText}
      </Text>
      {shouldShowReadMore && (
        <TouchableOpacity
          onPress={() => setIsExpanded(!isExpanded)}
          className="self-start"
        >
          <Text className="text-xs text-blue-500 font-semibold">
            {isExpanded ? 'Read Less' : 'Read More'}
          </Text>
        </TouchableOpacity>
      )}
     </View>

      <TouchableOpacity
        onPress={() => {
          setshowpayment(true);
          setSelected({ ...course, dp:cleanImagePath(course.trainerdp) })
        }}
        className="bg-red-500 rounded-xl px-4 py-2 self-start"
      >
        <Text className="text-white font-semibold text-sm">Register</Text>
      </TouchableOpacity>
    </View>
  );
};
