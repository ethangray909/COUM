'use strict';

import React, { useMemo } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import vh from '../Units/vh';
import vw from '../Units/vw';

let {height, width} = Dimensions.get('window');
let margin = 15;
let notchPadding = DeviceInfo.hasNotch() ? 21 : 0;

const getGlobalStyles = (props) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: props.colors.background,
  },
  albumView: {
    flex: 1,
    alignItems: "flex-start",
    width: width,
    //height: 280,
    backgroundColor: props.colors.background
  },
  albumHeaderImage: {
    width: vw,
    height: vh*0.32,
    marginTop: 0,
    paddingRight: 0
  },
  albumprofileView: {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  albumProfileImage: {
    resizeMode: 'contain',
    width: 45,
    height: 45,
    borderRadius: 45/2,
  },
  albumContentView: {
    flex: 0.7,
    backgroundColor: 'transparent',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5
  },
  albumTitle: {
    width: '100%',
    color: props.colors.textColor,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16
  },
  albumType: {
    width: '100%',
    color: '#8E8E93',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16
  },
  albumSubContentView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: '100%'
  },
  albumDetail: {
    alignSelf: 'center',
    textAlign: 'center',
    color: '#8E8E93',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 14
  },
  albumMenuView: {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  connectionsView: {
    width: 35,
    height: 35,
    borderRadius: 35/2,
    marginRight: 10
  },
  connectionsImage: {
    width: 35,
    height: 35,
    borderRadius: 35/2,
    borderWidth: 1.5
  },
  socialMediaView: {
    width: height*0.04,
    minHeight: height*0.04,
    backgroundColor: props.isDark ? '#141414' : '#ECECEC',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchView: {
    backgroundColor: props.isDark ? '#18181A' : '#F2F2F4',
    flexDirection: 'row',
    marginTop: 10,
    height: 36,
    alignItems:'center',
    borderRadius: 4,
    marginLeft: margin,
    marginRight: margin,
    borderWidth: props.isDark ? 0 : 1,
    borderColor: props.isDark ? 'transparent' : '#ECECEC'
  },
  searchImage: {
    width: 15,
    height: 15,
    marginLeft: 8
  },
  searchInput: {
    marginLeft: 8,
    color: props.isDark ? '#FFFFFF' : '#8E8E93',
    fontSize: 14,
    fontFamily: 'SourceSansPro-Regular',
    marginRight: 25
  },
  btnFollowView: {
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: props.isDark ? '#141414' : '#ECECEC',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 4,
    paddingBottom: 4,
  },
  txtFollowButton: {
    color: props.isDark ? '#FFFFFF' : '#384149',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'SFProDisplay-Bold',
    alignSelf: 'center'
  },
  topSearchView: {
    marginTop: 6,
    marginRight: 10,
    marginBottom: 6,
    padding: 6,
    backgroundColor: props.isDark ? '#141414' : '#ECECEC',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  txtTopSearch: {
    color: '#8E8E93',
    fontSize: 10,
    fontFamily: 'SourceSansPro-Regular'
  },
  popup_title:{
    marginLeft: margin-5,
    marginRight: margin-5,
    marginTop: 10,
    color: props.isDark ? '#FFFFFF' : '#000000',
    alignSelf:'center',
    backgroundColor: 'transparent',
    fontSize: 20,
    fontFamily: 'SourceSansPro-Regular',
    fontWeight:'500',
  },
  popup_description: {
    color: props.colors.textColor,
    margin: margin-5,
    backgroundColor: 'transparent',
    fontSize: 14,
    fontFamily: 'SourceSansPro-Regular'
  },
  popup_button_view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'transparent',
    marginTop: 8,
  },
  popup_cancel_button: {
    flex: 1,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#FBBB00',
    backgroundColor: 'white',
    height: 40,
    marginLeft: 15,
    marginRight: 15,
    justifyContent: 'center'
  },
  popup_yes_button: {
    flex: 1,
    height: 40,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: '#FBBB00',
    borderRadius: 30,
    justifyContent: 'center'
  },
  popup_button_text: {
    alignSelf: 'center',
    fontSize: 14,
    fontFamily: 'SourceSansPro-Regular',
    letterSpacing: -0.1,
    textTransform: 'uppercase'
  },
  close_button: {
    top: notchPadding + 30,
    right: 15,
    position: 'absolute',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
    backgroundColor: props.isDark ? '#FFFFFF' : '#000000',
    width: 25,
    height: 25,
    borderRadius: 25/2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabSelectTitile: {
    color: props.isDark ? '#FBBB00' : '#000000',
    fontFamily: 'SourceSansPro-SemiBold',
    fontWeight: '600',
    fontSize: 16,
    paddingLeft: 6,
    paddingRight: 6
  },
  tabTitile: {
    color: props.isDark ? '#FFFFFF' : '#8E8E93',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
    paddingLeft: 6,
    paddingRight: 6
  },
  currentTabView: {
    marginRight: margin,
    borderBottomWidth: 1,
    borderColor: props.isDark ? '#FBBB00' : '#000000',
    paddingBottom: 10,
  },
  tabView: {
    marginRight: margin,
    paddingBottom: 10
  },
  submitButton: {
    backgroundColor: '#FBBB00',
    borderRadius: 13,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 15
  },
  buttonText: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 20,
    color: '#000000'
  }
});

function useGlobalStyles() {
  const{colors, isDark} = useTheme();
  const style = useMemo(()=> getGlobalStyles({colors, isDark}), [colors, isDark]);
  return style;
}

export default useGlobalStyles;

// export default StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     //backgroundColor: colors.background
//   },
// });
