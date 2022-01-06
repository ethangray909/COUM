'use strict';

import React, {useRef, useEffect, useState, useCallback} from 'react';
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
    FlatList,
    AppState,
    Linking
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Header from '../global/header';
import { useTheme, useNavigation, useRoute } from '@react-navigation/native';

import PopupDialog from '../components/popupDialog'

let {height, width} = Dimensions.get('window');
const API = require('../network/api.js')
const CONSTANTS = require('../global/constants.js')
const FUNCTIONS = require('../global/functions.js')

let notchPadding = DeviceInfo.hasNotch() ? 21 : 0;
let margin = 15;

export default function AccountSettings(){
  const navigation = useNavigation();
  const{colors, isDark} = useTheme();
  const route = useRoute();
  const[isLogout, setLogout] = useState(false);

  const onItemClick = (item) => {
    console.log('Item Click : ',item);
    if (item == 'EditProfile') {
      navigation.navigate('EditProfile');
    }else if (item == 'MyAnalytics') {
      navigation.navigate('MyAnalytics');
    }else if (item == 'MyProjectFiles') {
      navigation.navigate('MyFiles');
    }else if (item == "Services") {
      navigation.navigate('Experience',{ flag: 'Services'});
    }else if (item == "Experience") {
      navigation.navigate('Experience',{ flag: 'Experience'});
    }else if (item == "Education") {
      navigation.navigate('Experience',{ flag: 'Education'});
    }else if (item == "Skills") {
      navigation.navigate('Experience',{ flag: 'Skills'});
    }else if (item == 'AccountPrivacy') {
      console.log('AccountPrivacy Click');
      navigation.navigate('WebBrowser', {
        url: CONSTANTS.PRIVACY_POLICY,
        title: 'Account Privacy'
      });
      }else if (item == 'About') {
      navigation.navigate('WebBrowser', {
        url: CONSTANTS.ABOUT,
        title: 'About'
      });
    }
  }

  const onLogout = () => {
    console.log('onLogout Click');
    FUNCTIONS.logoutUser();
    setLogout(false);
    navigation.replace('Login');
  }

  function onRateUsClick() {
    console.log('onRateUsClick');
  }

  const backTapped = () => {
    navigation.goBack();
  }

  return (
    <View style={[style.container,{backgroundColor: colors.background}]}>
      <Header
        title={'Account Settings'}
        isBackButton= {true}
        isIcon={false}
        isSearch={false}
        navigation = {navigation}/>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{flex: 1}}>
            <TouchableOpacity onPress={()=>onItemClick('EditProfile')} style={style.item_view}>
              <Text style={{color: colors.textColor, fontSize:16, fontFamily:'SourceSansPro-Regular'}}>Edit Profile</Text>
              <SimpleLineIcons name="arrow-right" color={isDark ? '#B7BABD' : '#8E8E93'} size={12} style={{alignSelf: 'center'}} />
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: '#8E8E93', opacity: 0.37 }} />

            <TouchableOpacity onPress={()=>onItemClick('AccountPrivacy')} style={style.item_view}>
              <Text style={{color: colors.textColor, fontSize:16, fontFamily:'SourceSansPro-Regular'}}>Account Privacy</Text>
              <SimpleLineIcons name="arrow-right" color={isDark ? '#B7BABD' : '#8E8E93'} size={12} style={{alignSelf: 'center'}} />
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: '#8E8E93', opacity: 0.37 }} />

            <TouchableOpacity onPress={()=>onItemClick('MyAnalytics')} style={style.item_view}>
              <Text style={{color: colors.textColor, fontSize:16, fontFamily:'SourceSansPro-Regular'}}>My Analytics</Text>
              <SimpleLineIcons name="arrow-right" color={isDark ? '#B7BABD' : '#8E8E93'} size={12} style={{alignSelf: 'center'}} />
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: '#8E8E93', opacity: 0.37 }} />

            <TouchableOpacity onPress={()=>onItemClick('MyProjectFiles')} style={style.item_view}>
              <Text style={{color: colors.textColor, fontSize:16, fontFamily:'SourceSansPro-Regular'}}>My Project Files</Text>
              <SimpleLineIcons name="arrow-right" color={isDark ? '#B7BABD' : '#8E8E93'} size={12} style={{alignSelf: 'center'}} />
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: '#8E8E93', opacity: 0.37 }} />

            <TouchableOpacity onPress={()=>onItemClick('Experience')} style={style.item_view}>
              <Text style={{color: colors.textColor, fontSize:16, fontFamily:'SourceSansPro-Regular'}}>Experience</Text>
              <SimpleLineIcons name="arrow-right" color={isDark ? '#B7BABD' : '#8E8E93'} size={12} style={{alignSelf: 'center'}} />
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: '#8E8E93', opacity: 0.37 }} />

            <TouchableOpacity onPress={()=>onItemClick('Education')} style={style.item_view}>
              <Text style={{color: colors.textColor, fontSize:16, fontFamily:'SourceSansPro-Regular'}}>Education</Text>
              <SimpleLineIcons name="arrow-right" color={isDark ? '#B7BABD' : '#8E8E93'} size={12} style={{alignSelf: 'center'}} />
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: '#8E8E93', opacity: 0.37 }} />

            <TouchableOpacity onPress={()=>onItemClick('Skills')} style={style.item_view}>
              <Text style={{color: colors.textColor, fontSize:16, fontFamily:'SourceSansPro-Regular'}}>Skills</Text>
              <SimpleLineIcons name="arrow-right" color={isDark ? '#B7BABD' : '#8E8E93'} size={12} style={{alignSelf: 'center'}} />
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: '#8E8E93', opacity: 0.37 }} />

            <TouchableOpacity onPress={()=>onItemClick('Services')} style={style.item_view}>
              <Text style={{color: colors.textColor, fontSize:16, fontFamily:'SourceSansPro-Regular'}}>Services</Text>
              <SimpleLineIcons name="arrow-right" color={isDark ? '#B7BABD' : '#8E8E93'} size={12} style={{alignSelf: 'center'}} />
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: '#8E8E93', opacity: 0.37 }} />

            <TouchableOpacity onPress={()=>onItemClick('PrivacySettings')} style={style.item_view}>
              <Text style={{color: colors.textColor, fontSize:16, fontFamily:'SourceSansPro-Regular'}}>Privacy Settings</Text>
              <SimpleLineIcons name="arrow-right" color={isDark ? '#B7BABD' : '#8E8E93'} size={12} style={{alignSelf: 'center'}} />
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: '#8E8E93', opacity: 0.37 }} />

            <TouchableOpacity onPress={()=>onItemClick('About')} style={style.item_view}>
              <Text style={{color: colors.textColor, fontSize:16, fontFamily:'SourceSansPro-Regular'}}>About</Text>
              <SimpleLineIcons name="arrow-right" color={isDark ? '#B7BABD' : '#8E8E93'} size={12} style={{alignSelf: 'center'}} />
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: '#8E8E93', opacity: 0.37 }} />

            <TouchableOpacity onPress={()=>onItemClick('HelpSupport')} style={style.item_view}>
              <Text style={{color: colors.textColor, fontSize:16, fontFamily:'SourceSansPro-Regular'}}>Help & Support</Text>
              <SimpleLineIcons name="arrow-right" color={isDark ? '#B7BABD' : '#8E8E93'} size={12} style={{alignSelf: 'center'}} />
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: '#8E8E93', opacity: 0.37 }} />

            <TouchableOpacity onPress={()=> onRateUsClick()} style={style.item_view}>
              <Text style={{color: colors.textColor, fontSize:16, fontFamily:'SourceSansPro-Regular'}}>Rate Us</Text>
              <SimpleLineIcons name="arrow-right" color={isDark ? '#B7BABD' : '#8E8E93'} size={12} style={{alignSelf: 'center'}} />
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: '#8E8E93', opacity: 0.37 }} />
          </View>
        </ScrollView>


      <TouchableOpacity onPress={()=>setLogout(true)} style={[style.loginButton, {backgroundColor: colors.buttonBackground}]}>
        <Text style={style.button_text}>Log out</Text>
      </TouchableOpacity>

      <PopupDialog
        title = {CONSTANTS.APP_NAME}
        okButtonText = "Logout"
        description="Are you sure want to Logout?"
        onCancel = {() => {
          setLogout(false);
        }}
        onOk = {()=> onLogout()}
        onTouchOutside={() => {
          setLogout(false);
        }}
        isDark={isDark}
        visible={isLogout}
      />

    </View>
  );

}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor:'#000000'
    },
    loginButton: {
        marginRight: '15%',
        marginLeft: '15%',
        marginTop: 25,
        borderRadius: 20,
        height: 46,
        justifyContent: 'center',
        marginBottom: 30 + notchPadding,
    },
    item_view: {
      flexDirection:'row',
      justifyContent:'space-between',
      marginTop:4,
      padding:10,
      paddingLeft: margin,
    },
    item_right_arrow: {
      width:10,
      height:10,
      alignSelf:'center'
    },
    button_text: {
      alignSelf: 'center',
      color: '#000000',
      paddingLeft: 40,
      paddingRight: 40,
      fontFamily: 'SourceSansPro-Regular',
      fontSize: 16,
      textTransform:'uppercase',
    }
});
