import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import StackWrapper from "./routers/stackrouter";
import DrawerWrapper from "./routers/drawerrouter";
import { createStackNavigator } from "@react-navigation/stack";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNav from "./screens/student/dashboardcomponet/bottomtab";
import { Provider } from "react-redux";
import store from "./store/store";
import "./global.css"
import NotificationManager from "./components/NotificationManager";
import ErrorBoundary from "./components/ErrorBoundary";

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
    <ErrorBoundary>
      <Provider store={store}>
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

              </Stack.Navigator>
              <NotificationManager />
            </NavigationContainer>
          </GestureHandlerRootView>
        </PaperProvider>
      </Provider>
    </ErrorBoundary>
  );
}

