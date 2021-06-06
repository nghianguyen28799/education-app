import React from 'react';
import { View, TouchableOpacity, AsyncStorage } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator, BottomTabBar } from "@react-navigation/bottom-tabs"

import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons'; 

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import SlideBar from '../components/CustomDrawer';
import ScanScreen from '../screens/ScanScreen'
import ScanForTeacherScreen from '../screens/ScanForTeacherScreen'
import MessageListScreen from '../screens/MessageListScreen';
import MessageScreen from '../screens/MessageScreen';
import WelcomeScreen from '../screens/WelcomeScreen'
import LoaderScreen from '../screens/LoaderScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AttendenceScreen from '../screens/AttendenceScreen';
import OutBusScreen from '../screens/OutBusScreen';
import StudentListScreen from '../screens/StudentListScreen';
import ViewProfileStudentScreen from '../screens/ViewProfileStudentScreen';
import ViewProfileTeacherScreen from '../screens/ViewProfileTeacherScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import ChooseStationScreen from '../screens/ChooseStationScreen';
import AbsenceScreen from '../screens/AbsenceScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import HistoryScreen from '../screens/HistoryScreen';
import GpsFollowScreen from '../screens/GPSFollowScreen';
import ChatListForParentsScreen from '../screens/ChatListForParentsScreen';
import TeacherHomePageScreen from '../components/Home/TeacherHomePage';
import ViewFullTeacherScheduleScreen from '../screens/ViewFullTeacherSchedule';
import AttendanceForTeacherScreen from '../screens/AttendanceForTeacherScreen';
import NotificationParentsScreen from '../screens/NotificationParentsScreen';
import ReasonAbsenceScreen from '../screens/ReasonAbsence';
import MapScreen from '../screens/MapScreen';
import ViewProfileSupervisorScreen from '../screens/ViewProfileSupervisorScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const navOptionHandle = () => ({
  headerShown: false
})
  
const TabBarCustomButton = ({ accessibilityState, children, onPress }) => {

  var isSelected = accessibilityState.selected

  if (isSelected) {
      return (
          <View style={{ flex: 1, alignItems: "center" }}>
              <View style={{ flexDirection: 'row', position: 'absolute', top: 0 }}>
                  <View style={{ flex: 1, backgroundColor: "#FFF" }}></View>
                  <Svg
                      width={75}
                      height={61}
                      viewBox="0 0 75 61"
                  >
                      <Path
                          d="M75.2 0v61H0V0c4.1 0 7.4 3.1 7.9 7.1C10 21.7 22.5 33 37.7 33c15.2 0 27.7-11.3 29.7-25.9.5-4 3.9-7.1 7.9-7.1h-.1z"
                          fill={"#FFF"}
                      />
                  </Svg>
                  <View style={{ flex: 1, backgroundColor: "#FFF" }}></View>
              </View>

              <TouchableOpacity
                  style={{
                      top: -22.5,
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      backgroundColor: "#FFF"
                  }}
                  onPress={onPress}
              >
                  {children}
              </TouchableOpacity>
          </View>
      )
  } else {
      return (
          <TouchableOpacity
              style={{
                  flex: 1,
                  height: 60,
                  backgroundColor: "#FFF"
              }}
              activeOpacity={1}
              onPress={onPress}
          >
              {children}
          </TouchableOpacity>
      )
  }
}

function DrawerNavigator({ navigation }) {
  return (
    <Drawer.Navigator initialRouteName="Home" drawerContent={props => <SlideBar {...props} />}>
        <Drawer.Screen 
            name="Home" 
            component={HomeScreen}
            option={{
                drawerIcon: ({ focused, color, size }) => (
                    <Ionicons name="home" color="#000" size={18} />
                )
            }} 
        />
    </Drawer.Navigator>
  )
}

function DrawerNavigatorTeacher({ navigation }) {
    return (
      <Drawer.Navigator initialRouteName="Home" drawerContent={props => <SlideBar {...props} />}>
          <Drawer.Screen 
              name="Home" 
              component={TeacherHomePageScreen}
              option={{
                  drawerIcon: ({ focused, color, size }) => (
                      <Ionicons name="home" color="#000" size={18} />
                  )
              }} 
          />
      </Drawer.Navigator>
    )
}

function DrawerNavigatorSupervisor({ navigation }) {
    return (
      <Drawer.Navigator initialRouteName="Home" drawerContent={props => <SlideBar {...props} />}>
          <Drawer.Screen 
              name="Home" 
              component={HomeScreen}
              option={{
                  drawerIcon: ({ focused, color, size }) => (
                      <Ionicons name="home" color="#000" size={18} />
                  )
              }} 
          />
      </Drawer.Navigator>
    )
}


function BottomTagNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        showLabel: false,
        style:{
          borderTopWidth: 0,
          backgroundColor: "transparent",
          elevation: 0,
        }
      }}
    >

    <Tab.Screen
        name="Home"
        component={DrawerNavigator}
        options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons name="home" color={ focused ? "#03a9f4" : "#3e3e3e" } size={22} />
            ),
            tabBarButton: (props) => (
                <TabBarCustomButton
                    {...props}
                />
            )
        }}
    />

    <Tab.Screen
        name="Notifications"
        component={NotificationParentsScreen}
        options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons name="notifications-sharp" color={ focused ? "#03a9f4" : "#3e3e3e" } size={22} />
            ),
            tabBarButton: (props) => (
                <TabBarCustomButton
                    {...props}
                />
            )
        }}
    />
    </Tab.Navigator>
  )
}

export default function StackNavigator () {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Loader">
            <Stack.Screen name="Loader" component={LoaderScreen} options={ navOptionHandle } />
            <Stack.Screen name="Welcome" component={WelcomeScreen} options={ navOptionHandle } />
            <Stack.Screen name="Login" component={LoginScreen} options={ navOptionHandle } />
            <Stack.Screen name="Home" component={BottomTagNavigator} options={ navOptionHandle } />
            <Stack.Screen name="TeacherHome" component={DrawerNavigatorTeacher} options={ navOptionHandle } />
            <Stack.Screen name="SupervisorHome" component={DrawerNavigatorSupervisor} options={ navOptionHandle } />
            <Stack.Screen name="ScanQR" component={ScanScreen} options={ navOptionHandle }/>
            <Stack.Screen name="ScanQRTeacher" component={ScanForTeacherScreen} options={ navOptionHandle }/>
            <Stack.Screen name="MessageList" component={MessageListScreen} options={ navOptionHandle }/>
            <Stack.Screen name="Attendence" component={AttendenceScreen} options={ navOptionHandle } />
            <Stack.Screen name="OutBus" component={OutBusScreen} options={ navOptionHandle }/>
            <Stack.Screen name="Profile" component={ProfileScreen} options={ navOptionHandle } />
            <Stack.Screen name="Message" component={MessageScreen} options={ navOptionHandle } />
            <Stack.Screen name="StudentList" component={StudentListScreen} options={ navOptionHandle } />
            <Stack.Screen name="ViewProfileStudent" component={ViewProfileStudentScreen} options={ navOptionHandle } />
            <Stack.Screen name="ViewProfileTeacher" component={ViewProfileTeacherScreen} options={ navOptionHandle } />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={ navOptionHandle } />
            <Stack.Screen name="ChooseStation" component={ChooseStationScreen} options={ navOptionHandle } />
            <Stack.Screen name="Absence" component={AbsenceScreen} options={ navOptionHandle } />
            <Stack.Screen name="Schedule" component={ScheduleScreen} options={ navOptionHandle } />
            <Stack.Screen name="History" component={HistoryScreen} options={ navOptionHandle } />
            <Stack.Screen name="GpsFollow" component={GpsFollowScreen} options={ navOptionHandle } />
            <Stack.Screen name="ChatListForParents" component={ChatListForParentsScreen} options={ navOptionHandle } />
            <Stack.Screen name="ViewFullTeacherSchedule" component={ViewFullTeacherScheduleScreen} options={ navOptionHandle } />
            <Stack.Screen name="AttendanceForTeacher" component={AttendanceForTeacherScreen} options={ navOptionHandle } />
            <Stack.Screen name="ReasonAbsence" component={ReasonAbsenceScreen} options={ navOptionHandle }/>
            <Stack.Screen name="Map" component={MapScreen} options={ navOptionHandle }/>
            <Stack.Screen name="ViewProfileSupervisor" component={ViewProfileSupervisorScreen} options={ navOptionHandle }/>
        </Stack.Navigator>
    </NavigationContainer>
  )
}
