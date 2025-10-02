import { View, Text, FlatList, TouchableOpacity,SafeAreaView } from "react-native";
import Header from "./header";
import { Divider } from "react-native-paper";
import { colorred } from "../../../constant/color";
import { useCallback, useEffect, useState } from "react";
import { fetchStudentClasses } from "../../../utils/api";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../../../settings/layoutsetting";
import { ScrollView } from "react-native-gesture-handler";

const Classes = () => {
    const [data, setData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");

    const navigation = useNavigation();

    const fetchData = useCallback(async () => {
        try {
            const combinedData = await fetchStudentClasses();
            setData(combinedData);
            console.log(combinedData, 'combinedData')
            setErrorMsg("");
        } catch (error) {
            setErrorMsg(error.message);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    const handleShowDetails = (item) => {
        navigation.navigate("classDetails", { item });
        setSelectedItem(item);

    };

    return (
        <SafeAreaView style={[styles.andriod, styles.bgcolor, { flex: 1 }]}>
           
                <Header />
                <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
                    <Text style={{ fontSize: 20, color: colorred, fontWeight: '600' }}>
                        Available Classes
                    </Text>
                    <Divider theme={{ colors: { primary: colorred } }} />
                </View>
                <ScrollView 
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ paddingHorizontal: 12, paddingBottom: 80 }}>
                    {Array.isArray(data) && data.length > 0 ? (
                        data.map((item, index) => {
                            if (!item || typeof item !== 'object') {
                                return (
                                    <View key={`invalid-${index}`} style={{ padding: 16 }}>
                                        <Text>Invalid class data</Text>
                                    </View>
                                );
                            }
                            return (
                                <View key={index}>
                                    <ClassCard
                                        item={item}
                                        index={index}
                                        onPress={() => handleShowDetails(item)}
                                    />
                                    {index < data.length - 1 && <View style={{ height: 8 }} />}
                                </View>
                            );
                        })
                    ) : (
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: 64,
                        }}>
                            <FontAwesome name="book" size={48} color="#D1D5DB" />
                            <Text style={{
                                fontSize: 18,
                                color: '#6B7280',
                                marginTop: 16,
                                textAlign: 'center'
                            }}>
                                No Classes Available
                            </Text>
                            <Text style={{
                                fontSize: 14,
                                color: '#9CA3AF',
                                marginTop: 4,
                                textAlign: 'center'
                            }}>
                                Your enrolled classes will appear here
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );

};

const ClassCard = ({ item, index, onPress }) => {
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    };

    const getStatusColor = () => {
        const startDate = new Date(item.startdate);
        const today = new Date();
        const diffTime = startDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return '#10B981'; // Started - green
        if (diffDays <= 7) return '#F59E0B'; // Starting soon - yellow
        return '#3B82F6'; // Upcoming - blue
    };

    const getStatusText = () => {
        const startDate = new Date(item.startdate);
        const today = new Date();
        const diffTime = startDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'In Progress';
        if (diffDays === 0) return 'Starts Today';
        if (diffDays === 1) return 'Starts Tomorrow';
        if (diffDays <= 7) return `Starts in ${diffDays} days`;
        return 'Upcoming';
    };

    const getDaysCount = () => {
        if (!item.days || typeof item.days !== 'string') return 0;
        return item.days.split(' ').filter(day => day.trim()).length;
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.95}
            style={{
                backgroundColor: 'white',
                borderRadius: 12,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: '#E5E7EB',
                elevation: 2, // Android shadow
            }}
        >
            {/* Header */}
            <View style={{ backgroundColor: '#F9FAFB', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 }}>
                            {item.course || 'No Course Name'}
                        </Text>
                        <Text style={{ fontSize: 14, color: '#6B7280' }}>
                            Event ID: #{item.eventId || 'N/A'}
                        </Text>
                    </View>
                    <View
                        style={{
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                            borderRadius: 20,
                            backgroundColor: getStatusColor() + '20'
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 12,
                                fontWeight: '600',
                                color: getStatusColor()
                            }}
                        >
                            {getStatusText()}
                        </Text>
                    </View>
                </View>
            </View>
    
            {/* Course Details */}
            <View style={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <FontAwesome name="book" size={14} color="#6B7280" />
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginLeft: 8 }}>Course Details</Text>
                </View>
    
                <View style={{ gap: 8 }}>
                    {/* Duration and Days */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <FontAwesome name="clock-o" size={12} color="#6B7280" />
                            <Text style={{ fontSize: 14, color: '#6B7280', marginLeft: 8 }}>
                                {item.duration || 0} weeks • {getDaysCount()} days/week
                            </Text>
                        </View>
                        <Text style={{ fontSize: 14, fontWeight: '500', color: '#1F2937' }}>
                            {formatDate(item.startdate)}
                        </Text>
                    </View>
    
                    {/* Location */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome name="map-marker" size={12} color="#6B7280" />
                        <Text style={{ fontSize: 14, color: '#6B7280', marginLeft: 8 }}>
                            {item.city === 'Virtual' ? '🖥️ Virtual Class' : `${item.city || ''}, ${item.state || ''}`}
                        </Text>
                    </View>
    
                    {/* Training Days */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome name="calendar" size={12} color="#6B7280" />
                        <Text style={{ fontSize: 14, color: '#6B7280', marginLeft: 8 }}>
                            {(item.days || '').replace(/\s+/g, ' • ')}
                        </Text>
                    </View>
                </View>
            </View>
    
            {/* Trainer Info */}
            <View style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#EFF6FF' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <FontAwesome name="user" size={12} color="#3B82F6" />
                        <Text style={{ fontSize: 14, fontWeight: '500', color: '#1D4ED8', marginLeft: 8 }}>
                            {(item.trainerSurname || '')} {(item.trainerFirstname || '')}
                        </Text>
                    </View>
                    <Text style={{ fontSize: 12, color: '#3B82F6' }}>
                        ID: {item.trainerId || 'N/A'}
                    </Text>
                </View>
            </View>
    
            {/* Footer */}
            <View style={{ backgroundColor: '#F9FAFB', paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: '#6B7280' }}>
                        Class #{index + 1}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FontAwesome name="arrow-right" size={12} color="#3B82F6" />
                    <Text style={{ fontSize: 12, color: '#3B82F6', marginLeft: 4, fontWeight: '500' }}>View Details</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
    
    
};



export default Classes;
