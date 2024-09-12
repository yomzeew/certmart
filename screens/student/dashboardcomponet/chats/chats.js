import { Text, View } from "react-native"
import Footer from "../footer";

const Chats = () => {
    return (
        <>
            <View className="flex">
                <Text className="mt-32">Chats</Text>
                <Footer currentPage="chats" />
            </View>
        </>
    )
}
export default Chats;