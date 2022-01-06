import React, {useState, useEffect, useRef, useImperativeHandle} from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Video from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import InViewPort from '@coffeebeanslabs/react-native-inviewport';

let {height, width} = Dimensions.get('window');

function VideoPlayer(props) {
  //console.log('VideoPlayer: ', props);
  const videoPlay = useRef(null);
  const[pause, setPause] = useState(true);
  const[ismuted, setMute] = useState(true);
  const screenIsFocused = useIsFocused();

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('blur', () => {
  //     setAudioStatus(false);
  //   });
  //
  //   return unsubscribe;
  // }, [navigation]);

  const pauseVideo = () => {
    if(videoPlay) {
      setPause(true);
    }
  }

  function onMutedVideo(){
    if(videoPlay) {
      console.log("onMutedVideo");
      if (ismuted) {
        setMute(false);
      }else {
        setMute(true);
      }
    }
  }

  const playVideo = () => {
    if(videoPlay) {
      setPause(false);
    }
  }

  useImperativeHandle(props.playerRef, () => ({
    pauseVideo: () => pauseVideo(),
  }));

  const handlePlaying = (isVisible) => {
    isVisible ? playVideo() : pauseVideo();
  }

  return(
    <View style={styles.container}>
       <InViewPort onChange={handlePlaying}>
         <TouchableOpacity
           style={{flex: 1}}
           onPress={()=> onMutedVideo()}
           activeOpacity={1}>
            <Video
              ref={videoPlay}
              source={props.source}
              rate={1.0}
              paused={pause || (!screenIsFocused)}
              muted={ismuted}
              repeat={true}
              //controls={props.audioOnly}
              audioOnly={props.audioOnly}
              resizeMode={props.resizeMode}
              style={props.videoStyle}/>
        </TouchableOpacity>
        {ismuted &&
          <View style={{ position: 'absolute', right: 8, bottom: 8, backgroundColor: 'black', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center'}}>
           <Ionicons name='volume-off-outline' size={18} color="#FFFFFF" style={{alignSelf: 'center', padding: 2}} />
          </View>
        }
      </InViewPort>
    </View>
  )
}

// export default class VideoPlayer extends React.Component {
//   constructor(props){
//     super(props);
//     //console.log('Video props: ', props);
//     this.state = {
//         pauseVideo: props.audiostatus,
//         ismuted: true,
//     };
//   }
//
//   pauseVideo = () => {
//     if(this.video) {
//       this.setState({
//         pauseVideo: true,
//       });
//     }
//   }
//
//   onMutedVideo(){
//     if(this.video) {
//       console.log("onMutedVideo");
//       if (this.state.ismuted) {
//         this.setState({
//           ismuted: false,
//         });
//       }else {
//         this.setState({
//           ismuted: true,
//         });
//       }
//     }
//   }
//
//   playVideo = () => {
//     if(this.video) {
//       this.setState({
//         pauseVideo: false,
//       });
//     }
//   }
//
//   handlePlaying = (isVisible) => {
//     isVisible ? this.playVideo() : this.pauseVideo();
//   }
//
//   render() {
//       return (
//         <View style={styles.container}>
//          <InViewPort onChange={this.handlePlaying}>
//            <TouchableOpacity
//              style={{flex: 1}}
//              onPress={()=> this.onMutedVideo()}
//              activeOpacity={1}>
//               <Video
//                 ref={ref => {this.video = ref}}
//                 source={this.props.source}
//                 rate={1.0}
//                 paused={this.state.pauseVideo}
//                 muted={this.state.ismuted}
//                 repeat={true}
//                 resizeMode={this.props.resizeMode}
//                 style={this.props.videoStyle}/>
//           </TouchableOpacity>
//           {this.state.ismuted &&
//             <View style={{ position: 'absolute', right: 8, bottom: 8, backgroundColor: 'black', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center'}}>
//              <Ionicons name='volume-off-outline' size={18} color="#FFFFFF" style={{alignSelf: 'center', padding: 2}} />
//             </View>
//           }
//         </InViewPort>
//       </View>
//     )
//   }
// }

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  backgroundVideo: {
    width: '100%',
    //height: height*0.32,
    height: '100%',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

export default VideoPlayer;
