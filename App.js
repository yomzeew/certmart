import React from "react";
import globaltext from './settings/globaltext';
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
import "./global.css";
import NotificationManager from "./components/NotificationManager";
import ErrorBoundary from "./components/ErrorBoundary";
import { navigationRef } from "./components/NavigationService";
import Toast from 'react-native-toast-message';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from "expo-status-bar";
import { setBackgroundColorAsync } from 'expo-system-ui';
import NetInfo from '@react-native-community/netinfo';
import { View, StyleSheet,Text } from 'react-native';
import { useFonts } from 'expo-font';

export default function App() {
  const Stack = createStackNavigator();
  const [appIsReady, setAppIsReady] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [fontsLoaded] = useFonts({
    'Rimouski': require('./assets/fonts/rimouskiSb.otf'),
  });

  // Prevent splash screen from auto-hiding
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    setBackgroundColorAsync('#ffffff'); // background behind app
  }, []);

  const todaynow = new Date().toISOString().split("T")[0];
  console.log(todaynow)

  const storeDate=async()=>{
    try {
      await AsyncStorage.setItem("bannerLastShown", todaynow);
    } catch (error) {
      console.log("❌ Error storing banner date:", error);
    }
  };



  // Network status effect
  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
    });

    // Unsubscribe
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        // Check initial network state
        const netInfoState = await NetInfo.fetch();
        setIsConnected(netInfoState.isConnected);
        // Pre-load fonts, make any API calls you need to here
        // Artificially delay for 2 seconds to simulate a slow loading experience
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn('Error in prepare:', e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
    storeDate();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady && fontsLoaded) {
      try {
        // Hide splash screen when app is ready and fonts are loaded
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error("Error hiding splash screen:", error);
        // Continue with app initialization even if splash screen fails
      }
    }
  }, [appIsReady, fontsLoaded]);

  if (!appIsReady || !fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PaperProvider>
        <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <View style={{ flex: 1 }}>
            <NavigationContainer 
              ref={navigationRef}
              onStateChange={async (e) => {
                console.log("Stack navigator state:", e.data.state);
              }}
            >
              <ErrorBoundary>
                <Stack.Navigator
                  screenOptions={{
                    headerShown: false,
                  }}
                  initialRouteName="onboarding"
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
              {!isConnected && (
                <View style={styles.offlineContainer}>
                  <Text style={styles.offlineText}>No Internet Connection</Text>
                </View>
              )}
            </NavigationContainer>
          </View>
        </GestureHandlerRootView>
      </PaperProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    zIndex: 999,
  },
  offlineText: { 
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
  }
});

