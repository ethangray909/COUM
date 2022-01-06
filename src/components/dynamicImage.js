import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Animated,
  StyleSheet
 } from 'react-native';
import FastImage from 'react-native-fast-image';

export default function DynamicImage(props) {
  
  return(
      <FastImage
        source={{
          uri : props.url,
          priority: FastImage.priority.high
        }}
        // onLoadStart={(e) => console.log('Loading Start')}
        // onProgress={(e) =>
        //   console.log(
        //     'Loading Progress ' +
        //       e.nativeEvent.loaded / e.nativeEvent.total,
        //   )
        // }
        // onLoad={(e) =>
        //   console.log(
        //     'Loading Loaded ' + e.nativeEvent.width,
        //     e.nativeEvent.height,
        //   )
        // }
        // onLoadEnd={(e) => console.log('Loading Ended')}
        {...props}
      />
  )
}

const style = StyleSheet.create({
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
})
