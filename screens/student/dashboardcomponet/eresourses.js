import { useSelector } from "react-redux";
import { getEresource } from "./fetchdata";
import { useEffect, useState, useCallback } from "react";
import { styles } from "../../../settings/layoutsetting";
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    Modal,
    ScrollView,
    Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Header from "./header";
import { colorred, colorwhite } from "../../../constant/color";
import { Divider } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { downloadFile } from "../../../utility/downloadfunction";
import CustomTextInput from "../../../components/CustomTextInput";
import showToast from "../../../utils/showToast";

const Eresources = () => {
    const [preloader, setPreloader] = useState(false);
    const [data, setData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const user = useSelector((state) => state.activePage.user);
    const studentId = user?.studentid;

    const handleData = useCallback(async () => {
        try {
            setPreloader(true);
            const resdata = await getEresource(studentId);
            setData(resdata || []);
            console.log(resdata,'resdata')
        } catch (err) {
            console.error("Error fetching resources:", err.message);
        } finally {
            setPreloader(false);
        }
    }, [studentId]);

    useEffect(() => {
        if (studentId) {
            handleData();
        }
    }, [handleData, studentId]);

    const onRefresh = () => {
        setRefreshing(true);
        handleData().finally(() => setRefreshing(false));
    };

    const handleResourcePress = (resource) => {
        setSelectedResource(resource);
        setShowModal(true);
    };

    const handleDownload = (resource) => {
         if(!resource.courselink){
                   showToast("error", "E-Resources not available", "E-Resources not available contact the Trainer👌")
                    return
                }
        const fileUrl = `https://certmart.org/${resource.courselink}`;
        const fileName = `${resource.title.replace(/\s+/g, "_")}.pdf`;
        downloadFile(fileUrl, fileName);
    };

    const renderItem = ({ item }) => (
        <EresourcesCard item={item} onPress={() => handleResourcePress(item)} />
    );

    return (
        <SafeAreaView
            style={[styles.andriod, styles.bgcolor]}
            className="flex flex-1 w-full"
        >
            <StatusBar style="auto" />
            <Header />

            {/* Title */}
            <View className="px-5 mt-2">
                <Text
                    style={{ fontSize: 24, color: colorred }}
                    className="font-bold"
                >
                    📚 E-Resources
                </Text>
                <Text className="text-gray-600 text-sm mt-1">
                    Access your course materials and study guides
                </Text>
                <Divider theme={{ colors: { primary: colorred } }} />
            </View>

            {/* List */}
            <FlatList
                data={data}
                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 16, flexGrow: 1 }}
                ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                ListEmptyComponent={() => (
                    <View className="flex-1 justify-center items-center mt-10">
                        <FontAwesome name="file-text-o" size={48} color="#ccc" />
                        <Text style={{ color: colorred, fontSize: 16 }} className="mt-4">
                            No Resources Found
                        </Text>
                        <Text className="text-gray-500 text-sm mt-2 text-center">
                            Your course resources will appear here once available
                        </Text>
                    </View>
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colorred]}
                        tintColor={colorred}
                    />
                }
            />

            {/* Resource Detail Modal */}
            {selectedResource && (
                <ResourceModal
                    resource={selectedResource}
                    visible={showModal}
                    onClose={() => setShowModal(false)}
                    onDownload={() => handleDownload(selectedResource)}
                />
            )}
        </SafeAreaView>
    );
};

export default Eresources;

const EresourcesCard = ({ item, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
        >
            <View className="flex-row justify-between items-start">
                <View className="flex-1 mr-3">
                    <View className="flex-row items-center mb-2">
                        <View className="w-2 h-2 bg-red-500 rounded-full mr-2"></View>
                        <Text className="text-xs font-medium text-gray-500 uppercase">
                            {item.course}
                        </Text>
                    </View>

                    <Text className="text-lg font-bold text-gray-800 mb-1">
                        {item.title}
                    </Text>

                    <Text className="text-sm text-gray-600 mb-2">
                        {item.coursename}
                    </Text>

                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <FontAwesome name="user" size={12} color="#666" />
                            <Text className="text-xs text-gray-500 ml-1">
                                {item.trainer}
                            </Text>
                        </View>

                        <View className="flex-row items-center">
                            <FontAwesome name="calendar" size={12} color="#666" />
                            <Text className="text-xs text-gray-500 ml-1">
                                {new Date(item.uploaddate).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                </View>

                <View className="items-center">
                    <View className="w-12 h-12 bg-red-50 rounded-full items-center justify-center mb-2">
                        <FontAwesome name="file-pdf-o" size={20} color={colorred} />
                    </View>
                    <Text className="text-xs text-gray-500">PDF</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const ResourceModal = ({ resource, visible, onClose, onDownload }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} className="justify-end">
                <View className="bg-white rounded-t-3xl p-6 max-h-4/5">
                    <View className="items-center mb-4">
                        <View className="w-12 h-1 bg-gray-300 rounded-full"></View>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View className="items-center mb-6">
                            <View className="w-20 h-20 bg-red-50 rounded-2xl items-center justify-center mb-4">
                                <FontAwesome name="file-pdf-o" size={40} color={colorred} />
                            </View>

                            <Text className="text-xl font-bold text-gray-800 text-center mb-2">
                                {resource.title}
                            </Text>

                            <Text className="text-gray-600 text-center">
                                {resource.coursename}
                            </Text>
                        </View>

                        <View className="bg-gray-50 rounded-xl p-4 mb-6">
                            <View className="flex-row justify-between items-center mb-3">
                                <Text className="text-sm font-medium text-gray-700">Course Code:</Text>
                                <Text className="text-sm text-gray-800 font-bold">{resource.course}</Text>
                            </View>

                            <View className="flex-row justify-between items-center mb-3">
                                <Text className="text-sm font-medium text-gray-700">Trainer:</Text>
                                <Text className="text-sm text-gray-800">{resource.trainer}</Text>
                            </View>

                            <View className="flex-row justify-between items-center mb-3">
                                <Text className="text-sm font-medium text-gray-700">File Type:</Text>
                                <View className="flex-row items-center">
                                    <FontAwesome name="file-pdf-o" size={14} color={colorred} />
                                    <Text className="text-sm text-gray-800 ml-1">PDF Document</Text>
                                </View>
                            </View>

                            <View className="flex-row justify-between items-center">
                                <Text className="text-sm font-medium text-gray-700">Upload Date:</Text>
                                <Text className="text-sm text-gray-800">
                                    {new Date(resource.uploaddate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row space-x-3">
                            <TouchableOpacity
                                onPress={onClose}
                                className="flex-1 py-3 bg-gray-200 rounded-xl items-center"
                            >
                                <Text className="text-gray-700 font-medium">Close</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    onDownload();
                                    onClose();
                                }}
                                className="flex-1 py-3 bg-red-500 rounded-xl items-center flex-row justify-center"
                            >
                                <FontAwesome name="download" size={16} color={colorwhite} />
                                <Text className="text-white font-medium ml-2">Download</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};
