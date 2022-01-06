'use strict';

import React, { useRef, useEffect, useState } from 'react';
import {
  Text,
  View,
  TextInput,
  Platform,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Keyboard,
  ScrollView,
  FlatList,
  AppState,
} from 'react-native';

// import SplashScreen from 'react-native-splash-screen';
import DeviceInfo from 'react-native-device-info';
import SpinnerButton from 'react-native-spinner-button';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ImageSlider from 'react-native-image-slider';
import { DotsLoader } from 'react-native-indicator';
import DynamicImage from '../components/dynamicImage';
var moment = require('moment');
import { useTheme, useNavigation } from '@react-navigation/native';

import { userActive } from '../global/Message';
import Header from '../global/header';
import ConnectionContainer from '../components/connection';
import MedaiPlayer from '../components/mediaPlayer';
import useGlobalStyles from '../styles/Styles';
const API = require('../network/api.js');
const CONSTANTS = require('../global/constants.js');
const FUNCTIONS = require('../global/functions.js');

import cover from '../images/cover.png';
import hardwell from '../images/hardwell.png';
import menu from '../images/menu.png';
import vh from '../Units/vh';

let { height, width } = Dimensions.get('window');
let notchPadding = DeviceInfo.hasNotch() ? 21 : 0;
let margin = 15;
let page = 1;

export default function Home() {
  const appState = useRef(AppState.currentState);
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const styles = useGlobalStyles();
  const searchRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const [isNoMoreData, setNoMoreData] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [isPaused, setPaused] = useState(false);
  const [events, setEvents] = useState([]);
  const [userList, setUserList] = useState([]);
  const [connections, setConnections] = useState([]);
  const [topSearch, setTopSearch] = useState([]);
  const [popularServices, setPopularServices] = useState([]);
  const [search, setSearch] = useState('');

  const style = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      //alignItems: 'stretch',
    },
    imgAlbum: {
      width: '100%',
      height: vh * 0.1,
      borderTopLeftRadius: 13,
      borderTopRightRadius: 13,
    },
    popularSerivce: {
      marginTop: 8,
      alignItems: 'center',
      width: (width - 40) / 2.7,
      marginLeft: margin,
      marginRight: margin,
      marginBottom: 10,
      borderRadius: 13,
      backgroundColor: colors.background,
      shadowRadius: 3.84,
      shadowColor: !isDark ? '#000' : '#FFF',
      shadowOpacity: 0.25,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      elevation: 5,
    },
    headingText: {
      color: colors.textColor,
      fontSize: 15,
      fontFamily: 'SFProDisplay-Bold',
      marginLeft: 18,
      marginRight: 18,
      marginBottom: 8,
    },
  });

  const onItemClick = (item) => {
    //console.log('Item Click : ',item);
    navigation.navigate('CompanyProfile', { item });
  };

  useEffect(() => {
    // SplashScreen.hide();
    setLoading(true);
    // setTimeout(() => SplashScreen.hide(), 1000);
    const unsubscribe = navigation.addListener('focus', () => {
      setUserList([]);
      page = 1;
      setNoMoreData(false);
      setIsSearch(false);
      setSearch('');
      getEvents();
      getPopularServices();
    });

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      appState.current = nextAppState;

      userActive(CONSTANTS.USER._id, appState.current);
    });
    return () => {
      subscription;
      unsubscribe;
    };
  }, []);

  function getEvents() {
    //console.log('Get Event Called');
    try {
      setLoadMore(true);
      API.callUserApi(
        CONSTANTS.BASE_URL + 'home/page/' + page,
        {},
        this,
        'GET',
      ).then((response) => {
        setLoading(false);
        setLoadMore(false);
        //console.log('GetEvent Response : ',JSON.stringify(response));
        if (response.error == 0) {
          if (response.hasOwnProperty('result')) {
            if (response.result.user_connections.length > 0) {
              setEvents(
                page == 1
                  ? response.result.user_connections
                  : [...events, ...response.result.user_connections],
              );
            } else {
              setNoMoreData(true);
            }
            if (page == 1) {
              setConnections(response.result.connections);
              setTopSearch(response.result.search_tags);
            }
          } else {
            //setNoMoreData(true);
          }
          if (response.result.hasOwnProperty('unread_notifications_count')) {
            CONSTANTS.NOTIFICATION_COUNT =
              response.result.unread_notifications_count;
          }
        }
      });
    } catch (e) {
      setLoading(false);
      console.log('GetEvent Error : ', e);
    }
  }

  function onRefreshEvent() {
    //console.log('Event Refresh');
    setNoMoreData(false);
    page = 1;
    getEvents();
  }

  function onUserPress(item) {
    //console.log('User Click : ',JSON.stringify(item));
    navigation.navigate('UserProfile', { userId: item._id });
  }

  function onConnectionClick(item) {
    //console.log('connections: ', JSON.stringify(item));
    onUserPress(item);
  }

  function getPopularServices() {
    try {
      API.callUserApi(CONSTANTS.BASE_URL + 'services', {}, this, 'GET').then(
        (response) => {
          console.log('Popular Serivces Response :', (response)); //JSON.stringify
          setLoading(false);
          if (response.error == 0) {
            setPopularServices(response.services);
          }
        },
      );
    } catch (e) {
      console.log('Error : ', e);
    }
  }

  function searchUser(text) {
    setSearch(text);
    try {
      API.callUserApi(CONSTANTS.BASE_URL + 'users', {}, this, 'GET').then(
        (response) => {
          console.log('Search Response :', JSON.stringify(response));
          setLoading(false);
          setUserList(response.result);
        },
      );
    } catch (e) {
      console.log('Error : ', e);
    }
  }

  function onSearchClick() {
    navigation.navigate('Search');
  }

  const loadMoreRandomData = () => {
    if (!isNoMoreData) {
      if (!loadMore) {
        page = page + 1;
        setLoadMore(true);
        getEvents();
        console.log('Page update : ', page);
      }
    }
  };

  const renderItem = ({ item }) => {
    if (!item.hasOwnProperty('works')) {
      return null;
    }
    let type = item?.works.type;
    let views = item?.works?.work[0]?.views;
    return (
      <View style={styles.albumView}>
        <MedaiPlayer
          data={item.works.work}
          type={type}
          count={item.works.work.length}
          itemStyle={styles.albumHeaderImage}
        />
        <View style={{ flexDirection: 'row', paddingBottom: 6 }}>
          <View style={styles.albumprofileView}>
            {item.profile_image ? (
              <DynamicImage
                url={item.profile_image}
                style={styles.albumProfileImage}
              />
            ) : (
              <FontAwesome
                name="user-circle-o"
                color={colors.textColor}
                size={30}
              />
            )}
          </View>

          <View style={styles.albumContentView}>
            <Text style={styles.albumTitle}>{item.works.title}</Text>
            <Text style={styles.albumType}>Tomorrowland</Text>
            <View style={styles.albumSubContentView}>
              <Text style={styles.albumDetail}>{item.user_name}</Text>
              <Text style={styles.albumDetail}>
                {item.views}
                {views} Views
              </Text>
              <Text style={styles.albumDetail}>
                {moment.utc(item.works.created_at).fromNow()}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => onItemClick(item)}
            style={styles.albumMenuView}>
            <Image
              source={menu}
              style={{ resizeMode: 'contain', width: 7, height: 20 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (loadMore) {
      return (
        <View style={{ alignItems: 'center', padding: 10 }}>
          <ActivityIndicator color={colors.textColor} />
        </View>
      );
    }
    return null;
  };

  return (
    <View style={[style.container, { backgroundColor: colors.background }]}>
      <Header title={''} isBackButton={false} isIcon={true} isInbox={true} />

      <TouchableOpacity
        onPress={() => onSearchClick()}
        style={styles.searchView}>
        <FontAwesome
          name="search"
          color={isDark ? '#FFFFFF' : '#ECECEC'}
          size={15}
          style={{ marginLeft: 8 }}
        />
        <TextInput
          underlineColorAndroid="transparent"
          ref={searchRef}
          style={[styles.searchInput, { width: '90%', marginBottom: 0 }]}
          value={search}
          autoFocus={false}
          editable={false}
          pointerEvents={isSearch ? 'auto' : 'none'}
          returnKeyType={'search'}
          keyboardType={'default'}
          autoCapitalize="none"
          placeholder="Search"
          placeholderTextColor={isDark ? '#FFFFFF' : '#8E8E93'}
          autoCorrect={false}
          onChangeText={(text) => searchUser(text)}
          blurOnSubmit={false}
        />
      </TouchableOpacity>

      <View style={{ marginBottom: 8 }}>
        <ConnectionContainer
          imageStyle={styles.connectionsImage}
          data={connections}
          itemStyle={styles.connectionsView}
          onItemClick={(item) => onConnectionClick(item)}
        />
      </View>

      {loading && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <DotsLoader color={colors.loading} size={15} />
        </View>
      )}
      {!loading && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ height: '100%' }}>
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              {popularServices.length > 0 ? (
                <View style={{ marginTop: 10 }}>
                  <Text numberOfLines={2} style={style.headingText}>
                    Popular Services
                  </Text>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    horizontal
                    data={popularServices}
                    renderItem={({ index, item }) => (
                      <TouchableOpacity
                        style={style.popularSerivce}
                        onPress={() => {
                          console.log('index: ' + index);
                          navigation.navigate('Services', { item: item });
                        }}>
                        {item.image != null ? (
                          <DynamicImage
                            url={item.image}
                            style={style.imgAlbum}
                          />
                        ) : (
                          <Image source={cover} style={style.imgAlbum} />
                        )}
                        <Text
                          numberOfLines={2}
                          style={{
                            color: colors.textColor,
                            fontSize: 11,
                            fontFamily: 'SFProDisplay-Bold',
                            textAlign: 'center',
                            paddingTop: 15,
                            paddingBottom: 15,
                            paddingLeft: 10,
                            paddingRight: 10,
                          }}>
                          {item.title}
                        </Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              ) : null}
              <Text numberOfLines={1} style={style.headingText}>
                Recommended for You
              </Text>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={events}
                renderItem={renderItem}
                onRefresh={() => onRefreshEvent()}
                refreshing={false}
                onEndReachedThreshold={0}
                onEndReached={loadMoreRandomData}
                ListFooterComponent={renderFooter}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
