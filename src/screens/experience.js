'use strict';

import React, { useRef, useEffect, useState } from 'react';
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
  Linking,
  Animated,
  ScrollView,
  FlatList,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
const axios = require('axios');
var moment = require('moment');
import DateTimePickerModal from "react-native-modal-datetime-picker";
import SelectDropdown from 'react-native-select-dropdown'
import SpinnerButton from 'react-native-spinner-button';
import Snackbar from 'react-native-snackbar';
import { DotsLoader } from 'react-native-indicator';
import ImagePicker from 'react-native-image-crop-picker';

import PlanDetails from '../components/planDetails';
import DynamicImage from '../components/dynamicImage';
import Header from '../global/header';
const API = require('../network/api.js');
const CONSTANTS = require('../global/constants.js');
const FUNCTIONS = require('../global/functions.js');
import useGlobalStyles from '../styles/Styles';

let { height, width } = Dimensions.get('window');
let notchPadding = DeviceInfo.hasNotch() ? 21 : 0;
let margin = 15;

let servicePlanObject = {
  name: '',
  price: '',
  details: ''
};

export default function Experience() {
  const route = useRoute();
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const styles = useGlobalStyles();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isAddItem, setIsAddItem] = useState(false);
  const [_id, setId] = useState(null);
  const [title, setTitle] = useState('');
  const [headline, setHeadline] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [serviceOldImage, setServiceOldImage] = useState(null);
  const [serviceImage, setServiceImage] = useState(null);
  const [flag, setFlag] = useState("Experience");
  const [datePickerFlag, setDatePickerFlag] = useState(null);
  const [empTypeArray, setEmpTypeArray] = useState([]);
  const [servicePlan, setServicesPlan] = useState([]);
  const [empType, setEmpType] = useState(null);
  const [status, setStatus] = useState('active');
  const style = StyleSheet.create({
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
    },
    dropdownText: {
      textAlign: 'left',
      paddingLeft: 0,
      marginLeft: 0,
      color: colors.textColor,
      fontFamily: 'SourceSansPro-Regular',
      fontSize: 16
    },
    optionAddButton: {
      backgroundColor: colors.buttonBackground, height: 21, width: 40, borderRadius: 5, justifyContent: 'center', marginTop: 8
    },
    optionButtonText: {
      fontWeight: 'bold', fontSize: Platform.OS == 'android' ? 20 : 16, alignSelf: 'center', textAlign: 'center', alignSelf: 'center', paddingBottom: Platform.OS == 'android' ? 2 : 4
    },
    modalView: {
      flex: 1, backgroundColor: colors.background
    },
    modalTitleView: {
      flexDirection: 'row', justifyContent: 'space-between', marginTop: DeviceInfo.hasNotch() ? 50 : 15, marginLeft: 20, marginRight: 20
    },
    modalTitle: {
      flex: 1, fontFamily: 'AcuminPro-Regular', fontSize: 23, color: isDark ? '#FFFFFF' : '#384149', textAlign: 'center'
    }
  });

  useEffect(() => {
    console.log('Employment Type: ', JSON.stringify(CONSTANTS.COUM_DATA.employment_type));
    let empArray = [];
    for (var i = 0; i < CONSTANTS.COUM_DATA.employment_type.length; i++) {
      empArray.push(CONSTANTS.COUM_DATA.employment_type[i].name);
    }
    setLoading(false);
    setEmpTypeArray(empArray);
    setFlag(route.params.flag);
    getOldData();
  }, []);

  function onConnectStripe() {
    console.log('Stripe Click');
    try {
      API.callUserApi(CONSTANTS.BASE_URL + 'stripe/account', {}, this, 'GET')
        .then((response) => {
          console.log('Stripe Response: ', JSON.stringify(response));
          if (response.error == 0) {
            if (response.hasOwnProperty('accountLink')) {
              //navigation.navigate('WebBrowser', {url: response.accountLink.url});
              Linking.canOpenURL(response.accountLink.url).then(supported => {
                if (supported) {
                  Linking.openURL(response.accountLink.url);
                } else {
                  Snackbar.show({ text: `Don't know how to open URI: ` + response.accountLink.url, duration: Snackbar.LENGTH_SHORT });
                  console.log("Don't know how to open URI: " + response.accountLink.url);
                }
              });
            }
          }
        });
    } catch (e) {
      console.log('Connect Error: ', e);
    }
  }

  function getOldData() {
    try {
      console.log('flag: ', route.params.flag);
      API.callUserApi(CONSTANTS.BASE_URL + 'get/user', {}, this, 'GET')
        .then((response) => {
          setDataLoading(false);
          if (response.error == 0) {
            console.log('User Response: ', (response));//JSON.stringify
            if (route.params.flag == 'Experience') {
              if (response.user.hasOwnProperty('experience')) {
                console.log('Add Experience');
                setData(response.user.experience);
              }
            } else if (route.params.flag == 'Education') {
              if (response.user.hasOwnProperty('education')) {
                console.log('Add Education');
                setData(response.user.education);
              }
            } else if (route.params.flag == 'Skills') {
              if (response.user.hasOwnProperty('skills')) {
                console.log('Add Skills');
                setData(response.user.skills);
              }
            } else if (route.params.flag == 'Services') {
              setData(response.user.services);
              if (response.user.hasOwnProperty('stripe_data')) {
                if (response.user.stripe_data != null) {
                  if (response.user.stripe_data[0].account.capabilities.card_payments == 'inactive' && response.user.stripe_data[0].account.capabilities.transfers == 'inactive') {
                    stripeSnackbar();
                  }
                } else {
                  stripeSnackbar();
                }
              }
            }
          }
        });
    } catch (e) {
      console.log('GetData Error: ', e);
    }
  }

  function stripeSnackbar() {
    Snackbar.show({
      text: 'Unable to services.\nPlease setup your stripe account', duration: Snackbar.LENGTH_INDEFINITE, numberOfLines: 2, action: {
        text: 'Connect Stripe',
        textColor: '#FBBB00',
        onPress: () => onConnectStripe(),
      },
    });
  }

  function onDateConfirm(date) {
    console.log('Start Date Picker Click: ' + moment(date).format("MMM YYYY"));
    let getDate = moment(date).format("MMM YYYY");
    if (datePickerFlag == 'startDate') {
      setStartDate(getDate);
    } else if (datePickerFlag == 'endDate') {
      setEndDate(getDate);
    }
    setDatePickerFlag(null);
  }

  function addData() {
    let obj = {};
    if (_id != null) {
      obj._id = _id;
    }
    obj.start_date = startDate;
    obj.end_date = endDate;

    let data = {};
    if (flag == 'Experience') {
      obj.title = title;
      obj.employment_type = empType;
      obj.headline = headline;
      data.experience = JSON.stringify(obj);
    } else {
      obj.university = title;
      obj.qualification = headline;
      data.education = JSON.stringify(obj);
    }
    console.log('DATA: ', obj);

    if (checkValidation()) {
      console.log('Call API');
      try {
        setLoading(true);
        API.callUpdateUser(CONSTANTS.BASE_URL + 'user', data)
          .then((response) => {
            console.log('Add Experience Response: ', JSON.stringify(response));
            Snackbar.show({ text: response.message, duration: Snackbar.LENGTH_SHORT });
            if (response.error == 0) {
              resetData();
              if (flag == 'Experience') {
                if (response.result.hasOwnProperty('experience')) {
                  setData(response.result.experience);
                }
              } else if (flag == 'Education') {
                if (response.result.hasOwnProperty('education')) {
                  setData(response.result.education);
                }
              }
            }
            setLoading(false);
          });
      } catch (e) {
        console.log('addData Error: ', e);
      }
    }
  }

  function addSkills() {
    if (title != '') {
      let obj = {
        title: title
      };
      if (_id != null) {
        obj._id = _id;
      }
      let data = {
        skills: JSON.stringify(obj)
      }
      try {
        setLoading(true);
        API.callUpdateUser(CONSTANTS.BASE_URL + 'user', data)
          .then((response) => {
            console.log('Add Experience Response: ', (response));//JSON.stringify
            Snackbar.show({ text: response.message, duration: Snackbar.LENGTH_SHORT });
            if (response.error == 0) {
              resetData();
              if (flag == 'Skills') {
                if (response.result.hasOwnProperty('skills')) {
                  setData(response.result.skills);
                }
              }
            }
            setLoading(false);
          });
      } catch (e) {
        console.log('addData Error: ', e);
      }
    } else {
      Snackbar.show({ text: 'Please enter skills', duration: Snackbar.LENGTH_SHORT });
    }
  }

  function resetData() {
    setId(null);
    setTitle('');
    setHeadline('');
    setDatePickerFlag(null);
    setStartDate('');
    setEndDate('');
    setEmpType(null);
    setServiceImage(null);
    setServicesPlan([]);
    setIsAddItem(false);
    if (flag == 'Services') {
      addServicePlan(true);
      setServiceOldImage(null);
    }
  }

  function closeModal() {
    setIsAddItem(false);
    setLoading(false);
    resetData();
  }

  function addServices() {

    if (title != '') {
      if (headline != '') {
        let formdata = new FormData();
        let serviceData = {
          title: title,
          plans: servicePlan,
          service_desc: headline
        }
        if (_id != null) {
          serviceData._id = _id;
        }
        if (serviceOldImage != null) {
          serviceData.image = serviceOldImage;
        }

        try {
          setLoading(true);
          API.callAddServices(CONSTANTS.BASE_URL + 'user', serviceData, headline, serviceImage)
            .then((response) => {
              setLoading(false);
              console.log('Update Service: ', JSON.stringify(response));
              Snackbar.show({ text: response?.message, duration: Snackbar.LENGTH_SHORT });
              if (response?.error == 0) {
                resetData();
                getOldData();
              }
            })
        } catch (e) {
          console.log('Add Service Error: ', e);
        }
      } else {
        Snackbar.show({ text: 'Please enter description', duration: Snackbar.LENGTH_SHORT });
      }
    } else {
      Snackbar.show({ text: 'Please enter title', duration: Snackbar.LENGTH_SHORT });
    }
  }

  function onDeleteItemClick(item) {
    let params = {};
    if (flag == 'Services') {
      item.status = 'inactive'
      console.log('Service Item Edit----- ', JSON.stringify(item));
      params.service = JSON.stringify(item)
    }
    else if (flag == 'Education') {
      console.log('Education Item Delete----- ', JSON.stringify(item));
      item.delete = 'true'
      params.education = JSON.stringify(item)
    }
    else if (flag == 'Skills') {
      console.log('Skills Item Delete----- ', JSON.stringify(item));
      item.delete = 'true'
      params.skills = JSON.stringify(item)
    }
    else if (flag == 'Experience') {
      console.log('Experience Item Delete----- ', JSON.stringify(item));
      item.delete = 'true'
      params.experience = JSON.stringify(item)
    }

    try {
      setLoading(true);
      API.callUpdateUser(CONSTANTS.BASE_URL + 'user', params)
        .then((response) => {
          console.log('Delete serivces Response::: ', JSON.stringify(response));
          if (response.error == 0) {
            resetData();
            getOldData();
          }
        })
    } catch (e) {
      console.log('Search Error: ', e);
    }
  }

  function onEditItemClick(item) {
    console.log('Item Edit::: ', item);
    if (flag == 'Skills') {
      setId(item._id);
      setTitle(item.title);
    } else if (flag == 'Services') {
      setId(item._id);
      setTitle(item.title);
      setHeadline(item.service_desc);
      setServicesPlan(item.plans);
      setServiceOldImage(item.image);
    } else {
      setId(item._id);
      setTitle(item.title);
      setHeadline(item.headline);
      setStartDate(item.start_date);
      setEndDate(item.end_date);
      setEmpType(item.employment_type);
      if (flag == 'Education') {
        setTitle(item.university);
        setHeadline(item.qualification);
      }
    }
    setIsAddItem(true);
  }

  function addServicePlan(oneTime) {
    let updateArray = [];
    if (oneTime) {
      if (servicePlan.length < 1) {
        //updateArray.push(servicePlanObject);
        //servicePlan.push(servicePlanObject);
        setServicesPlan([...servicePlan, servicePlanObject]);
      }
      console.log('Added one Services');
    } else {
      console.log('Added Services');
      //updateArray.push(servicePlanObject);
      setServicesPlan([...servicePlan, servicePlanObject]);
    }
    //setServicesPlan([...servicePlan, updateArray]);
  }

  function updateTextPlan(object, idx) {
    //console.log('Value: ', object);
    let updateArray = servicePlan;
    updateArray[idx] = object;
    setServicesPlan(updateArray);
  }

  function onServiceIamgePicker() {
    try {
      ImagePicker.openPicker({
        cropping: false,
        mediaType: 'photo'
      }).then(image => {
        console.log(image);
        let obj = {};
        obj.filepath = Platform.OS == 'android' ? image.path : image.sourceURL;
        obj.filename = image.filename;
        obj.filetype = image.mime;
        obj.size = FUNCTIONS.bytesToSize(image.size);
        setServiceImage(obj);
      });
    } catch (e) {
      console.log('Cover Upload error: ', e);
    }
  }

  function checkValidation() {
    if (title != '') {
      if (headline != '') {
        if (startDate != '') {
          if (endDate != '') {
            return true;
          } else {
            Snackbar.show({ text: 'Please select end date', duration: Snackbar.LENGTH_SHORT });
          }
        } else {
          Snackbar.show({ text: 'Please select start date', duration: Snackbar.LENGTH_SHORT });
        }
      } else {
        Snackbar.show({ text: flag == 'Experience' ? 'Please enter headline' : 'Please enter Degree', duration: Snackbar.LENGTH_SHORT });
      }
      if (flag == 'Experience') {
        if (empType != null) {
          return true;
        } else {
          Snackbar.show({ text: 'Please select employment type', duration: Snackbar.LENGTH_SHORT });
        }
      }
    } else {
      Snackbar.show({ text: flag == 'Experience' ? 'Please enter title' : 'Please enter school', duration: Snackbar.LENGTH_SHORT });
    }
    return false;
  }

  const listEmptyComponent = () => {
    return (
      <View style={{ width: width, height: height / 1.35, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ borderRadius: 8, backgroundColor: isDark ? '#1C1C1C' : '#F8F8F3', justifyContent: 'center', padding: 8 }}>
          <MaterialCommunityIcons
            name={'file-document'}
            color={isDark ? '#E7B720' : '#FBBB00'}
            size={50}
            style={{ alignSelf: 'center' }} />
        </View>
        <Text style={{ color: colors.textColor, fontFamily: 'SFProDisplay-Regular', fontSize: 18, marginTop: 20 }}>No {flag} added</Text>
        <Text style={{ color: colors.textColor, fontFamily: 'SFProDisplay-Regular', fontSize: 14, marginTop: 10 }}>Your {flag} will appear here</Text>
      </View>
    )
  }

  const renderDataItem = ({ item, index }) => {
    return (
      <View style={{ backgroundColor: !isDark ? '#FFFFFF' : '#141414', borderRadius: 5, marginTop: 15, marginLeft: 15, marginRight: 15, shadowColor: '#000000', shadowRadius: 3.84, shadowOpacity: 0.25, shadowOffset: { width: 0, height: 2 }, elevation: 3 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10 }}>
          {flag == 'Skills' ?
            <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'flex-start' }}>
              <Text style={{ color: colors.textColor, fontFamily: 'SFProDisplay-Regular', fontSize: 16, fontWeight: 'bold' }}>{item.title}</Text>
            </View>
            : flag == 'Services' ?
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                <View style={{ alignSelf: 'flex-start', marginTop: 3 }}>

                  <DynamicImage url={item.image} style={{ width: 70, height: 70, borderRadius: 10 }} />
                </View>
                <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'flex-start', marginLeft: 15 }}>
                  <Text style={{ color: !isDark ? colors.textColor : '#FFFFFF', fontFamily: 'SFProDisplay-Regular', fontSize: 16, fontWeight: 'bold' }}>{item.title}</Text>
                  <Text numberOfLines={2} style={{ color: '#B7BABD', fontFamily: 'SourceSansPro-Regular', fontSize: 15, marginTop: 8 }}>{item.service_desc}</Text>
                </View>
              </View>
              :
              <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'flex-start' }}>
                <Text style={{ color: !isDark ? colors.textColor : '#FFFFFF', fontFamily: 'SFProDisplay-Regular', fontSize: 16, fontWeight: 'bold' }}>{flag == 'Experience' ? item.title : item.university}</Text>
                <Text numberOfLines={2} style={{ color: '#B7BABD', fontFamily: 'SourceSansPro-Regular', fontSize: 15, marginTop: 8 }}>{flag == 'Experience' ? item.headline : item.qualification}</Text>
                <Text style={{ color: '#B7BABD', fontFamily: 'SourceSansPro-Regular', fontSize: 10, marginTop: 8 }}>{flag == 'Experience' && item.employment_type + ' | '}{item.start_date} - {item.end_date}</Text>
              </View>
          }

          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <MaterialIcons name="edit" color={colors.textColor} size={18} onPress={() => onEditItemClick(item)} />
              <MaterialIcons name="delete" color={colors.textColor} size={18} onPress={() => onDeleteItemClick(item)} />
            </View>
          </View>
        </View>
      </View>)
  }

  return (
    <View style={styles.container}>
      {(flag == 'Services' && isAddItem) ?
        <View style={style.modalView}>
          <View style={style.modalTitleView}>
            <Text style={style.modalTitle}>{_id != null ? 'Edit' : 'Add'} {flag}</Text>
            <FontAwesome name="close" color={colors.textColor} size={20} onPress={() => closeModal()} />
          </View>
          <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
            <View style={{ marginLeft: 20, marginRight: 20, marginBottom: 25 }}>
              <View style={style.itemView}>
                <Text style={style.titleText}>Title</Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={style.forminput}
                  value={title}
                  autoFocus={false}
                  returnKeyType={'next'}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoCapitalize="words"
                  placeholder="Ex. Recording Sessions"
                  onChangeText={(text) => { setTitle(text) }}
                  placeholderTextColor={colors.text2Color}
                  blurOnSubmit={false} />
              </View>

              <View style={style.itemView}>
                <Text style={style.titleText}>Description</Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={style.forminput}
                  value={headline}
                  autoFocus={false}
                  returnKeyType={'next'}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoCapitalize="sentences"
                  multiline
                  placeholder="Enter services details"
                  onChangeText={(text) => { setHeadline(text) }}
                  placeholderTextColor={colors.text2Color}
                  blurOnSubmit={false} />
              </View>

              <TouchableOpacity onPress={() => onServiceIamgePicker()} style={{ flexDirection: 'row', marginTop: 10 }}>
                {serviceImage != null ?
                  <Image source={{ uri: serviceImage.filepath }} style={{ width: 50, height: 50 }} />
                  : serviceOldImage != null ?
                    <DynamicImage url={serviceOldImage} style={{ width: 50, height: 50 }} />
                    :
                    <View style={{ borderRadius: 8, backgroundColor: isDark ? '#1C1C1C' : '#F8F8F3', width: 58, height: 57, justifyContent: 'center' }}>
                      <MaterialCommunityIcons name="image" color={isDark ? '#FFFFFF' : '#B7BABD'} size={20} style={{ alignSelf: 'center' }} />
                    </View>
                }
                <Text style={{ color: colors.textColor, fontFamily: 'SourceSansPro-Regular', fontSize: 14, alignSelf: 'center', marginLeft: 10 }}>Select Cover Image</Text>
              </TouchableOpacity>

              <Text style={{ color: colors.textColor, fontFamily: 'SourceSansPro-Regular', fontSize: 14, marginTop: 20 }}>Plan Details</Text>

              {servicePlan.map((row, index) => {
                return (
                  <PlanDetails id={index} isEdit={_id != null ? true : false} value={servicePlan[index]} getValue={(value, idx) => updateTextPlan(value, idx)} />
                )
              })
              }

              <TouchableOpacity onPress={() => { addServicePlan(false) }} style={style.optionAddButton}>
                <Text style={style.optionButtonText}>{'+'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitButton, { marginTop: 20 }]}
                isLoading={loading}
                onPress={() => addServices()}
                indicatorCount={10}>
                {_id != null ? <Text style={styles.buttonText}>{'Update'}</Text> :
                  <Text style={styles.buttonText}>{_id != null ? 'Edit' : 'Add'} {flag}</Text>}
              </TouchableOpacity>

            </View>
          </ScrollView>
        </View>
        :
        <View style={{ flex: 1 }}>
          <Header
            isBackButton={true}
            onBackPressed={() => {
              Snackbar.dismiss();
              navigation.goBack();
            }}
            isInbox={false}
            isAddItem
            title={flag}
            onAddItemClick={() => {
              setIsAddItem(true);
              if (flag == 'Services') {
                addServicePlan(true);
              }
            }}
            isIcon={false} />

          <View style={{ flex: 1 }}>
            {!dataLoading &&
              <FlatList
                showsVerticalScrollIndicator={false}
                data={data}
                renderItem={renderDataItem}
                ListEmptyComponent={listEmptyComponent}
                onRefresh={() => getOldData()}
                refreshing={false}
                keyExtractor={(item, index) => index.toString()}
              />
            }
            {dataLoading &&
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <DotsLoader color={colors.loading} size={15} />
              </View>
            }
          </View>
        </View>
      }

      <Modal
        animationType="slide"
        visible={flag == 'Services' ? false : isAddItem}
        onRequestClose={() => closeModal()}>

        <View style={style.modalView}>
          <View style={style.modalTitleView}>
            <Text style={style.modalTitle}>{_id != null ? 'Edit' : 'Add'} {flag}</Text>
            <FontAwesome name="close" color={colors.textColor} size={20} onPress={() => closeModal()} />
          </View>
          {flag != 'Skills' ?
            <View style={{ marginLeft: 20, marginRight: 20 }}>
              <View style={style.itemView}>
                <Text style={style.titleText}>{flag == 'Experience' ? 'Title' : 'School'}</Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={style.forminput}
                  value={title}
                  autoFocus={false}
                  returnKeyType={'next'}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoCapitalize="words"
                  placeholder={flag == 'Experience' ? "Ex. Camp Universal Records" : "Ex: Boston University"}
                  onChangeText={(text) => { setTitle(text) }}
                  placeholderTextColor={colors.text2Color}
                  blurOnSubmit={false} />
              </View>

              {flag == 'Experience' &&
                <View style={style.itemView}>
                  <Text style={style.titleText}>Employment Type</Text>
                  <SelectDropdown
                    data={empTypeArray}
                    defaultButtonText="Please select"
                    style={{ backgroundColor: !isDark ? '#FFFFFF' : '#141414', padding: 0, borderRadius: 4, marginTop: 6, height: 40, width: '100%' }}
                    buttonTextStyle={style.dropdownText}
                    defaultValue={empType}
                    rowTextStyle={[style.dropdownText, { paddingLeft: 8 }]}
                    dropdownStyle={{ backgroundColor: !isDark ? '#FFFFFF' : '#141414' }}
                    dropdownIconPosition="right"
                    renderDropdownIcon={() => {
                      return (
                        <FontAwesome name="chevron-down" color={colors.textColor} size={12} />
                      );
                    }}
                    onSelect={(selectedItem, index) => {
                      setEmpType(selectedItem);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem;
                    }}
                    rowTextForSelection={(item, index) => {
                      return item;
                    }}
                  />
                </View>
              }

              <View style={style.itemView}>
                <Text style={style.titleText}>{flag == 'Experience' ? 'Headline' : 'Degree'}</Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={style.forminput}
                  value={headline}
                  autoFocus={false}
                  returnKeyType={'done'}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoCapitalize="sentences"
                  placeholder={flag == 'Experience' ? "Enter Headline" : "Ex: Bachelor's"}
                  onChangeText={(text) => { setHeadline(text) }}
                  placeholderTextColor={colors.text2Color}
                  blurOnSubmit={false} />
              </View>

              <View style={style.itemView}>
                <Text style={style.titleText}>Start Date</Text>
                <TouchableOpacity onPress={() => {
                  console.log('Picker CLick');
                  setDatePickerFlag('startDate')
                }}>
                  <TextInput
                    underlineColorAndroid="transparent"
                    style={style.forminput}
                    value={startDate}
                    editable={false}
                    pointerEvents="none"
                    placeholderTextColor={colors.text2Color}
                    placeholder="Pick Start date"
                  />
                </TouchableOpacity>
              </View>

              <View style={style.itemView}>
                <Text style={style.titleText}>End Date</Text>
                <TouchableOpacity onPress={() => {
                  console.log('Picker CLick');
                  setDatePickerFlag('endDate')
                }}>
                  <TextInput
                    underlineColorAndroid="transparent"
                    style={style.forminput}
                    value={endDate}
                    editable={false}
                    pointerEvents="none"
                    placeholderTextColor={colors.text2Color}
                    placeholder="Pick End date" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.submitButton, { marginTop: 20 }]}
                isLoading={loading}
                onPress={() => addData()}
                indicatorCount={10}>

                {_id != null ? <Text style={styles.buttonText}>{'Update'}</Text> :
                  <Text style={styles.buttonText}>{'Add'} {flag}</Text>}

              </TouchableOpacity>

              <DateTimePickerModal
                isVisible={datePickerFlag == null ? false : true}
                mode="date"
                onConfirm={onDateConfirm}
                onCancel={() => setDatePickerFlag(null)} />
            </View>
            :
            <View style={{ marginLeft: 20, marginRight: 20 }}>
              <View style={style.itemView}>
                <Text style={style.titleText}>Skill</Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={style.forminput}
                  value={title}
                  autoFocus={false}
                  returnKeyType={'next'}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Skill (Ex: Music Production)"
                  autoCapitalize="words"
                  placeholderTextColor={colors.text2Color}
                  onChangeText={(text) => { setTitle(text) }}
                  blurOnSubmit={false} />
              </View>
              <TouchableOpacity
                style={[styles.submitButton, { marginTop: 20 }]}
                isLoading={loading}
                onPress={() => addSkills()}
                indicatorCount={10}>
                <Text style={styles.buttonText}>{_id != null ? 'Edit' : 'Add'} {flag}</Text>
              </TouchableOpacity>
            </View>
          }
        </View>

      </Modal>

    </View>
  )
}
