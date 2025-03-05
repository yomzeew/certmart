import { Text, View } from 'react-native'
import Footer from './footer'
import { createStackNavigator,CardStyleInterpolators} from '@react-navigation/stack'
import Dashboard from './dashboard';
import StudentProfile from './studentprofile';
import Classes from './studentclasses';
import Issues from './issues/issues';
const BottomNav=()=>{
    const Stack = createStackNavigator();
    
    return(
        <>
        <View className="h-full   w-full ">
            <Stack.Navigator  
             initialRouteName="dashboardstudent"
            screenOptions={{
          headerTitle: null, // Remove the title for all screens
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }} >
                <Stack.Screen  options={{gestureEnabled:true,gestureDirection: 'vertical', header:false}}  name='dashboardstudent' component={Dashboard}/>
                <Stack.Screen  options={{gestureEnabled:true,gestureDirection: 'vertical',}} name='studentprofile' component={StudentProfile}/>
                <Stack.Screen  options={{gestureEnabled:true,gestureDirection: 'vertical',}} name='classes' component={Classes} />
                <Stack.Screen  options={{gestureEnabled:true,gestureDirection: 'vertical',}} name='issues' component={Issues} />
            </Stack.Navigator>
            <Footer/>
            
          


        </View>
        
        </>
    )
}
export default BottomNav