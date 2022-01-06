'use strict';

import React, {useRef, useEffect, useState, useCallback} from 'react';
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
    KeyboardEvent
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { GiftedChat, Send, InputToolbar, Actions, Composer, Bubble,  Message, MessageText, MessageImage} from 'react-native-gifted-chat'
import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import uuid from 'react-native-uuid';
import moment from 'moment';
import database from '@react-native-firebase/database';
import { DotsLoader } from 'react-native-indicator';

import DynamicImage from '../components/dynamicImage';
import { SendMessage, RecieveMessage } from '../global/Message';
import VideoView from '../components/videoView';
const API = require('../network/api.js');
const CONSTANTS = require('../global/constants.js');
const FUNCTIONS = require('../global/functions.js');
import Header from '../global/header';
import useGlobalStyles from '../styles/Styles';

import img_menu from '../images/img_menu.png';
import ic_send from '../images/ic_send.png';
import ic_emoji from '../images/ic_emoji.png';
import ic_user from '../images/user.png';

let {height, width} = Dimensions.get('window');
let notchPadding = DeviceInfo.hasNotch() ? 21 : 0;
let margin = 15;

export default function Chat() {
  const route = useRoute();
  const navigation = useNavigation();
  const{colors, isDark} = useTheme();
  const styles = useGlobalStyles();
  const [loading, setLoading] = useState(true);
  const[user, setUser] = useState(route.params.item);
  const[isOnline, setIsOnline]=useState(route.params.item.isLive);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);

  useEffect(()=> {
    const unsubscribe = navigation.addListener('focus', ()=> {
      getOldMessage();
    });

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
        onTypingStarted(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        onTypingStarted(false);
      }
    );
    getUserStatus();
    getTyping();

    return ()=> {
      unsubscribe;
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    }
  },[]);

  function getOldMessage() {
    try {
      database()
        .ref('messages')
        .child(CONSTANTS.USER._id)
        .child(user._id)
        .child('messages')
        .on("value", (dataSnapshot) => {
            let message = [];
            console.log('Get Old Message: ', JSON.stringify(dataSnapshot));
            dataSnapshot.forEach((data) => {
              let obj = {
                _id: uuid.v4(),
                text: data.val().messege.text,
                //image: data.val().messege.image,
                //video: data.val().messege.video,
                user: {
                  _id: CONSTANTS.USER._id == data.val().messege.sender ? CONSTANTS.USER._id : user._id,
                  name: CONSTANTS.USER._id == data.val().messege.sender ? CONSTANTS.USER.user_name : user.user_name,
                  avatar: CONSTANTS.USER._id == data.val().messege.sender ? CONSTANTS.USER.profile_image : user.profile_image,
                },
                createdAt: data.val().messege.createdAt
              }
              if (data.val().messege.image !== '') {
                obj.image = data.val().messege.image
              }else if (data.val().messege.video !== '') {
                obj.video = data.val().messege.video
              }
              message.push(obj);
            });
            setMessages(message.reverse());
            setLoading(false);
          })
    } catch (e) {
      console.log('Get Token Error: ', e);
    }
  }

  function getUserStatus() {
    try {
      database()
        .ref('messages')
        .child(user._id)
        .on('value', (data)=> {
          if (data.val()) {
            setIsOnline(data.val().active);
          }
        });
    } catch (e) {
      console.log('Get User Status Error: ', e);
    }
  }

  function onTypingStarted(isTyping) {
    try {
      database()
        .ref('messages')
        .child(CONSTANTS.USER._id)
        .child(user._id)
        .update({
          isTyping: isTyping,
        })
        .then(()=> console.log('typing update'));
    } catch (e) {
      console.log('onTypingStarted Error: ', e);
    }
  }

  function getTyping() {
    database()
      .ref('messages')
      .child(user._id)
      .child(CONSTANTS.USER._id)
      .on('value', (dataSnapshot)=> {
        console.log('Get Typing : ', JSON.stringify(dataSnapshot));
        if (dataSnapshot.val()) {
          setTyping(dataSnapshot.val().isTyping);
        }
      });
  }

  const onSend = useCallback(async(messages = []) => {
      //onTypingStarted(false);
      SendMessage(CONSTANTS.USER._id, user._id, messages[0].text, "").
        then((res) => {
            console.log("Send Message", res);
            //this.setState({ message: '' })
        }).catch((err) => {
            console.log('Send Message Error: ', err);
        })

      RecieveMessage(CONSTANTS.USER._id, user._id, messages[0].text, "").
        then((res) => {
            console.log("Recieve Message", res);
            //this.setState({ message: '' })
        }).catch((err) => {
            console.log('Recieve Message Error: ', err);
        })
  }, []);

  function backTapped() {
    onTypingStarted(false)
    navigation.goBack();
  }

  function openFilePicker() {
    try {
      ImagePicker.openPicker({
        multiple: false,
        compressVideoPreset: "HighestQuality",
      }).then(images => {
        console.log('ImagePicker : ', images);
          fileuplaodcall(images)
        });
    } catch (e) {
      console.log('ImagePicker Error: ', e);
    }
  }

  const uploadProgress = progressEvent => {
    const percentFraction = progressEvent.loaded / progressEvent.total;
    const percent = Math.floor(percentFraction * 100);
    //setProgress(percent);
    console.log('Upload Progress : ', percent);
  }

  function fileuplaodcall(image) {
    try {
      let params = {
        filepath : Platform.OS == 'android' ? image.path : image.sourceURL,
        filename :  image.filename,
        filetype : image.mime,
      }
      API.callChatUploadFile(CONSTANTS.BASE_URL + 'file/bucket', params, uploadProgress)
        .then((response)=> {
          console.log('FIle Upload Response: ', JSON.stringify(response));
          if (response.error == 0) {
            SendMessage(CONSTANTS.USER._id, user._id, "", response.result)
              .then((res) => {
                  console.log("Send Message", res);
                  //this.setState({ message: '' })
              }).catch((err) => {
                  console.log('Send Message Error: ', err);
              })

            RecieveMessage(CONSTANTS.USER._id, user._id, "", response.result)
              .then((res) => {
                  console.log("Recieve Message", res);
                  //this.setState({ message: '' })
              }).catch((err) => {
                  console.log('Recieve Message Error: ', err);
              })
          }
        });
    } catch (e) {
      console.log('File Uplaod Error: ',e);
    }
  }

  function onUserDetailsClick() {
    console.log('User Click');
    navigation.navigate("UserProfile", {userId : user._id});
  }

  const renderItem = ({item, index}) => {
    if (user.id == item.id){
      return(
        <View style={{flexDirection: 'row',  marginTop: 10,}}>
          <View style={{flex: 0.98, backgroundColor: '#FFFFFF', borderRadius: 10, padding: 10}}>
            <Text style={{fontSize: 14, fontFamily:'SourceSansPro-Regular', color: '#000000'}}>{item.message}</Text>
            <Text style={{alignSelf:'flex-end', fontSize: 10, fontFamily:'SourceSansPro-Regular', color: '#8E8E93'}}>{item.time}</Text>
          </View>
          <View style={{marginLeft: 8,}}>
            <Image source={{uri: 'https://cdn.pixabay.com/photo/2016/08/20/05/38/avatar-1606916_960_720.png'}} style={{width: 46, height: 46, borderRadius: 46/2}} />
            <View style={{position:'absolute', top: 46/1.3, right:1,  width:10, height: 10, borderRadius: 10/2, borderWidth: 1, borderColor:'#FFFFFF',backgroundColor:'#6DC334'}}>
            </View>
          </View>
        </View>
      )
    } else {
      console.log('Item : ',item);
      return(
        <View style={{flexDirection: 'row', marginTop: 10,}}>
          <View>
              <Image source={{uri: 'https://cdn.pixabay.com/photo/2017/11/06/13/45/cap-2923682_960_720.jpg'}} style={{width: 33, height: 33, borderRadius: 33/2}}/>
              <View style={{position:'absolute', top: 33/1.3, right:1,  width:10, height: 10, borderRadius: 10/2, borderWidth: 1, borderColor:'#FFFFFF',backgroundColor:'#6DC334'}}>
            </View>
          </View>
          <View style={{width: '89%', backgroundColor: isDark ? '#141414' : '#384149', borderRadius: 10, padding: 10, marginLeft: 8}}>
            <Text style={style.messageTextOther}>{item.message}</Text>
            <Text style={{alignSelf:'flex-end', fontSize: 10, fontFamily: 'SourceSansPro-Regular', color: '#8E8E93'}}>{item.time}</Text>
          </View>
        </View>
      )
    }
  }

  return (
    <View style={[style.container, {backgroundColor: colors.background}]}>

        <TouchableOpacity style={styles.close_button} onPress={()=> backTapped()}>
          <AntDesign name="close" color={colors.background} size={15} />
        </TouchableOpacity>

      <View style={{flex: 1, marginTop: notchPadding + 60}}>
        <View style={{marginLeft: margin, marginRight: margin, borderBottomWidth: 1, borderColor: isDark ? '#8E8E93' : '#F0F1F1', paddingBottom: 10}}>
          <Text style={{fontSize: 25, fontFamily: Platform.OS == 'ios' ? 'AcuminPro-Regular' : 'AcuminPro-Bold', fontWeight: '700', color: colors.textColor, marginTop: 10}}>Messages</Text>

          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
            {isOnline == 'active' && <View style={{width: 8, height: 8, borderRadius: 4, backgroundColor: '#6DC334', marginTop: 8}}/>}
            <View style={{flex: 1, marginLeft: 10, alignSelf:'center'}}>
                <Text style={{fontSize: 16, color: colors.textColor, fontFamily: Platform.OS == 'ios' ? 'SFProDisplay-Regular' : 'SFProDisplay-Medium', fontWeight: '500'}}>{user.user_name != '' ? user.user_name : user.email}</Text>
                <Text style={{fontSize: 10, color: '#B7BABD', fontFamily: 'SFProDisplay-Regular', marginTop: 4}}>{typing ? 'Typing......' :isOnline == 'active' ? 'Online' : 'Offline'}</Text>
            </View>
              <SimpleLineIcons name="options" size={15} color={"#B7BABD"} onPress={()=> onUserDetailsClick()}/>
          </View>
        </View>

        <View style={{flex: 1}}>
          {loading ?
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <DotsLoader color={colors.loading} size={15} />
            </View>
            :
            <GiftedChat
              messages={messages}
              onSend={messages => onSend(messages)}
              user={{
                _id: CONSTANTS.USER._id,
                name: CONSTANTS.USER.user_name,
                avatar: CONSTANTS.USER.profile_image
              }}
              placeholder="Type your message...."
              //isTyping
              showAvatarForEveryMessage
              showUserAvatar
              renderAvatarOnTop
              alwaysShowSend
              //inverted={messages.length != 0 ? true : false}
              textInputStyle={[style.newMessageInput, {color: colors.textColor, alignSelf: 'center', marginTop: 10, fontFamily: 'SFProDisplay-Regular'}]}
              timeTextStyle={{
                left: {color: isDark ? '#B7BABD' : '#B7BABD', fontFamily: 'SFProDisplay-Regular'},
                right: {color: isDark ? '#8E8E93' : '#FFFFFF', fontFamily: 'SFProDisplay-Regular'}}}
              textInputProps={{underlineColorAndroid: 'transparent'}}
              parsePatterns={(linkStyle) => [
                 { type: 'phone', style: linkStyle, onPress: (number) => console.log(`Pressed on Phone: ${number}`) },
                 { pattern: /#(\w+)/, style: linkStyle, onPress: (tag) => console.log(`Pressed on hashtag: ${tag}`) },
               ]}
              renderInputToolbar={props=>{
               return(
                 <InputToolbar
                   {...props}
                   containerStyle={{
                     backgroundColor: colors.background,
                     paddingTop: 6,
                   }}
                   primaryStyle={{ alignItems: 'center' }}
                 />
               )}}
              renderActions={props => {
               return(
                 <Actions
                   {...props}
                   containerStyle={{
                     width: 44,
                     height: 44,
                     alignItems: 'center',
                     justifyContent: 'center',
                     marginLeft: 4,
                     marginRight: 4,
                     marginBottom: 0,
                   }}
                   icon={() => (
                     <Entypo name="attachment" size={25} color={'#384149'} onPress={()=> openFilePicker()}/>
                   )}
                   // options={{
                   //   'Choose From Library': () => {
                   //     console.log('Choose From Library');
                   //   },
                   //   Cancel: () => {
                   //     console.log('Cancel');
                   //   },
                   // }}
                   // optionTintColor={colors.textColor}
                 />
               )
             }}
              renderComposer={props=>{
               return(
                 <Composer
                   {...props}
                   textInputStyle={{
                     color: colors.textColor,
                     paddingTop: 8.5,
                     paddingHorizontal: 12,
                     marginLeft: 0,
                   }}
                 />
               )
             }}
              renderSend={props => {
               return(
                 <Send
                   {...props}
                   disabled={!props.text}
                   containerStyle={{
                     width: 44,
                     height: 44,
                     alignItems: 'center',
                     justifyContent: 'center',
                     marginHorizontal: 4,
                   }}
                 >
                   <Image
                     style={{ width: 32, height: 32 }}
                     source={ic_send}
                   />
                 </Send>
               )
             }}
              renderBubble={props => {
               return(
                 <Bubble
                  {...props}
                  // renderTime={() => <Text>Time</Text>}
                  // renderTicks={() => <Text>Ticks</Text>}
                  containerStyle={{
                    left: {},
                    right: {},
                  }}
                  wrapperStyle={{
                    left: {backgroundColor: isDark ? '#141414' : '#FFFFF3'},
                    right: {backgroundColor: isDark ? '#FFFFFF' : '#384149'},
                  }}
                  bottomContainerStyle={{
                    left: { justifyContent: 'flex-end' },
                    right: {justifyContent: 'flex-end'},
                  }}
                  tickStyle={{color: 'red'}}
                  containerToNextStyle={{
                    left: {},
                    right: {},
                  }}
                  containerToPreviousStyle={{
                    left: {},
                    right: {},
                  }}
                />
               )
             }}
              renderChatEmpty={() => {
                return(
                  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', transform: [{ scaleY: -1 }]}}>
                    <MaterialIcons name="chat" size={50} color={isDark ? '#E7B720' : '#FBBB00'}/>
                    <Text style={{color: colors.textColor, fontFamily: 'SFProDisplay-Regular', fontSize: 18, marginTop: 20}}>No Message</Text>
                  </View>
                )
              }}
              renderMessageText={props => {
               return(
                 <MessageText
                    {...props}
                    textStyle={{
                      left: { color: isDark ? '#8E8E93' : '#B7BABD', fontFamily: 'SFProDisplay-Regular'},
                      right: { color: isDark ? '#000000' : '#FFFFFF', fontFamily: 'SFProDisplay-Regular'},
                    }}
                    linkStyle={{
                      left: { color: 'blue' },
                      right: { color: 'blue' },
                    }}
                    customTextStyle={{ fontSize: 14, lineHeight: 24 }}
                  />
               )
             }}
              renderMessageVideo={props => {
                const { currentMessage } = props;
                return(
                    <View style={{width: height*0.25,  borderRadius: 13, margin: 3}}>
                      <VideoView
                        videoUrl={currentMessage.video}
                       />
                    </View>
                )}}
              renderMessageImage={props => {
                return(
                  <MessageImage {...props}>
                    <DynamicImage
                      url={props.currentMessage.image}
                      style={props.imageStyle} />
                  </MessageImage>
                )
              }}
            />
          }
        </View>
      </View>

    </View>
);

}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor:'#000000'
  },
  messagesContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: margin,
    marginRight: margin,
    marginBottom: 6
  },
  messageBubbleSelf: {
    padding: 10,
    flexDirection:'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginTop:10,
  },
  messageTextSelf: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'SourceSansPro-Regular',
    color: '#000000'
  },
  messageBubbleOther: {
    padding: 10,
    marginTop:10,
    backgroundColor: '#141414',
    borderRadius: 10,
  },
  messageTextOther: {
    fontSize: 14,
    color: '#8E8E93'
  },
  newMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: notchPadding + 10,
  },
  newMessageInput: {
    flex: 1,
    height: 40,
    fontSize: 11,
    marginLeft: 10,
    marginRight: 10,
    alignSelf: 'center',
  },
  newMessageButton: {
    alignItems: 'center',
    marginRight: 20
  }
});
