'use strict';

import React, {useRef, useEffect, useState} from 'react';
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
import FastImage from 'react-native-fast-image';
import DeviceInfo from 'react-native-device-info';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
import { DotsLoader } from 'react-native-indicator';
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
import user_cover from '../images/user_cover.png';

let {height, width} = Dimensions.get('window');
let notchPadding = DeviceInfo.hasNotch() ? 21 : 0;
let margin = 15;

const cancelTokenSource = axios.CancelToken.source();

export default function Search() {
  const navigation = useNavigation();
  const{ colors, isDark} = useTheme();
  const styles = useGlobalStyles();
  const[topSearch, setTopSearch]= useState(["#house", "#deephouse","#rap", "#julytrending", "#julyhits", "#chill", "#hiphop", "#freestyle", "#lofi", "#party", "#rythm"]);
  const[isLoading, setLoading]=useState(true);
  const[result, setResult] = useState([]);
  const[search, setSearch] = useState('');
  const[currentTab, setCurrentTab] = useState('accounts');
  const[services, setServices] = useState([
              {title: 'Bombay Studios', desc:'Lorem ipsum dolor sit amet adipisci Lorem ipsum dolor sit amet adipisci Lorem ipsum dolor sit amet adipisci', rating: '2/5 Stars Rating', address:'Jervis Street, Dublin'},
              {title: 'Park Lane Studios', desc:'New Alubum released today.',  rating: '2/5 Stars Rating', address:'Jervis Street, Dublin'},
              {title: 'Soir Studios', desc:'Lorem ipsum dolor sit amet adipisci Lorem ipsum dolor sit amet adipisci', rating: '2/5 Stars Rating', address:'Jervis Street, Dublin'},
              {title: 'Maddox Studios', desc:'Lorem ipsum dolor sit amet adipisci Lorem ipsum dolor sit amet adipisci', rating: '2/5 Stars Rating', address:'Jervis Street, Dublin'},
              {title: 'Koo Studios', desc:'Lorem ipsum dolor sit amet adipisci Lorem ipsum dolor sit amet adipisci', rating: '2/5 Stars Rating', address:'Jervis Street, Dublin'},
              {title: 'Fleminton Studios', desc:'Lorem ipsum dolor sit amet adipisci Lorem ipsum dolor sit amet adipisci', rating: '2/5 Stars Rating', address:'Jervis Street, Dublin'},
              {title: 'Julie Annan', desc:'Lorem ipsum dolor sit amet adipisci Lorem ipsum dolor sit amet adipisci', rating: '2/5 Stars Rating', address:'Jervis Street, Dublin'},
              {title: 'Michael Anning', desc:'Lorem ipsum dolor sit amet adipisci Lorem ipsum dolor sit amet adipisci', rating: '2/5 Stars Rating', address:'Jervis Street, Dublin'},
              ]);
  const style = StyleSheet.create({
    currentTabView: {
      flex: 1,
      borderBottomWidth: 1,
      borderColor: isDark ? '#FBBB00' : '#000000',
      paddingBottom: 10,
      alignItems: 'center',
    },
    tabView: {
      flex: 1,
      paddingBottom: 10,
      alignItems: 'center',
    },
  });

  function onChangeTab(tab) {
    setCurrentTab(tab);
    setResult([]);
    setLoading(true);
    searchApi('', tab)
  }

  function searchApi(searchText, tab) {
    setSearch(searchText);
    let params = {
      type: tab == 'accounts' ? 'users' : 'services',
      search_param: searchText
    }
    console.log('params: ', params);
    try {
      API.callUserApi(CONSTANTS.BASE_URL + 'search', params, this, 'POST')
        .then((response)=> {
          console.log('blank Search Response::: ', JSON.stringify(response));
          setLoading(false);
          if (response.error == 0) {
            setResult(response.result);
          }
        })
    } catch (e) {
      console.log('Search Error: ',e);
    }
  }

  function onChangeText(text) {
       setSearch(text);
       if (text.length >= 3 || text.length == 0) {
         searchApi(text,currentTab)
       }
    }
    useEffect(()=> {
      searchApi('', currentTab)
    },[]);
  function onCancelRequest() {
    Keyboard.dismiss()
    setSearch('');
    setResult([]);
    searchApi('', currentTab)
    cancelTokenSource.cancel('Operation canceled by the user.');
    //source.cancel('Operation canceled by the user.');
  }

  function onUserPress(item) {
    console.log('User Click : ',JSON.stringify(item));
    navigation.navigate("UserProfile", {userId : item._id});
  }

  function onItemClick(item){
    console.log('Item : ',item);
    navigation.navigate("CompanyProfile",{item});
  }
   function onServicesClick(item) {
     navigation.navigate('Services', {item : item});
   }

    return (
      <View style={styles.container}>
          <Header
            isBackButton= {true}
            isInbox={true}
            title="Search"
            isIcon={false}/>

          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={[styles.searchView, { flex: 1}]}>
                <FontAwesome name="search" color={isDark ? '#FFFFFF' : '#ECECEC'} size={15} style={{marginLeft: 8}} />
                <TextInput
                    underlineColorAndroid="transparent"
                    style={styles.searchInput}
                    value={search}
                    autoFocus={false}
                    returnKeyType = { 'search' }
                    keyboardType = { 'default' }
                    autoCapitalize="none"
                    placeholder={"Search " + currentTab}
                    placeholderTextColor={isDark ? '#FFFFFF' : '#8E8E93'}
                    autoCorrect={false}
                    onChangeText={(text) => onChangeText(text)}
                    blurOnSubmit={false} />
              </View>
              {search !='' &&
                <TouchableOpacity onPress={()=> onCancelRequest()} style={{justifyContent: 'center', alignItems: 'center', marginRight: margin, marginTop: 4}}>
                  <Text style={{color: colors.textColor}}>Cancel</Text>
                </TouchableOpacity>
              }

            </View>

            <View style={{flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#8E8E93', marginTop: margin}}>
              <TouchableOpacity onPress={()=> onChangeTab('accounts')} style={currentTab == 'accounts' ? style.currentTabView : style.tabView}>
                <Text style={currentTab == 'accounts' ? styles.tabSelectTitile : styles.tabTitile}>Accounts</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=> onChangeTab('services')} style={currentTab == 'services' ? style.currentTabView : style.tabView}>
                <Text style={currentTab == 'services' ? styles.tabSelectTitile : styles.tabTitile}>Services</Text>
              </TouchableOpacity>
            </View>

            <View style={{flex: 1}}>
              {!isLoading ?
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  data={result}
                  renderItem={({index, item}) =>

                    <View>
                        {currentTab == 'accounts' ?
                              <TouchableOpacity onPress={()=> onUserPress(item)} style={{padding: 6, alignItems: 'center', flexDirection: 'row', marginTop: 4, marginLeft: margin, marginRight: margin}}>
                                  <View>
                                    {item.profile_image ? <FastImage source={{uri : item.profile_image, priority: FastImage.priority.high}} style={{width: 40, height: 40, borderRadius: 20}}/> : <FontAwesome name="user-circle-o" color={colors.textColor} size={40} />}
                                  </View>
                                  <View style={{ marginLeft: margin}}>
                                    <Text style={{color: colors.textColor}}>{item.hasOwnProperty('user_name') ? item.user_name : item.email}</Text>
                                    <Text style={{ color: colors.text2Color}}>{item.location}</Text>
                                  </View>
                              </TouchableOpacity>
                              :
                              <TouchableOpacity style={{backgroundColor: !isDark ? '#FFFFFF' : '#141414', borderRadius: 5, marginTop: 15, marginLeft: 15, marginRight: 15, shadowColor: '#000000', shadowRadius: 3.84, shadowOpacity: 0.25, shadowOffset: {width: 0, height: 2}, elevation: 3}}
                                activeOpacity={1}
                                onPress={() => onServicesClick(item)}>
                                    <View style={{flexDirection: 'row', justifyContent: 'center', padding: 10}}>
                                       <View style={{alignSelf: 'flex-start', marginTop: 3}}>
                                         <FastImage source={{
                                           uri : item.image,
                                           priority: FastImage.priority.high
                                         }} style={{width: 70, height: 70, borderRadius: 10}}/>
                                       </View>
                                       <View style={{flex:1, backgroundColor: 'transparent', justifyContent:'flex-start', marginLeft:15}}>
                                           <Text style={{ color: !isDark ? colors.textColor :'#FFFFFF', fontFamily: 'SFProDisplay-Regular', fontSize: 16, fontWeight:'bold'}}>{item.title}</Text>
                                           <Text numberOfLines={2} style={{color: '#B7BABD', fontFamily: 'SourceSansPro-Regular', fontSize: 15, marginTop:8}}>{item.service_desc}</Text>
                                           {/*<Text style={{color: '#B7BABD', fontFamily: 'SourceSansPro-Regular', fontSize: 10, marginTop:8}}>{item.rating} | {item.address}</Text>*/}
                                       </View>
                                   </View>
                             </TouchableOpacity>
                      }
                    </View>
                   }
                   keyExtractor={(item, index) => index.toString()}
                />
                :
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                  <DotsLoader color={colors.loading} size={15} />
                </View>
              }
            </View>
          </View>
      </View>
    );
}
