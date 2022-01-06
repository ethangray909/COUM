'use strict';

import React, { useEffect, useState, useRef } from 'react'
import {
    Modal,
    View,
    TouchableOpacity,
    Text,
    Platform,
    FlatList,
} from 'react-native'
import PropTypes from 'prop-types';
import ImageSlider from 'react-native-image-slider';
import DynamicImage from '../dynamicImage';
import * as Progress from 'react-native-progress';
import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
import VideoPlayer from '../videoPlayer';

function MedaiPlayer(props) {
  const{ itemStyle, type, data, count, isFullScreen } = props;
  const{colors, isDark} = useTheme();

  return(
    <>
      <ImageSlider
        images={data}
        customSlide={({ index, item, style, width }) => (
          <View key={index} style={style}>
            {type == 'image' &&
              <DynamicImage
                //source={{ uri: item.work }}
                url={item.work}
                //indicator={Progress.Circle}
                //imageStyle={itemStyle}
                // indicatorProps={{
                //   color: colors.textColor,
                // }}
                resizeMode={isFullScreen ? 'contain' : 'cover'}
                style={itemStyle}/>
            }
            {type == 'video' &&
              <VideoPlayer
                source={{uri: item.work}}
                resizeMode={isFullScreen ? 'contain' : 'cover'}
                audioOnly={false}
                controls={false}
                videoStyle={itemStyle}/>
            }
            {type == 'audio' &&
              <VideoPlayer
                source={{uri: item.work}}
                resizeMode={isFullScreen ? 'contain' : 'cover'}
                audioOnly={true}
                controls={isFullScreen ? true : false}
                videoStyle={itemStyle}/>
            }
          </View>
        )}
        customButtons={(position, move) => (
          <View style={{position: 'absolute', right: 8, top: 8 + (isFullScreen ? 40 : 0)}}>
          {count != 1 &&
            <View style={{backgroundColor: colors.background, paddingLeft: 8, paddingRight: 10, paddingTop: 4, paddingBottom: 4, borderRadius: 20}}>
              <Text style={{color: colors.textColor, fontFamily: 'SFProDisplay-Regular'}}>
                {position+1}/{count}
              </Text>
            </View>
          }
          </View>
        )}/>
    </>
  );
}

MedaiPlayer.propTypes = {
  data: PropTypes.array,
  isFullScreen: PropTypes.bool,
}

MedaiPlayer.defaultProps = {
  data: [],
  isFullScreen: false,
}

export default MedaiPlayer;
