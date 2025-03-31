import { View, Text, TouchableOpacity } from "react-native";
import { colorred } from "../../constant/color";


const CourseCard = ({ data }) => {

  return (
    <>
      <View className="w-44 h-auto rounded-2xl border-2 border-red-500 p-3 bg-slate-50 flex justify-center items-center m-2">
        <View>
          <View className="items-center">
            <Text
              style={{ fontSize: 16 }}
              className="text-center font-semibold"
            >
              {data.course}
            </Text>
          </View>
          <View className="items-center mt-3">
            <Text
              style={{ fontSize: 16, color: colorred }}
              className="font-semibold"
            >
              {data.classType}
            </Text>
          </View>
          <View className="mt-3">
            <View>
              <Text>{data.tsurname} {data.tfirstname}</Text>
            </View>
            <View>
              <Text>{data.amount}</Text>
            </View>
          </View>
          <View className="mt-3">
            <TouchableOpacity
              style={{ backgroundColor: colorred }}
              className="py-2  rounded-2xl  px-3 flex justify-center items-center"
            >
              <Text className="text-white">Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};
export default CourseCard;
