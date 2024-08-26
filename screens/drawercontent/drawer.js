import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Avatar, Divider } from 'react-native-paper';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { colorred, colorwhite, lightred } from '../../constant/color';
import { styles } from '../../settings/layoutsetting';

const CustomDrawer = (props) => {
  const [active, setActive] = useState('home');
  const navigation = useNavigation();

  const handlePress = (route, itemName) => {
    setActive(itemName);
    navigation.navigate(route);
  };

  const getItemStyle = (itemName) => {
    return active === itemName ? { backgroundColor: colorred } : { backgroundColor: lightred };
  };

  const getItemTextColor = (itemName) => {
    return active === itemName ? colorwhite : 'black';
  };

  const getItemIconColor = (itemName) => {
    return active === itemName ? colorwhite : colorred;
  };

  return (
    <SafeAreaView style={styles.andriod} className="flex flex-1 w-full">
      <View style={{ backgroundColor: colorred }} className="flex justify-center flex-row items-center h-32">
        <Avatar.Image size={50} source={require('../images/avaterfemale.png')} theme={{ colors: { primary: colorwhite } }} />
        <View className="w-2" />
        <Text style={{ fontSize: 18 }} className="font-light text-white">Welcome Alex C.</Text>
      </View>
      <View className="flex-1 mt-3 px-6">
        <TouchableOpacity onPress={() => handlePress('dashboardstudent', 'home')} style={[getItemStyle('home'), styles.item]} className="rounded-2xl h-10 flex px-3 flex-row items-center">
          <FontAwesome5 size={20} color={getItemIconColor('home')} name="home" />
          <View className="w-2" />
          <Text style={{ fontSize: 16, color: getItemTextColor('home') }} className="text-white">Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress('studentprofile', 'studentProfile')} style={[getItemStyle('studentProfile'), styles.item]} className="rounded-2xl h-10 flex px-3 flex-row items-center mt-3">
          <FontAwesome5 size={20} color={getItemIconColor('studentProfile')} name="user" />
          <View className="w-2" />
          <Text style={{ fontSize: 16, color: getItemTextColor('studentProfile') }} className="text-black">Student Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress('applycourses', 'applyForCourse')}  style={[getItemStyle('applyForCourse'), styles.item]} className="rounded-2xl h-10 flex px-3 flex-row items-center mt-3">
          <FontAwesome size={20} color={getItemIconColor('applyForCourse')} name="pencil" />
          <View className="w-2" />
          <Text style={{ fontSize: 16, color: getItemTextColor('applyForCourse') }} className="text-black">Apply for Course</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[getItemStyle('checkApplicationStatus'), styles.item]} className="rounded-2xl h-10 flex px-3 flex-row items-center mt-3">
          <FontAwesome5 size={20} color={getItemIconColor('checkApplicationStatus')} name="eye" />
          <View className="w-2" />
          <Text style={{ fontSize: 16, color: getItemTextColor('checkApplicationStatus') }} className="text-black">Check Application Status</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[getItemStyle('registration'), styles.item]} className="rounded-2xl h-10 flex px-3 flex-row items-center mt-3">
          <FontAwesome5 size={20} color={getItemIconColor('registration')} name="book" />
          <View className="w-2" />
          <Text style={{ fontSize: 16, color: getItemTextColor('registration') }} className="text-black">Registration</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[getItemStyle('classes'), styles.item]} className="rounded-2xl h-10 flex px-3 flex-row items-center mt-3">
          <FontAwesome5 size={20} color={getItemIconColor('classes')} name="home" />
          <View className="w-2" />
          <Text style={{ fontSize: 16, color: getItemTextColor('classes') }} className="text-black">Classes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[getItemStyle('eResources'), styles.item]} className="rounded-2xl h-10 flex px-3 flex-row items-center mt-3">
          <FontAwesome5 size={20} color={getItemIconColor('eResources')} name="file" />
          <View className="w-2" />
          <Text style={{ fontSize: 16, color: getItemTextColor('eResources') }} className="text-black">E-Resources</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[getItemStyle('certificates'), styles.item]} className="rounded-2xl h-10 flex px-3 flex-row items-center mt-3">
          <FontAwesome5 size={20} color={getItemIconColor('certificates')} name="comment" />
          <View className="w-2" />
          <Text style={{ fontSize: 16, color: getItemTextColor('certificates') }} className="text-black">Certificates</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[getItemStyle('issues'), styles.item]} className="rounded-2xl h-10 flex px-3 flex-row items-center mt-3">
          <FontAwesome5 size={20} color={getItemIconColor('issues')} name="certificate" />
          <View className="w-2" />
          <Text style={{ fontSize: 16, color: getItemTextColor('issues') }} className="text-black">Issues</Text>
        </TouchableOpacity>
      </View>
      <View className="px-4">
        <TouchableOpacity className="flex flex-row">
          <FontAwesome size={20} color={colorred} name="share" />
          <View className="w-2" />
          <Text style={{ fontSize: 16 }}>Tell a Friend</Text>
        </TouchableOpacity>
      </View>
      <View className="px-4 mt-5">
        <TouchableOpacity onPress={() => handlePress('login', 'logout')} className="flex flex-row">
          <FontAwesome size={20} color={colorred} name="sign-out" />
          <View className="w-2" />
          <Text style={{ color: colorred, fontSize: 16 }}>Logout</Text>
        </TouchableOpacity>
        <Divider className="border-1 bg-red-300 border-red-200 w-full mt-3" />
      </View>
    </SafeAreaView>
  );
};

export default CustomDrawer;