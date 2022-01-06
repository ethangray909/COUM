'use strict';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Text,
  View,
  TextInput,
  Platform,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
  StyleSheet,
  Keyboard,
  Animated,
  ScrollView,
  FlatList,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Header from '../global/header';
import { DotsLoader } from 'react-native-indicator';
import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

import styles from '../styles/Styles';
const API = require('../network/api.js')
const CONSTANTS = require('../global/constants.js')
const FUNCTIONS = require('../global/functions.js')
import useGlobalStyles from '../styles/Styles';

let { height, width } = Dimensions.get('window');
let notchPadding = DeviceInfo.hasNotch() ? 21 : 0;

export default function WebBrowser() {
  const route = useRoute();
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const styles = useGlobalStyles();
  const [url, setUrl] = useState(route.params.url);
  const [title, setTitle] = useState(route.params.title);

  useEffect(() => {
    console.log('WebView Props: ', route.params);
  }, []);

  return (
    <View style={styles.container}>
      <Header
        title={title}
        isBackButton={true}
        isIcon={false}
        isInbox={false} />
      <View style={{ flex: 1 }}>
        <WebView source={{ uri: url }} />
      </View>
    </View>
  )
}
