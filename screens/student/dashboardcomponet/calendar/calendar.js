import { Text, View } from "react-native"
import Footer from "../footer";

const Calendar = () => {
    return (
        <>
            <View className="flex">
                <Text className="mt-32">Calendar</Text>
                <Footer currentPage="calendar" />
            </View>
        </>
    )
}
export default Calendar;