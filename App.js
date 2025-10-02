import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import StackWrapper from "./routers/stackrouter";
import DrawerWrapper from "./routers/drawerrouter";
import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider } from "react-redux";
import store from "./store/store";
import "./global.css"
import NotificationManager from "./components/NotificationManager";
import ErrorBoundary from "./components/ErrorBoundary";
import { navigationRef } from "./components/NavigationService";
import Toast from 'react-native-toast-message';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from "expo-status-bar";


export default function App() {
  const Stack = createStackNavigator();
  const [appIsReady, setAppIsReady] = useState(false);

  // Prevent splash screen from auto-hiding
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);



  useEffect(() => {
    async function prepare() {
      try {
        // Add any other initialization logic here
        await new Promise(resolve => setTimeout(resolve, 2000)); // Minimum splash time
      } catch (e) {
        console.warn("App preparation error:", e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      try {
        // Hide splash screen when app is ready
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error("Error hiding splash screen:", error);
        // Continue with app initialization even if splash screen fails
      }
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <PaperProvider>
        <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <NavigationContainer
            ref={navigationRef}
            onReady={() => {
              console.log("Navigation container is ready");
            }}
            onStateChange={(state) => {
              // Add navigation state debugging
              console.log("Navigation state changed:", state);
            }}
          >
            <ErrorBoundary>
              <Stack.Navigator
                initialRouteName="onboarding"
                screenOptions={{ headerShown: false }}
                screenListeners={{
                  state: (e) => {
                    console.log("Stack navigator state:", e.data.state);
                  },
                }}
              >
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
              <Toast/>
            </ErrorBoundary>
            <NotificationManager />
          </NavigationContainer>
        </GestureHandlerRootView>
      </PaperProvider>
    </Provider>
  );
}

