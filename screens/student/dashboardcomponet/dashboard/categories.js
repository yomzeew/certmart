import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { colorred } from "../../../../constant/color";
import { fetchCategories } from "../../../../utils/api"; // Import the fetchCategories function

const Categories = ({ handlecallbackvalue, showModal, setshowModal, handleactionseeall }) => {
    const [categorydata, setcategorydata] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");

    const fetchdata = async () => {
        try {
            const categories = await fetchCategories(); // Use the fetchCategories function
            setcategorydata(categories);
        } catch (error) {
            setErrorMsg(error.message);
            console.error("Error fetching categories:", error.message);
        }
    };

    useEffect(() => {
        fetchdata();
    }, []);

    const handlepickvalue = (value) => {
        handlecallbackvalue(value);
    };

    const handleshowmodal = () => {
        handleactionseeall();
        setshowModal(!showModal);
    };

    return (
        <View className="px-3 mt-3">
            <View className="flex justify-between flex-row items-center">
                <Text style={{ fontSize: 16 }} className="font-semibold">
                    Categories
                </Text>
                <TouchableOpacity onPress={handleshowmodal}>
                    <Text style={{ color: colorred, fontSize: 14 }} className="font-semibold">
                        See all
                    </Text>
                </TouchableOpacity>
            </View>
            <View className="w-full mt-3">
                {errorMsg ? (
                    <Text style={{ color: colorred }} className="text-center">
                        {errorMsg}
                    </Text>
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        horizontal
                    >
                        {categorydata.map((item, index) => {
                            if (item !== "") {
                                return (
                                    <View key={index} className="p-3">
                                        <TouchableOpacity
                                            onPress={() => handlepickvalue(item)}
                                            style={{ elevation: 5 }}
                                            className="h-28 w-28 items-center rounded-2xl flex justify-center bg-white shadow-sm shadow-slate-500"
                                        >
                                            {item === "ACAD" && (
                                                <Ionicons name="school" size={40} color={colorred} />
                                            )}
                                            {item === "TECH" && (
                                                <FontAwesome5 name="cogs" size={40} color={colorred} />
                                            )}
                                            {item === "VOC" && (
                                                <MaterialIcons
                                                    name="engineering"
                                                    size={40}
                                                    color={colorred}
                                                />
                                            )}
                                            {item === "OTHER" && (
                                                <Text className="text-sm font-bold">Other</Text>
                                            )}
                                            <View className="items-center w-full">
                                                {item === "ACAD" && (
                                                    <Text
                                                        style={{ fontSize: 16 }}
                                                        className="text-black font-semibold text-center"
                                                    >
                                                        Academy
                                                    </Text>
                                                )}
                                                {item === "TECH" && (
                                                    <Text
                                                        style={{ fontSize: 16 }}
                                                        className="text-black font-semibold text-center"
                                                    >
                                                        Tech
                                                    </Text>
                                                )}
                                                {item === "VOC" && (
                                                    <Text
                                                        style={{ fontSize: 16 }}
                                                        className="text-black font-semibold text-center"
                                                    >
                                                        Vocational
                                                    </Text>
                                                )}
                                                {item === "OTHER" && (
                                                    <Text
                                                        style={{ fontSize: 16 }}
                                                        className="text-black font-semibold text-center"
                                                    >
                                                        Other
                                                    </Text>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                );
                            }
                        })}
                    </ScrollView>
                )}
            </View>
        </View>
    );
};

export default Categories;