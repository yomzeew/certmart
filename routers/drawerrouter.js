import { createDrawerNavigator } from '@react-navigation/drawer';
import {  TransitionPresets } from '@react-navigation/stack';
import Dashboard from '../screens/student/dashboardcomponet/dashboard';
import CustomDrawer from '../screens/drawercontent/drawer';
import StudentProfile from '../screens/student/dashboardcomponet/studentprofile';
import Coursedetail from '../screens/student/dashboardcomponet/coursesdetail';
import ApplyCourses from '../screens/student/dashboardcomponet/applycourses';
const DrawerWrapper=()=>{
    const Drawer=createDrawerNavigator()
    return(
        <Drawer.Navigator 
        drawerContent={(props)=><CustomDrawer {...props} />}
        drawerPosition="bottom"
        initialRouteName="dashboardstudent"
        navigationOption=""
        screenOptions={{
          headerTitle: null, // Remove the title for all screens
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
        >
        {/* <Stack.Screen  name="start" component={Home} /> */}
       <Drawer.Screen options={{gestureEnabled:false,gestureDirection: 'vertical',}} name="dashboardstudent" component={Dashboard} /> 
       <Drawer.Screen options={{gestureEnabled:false,gestureDirection: 'vertical',}} name="studentprofile" component={StudentProfile} />  
       <Drawer.Screen options={{gestureEnabled:false,gestureDirection:'vertical'}} name="coursesdetail" component={Coursedetail} /> 
       <Drawer.Screen options={{gestureEnabled:false,gestureDirection:'vertical'}} name="applycourses" component={ApplyCourses} /> 
      </Drawer.Navigator>

    )
}
export default DrawerWrapper