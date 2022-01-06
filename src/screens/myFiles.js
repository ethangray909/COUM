'use strict';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Text,
  View,
  TextInput,
  Platform,
  Modal,
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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImageSlider from 'react-native-image-slider';
import DynamicImage from '../components/dynamicImage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
import { DotsLoader } from 'react-native-indicator';

import MedaiPlayer from '../components/mediaPlayer';
import Header from '../global/header';
import useGlobalStyles from '../styles/Styles';
import vh from '../Units/vh';
import vw from '../Units/vw';

let { height, width } = Dimensions.get('window');
const API = require('../network/api.js')
const CONSTANTS = require('../global/constants.js')
const FUNCTIONS = require('../global/functions.js')

let notchPadding = DeviceInfo.hasNotch() ? 21 : 0;
let margin = 15;

export default function MyFiles() {
  const route = useRoute()
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const styles = useGlobalStyles();
  const [currentTab, setCurrentTab] = useState('recent');
  const [search, setSearch] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [recents, setRecent] = useState([]);
  const [videos, setVideos] = useState([]);
  const [songs, setSongs] = useState([]);
  const [images, setImages] = useState([]);
  const [openMedia, setOpenMedia] = useState(false);
  const [item, setItem] = useState(null);

  const style = StyleSheet.create({
    tabSelectTitile: {
      color: isDark ? '#FBBB00' : '#000000',
      fontFamily: 'SourceSansPro-SemiBold',
      fontWeight: '600',
      fontSize: 16,
      paddingLeft: 6,
      paddingRight: 6
    },
    tabTitile: {
      color: isDark ? '#FFFFFF' : '#8E8E93',
      fontFamily: 'SourceSansPro-Regular',
      fontSize: 16,
      paddingLeft: 6,
      paddingRight: 6
    },
    currentTabView: {
      marginRight: margin,
      borderBottomWidth: 1,
      borderColor: isDark ? '#FBBB00' : '#000000',
      paddingBottom: 10,
    },
    tabView: {
      marginRight: margin,
      paddingBottom: 10
    },
    fileTitle: {
      fontFamily: 'SourceSansPro-Regular',
      fontSize: 16,
      color: colors.textColor,
    },
    fileType: {
      fontFamily: 'SourceSansPro-Regular',
      fontSize: 12,
      color: '#8E8E93',
    },
    coverImage: {
      resizeMode: 'contain',
      width: 30,
      height: 30,
      borderRadius: 30 / 2,
    },
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getAllFile();
    });
    if (route.params) {
      console.log('selected tab displayed --', route.params.selectedTab);
      setCurrentTab(route.params.selectedTab)
    }
    return unsubscribe;
  }, []);

  function getAllFile() {
    try {
      API.callUserApi(CONSTANTS.BASE_URL + 'works', {}, this, 'GET')
        .then((response) => {
          if (response.error == 0) {
            setVideos(response.works.videos);
            setSongs(response.works.songs);
            setImages(response.works.images);
            setRecent(response.works.recent_works);
          }
          setLoading(false);
        });
    } catch (e) {
      console.log('Get File Error : ', e);
    }
  }

  function onRefreshFiles() {
    getAllFile();
  }

  function onSearchClick() {
    console.log('Search Click');
  }

  function onChangeTab(tab) {
    setCurrentTab(tab);
  }

  function onItemClick(item) {
    console.log('Item Click: ', JSON.stringify(item));
    setItem(item);
    setTimeout(() => {
      setOpenMedia(true);
    }, 500);
  }

  const renderFileItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => onItemClick(item)} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: margin, marginRight: margin, marginTop: 10 }}>
        <View style={{ borderRadius: 15, backgroundColor: isDark ? '#1C1C1C' : '#F8F8F3', width: 30, height: 30, justifyContent: 'center' }}>
          {item.cover_image ? <DynamicImage url={item.cover_image} style={style.coverImage} />
            :
            <MaterialCommunityIcons
              name={item.type == 'audio' ? "playlist-music" : item.type == 'image' ? 'image' : item.type == 'video' ? 'youtube-subscription' : 'doc'}
              color={isDark ? '#E7B720' : (item.type == 'audio' ? '#FBBB00' : item.type == 'image' ? '#508FFC' : item.type == 'video' ? '#E94848' : '#FBBB00')}
              size={16}
              style={{ alignSelf: 'center' }} />
          }
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ECECEC', marginLeft: margin, paddingBottom: 8, paddingTop: 8 }}>
          <View style={{ flex: 1 }}>
            <Text style={style.fileTitle}>{item.title}</Text>
            <Text style={style.fileType}>{item.type}</Text>
          </View>
          <TouchableOpacity>
            <SimpleLineIcons name="options" color="#8E8E93" size={16} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }

  const listEmptyComponent = () => {
    return (
      <View style={{ width: width, height: vh / 1.35, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ borderRadius: 8, backgroundColor: isDark ? '#1C1C1C' : '#F8F8F3', justifyContent: 'center', padding: 8 }}>
          <MaterialCommunityIcons
            name={currentTab == 'songs' ? "playlist-music" : currentTab == 'image' ? 'image' : currentTab == 'video' ? 'youtube-subscription' : 'file-document'}
            color={isDark ? '#E7B720' : (currentTab == 'music' ? '#FBBB00' : currentTab == 'image' ? '#508FFC' : currentTab == 'video' ? '#E94848' : '#FBBB00')}
            size={50}
            style={{ alignSelf: 'center' }} />
        </View>
        <Text style={{ color: colors.textColor, fontFamily: 'SFProDisplay-Regular', fontSize: 18, marginTop: 20 }}>No {currentTab == 'songs' ? "Music" : currentTab == 'image' ? 'Image' : currentTab == 'video' ? 'Video' : 'Recent work'} added</Text>
        <Text style={{ color: colors.textColor, fontFamily: 'SFProDisplay-Regular', fontSize: 14, marginTop: 10 }}>Your upload works will appear here</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        title={'My Files'}
        isBackButton={true}
        isIcon={false}
        isSearch={false} />

      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={() => onSearchClick()} style={styles.searchView}>
          <FontAwesome name="search" color={isDark ? '#FFFFFF' : '#8E8E93'} size={15} style={{ marginLeft: 8 }} />
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.searchInput}
            value={search}
            autoFocus={false}
            editable={false}
            returnKeyType={'search'}
            keyboardType={'default'}
            autoCapitalize="none"
            placeholder="Search"
            placeholderTextColor={isDark ? '#FFFFFF' : '#8E8E93'}
            autoCorrect={false}
            onChangeText={(text) => { setSearch(text) }}
            blurOnSubmit={false} />
        </TouchableOpacity>

        <View style={{ marginTop: margin, flexDirection: 'row', alignItems: 'center', marginLeft: margin, paddingBottom: margin }}>
          <TouchableOpacity onPress={() => onChangeTab('recent')} style={currentTab == 'recent' ? style.currentTabView : style.tabView}>
            <Text style={currentTab == 'recent' ? style.tabSelectTitile : style.tabTitile}>Recent</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onChangeTab('songs')} style={currentTab == 'songs' ? style.currentTabView : style.tabView}>
            <Text style={currentTab == 'songs' ? style.tabSelectTitile : style.tabTitile}>Music</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onChangeTab('video')} style={currentTab == 'video' ? style.currentTabView : style.tabView}>
            <Text style={currentTab == 'video' ? style.tabSelectTitile : style.tabTitile}>Video</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onChangeTab('image')} style={currentTab == 'image' ? style.currentTabView : style.tabView}>
            <Text style={currentTab == 'image' ? style.tabSelectTitile : style.tabTitile}>Images</Text>
          </TouchableOpacity>
        </View>
        {!isLoading &&
          <FlatList
            showsVerticalScrollIndicator={false}
            data={currentTab == 'songs' ? songs : currentTab == 'video' ? videos : currentTab == 'image' ? images : recents}
            renderItem={renderFileItem}
            ListEmptyComponent={listEmptyComponent}
            onRefresh={() => onRefreshFiles()}
            refreshing={false}
            keyExtractor={(item, index) => index.toString()}
          />
        }
        {isLoading &&
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <DotsLoader color={colors.loading} size={15} />
          </View>
        }
      </View>

      <Modal animationType="fade" transparent={false} visible={openMedia}>
        <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'stretch' }}>
          <MedaiPlayer
            data={item != null ? item.work : []}
            type={item != null ? item.type : ''}
            count={item != null ? item.work.length : 0}
            itemStyle={{ flex: 1, width: vw, height: vh }}
            isFullScreen
          />
          <TouchableOpacity onPress={() => {
            setItem(null);
            setOpenMedia(false);
          }}
            style={{ position: 'absolute', top: 30 + notchPadding, left: 15, shadowColor: '#000000', shadowRadius: 3.84, shadowOpacity: 0.25, shadowOffset: { width: 0, height: 2 }, elevation: 3, backgroundColor: '#FFFFFF', padding: 4, borderRadius: 15 }}>
            <AntDesign name="close" color="#000000" size={15} />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
