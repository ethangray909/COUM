'use strict';

import React, { useEffect, useState} from 'react';
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import Video from 'react-native-video';
let {height, width} = Dimensions.get('window');

export default function VideoView(props) {
  const[isFullScreen, setFullScreen] = useState(false);
  const[isPause, setPause] = useState(true);

  function videoClick() {
    setFullScreen(true);
    setPause(false);
  }

  function onDismissVideoClick() {
    setFullScreen(false);
    setPause(true);
  }

  return(
    <TouchableOpacity onPress={()=> videoClick()}>
      <Video
        source={{uri : props.videoUrl}}
        rate={1.0}
        paused={isPause}
        muted={false}
        fullscreen={isFullScreen}
        onFullscreenPlayerDidDismiss={()=> onDismissVideoClick()}
        resizeMode="cover"
        style={{width: '100%' , height: '100%', borderRadius: 8}}
      />
    </TouchableOpacity>
  )
}
