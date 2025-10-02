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
import BottomNav from "../screens/student/dashboardcomponet/bottomtab";
import Eresources from "../screens/student/dashboardcomponet/eresourses";
import Certificate from "../screens/student/dashboardcomponet/certificate";
import Issues from "../screens/student/dashboardcomponet/issues/issues";
import TrainerProfile from "../screens/student/dashboardcomponet/trainerProfile";
import ClassesDetails from "../screens/student/dashboardcomponet/classDetails";
import TellAFriendScreen from "../screens/student/dashboardcomponet/tellafriend";

const DrawerWrapper = () => {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      drawerPosition="bottom"
      initialRouteName="bottomnav"
      navigationOption=""
      screenOptions={{
        headerTitle: null, // Remove the title for all screens
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
        <Drawer.Screen
        options={{ gestureEnabled: false, gestureDirection: "vertical" }}
        name="bottomnav"
        component={BottomNav}
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
        initialParams={{ courseName: '', courseCodeName: '' }}
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
      name="eResources" 
      component={Eresources} />

       <Drawer.Screen 
      options={{gestureEnabled:false,gestureDirection:'vertical'}} 
      name="certificates" 
      component={Certificate} />
        <Drawer.Screen 
      options={{gestureEnabled:false,gestureDirection:'vertical'}} 
      name="issues" 
      component={Issues} />
        <Drawer.Screen 
      options={{gestureEnabled:false,gestureDirection:'vertical'}} 
      name="trainerProfileScreen" 
      component={TrainerProfile} />
       <Drawer.Screen 
      options={{gestureEnabled:false,gestureDirection:'vertical'}} 
      name="classDetails" 
      component={ClassesDetails} />
      <Drawer.Screen 
      options={{gestureEnabled:false,gestureDirection:'vertical'}} 
      name="sharewithfriend" 
      component={TellAFriendScreen} />
      
    
    </Drawer.Navigator>
  );

};
export default DrawerWrapper; 
