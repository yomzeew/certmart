import { colorred, grey } from '../../../../constant/color';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";

const DiscountedCourses = ({ data, onSeeAll }) => {
    const navigation = useNavigation();

    const handleNavigateToCourse = (course) => {
        navigation.navigate('discountedCoursesList', { filterCourse: course.courses });
    };

    const handleSeeAll = () => {
        navigation.navigate('discountedCoursesList');
    };

    // Get unique courses by course code
    const uniqueCourses = data.filter(
        (item, index, self) =>
            index === self.findIndex((c) => c.courses === item.courses)
    );

    return (
        <View className="flex flex-row flex-wrap mt-3">
            <TouchableOpacity 
                onPress={handleSeeAll} 
                style={{ backgroundColor: grey }} 
                className="flex-shrink rounded-xl h-8 flex flex-row justify-center items-center px-4 mb-2"
            >
                <Text style={{ fontSize: 12 }} className="font-semibold">All</Text>
            </TouchableOpacity>
            {uniqueCourses.slice(0, 5).map((item, index) => (
                <TouchableOpacity 
                    onPress={() => handleNavigateToCourse(item)} 
                    key={index} 
                    style={{ backgroundColor: colorred }} 
                    className="flex-shrink rounded-xl h-8 flex flex-row justify-center items-center ml-2 px-4 mb-2"
                >
                    <Text style={{ fontSize: 12 }} className="font-semibold text-white">{item.course}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default DiscountedCourses;


