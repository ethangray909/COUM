'use strict';

import React, {useRef, useEffect, useState} from 'react';
import {
    Text,
    View,
    TextInput,
    Platform,
    Modal,
    TouchableOpacity,
    StatusBar,
    ImageBackground,
    Image,
    Dimensions,
    StyleSheet,
    Button,
    Keyboard,
    ScrollView,
    FlatList,
    KeyboardAvoidingView
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';
import OTPTextView from 'react-native-otp-textinput';
import Autocomplete from 'react-native-autocomplete-input';
// import SplashScreen from 'react-native-splash-screen';
import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import SpinnerButton from 'react-native-spinner-button';
import Snackbar from 'react-native-snackbar';

import styles from '../../styles/Styles';

import background_blur from '../../images/background_blur.png';
import background_ from '../../images/background_.png';
import logo from '../../images/logo.png';

let {height, width} = Dimensions.get('window');
const API = require('../../network/api.js')
const CONSTANTS = require('../../global/constants.js')
const FUNCTIONS = require('../../global/functions.js')
let notchPadding = DeviceInfo.hasNotch() ? 20 : 0;

function comp(a, b) {
  return a.toLowerCase().trim() === b.toLowerCase().trim();
}

function findTags(query, tag) {
  if (query === '') {
    return [];
  }
  if (query != null) {
    const regex = new RegExp(`${query.trim()}`, 'i');
    return tag.filter((tag) => tag.name.search(regex) >= 0);
  }
  return tag;
}

export default function UpdateUser() {
  const navigation = useNavigation();
  const route = useRoute();
  const{colors, isDark} = useTheme();
  const ref_username =useRef();
  const ref_location = useRef();
  const ref_instagram_link = useRef();
  const ref_twitter_link = useRef();
  const ref_facebook_link = useRef();
  const ref_spotify_apple_link = useRef();

  const[userName, setUserName] = useState('');
  const[location, setLocation] = useState('');
  const[instagramLink, setInstagramLink] = useState('');
  const[twitterLink, setTwitterLink] = useState('');
  const[facebookLink, setFacebookLink] = useState('');
  const[spotifyAppleLink, setSpotifyAppleLink] = useState('');
  const[tags, setTags] = useState([]);
  const[tagInput, setTagInput] = useState(null);
  const[designationList, setDesignationList] = useState(CONSTANTS.COUM_DATA.designation);
  const[tagsList, setTagsList] = useState(CONSTANTS.COUM_DATA.tags);

  const[keyboardOffset,setKeyboardOffset] = useState(0);
  const[isLogin,setIsLogin] = useState(true);
  const[isOption,setIsOption] = useState(false);
  const[isForgotemail,setIsForgotemail] = useState(true);
  const[isForgotPin,setIsForgotPin] = useState(false);
  const[isTagsOption,setIsTagsOption] = useState(true);
  const[isForgotPasswordandConfirm,setIsForgotPasswordandConfirm] = useState(false);
  const[isRegister,setIsRegister] = useState(false);
  const[isForgotPassword,setIsForgotPassword] = useState(false);
  const[loginLoading, setLoginLoading] = useState(false);
  const[loading, setLoading] = useState(false);
  const[isSignUpOtp, setIsSignUpOtp] = useState(false);
  const[isDesignation, setIsDesignation] = useState(false);
  const searchTags = findTags(tagInput, tagsList);

  const style = StyleSheet.create({
      container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'stretch',
          backgroundColor: colors.background,
      },
      imgBackground: {
        position: 'absolute',
        top: -height/(DeviceInfo.hasNotch() ? 2 : 1.5),
        width: width,
        resizeMode: 'stretch'
      },
      forminput: {
          color: colors.textColor,
          borderBottomWidth: 0.5,
          borderColor: '#FFFFFF',
          fontFamily: 'SourceSansPro-Regular',
          fontSize: 14,
          padding: 0
      },
      option_button:{
        backgroundColor: colors.headerBackgroud,
        borderRadius: 10,
        marginTop: 20,
      },
      option_text: {
        padding: 12,
        fontSize: 20,
        fontFamily: 'SFProDisplay-Regular',
        fontWeight: '600',
        color: colors.textColor,
      }
  });

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    console.log('Update User: ', route.params);
    if (route.params.user.hasOwnProperty('user_name')) {
      setUserName(route.params.user.user_name);
    }

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = () => {
    setKeyboardOffset(Platform.OS === 'android' ? -100 : - (height / 4));
  };

  const _keyboardDidHide = () => {
    setKeyboardOffset(0);
  };

  function continueClick(status) {
    let designation = [];

    if (status == 'custom') {
      console.log('Customise');
      if (userName == '') {
        Snackbar.show({  text: 'Please enter user name',  duration: Snackbar.LENGTH_SHORT});
      }else {
        setIsOption(true);
        setIsTagsOption(false);
        setIsDesignation(true);
        //setIsTagsOption(false);
      }
    } else if (status == 'designation') {

      designationList.filter((row, index)=> {
        if (row.isCheck) {
          console.log('Row : ', row);
          designation.push(row._id);
        }
      });
      console.log('Designation : ', designation);

      if (designation.length == 0) {
        Snackbar.show({  text: 'Please select designation',  duration: Snackbar.LENGTH_SHORT});
        //setIsDesignation(false);
      }else {
        setIsDesignation(false);
      }
    }else if (status == 'tags') {
      console.log('Tags');
      if (tags.length < 4) {
        Snackbar.show({  text: 'Please enter 4 coum tags',  duration: Snackbar.LENGTH_SHORT});
        return;
      }else {
        designationList.filter((row, index)=> {
          if (row.isCheck) {
            console.log('Row : ', row);
            let obj = {id: row._id}
            designation.push(obj);
          }
        });
        let getTags = [];
        tags.filter((row, index)=> {
          let obj = {id: row._id}
          getTags.push(obj);
        });
        let obj = {
          user_name: userName,
          //subscribe: yes,
          location: location,
          instagram: instagramLink,
          twitter: twitterLink,
          facebook: facebookLink,
          spotify_apple: spotifyAppleLink,
          designation: JSON.stringify(designation),
          tags: JSON.stringify(getTags),
        };

        try {
          CONSTANTS.ACCESS_TOKEN = route.params.accessToken;
          setLoading(true);
          API.callUpdateUser(CONSTANTS.BASE_URL + 'user/update', obj)
            .then((response)=> {
              setLoading(false);
              console.log('Update User Response : ', JSON.stringify(response));
              if (response.error == 0) {
                onLoggedIn(response.user.request_token, response.user);
              }
            });
        } catch (e) {
          setLoading(false);
          console.log('Update Profile Error : ', e);
        }
      }
    }
  }

  function onLoggedIn(token, user) {
    CONSTANTS.ACCESS_TOKEN = token;
    FUNCTIONS.setItem('token', token);
    if (user != null) {
      FUNCTIONS.setItem('user', JSON.stringify(user));
      CONSTANTS.USER = user;
    }
    navigation.replace('TabScreens');
  }

  function designationItemClick(item) {
    let updateArray = designationList.map((row, index)=> {
      if (row._id == item._id) {
        if (item.isCheck) {
          row.isCheck = false;
        }else {
          row.isCheck = true;
        }
      }
      return row;
    });
    setDesignationList(updateArray);
  }

  function onTagsItemClick(item) {
    let updateTags = tags;
    console.log('updateTags', updateTags);
    updateTags.push(item);
    //setTags(updateTags);
    let pp = updateTags.filter( (ele, ind) => ind === updateTags.findIndex( elem => elem._id === ele._id && elem._id === ele._id));
    setTags(pp);
    setTagInput(null);
  }

  function onRemoveTags(item) {
    let updateTags = [];
    tags.map((row, index)=> {
      if (item._id != row._id) {
        updateTags.push(row);
      }
    });
    setTags(updateTags);
  }

  const renderDesignation = ({item, index}) => {
    return(
      <TouchableOpacity onPress={()=> designationItemClick(item)} style={[style.option_button, {backgroundColor: item.isCheck ? '#FBBB00' : '#1C1C1C'}]}>
        <Text style={[style.option_text, {color: item.isCheck ? '#0F0F0F' : '#FFFFFF'}]}>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  return(
      <View style={[style.container]}>
        {Platform.OS == "android" && <StatusBar backgroundColor="transparent" translucent/>}
        <Image source={background_} style={style.imgBackground}/>
        <Image source={background_blur} style={style.imgBackground}/>
        <View style={{position: 'absolute', top: height*0.06, width: width}}>
          <Image source={logo} style={{resizeMode: 'contain', width: 204, height: 123, alignSelf: 'center'}} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
          <View style={{ height: height}}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
              <View style={{paddingLeft: '10%', paddingRight: '10%', paddingLeft: 38, paddingRight: 38, marginTop: DeviceInfo.hasNotch() ? height*0.3 : height*0.35, marginBottom: 20}}>
                <Text style={{fontSize: 19, fontFamily: 'SFProDisplay-Regular', color: colors.textColor, alignSelf: 'center'}}>{isTagsOption ? "Customise your account" :isDesignation ? 'What best describes you?' : "Select 4 Coum Tags"}</Text>
                    {isTagsOption ?
                      <View>
                        <TouchableOpacity style={style.option_button}>
                          <TextInput
                              underlineColorAndroid="transparent"
                              style={style.option_text}
                              value={userName}
                              ref={ref_username}
                              onChangeText={(text) => { setUserName(text) }}
                              placeholder="UserName"
                              onSubmitEditing={() => ref_location.current.focus()}
                              placeholderTextColor={colors.textColor}
                              returnKeyType="next"
                              blurOnSubmit={true} />
                        </TouchableOpacity>
                        <TouchableOpacity style={style.option_button}>
                          <TextInput
                              underlineColorAndroid="transparent"
                              style={style.option_text}
                              value={location}
                              ref={ref_location}
                              onChangeText={(text) => { setLocation(text) }}
                              placeholder="Location"
                              placeholderTextColor={colors.textColor}
                              onSubmitEditing={() => ref_instagram_link.current.focus()}
                              returnKeyType="next"
                              blurOnSubmit={true} />
                        </TouchableOpacity>
                        <TouchableOpacity style={style.option_button}>
                          <TextInput
                              underlineColorAndroid="transparent"
                              style={style.option_text}
                              value={instagramLink}
                              ref={ref_instagram_link}
                              onChangeText={(text) => { setInstagramLink(text) }}
                              placeholder="Instagram Link"
                              keyboardType="url"
                              placeholderTextColor={colors.textColor}
                              onSubmitEditing={() => ref_twitter_link.current.focus()}
                              returnKeyType="next"
                              blurOnSubmit={true} />
                        </TouchableOpacity>
                        <TouchableOpacity style={style.option_button}>
                          <TextInput
                              underlineColorAndroid="transparent"
                              style={style.option_text}
                              value={twitterLink}
                              ref={ref_twitter_link}
                              onChangeText={(text) => { setTwitterLink(text) }}
                              placeholder="Twitter Link"
                              keyboardType="url"
                              placeholderTextColor={colors.textColor}
                              onSubmitEditing={() => ref_facebook_link.current.focus()}
                              blurOnSubmit={true} />
                        </TouchableOpacity>
                        <TouchableOpacity style={style.option_button}>
                          <TextInput
                              underlineColorAndroid="transparent"
                              style={style.option_text}
                              value={facebookLink}
                              ref={ref_facebook_link}
                              onChangeText={(text) => { setFacebookLink(text) }}
                              placeholder="Facebook Link"
                              keyboardType="url"
                              placeholderTextColor={colors.textColor}
                              onSubmitEditing={() => ref_spotify_apple_link.current.focus()}
                              returnKeyType="next"
                              blurOnSubmit={true} />
                        </TouchableOpacity>
                        <TouchableOpacity style={style.option_button}>
                          <TextInput
                              underlineColorAndroid="transparent"
                              style={style.option_text}
                              value={spotifyAppleLink}
                              ref={ref_spotify_apple_link}
                              onChangeText={(text) => { setSpotifyAppleLink(text) }}
                              placeholder="Spotify/Apply Music Link"
                              keyboardType="url"
                              placeholderTextColor={colors.textColor}
                              onSubmitEditing={Keyboard.dismiss}
                              returnKeyType="done"
                              blurOnSubmit={true} />
                        </TouchableOpacity>

                      </View>
                      :isDesignation ?
                      <View style={{flex: 1}}>
                        <FlatList
                           showsVerticalScrollIndicator={false}
                           data={designationList}
                           renderItem={renderDesignation}
                           keyExtractor={(item, index) => index.toString()}
                           />
                      </View>
                      :
                      <KeyboardAvoidingView>
                        <View style={{backgroundColor: isDark ? '#1C1C1C' : '#F2F2F4', borderColor: 'transparent', marginTop: 20, borderRadius: 10, minHeight: tags.length < 4 ? 230 : 190}}>
                          {tags.length < 4 &&
                            <View style={{marginLeft: 10, marginRight: 15, marginTop: 4, zIndex: 1}}>
                              <Autocomplete
                                data={searchTags.length === 1 && comp(tagInput, searchTags[0].name) ? [] : searchTags}
                                value={tagInput}
                                keyboardShouldPersistTaps="never"
                                hideResults={tagInput != null ? false : true}
                                onChangeText={(text) => setTagInput(text)}
                                placeholder="Search tags..."
                                style={{backgroundColor: isDark ? '#000000' : '#FFFFFF', padding: 8, borderWidth: 0, borderColor: 'transparent', borderRadius: 8, color: colors.textColor}}
                                inputContainerStyle={{marginLeft: 10, marginBottom: 6, overflow: 'hidden', backgroundColor: isDark ? '#FFFFFF' : '#000000', borderWidth: 0, backgroundColor: isDark ? '#000000' : '#FFFFFF', borderRadius: 8}}
                                flatListProps={{
                                  keyExtractor: (_, idx) => idx.toString(),
                                  renderItem: ({ item }) =>
                                    <TouchableOpacity style={{backgroundColor: isDark ? '#000000' : '#FFFFFF'}} onPress={()=> onTagsItemClick(item)}>
                                      <Text style={{padding: 4, color: colors.textColor, fontSize: 14, fontFamily: 'SourceSansPro-Regular'}}>{item.name}</Text>
                                    </TouchableOpacity>,
                                }}
                              />
                            </View>
                          }
                          {tags.map((row,index)=> {
                            return(
                              <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 15/2, marginBottom: 15/2, marginLeft: 15, marginRight: 15}}>
                                <TouchableOpacity onPress={()=> onRemoveTags(row)} style={{backgroundColor: '#FBBB00', width: 30, height: 30, borderRadius: 30/2, justifyContent: 'center', alignItems: 'center'}}>
                                  <Text style={{fontFamily: 'SFProDisplay-Regular', fontSize: 18, color: '#000000', fontWeight: '800', alignSelf: 'center'}}>X</Text>
                                </TouchableOpacity>
                                <Text style={{color: colors.textColor, fontFamily: 'SFProDisplay-Regular', fontSize: 23, marginLeft: 10}}>{row.name}</Text>
                              </View>
                            )
                          })
                          }
                        </View>
                      </KeyboardAvoidingView>
                    }
                    <TouchableOpacity
                        style={{backgroundColor: '#FBBB0E', minWidth: 255, marginTop: isTagsOption ? 25 : '90%', marginRight: '10%', marginLeft: '10%', marginTop: 50, borderRadius: 20, height: 46, justifyContent: 'center', position: (!isDesignation && !isTagsOption) ? 'absolute' : 'relative', top: (!isDesignation && !isTagsOption) ? 0 : 0, overflow: 'hidden'}}
                        isLoading={loading}
                        onPress={() => continueClick(isTagsOption ? 'custom' :isDesignation ? 'designation' : 'tags')}
                        indicatorCount={10}>
                        <View style={{opacity: 0.6}}>
                          <Text style={{alignSelf: 'center', color: '#1B1B1B', paddingLeft: 40, paddingRight: 40, fontFamily: 'SourceSansPro-Regular', fontSize: 16, textTransform: 'uppercase'}}>Continue</Text>
                        </View>
                    </TouchableOpacity>
              </View>
            </ScrollView>
            </View>
        </ScrollView>
      </View>
    );
}
