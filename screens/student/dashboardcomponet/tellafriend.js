import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Share,
  ScrollView,
  SafeAreaView
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Ionicons,FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import showToast from "../../../utils/showToast";
import { Divider } from "react-native-paper";
import { styles } from "../../../settings/layoutsetting";
import { colorred } from "../../../constant/color";

const TellAFriendScreen = () => {
  const navigation = useNavigation();
  const referralCode = "https://www.certmart.org";

  const shareMessage = `📚 Download the Student App and visit certmart.org\nUse my code: ${referralCode}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: shareMessage,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(shareMessage);
    showToast("success","Copy","Copied to clipboard!")
    
  };

  const handlegoback = () => {
    navigation.goBack();
  }

  return (

<SafeAreaView style={[styles.andriod,styles.bgcolor, { flex: 1, width: '100%'}]}>
          <View className="w-full pt-[20px] ">
                    <View className=" w-full flex-row gap-x-2 items-center">
                        <TouchableOpacity
                            onPress={handlegoback}
                            className={`p-3 rounded-2xl item-center`}
                        >
                            <FontAwesome name="arrow-left" size={12} color={colorred} />
                            
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontWeight: '600',color:colorred }}>Tell a Friend</Text>
                    </View>
                     <Divider style={{marginVertical:10,backgroundColor:colorred}}/>
                    </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Card */}
        <View className="bg-white rounded-2xl p-6 shadow-lg flex-1">
          <View className="items-center mb-5">
            <Ionicons name="mail-open-outline" size={50} color={colorred} />
            <Text className="text-xl font-bold text-gray-800 mt-3">
              Share the love
            </Text>
            <Text className="text-center text-gray-600 mt-2">
              Invite your friends to download the{" "}
              <Text className="font-semibold">Student App</Text> and visit{" "}
              <Text className="font-semibold">certmart.org</Text>. Both of you
              get rewarded!
            </Text>
          </View>

          {/* Referral Code */}
          <View className="flex-row items-center justify-between border border-gray-300 rounded-lg p-3 mb-6">
            <Text className="text-lg font-bold text-red-700">
              {referralCode}
            </Text>
            <TouchableOpacity
              onPress={handleCopy}
              style={{backgroundColor:colorred}}
              className="px-3 py-1.5 rounded-md"
            >
              <Text className="text-white font-semibold">Copy</Text>
            </TouchableOpacity>
          </View>

          {/* Share Options */}
          <Text className="text-center text-gray-700 mb-3">
            Share to your friends using:
          </Text>

          <View className="flex-row flex-wrap justify-center gap-5">
            {[
              { name: "logo-facebook", color: "#1877F2", label: "Facebook" },
              { name: "logo-twitter", color: "#1DA1F2", label: "Twitter" },
              { name: "logo-whatsapp", color: "#25D366", label: "WhatsApp" },
              { name: "mail", color: "#9333ea", label: "Email" },
            ].map((item, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={handleShare}
                className="items-center"
              >
                <View
                  className="w-14 h-14 rounded-full items-center justify-center"
                  style={{ backgroundColor: item.color }}
                >
                  <Ionicons name={item.name} size={28} color="#fff" />
                </View>
                <Text className="text-sm mt-1 text-gray-600">{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TellAFriendScreen;
