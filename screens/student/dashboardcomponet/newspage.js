import {
    View,
    SafeAreaView,
    Text,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Image,
    Modal,
  } from "react-native";
  import Header from "./header";
  import { styles } from "../../../settings/layoutsetting";
  import Preloader from "../../preloadermodal/preloaderwhite";
  import { Divider } from "react-native-paper";
  import { colorred, lightred } from "../../../constant/color";
  import { useState, useCallback, useEffect } from "react";
  import { FontAwesome5 } from "@expo/vector-icons";
  import { useNavigation } from "@react-navigation/native";
  import { latestNewsFn } from "../../../utils/api";
  
  const LatestNews = () => {
    const navigation = useNavigation();
    const [showLoader, setShowLoader] = useState(false);
    const [newsData, setNewsData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);
  
    const fetchNews = useCallback(async () => {
      try {
        setShowLoader(true);
        const responsetwo = await latestNewsFn();
        if (responsetwo?.status && Array.isArray(responsetwo.data)) {
          setNewsData(responsetwo.data);
        } else {
          setNewsData([]);
        }
      } catch (error) {
        console.error("Error fetching news:", error.message);
      } finally {
        setShowLoader(false);
      }
    }, []);
  
    useEffect(() => {
      fetchNews();
    }, []);
  
    const onRefresh = useCallback(() => {
      setRefreshing(true);
      fetchNews().finally(() => setRefreshing(false));
    }, [fetchNews]);
  
    const openModal = (item) => {
      setSelectedNews(item);
      setModalVisible(true);
    };
  
    const closeModal = () => {
      setModalVisible(false);
      setSelectedNews(null);
    };
  
    return (
      <>
        {showLoader && (
          <View style={{ zIndex: 50, elevation: 50 }} className="absolute h-full w-full">
            <Preloader />
          </View>
        )}
  
        <View className="w-full h-full justify-center items-center">
          <SafeAreaView
            style={[styles.andriod, styles.bgcolor]}
            className="flex flex-1 w-full"
          >
            <Header />
            <View className="px-5">
              <Text style={{ fontSize: 20, color: colorred }} className="font-semibold">
                Latest News
              </Text>
              <Divider theme={{ colors: { primary: colorred } }} />
            </View>
  
            <ScrollView
              style={{ marginTop: 16, paddingHorizontal: 12 }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[colorred]}
                />
              }
              className="mt-10 px-3"
            >
              {newsData.length > 0 ? (
                newsData.map((item, index) => (
                  <NewsCard key={item.id || index} item={item} openModal={openModal} />
                ))
              ) : (
                <View className="items-center justify-center py-16">
                  <FontAwesome5 name="newspaper" size={48} color="#ccc" />
                  <Text className="text-gray-500 text-lg mt-4 text-center">No News Yet</Text>
                  <Text className="text-gray-400 text-sm mt-1 text-center">
                    Latest updates will appear here
                  </Text>
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
        </View>
  
        {/* ✅ Modal for Full News */}
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.6)",
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 16,
                padding: 20,
                width: "100%",
                maxHeight: "80%",
              }}
            >
              <ScrollView>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: colorred,
                    marginBottom: 10,
                  }}
                >
                  {selectedNews?.title}
                </Text>
                {selectedNews?.icon && (
                  <Image
                    source={{
                      uri: `https://certmart.org/news/${selectedNews.icon}.${selectedNews.filextension}`,
                    }}
                    style={{ width: "100%", height: 180, borderRadius: 10, marginBottom: 10 }}
                    resizeMode="cover"
                  />
                )}
                <Text style={{ color: "#555", lineHeight: 22 }}>
                  {selectedNews?.description}
                </Text>
              </ScrollView>
  
              <TouchableOpacity
                onPress={closeModal}
                style={{
                  backgroundColor: lightred,
                  paddingVertical: 10,
                  borderRadius: 8,
                  marginTop: 15,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: colorred, fontWeight: "600" }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </>
    );
  };
  
  const NewsCard = ({ item, openModal }) => {
    const shortDescription =
      item.description?.length > 100
        ? item.description.substring(0, 100) + "..."
        : item.description;
  
    return (
      <View
        className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden"
        style={{ elevation: 1 }}
      >
        <View className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex-row justify-between items-center">
          <Text numberOfLines={2} className="text-lg font-bold flex-1 text-gray-800 mr-2">
            {item.title}
          </Text>
          <FontAwesome5 name="calendar-alt" size={14} color={colorred} />
        </View>
  
        <View className="px-4 py-3">
          <Text className="text-sm text-gray-500 mb-3">{item.date}</Text>
          <Text className="text-gray-700 leading-6 mb-4">{shortDescription}</Text>
  
          {item.icon && (
            <Image
              source={{
                uri: `https://certmart.org/news/${item.icon}.${item.filextension}`,
              }}
              className="w-full h-40 rounded-lg"
              resizeMode="cover"
            />
          )}
        </View>
  
        <View className="bg-gray-50 px-4 py-3 flex-row justify-end items-center border-t border-gray-200">
          <TouchableOpacity
            onPress={() => openModal(item)}
            style={{
              backgroundColor: lightred,
              paddingVertical: 6,
              paddingHorizontal: 14,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: colorred, fontWeight: "600" }}>Read More</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  export default LatestNews;
  