import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import StackWrapper from "./routers/stackrouter";
import DrawerWrapper from "./routers/drawerrouter";
import { createStackNavigator } from "@react-navigation/stack";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Calendar from "./screens/student/dashboardcomponet/calendar/calendar";
import Chats from "./screens/student/dashboardcomponet/chats/chats";
import Profile from "./screens/student/dashboardcomponet/profile/profile";

export default function App() {
  const Stack = createStackNavigator();
  const fetchdata = async () => {
    const response = await fetch("http://certmart.ng/countriesapi/data.json");
    if (response.ok) {
      const dataall = await response.json();
      if (dataall) {
        await AsyncStorage.setItem("datacountry", JSON.stringify(dataall));
      }
    }
  };
  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <PaperProvider>
      <GestureHandlerRootView>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* <Stack.Screen  name="start" component={Home} /> */}
            <Stack.Screen
              options={{ gestureEnabled: true, gestureDirection: "vertical" }}
              name="onboarding"
              component={StackWrapper}
            />
            <Stack.Screen
              options={{ gestureEnabled: false, gestureDirection: "vertical" }}
              name="dashboard"
              component={DrawerWrapper}
            />
            <Stack.Screen
              options={{ gestureEnabled: false, gestureDirection: "vertical" }}
              name="calendar"
              component={Calendar}
            />
            <Stack.Screen
              options={{ gestureEnabled: false, gestureDirection: "vertical" }}
              name="chats"
              component={Chats}
            />
            <Stack.Screen
              options={{ gestureEnabled: false, gestureDirection: "vertical" }}
              name="profile"
              component={Profile}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
