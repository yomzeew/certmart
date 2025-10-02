import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from "react-native";
import { FontAwesome5, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Dashboard from './dashboard';
import StudentProfile from './studentprofile';
import Classes from './studentclasses';
import Issues from './issues/issues';
import { colorred, lightred } from "../../../constant/color";

const Tab = createBottomTabNavigator();

const BottomNav = () => {
  return (
    <Tab.Navigator
      initialRouteName="dashboardstudent"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: "#fff", height: 60, paddingBottom: 5 },
        tabBarLabel: ({ focused, color }) => {
          let label = "";
          if (route.name === "dashboardstudent") label = "Home";
          else if (route.name === "classes") label = "Classes";
          else if (route.name === "issues") label = "Issues";
          else if (route.name === "studentprofile") label = "Profile";

          return (
            <Text style={{ 
              color: focused ? colorred : "black", 
              fontSize: 10, 
              marginTop: 3 
            }}>
              {label}
            </Text>
          );
        },
        tabBarIcon: ({ focused }) => {
          if (route.name === "dashboardstudent") {
            return (
              <FontAwesome5
                name="home"
                size={20}
                color={focused ? "white" : "black"}
                style={{
                  backgroundColor: focused ? colorred : lightred,
                  borderRadius: 10,
                  padding: 8,
                }}
              />
            );
          } else if (route.name === "classes") {
            return (
              <FontAwesome
                name="calendar"
                size={20}
                color={focused ? "white" : "black"}
                style={{
                  backgroundColor: focused ? colorred : lightred,
                  borderRadius: 10,
                  padding: 8,
                }}
              />
            );
          } else if (route.name === "issues") {
            return (
              <Ionicons
                name="chatbubble-sharp"
                size={22}
                color={focused ? "white" : "black"}
                style={{
                  backgroundColor: focused ? colorred : lightred,
                  borderRadius: 10,
                  padding: 8,
                }}
              />
            );
          } else if (route.name === "studentprofile") {
            return (
              <MaterialCommunityIcons
                name="face-man-profile"
                size={22}
                color={focused ? "white" : "black"}
                style={{
                  backgroundColor: focused ? colorred : lightred,
                  borderRadius: 10,
                  padding: 8,
                }}
              />
            );
          }
        },
      })}
    >
      <Tab.Screen name="dashboardstudent" component={Dashboard} />
      <Tab.Screen name="classes" component={Classes} />
      <Tab.Screen name="issues" component={Issues} />
      <Tab.Screen name="studentprofile" component={StudentProfile} />
    </Tab.Navigator>
  );
};

export default BottomNav;
