import { createDrawerNavigator } from "@react-navigation/drawer";
import { TransitionPresets } from "@react-navigation/stack";
import "react-native-gesture-handler";
import Dashboard from "../screens/student/dashboardcomponet/dashboard";
import CustomDrawer from "../screens/drawercontent/drawer";
import StudentProfile from "../screens/student/dashboardcomponet/studentprofile";
import Coursedetail from "../screens/student/dashboardcomponet/coursesdetail";
import ApplyCourses from "../screens/student/dashboardcomponet/applycourses";
import AllCoursedetail from "../screens/student/dashboardcomponet/allavailablecourses";
import ApplicationCheckers from "../screens/student/dashboardcomponet/applicationchecker";
import CourseReg from "../screens/student/dashboardcomponet/courseRegistration";
import Classes from "../screens/student/dashboardcomponet/studentclasses";
const DrawerWrapper = () => {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
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
      <Drawer.Screen
        options={{ gestureEnabled: false, gestureDirection: "vertical" }}
        name="dashboardstudent"
        component={Dashboard}
      />
      <Drawer.Screen
        options={{ gestureEnabled: false, gestureDirection: "vertical" }}
        name="studentprofile"
        component={StudentProfile}
      />
      <Drawer.Screen
        options={{ gestureEnabled: false, gestureDirection: "vertical" }}
        name="coursesdetail"
        component={Coursedetail}
      />
      <Drawer.Screen
        options={{ gestureEnabled: false, gestureDirection: "vertical" }}
        name="applycourses"
        component={ApplyCourses}
      />
      <Drawer.Screen
        options={{ gestureEnabled: false, gestureDirection: "vertical" }}
        name="couseravailable"
        component={AllCoursedetail}
      />
      <Drawer.Screen
        options={{ gestureEnabled: false, gestureDirection: "vertical" }}
        name="coursestatus"
        component={ApplicationCheckers}
      />
      <Drawer.Screen 
      options={{gestureEnabled:false,gestureDirection:'vertical'}} 
      name="coursereg" 
      component={CourseReg} /> 
       <Drawer.Screen 
      options={{gestureEnabled:false,gestureDirection:'vertical'}} 
      name="classes" 
      component={Classes} /> 
      
      
    
    </Drawer.Navigator>
  );

};
export default DrawerWrapper; 
