'use strict';

import React, { Component } from 'react'
import {
    Modal,
    View,
    TouchableOpacity,
    Text,
    Platform,
    Image,
    FlatList,
} from 'react-native'
import PropTypes from 'prop-types';
import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DynamicImage from '../dynamicImage';

function ConnectionContainer(props) {
  const{ onItemClick } = props;
  const{colors, isDark} = useTheme();

  function isValidFunction(func) {
    return func && typeof func === 'function';
  }

  function onConnectionClick(item){
    isValidFunction(onItemClick) && onItemClick(item);
  }

  return(
    <View>
      <FlatList
         showsHorizontalScrollIndicator={false}
         horizontal
         style={{marginTop: 15, paddingLeft: 15}}
         data={props.data}
         renderItem={({index, item}) =>
           <TouchableOpacity style={props.itemStyle} onPress={()=> onConnectionClick(item)}>
             {item.profile_image != '' ?
              <DynamicImage url={item.profile_image} style={[props.imageStyle, {borderColor: item.status != 'unseen' ? '#FBBB00' : '#B7BABD'}]}/>
              :
              <FontAwesome name="user-circle-o" color={colors.textColor} size={30} />
             }
           </TouchableOpacity>
         }
         keyExtractor={(item, index) => index.toString()} />
    </View>
  )
}

ConnectionContainer.propTypes = {
  data: PropTypes.array,
};

ConnectionContainer.defaultProps = {
  data: [],
};

export default ConnectionContainer;
