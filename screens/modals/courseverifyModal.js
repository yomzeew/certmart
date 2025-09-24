import { View, Text, TouchableOpacity } from "react-native";
import { colorred } from "../../constant/color";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

const CoursesVerifyModal = ({ data }) => {
  console.log(data, "dataModal")

  return (
    <>
      <View className="w-44 h-auto rounded-2xl border-2 border-red-500 p-3 bg-slate-50 flex justify-center items-center m-2">
        <View  style={{ zIndex: 50, elevation: 50 }} className="absolute -right-2 -top-3 bg-white rounded-full">
          {data.status === "Applied" && <MaterialIcons name="pending" size={24} color="orange" />}
          {data.status === "Approved" && <FontAwesome name="check-circle" size={30} color="green" />}
          {data.status === "Declined" && <FontAwesome name="warning" size={24} color="red" />}
        </View>
        <View>
          <View className="items-center">
            <Text
              style={{ fontSize: 16 }}
              className="text-center font-semibold"
            >
              {data.course}
            </Text>
          </View>
          <View
            className="items-center py-2 rounded-2xl mt-3"
            style={{
              backgroundColor: data.status === "Applied" ? 'orange' : data.status === "Approved" ? "green" : "red",
            }}
          >
            <Text className="text-white">{data.status}</Text>
          </View>
          <View className="items-center mt-3">
            <Text
              style={{ fontSize: 16, color: colorred }}
              className="font-semibold"
            >
              {data.classType}
            </Text>
          </View>
          
        </View>
      </View>
    </>
  );
};
export default CoursesVerifyModal;
