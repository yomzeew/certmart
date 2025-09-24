import {
    View,
    SafeAreaView,
    Text,
    RefreshControl,
    TouchableOpacity,
    FlatList,
} from "react-native";
import Header from "./header";
import { styles } from "../../../settings/layoutsetting";
import CoursesVerifyModal from "../../modals/courseverifyModal";
import Preloader from "../../preloadermodal/preloaderwhite";
import { Divider } from "react-native-paper";
import { colorred } from "../../../constant/color";
import { useState, useEffect, useCallback } from "react";
import { fetchCourseStatus } from "../../../utils/api";

const ApplicationCheckers = () => {
    const [coursesData, setCoursesData] = useState([]);
    const [showLoader, setShowLoader] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            setShowLoader(true);
            const response = await fetchCourseStatus();
            setData(response);
            setCoursesData(response); // Default to all
        } catch (error) {
            console.error("Error fetching data:", error.message);
        } finally {
            setShowLoader(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData().finally(() => setRefreshing(false));
    }, [fetchData]);

    const handleData = useCallback(
        (status = "") => {
            if (data.length > 0) {
                const filteredData = status
                    ? data.filter((item) => item.status === status)
                    : data;
                setCoursesData(filteredData);
            }
        },
        [data]
    );

    const renderItem = ({ item }) => <CoursesVerifyModal data={item} />;

    return (
        <>
            {showLoader && (
                <View
                    style={{
                        position: "absolute",
                        zIndex: 50,
                        height: "100%",
                        width: "100%",
                    }}
                >
                    <Preloader />
                </View>
            )}
            <View className="h-full w-full" style={{ flex: 1 }}>
                <SafeAreaView style={[styles.andriod, styles.bgcolor]}>
                    <Header />

                    {/* Title */}
                    <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
                        <Text
                            style={{
                                fontSize: 20,
                                color: colorred,
                                fontWeight: "bold",
                            }}
                        >
                            Course Verification
                        </Text>
                        <Divider theme={{ colors: { primary: colorred } }} />
                    </View>

                    {/* Filter Buttons */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                            marginVertical: 12,
                        }}
                    >
                        <FilterButton
                            label="All"
                            color="gray"
                            onPress={() => handleData("")}
                        />
                        <FilterButton
                            label="Pending"
                            color="orange"
                            onPress={() => handleData("Applied")}
                        />
                        <FilterButton
                            label="Approved"
                            color="green"
                            onPress={() => handleData("Approved")}
                        />
                        <FilterButton
                            label="Declined"
                            color="red"
                            onPress={() => handleData("Declined")}
                        />
                    </View>

                    {/* FlatList */}
                    <FlatList
                        data={coursesData}
                        keyExtractor={(_, idx) => idx.toString()}
                        renderItem={renderItem}
                        numColumns={2} // show two per row like a grid
                        columnWrapperStyle={{
                            justifyContent: "space-between",
                        }}
                        ItemSeparatorComponent={() => (
                            <Divider style={{ marginVertical: 8 }} />
                        )}
                        ListEmptyComponent={() => (
                            <View style={{ alignItems: "center", marginTop: 40 }}>
                                <Text
                                    style={{
                                        color: colorred,
                                        fontSize: 16,
                                        fontWeight: "600",
                                    }}
                                >
                                    There are no courses available
                                </Text>
                            </View>
                        )}
                        contentContainerStyle={{ padding: 12 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[colorred]}
                            />
                        }
                    />
                </SafeAreaView>
            </View>
        </>
    );
};

const FilterButton = ({ label, color, onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
                style={{
                    backgroundColor: color,
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                }}
            />
            <Text style={{ fontSize: 16, marginLeft: 6 }}>{label}</Text>
        </View>
    </TouchableOpacity>
);

export default ApplicationCheckers;
