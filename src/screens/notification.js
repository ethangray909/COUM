'use strict';

import React, {useRef, useEffect, useState, useCallback} from 'react';
import {
    Text,
    View,
    TextInput,
    Platform,
    Modal,
    TouchableHighlight,
    TouchableOpacity,
    ImageBackground,
    Image,
    Dimensions,
    StyleSheet,
    Keyboard,
    Animated,
    ScrollView,
    FlatList,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Header from '../global/header';
import { DotsLoader } from 'react-native-indicator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
var moment = require('moment');
import { useTheme, useNavigation, useRoute } from '@react-navigation/native';

import styles from '../styles/Styles';
import DynamicImage from '../components/dynamicImage';
const API = require('../network/api.js');
const CONSTANTS = require('../global/constants.js');
const FUNCTIONS = require('../global/functions.js');

import user from '../images/user.png';
let {height, width} = Dimensions.get('window');
let notchPadding = DeviceInfo.hasNotch() ? 21 : 0;

export default function Notification() {
  const navigation = useNavigation();
  const{colors, isDark} = useTheme();
  const [isDataLoading, setisDataLoading] = useState(true);
  const[notification, setNotification] = useState([]);
  const[readNotification, setReadNotification]=useState(null);

  const style = StyleSheet.create({
      container: {
          flex: 1,
          justifyContent: 'center',
          backgroundColor: colors.background
      },
  });

  useEffect(()=> {
    const unsubscribe = navigation.addListener('focus', ()=> {
      getNotificationData();
    });

    return ()=> {
      unsubscribe;
    }
  },[]);

  function getNotificationData() {
    console.log('Notification Data api call......');
    try {
      setisDataLoading(true);
      API.callUserApi(CONSTANTS.BASE_URL + 'notifications', {}, this, 'GET')
        .then((response)=> {
          console.log('Notification Response: ', JSON.stringify(response));
          setisDataLoading(false);
          if (response.error == 0) {
            setNotification(response.result)
          }
        });
    } catch (e) {
      console.log('GetData Error: ', e);
    }
  }

  function unReadNotification(notif_id) {
    let params = {
      read: 'yes'
    }
    console.log('unReadNotification params: ', params);
    try {
      API.callUserApi(CONSTANTS.BASE_URL + 'notification/' + notif_id, params, this, 'PUT')
        .then((response)=> {
          console.log('unReadNotification Response::: ', JSON.stringify(response));
          if (response.error == 0) {
            //setResult(response.result);
            getNotificationData();
          }
        })
    } catch (e) {
      console.log('unReadNotification Error: ',e);
    }
  }

  const listEmptyComponent = () => {
    return(
      <View style={{width: width, height: height/1.35, justifyContent: 'center', alignItems: 'center'}}>
        <View style={{borderRadius: 8, backgroundColor: isDark ? '#1C1C1C' : '#F8F8F3', justifyContent: 'center', padding: 8}}>
          <MaterialIcons
            name={'notifications-none'}
            color={isDark ? '#E7B720' : '#FBBB00'}
            size={50}
            style={{ alignSelf: 'center'}} />
        </View>
        <Text style={{color: colors.textColor, fontFamily: 'SFProDisplay-Regular', fontSize: 18, marginTop: 20}}>No notifications yet</Text>
        <Text style={{color: colors.textColor, fontFamily: 'SFProDisplay-Regular', fontSize: 14, marginTop: 10}}>Stay tuned! Notification about your activity will show up here.</Text>
      </View>
    )
  }

  return (
    <View style={style.container}>
        <Header
          title={'Notification'}
          isBackButton= {false}
          isIcon={false}
          isInbox={true}/>

        <View style={{flex: 1, marginLeft: 10, marginRight: 10}}>
          {!isDataLoading ?
            <FlatList
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={listEmptyComponent}
              data={notification}
              renderItem={({index, item}) =>
                 <TouchableOpacity style={{backgroundColor: !isDark ? '#FFFFFF' :item.read == 'yes' ? '#141414' : '#FFFFFF', borderRadius: 5, marginTop: 10, shadowColor: '#000000', shadowRadius: 3.84, shadowOpacity: 0.25, shadowOffset: {width: 0, height: 2}, elevation: 3}}
                   activeOpacity={1}
                   onPress={() => {
                     setReadNotification(item);
                     CONSTANTS.NOTIFICATION_COUNT = CONSTANTS.NOTIFICATION_COUNT+1;
                     if (item.read == 'no') {
                       unReadNotification(item._id)
                     }
                   }}>
                   <View style={{flexDirection: 'row', justifyContent: 'center', padding: 10}}>
                    <View style={{alignSelf: 'center',}}>
                      {item.sender_profile_image != '' ? <DynamicImage url={item.sender_profile_image} style={{width: 46, height: 46, borderRadius: 46/2}}/> : <Image source={user} style={{width: 46, height: 46, borderRadius: 46/2}}/>
                      }
                    </View>
                    <View style={{flex:1, backgroundColor: 'transparent', justifyContent:'flex-start', marginLeft:15}}>
                        <Text style={{ color: !isDark ? colors.textColor :item.read  == 'yes' ? '#FFFFFF' : '#000000', fontFamily: 'SFProDisplay-Regular', fontSize: 16, fontWeight:'bold'}}>{item.title}</Text>
                        <Text numberOfLines={1} style={{color: item.read  == 'yes' ? '#B7BABD' : '#000000', fontFamily: 'SourceSansPro-Regular', fontSize: 14}}>{item.desc}</Text>
                        <Text style={{color: '#B7BABD', fontFamily: 'SourceSansPro-Regular', fontSize: 10}}>{moment.utc(item.created_at).fromNow()}</Text>
                    </View>
                    {item.read != 'yes' &&
                      <View style={{width:8, height:8, borderRadius:8/2, backgroundColor:'#FBBB00', marginLeft: 3}}>
                      </View>
                    }
                  </View>
                </TouchableOpacity>
               }
               keyExtractor={(item, index) => index.toString()}
            />
            :
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <DotsLoader color={colors.loading} size={15} />
            </View>
          }
          <Modal
            animationType="slide"
            visible={readNotification != null ? true : false}
            transparent={true}>

            <View style={{flex: 1, justifyContent: 'flex-end'}}>
              <View style={{flexDirection: 'row', borderBottomWidth: 0.8, borderColor: colors.text2Color, backgroundColor: colors.headerBackgroud, borderTopLeftRadius: 26, borderTopRightRadius: 26, paddingTop: 15, paddingBottom: 15}}>
                <Text style={{flex: 1, color: colors.textColor, fontFamily: 'SourceSansPro-Bold', fontWeight: '700', fontSize: 18, textAlign: 'center'}}>Notification Details</Text>
                <Ionicons name="close" color={colors.textColor} size={20} onPress={()=> setReadNotification(null)} style={{marginRight: 15}}/>
              </View>
              <View style={{flex: 0.5, backgroundColor: colors.background, padding: 10}}>
                <View style={{flexDirection: 'row'}}>
                  {readNotification != null && <DynamicImage url={readNotification.sender_profile_image} style={{width: 40, height: 40, borderRadius: 10}}/>}
                  <View style={{marginLeft: 10}}>
                    <Text style={{color: colors.textColor, fontFamily: 'SourceSansPro-Regular', fontWeight: '600'}}>{readNotification != null ? readNotification.title : ''}</Text>

                    <Text style={{color: '#B7BABD', fontFamily: 'SourceSansPro-Regular', fontSize: 10}}>{readNotification != null ? moment.utc(readNotification.created_at).fromNow() : ''}</Text>
                  </View>
                </View>

                <Text style={{color: colors.textColor, fontFamily: 'SourceSansPro-Regular', marginTop: 8}}>{readNotification != null ? readNotification.desc : ''}</Text>
              </View>

            </View>

          </Modal>
        </View>
    </View>
  );
}
