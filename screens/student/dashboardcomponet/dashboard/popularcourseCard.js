import { View, Text,  TouchableOpacity, Image,FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";

const MetaChip = ({ label }) => (
  <View className="border rounded-full px-2 py-0.5 border-slate-300 mr-1 mb-1">
    <Text className="text-xs text-slate-700">{label}</Text>
  </View>
);

const CourseItem = ({
    course,
  }) => {
    const navigation = useNavigation();
    const bannerUri = course?.icon
      ? `https://certmart.org/icon/${course.icon}.jpeg`
      : null;
  

    const handlenavigate=(course)=>{
        navigation.navigate('coursesdetail',{course:course})
    }   
      
   
  
    return (
      <TouchableOpacity onPress={()=>handlenavigate(course.coursecode)} className="w-[48%] p-3 rounded-2xl mb-3" style={{ backgroundColor: "white", elevation: 3 }}>
        {bannerUri && (
          <Image
            source={{ uri: bannerUri }}
            style={{ width: "100%", height: 140, borderRadius: 12, marginBottom: 8 }}
            resizeMode="cover"
          />
        )}
  
        <View className="flex-row justify-between items-center mb-2">
          <Text className="font-bold text-base w-[80%] text-xs">{course.course}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  


  
  const PopularCoursesCard = ({ data }) => {
    // group into chunks of 2
    const chunkedData = [];
    for (let i = 0; i < data.length; i += 2) {
      chunkedData.push(data.slice(i, i + 2));
    }
  
    return (
      <FlatList
        data={chunkedData}
        horizontal
        pagingEnabled
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={{ width: 400, flexDirection: "row", justifyContent: "space-between" }}>
            {item.map((course, idx) => (
              <CourseItem
                key={course.id || idx}
                course={course}
              />
            ))}
          </View>
        )}
      />
    );
  };
  
  export default PopularCoursesCard;
  
