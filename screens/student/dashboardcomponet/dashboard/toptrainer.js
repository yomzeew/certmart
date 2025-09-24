import { View, Text, TouchableOpacity } from "react-native";
import { Avatar } from "react-native-paper";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { shuffleArray } from "../../../../utility/randomizefunction";
import { fetchTopTrainers } from "../../../../utils/api";

const TopTrainer = () => {
    const [showPreloader, setShowPreloader] = useState(false);
    const [data, setData] = useState([]);
    const navigation = useNavigation();

    const fetchData = async () => {
        try {
            setShowPreloader(true);
            const trainers = await fetchTopTrainers(); // Use the fetchTopTrainers function
            setData(trainers);
        } catch (error) {
            console.error("Error fetching top trainers:", error.message);
        } finally {
            setShowPreloader(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTrainerProfile = (trainerId, trainerDp) => {
        navigation.navigate("trainerProfileScreen", { trainerid: trainerId, trainerdp: trainerDp });
    };

    return (
        <View className="flex flex-row">
            {shuffleArray([...data]).map((item, index) => (
                <TouchableOpacity
                    onPress={() => handleTrainerProfile(item.trainerid, item.dp)}
                    className="items-center m-1"
                    key={index}
                >
                    {item.dp ? (
                        <Avatar.Image
                            source={{
                                uri: `https://certmart.org/dps/${item.dp}.jpg?timestamp=${new Date().getTime()}`,
                            }}
                        />
                    ) : (
                        <Avatar.Image source={require("../../../images/avatermale.png")} />
                    )}
                    <Text className="font-semibold">{item.surname}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default TopTrainer;