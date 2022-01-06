import React, { Component } from 'react';
import { View, Modal, TouchableOpacity, Image, Platform, Text } from 'react-native';
import { icons } from '../../assets/images';
import vh from '../../Units/vh';
import vw from '../../Units/vw';

// import TouchableHOC from '../TouchableHOC';
// import TextRegular from '../TextRegular';
import { BlurView } from '@react-native-community/blur';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import styles from './styles';

class ImagePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: this.props.value ? true : false,
      text: '',
      visible: false,
      imagesShown: false,
    };
  }

  show = data => {
    this.setState(p => {
      return {
        ...p,
        visible: true,
      };
    });
  };
  hide = () => {
    this.setState(p => {
      return {
        ...p,
        visible: false,
      };
    });
  };
  onCross = () => {
    this.hide();
  };

  requestPermission = permission => {
    request(permission)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            if (
              permission === PERMISSIONS.IOS.CAMERA ||
              permission === PERMISSIONS.ANDROID.CAMERA
            ) {
              this.handleOnSelectCamera();
            } else {
              this.handleOnSelectPhoto();
            }
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  checkPermission = permission => {
    check(permission)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            this.requestPermission(permission);
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            if (
              permission === PERMISSIONS.IOS.CAMERA ||
              permission === PERMISSIONS.ANDROID.CAMERA
            ) {
              this.handleOnSelectCamera();
            } else {
              this.handleOnSelectPhoto();
            }

            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleOnSelectCamera = () => {
    launchCamera(
      {
        includeBase64: false,
        quality: 0.1,
      },
      response => {
        // console.log('handleOnSelectCamera response', response);
        if (this.props.handleOnSelectImage && response?.assets) {
          this.props.handleOnSelectImage(response.assets);
        }
      },
    );
    this.hide();
  };

  handleOnSelectPhoto = () => {
    launchImageLibrary(
      {
        includeBase64: false,
        quality: 0.1,
      },
      response => {
        // console.log('handleOnSelectPhoto response', response);
        if (this.props.handleOnSelectImage && response?.assets) {
          this.props.handleOnSelectImage(response.assets);
        }
      },
    );
    this.hide();
  };

  render() {
    return (
      <Modal
        key={'cbdfdfczcxzt'}
        visible={this.state.visible}
        transparent={true}
        animationType="fade">
        <BlurView
          style={{ position: 'absolute', width: vw * 100, height: vh * 100 }}
          blurType="light"
          blurAmount={5}
          reducedTransparencyFallbackColor="white"
        />
        <TouchableOpacity
          style={styles.modalTouchable}
          onPress={() => {
            this.hide();
          }}></TouchableOpacity>
        <View style={styles.imageBg}>
          <TouchableOpacity style={styles.crossContainer} onPress={this.onCross}>
            <Image
              source={icons.cross}
              style={styles.cross}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={styles.container}>
            <Text style={styles.text}>{this.props.text}</Text>
          </View>
          <View
            style={{
              backgroundColor: 'rgba(52, 52, 52, 0.15)',
              height: vh * 0.1,
              width: 100 * vw,
              marginTop: 2 * vh,
              marginBottom: 2 * vh,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: 100 * vw,
              justifyContent: 'space-evenly',
            }}>
            <TouchableOpacity
              style={{ alignItems: 'center' }}
              onPress={() =>
                this.checkPermission(
                  Platform.OS === 'android'
                    ? PERMISSIONS.ANDROID.CAMERA
                    : PERMISSIONS.IOS.CAMERA,
                )
              }>
              <Image
                source={icons.camera}
                style={{
                  resizeMode: 'contain',
                  width: 10 * vw,
                  height: 10 * vh,
                  tintColor: 'black',
                }}
              />
              <Text style={styles.facebooktext}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ alignItems: 'center' }}
              onPress={() =>
                this.checkPermission(
                  Platform.OS === 'android'
                    ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
                    : PERMISSIONS.IOS.PHOTO_LIBRARY,
                )
              }>
              <Image
                source={icons.uplaodPic} //picture_folder
                style={{
                  resizeMode: 'contain',
                  width: 10 * vw,
                  height: 10 * vh,
                  marginTop: vh * 1,
                  tintColor: 'black',
                }}
              />
              <Text style={styles.facebooktext}>Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

export default ImagePicker;
