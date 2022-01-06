'use strict';

import React, { useRef, useEffect, useState, useCallback } from 'react';
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
  AppState,
  Linking
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import ImageSlider from 'react-native-image-slider';
import Foundation from 'react-native-vector-icons/Foundation';
import {
  LineChart,
} from "react-native-chart-kit";
import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
import Header from '../global/header';
import Chart from '../components/Chart';

import useGlobalStyles from '../styles/Styles';
import line_chart from '../images/line_chart.png';
import menu from '../images/menu.png';
import vh from '../Units/vh';

let { height, width } = Dimensions.get('window');
const API = require('../network/api.js')
const CONSTANTS = require('../global/constants.js')
const FUNCTIONS = require('../global/functions.js')

let notchPadding = DeviceInfo.hasNotch() ? 21 : 0;
let margin = 15;

const slides = [
  {
    key: 1,
    title: 'Streaming',
    increase: 35,
    tintColor: '#FBBB00',
    tintColor1: '#314BFF',
    tabs: ["Spotify", "Apple Music", "Deezer", "SoundCloud"],
    data: {
      labels: ["1 Dec", "4 Dec", "7 Dec", "14 Dec", "21 Dec", "28 Dec", "29 Dec"],
      datasets: [
        {
          data: [
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
          ],
          color: (opacity = 1) => `#FBBB00`, // optional
          background: '#FBBB00',
          title: 'Following',
          //strokeWidth: 2 // optional
        },
        {
          data: [
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
          ],
          color: (opacity = 1) => `#314BFF`,
          background: '#314BFF',
          title: 'Streams',
        },
      ]
    }
  },
  {
    key: 2,
    title: 'Social Media ',
    increase: 29,
    tintColor: '#FBBB00',
    tintColor1: '#314BFF',
    tabs: ["Instagram", " Twitter", "Facebook"],
    data: {
      labels: ["7 Dec", "14 Dec", "21 Dec", "28 Dec", "29 Dec"],
      datasets: [
        {
          data: [
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
          ],
          color: (opacity = 1) => `#FBBB00`, // optional
          background: '#FBBB00',
          title: 'Following',
          //strokeWidth: 2 // optional
        },
        {
          data: [
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
          ],
          color: (opacity = 1) => `#314BFF`, // optional
          background: '#314BFF',
          title: 'Streams',
          //strokeWidth: 2 // optional
        },
      ]
    }
  },
  {
    key: 3,
    title: 'Social Media ',
    increase: 40,
    tabs: ["Instagram", " Twitter", "Facebook"],
    data: {
      labels: ["4 Dec", "7 Dec", "14 Dec", "21 Dec", "28 Dec", "29 Dec"],
      datasets: [
        {
          data: [
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
          ],
          color: (opacity = 1) => `#FB3000`, // optional
          background: '#FB3000',
          title: 'Following',
          //strokeWidth: 2 // optional
        },
      ]
    }
  },
  {
    key: 4,
    title: 'My Audience',
    increase: 30,
    tabs: ["Instagram", " Twitter", "Facebook"],
    data: {
      labels: ["7 Dec", "14 Dec", "21 Dec", "28 Dec", "29 Dec"],
      datasets: [
        {
          data: [
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
          ],
          color: (opacity = 1) => `#FB3000`, // optional
          background: '#FB3000',
          title: 'Following',
          //strokeWidth: 2 // optional
        }
      ]
    }
  }
];

export default function MyAnalytics() {
  const navigation = useNavigation();
  const styles = useGlobalStyles();
  const { colors, isDark } = useTheme();
  const route = useRoute();
  const [page, setPage] = useState(0);

  const style = StyleSheet.create({
    dot: {
      backgroundColor: isDark ? '#FFFFFF' : '#000000',
      marginLeft: 10,
      marginRight: 10,
      width: 14,
      height: 14,
      borderRadius: 14 / 2
    },
    activeDotStyle: {
      backgroundColor: '#605858',
      marginLeft: 10,
      marginRight: 10,
      width: 14,
      height: 14,
      borderRadius: 14 / 2
    },
  });

  const onItemClick = (item) => {
    console.log('Item Click : ', item);
  }

  const backTapped = () => {
    navigation.goBack();
  }

  const onPageChange = (index) => {
    setPage(index);
    console.log('Page Change : ', index);
  }

  // return (
  //   <View style={{ backgroundColor: 'red', flex: 1 }}>

  //   </View>
  // )

  return (
    <View style={styles.container}>
      <Header
        title={'My Analytics'}
        isBackButton={true}
        isIcon={false}
        isSearch={false}
      />

      <View style={{ flex: 1 }}>
        <ImageSlider
          images={slides}
          customSlide={({ index, item, style, width }) => (
            <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 20, paddingBottom: 20 + notchPadding, backgroundColor: colors.background }}>
              <View style={{ flex: 1 }}>
                <View style={{ borderWidth: 1, borderColor: '#707070', height: vh * 0.66, borderRadius: 15, marginTop: 10, marginLeft: 15, marginRight: 15 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                    <Text style={{ color: colors.textColor, fontFamily: 'AdobeClean-Bold', fontSize: 25, fontWeight: 'bold' }}>{item.title}</Text>
                    <TouchableOpacity style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
                      <Image source={menu} style={{ resizeMode: 'contain' }} />
                    </TouchableOpacity>
                  </View>

                  <View style={{ flexDirection: 'row', marginLeft: 4, marginTop: 8 }}>
                    <Text style={{ color: colors.textColor, fontSize: 13, marginRight: 8, borderRadius: 1, borderColor: '#FBBB00', borderBottomWidth: 2, paddingBottom: 4, paddingLeft: 4, paddingRight: 4 }}>Spotify</Text>
                    <Text style={{ color: colors.textColor, fontSize: 13, marginRight: 8, paddingBottom: 4, paddingLeft: 4, paddingRight: 4 }}>Apple Music</Text>
                    <Text style={{ color: colors.textColor, fontSize: 13, marginRight: 8, paddingBottom: 4, paddingLeft: 4, paddingRight: 4 }}>Deezer</Text>
                    <Text style={{ color: colors.textColor, fontSize: 13, marginRight: 8, paddingBottom: 4, paddingLeft: 4, paddingRight: 4 }}>SoundCloud</Text>
                  </View>

                  <Text style={{ color: colors.textColor, fontSize: 16, fontFamily: 'SourceSansPro-Regular', marginTop: 20, marginLeft: 10 }}>Increase of</Text>
                  <Text style={{ color: colors.textColor, fontSize: 66, fontFamily: 'SourceSansPro-Regular', marginLeft: 10 }}>{item.increase}%</Text>

                  <View>
                    <LineChart
                      key={Math.random()}
                      data={item.data}
                      width={width - 40} // from react-native
                      height={height * 0.3}
                      yAxisLabel=""
                      //yAxisLabel="$"
                      //yAxisSuffix="k"
                      withShadow={false}
                      withHorizontalLabels={false}
                      withInnerLines={false}
                      withOuterLines={false}
                      yAxisInterval={1} // optional, defaults to 1
                      chartConfig={{
                        backgroundColor: colors.background,
                        backgroundGradientFrom: colors.background,
                        backgroundGradientTo: colors.background,
                        decimalPlaces: 0, // optional, defaults to 2dp
                        color: (opacity = 1) => `#314BFF`,
                        labelColor: (opacity = 1) => colors.textColor,
                        propsForDots: {
                          r: "0",
                          strokeWidth: "0",
                          stroke: "#314BFF"
                        }
                      }}
                      bezier
                      onDataPointClick={(value, dataset, getColor) => console.log('Chat Click : ', value)}
                      style={{
                        borderRadius: 0
                      }}
                    />
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'center', position: 'absolute', bottom: 10 }}>
                    <Text style={{ flex: 0.8, color: colors.textColor, fontFamily: 'AcuminPro-Regular', fontWeight: 'bold', fontSize: 18 }}>{item.title}</Text>
                    <View>
                      {item.data.datasets.map((cell) => {
                        return (
                          <View style={{ flexDirection: 'row', marginTop: 4 }}>
                            <View style={{ height: 11, width: 30, borderRadius: 15, alignSelf: 'center', backgroundColor: cell.background, }} />
                            <Text style={{ color: colors.textColor, fontFamily: 'AcuminPro-Regular', fontSize: 10, marginLeft: 6 }}>{cell.title}</Text>
                          </View>
                        );
                      })
                      }

                    </View>
                  </View>
                </View>
              </View>
              <View style={{ flex: 0.12, backgroundColor: 'transparent', flexDirection: 'row', marginLeft: 15, marginRight: 15 }}>
                <TouchableOpacity style={{ width: (width - 40) / 2, backgroundColor: '#FBBB00', padding: 8, borderRadius: 6, justifyContent: 'center', marginRight: 5 }}>
                  <View style={{ flexDirection: 'row', marginLeft: 8, marginTop: 4 }}>
                    <Image source={line_chart} style={{ width: 30, height: 21, marginTop: 6 }} />
                    <Text style={{ color: '#FFFFFF', fontSize: 23, fontFamily: 'SourceSansPro-Regular', fontWeight: '600', alignSelf: 'center', marginLeft: 10 }}>2521</Text>
                  </View>
                  <View style={{ opacity: 0.60, marginLeft: 8 }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontFamily: 'SourceSansPro-Regular', fontWeight: '600', alignSelf: 'center', marginLeft: 8 }}>Streams in the last 30 days</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: (width - 40) / 2, backgroundColor: '#FBBB00', padding: 8, borderRadius: 6, justifyContent: 'center', marginLeft: 5 }}>
                  <View style={{ flexDirection: 'row', marginLeft: 8, marginTop: 4 }}>
                    <Foundation name="graph-bar" size={21} color='#FFFFFF' />
                    <Text style={{ color: '#FFFFFF', fontSize: 23, fontFamily: 'SourceSansPro-Regular', fontWeight: '600', alignSelf: 'center', marginLeft: 10 }}>70</Text>
                  </View>
                  <View style={{ opacity: 0.60, marginBottom: 4 }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontFamily: 'SourceSansPro-Regular', fontWeight: '600', alignSelf: 'center' }}>New Listeners in the last 30 days</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
          customButtons={(position, move) => (
            <View style={{ bottom: 105 + (notchPadding + DeviceInfo.hasNotch() ? 40 : 0), justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
              {slides.map((row, index) => {
                return (
                  <View style={index == position ? style.activeDotStyle : style.dot} />
                );
              })}
            </View>
          )} />
      </View>
    </View>
  );

}
