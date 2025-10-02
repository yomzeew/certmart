import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import Home from '../screens/onbaordingscreens/home';
import Slider from '../screens/onbaordingscreens/slider';
import Chooseplaform from '../screens/onbaordingscreens/chooseplatform';
import Welcomepage from '../screens/onbaordingscreens/welcomepage';
import Login from '../screens/onbaordingscreens/login';
import RegisterPage from '../screens/onbaordingscreens/register';
import OtpPage from '../screens/onbaordingscreens/otppage';
import NewPasswordPage from '../screens/onbaordingscreens/newpasswordpage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

const Stack = createStackNavigator();

const StackWrapper = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingCompleted = await AsyncStorage.getItem('onboardingCompleted');
      if (onboardingCompleted === 'true') {
        setInitialRoute('login');
      } else {
        setInitialRoute('start');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setInitialRoute('start'); // fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  // Show a loader until we know where to go
  if (isLoading || !initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name="start" component={Home} />
      <Stack.Screen name="slider" component={Slider} />
      <Stack.Screen name="chooseplatform" component={Chooseplaform} />
      <Stack.Screen name="welcome" component={Welcomepage} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="register" component={RegisterPage} />
      <Stack.Screen name="otppage" component={OtpPage} />
      <Stack.Screen name="newpassword" component={NewPasswordPage} />
    </Stack.Navigator>
  );
};

export default StackWrapper;
