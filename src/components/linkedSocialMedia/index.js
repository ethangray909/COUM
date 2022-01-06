'use strict';

import React, { useCallback } from 'react'
import {
    Modal,
    View,
    TouchableOpacity,
    Text,
    Platform,
    Image,
    FlatList,
    Alert,
    Linking
} from 'react-native'
import PropTypes from 'prop-types';
import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

function LinkedSocialMediaContainer(props) {
  const{ spotify_apple, youtube, facebook, instagram, twitter, soundcloud} = props;
  const{colors, isDark} = useTheme();

  function onItemClick(mediaType){
    if (mediaType == 'spotify_apple' && spotify_apple != '') {
      openUrl(spotify_apple);
    }else if (mediaType == 'youtube' && youtube != '') {
      openUrl(youtube);
    }else if (mediaType == 'facebook' && facebook != '') {
      openUrl(facebook);
    }else if (mediaType == 'instagram' && instagram != '') {
      openUrl(instagram);
    }else if (mediaType == 'twitter' && twitter != '') {
      openUrl(twitter);
    }else if (mediaType == 'soundcloud' && soundcloud != '') {
      openUrl(soundcloud);
    }
  }

  const openUrl = useCallback(async (url)=> {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  },[]);

  return(
    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 15, marginTop: 15}}>
      <TouchableOpacity style={props.itemStyle} onPress={()=> onItemClick('spotify_apple')}>
        <FontAwesome5 name="spotify" size={20} color={spotify_apple ? '#1ED760' : '#B7BABD'} brand style={{opacity: spotify_apple ? 1 : 0.4}}/>
      </TouchableOpacity>

      <TouchableOpacity style={props.itemStyle} onPress={()=> onItemClick('youtube')}>
        <FontAwesome name="youtube-square" size={20} color={youtube ? '#F11717' : '#B7BABD'} style={{opacity: youtube ? 1 : 0.4}}/>
      </TouchableOpacity>

      <TouchableOpacity style={props.itemStyle} onPress={()=> onItemClick('facebook')}>
        <FontAwesome5 name="facebook-f" size={20} color={facebook ? '#4A81C6' : '#B7BABD'} brand style={{opacity: facebook ? 1 : 0.4}}/>
      </TouchableOpacity>

      <TouchableOpacity style={props.itemStyle} onPress={()=> onItemClick('instagram')}>
        <FontAwesome5 name="instagram" size={20} color={instagram ? '#bc2a8d' : '#B7BABD'} brand style={{opacity: instagram ? 1 : 0.4}}/>
      </TouchableOpacity>

      <TouchableOpacity style={props.itemStyle} onPress={()=> onItemClick('twitter')}>
        <FontAwesome5 name="twitter" size={20} color={twitter ? '#76A9EA' : '#B7BABD'} brand style={{opacity: twitter ? 1 : 0.4}}/>
      </TouchableOpacity>

      <TouchableOpacity style={props.itemStyle} onPress={()=> onItemClick('soundcloud')}>
        <FontAwesome5 name="soundcloud" size={19} color={soundcloud ? '#76A9EA' : '#B7BABD'} brand style={{opacity: soundcloud ? 1 : 0.4}}/>
      </TouchableOpacity>

    </View>
  )
}

LinkedSocialMediaContainer.propTypes = {
  spotify_apple: PropTypes.string,
  youtube:  PropTypes.string,
  facebook: PropTypes.string,
  instagram:  PropTypes.string,
  twitter: PropTypes.string,
  soundcloud: PropTypes.string,
};

LinkedSocialMediaContainer.defaultProps = {
  spotify_apple: '',
  youtube:  '',
  facebook: '',
  instagram: '',
  twitter: '',
  soundcloud: '',
};

export default LinkedSocialMediaContainer;
