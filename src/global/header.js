import React,{ useCallback } from 'react';
import {
    Text,
    View,
    TextInput,
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
} from 'react-native';
import PropTypes from 'prop-types';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useTheme, useRoute,useNavigation  } from '@react-navigation/native';
import logo from '../images/logo.png';
import light_logo from '../images/light_logo.png';
import img_search from '../images/img_search.png';
import img_back from '../images/img_back.png';
import img_back_dark from '../images/img_back_dark.png';
import inbox from '../images/inbox.png';

import CONSTANT from './constants';
let {screenHeight, screenWidth} = Dimensions.get('window');
let notchPadding = DeviceInfo.hasNotch() ? 44 : 15;
let margin = 20;

export default function Header(props){
  //console.log('Header: ', JSON.stringify(props));
  const { onSearchClick, onAddItemClick, onBackPressed } = props || {};
  const{ colors, isDark} = useTheme();
  const navigation = useNavigation();

  const backPressed = () => {
    if (props.title == "Services" || props.title == "Audio Rooms") {
      onBackPressed();
    }else {
      navigation.goBack();
    }
  }

  const inboxPressed= () => {
    console.log('inboxPressed');
    navigation.navigate('Inbox');
  }

  const searchClick = () => {
    //console.log('Header File onSearchClick');
    isValidFunction(onSearchClick) && onSearchClick();
  }

  const addItemPressed = () => {
    isValidFunction(onAddItemClick) && onAddItemClick();
  }

  function isValidFunction(func) {
    return func && typeof func === 'function';
  }

  return (
        <View style={{
          height: props.isSearch ? 86 + notchPadding : 50 + notchPadding,
          flexDirection: 'row',
          backgroundColor: colors.headerBackgroud,
          borderBottomWidth: 0.37,
          borderColor: '#8E8E93'
        }}>
            <View style={{flexDirection: 'row', marginRight: margin, marginTop: notchPadding, width: '100%', backgroundColor: 'transparent', alignItems: 'center', justifyContent: !props.isBackButton && !props.isSearch ? 'center' : 'space-between'}}>

                <TouchableOpacity disabled={props.isBackButton ? false: true} style={{backgroundColor: 'transparent', alignItems: 'center', marginLeft: props.isBackButton ? margin : 0}}
                  onPress={() => backPressed()}>
                  {props.isBackButton &&
                    <Image source={isDark ? img_back : img_back_dark} style={{width: 13, height: 21, alignSelf: 'center'}}/>
                  }
                </TouchableOpacity>
                <View style={{flex: 1, backgroundColor: 'transparent', alignSelf: 'center', justifyContent: 'center', marginRight: props.isBackButton ? margin : 0}}>
                  {props.isIcon ?
                    <Image source={isDark ? logo : light_logo} style={{width:112, height:25, alignSelf: 'center'}}/>
                    :
                    <View style={{backgroundColor: 'transparent'}}>
                        <Text
                          adjustsFontSizeToFit={true}
                          allowFontScaling minimumFontScale={0.01}
                          numberOfLines={1}
                          style={[style.headertext, {color: isDark ? '#FFFFFF' : '#384149', alignSelf: 'center'}]}>
                            {props.title}
                        </Text>
                        {props.isSearch &&
                          <TouchableOpacity onPress={()=> searchClick()} style={{height: 36, marginLeft: 15, marginRight: 15, borderRadius: 4, backgroundColor: isDark ? '#18181A' : '#F2F2F4', flexDirection: 'row', marginTop: 6, alignItems: 'center', paddingLeft: 8}}>
                            <FontAwesome name="search" color="#FBBB00" size={15} style={{alignSelf: 'center'}} />
                            <Text style={{ marginLeft: 8, color: isDark ? '#FFFFFF' : '#8E8E93', fontFamily: 'SFProDisplay-Regular', fontSize: 14,}}>Search Audio Rooms</Text>
                          </TouchableOpacity>
                        }
                    </View>
                  }
                </View>
                {props.isInbox &&
                  <TouchableOpacity onPress={() => inboxPressed()} style={{alignItems: 'flex-end', marginRight: margin, backgroundColor: 'transparent', position: 'absolute', right: 0}}>
                     <Image source={inbox}
                        resizeMode="contain"
                        style={{width: 20, height: 20, alignSelf: 'center'}}
                       />
                       {props.chatCount != 0 &&
                         <View style={{position: 'absolute', right: -8, top: -8, backgroundColor: isDark ? '#FFFFFF' : '#000000', width: 19, height: 18, borderRadius: 19/2, alignItems: 'center'}}>
                            <Text style={{fontSize: 12, fontFamily: 'SourceSansPro-Bold', fontWeight: 'bold', color: isDark ? '#000000': '#FFFFFF'}}>{props.chatCount}</Text>
                         </View>
                       }
                  </TouchableOpacity>
                }
                {props.isAddItem &&
                  <TouchableOpacity onPress={() => addItemPressed()} style={{alignItems: 'flex-end', marginRight: margin, backgroundColor: 'transparent', position: 'absolute', right: 0}}>
                     <FontAwesome name="plus" color={isDark ? "#FFFFFF": "#000000"} size={20} style={{alignSelf: 'center'}} />
                  </TouchableOpacity>
                }
            </View>
        </View>
      );
}

Header.propTypes = {
  title: PropTypes.string,
  isBackButton:PropTypes.bool,
  isIcon:PropTypes.bool,
  isInbox:PropTypes.bool,
  isSearch:PropTypes.bool,
  isAddItem: PropTypes.bool,
  searchIcon:PropTypes.string,
  chatCount: PropTypes.number,
  onSearch:PropTypes.func,
};

Header.defaultProps = {
  title: '',
  chatCount: 0,
  isBackButton:false,
  isIcon:false,
  isSearch:false,
  isInbox:false,
  isAddItem: false,
  onSearch: () => {},
};

const style = StyleSheet.create({
    leftContainer: {
      flex: 0.15,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      backgroundColor: 'red'
    },
    middleContainer: {
      flex: 0.7,
      //flexDirection: 'row',
      justifyContent: 'flex-end',
      //justifyContent: 'center',
      alignItems: 'center',
      //backgroundColor: 'green'
    },
    rightContainer: {
      flex: 0.15,
      flexDirection: 'row',
      justifyContent: 'flex-end',
    //  backgroundColor: 'blue'
    },
    headertext:{
      fontFamily:'AcuminPro-Regular',
      fontSize: 23,
      //color:'#FFFFFF'
    }
});
