'use strict';

import React, {useRef, useEffect, useState} from 'react';
import {
    Text,
    View,
    TextInput,
    NativeModules,
    Platform,
    Modal,
    TouchableHighlight,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ImageBackground,
    Image,
    Dimensions,
    StyleSheet,
    Button,
    Alert,
    ActivityIndicator,
    Keyboard,
    Animated,
    ScrollView,
    LayoutAnimation,
    Clipboard,
    AppState,
    FlatList,
    Linking
} from 'react-native';

import DeviceInfo from 'react-native-device-info';
// import SplashScreen from 'react-native-splash-screen'
import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
import logo from '../images/logo.png';
const FUNCTIONS = require('../global/functions.js')
const API = require('../network/api.js')
const CONSTANTS = require('../global/constants.js')
let notchPadding = DeviceInfo.hasNotch() ? 21 : 0;

let {height, width} = Dimensions.get('window');

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#141414'
    },
});
let token = '';

export default function Splash() {
  const navigation = useNavigation();
  const{colors} = useTheme();
  //const [token, setToken] = React.useState('');
  const style = StyleSheet.create({
      container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'stretch',
          backgroundColor: colors.background
      },
  });

  useEffect(
        () => {
          // SplashScreen.hide();
          FUNCTIONS.getItem('token').then((getToken) => {
            //setToken(getToken);
            token = getToken;
            console.log('GetToken : ',getToken);
          });
          let timer1 = setTimeout(() => {
            console.log('Timer off : ',token);
            if (token == '' || token == null) {
              navigation.replace('Login');
            }else {
              navigation.replace('TabScreens');
            }
          }, 2000)
          return () => {
            clearTimeout(timer1)
          }
        },
        []);

  return (
    <View style={style.container}>
      <Image source={logo} style={{ height: 64, resizeMode: 'contain', alignSelf: 'center'}} />
    </View>
  )
}
