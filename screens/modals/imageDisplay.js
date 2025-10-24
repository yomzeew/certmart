import { View, Image, TouchableOpacity, Text } from "react-native";
import { useState, useEffect } from "react";
import { latestNewsFn } from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colorred } from "../../constant/color";

const ImageDisplay = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [duration] = useState(24*7); // hours

  const BANNER_KEY = "lastBannerDisplayTime";

  // 🕐 Helper: check if 24 hours have passed
  const canShowBanner = async () => {
    try {
      const lastShown = await AsyncStorage.getItem(BANNER_KEY);
      if (!lastShown) return true;

      const lastTime = new Date(lastShown).getTime();
      const now = Date.now();
      const hoursPassed = (now - lastTime) / (1000 * 60 * 60);
      return hoursPassed >= duration; // true if 24+ hours passed
    } catch (error) {
      console.log("Error checking banner time:", error);
      return true;
    }
  };

  const fetchBannerData = async () => {
    try {
      const response = await latestNewsFn(1);
      const first = Array.isArray(response?.data) ? response.data[0] : undefined;

      if (first?.icon) {
        const imageUrl = `https://certmart.org/news/${first.icon}.${first.filextension}`;
        console.log("🖼 Banner image:", imageUrl);
        setImageUrl(imageUrl);
      }
    } catch (error) {
      console.log("❌ Error fetching banner:", error);
    }
  };

  const showBannerIfAllowed = async () => {
    const allowed = await canShowBanner();
    if (allowed) {
      setShowBanner(true);
      await AsyncStorage.setItem(BANNER_KEY, new Date().toISOString());
      console.log("📅 Banner shown and timestamp saved");
    } else {
      console.log("⏳ Banner suppressed (within 7days)");
    }
  };

  useEffect(() => {
    (async () => {
      await fetchBannerData();
      await showBannerIfAllowed();
    })();
  }, []);

  const dismissBanner = () => setShowBanner(false);

  return (
    <>
      {showBanner && !!imageUrl && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
            elevation: 20,
          }}
          pointerEvents="auto"
        >
          <TouchableOpacity
            onPress={dismissBanner}
            style={{
              position: "absolute",
              top: 40,
              right: 20,
              backgroundColor: "rgba(0,0,0,0.6)",
              borderRadius: 16,
              paddingVertical: 6,
              paddingHorizontal: 10,
            }}
            accessibilityRole="button"
            accessibilityLabel="Close banner"
          >
            <Text style={{ color: "#fff", fontSize: 16 }}>✕</Text>
          </TouchableOpacity>

          <View
            style={{
              width: "80%",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <Image
              source={{ uri: imageUrl }}
              style={{ width: "100%", height: 300 }}
              resizeMode="contain"
              onError={() => setShowBanner(false)}
            />
            <View className="w-full items-center mt-3">
              <TouchableOpacity
            onPress={dismissBanner}
            style={{
              backgroundColor: colorred,
              borderRadius: 12,
              paddingVertical: 6,
              paddingHorizontal: 10,
            }}
            accessibilityRole="button"
            accessibilityLabel="Close banner"
          >
            <Text style={{ color: "#fff", fontSize: 16 }}>close</Text>
          </TouchableOpacity>

            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default ImageDisplay;
