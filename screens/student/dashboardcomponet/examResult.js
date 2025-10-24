import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useMemo } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, Share, Linking } from "react-native";
import { Divider } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import Header from "./header";
import { styles } from "../../../settings/layoutsetting";
import { colorred } from "../../../constant/color";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString.replace(" ", "T"));
    return date.toLocaleString();
  } catch (e) {
    return dateString;
  }
};

const Pill = ({ color, label }) => (
  <View style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, backgroundColor: color + "20" }}>
    <Text style={{ fontSize: 12, fontWeight: "600", color }}>{label}</Text>
  </View>
);

const StatRow = ({ icon, label, value }) => (
  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
    <FontAwesome name={icon} size={12} color="#6B7280" />
    <Text style={{ fontSize: 14, color: "#6B7280", marginLeft: 8 }}>{label}: </Text>
    <Text style={{ fontSize: 14, color: "#374151", fontWeight: "600" }}>{value}</Text>
  </View>
);

const ExamResult = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const item = route.params?.item || {};
  console.log(item,'Exam Result details')
  const passScoreRequired = Number(item?.pass_score ?? 0);
  const scorePoint = Number(item?.exam?.pass_score_point ?? 0);
  const scorePerc = Number(item?.exam?.pass_score_perc ?? 0);

  const resultMeta = useMemo(() => {
    const passed = scorePoint >= passScoreRequired;
    return passed
      ? { color: "#10B981", icon: "check", label: "Passed" }
      : { color: "#EF4444", icon: "close", label: "Failed" };
  }, [passScoreRequired, scorePoint]);

  const onShare = async () => {
    try {
      await Share.share({
        message: `Exam Result - ${item?.course}\nScore: ${scorePoint} (${scorePerc}%)\nRequired: ${passScoreRequired}%\nDate: ${formatDate(item?.exam?.finish_date || item?.exam?.added_date)}`,
      });
    } catch {}
  };
  const handlegoback = () => {
    navigation.navigate("exam");
  };
  const openUrl = async (url) => {
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch {}
  };

  return (
    <SafeAreaView style={[styles.andriod, styles.bgcolor, { flex: 1 }]}>
        <View className="w-full pt-[20px] ">
                    <View className=" w-full flex-row gap-x-2 items-center">
                        <TouchableOpacity
                            onPress={handlegoback}
                            className={`p-3 rounded-2xl item-center`}
                        >
                            <FontAwesome name="arrow-left" size={12} color={colorred} />
                            
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontWeight: '600',color:colorred }}>Exam Result</Text>
                    </View>
                     <Divider style={{marginVertical:10,backgroundColor:colorred}}/>
                    </View>

      <View style={{ flex: 1, paddingHorizontal: 12, paddingBottom: 24 }}>
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <View style={{ backgroundColor: "#F9FAFB", paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#E5E7EB" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold", color: "#1F2937", marginBottom: 4 }}>
                  {item?.course || "No Course Name"}
                </Text>
                <Text style={{ fontSize: 14, color: "#6B7280" }}>Reg ID: #{item?.registrationid || "N/A"}</Text>
                <Text style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>Course Code: {item?.coursecode || "-"}</Text>
              </View>
              <Pill color={resultMeta.color} label={resultMeta.label} />
            </View>
          </View>

          {/* Body */}
          <View style={{ padding: 16 }}>
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#1F2937", marginBottom: 8 }}>Result Summary</Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                <View
                  style={{
                    height: 64,
                    width: 64,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: resultMeta.color + "20",
                    marginRight: 12,
                  }}
                >
                  <FontAwesome name={resultMeta.icon} size={24} color={resultMeta.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 28, fontWeight: "800", color: "#111827" }}>{scorePerc}%</Text>
                  <Text style={{ fontSize: 12, color: "#6B7280" }}>You {resultMeta.label.toLowerCase()} this exam</Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flex: 1, marginRight: 8, padding: 12, backgroundColor: "#F3F4F6", borderRadius: 12 }}>
                  <Text style={{ fontSize: 12, color: "#6B7280" }}>Your Score</Text>
                  <Text style={{ fontSize: 18, fontWeight: "700", color: "#1F2937" }}>{scorePoint}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 8, padding: 12, backgroundColor: "#F3F4F6", borderRadius: 12 }}>
                  <Text style={{ fontSize: 12, color: "#6B7280" }}>Pass Mark</Text>
                  <Text style={{ fontSize: 18, fontWeight: "700", color: "#1F2937" }}>{passScoreRequired}%</Text>
                </View>
              </View>
            </View>

            <View style={{ marginTop: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#1F2937", marginBottom: 8 }}>Exam Details</Text>
              <StatRow icon="calendar" label="Started" value={formatDate(item?.exam?.added_date)} />
              <StatRow icon="calendar-check-o" label="Finished" value={formatDate(item?.exam?.finish_date)} />
              <StatRow icon="id-badge" label="Student ID" value={item?.studentid || "-"} />
              <StatRow icon="envelope" label="Email" value={item?.email || "-"} />
            </View>
          </View>

          {/* Footer Actions */}
          <View style={{ backgroundColor: "#F9FAFB", paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome name="trophy" size={14} color={resultMeta.color} />
              <Text style={{ marginLeft: 6, fontSize: 12, color: "#6B7280" }}>Result for {item?.coursecode}</Text>
            </View>
           
          </View>
           <View style={{ flexDirection: "row", alignItems: "center",justifyContent:"center",marginVertical:10}}>
              <TouchableOpacity
                onPress={() => openUrl(item?.exam?.result_url)}
                style={{ backgroundColor: "#2563EB", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}
              >
                <Text style={{ color: "white", fontSize: 10, fontWeight: "600" }}>View Result</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => openUrl(item?.exam?.cert_url)}
                style={{ backgroundColor: "#059669", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginLeft: 8 }}
              >
                <Text style={{ color: "white", fontSize: 10, fontWeight: "600" }}>Certificate</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onShare}
                style={{ backgroundColor: "#3B82F6", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginLeft: 8 }}
              >
                <Text style={{ color: "white", fontSize: 10, fontWeight: "600" }}>Share Result</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ backgroundColor: colorred, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginLeft: 8 }}
              >
                <Text style={{ color: "white", fontSize: 10, fontWeight: "600" }}>Back</Text>
              </TouchableOpacity>
            </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ExamResult;