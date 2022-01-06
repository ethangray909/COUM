import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const FUNCTIONS = require('./src/global/functions.js');
const CONSTANTS = require('./src/global/constants.js');

const AuthStack = createStackNavigator();
const Tabs = createBottomTabNavigator();

const HomeStack = createStackNavigator();
const AudioRoomsStack = createStackNavigator();
const ExploreStack = createStackNavigator();
const NotificationStack = createStackNavigator();
const MeStack = createStackNavigator();

import Login from './src/screens/login';
import UpdateUser from './src/screens/login/updateUser';
import Splash from './src/screens/Splash';
import Home from './src/screens/home';
import Inbox from './src/screens/inbox';
import Explore from './src/screens/explore';
import Notification from './src/screens/notification';
import UserProfile from './src/screens/userProfile';
import AccountSettings from './src/screens/accountSettings';
import Chat from './src/screens/chat';
import AudioRooms from './src/screens/audioRooms';
//import AudioRooms1 from './src/screens/audioRooms1';
import CompanyProfile from './src/screens/companyProfile';
import Search from './src/screens/search';
import Services from './src/screens/services';
import MyAnalytics from './src/screens/myAnalytics';
import MyFiles from './src/screens/myFiles';
import EditProfile from './src/screens/editProfile';
import Experience from './src/screens/experience';
import WebBrowser from './src/screens/webBrowser';

import home from './src/images/home.png';
import homeActive from './src/images/img_home_active.png';
import audioRoom from './src/images/audio_room.png';
import audioRoomActive from './src/images/audio_room_active.png';
import addTab from './src/images/img_add_tab.png';
import notification from './src/images/notification.png';
import notificationActive from './src/images/notification_active.png';
import me from './src/images/user_profile.png';
// import SplashScreen from 'react-native-splash-screen';

let notchPadding = DeviceInfo.hasNotch() ? 15 : 0;
let isLogin = null;

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="Home"
      options={{ headerShown: false }}
      component={Home}
    />
    <HomeStack.Screen
      name="CompanyProfile"
      options={{ headerShown: false }}
      component={CompanyProfile}
    />
    <HomeStack.Screen
      name="Inbox"
      options={{ headerShown: false }}
      component={Inbox}
    />
    <HomeStack.Screen
      name="UserProfile"
      options={{ headerShown: false }}
      component={UserProfile}
    />
    <HomeStack.Screen
      name="Search"
      options={{ headerShown: false }}
      component={Search}
    />
    <HomeStack.Screen
      name="Services"
      options={{ headerShown: false }}
      component={Services}
    />
    <HomeStack.Screen
      name="WebBrowser"
      options={{ headerShown: false }}
      component={WebBrowser}
    />
  </HomeStack.Navigator>
);

const AudioRoomsStackScreen = () => (
  <AudioRoomsStack.Navigator>
    <AudioRoomsStack.Screen
      name="AudioRooms"
      options={{ headerShown: false }}
      component={AudioRooms}
    />
    <AudioRoomsStack.Screen
      name="Inbox"
      options={{ headerShown: false }}
      component={Inbox}
    />
  </AudioRoomsStack.Navigator>
);

const ExploreStackScreen = () => (
  <ExploreStack.Navigator>
    <ExploreStack.Screen
      name="Explore"
      options={{ headerShown: false }}
      component={Explore}
    />
    <ExploreStack.Screen
      name="CompanyProfile"
      options={{ headerShown: false }}
      component={CompanyProfile}
    />
    <ExploreStack.Screen
      name="Search"
      options={{ headerShown: false }}
      component={Search}
    />
    <ExploreStack.Screen
      name="Inbox"
      options={{ headerShown: false }}
      component={Inbox}
    />
  </ExploreStack.Navigator>
);

const NotificationStackScreen = () => (
  <NotificationStack.Navigator>
    <NotificationStack.Screen
      name="Notification"
      options={{ headerShown: false }}
      component={Notification}
    />
    <NotificationStack.Screen
      name="UserProfile"
      options={{ headerShown: false }}
      component={UserProfile}
    />
    <NotificationStack.Screen
      name="Inbox"
      options={{ headerShown: false }}
      component={Inbox}
    />
  </NotificationStack.Navigator>
);

const MeStackScreen = () => (
  <MeStack.Navigator>
    <MeStack.Screen
      name="UserProfile"
      options={{ headerShown: false }}
      component={UserProfile}
    />
    <MeStack.Screen
      name="Services"
      options={{ headerShown: false }}
      component={Services}
    />
    <MeStack.Screen
      name="EditProfile"
      options={{ headerShown: false }}
      component={EditProfile}
    />
    <MeStack.Screen
      name="AccountSettings"
      options={{ headerShown: false }}
      component={AccountSettings}
    />
    <MeStack.Screen
      name="MyAnalytics"
      options={{ headerShown: false }}
      component={MyAnalytics}
    />
    <MeStack.Screen
      name="MyFiles"
      options={{ headerShown: false }}
      component={MyFiles}
    />
    <MeStack.Screen
      name="Experience"
      options={{ headerShown: false }}
      component={Experience}
    />
    <MeStack.Screen
      name="WebBrowser"
      options={{ headerShown: false }}
      component={WebBrowser}
    />
  </MeStack.Navigator>
);

function TabScreens() {
  const scheme = useColorScheme();
  const { colors, isDark } = useTheme();
  return (
    <Tabs.Navigator
      initialRoute="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          //let iconName;
          if (route.name === 'Home') {
            return (
              <Image
                source={focused ? homeActive : home}
                style={{ width: 25, height: 25 }}
              />
            );
          } else if (route.name === 'AudioRooms') {
            return (
              <Image
                source={focused ? audioRoomActive : audioRoom}
                style={{ width: 20, height: 20 }}
              />
            );
          } else if (route.name === 'Explore') {
            return (
              <View style={{ backgroundColor: 'transparent', marginBottom: 15 }}>
                <Image source={addTab} style={{ width: 40, height: 33 }} />
              </View>
            );
          } else if (route.name === 'Notification') {
            return (
              <Image
                source={focused ? notificationActive : notification}
                style={{ width: 25, height: 25 }}
              />
            );
          } else if (route.name === 'UserProfile') {
            return (
              <FastImage
                source={
                  CONSTANTS.USER.profile_image != null
                    ? { uri: CONSTANTS.USER.profile_image }
                    : me
                }
                style={{ width: 25, height: 25, borderRadius: 25 / 2 }}
              />
            );
          }

          // You can return any component that you like here!
          //return <Image source={iconName} style={{width: 25, height: 25}} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#FBBB00',
        inactiveTintColor: '#8E8E93',
        style: {
          backgroundColor: colors.background,
          paddingBottom: 8,
          paddingTop: 25,
          justifyContent: 'center',
          // height: 60 + notchPadding,
          height: 60,
          elevation: 0,
          //shadowOpacity: 0,
        },
        labelStyle: {
          fontFamily: 'SourceSansPro-Regular',
          paddingTop: 15,
          // paddingBottom: notchPadding,
          paddingBottom: 0,
        },
      }}>
      <Tabs.Screen name="Home" component={HomeStackScreen} />
      <Tabs.Screen
        name="AudioRooms"
        component={AudioRoomsStackScreen}
        options={{ tabBarLabel: 'Audio Rooms' }}
      />
      <Tabs.Screen
        name="Explore"
        component={ExploreStackScreen}
        options={{ tabBarLabel: '', activeTintColor: '#FFFFFF' }}
      />
      <Tabs.Screen
        name="Notification"
        component={NotificationStackScreen}
        options={{
          tabBarBadge: CONSTANTS.NOTIFICATION_COUNT, //BadgeCount parse null to remove
          tabBarBadgeStyle: {
            backgroundColor: isDark ? '#FFFFFF' : '#000000',
            color: isDark ? '#000000' : '#FFFFFF',
            top: -18,
            position: 'absolute',
          },
        }}
      />
      <Tabs.Screen
        name="UserProfile"
        component={MeStackScreen}
        options={{ tabBarLabel: 'Me' }}
      />
    </Tabs.Navigator>
  );
}

export default function App() {
  const scheme = useColorScheme();
  const { colors } = useTheme();
  useEffect(() => {
    // SplashScreen.hide();
    // return () => {
    //   cleanup
    // }
  }, []);
  const MyDarkTheme = {
    isDark: true,
    colors: {
      background: '#000000',
      textColor: '#FFFFFF',
      text2Color: '#B7BABD',
      headerBackgroud: '#141414',
      activeTabTextColor: '#FFFFFF',
      inactiveTabTextColor: '#8E8E93',
      followbuttonBackgroud: '#141414',
      followTextcolor: '#FFFFFF',
      iconTintColor: '#8E8E93',
      buttonBackground: '#FBBB0E',
      btnTextColor: '#000000',
      inputColor: '#FFFFFF',
      loading: '#FFFFFF',
    },
  };
  const MyLightTheme = {
    isDark: false,
    colors: {
      background: '#FFFFFF',
      textColor: '#000000',
      text2Color: '#B7BABD',
      headerBackgroud: '#FFFFF3',
      activeTabTextColor: '#FBBB00',
      inactiveTabTextColor: '#8E8E93',
      followbuttonBackgroud: '#ECECEC',
      followTextcolor: '#384149',
      iconTintColor: '#B7BABD',
      buttonBackground: '#FBBB0E',
      btnTextColor: '#000000',
      inputColor: '#FFFFFF',
      loading: '#000000',
    },
  };
  return (
    <AppearanceProvider>
      <NavigationContainer
        theme={scheme == 'dark' ? MyDarkTheme : MyLightTheme}>
        <Stack.Navigator>
          {/*token == null ?
          <Stack.Screen name="Login" options={{headerShown: false}} component={Login} />
          :
          <Stack.Screen name="TabScreens" options={{headerShown: false}} component={TabScreens} />
        */}
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
            component={Login}
          />
          <Stack.Screen
            name="UpdateUser"
            options={{ headerShown: false }}
            component={UpdateUser}
          />
          <Stack.Screen
            name="TabScreens"
            options={{ headerShown: false }}
            component={TabScreens}
          />
          <Stack.Screen
            name="Chat"
            options={{ headerShown: false }}
            component={Chat}
          />
          <Stack.Screen
            name="UserProfile"
            options={{ headerShown: false }}
            component={UserProfile}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppearanceProvider>
  );
}
