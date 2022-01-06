'use strict';

import React, { useRef, useEffect, useState, useCallback } from 'react';
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
  KeyboardAvoidingView,
  AppState,
  PermissionsAndroid
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme, useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import RtcEngine, { RtcLocalView, RtcRemoteView, VideoRenderMode, ChannelProfile, ClientRole, } from 'react-native-agora';
import SpinnerButton from 'react-native-spinner-button';
import Feather from 'react-native-vector-icons/Feather';
import { DotsLoader } from 'react-native-indicator';
import Snackbar from 'react-native-snackbar';
import uuid from 'react-native-uuid';
const RoomManager = require('../global/roomManager');

import DynamicImage from '../components/dynamicImage';
import Header from '../global/header';
const API = require('../network/api.js')
const CONSTANTS = require('../global/constants.js')
const FUNCTIONS = require('../global/functions.js')
import useGlobalStyles from '../styles/Styles';

import user from '../images/user.png';
import eq_display from '../images/eq_display.png';

let { height, width } = Dimensions.get('window');
let notchPadding = DeviceInfo.hasNotch() ? 21 : 0;
let margin = 15;
let currentAudioRoom = null;
let channelId = null;

export default function AudioRooms() {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const styles = useGlobalStyles();
  const [audioList, setAudioList] = useState([]);
  //const[currentAudioRoom, setCurrentAudioRoom] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null);
  const [isAddRoomName, setIsAddName] = useState(false);
  const [isAddLoading, setAddLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roomName, setRoomName] = useState('');
  const style = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
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
      marginTop: 18,
    },
    titleText: {
      fontSize: 14,
      color: colors.textColor
    },
  });
  const AgoraEngine = useRef();

  useEffect(() => {
    //getAgoraToken();
    initEngine();
    const unsubscribe = navigation.addListener('focus', () => {
      if (Platform.OS === 'android') requestCameraAndAudioPermission();
      getRoomList();
      initEngine();
    });

    return () => {
      AgoraEngine.current.destroy();
      unsubscribe;
    };
  }, []);

  function getRoomList() {
    try {
      database().ref('AudioRoom')
        .orderByChild('status')
        .equalTo('active')
        .on('value', dataSnapshot => {
          let room = [];
          dataSnapshot.forEach((data) => {
            room.push({ key: data.key, ...data.val() });
          });
          setLoading(false);
          console.log('RoomArray: ', JSON.stringify(room));
          setAudioList(room);
        });

    } catch (e) {
      console.log('GetRoom List Error: ', e);
    }
  }

  async function initEngine() {
    try {
      AgoraEngine.current = await RtcEngine.create(CONSTANTS.AGORA_APP_ID).catch((e) => console.log('Create Error: ', JSON.stringify(e)));

      AgoraEngine.current.setChannelProfile(ChannelProfile.LiveBroadcasting).catch((e) => console.log('Set Channel Profile Error: ', JSON.stringify(e)))

      //AgoraEngine.current.setClientRole(ClientRole.Broadcaster).catch((e)=> console.log('setClientRole Error: ', JSON.stringify(e)));

      AgoraEngine.current.addListener('Warning', (warn) => {
        console.log('Warning', JSON.stringify(warn));
      });

      AgoraEngine.current.addListener('Error', (err) => {
        console.log('Agora Error', JSON.stringify(err));
      });

      AgoraEngine.current.addListener('UserJoined', (uid, elapsed) => {
        console.log('UserJoined', uid, elapsed);

        // let participants = [];
        // if (currentAudioRoom.hasOwnProperty('participants')) {
        //   participants = currentAudioRoom.participants;
        // }
        //
        // let user = {
        //   _id: uid,
        //   user_id: CONSTANTS.USER._id,
        //   user_image: CONSTANTS.USER.profile_image,
        //   user_name: CONSTANTS.USER.user_name,
        // };
        //
        // participants.push(user);
        // currentAudioRoom.participants = participants;
        // updateRoom('participants',"");

      });

      AgoraEngine.current.addListener('UserOffline', (uid, reason) => {
        console.log('UserOffline', uid, reason);
        //   let participants = [];
        //   if (currentAudioRoom.hasOwnProperty('participants')) {
        //     participants = currentAudioRoom.participants;
        //   }
        //
        //   participants.filter((item) => item._id !== uid);
        //   currentAudioRoom.participants = participants;
        //   updateRoom('participants', "");
      });

      AgoraEngine.current.addListener("JoinChannelSuccess", (channel, uid, elapsed) => {
        console.log("JoinChannelSuccess", channel, uid, elapsed);
        AgoraEngine.current.enableAudio();
        //console.log('AudioRooms: ', JSON.stringify(roomDetails));
        updateHostParticipents(uid);
      });

    } catch (e) {
      console.log('initEngine Error: ', JSON.stringify(e));
    }
  }

  function updateHostParticipents(channel_id) {
    let user = {
      user_id: CONSTANTS.USER._id,
      user_image: CONSTANTS.USER.profile_image,
      user_name: CONSTANTS.USER.user_name,
    };
    try {
      if (channelId != channel_id) {
        channelId = channel_id;
        if (currentAudioRoom.host_id == CONSTANTS.USER._id) {
          console.log('Add Host');
          let speakers = [];
          if (currentAudioRoom.hasOwnProperty('speakers')) {
            speakers = currentAudioRoom.speakers;
          }

          speakers.push(user);
          currentAudioRoom.speakers = speakers;
          updateRoom('speakers', "");
        } else {
          let participants = [];

          if (currentAudioRoom.hasOwnProperty('participants')) {
            participants = currentAudioRoom.participants;
          }

          participants.push(user);

          currentAudioRoom.participants = participants;
          updateRoom('participants', "");
        }
      }
    } catch (e) {
      console.log('updateHostParticipents Error: ', e);
    }
  }

  function updateRoom(type, status) {
    try {
      let params = {};
      if (type === 'participants') {
        let filterArray = currentAudioRoom.participants.filter((item) => item.user_id !== CONSTANTS.USER._id);
        params.participants = JSON.stringify(filterArray.length != 0 ? filterArray : currentAudioRoom.participants);
      } else if (type == 'speakers') {
        let filterArray = currentAudioRoom.speakers.filter((item) => item.user_id !== CONSTANTS.USER._id);
        params.speakers = JSON.stringify(filterArray.length != 0 ? filterArray : currentAudioRoom.speakers);
      }
      if (status != '') {
        params.status = status;
      }
      API.callUserApi(CONSTANTS.BASE_URL + 'audioroom/' + currentAudioRoom._id, params, {}, "PUT")
        .then((response) => {
          console.log('Update Room ', JSON.stringify(response));
          if (response.error == 0) {
            setAudioList(response.result);
          }
        });
    } catch (e) {
      console.log('Update Room Error: ', e);
    }
  }

  async function requestCameraAndAudioPermission() {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      if (granted["android.permission.RECORD_AUDIO"] === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the cameras & mic");
      } else {
        console.log("Permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }

  function onCreateRoomClick() {
    console.log('Create Room');
    try {
      let params = {
        channel_name: roomName,
        host_id: CONSTANTS.USER._id,
        host_image: CONSTANTS.USER.profile_image,
        host_name: CONSTANTS.USER.user_name
      };
      setAddLoading(true);
      /*API.callUserApi(CONSTANTS.BASE_URL + 'audioroom', params, {}, "POST")
        .then((response)=> {
          console.log('Room Create Response: ', JSON.stringify(response));
          Snackbar.show({  text: response.message,  duration: Snackbar.LENGTH_SHORT});
          if (response.error == 0) {
            setAudioList(response.result);
            setAddLoading(false);
            onDismissModel();
          }
        });*/

      database()
        .ref('AudioRoom')
        .push({
          _id: uuid.v4(),
          channel_name: roomName,
          speakers: [],
          participants: [],
          host_id: CONSTANTS.USER._id,
          host_image: CONSTANTS.USER.profile_image,
          host_name: CONSTANTS.USER.user_name,
          status: 'active',
          createdAt: `${new Date()}`,
        }).
        then(() => {
          Snackbar.show({ text: 'Audio room create successfully.', duration: Snackbar.LENGTH_SHORT });
          onDismissModel();
        });
    } catch (e) {
      console.log('Create Room Error: ', e);
    }
    //onDismissModel();
  }

  const itemAudioClick = (item) => {
    //setCurrentAudioRoom(item);
    currentAudioRoom = item;
    console.log('Item Click: ', item);
    getAgoraToken(item);
    setOpenModal(true);
  }

  function getAgoraToken(item) {
    API.callUserApi(CONSTANTS.BASE_URL + 'agora/token', { user: CONSTANTS.USER._id, channelName: item.channel_name }, this, 'POST')
      .then((response) => {
        console.log('Token Response: ', response);
        onJoinChannel(item, response.rtc_token);
      });
  }

  function onJoinChannel(item, rtcToken) {
    try {
      if (item.host_id == CONSTANTS.USER._id) {
        AgoraEngine.current.setClientRole(ClientRole.Broadcaster).catch((e) => console.log('ClientRole Broadcaster Error: ', JSON.stringify(e)));
      } else {
        AgoraEngine.current.setClientRole(ClientRole.Audience).catch((e) => console.log('ClientRole Audience Error: ', JSON.stringify(e)));
      }
      AgoraEngine.current.joinChannel(rtcToken, item.channel_name, null, item.host_id == CONSTANTS.USER._id ? 1 : 0);
    } catch (e) {
      console.log('Join Channel Error: ', JSON.stringify(e));
    }
  }

  const itemOptionClick = (item) => {
    console.log('Item onOption : ', item);
    //setCurrentAudioRoom(item);
    currentAudioRoom = item;
    setRoomDetails(item);
    //navigation.navigate('AudioRooms1', item);
  }

  const onSearchClick = useCallback(() => {
    console.log('onSearch Click in AudioRooms');
  }, []);

  function onDismissModel() {
    setIsAddName(false);
    setAddLoading(false);
    setRoomName('');
  }

  function onLeaveChannel() {
    console.log('Leave Channel call');
    try {
      AgoraEngine.current?.leaveChannel()
        .then(() => {
          if (currentAudioRoom.host_id == CONSTANTS.USER._id) {
            let speakers = [];
            if (currentAudioRoom.hasOwnProperty('speakers')) {
              speakers = currentAudioRoom.speakers;
            }

            speakers.filter((item) => item.host_id !== CONSTANTS.USER._id);
            currentAudioRoom.speakers = speakers;
            updateRoom('speakers', "inactive");
          } else {
            let participants = [];
            if (currentAudioRoom.hasOwnProperty('participants')) {
              participants.forEach((item) => {
                if (item.user_id !== CONSTANTS.USER._id) {
                  participants.push(item);
                }
              });
            }
            currentAudioRoom.participants = participants;
            updateRoom('participants', "");
          }
          //setCurrentAudioRoom(null);
          currentAudioRoom = null;
          setOpenModal(false);
        });
    } catch (e) {
      console.log('leaveChannel Error: ', e);
    }
  }

  const listEmptyComponent = () => {
    return (
      <View style={{ width: width, height: height / 1.35, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ borderRadius: 8, backgroundColor: isDark ? '#1C1C1C' : '#F8F8F3', justifyContent: 'center', padding: 8 }}>
          <Feather
            name={'radio'}
            color={isDark ? '#E7B720' : '#FBBB00'}
            size={50}
            style={{ alignSelf: 'center' }} />
        </View>
        <Text style={{ color: colors.textColor, fontFamily: 'SFProDisplay-Regular', fontSize: 18, marginTop: 20 }}>No Room added</Text>
        <Text style={{ color: colors.textColor, fontFamily: 'SFProDisplay-Regular', fontSize: 14, marginTop: 10 }}>Your room will appear here</Text>
      </View>
    )
  }

  const renderRoom = ({ item, index }) => {
    console.log('Item: ', item);
    return (
      <TouchableOpacity onPress={() => openModal ? null : itemAudioClick(item)} style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'transparent' }}>
        <DynamicImage url={item.host_image} style={{ width: 79, height: 79, borderRadius: 79 / 2, borderWidth: 1 }} />
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', backgroundColor: 'transparent' }}>
          <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'transparent', marginLeft: 15, marginRight: 8 }}>
            <Text style={{ color: isDark ? '#EEEEEE' : '#000000', fontFamily: 'SFProDisplay-Regular', fontSize: 14, }}>{item.channel_name}</Text>
            <View style={{ flexDirection: 'row', marginTop: 4 }}>
              <Text style={{ color: '#FBBB00', fontFamily: 'SourceSansPro-Regular', fontSize: 11 }}>{item.hasOwnProperty('speakers') ? item.speakers.length : 0} Speakers</Text>

              <View style={{ opacity: 0.8, alignSelf: 'center', }}>
                <Text style={{ color: '#FFFFFF', fontSize: 6, alignSelf: 'center', marginLeft: 10 }}>{'\u2B24'}</Text>
              </View>

              <Text style={{ color: '#C1C0C0', fontFamily: 'SourceSansPro-Regular', fontSize: 11, marginLeft: 10 }}>{item.hasOwnProperty('participants') ? item.participants.length : 0} Participants</Text>

            </View>
          </View>
          <SimpleLineIcons onPress={() => currentAudioRoom != null ? itemOptionClick(item) : null} name="options-vertical" color="#FBBB00" size={20} style={{ marginTop: 15 }} />
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        title={'Audio Rooms'}
        isBackButton={false}
        isIcon={false}
        isInbox={false}
        isSearch={true}
        onBackPressed={() => navigation.goBack()}
        onSearchClick={() => onSearchClick()} />

      <View style={{ flex: 1, marginLeft: 12, marginRight: 12 }}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <TouchableOpacity style={{ opacity: 0.8, alignSelf: 'center' }}>
            <Text style={{ color: colors.textColor, fontFamily: 'AcuminPro-Regular', fontSize: 15 }}>Explore Rooms</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsAddName(true)} style={{ backgroundColor: '#FBBB00', borderRadius: 13, height: 34, paddingLeft: 10, paddingRight: 10, justifyContent: 'center' }}>
            <Text style={{ color: '#000000', fontFamily: Platform.OS == 'ios' ? 'SFProDisplay-Regular' : 'SFProDisplay-Bold', fontWeight: '700', fontSize: 11 }}>Create Audio Room</Text>
          </TouchableOpacity>
        </View>
        {!loading &&
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={listEmptyComponent}
            data={audioList}
            onRefresh={() => getRoomList()}
            refreshing={false}
            renderItem={renderRoom}
            keyExtractor={(item, index) => index.toString()}
          />
        }
        {loading &&
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <DotsLoader color={colors.loading} size={15} />
          </View>
        }
      </View>

      {openModal &&
        <LinearGradient
          start={{ x: 0, y: 0.70 }}
          end={{ x: 0.30, y: 0.70 }}
          colors={['#999999', '#707070', '#000000']}
          style={{ position: 'absolute', width: width, bottom: 0, backgroundColor: '#707070', paddingLeft: 10, paddingRight: 10 }}>

          <TouchableOpacity onPress={() => onLeaveChannel()} style={{ alignSelf: 'flex-end' }}>
            <Ionicons name="close" color="#FFFFFF" size={20} onPress={() => onLeaveChannel()} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row' }}>
            {currentAudioRoom != null ?
              <DynamicImage url={currentAudioRoom.host_image} style={{ width: 46, height: 46, borderRadius: 46 / 2, borderWidth: 1, borderColor: '#6BFFFFFF' }} />
              :
              <Image source={user} style={{ width: 46, height: 46, borderRadius: 46 / 2, borderWidth: 1, borderColor: '#6BFFFFFF' }} />
            }
            <View style={{ flexDirection: 'row', justifyContent: 'center', backgroundColor: 'transparent' }}>
              <View style={{ justifyContent: 'center', backgroundColor: 'transparent', marginLeft: 15, marginRight: 8 }}>
                <Text style={{ color: '#FFFFFF', fontFamily: 'SFProDisplay-Regular', fontSize: 14, }}>'{currentAudioRoom != null ? currentAudioRoom.channel_name : ''}'</Text>
                <View style={{ opacity: 0.7 }}>
                  <Text style={{ color: '#FFFFFF', fontFamily: 'SFProDisplay-Regular', fontSize: 10, }}>Speaking : {currentAudioRoom != null ? currentAudioRoom.host_name : ''}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{ paddingTop: 20, paddingBottom: 20 }}>
            <Image source={eq_display} style={{ resizeMode: 'contain', alignSelf: 'center' }} />
          </View>
        </LinearGradient>
      }

      <Modal
        animationType="slide"
        visible={roomDetails != null ? true : false}
        transparent={true}>

        <View style={styles.container}>
          <Header
            title={'Audio Rooms'}
            isBackButton={true}
            isIcon={false}
            isInbox={false}
            isSearch={false}
            onBackPressed={() => setRoomDetails(null)}
            onSearchClick={() => onSearchClick()} />

          <View style={{ flex: 1, marginLeft: 12, marginRight: 12 }}>

            <View style={{ marginTop: 10, opacity: 0.8 }}>
              <Text style={{ color: colors.textColor, padding: 8, fontFamily: 'SFProDisplay-Regular', fontSize: 19 }}>{roomDetails != null ? roomDetails.channel_name : ''}</Text>
            </View>

            <View>
              <FlatList
                numColumns={3}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                data={roomDetails != null ? roomDetails.speakers : []}
                renderItem={({ index, item }) =>

                  <TouchableOpacity onPress={() => itemAudioClick(item)} style={{ width: (width / 3 - 8), alignItems: 'center', backgroundColor: 'transparent', paddingLeft: 4, paddingRight: 4, paddingTop: 4, marginLeft: 2, marginRight: 2, marginTop: 12 }}>
                    <DynamicImage url={item.user_image} style={{ width: 79, height: 79, borderRadius: 79 / 2, borderWidth: 1, borderColor: '#6BFFFFFF' }} />
                    <Text numberOfLines={1} style={{ color: '#FBBB00', textAlign: 'center', marginTop: 8 }}>{item.user_name}</Text>
                  </TouchableOpacity>
                }
                keyExtractor={(item, index) => index.toString()}
              />
            </View>

            <View style={{ marginTop: 10 }}>
              <Text style={{ color: colors.textColor, padding: 8, fontFamily: 'SFProDisplay-Regular', fontSize: 19 }}>In the room</Text>
            </View>

            <View>
              <FlatList
                numColumns={3}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                data={roomDetails != null ? roomDetails.participants : []}
                renderItem={({ index, item }) =>

                  <TouchableOpacity onPress={() => itemAudioClick(item)} style={{ width: (width / 3 - 8), alignItems: 'center', backgroundColor: 'transparent', paddingLeft: 4, paddingRight: 4, paddingTop: 4, marginLeft: 2, marginRight: 2, marginTop: 12 }}>
                    <DynamicImage url={item.user_image} style={{ width: 79, height: 79, borderRadius: 79 / 2, borderWidth: 1, borderColor: '#6BFFFFFF', }} />
                    <Text numberOfLines={2} style={{ color: colors.textColor, textAlign: 'center', marginTop: 8 }}>{item.user_name}</Text>
                  </TouchableOpacity>
                }
                keyExtractor={(item, index) => index.toString()}
              />
            </View>

          </View>
        </View>

      </Modal>

      <Modal
        animationType="fade"
        visible={isAddRoomName}
        transparent={true}
        onRequestClose={() => setIsAddName(false)}>

        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'transparent', marginLeft: 20, marginRight: 20 }}>
          <View style={{ backgroundColor: colors.headerBackgroud, paddingLeft: 20, paddingRight: 20, borderRadius: 8, paddingBottom: 20 }}>
            <View style={style.itemView}>
              <Text style={style.titleText}>Room Name</Text>
              <TextInput
                underlineColorAndroid="transparent"
                style={style.forminput}
                value={roomName}
                autoFocus={false}
                returnKeyType={'next'}
                autoCapitalize="none"
                autoCorrect={false}
                autoCapitalize="words"
                placeholder="Enter room name"
                onChangeText={(text) => { setRoomName(text) }}
                placeholderTextColor={colors.text2Color}
                blurOnSubmit={false} />
            </View>
            <View style={[styles.popup_button_view, { marginTop: 18 }]}>
              <TouchableOpacity onPress={() => onDismissModel()} style={{ width: (width - 80) / 2, borderRadius: 30, borderWidth: 1, borderColor: '#FBBB00', backgroundColor: 'white', height: 40, marginLeft: 15, marginRight: 15, justifyContent: 'center' }}>
                <Text style={[styles.popup_button_text, { color: '#1B1B1B' }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ width: (width - 80) / 2, height: 40, marginLeft: 15, marginRight: 15, backgroundColor: '#FBBB00', borderRadius: 30, paddingLeft: 20, paddingRight: 20 }}
                isLoading={isAddLoading}
                onPress={() => onCreateRoomClick()}
                indicatorCount={10}>
                <Text style={[styles.popup_button_text, { color: '#000000' }]}>
                  Create Room
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  )

}
