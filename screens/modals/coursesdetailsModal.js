import { View, TouchableOpacity, Text } from "react-native";
import { FontAwesome, FontAwesome5, AntDesign } from "@expo/vector-icons";
import { Avatar } from "react-native-paper";

export const CourseDetailsModal = ({ content, setshowcontent, showcontent }) => {
    const handleshow = () => {
        setshowcontent(!showcontent);
    };

    return (
        <>
        <View  style={{ zIndex: 50, elevation: 50 }} className="h-full w-full  absolute bg-red-100 opacity-70" />
        <View  style={{ zIndex: 50, elevation: 50 }} className="h-[70vh] bottom-0 justify-center bg-red-200 rounded-2xl w-full absolute  flex items-center py-3">
            
            {/* Close Button */}
            <View className="absolute right-5 top-10">
                <TouchableOpacity onPress={handleshow}>
                    <AntDesign name="upcircle" size={30} color="red" />
                </TouchableOpacity>
            </View>

            <View className="items-start">
                {/* Avatar and Rating */}
                <View className="flex-row items-center">
                    <View className="items-center">
                        {content.dp ? (
                            <Avatar.Image source={{ uri: `https://certmart.org/dps/${content.dp}.jpg?timestamp=${new Date().getTime()}` }} />
                        ) : (
                            <Avatar.Image source={require('../images/avatermale.png')} />
                        )}

                        <View className="ml-2 flex-row items-center">
                            <Text className="mr-1">{content.avg_rating}</Text>
                            <FontAwesome name="star" size={14} color="orange" />
                        </View>
                    </View>

                    <View className="w-2" />

                    {/* Instructor Details */}
                    <View>
                        <View className="flex-row items-center mt-2">
                            <FontAwesome5 name="user" size={16} />
                            <Text className="text-xs ml-2">
                                {content.firstname} {content.surname}
                            </Text>
                        </View>

                        <View className="mt-2">
                            <Text>{content.classType}</Text>
                            <Text>Duration: {content.duration} weeks</Text>
                        </View>

                        <View className="mt-2">
                            <Text>{content.days}</Text>
                            <Text>Time: {content.starttime} - {content.endtime} {content.timezone}</Text>
                        </View>
                    </View>
                </View>

                {/* Divider */}
                <View className="w-[75vw] border border-red-200 my-3" />

                {/* Description */}
                <View>
                    <Text className="font-semibold">Description:</Text>
                </View>

                <View className="bg-white px-3 py-3 rounded-2xl w-5/6">
                    <Text>{content.description}</Text>
                </View>

                {/* Course Outline Button */}
                <View className="mt-4">
                    <TouchableOpacity className="h-10 px-5 bg-red-500  justify-center rounded-2xl">
                        <Text className="text-white">Download Course Outline</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        </>
      
    );
};
