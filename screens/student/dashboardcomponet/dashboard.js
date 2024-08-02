import { StatusBar } from "expo-status-bar"
import { Avatar, Surface, TextInput, Chip, Card, Button } from "react-native-paper"
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, Image, ImageBackground } from "react-native"
import { styles } from "../../../settings/layoutsetting"
import { colorred, grey } from "../../../constant/color"
import { FontAwesome5,FontAwesome, MaterialCommunityIcons,Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native";
import { Drawer } from 'react-native-paper';
import { useState } from "react"
import Header from "./header"
import Footer from "./footer"

const Dashboard = () => {
    const [active, setActive] =useState('');
    const navigation = useNavigation();
    const handlenavigate=()=>{
        navigation.navigate('coursesdetail')
    }
    return (
        <>  
            <SafeAreaView style={[styles.andriod, styles.bgcolor]} className="flex-1 flex w-full">
                <StatusBar style="auto" />
                <Header/>
                <View className="items-center mt-3">
                    <View className="w-full items-center justify-center flex">
                        <View className="absolute z-50 top-3 right-16">
                            <TouchableOpacity style={{ backgroundColor: colorred }} className="rounded-lg h-10 w-10 items-center flex justify-center">
                                <Text className="text-white">Go</Text>
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            label="Search"
                            mode="outlined"
                            theme={{ colors: { primary: grey, outline: grey } }}
                            className="bg-white w-3/4 h-12"
                            textColor="#000000"
                            left={<TextInput.Icon icon="magnify" color={colorred} />}

                        />

                    </View>

                </View>
                <View className="flex-1">
                    <ScrollView
                    showsVerticalScrollIndicator={false}
                    >
                    <View className="px-3 mt-3">
                    <View className="flex justify-between flex-row items-center">
                        <Text style={{ fontSize: 16 }} className="font-semibold">
                            Categories
                        </Text>
                        <TouchableOpacity>
                            <Text style={{ color: colorred, fontSize: 14 }} className="font-semibold">
                                See all
                            </Text>
                        </TouchableOpacity>

                    </View>
                    <View className="w-full mt-3">
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            horizontal>
                            <TouchableOpacity className="h-36 w-44 items-center rounded-2xl">
                                <Image source={require('../../images/productdesign.jpeg')} resizeMode="cover" className="h-full w-full rounded-2xl absolute" />
                                    <View className="h-full w-full bg-slate-700  opacity-60 absolute rounded-2xl" />
                                    <View className="absolute bottom-5 z-50 items-center w-full">
                                        <Text style={{ fontSize: 16 }} className="text-white font-semibold text-center">{`Product Design\n(UI & UX)`}</Text>
                                    </View>

                               
                            </TouchableOpacity>
                            <TouchableOpacity className="h-36 w-44 items-center rounded-2xl ml-3">
                                <Image source={require('../../images/webdesign.jpeg')} resizeMode="cover" className="h-full w-full rounded-2xl absolute"/>
                                    <View className="h-full w-full bg-slate-700  opacity-60 absolute rounded-2xl" />
                                    <View className="absolute bottom-5 z-50 items-center w-full">
                                        <Text style={{ fontSize: 16 }} className="text-white font-semibold text-center">{`Web Development`}</Text>
                                    </View>

                             
                            </TouchableOpacity>
                            <TouchableOpacity className="h-36 w-44 items-center rounded-2xl ml-3">
                                <Image source={require('../../images/datascience.jpeg')} resizeMode="cover" className="h-full w-full rounded-2xl absolute"/>
                                    <View className="h-full w-full bg-slate-700  opacity-60 absolute rounded-2xl" />
                                    <View className="absolute bottom-5 z-50 items-center w-full">
                                        <Text style={{ fontSize: 16 }} className="text-white font-semibold text-center">{`Data Science`}</Text>
                                    </View>

                            </TouchableOpacity>

                        </ScrollView>

                    </View>


                </View>
                <View className="px-3 mt-3">
                    <View className="flex justify-between flex-row items-center">
                        <Text style={{ fontSize: 16 }} className="font-semibold">
                            Popular Courses
                        </Text>
                        <TouchableOpacity>
                            <Text style={{ color: colorred, fontSize: 14 }} className="font-semibold">
                                See all
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        horizontal
                    >
                        <View className="flex flex-row mt-3">
                            <TouchableOpacity style={{ backgroundColor: grey }} className="flex-shrink rounded-xl h-8 flex flex-row justify-center items-center px-4">
                                <Text style={{ fontSize: 12 }} className="font-semibold">All</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ backgroundColor: colorred }} className="flex-shrink rounded-xl h-8 flex flex-row justify-center items-center ml-3 px-4">
                                <Text style={{ fontSize: 12 }} className="font-semibold text-white">Product Design</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ backgroundColor: grey }} className="rounded-xl h-8 flex flex-row justify-center items-center ml-3 flex-shrink px-4">
                                <Text style={{ fontSize: 12 }} className="font-semibold">Product Management</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ backgroundColor: grey }} className="rounded-xl h-8 flex flex-row justify-center items-center ml-3 flex-shrink px-4">
                                <Text style={{ fontSize: 12 }} className="font-semibold">Web Application</Text>
                            </TouchableOpacity>


                        </View>

                    </ScrollView>
                    <View className="mt-3 w-full">
                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            horizontal



                        >
                            <View className="flex flex-row w-full py-2">
                               <TouchableOpacity onPress={handlenavigate}>
                               <Card className="w-56 bg-white">
                                    <Card.Cover source={require('../../images/productmanagment.jpeg')} />
                                    <Card.Content>
                                        <Text style={{ color: colorred }} className="font-semibold mt-2" variant="titleLarge">Product Design</Text>
                                        <Text style={{ fontSize: 13 }} className="font-semibold" variant="bodyMedium">Introduction to Product Design</Text>
                                        <Text variant="bodyMedium">N35,000 | <FontAwesome5 size={16} color="yellow" name="star" /> 4.2 | 70 std</Text>
                                    </Card.Content>
                                </Card>
                                </TouchableOpacity> 
                                <Card className="w-56 ml-3 bg-white">
                                    <Card.Cover source={require('../../images/webdesign.jpeg')} />
                                    <Card.Content>
                                        <Text style={{ color: colorred }} className="font-semibold mt-2" variant="titleLarge">Web Application</Text>
                                        <Text style={{ fontSize: 13 }} className="font-semibold" variant="bodyMedium">Introduction to Product Design</Text>
                                        <Text variant="bodyMedium">N65,000 | <FontAwesome5 size={16} color="yellow" name="star" /> 4.2 | 70 std</Text>
                                    </Card.Content>
                                </Card>
                                <Card className="w-56 ml-3 bg-white">
                                    <Card.Cover source={require('../../images/productdesign.jpeg')} />
                                    <Card.Content>
                                        <Text style={{ color: colorred }} className="font-semibold mt-2" variant="titleLarge">Product Management</Text>
                                        <Text style={{ fontSize: 13 }} className="font-semibold" variant="bodyMedium">Introduction to Product Design</Text>
                                        <Text variant="bodyMedium">N25,000 | <FontAwesome5 size={16} color="yellow" name="star" /> 4.2 | 70 std</Text>
                                    </Card.Content>
                                </Card>


                            </View>

                        </ScrollView>

                    </View>


                </View>
                <View className="mt-3 px-3">
                <View className="flex justify-between flex-row items-center">
                        <Text style={{ fontSize: 16 }} className="font-semibold">
                            Top Trainers
                        </Text>
                        <TouchableOpacity>
                            <Text style={{ color: colorred, fontSize: 14 }} className="font-semibold">
                                See all
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View className="mt-2 w-full">
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        horizontal
                    >
                        <View className="flex flex-row">
                            <View className="items-center">
                            <Avatar.Image source={require('../../images/avatermale.png')}/> 
                            <Text className="font-semibold">Sojaar</Text>

                            </View>
                            <View className="items-center ml-3">
                            <Avatar.Image source={require('../../images/trainer.jpeg')}/> 
                            <Text className="font-semibold">Sojaar</Text>

                            </View>
                       
                            <View className="items-center ml-3">
                            <Avatar.Image source={require('../../images/avaterfemale.png')}/> 
                            <Text className="font-semibold">Sojaar</Text>

                            </View>
                       
                            <View className="items-center ml-3">
                            <Avatar.Image source={require('../../images/trainer.jpeg')}/> 
                            <Text className="font-semibold">Sojaar</Text>

                            </View>
                       
                        <View className="items-center ml-3">
                            <Avatar.Image source={require('../../images/avaterfemale.png')}/> 
                            <Text className="font-semibold">Sojaar</Text>

                            </View>
                            <View className="items-center ml-3">
                            <Avatar.Image source={require('../../images/avatermale.png')}/> 
                            <Text className="font-semibold">Sojaar</Text>

                            </View>
                       
                       

                        </View>
                

                    </ScrollView>


                    </View>
                    

                </View>

                    </ScrollView>
               

                </View>
            <Footer/>
                

            </SafeAreaView>
        </>
    )
}
export default Dashboard