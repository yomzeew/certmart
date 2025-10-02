import {
    View,
    SafeAreaView,
    Text,
    RefreshControl,
    TouchableOpacity,
    FlatList,
    ScrollView,
    ActivityIndicator
} from "react-native";
import Header from "./header";
import { styles } from "../../../settings/layoutsetting";
import CoursesVerifyModal from "../../modals/courseverifyModal";
import Preloader from "../../preloadermodal/preloaderwhite";
import { Divider } from "react-native-paper";
import { colorred } from "../../../constant/color";
import { useState, useEffect, useCallback } from "react";
import { fetchCourseStatus } from "../../../utils/api";
import { FontAwesome5 } from "@expo/vector-icons";

const ApplicationCheckers = () => {
    const [coursesData, setCoursesData] = useState([]);
    const [showLoader, setShowLoader] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            setShowLoader(true);
            const response = await fetchCourseStatus();
            console.log(response,'responsejjjjj')
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

    const renderItem = ({ item }) => <ApplicationCard item={item} />;

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
                        ItemSeparatorComponent={() => (
                            <View style={{ height: 12 }} />
                        )}
                        ListEmptyComponent={() => (
                            <View style={{ alignItems: "center", marginTop: 40, paddingHorizontal: 20 }}>
                                <FontAwesome5 name="clipboard-list" size={48} color="#ccc" />
                                <Text
                                    style={{
                                        color: colorred,
                                        fontSize: 16,
                                        fontWeight: "600",
                                        marginTop: 16,
                                        textAlign: "center"
                                    }}
                                >
                                    No Applications Found
                                </Text>
                                <Text
                                    style={{
                                        color: "#666",
                                        fontSize: 14,
                                        marginTop: 8,
                                        textAlign: "center"
                                    }}
                                >
                                    Your course applications will appear here
                                </Text>
                            </View>
                        )}
                        contentContainerStyle={{ padding: 16 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[colorred]}
                            />
                        }
                        showsVerticalScrollIndicator={false}
                    />
                </SafeAreaView>
            </View>
        </>
    );
};

const ApplicationCard = ({ item }) => {
    // Get status color
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return '#10b981'; // green
            case 'applied':
            case 'pending':
                return '#f59e0b'; // yellow
            case 'declined':
            case 'rejected':
                return '#ef4444'; // red
            default:
                return '#6b7280'; // gray
        }
    };

    // Get class type icon
    const getClassTypeIcon = (classType) => {
        return classType?.toLowerCase() === 'virtual' ? 'laptop' : 'users';
    };

    // Format location
    const formatLocation = (item) => {
        if (item.centre === 'Virtual') {
            return 'Virtual';
        }
        return `${item.state || ''}, ${item.country || ''}`.replace(/^,|,$/g, '');
    };

    return (
        <View className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden">
            {/* Header */}
            <View className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-800 mb-1">
                            {item.course}
                        </Text>
                        <Text className="text-sm text-gray-600">
                            ID: {item.courseid}
                        </Text>
                    </View>
                    <View
                        className="px-3 py-1 rounded-full"
                        style={{ backgroundColor: getStatusColor(item.status) + '20' }}
                    >
                        <Text
                            className="text-xs font-semibold"
                            style={{ color: getStatusColor(item.status) }}
                        >
                            {item.status?.toUpperCase()}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Application Details */}
            <View className="px-4 py-3">
                <View className="flex-row items-center mb-3">
                    <FontAwesome5 name="file-alt" size={14} color="#6b7280" />
                    <Text className="text-sm font-semibold text-gray-700 ml-2">Application Details</Text>
                </View>

                <View className="space-y-2">
                    <View className="flex-row items-center">
                        <FontAwesome5 name="map-marker-alt" size={12} color="#6b7280" />
                        <Text className="text-sm text-gray-600 ml-2">
                            Location: {formatLocation(item)}
                        </Text>
                    </View>

                    <View className="flex-row items-center">
                        <FontAwesome5 name={getClassTypeIcon(item.classType)} size={12} color="#6b7280" />
                        <Text className="text-sm text-gray-600 ml-2">
                            Class Type: {item.classType}
                        </Text>
                    </View>

                    <View className="flex-row items-center">
                        <FontAwesome5 name="id-card" size={12} color="#6b7280" />
                        <Text className="text-sm text-gray-600 ml-2">
                            CV: {item.cv}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Comment Section */}
            {item.comment && item.comment !== 'Nil' && (
                <View className="px-4 py-2 bg-blue-50">
                    <View className="flex-row items-start">
                        <FontAwesome5 name="comment" size={12} color="#3b82f6" />
                        <Text className="text-sm text-gray-700 ml-2 flex-1">
                            {item.comment}
                        </Text>
                    </View>
                </View>
            )}

            {/* Decision Comment */}
            {item.decisioncomment && item.decisioncomment !== 'add decision comment' && (
                <View className="px-4 py-2 bg-green-50">
                    <View className="flex-row items-start">
                        <FontAwesome5 name="check-circle" size={12} color="#10b981" />
                        <Text className="text-sm font-medium text-green-800 ml-2 flex-1">
                            Decision: {item.decisioncomment}
                        </Text>
                    </View>
                </View>
            )}

            {/* Footer */}
            <View className="bg-gray-50 px-4 py-3 flex-row justify-between items-center">
                <View className="flex-row items-center">
                    <FontAwesome5 name="user" size={12} color="#6b7280" />
                    <Text className="text-xs text-gray-600 ml-1">
                        Student ID: {item.studentid}
                    </Text>
                </View>
                <View className="flex-row items-center">
                    <FontAwesome5 name="eye" size={12} color="#3b82f6" />
                    <Text className="text-xs text-blue-600 ml-1 font-medium">View Details</Text>
                </View>
            </View>
        </View>
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
