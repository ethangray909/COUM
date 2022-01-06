'use strict';

import React, {useRef, useEffect, useState} from 'react';
import {
    Text,
    View,
    TextInput,
    Platform,
    Modal,
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
    FlatList,
} from 'react-native';

import { useTheme } from '@react-navigation/native';

export default function PlanDetails(props) {
  const{colors, isDark} = useTheme();
  const[name, setName] = useState('');
  const[price, setPrice] = useState('');
  const[details, setDetails] = useState('');
  const style= StyleSheet.create({
    forminput: {
        color: colors.textColor,
        borderBottomWidth: 0.5,
        borderColor: colors.textColor,
        fontFamily: 'SourceSansPro-Regular',
        fontSize: 14,
        padding: 0,
        marginTop: 4
    },
    itemView: {
      marginTop: 18,
    },
    titleText: {
      fontSize: 14,
      color: colors.textColor
    }
  });

  useEffect(()=> {
    console.log("props: ", props);
    if (props.isEdit) {
      if (props.hasOwnProperty('value')) {
        setDetails(props.value.plan_detials);
        setName(props.value.plan_name);
        setPrice(props.value.plan_price);
      }
    }
  },[]);

  function changeText() {
    props.getValue({
      plan_name: name,
      plan_price: price,
      plan_detials: details
    },
    props.id
    );
  }

  return(
    <View style={{backgroundColor: isDark ? '#1C1C1C' : '#F8F8F3', marginTop: 10, paddingLeft: 8, paddingRight: 8, borderRadius: 4, paddingBottom: 8}}>
      <View style={[style.itemView, {marginTop: 4}]}>
        <Text style={style.titleText}>Name</Text>
        <TextInput
          underlineColorAndroid="transparent"
          style={style.forminput}
          value={name}
          autoFocus={false}
          returnKeyType = { 'next' }
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Ex. standard"
          autoCapitalize="words"
          onChangeText={text => {
            setName(text);
            changeText();
          }}
          placeholderTextColor={colors.text2Color}
          blurOnSubmit={false} />
      </View>
      <View style={style.itemView}>
        <Text style={style.titleText}>Price</Text>
        <TextInput
          underlineColorAndroid="transparent"
          style={style.forminput}
          value={price}
          autoFocus={false}
          returnKeyType = { 'next' }
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Ex. $300"
          keyboardType="numeric"
          onChangeText={(text) => {
            setPrice(text);
            changeText();
          }}
          placeholderTextColor={colors.text2Color}
          blurOnSubmit={false} />
      </View>
      <View style={style.itemView}>
        <Text style={style.titleText}>Details</Text>
        <TextInput
          underlineColorAndroid="transparent"
          style={style.forminput}
          value={details}
          autoFocus={false}
          returnKeyType = { 'next' }
          autoCapitalize="none"
          autoCorrect={false}
          multiline
          placeholder="Enter Plan Details"
          autoCapitalize="sentences"
          onChangeText={(text) => {
            setDetails(text);
            changeText();
          }}
          placeholderTextColor={colors.text2Color}
          blurOnSubmit={false} />
      </View>
    </View>
  )
}
