import { Alert, Text, TouchableOpacity, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { colorred } from "../../constant/color";
import { useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import Preloader from "../preloadermodal/preloaderwhite";
import { useNavigation } from "@react-navigation/native";
import { sumbitForgotPassword } from "../../utils/api";
import showToast from "../../utils/showToast";

const ForgotPasswordEmailModal = ({ close }) => {
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPreloader, setShowPreloader] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    try {
      setShowPreloader(true);
      setErrorMsg("");

      if (!email) {
        setErrorMsg("Enter Email");
        return;
      }

      const response = await sumbitForgotPassword(email);

      // ✅ response is already clean
      showToast("success", "Success", response.message || "Password reset email sent!");
      close(false);
    } catch (error) {
      showToast("error", "Error", "Failed to send password reset email");
    } finally {
      setShowPreloader(false);
    }
  };

  const handleClose = () => {
    close(false);
  };

  return (
    <View className="h-full w-full justify-center flex items-center">
      {/* Background Overlay */}
      <View
        onStartShouldSetResponder={() => true}
        onResponderRelease={handleClose}
        className="h-full absolute bottom-0 w-full px-2 py-3 opacity-80 bg-red-100 border border-slate-400 rounded-xl shadow-lg"
      ></View>

      {/* Modal Content */}
      <View
        style={{ elevation: 6 }}
        className="w-4/5 relative h-1/3 bg-white shadow-md shadow-slate-400 rounded-2xl flex justify-center items-center"
      >
        {/* Preloader */}
        {showPreloader && (
          <View className="absolute z-50 h-full w-full flex justify-center items-center rounded-2xl">
            <Preloader />
          </View>
        )}

        {/* Close Button */}
        <View className="absolute z-40 right-2 top-2">
          <TouchableOpacity onPress={handleClose}>
            <FontAwesome5 name="times" size={24} color={colorred} />
          </TouchableOpacity>
        </View>

        {/* Form Content */}
        <View className="w-full px-5">
          {/* Error Message */}
          {errorMsg ? (
            <View className="items-center">
              <Text className="text-sm text-red-500">{errorMsg}</Text>
            </View>
          ) : null}

          {/* Email Input */}
          <View className="mt-3">
            <TextInput
              label="Email"
              mode="outlined"
              theme={{ colors: { primary: colorred } }}
              onChangeText={(text) => setEmail(text)}
              value={email}
              className="w-full mt-3"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Submit Button */}
          <View className="mt-3">
            <Button
              icon="login"
              mode="contained"
              onPress={handleSubmit}
              theme={{ colors: { primary: colorred } }}
              className="h-12 w-full flex justify-center"
              textColor="#ffffff"
            >
              Submit
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ForgotPasswordEmailModal;
