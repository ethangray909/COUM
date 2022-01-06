
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
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { useTheme, useNavigation, useRoute } from '@react-navigation/native';

import LinkedSocialMediaContainer from '../components/linkedSocialMedia';
import useGlobalStyles from '../styles/Styles';
const API = require('../network/api.js')
const CONSTANTS = require('../global/constants.js')
const FUNCTIONS = require('../global/functions.js')

import user_cover from '../images/user_cover.png';
import img_upload from '../images/img_upload.png';
import logo from '../images/logo.png';
import user_profile from '../images/user_profile.png';
import img_share from '../images/img_share.png';
import locationPin from '../images/img_location_pin.png';
import img_song_cover from '../images/img_song_cover.png';

let notchPadding = DeviceInfo.hasNotch() ? 21 : 0;
let { height, width } = Dimensions.get('window');
let margin = 15;


export default function CompanyProfile() {

  const route = useRoute();
  const navigation = useNavigation();
  const styles = useGlobalStyles();
  const { colors, isDark } = useTheme();
  const [latestNews, setLatestNews] = useState([{ title: 'Beach House', time: 'December 21, 2020' }, { title: 'Rave Night Run', time: 'December 18, 2020' }, { title: `Don't Call me UP`, time: 'December 15, 2020' }]);
  const [albums, setAlbums] = useState([{ title: 'Beach House', song_count: '23 Songs' }, { title: 'Rave Night Run', song_count: '25 Songs' }, { title: `Don't Call me UP`, song_count: '18 Songs' }]);

  const style = StyleSheet.create({
    txtHeading: {
      color: isDark ? '#FFFFFF' : '#B7BABD',
      fontFamily: 'SFProDisplay-Regular',
      fontSize: 15,
      fontWeight: 'bold'
    },
    itemImage: {
      height: height * 0.12,
      width: width / 2.3
    },
    itemContantView: {
      backgroundColor: 'rgba(0,0,0,0.7)',
      height: '100%',
      paddingLeft: 10,
      borderRadius: 10
    },
    itemTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      fontFamily: 'SFProDisplay-Regular',
      color: '#FFFFFF',
      marginTop: 8
    },
    itemDate: {
      fontSize: 10,
      fontFamily: 'SFProDisplay-Regular',
      color: '#FFFFFF'
    }
  });

  return (
    <View style={styles.container}>
      <Image source={user_cover} resizeMode="cover" style={{ width: '100%', height: 216, }} />
      <TouchableOpacity onPress={() => this.onUploadClick()} style={{ position: 'absolute', top: notchPadding + 10, left: 10 }}>
        <Image source={img_upload} style={{ width: 18, height: 26, marginTop: 8, marginLeft: 10 }} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { navigation.goBack(); }} style={styles.close_button}>
        <AntDesign name="close" color="#000000" size={15} />
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Image source={img_song_cover} style={{ width: 111, height: 111, borderRadius: 111 / 2, alignSelf: 'center', marginTop: -111 / 2, borderWidth: 2, borderColor: '#FFFFFF' }} />

        <TouchableOpacity onPress={() => {
          // onShare()
        }} style={{ width: 43, height: 43, borderRadius: 43 / 2, backgroundColor: '#FFFFFF', position: 'absolute', justifyContent: 'center', right: 15, top: -43 / 2 }}>
          <Image source={img_share} style={{ width: 24, height: 24, alignSelf: 'center' }} />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, marginBottom: margin + 5 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 15 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 25, fontFamily: 'SFProDisplay-Regular', fontWeight: '800', color: colors.textColor }}>{route.params.title}</Text>
            <View style={{ flexDirection: 'row', marginTop: 4, alignItems: 'center' }}>
              <SimpleLineIcons name="location-pin" size={14} color={isDark ? '#FFFFFF' : '#B7BABD'} />
              <Text style={{ fontSize: 14, fontFamily: 'SFProDisplay-Regular', color: colors.text2Color, marginLeft: 8, }}>London, United Kingdom</Text>
            </View>
          </View>

          <TouchableOpacity style={{ alignSelf: 'center', borderRadius: 20, backgroundColor: colors.followbuttonBackgroud, paddingLeft: 15, paddingRight: 15, paddingTop: 4, paddingBottom: 4 }}>
            <Text style={{ color: colors.followTextcolor, fontSize: 16, fontWeight: 'bold', fontFamily: 'SFProDisplay-Regular', alignSelf: 'center' }}>Follow</Text>
          </TouchableOpacity>

        </View>

        <Text numberOfLines={2} style={{ color: colors.textColor, fontSize: 15, fontFamily: 'SourceSansPro-Regular', marginTop: 10, marginLeft: 15, marginRight: 15 }}>I'm a Guitatris. I love to listen music, Everytime i listen some good beats it gives me goosebumpss ..</Text>

        <Text style={{ fontSize: 15, fontWeight: 'bold', fontFamily: 'SFProDisplay-Regular', color: '#B7BABD', marginLeft: 15, marginRight: 15, marginTop: margin }}>LINKED SOCIAL MEDIA</Text>

        <LinkedSocialMediaContainer
          itemStyle={styles.socialMediaView}
          spotify_apple={CONSTANTS.USER.spotify_apple}
          youtube={CONSTANTS.USER.youtube}
          facebook={CONSTANTS.USER.facebook}
          instagram={CONSTANTS.USER.instagram}
          twitter={CONSTANTS.USER.twitter}
          soundcloud={CONSTANTS.USER.soundcloud}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, marginLeft: 15, marginRight: 15 }}>
          <Text style={style.txtHeading}>LATEST NEWS</Text>
        </View>

        <View>
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            horizontal
            style={{ marginTop: 10, paddingLeft: margin }}
            data={latestNews}
            renderItem={({ index, item }) =>
              <TouchableOpacity style={{ marginRight: margin }}>
                <ImageBackground source={user_cover} style={style.itemImage} imageStyle={{ borderRadius: 10 }}>
                  <View style={style.itemContantView}>
                    <Text style={style.itemTitle}>{item.title}</Text>
                    <Text style={style.itemDate}>{item.time}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            }
            keyExtractor={(item, index) => index.toString()}
          />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, marginLeft: 15, marginRight: 15 }}>
          <Text style={style.txtHeading}>ALBUMS</Text>
        </View>

        <View>
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            horizontal
            style={{ marginTop: 10, paddingLeft: 15 }}
            data={albums}
            renderItem={({ index, item }) =>
              <TouchableOpacity style={{ marginRight: margin }}>
                <ImageBackground source={user_cover} style={style.itemImage} imageStyle={{ borderRadius: 10 }}>
                  <View style={style.itemContantView}>
                    <Text style={style.itemTitle}>{item.title}</Text>
                    <Text style={style.itemDate}>{item.song_count}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            }
            keyExtractor={(item, index) => index.toString()}
          />
        </View>

      </ScrollView>
    </View>
  )
}
