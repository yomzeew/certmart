import React from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { colorred, colorwhite } from "../../constant/color";
import studentTerms from "../../settings/termsforstudent";

const TermsModal = ({ visible, onAgree, onCancel }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-lg p-5 w-11/12 max-h-[80%]">
          <ScrollView className="mb-4">
            <Text className="text-xl font-bold mb-3">Terms and Conditions for Students</Text>
            <Text className="text-gray-600 leading-6">
           {studentTerms}
            </Text>
          </ScrollView>

          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={onCancel}
              className="flex-1 mr-2 py-3 rounded-lg"
              style={{ backgroundColor: "#ccc" }}
            >
              <Text className="text-center text-black font-semibold">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onAgree}
              className="flex-1 ml-2 py-3 rounded-lg"
              style={{ backgroundColor: colorred }}
            >
              <Text className="text-center text-white font-semibold">Agree</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TermsModal;
