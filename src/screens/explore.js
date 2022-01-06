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
  Keyboard,
  ScrollView,
  FlatList,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DeviceInfo from 'react-native-device-info';
import Snackbar from 'react-native-snackbar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import { DotsLoader } from 'react-native-indicator';
import DynamicImage from '../components/dynamicImage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

var RNFS = require('react-native-fs');
import Header from '../global/header';
import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
import PopupDialog from '../components/popupDialog';
import useGlobalStyles from '../styles/Styles';

import img_search from '../images/img_search.png';
import user_cover from '../images/user_cover.png';

let { height, width } = Dimensions.get('window');
const API = require('../network/api.js')
const CONSTANTS = require('../global/constants.js')
const FUNCTIONS = require('../global/functions.js')
let notchPadding = DeviceInfo.hasNotch() ? 21 : 0;
let columns = 2;
let margin = 15;

export default function Explore() {
  const route = useRoute();
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const styles = useGlobalStyles();
  const [search, setSearch] = useState('');
  const [title, setTitle] = useState('');
  const [isMusicList, setMusicList] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadType, setUploadType] = useState('');
  const [isTitle, setIsTitle] = useState(false);
  const [isAddMedia, setAddMedia] = useState(true);
  const [isUploading, setUploading] = useState(false);
  const [selectMedia, setSelectMedia] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [isDataLoading, setisDataLoading] = useState(true);
  const [explores, setExplores] = useState([]);
  const [explores1, setExplores1] = useState([]);

  useEffect(() => {
    getConnectionApiData();
    const unsubscribe = navigation.addListener('focus', () => {
      if (!isUploading) {
        setAddMedia(true);
      }
    });
    return unsubscribe;
  }, []);


  function getConnectionApiData() {
    console.log('Connection api call......');
    try {
      setisDataLoading(true);
      API.callUserApi(CONSTANTS.BASE_URL + 'connections', {}, this, 'GET')
        .then((response) => {
          console.log('Connection api Response: ', JSON.stringify(response));
          setisDataLoading(false);
          if (response.error == 0) {
            setExplores1(response.result)
            setExplores(response.result)
          }
        });
    } catch (e) {
      console.log('GetData Error: ', e);
    }
  }

  function onSearchClick() {
    console.log('onSearchClick Click');
    navigation.navigate("SearchScreen");
  }

  function openImageVideoPicker(type) {
    console.log('Picker Type: ', type);
    try {
      let dataType = 'data:image/jpeg;base64,';
      setUploadType(type);
      let option = {
        multiple: true,
      }
      if (type == 'video') {
        option.mediaType = "video";
        option.compressVideoPreset = "HighestQuality";
        dataType = 'data:video/mp4;base64,'
      } else {
        option.mediaType = "photo";
      }
      let data = {};

      ImagePicker.openPicker(option).then(images => {
        console.log('ImagePicker : ', images);
        let updateArray = images.map((row, index) => {
          let obj = {};
          console.log('File Size : ', FUNCTIONS.bytesToSize(row.size));
          //multiple upload
          obj.type = type; //audio or image
          obj.filepath = Platform.OS == 'android' ? row.path : row.sourceURL;
          obj.filename = row.filename;
          obj.filetype = row.mime;
          obj.size = FUNCTIONS.bytesToSize(row.size);
          return obj;
        });

        setTimeout(() => {
          // console.log('updateArray : ', updateArray);
          setIsTitle(true);
          setSelectMedia(updateArray);
        }, 500);
      });
    } catch (e) {
      console.log('Error : ', e);
    }
  }

  const progressCallback = progressEvent => {
    const percentFraction = progressEvent.loaded / progressEvent.total;
    const percent = Math.floor(percentFraction * 100);
    setProgress(percent);
    console.log('Upload Progress : ', percent);
  }

  async function getMusicList() {
    console.log('GetMusicList called');
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.audio],
      });

      let updateAudio = [];

      for (var row of results) {
        let obj = {};
        obj.type = 'audio'; //audio or image
        obj.filepath = row.uri;
        obj.filename = row.name;
        obj.filetype = row.type;
        obj.size = FUNCTIONS.bytesToSize(row.size);
        updateAudio.push(obj);
        console.log('Update Row : ', obj);
      }

      // let updateAudio = results.filter((row,index)=> {
      //   console.log('Row: ', row);
      //   let obj = {};
      //   obj.type = 'audio'; //audio or image
      //   obj.filepath = row.uri;
      //   obj.filename =  row.name;
      //   obj.filetype = row.type;
      //   obj.size = FUNCTIONS.bytesToSize(row.size);
      //   return obj;
      // });

      console.log('updateAudio : ', JSON.stringify(updateAudio));

      setTimeout(() => {
        // console.log('updateArray : ', updateArray);
        setUploadType("audio");
        setIsTitle(true);
        setSelectMedia(updateAudio);
      }, 500);

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  function onCoverIamgePicker() {
    try {
      ImagePicker.openPicker({
        cropping: false,
        mediaType: 'photo'
      }).then(image => {
        console.log(image);
        let obj = {};
        obj.filepath = Platform.OS == 'android' ? image.path : image.sourceURL;
        obj.filename = image.filename;
        obj.filetype = image.mime;
        obj.size = FUNCTIONS.bytesToSize(image.size);
        setCoverImage(obj);
      });
    } catch (e) {
      console.log('Cover Upload error: ', e);
    }
  }

  function onDismissmodel() {
    setCoverImage(null)
    setIsTitle(false)
    setUploading(false);
    setSelectMedia([]);
    setProgress(0);
    setTitle('');
    setUploadType('');
  }

  function uploadWork() {
    console.log('Upload Work');
    if (title != '') {
      try {
        let obj = {};
        obj.title = title;
        obj.type = uploadType;
        obj.status = 'active';
        setUploading(true);
        setIsTitle(false);
        Keyboard.dismiss();
        API.callUploadFile(CONSTANTS.BASE_URL + 'file/work', obj, selectMedia, coverImage, progressCallback)
          .then((response) => {
            console.log('File Upload Response : ', response);
            if (response.error == 0) {
              setCoverImage(null)
              setAddMedia(false);
              setUploading(false);
              setSelectMedia([]);
              setProgress(0);
              setTitle('');
              setUploadType('');
            }
            Snackbar.show({ text: response.message, duration: Snackbar.LENGTH_SHORT });

          });
      } catch (e) {
        console.log("Upload Error: ", e);
      }
    }
    else {
      Snackbar.show({ text: 'Please enter work title', duration: Snackbar.LENGTH_SHORT });
    }
  }

  return (
    <View style={[style.container, { backgroundColor: colors.background }]}>
      <Header
        title={''}
        isBackButton={false}
        isIcon={true}
        isInbox={true} />

      <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => onSearchClick()} style={styles.searchView}>
            <Image source={img_search} style={styles.searchImage} />
            <TextInput
              underlineColorAndroid="transparent"
              style={styles.searchInput}
              value={search}
              autoFocus={false}
              returnKeyType={'search'}
              keyboardType={'default'}
              autoCapitalize="none"
              placeholder="Search"
              placeholderTextColor={isDark ? '#FFFFFF' : '#8E8E93'}
              autoCorrect={false}
              onChangeText={(text) => { setSearch(text) }}
              blurOnSubmit={false} />
          </TouchableOpacity>

          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            numColumns={columns}
            style={{ marginTop: margin }}
            data={explores}
            renderItem={({ index, item }) =>
              <TouchableOpacity style={style.albumView}>
                {item.cover_pic != null ? <DynamicImage url={item.cover_pic} style={style.imgAlbum} /> : <Image source={user_cover} style={style.imgAlbum} />
                }
                <Text style={{ color: colors.textColor, fontSize: 16, fontFamily: 'SourceSansPro-Regular', textAlign: 'center' }}>{item.user_name}</Text>
                <Text numberOfLines={2} style={{ color: '#8E8E93', fontSize: 14, fontFamily: 'SourceSansPro-Regular', textAlign: 'center' }}>{item.service_desc}</Text>
              </TouchableOpacity>
            }
            keyExtractor={(item, index) => index.toString()}
          />

          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            horizontal
            style={{ marginTop: margin }}
            data={explores}
            renderItem={({ index, item }) =>
              <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', width: width }}>
                {item.cover_pic != null ? <DynamicImage resizeMode="cover" url={item.cover_pic} style={{ height: 153, borderRadius: 4, width: width - 30, }} /> : <Image resizeMode="cover" source={user_cover} sstyle={{ height: 153, borderRadius: 4, width: width - 30, }} />
                }
                <Text style={{ fontSize: 16, fontFamily: 'SourceSansPro-Regular', color: colors.textColor }}>{item.user_name}</Text>
                <Text numberOfLines={2} style={{ color: '#8E8E93', fontSize: 14, fontFamily: 'SourceSansPro-Regular', textAlign: 'center', paddingLeft: 20, paddingRight: 20 }}>{item.service_desc}</Text>
              </TouchableOpacity>
            }
            keyExtractor={(item, index) => index.toString()}
          />
          {!isDataLoading ?
            <FlatList
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              numColumns={columns}
              style={{ marginTop: margin, marginBottom: 4 }}
              data={explores1}
              renderItem={({ index, item }) =>
                <TouchableOpacity style={style.albumView}>
                  {item.cover_pic != null ? <DynamicImage url={item.cover_pic} style={style.imgAlbum} /> : <Image source={user_cover} style={style.imgAlbum} />
                  }
                  <Text style={{ color: colors.textColor, fontSize: 16, fontFamily: 'SourceSansPro-Regular', textAlign: 'center' }}>{item.user_name}</Text>
                  <Text numberOfLines={2} style={{ color: '#8E8E93', fontSize: 14, fontFamily: 'SourceSansPro-Regular', textAlign: 'center' }}>{item.service_desc}</Text>
                </TouchableOpacity>
              }
              keyExtractor={(item, index) => index.toString()}
            />
            :
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <DotsLoader color={colors.loading} size={15} />
            </View>
          }
        </View>
      </ScrollView>

      <TouchableOpacity onPress={() => { setAddMedia(true) }} style={{ position: 'absolute', right: 10, bottom: 20, shadowColor: '#000000', shadowRadius: 3.84, shadowOpacity: 0.25, shadowOffset: { width: 0, height: 2 }, elevation: 3, backgroundColor: isDark ? '#FFFFFF' : '#FBBB0E', padding: 4, borderRadius: 4 }}>
        <AntDesign name="plus" color="#000000" size={20} />
      </TouchableOpacity>

      <Modal animationType="fade" transparent={true} visible={isAddMedia}>
        <View style={{ width: width, height: height, backgroundColor: 'rgba(4, 4, 16, 0.80)', position: 'absolute', justifyContent: 'flex-end' }}>
          <View style={{ width: width, backgroundColor: colors.background, borderTopLeftRadius: 8, borderTopRightRadius: 8, paddingBottom: 60 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 15, paddingRight: 15, marginTop: 8, paddingBottom: 8, borderBottomWidth: 0.8, borderColor: '#8E8E93' }}>

              <Text style={{ color: colors.textColor, fontSize: 16, fontFamily: 'SourceSansPro-Regular', fontWeight: '700' }}>
                {isUploading ? (uploadType == 'audio' ? 'Music Uploading...' : uploadType == 'image' ? 'Image Uploading...' : uploadType == 'video' ? 'Video Uploading...' : '') : 'Upload my work'}
              </Text>

              {!isUploading &&
                <TouchableOpacity onPress={() => setAddMedia(false)} style={{ shadowColor: '#000000', shadowRadius: 3.84, shadowOpacity: 0.25, shadowOffset: { width: 0, height: 2 }, elevation: 3, backgroundColor: '#FFFFFF', padding: 4, borderRadius: 15 }}>
                  <AntDesign name="close" color="#000000" size={15} />
                </TouchableOpacity>
              }

            </View>

            {false ?
              <View style={{ justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center', marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                <TouchableOpacity onPress={() => getMusicList()}>
                  <View style={{ borderRadius: 8, backgroundColor: isDark ? '#1C1C1C' : '#F8F8F3', width: 58, height: 57, justifyContent: 'center' }}>
                    <MaterialCommunityIcons name="playlist-music" color={isDark ? '#FFFFFF' : '#E7B720'} size={20} style={{ alignSelf: 'center' }} />
                  </View>
                  <Text style={{ fontSize: 16, fontFamily: 'SourceSansPro-Regular', color: isDark ? '#FFFFFF' : '#E7B720', alignSelf: 'center', marginTop: 4 }}>Music</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => openImageVideoPicker('video')}>
                  <View style={{ borderRadius: 8, backgroundColor: isDark ? '#1C1C1C' : '#F8F8F3', width: 58, height: 57, justifyContent: 'center' }}>
                    <MaterialCommunityIcons name="youtube-subscription" color={isDark ? '#FFFFFF' : '#B7BABD'} size={20} style={{ alignSelf: 'center' }} />
                  </View>
                  <Text style={{ fontSize: 16, fontFamily: 'SourceSansPro-Regular', color: '#8E8E93', alignSelf: 'center', marginTop: 4 }}>Video</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => openImageVideoPicker('image')}>
                  <View style={{ borderRadius: 8, backgroundColor: isDark ? '#1C1C1C' : '#F8F8F3', width: 58, height: 57, justifyContent: 'center' }}>
                    <MaterialCommunityIcons name="image" color={isDark ? '#FFFFFF' : '#B7BABD'} size={20} style={{ alignSelf: 'center' }} />
                  </View>
                  <Text style={{ fontSize: 16, fontFamily: 'SourceSansPro-Regular', color: '#8E8E93', alignSelf: 'center', marginTop: 4 }}>Image</Text>
                </TouchableOpacity>
              </View>
              :
              <View style={{ marginLeft: 20, marginRight: 20, marginTop: 15 }}>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  data={selectMedia}
                  renderItem={({ index, item }) =>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, alignItems: 'center' }}>
                      <View style={{ borderRadius: 8, backgroundColor: isDark ? '#1C1C1C' : '#F8F8F3', width: 58, height: 57, justifyContent: 'center' }}>
                        <MaterialCommunityIcons
                          name={uploadType == 'image' ? "image" : uploadType == 'video' ? 'youtube-subscription' : 'playlist-music'}
                          color={isDark ? '#FFFFFF' : '#E7B720'}
                          size={20}
                          style={{ alignSelf: 'center' }} />
                      </View>
                      <View style={{ flex: 1, marginLeft: 10, marginRight: 20, justifyContent: 'center' }}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                          <Text style={{ color: colors.textColor, fontSize: 12, fontFamily: 'SourceSansPro-Regular', textAlign: 'left' }}>{progress}%</Text>
                          <Text style={{ color: '#8E8E93', fontSize: 10, fontFamily: 'SourceSansPro-Regular', textAlign: 'right' }}>{item.size} remaining</Text>
                        </View>
                        <View style={{ height: 6, borderRadius: 3, backgroundColor: '#ECECEC', marginTop: 4, }}>
                          <View style={{ width: `${progress}%`, backgroundColor: '#FBBB00', height: 6, borderRadius: 3 }} />
                        </View>
                        <Text style={{ color: '#8E8E93', fontSize: 10, fontFamily: 'SourceSansPro-Regular', marginTop: 4 }}>{item.filename}</Text>
                      </View>
                      <TouchableOpacity onPress={() => {
                        setAddMedia(false);
                        setUploading(false);
                      }} style={{ justifyContent: 'center' }}>
                        <AntDesign name="close" color={isDark ? '#FFFFFF' : '#384149'} />
                      </TouchableOpacity>
                    </View>
                  }
                  keyExtractor={(item, index) => index.toString()}
                />
                <View style={{ borderRadius: 4, borderWidth: 1, borderStyle: 'dashed', padding: 20, borderColor: '#1C1C1C', marginTop: 15, marginBottom: 10, alignItems: 'center' }}>
                  <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <View style={{ borderRadius: 4, backgroundColor: isDark ? '#1C1C1C' : '#F8F8F8', width: 27, height: 27, justifyContent: 'center', marginLeft: 4, marginRight: 4, marginTop: 4, shadowColor: '#000000', shadowRadius: 3.84, shadowOpacity: 0.25, shadowOffset: { width: 0, height: 2 }, elevation: 3 }}>
                      <MaterialCommunityIcons name="playlist-music" color={isDark ? '#323233' : '#FBBB00'} size={15} style={{ alignSelf: 'center' }} />
                    </View>
                    <View style={{ borderRadius: 4, backgroundColor: isDark ? '#1C1C1C' : '#F8F8F8', width: 31, height: 31, justifyContent: 'center', marginLeft: 4, marginRight: 4, shadowColor: '#000000', shadowRadius: 3.84, shadowOpacity: 0.25, shadowOffset: { width: 0, height: 2 }, elevation: 3 }}>
                      <MaterialCommunityIcons name="youtube-subscription" color={isDark ? '#323233' : '#E94848'} size={15} style={{ alignSelf: 'center' }} />
                    </View>
                    <View style={{ borderRadius: 4, backgroundColor: isDark ? '#1C1C1C' : '#F8F8F8', width: 27, height: 27, justifyContent: 'center', marginLeft: 4, marginRight: 4, marginTop: 4, shadowColor: '#000000', shadowRadius: 3.84, shadowOpacity: 0.25, shadowOffset: { width: 0, height: 2 }, elevation: 3, }}>
                      <MaterialCommunityIcons name="image" color={isDark ? '#323233' : '#508FFC'} size={15} style={{ alignSelf: 'center' }} />
                    </View>
                  </View>
                  <TouchableOpacity>
                    <Text style={{ fontFamily: 'SourceSansPro-Regular', fontSize: 10, color: colors.textColor, textDecorationLine: 'underline', marginTop: 10 }}>Upload</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }

          </View>

          <Modal
            visible={isTitle}
            animationType="slide"
            onRequestClose={() => { setIsTitle(false); }}>

            <View style={{ flex: 1, backgroundColor: colors.background, paddingLeft: 20, paddingRight: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: DeviceInfo.hasNotch() ? 50 : 15 }}>
                <Text style={{ flex: 1, fontFamily: 'AcuminPro-Regular', fontSize: 23, color: isDark ? '#FFFFFF' : '#384149', textAlign: 'center' }}>Upload work</Text>
                <FontAwesome name="close" color={colors.textColor} size={20} onPress={() => onDismissmodel()} />
              </View>
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                {selectMedia.length != 0 &&
                  <Image
                    source={{ uri: selectMedia[0].filepath }}
                    style={{ width: 50, height: 50 }}
                  />
                }

                <TextInput
                  underlineColorAndroid="transparent"
                  style={{ fontFamily: 'SourceSansPro-Regular', fontSize: 14, color: isDark ? '#FFFFFF' : '#000000', marginLeft: 10 }}
                  value={title}
                  placeholder="Enter work title"
                  placeholderTextColor={isDark ? '#FFFFFF' : '#000000'}
                  autoFocus={false}
                  returnKeyType={'done'}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={(text) => { setTitle(text) }}
                  blurOnSubmit={false} />
              </View>
              <TouchableOpacity onPress={() => onCoverIamgePicker()} style={{ flexDirection: 'row', marginTop: 10 }}>
                {coverImage != null ?
                  <Image source={{ uri: coverImage.filepath }} style={{ width: 50, height: 50 }} />
                  :
                  <View style={{ borderRadius: 8, backgroundColor: isDark ? '#1C1C1C' : '#F8F8F3', width: 58, height: 57, justifyContent: 'center' }}>
                    <MaterialCommunityIcons name="image" color={isDark ? '#FFFFFF' : '#B7BABD'} size={20} style={{ alignSelf: 'center' }} />
                  </View>
                }
                <Text style={{ color: colors.textColor, fontFamily: 'SourceSansPro-Regular', fontSize: 14, alignSelf: 'center', marginLeft: 10 }}>Select Cover Image</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => uploadWork()} style={[styles.submitButton]}>
                <Text style={styles.buttonText}>Upload Work</Text>
              </TouchableOpacity>

            </View>
          </Modal>

          {/*<PopupDialog
                title = {CONSTANTS.APP_NAME}
                okButtonText = "Upload work"
                onCancel = {() => {
                  setIsTitle(false);
                  setTitle('');
                  setSelectMedia([]);
                }}
                onOk = {()=> uploadWork()}
                onTouchOutside={() => {
                  setIsTitle(false);
                  setTitle('');
                  setSelectMedia([]);
                }}
                isDark={isDark}
                visible={isTitle}>

                <View style={{margin: 15}}>
                  <TextInput
                    underlineColorAndroid="transparent"
                    style={{fontFamily: 'SourceSansPro-Regular', fontSize: 14, color: isDark ? '#FFFFFF' : '#000000'}}
                    value={title}
                    placeholder="Enter work title"
                    placeholderTextColor={isDark ? '#FFFFFF' : '#000000'}
                    autoFocus={false}
                    returnKeyType = {'done'}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={(text) => { setTitle(text) }}
                    blurOnSubmit={false} />
                </View>

               </PopupDialog>*/}
        </View>
      </Modal>
    </View>
  );
}


const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#000000'
  },
  imgAlbum: {
    width: '100%', height: height * 0.18, borderRadius: 6
  },
  albumView: {
    marginTop: 4,
    alignItems: 'center',
    width: (width - 70) / columns,
    marginLeft: margin,
    marginRight: margin
  }
});
