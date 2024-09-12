import { Text, View } from "react-native"
import Footer from "../footer";

const Profile = () => {
    return (
        <>
            <View className="flex">
                <Text className="mt-32">Profile</Text>
                <Footer currentPage="profile" />
            </View>
        </>
    )
}
export default Profile;