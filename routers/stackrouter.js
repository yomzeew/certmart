import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator,CardStyleInterpolators} from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../screens/onbaordingscreens/home';
import Slider from '../screens/onbaordingscreens/slider';
import Chooseplaform from '../screens/onbaordingscreens/chooseplatform';
import Welcomepage from '../screens/onbaordingscreens/welcomepage';
import Login from '../screens/onbaordingscreens/login';
import RegisterPage from '../screens/onbaordingscreens/register';
import Dashboard from '../screens/student/dashboardcomponet/dashboard';
import CustomDrawer from '../screens/drawercontent/drawer';

const StackWrapper=()=>{
    const Stack = createStackNavigator();
    const Drawer=createDrawerNavigator()
    return(
        <Stack.Navigator 
        initialRouteName="start"
        navigationOption=""
        screenOptions={{
          headerTitle: null, // Remove the title for all screens
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        >
        {/* <Stack.Screen  name="start" component={Home} /> */}
      <Stack.Screen options={{gestureEnabled:true,gestureDirection: 'vertical',}} name="start" component={Home}/> 
      <Stack.Screen options={{gestureEnabled:false,gestureDirection: 'vertical',}} name="slider" component={Slider}/> 
      <Stack.Screen options={{gestureEnabled:false,gestureDirection: 'vertical',}} name="chooseplatform" component={Chooseplaform}/> 
      <Stack.Screen options={{gestureEnabled:false,gestureDirection: 'vertical',}} name="welcome" component={Welcomepage}/> 
      <Stack.Screen options={{gestureEnabled:false,gestureDirection: 'vertical',}} name="login" component={Login}/> 
      <Stack.Screen options={{gestureEnabled:false,gestureDirection: 'vertical',}} name="register" component={RegisterPage}/>
          
      </Stack.Navigator>

    )
}
export default StackWrapper