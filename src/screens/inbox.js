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
  Image,
  Dimensions,
  StyleSheet,
  Alert,
  Keyboard,
  ScrollView,
  FlatList,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Header from '../global/header';
import { useTheme, useNavigation } from '@react-navigation/native';
import { DotsLoader } from 'react-native-indicator';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Snackbar from 'react-native-snackbar';
import DynamicImage from '../components/dynamicImage';
import database from '@react-native-firebase/database';
var moment = require('moment');

import styles from '../styles/Styles';
const API = require('../network/api.js')
const CONSTANTS = require('../global/constants.js')
const FUNCTIONS = require('../global/functions.js')

import user from '../images/user.png';
import vh from '../Units/vh';

let { height, width } = Dimensions.get('window');
let notchPadding = DeviceInfo.hasNotch() ? 21 : 0;

export default function Inbox() {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const [users, setUsers] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    setDataLoading(true);
    const unsubscribe = navigation.addListener('focus', () => {
      getConnections();
    });
    // getConnections();
    return () => {
      unsubscribe;
    }
  }, []);

  function onItemClick(item) {
    console.log('Item Click : ', item);
    navigation.navigate('Chat', { item });
  }

  function onRefresh() {
    setDataLoading(true);
    getConnections();
  }

  async function getConnections() {
    try {
      //setDataLoading(true);
      const response = await API.callUserApi(CONSTANTS.BASE_URL + 'connections', {}, this, 'GET')
      console.log('response in getConnections inbox screen:', response);
      // .then((response)=> {
      //console.log('getConnections: ', JSON.stringify(response));
      if (response.error == 0) {
        if (response.hasOwnProperty('result')) {
          getLastMessages(response.result)
          //setUsers(response.result);
        }
      } else {
        Snackbar.show({ text: response.message, duration: Snackbar.LENGTH_SHORT });
        setDataLoading(false);
      }
      // });
    } catch (e) {
      console.log('getConnections Error: ', e);
      setDataLoading(false);
    }
  }

  async function getLastMessages(userList) {
    console.log('getLastMessages');
    let uuid = CONSTANTS.USER._id;
    new Promise((resolve, reject) => {
      let updateUser = [];
      let lastMessage = '';
      let isLive = 'inactive';
      let lastDate = null;
      userList.forEach((child) => {
        if (child._id != uuid) {
          console.log('inside if');
          new Promise((resolve, reject) => {
            database().ref('messages').child(child._id).on('value', (data) => {
              //console.log('All Data: ', JSON.stringify(data));
              if (data.val()) {
                isLive = data.val().active;
              }
            });
            database().ref('messages').child(uuid).child(child._id).child('messages').orderByKey().limitToLast(1).on('value', (dataSnapshots) => {
              console.log(`${child.user_name} is ${isLive}`);
              if (dataSnapshots.val()) {
                dataSnapshots.forEach((child) => {
                  lastMessage = child.val().messege.image !== '' ? 'Photo' : child.val().messege.video !== '' ? 'Video' : child.val().messege.text;
                  lastDate = child.val().messege.createdAt;
                });
              }
              child.lastMessage = lastMessage;
              child.lastDate = lastDate;
              child.isLive = isLive;
              return resolve({
                _id: child._id,
                user_name: child.user_name,
                email: child.email,
                lastMessage: lastMessage,
                lastDate: lastDate,
                isLive: isLive,
                updated_at: child.updated_at,
                profile_image: child.profile_image
              });
            });
          })
            .then((newUser) => {
              updateUser.push(newUser);
              setUsers(updateUser.sort((a, b) => b.lastDate - a.lastDate));
            });
          console.log('setDataLoading');
          setDataLoading(false);
          return resolve(updateUser);
        }
        else {
          console.log('inside else');
          setDataLoading(false);
        }
      })
      // .then((getUsers) => {
      //   setUsers(getUsers.sort((a, b) => b.lastDate - a.lastDate));
      // })
      console.log('inside parent Promise');
      setDataLoading(false);
    });
  }

  const listEmptyComponent = () => {
    return (
      <View style={{ width: width, height: vh / 1.35, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ borderRadius: 8, backgroundColor: isDark ? '#1C1C1C' : '#F8F8F3', justifyContent: 'center', padding: 8 }}>
          <MaterialCommunityIcons
            name={'inbox'}
            color={isDark ? '#E7B720' : '#FBBB00'}
            size={50}
            style={{ alignSelf: 'center' }} />
        </View>
        <Text style={{ color: colors.textColor, fontFamily: 'SFProDisplay-Regular', fontSize: 18, marginTop: 20 }}>Your inbox is empty</Text>
        <Text style={{ color: colors.textColor, fontFamily: 'SFProDisplay-Regular', fontSize: 14, marginTop: 10 }}>All incoming requests will be listed in this folder</Text>
      </View>
    )
  }

  const renderDataItem = ({ item, index }) => {
    item.count = 0;
    console.log('item: ', JSON.stringify(item));
    return (
      <TouchableOpacity onPress={() => onItemClick(item)} style={{ backgroundColor: !isDark ? '#FFFFFF' : item.count == 0 ? '#141414' : '#FFFFFF', borderRadius: 5, marginTop: 10, shadowColor: '#000000', shadowRadius: 3.84, shadowOpacity: 0.25, shadowOffset: { width: 0, height: 2 }, elevation: 3 }}
        activeOpacity={1}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10 }}>
          <View style={{ alignSelf: 'center', }}>
            {item.profile_image != '' ?
              <DynamicImage url={item.profile_image} style={{ width: 46, height: 46, borderRadius: 46 / 2 }} />
              :
              <Image source={user} style={{ width: 46, height: 46, borderRadius: 46 / 2 }} />
            }
            {item.isLive == 'active' ?
              <View style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: 10 / 2, borderWidth: 1, borderColor: '#FFFFFF', backgroundColor: '#6DC334' }}>
              </View>
              : (item.isLive == 'inactive' && item.isLive == 'background') ?
                <View style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: 10 / 2, borderWidth: 1, borderColor: '#FFFFFF', backgroundColor: '#B7BABD' }}>
                </View>
                : null
            }
          </View>
          <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'flex-start', marginLeft: 15 }}>
            <Text style={{ color: !isDark ? colors.textColor : item.count == 0 ? '#FFFFFF' : '#000000', fontFamily: 'SourceSansPro-Regular', fontSize: 16, fontWeight: 'bold' }}>{item.user_name}</Text>
            <Text numberOfLines={1} style={{ color: item.count == 0 ? '#B7BABD' : '#000000', fontFamily: 'SourceSansPro-Regular', fontSize: 14 }}>{item.lastMessage != '' ? item.lastMessage : item.email}</Text>
            <Text style={{ color: '#B7BABD', fontFamily: 'SourceSansPro-Regular', fontSize: 10 }}>{item.lastDate != null ? moment.utc(new Date(item.lastDate)).fromNow() : moment.utc(new Date(item.updated_at)).fromNow()}</Text>
          </View>
          {item.count != 0 &&
            <View style={{ width: 17, height: 17, borderRadius: 17 / 2, backgroundColor: '#FBBB00', justifyContent: 'center', alignSelf: 'center', marginLeft: 3 }}>
              <Text numberOfLines={1} style={{ color: '#FFFFFF', alignSelf: 'center', fontFamily: 'SourceSansPro-Regular', fontSize: 10 }}>{item.count}</Text>
            </View>
          }
        </View>

      </TouchableOpacity>
    )
  }

  return (
    <View style={[style.container, { backgroundColor: colors.background }]}>
      <Header
        title={'Inbox'}
        isBackButton={true}
        isIcon={false}
        isInbox={false} />

      <View style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
        {!dataLoading &&
          <FlatList
            showsVerticalScrollIndicator={false}
            data={users}
            renderItem={renderDataItem}
            ListEmptyComponent={listEmptyComponent}
            onRefresh={() => onRefresh()}
            refreshing={false}
            keyExtractor={(item, index) => index.toString()}
          />
        }
        {dataLoading &&
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <DotsLoader color={colors.loading} size={15} />
          </View>
        }

      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000'
    //alignItems: 'stretch',
  }
});
