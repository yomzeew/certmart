import { View, Text, TouchableOpacity } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { latestNewsFn } from "../../utils/api";

const BannerDisplay = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [id, setId] = useState(null);

  const fetchBannerData = async () => {
    try {
      const response = await latestNewsFn(1);
      const first = Array.isArray(response?.data) ? response.data[0] : undefined;
      if (first) {
        setTitle(first.title || "");
        setDescription(first.description || "");
        setId(first.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBannerData();
  }, []);

  const maxLength = 100;
  const shortText =
    description?.length > maxLength
      ? description.slice(0, maxLength) + "..."
      : description;

  const handleReadMore = () => {
    navigation.navigate("newsdetail");
  };

  return (
    <View style={{ marginVertical: 12, borderRadius: 16, overflow: "hidden" }}>
      {/* Background Gradient */}
      <Svg height="140" width="100%">
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#ff416c" stopOpacity="1" />
            <Stop offset="1" stopColor="#ff4b2b" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="140" fill="url(#grad)" />
      </Svg>

      {/* Content Layer */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          padding: 20,
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
          {title || "🎓 Join CertMart, Africa's biggest learning platform"}
        </Text>

        {!!description && (
          <Text style={{ color: "white", fontSize: 12, marginTop: 8 }}>
            {shortText}
          </Text>
        )}

        {description?.length > maxLength && (
          <TouchableOpacity onPress={handleReadMore}>
            <Text
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "bold",
                marginTop: 4,
                textDecorationLine: "underline",
              }}
            >
              Read More
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default BannerDisplay;
