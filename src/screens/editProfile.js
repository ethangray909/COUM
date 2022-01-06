'use strict';

import React, { useRef, useEffect, useState } from 'react';
import {
  Text,
  View,
  TextInput,
  Platform,
  Modal,
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
  FlatList,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SpinnerButton from 'react-native-spinner-button';
import ImagePicker from 'react-native-image-crop-picker';
import DynamicImage from '../components/dynamicImage';
import Snackbar from 'react-native-snackbar';
import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
const axios = require('axios');

import Header from '../global/header';
const API = require('../network/api.js');
const CONSTANTS = require('../global/constants.js');
const FUNCTIONS = require('../global/functions.js');
import useGlobalStyles from '../styles/Styles';

import user from '../images/user.png';
import cover from '../images/cover.png';
import menu from '../images/menu.png';
import hardwell from '../images/hardwell.png';
import { sampleImages } from '../assets/images';

import NewImagePicker from '../components/ImagePicker';



let { height, width } = Dimensions.get('window');
let notchPadding = DeviceInfo.hasNotch() ? 21 : 0;
let margin = 15;

export default function EditProfile() {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const styles = useGlobalStyles();
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [userDesc, setUserDesc] = useState('');
  const [location, setLocation] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [twitterLink, setTwitterLink] = useState('');
  const [facebookLink, setFacebookLink] = useState('');
  const [spotifyLink, setSpotifyLink] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [userProfileImage, setUserProfileImage] = useState(null);
  const imagePickerRef = useRef(null)
  const imagePickerRef2 = useRef(null)
  const style = StyleSheet.create({
    forminput: {
      color: colors.textColor,
      borderBottomWidth: 0.5,
      borderColor: colors.textColor,
      fontFamily: 'SourceSansPro-Regular',
      fontSize: 14,
      padding: 0,
      marginTop: 4
    },
    itemView: {
      marginTop: 20,
      padding: 15,
      backgroundColor: colors.headerBackgroud,
      borderRadius: 6,
    },
    titleText: {
      fontSize: 14,
      fontFamily: 'SourceSansPro-Regular',
      fontWeight: '500',
      color: colors.textColor
    },
    dropdownText: {
      textAlign: 'left',
      paddingLeft: 0,
      marginLeft: 0,
      color: colors.textColor,
      fontFamily: 'SourceSansPro-Regular',
      fontSize: 16
    },
    optionAddButton: {
      backgroundColor: colors.buttonBackground, height: 21, width: 40, borderRadius: 5, justifyContent: 'center', marginTop: 8
    },
    optionButtonText: {
      fontWeight: 'bold', fontSize: Platform.OS == 'android' ? 20 : 16, alignSelf: 'center', textAlign: 'center', alignSelf: 'center', paddingBottom: Platform.OS == 'android' ? 2 : 4
    },
    modalView: {
      flex: 1, backgroundColor: colors.background
    },
    modalTitleView: {
      flexDirection: 'row', justifyContent: 'space-between', marginTop: DeviceInfo.hasNotch() ? 50 : 15, marginLeft: 20, marginRight: 20
    },
    modalTitle: {
      flex: 1, fontFamily: 'AcuminPro-Regular', fontSize: 23, color: isDark ? '#FFFFFF' : '#384149', textAlign: 'center'
    }
  });

  useEffect(() => {
    getProfileData();
  }, []);

  function edituserInfo() {
    try {
      setLoading(true)
      let url = CONSTANTS.BASE_URL + 'user/update';
      let params = {
        user_name: userName,
        location: location,
        description: userDesc,
        instagram: instagramLink,
        twitter: twitterLink,
        facebook: facebookLink,
        spotify_apple: spotifyLink
      }
      console.log('Edit user parmas:::', params);
      API.callUpdateUser(url, params)
        .then((response) => {
          setLoading(false)
          console.log('Edit User Response: ', JSON.stringify(response));
          if (response.error == 0) {
            navigation.goBack()
          }
        });
    }
    catch (e) {
      console.log('GetUserError : ', e);
    }
  }

  function getProfileData() {
    try {
      let url = CONSTANTS.BASE_URL + 'get/user';
      API.callUserApi(url, {}, this, 'GET')
        .then((response) => {
          console.log('Get User Response: ', (response));//JSON.stringify(response)
          if (response.error == 0) {
            setUserName(response.user.user_name);
            setUserDesc(response.user.description);
            setLocation(response.user.location);
            setInstagramLink(response.user.instagram);
            setTwitterLink(response.user.twitter);
            setFacebookLink(response.user.facebook);
            setSpotifyLink(response.user.spotify_apple);
            setCoverImage(response.user.cover_pic);
            setUserProfileImage(response.user.profile_image);
          }
        });
    } catch (e) {
      console.log('GetUserError : ', e);
    }
  }

  function uploadImages(coverImage, profileImage) {
    console.log('Upload Work', coverImage);
    try {
      Keyboard.dismiss();
      API.callUploadUserImages(CONSTANTS.BASE_URL + 'user', profileImage, coverImage)
        .then((response) => {
          console.log('user image Upload Response : ', response);
          if (response?.error == 0) {
            //setCoverImage(res);
          }
          Snackbar.show({ text: response?.message, duration: Snackbar.LENGTH_SHORT });
        });
    } catch (e) {
      console.log("Upload Error: ", e);
    }
  }

  const handleOnSelectImage2 = async success => {

    console.log('handleOnSelectImage', success);
    // this.setState({
    //   userShowImage: success[0]?.uri,
    //   image: success[0]
    // });

    try {

      // console.log(image);
      console.log('onProfileImagePicker image: ', success[0]);
      let obj = {};
      obj.filepath = Platform.OS == 'android' ? success[0].uri : success[0].uri;
      obj.filename = success[0].fileName;
      obj.filetype = success[0].type;
      obj.size = FUNCTIONS.bytesToSize(success[0].fileSize);
      setCoverImage(Platform.OS == 'android' ? success[0].uri : success[0].uri);
      uploadImages(obj, null);

    }
    catch (e) {

    }

  };

  function onCoverIamgePicker() {
    imagePickerRef2.current.show()
    // try {
    //   ImagePicker.openPicker({
    //     cropping: false,
    //     mediaType: 'photo'
    //   }).then(image => {
    //     console.log(image);
    //     let obj = {};
    //     obj.filepath = Platform.OS == 'android' ? image.path : image.sourceURL;
    //     obj.filename = image.filename;
    //     obj.filetype = image.mime;
    //     obj.size = FUNCTIONS.bytesToSize(image.size);
    //     setCoverImage(Platform.OS == 'android' ? image.path : image.sourceURL);
    //     uploadImages(obj, null);
    //   });
    // } catch (e) {
    //   console.log('Cover Upload error: ', e);
    // }
  }

  const handleOnSelectImage = async success => {

    console.log('handleOnSelectImage', success);
    // this.setState({
    //   userShowImage: success[0]?.uri,
    //   image: success[0]
    // });

    try {

      // console.log(image);
      console.log('onProfileImagePicker image: ', success[0]);
      let obj = {};
      obj.filepath = Platform.OS == 'android' ? success[0].uri : success[0].uri;
      obj.filename = success[0].fileName;
      obj.filetype = success[0].type;
      obj.size = FUNCTIONS.bytesToSize(success[0].fileSize);
      setUserProfileImage(Platform.OS == 'android' ? success[0].uri : success[0].uri);
      uploadImages(null, obj);

    }
    catch (e) {

    }

  };

  function onProfileIamgePicker() {
    console.log('onProfileImagePicker');


    try {
      // handleOnSelectImage()
      imagePickerRef.current.show()
      // ImagePicker.openPicker({
      //   cropping: false,
      //   mediaType: 'photo'
      // }).then(image => {
      //   // console.log(image);
      //   console.log('onProfileImagePicker image: ', image);
      //   let obj = {};
      //   obj.filepath = Platform.OS == 'android' ? image.path : image.sourceURL;
      //   obj.filename = image.filename;
      //   obj.filetype = image.mime;
      //   obj.size = FUNCTIONS.bytesToSize(image.size);
      //   setUserProfileImage(Platform.OS == 'android' ? image.path : image.sourceURL);
      //   uploadImages(null, obj);
      // }).catch(e => { console.log('onProfileImagePicker error1: ', e) })
    } catch (e) {
      console.log('onProfileImagePicker error2: ', e);
    }
  }

  return (
    <View style={styles.container}>
      <Header
        isBackButton={true}
        isInbox={false}
        title="Edit Profile"
        isIcon={false} />


      <ScrollView style={{ width: '100%', height: '100%' }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          {coverImage != null ?
            <DynamicImage url={coverImage} resizeMode="cover" style={{ height: 230, width: width }} />
            :
            < Image source={sampleImages.placeholderImage} // cover
              resizeMode="cover" style={{
                height: 230, width: width, marginTop: margin, borderTopLeftRadius: 8, borderTopRightRadius: 8,
                // backgroundColor: 'red',
                // tintColor: 'gray'
              }} />
          }
          <TouchableOpacity onPress={() => onCoverIamgePicker()} style={{ position: 'absolute', top: 180, backgroundColor: '#FFFFFF', right: 25, borderRadius: 35 / 2 }}>
            <FontAwesome name="camera" size={20} color="#000000" style={{ padding: 8 }} />
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

            {userProfileImage != null ?
              <DynamicImage url={userProfileImage} style={{ width: 111, height: 111, borderRadius: 111 / 2, alignSelf: 'center', marginTop: -111 / 2, borderWidth: 1, borderColor: colors.textColor }} />
              :
              <Image source={sampleImages.placeholderProfileImage} // user
                style={{ width: 111, height: 111, borderRadius: 111 / 2, alignSelf: 'center', marginTop: -111 / 2, borderWidth: 1, borderColor: colors.textColor }} />
            }
            <TouchableOpacity onPress={() => onProfileIamgePicker()} style={{ position: 'absolute', backgroundColor: '#FFFFFF', right: -10, top: 15, borderRadius: 35 / 2 }}>
              <FontAwesome name="camera" size={20} color="#000000" style={{ padding: 8 }} />
            </TouchableOpacity>
            <NewImagePicker
              ref={imagePickerRef}//{e => (this.imagePickerRef = e)}
              handleOnSelectImage={handleOnSelectImage}
            />
            <NewImagePicker
              ref={imagePickerRef2}//{e => (this.imagePickerRef = e)}
              handleOnSelectImage={handleOnSelectImage2}
            />
          </View>
        </View>
        <View style={{ marginLeft: 20, marginRight: 20 }}>
          <View style={style.itemView}>
            <Text style={style.titleText}>User Name</Text>
            <TextInput
              underlineColorAndroid="transparent"
              style={style.forminput}
              value={userName}//{title}
              autoFocus={false}
              returnKeyType={'next'}
              autoCapitalize="words"
              autoCorrect={false}
              autoCapitalize="words"
              placeholder={'Enter user name'}
              onChangeText={(text) => { setUserName(text) }}
              placeholderTextColor={colors.text2Color}
              blurOnSubmit={false} />
          </View>
          <View style={style.itemView}>
            <Text style={style.titleText}>Description</Text>
            <TextInput
              underlineColorAndroid="transparent"
              style={style.forminput}
              value={userDesc}
              autoFocus={false}
              returnKeyType={'next'}
              autoCapitalize="sentences"
              autoCorrect={false}
              autoCapitalize="sentences"
              multiline
              placeholder="Tell us something about you"
              onChangeText={(text) => { setUserDesc(text) }}
              placeholderTextColor={colors.text2Color}
              blurOnSubmit={false} />
          </View>
          <View style={style.itemView}>
            <Text style={style.titleText}>Location</Text>
            <TextInput
              underlineColorAndroid="transparent"
              style={style.forminput}
              value={location}//{title}
              autoFocus={false}
              returnKeyType={'next'}
              autoCapitalize="words"
              autoCorrect={false}
              autoCapitalize="words"
              placeholder={'Ex. Las Vegas, USA'}
              onChangeText={(text) => { setLocation(text) }}
              placeholderTextColor={colors.text2Color}
              blurOnSubmit={false} />
          </View>
          <View style={style.itemView}>
            <Text style={style.titleText}>Instagram Link</Text>
            <TextInput
              underlineColorAndroid="transparent"
              style={style.forminput}
              value={instagramLink}//{title}
              autoFocus={false}
              returnKeyType={'next'}
              autoCapitalize="none"
              autoCorrect={false}
              autoCapitalize="none"
              placeholder={'Ex. www.instagram.com'}
              onChangeText={(text) => { setInstagramLink(text) }}
              placeholderTextColor={colors.text2Color}
              blurOnSubmit={false} />
          </View>
          <View style={style.itemView}>
            <Text style={style.titleText}>Twitter Link</Text>
            <TextInput
              underlineColorAndroid="transparent"
              style={style.forminput}
              value={twitterLink}//{title}
              autoFocus={false}
              returnKeyType={'next'}
              autoCapitalize="none"
              autoCorrect={false}
              autoCapitalize="none"
              placeholder={'Ex. www.twitter.com'}
              onChangeText={(text) => { setTwitterLink(text) }}
              placeholderTextColor={colors.text2Color}
              blurOnSubmit={false} />
          </View>
          <View style={style.itemView}>
            <Text style={style.titleText}>Facebook Link</Text>
            <TextInput
              underlineColorAndroid="transparent"
              style={style.forminput}
              value={facebookLink}//{title}
              autoFocus={false}
              returnKeyType={'next'}
              autoCapitalize="none"
              autoCorrect={false}
              autoCapitalize="none"
              placeholder={'Ex. www.facebook.com'}
              onChangeText={(text) => { setFacebookLink(text) }}
              placeholderTextColor={colors.text2Color}
              blurOnSubmit={false} />
          </View>
          <View style={style.itemView}>
            <Text style={style.titleText}>Spotify/Apple Music Link</Text>
            <TextInput
              underlineColorAndroid="transparent"
              style={style.forminput}
              value={spotifyLink}//{title}
              autoFocus={false}
              returnKeyType={'next'}
              autoCapitalize="none"
              autoCorrect={false}
              autoCapitalize="none"
              placeholder={'Ex. www.spotify.com'}
              onChangeText={(text) => { setSpotifyLink(text) }}
              placeholderTextColor={colors.text2Color}
              blurOnSubmit={false} />
          </View>
          <TouchableOpacity
            style={[styles.submitButton, { marginTop: 25 }]}
            isLoading={loading}
            onPress={() => edituserInfo()}
            indicatorCount={10}>
            {/* Edit Information */}
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}
