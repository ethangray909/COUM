'use strict';

import React, { useRef, useEffect, useState } from 'react';
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
import SpinnerButton from 'react-native-spinner-button';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Snackbar from 'react-native-snackbar';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FastImage from 'react-native-fast-image';
import * as Progress from 'react-native-progress';
import ToggleSwitch from 'toggle-switch-react-native'
import Video from 'react-native-video';
import { useTheme, useNavigation, useRoute } from '@react-navigation/native';

import LinkedSocialMediaContainer from '../components/linkedSocialMedia';
import ConnectionContainer from '../components/connection';
import DynamicImage from '../components/dynamicImage';
import useGlobalStyles from '../styles/Styles';

import user_cover from '../images/user_cover.png';
import img_upload from '../images/img_upload.png';
import logo from '../images/logo.png';
import user_profile from '../images/user_profile.png';
import locationPin from '../images/img_location_pin.png';
import hardwell from '../images/hardwell.png';
import img_song_cover from '../images/img_song_cover.png';
import img_play from '../images/img_play.png';
let notchPadding = DeviceInfo.hasNotch() ? 21 : 0;

let { height, width } = Dimensions.get('window');
const API = require('../network/api.js');
const CONSTANTS = require('../global/constants.js');
const FUNCTIONS = require('../global/functions.js');

let userId = '';

export default function UserProfile(props) {
  const route = useRoute();
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const styles = useGlobalStyles();
  const [connections, setConnections] = useState([]);
  const [songs, setSongs] = useState([]);
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);
  const [user, setUser] = useState('');
  const [openSetting, setOpenSetting] = useState(false);
  const [postNotification, setPostNotification] = useState(true);
  const [blockAccount, setBlockAccount] = useState(false);
  const [muteAccount, setMuteAccount] = useState(false);
  const [isExtraOption, setExtraOption] = useState();
  const [experience, setExperience] = useState(null);
  const [education, setEducation] = useState(null);
  const [skills, setSkills] = useState(null);
  const [services, setServices] = useState([]);

  const style = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'stretch',
      backgroundColor: colors.backgroundColor
    },
    settingButton: {
      width: 42,
      height: 42,
      borderRadius: 42 / 2,
      backgroundColor: isDark ? '#141414' : '#FFFFF3',
      position: 'absolute',
      justifyContent: 'center',
      right: 15,
      top: -42 / 2,
      shadowColor: '#000000',
      shadowRadius: 3.84,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      elevation: 3
    },
    txtUsereName: {
      fontSize: 25,
      fontFamily: 'SFProDisplay-Regular',
      color: isDark ? '#FFFFFF' : '#384149'
    },
    txtUserAddress: {
      fontSize: 14,
      fontFamily: 'SFProDisplay-Regular',
      color: isDark ? '#FFFFFF' : '#B7BABD',
      marginLeft: 8
    },
    txtUserDetail: {
      color: isDark ? '#FFFFFF' : '#000000',
      fontSize: 15,
      fontFamily: 'SourceSansPro-Regular',
      marginTop: 10,
      marginLeft: 15,
      marginRight: 15,
    },
    tagsView: {
      marginLeft: 4,
      marginRight: 4,
      backgroundColor: '#FBBB00',
      borderRadius: 8
    },
    txtTags: {
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 4,
      paddingBottom: 4,
      color: '#000000',
      fontFamily: 'SourceSansPro-Regular',
      fontSize: 11,
    },
    txtHeading: {
      color: isDark ? '#FFFFFF' : '#B7BABD',
      fontFamily: Platform.OS == 'ios' ? 'SFProDisplay-Regular' : 'SFProDisplay-Bold',
      fontSize: 15,
      fontWeight: 'bold',
    },
    btnSeeAll: {
      backgroundColor: isDark ? '#141414' : '#ECECEC',
      borderRadius: 8,
      justifyContent: 'center',
      paddingLeft: 6,
      paddingRight: 6,
      paddingTop: 2,
      paddingBottom: 2
    },
    txtSeeAll: {
      color: isDark ? '#8E8E93' : '#8E8E93',
      fontSize: 10,
      fontFamily: 'SourceSansPro-Regular'
    },
    txtSongTitle: {
      flex: 0.6,
      color: colors.textColor,
      fontSize: 12,
      fontFamily: 'SourceSansPro-Regular',
      textAlign: 'left'
    },
    txtSinger: {
      flex: 0.4,
      color: '#8E8E93',
      fontSize: 10,
      fontFamily: 'SourceSansPro-Regular',
      textAlign: 'right'
    },
    txtMoreInfo: {
      fontFamily: 'SourceSansPro-Regular',
      fontSize: 13,
      color: isDark ? '#FFFFFF' : '#8E8E93'
    },
    txtService: {
      fontFamily: 'SFProDisplay-Regular',
      fontWeight: 'bold',
      fontSize: 15,
      color: isDark ? '#FFFFFF' : '#8E8E93'
    },
    settingItemView: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 15
    },
    settingText: {
      flex: 1,
      fontSize: 15,
      fontFamily: 'SourceSansPro-Regular',
      color: colors.textColor
    },
    extraOptionView: {
      flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 8, paddingRight: 8, alignItems: 'center'
    },
    optionDot: {
      width: 5, height: 5, borderRadius: 5 / 2, backgroundColor: '#FFFFFF', alignSelf: 'center', marginRight: 5
    },
    optionTitleView: {
      backgroundColor: colors.buttonBackground, height: 21, width: 40, borderRadius: 5, justifyContent: 'center'
    },
    optionTitle: {
      fontWeight: 'bold', fontSize: Platform.OS == 'android' ? 20 : 16, alignSelf: 'center', textAlign: 'center', alignSelf: 'center', paddingBottom: Platform.OS == 'android' ? 2 : 4
    },
    cellView: {
      marginLeft: 12, marginRight: 12
    },
    cellDot: {
      width: 3, height: 3, borderRadius: 3 / 2, borderWidth: 1, borderColor: '#FBBB00', backgroundColor: '#FBBB00'
    },
    cellTitle: {
      color: isDark ? '#FFFFFF' : '#8E8E93', marginLeft: 10, fontFamily: 'SourceSansPro-Regular', fontWeight: 'bold', fontSize: 12
    },
    cellDescriptionView: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent', borderColor: isDark ? '#FFFFFF' : '#8E8E93', borderLeftWidth: 1
    },
    cellDescription: {
      color: isDark ? '#FFFFFF' : '#8E8E93', marginLeft: 12, fontFamily: 'SourceSansPro-Regular', fontWeight: '600', fontSize: 10
    }
  });

  // console.log('props.router.params : ', props?.route?.params);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('Route : ', route);

      if (route.params != undefined) {
        console.log('User Id : ', route.params.userId);
        getCalledApi(route.params.userId);
        userId = route.params.userId;
      } else {
        getCalledApi('');
        userId = '';
      }
    });

    return unsubscribe
  }, [route]);

  function getCalledApi(userId) {
    console.log('getProfile action called: ',);
    try {
      let url = CONSTANTS.BASE_URL + 'get/user';
      if (userId != '') {
        url = CONSTANTS.BASE_URL + 'user/' + userId;
      }
      API.callUserApi(url, {}, this, 'GET')
        .then((response) => {
          console.log('Get User Response: ', (response)); //JSON.stringify
          if (response.error == 0) {
            if (response.user._id == CONSTANTS.USER._id) {
              CONSTANTS.USER = response.user;
              FUNCTIONS.setItem('user', JSON.stringify(response.user));
              console.log('Set data for local storage');
            }
            setUser(response.user);
            setConnections(response.user.connections);
            setSongs(response.user.works.songs);
            setExperience(response.user.experience);
            setEducation(response.user.education);
            setSkills(response.user.skills);
            if (response.user.hasOwnProperty('purchased_services')) {
              if (response.user.purchased_services.length != 0) {
                setServices(response.user.purchased_services);
              } else {
                setServices(response.user.services);
              }
            } else {
              setServices(response.user.services);
            }

            let allVideo = [];
            response.user.works.videos.filter((row, index) => {
              row.work.filter((cell, idx) => {
                cell.isPlay = false;
                allVideo.push(cell);
                console.log('Cell : ', cell);
              });
            });

            setVideos(allVideo);
            let allImage = [];
            response.user.works.images.filter((row, index) => {
              row.work.filter((cell, idx) => {
                allImage.push(cell);
              });
            });
            setImages(allImage);
          }
        });
    } catch (e) {
      console.log('GetUserError : ', e);
    }
  }

  function btnFollowClick() {
    try {
      let obj = {
        connection_id: user._id,
        user_name: CONSTANTS.USER.user_name,
        location: CONSTANTS.USER.location
      };
      API.callUserApi(CONSTANTS.BASE_URL + 'user/update', obj, this, "PUT")
        .then((response) => {
          console.log('Update User Response : ', JSON.stringify(response));
          if (response.error == 0) {
            user.already_followed = 'Following';
          }
          Snackbar.show({ text: response.message, duration: Snackbar.LENGTH_SHORT });
        });
    } catch (e) {
      console.log('User Update Error : ', e);
    }
  }

  const onSetting = () => {
    console.log('Setting Tapped');
    if (userId == '') {
      navigation.navigate('AccountSettings');
    } else {
      setOpenSetting(true);
    }
  }

  const onMenuItemClick = (item) => {
    //console.log('Item : ', JSON.stringify(item));
    let updateMenu = [];
    for (var i = 0; i < menu.length; i++) {
      let object = menu[i];
      if (item.isOpen) {
        object.isOpen = false;
      } else {
        if (item.title == menu[i].title) {
          object.isOpen = true;
        } else {
          object.isOpen = false;
        }
      }
      updateMenu.push(object);
      //console.log('Object : ',object);
    }
    setMenu([...updateMenu]);
    console.log('updateMenu : ', JSON.stringify(updateMenu));
  }

  const onServicesClick = (item) => {
    let obj = {};
    if (user.hasOwnProperty('purchased_services')) {
      if (user.purchased_services.length != 0) {
        obj.purchased_services = true;
      } else {
        obj.purchased_services = false;
      }
    } else {
      obj.purchased_services = false;
    }
    obj.allServices = services;
    obj.item = item;
    console.log('params: ', obj);
    navigation.navigate('Services', obj);
  }

  function playSound(item) {
    console.log('PlaySound: ', item);
  }

  function onPlayVideo(item) {
    let updateVideo = [];
    videos.filter((row, index) => {
      if (row.work == item.work) {
        row.isPlay = true;
      } else {
        row.isPlay = false;
      }
      updateVideo.push(row);
    });
    setVideos(updateVideo);
  }

  function onDismissVideoClick() {
    console.log('onDismissVideoClick');
    let updateVideo = [];
    videos.filter((row, index) => {
      row.isPlay = false;
      updateVideo.push(row);
    });
    setVideos(updateVideo);
  }

  const onItemClick = (selectedTab) => {
    console.log('navigate to tab : ', selectedTab);
    if (selectedTab == 'connection') {

    } else {
      navigation.navigate('MyFiles', { selectedTab: selectedTab });
    }

  }

  function onConnectionClick(item) {
    console.log('onConnectionClick : ', item);
  }

  return (
    <View style={styles.container}>
      <FastImage source={user.cover_pic != null ? { uri: user.cover_pic } : user_cover} resizeMode="cover" imageStyle={{ width: '100%', height: 216, }} style={{ height: 216, width: '100%', }} />
      <TouchableOpacity style={{ position: 'absolute', top: notchPadding + 10, left: 10 }}>
        <FastImage source={img_upload} imageStyle={{ width: 18, height: 26, marginTop: 10, marginLeft: 10 }} />
      </TouchableOpacity>

      {user._id != CONSTANTS.USER._id &&
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.close_button}>
          <AntDesign name="close" color={isDark ? '#000000' : "#FFFFFF"} size={15} />
        </TouchableOpacity>
      }

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <FastImage source={user.profile_image != null ? { uri: user.profile_image } : user_profile} style={{ width: 111, height: 111, borderRadius: 111 / 2, alignSelf: 'center', marginTop: -111 / 2 }} />

        <TouchableOpacity onPress={() => onSetting()} style={style.settingButton}>
          <AntDesign name="setting" color={isDark ? '#FFFFFF' : '#384149'} size={24} style={{ alignSelf: 'center' }} />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 15 }}>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={2} style={style.txtUsereName}>{user.user_name}</Text>
            <View style={{ flexDirection: 'row', marginTop: 4, alignItems: 'center' }}>
              <SimpleLineIcons name="location-pin" size={14} color={isDark ? '#FFFFFF' : '#B7BABD'} />
              <Text style={style.txtUserAddress}>{user.location}</Text>
            </View>
          </View>
          {user._id != CONSTANTS.USER._id &&
            <TouchableOpacity disabled={user.already_followed} onPress={() => btnFollowClick()} style={styles.btnFollowView}>
              <Text style={styles.txtFollowButton}>{user.already_followed ? 'Following' : 'Follow'}</Text>
            </TouchableOpacity>
          }
        </View>

        <Text numberOfLines={2} style={style.txtUserDetail}>{user.description}</Text>

        <View>
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            horizontal
            style={{ marginTop: 15, marginLeft: 15 }}
            data={user.tags}
            renderItem={({ index, item }) =>
              <View style={style.tagsView}>
                <Text style={style.txtTags}>{item.name}</Text>
              </View>
            }
            keyExtractor={(item, index) => index.toString()} />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginLeft: 15, marginRight: 15 }}>
          <Text style={style.txtHeading}>Connections</Text>
          <TouchableOpacity onPress={() => onItemClick('connection')} style={style.btnSeeAll}>
            <Text style={style.txtSeeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <View>
          <ConnectionContainer imageStyle={styles.connectionsImage} data={connections} itemStyle={styles.connectionsView} onItemClick={(item) => onConnectionClick(item)} />
        </View>

        <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#B7BABD', marginLeft: 15, marginRight: 15, marginTop: 15, fontFamily: 'SFProDisplay-Regular' }}>LINKED SOCIAL MEDIA</Text>
        <LinkedSocialMediaContainer
          itemStyle={styles.socialMediaView}
          spotify_apple={user.spotify_apple}
          youtube={user.youtube}
          facebook={user.facebook}
          instagram={user.instagram}
          twitter={user.twitter}
          soundcloud={user.soundcloud}
        />

        {songs.length != 0 &&
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginLeft: 15, marginRight: 15 }}>
              <Text style={style.txtHeading}>{userId == '' ? 'My SONGS' : 'SONGS'}</Text>
              <TouchableOpacity onPress={() => onItemClick('songs')} style={style.btnSeeAll}>
                <Text style={style.txtSeeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            <View>
              <FlatList
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={{ marginTop: 15, marginLeft: 15, marginRight: 15 }}
                data={songs}
                renderItem={({ index, item }) =>
                  <TouchableOpacity style={{ flexDirection: 'row', marginTop: index == 0 ? 0 : 10 }} onPress={() => playSound(item)}>
                    <FastImage source={img_song_cover} style={{ width: 46, height: 46, borderRadius: 5, alignSelf: 'center' }} />
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text numberOfLines={1} style={style.txtSongTitle}>{item.title}</Text>
                        <Text numberOfLines={1} style={style.txtSinger}>{item.singer}</Text>
                      </View>
                      <Text style={{ color: '#8E8E93', fontSize: 10, fontFamily: 'SourceSansPro-Regular' }}>{item.album}</Text>
                      <Text style={{ color: '#8E8E93', fontSize: 10, fontFamily: 'SourceSansPro-Regular' }}>Duration: {item.duration}</Text>

                      <View style={{ height: 1, backgroundColor: isDark ? '#8E8E93' : '#ECECEC', opacity: 0.14, marginTop: 4 }} />
                    </View>
                  </TouchableOpacity>
                }
                keyExtractor={(item, index) => index.toString()} />
            </View>
          </View>
        }

        {videos.length != 0 &&
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginLeft: 15, marginRight: 15 }}>
              <Text style={style.txtHeading}>{userId == '' ? 'MY VIDEOS' : 'VIDEOS'}</Text>
              <TouchableOpacity onPress={() => onItemClick('video')} style={style.btnSeeAll}>
                <Text style={style.txtSeeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            <View>
              <FlatList
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                horizontal
                style={{ marginTop: 15, paddingLeft: 15, paddingRight: 10 }}
                data={videos}
                renderItem={({ index, item }) =>
                  <View style={{ width: height * 0.17, height: height * 0.09, borderRadius: 8, marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <Video
                      source={{ uri: item.work }}
                      rate={1.0}
                      paused={item.isPlay ? false : true}
                      muted={false}
                      fullscreen={item.isPlay ? true : false}
                      onFullscreenPlayerDidDismiss={() => onDismissVideoClick()}
                      resizeMode="cover"
                      style={{ width: '100%', height: '100%', borderRadius: 8 }}
                    />
                    <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#000000', opacity: 0.5, borderRadius: 8 }} />
                    <TouchableOpacity onPress={() => onPlayVideo(item)} style={{ position: 'absolute', }}>
                      <FastImage source={img_play} style={{ width: 13, height: 13, alignSelf: 'center' }} />
                    </TouchableOpacity>
                  </View>
                }
                keyExtractor={(item, index) => index.toString()} />
            </View>
          </View>
        }

        {images.length != 0 &&
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginLeft: 15, marginRight: 15 }}>
              <Text style={style.txtHeading}>{userId == '' ? 'MY IMAGES' : 'IMAGES'}</Text>
              <TouchableOpacity onPress={() => onItemClick('image')} style={style.btnSeeAll}>
                <Text style={style.txtSeeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            <View>
              <FlatList
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                horizontal
                style={{ marginTop: 15, paddingLeft: 15, paddingRight: 10 }}
                data={images}
                renderItem={({ index, item }) =>
                  <View style={{ width: height * 0.17, height: height * 0.09, borderRadius: 8, marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <DynamicImage
                      url={item.work}
                      //indicator={Progress.Circle}
                      //imageStyle={{width: '100%' , height: '100%', borderRadius: 8}}
                      // indicatorProps={{
                      //   color: colors.textColor,
                      // }}
                      style={{ width: '100%', height: '100%', borderRadius: 8 }} />
                  </View>
                }
                keyExtractor={(item, index) => index.toString()} />
            </View>
          </View>
        }

        <View style={{ marginTop: 15 }}>
          {experience != null &&
            <View>
              <TouchableOpacity onPress={() => setExtraOption(isExtraOption == 'experience' ? '' : 'experience')} style={style.extraOptionView}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 4, paddingBottom: 4 }}>
                  <View style={style.optionDot} />
                  <Text style={[style.txtHeading, { textTransform: 'uppercase' }]}>experience</Text>
                </View>
                <View style={style.optionTitleView}>
                  <Text style={style.optionTitle}>{isExtraOption == 'experience' ? '-' : '+'}</Text>
                </View>
              </TouchableOpacity>
              {isExtraOption == 'experience' &&
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  data={experience}
                  renderItem={({ index, item }) =>
                    <View key={index} style={style.cellView}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={style.cellDot} />
                        <Text style={style.cellTitle}>{item.title}</Text>
                      </View>

                      <View style={style.cellDescriptionView}>
                        <Text style={style.cellDescription}>{item.headline + '\n' + item.employment_type + '\n' + item.start_date + ' - ' + item.end_date}.</Text>
                      </View>

                    </View>
                  }
                />
              }
            </View>
          }
          {education != null &&
            <View>
              <TouchableOpacity onPress={() => setExtraOption(isExtraOption == 'education' ? '' : 'education')} style={style.extraOptionView}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 4, paddingBottom: 4 }}>
                  <View style={style.optionDot} />
                  <Text style={[style.txtHeading, { textTransform: 'uppercase' }]}>education</Text>
                </View>
                <View style={style.optionTitleView}>
                  <Text style={style.optionTitle}>{isExtraOption == 'education' ? '-' : '+'}</Text>
                </View>
              </TouchableOpacity>
              {isExtraOption == 'education' &&
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  data={education}
                  renderItem={({ index, item }) =>
                    <View key={index} style={style.cellView}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={style.cellDot} />
                        <Text style={style.cellTitle}>{item.university}</Text>
                      </View>

                      <View style={style.cellDescriptionView}>
                        <Text style={style.cellDescription}>{item.qualification + '\n' + item.start_date + ' - ' + item.end_date}.</Text>
                      </View>

                    </View>
                  }
                />
              }
            </View>
          }
          {skills != null &&
            <View>
              <TouchableOpacity onPress={() => setExtraOption(isExtraOption == 'skills' ? '' : 'skills')} style={style.extraOptionView}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 4, paddingBottom: 4 }}>
                  <View style={style.optionDot} />
                  <Text style={[style.txtHeading, { textTransform: 'uppercase' }]}>skills</Text>
                </View>
                <View style={style.optionTitleView}>
                  <Text style={style.optionTitle}>{isExtraOption == 'skills' ? '-' : '+'}</Text>
                </View>
              </TouchableOpacity>
              {isExtraOption == 'skills' &&
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  data={skills}
                  renderItem={({ index, item }) =>
                    <View key={index} style={style.cellView}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={style.cellDot} />
                        <Text style={style.cellTitle}>{item.title}</Text>
                      </View>
                    </View>
                  }
                />
              }
            </View>
          }
          {services.length != 0 &&
            <View>
              <TouchableOpacity onPress={() => setExtraOption(isExtraOption == 'services' ? '' : 'services')} style={style.extraOptionView}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 4, paddingBottom: 4 }}>
                  <View style={style.optionDot} />
                  <Text style={[style.txtHeading, { textTransform: 'uppercase' }]}>services</Text>
                </View>
                <View style={style.optionTitleView}>
                  <Text style={style.optionTitle}>{isExtraOption == 'services' ? '-' : '+'}</Text>
                </View>
              </TouchableOpacity>
              {isExtraOption == 'services' &&
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  data={services}
                  style={{ marginTop: 10 }}
                  renderItem={({ index, item }) =>
                    <View key={index} style={style.cellView}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={style.txtService}>{item.title}</Text>
                        <TouchableOpacity onPress={() => onServicesClick(item)}>
                          <Text style={style.txtMoreInfo}>More Info</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{ backgroundColor: '#707070', height: 1, opacity: 0.7, marginTop: 4, }} />
                    </View>
                  }
                  keyExtractor={(item, index) => index.toString()}
                />
              }
            </View>
          }
        </View>

      </ScrollView>

      <Modal animationType="fade" transparent={true} visible={openSetting}>
        <View style={{ width: width, height: height, backgroundColor: 'rgba(4, 4, 16, 0.80)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: colors.background, paddingLeft: 20, paddingRight: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
              <Text style={{ fontSize: 15, fontFamily: 'SFProDisplay-Regular', fontWeight: 'bold', color: colors.textColor, textTransform: 'uppercase' }}>Settings</Text>
              <TouchableOpacity onPress={() => setOpenSetting(false)} style={{ shadowColor: '#000000', shadowRadius: 3.84, shadowOpacity: 0.25, shadowOffset: { width: 0, height: 2 }, elevation: 3, backgroundColor: '#FFFFFF', padding: 4, borderRadius: 15 }}>
                <AntDesign name="close" color="#000000" size={15} />
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 20 + notchPadding }}>
              <View style={style.settingItemView}>
                <Text style={style.settingText}>Turn on post notifications</Text>
                <ToggleSwitch
                  isOn={postNotification}
                  onColor={'#FBBB0E'}
                  offColor={colors.background}
                  size="small"
                  trackOnStyle={{ borderWidth: 1, borderColor: '#FBBB0E' }}
                  trackOffStyle={{ borderWidth: 1, borderColor: '#FBBB0E' }}
                  thumbOnStyle={{ backgroundColor: 'black' }}
                  thumbOffStyle={{ backgroundColor: '#FBBB0E' }}
                  onToggle={isOn => {
                    setPostNotification(isOn);
                    console.log('postNotification : ', isOn);
                  }}
                />
              </View>
              <View style={style.settingItemView}>
                <Text style={style.settingText}>Mute Account</Text>
                <ToggleSwitch
                  isOn={muteAccount}
                  onColor={'#FBBB0E'}
                  offColor={colors.background}
                  size="small"
                  trackOnStyle={{ borderWidth: 1, borderColor: '#FBBB0E' }}
                  trackOffStyle={{ borderWidth: 1, borderColor: '#FBBB0E' }}
                  thumbOnStyle={{ backgroundColor: 'black' }}
                  thumbOffStyle={{ backgroundColor: '#FBBB0E' }}
                  onToggle={isOn => setMuteAccount(isOn)}
                />
              </View>
              <View style={style.settingItemView}>
                <Text style={style.settingText}>Block Account</Text>
                <ToggleSwitch
                  isOn={blockAccount}
                  onColor={'#FBBB0E'}
                  offColor={colors.background}
                  size="small"
                  trackOnStyle={{ borderWidth: 1, borderColor: '#FBBB0E' }}
                  trackOffStyle={{ borderWidth: 1, borderColor: '#FBBB0E' }}
                  thumbOnStyle={{ backgroundColor: 'black' }}
                  thumbOffStyle={{ backgroundColor: '#FBBB0E' }}
                  onToggle={isOn => setBlockAccount(isOn)}
                />
              </View>
            </View>

          </View>
        </View>
      </Modal>
    </View>
  );
}
