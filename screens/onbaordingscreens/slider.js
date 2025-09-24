import React, { useState } from "react";
import { SafeAreaView, Text, View, Dimensions,TouchableOpacity } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { colorred } from "../../constant/color";
import { StatusBar } from "expo-status-bar";
import Sliderone from "./sliderone";
import Slidertwo from "./slidertwo";
import Sliderthree from "./sliderthree";

const Slider = ({navigation}) => {
  const [count, setCount] = useState(1);
  const { height } = Dimensions.get('window');
  const { width } = Dimensions.get('window');

  const showComponent = () => {
    if (count === 1) {
      return <Sliderthree />;
    } else if (count === 2) {
      return <Slidertwo />;
    } 
       
  };

  const handleNext = () => {
    if (count < 2) {
      setCount((prevCount) => prevCount + 1);
    }
    else{
      navigation.navigate("welcome", { platform: "Student" });
    }
    
  };

  const handlePrev = () => {
   
    if (count > 1) {
      setCount((prevCount) => prevCount - 1);
    }
    else{
      navigation.goBack();

    }
  };

  const getPositionClass = () => {
    // if (count === 1) {
    //   return 'justify-start';
    // } else if (count === 2) {
    //   return 'justify-center';
    // } else {
    //   return 'justify-end';
    // }
        if (count === 1) {
      return 'justify-start';
    } 
 

  };

  return (
    <SafeAreaView className="flex-1 flex justify-center">
      <StatusBar style="auto" />
      <View className="flex-1">
       {showComponent()}
      </View>

      <View className="items-center h-1/6">
        <View className="items-center justify-center flex flex-row">
          <TouchableOpacity onPress={handlePrev}>
            <FontAwesome name="arrow-circle-left" size={30} color={colorred} />
          </TouchableOpacity>
          <View className="w-32" />
          <TouchableOpacity onPress={handleNext}>
            <FontAwesome name="arrow-circle-right" size={30} color={colorred} />
          </TouchableOpacity>
        </View>
        {/* <View className={`h-2 ${getPositionClass()} flex flex-row bg-slate-300 rounded-2xl w-1/2 mt-5`}>
          <View className="w-1/3 bg-slate-400 h-2 rounded-2xl" />
        </View> */}
      </View>
    </SafeAreaView>
  );
};

export default Slider;
