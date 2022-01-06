'use strict';

import React, { useRef, useEffect, useState } from 'react';
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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
import stripe, { PaymentCardTextField } from 'tipsi-stripe';
import Snackbar from 'react-native-snackbar';

import DynamicImage from '../components/dynamicImage';
import Header from '../global/header';
import useGlobalStyles from '../styles/Styles';

import user from '../images/user.png';
import user_profile from '../images/user_profile.png';
import user_cover from '../images/user_cover.png';

import { SERVICE_PLAN } from '../global/enums';

let { height, width } = Dimensions.get('window');
const API = require('../network/api.js')
const CONSTANTS = require('../global/constants.js')
const FUNCTIONS = require('../global/functions.js')

let notchPadding = DeviceInfo.hasNotch() ? 21 : 0;
let servicePlanObject = {
  _id: '',
  plan_name: '',
  plan_price: '',
  plan_detials: ''
}

export default function Services() {
  const route = useRoute();
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const styles = useGlobalStyles();
  const cardForm = useRef(null);
  const [purchasedServices, setPurchasedServices] = useState(false);
  const [plan, setPlan] = useState(servicePlanObject);
  const [services, setServices] = useState([]);
  const [chooseService, setChooseService] = useState(null);
  const [serviceItem, setServiceItem] = useState();
  const [isCardForm, setIsCardForm] = useState(false);
  const [cardValid, setCardValid] = useState(false);
  const [cardDetails, setCardDetails] = useState({});
  const [isCardLoding, setCardLoding] = useState(false);

  const style = StyleSheet.create({
    tabView: {
      flex: 1,
      alignItems: 'center',
      borderBottomWidth: 0,
      borderColor: 'transparent',
    },
    currentTabView: {
      flex: 1,
      alignItems: 'center',
      borderBottomWidth: 3,
      borderColor: '#FBBB00',
    },
    currentTabTitle: {
      fontFamily: 'SFProDisplay-Regular',
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FBBB00',
      textTransform: 'uppercase',
      paddingTop: 4,
      paddingBottom: 6,
    },
    tabTitle: {
      fontFamily: 'SFProDisplay-Regular',
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.textColor,
      textTransform: 'uppercase',
      paddingTop: 4,
      paddingBottom: 6,
    },
    serviceText: {
      flex: 1,
      color: colors.textColor
    }
  });

  useEffect(() => {
    console.log('Service route.params: ', (route.params)); //JSON.stringify
    if (route.params.hasOwnProperty('allServices')) {
      setServices(route.params.allServices);
    }
    if (route.params.hasOwnProperty('item')) {
      setChooseService(1)
      setPlan(route.params.item.plans[0])
      setServiceItem(route.params.item);
    }
    if (route.params.hasOwnProperty('purchased_services')) {
      setPurchasedServices(route.params.purchased_services);
    }

    stripe.setOptions({
      publishableKey: CONSTANTS.STRIPE_PUBLIC_KEY,
      merchantId: Platform.OS == 'android' ? CONSTANTS.GOOGLE_PAY_MERCHANT_ID : CONSTANTS.APPLE_PAY_MERCHANT_ID,
      androidPayMode: CONSTANTS.ANDROID_PAYMODE
    });

  }, []);

  function onRequestClick() {
    console.log('onRequestClick');
    try {
      if (plan._id != '') {
        setIsCardForm(true);
        cardForm.isFocused();
        cardForm.focus();
        cardForm.blur();
      } else {
        Snackbar.show({ text: 'Please select your plan.', duration: Snackbar.LENGTH_SHORT });
      }

    } catch (e) {
      console.log('onRequest Error: ', e);
    }
  }

  async function onCompletePayment() {
    console.log('onCompletePayment Click',);
    try {
      const response = await API.callUserApi(CONSTANTS.BASE_URL + 'service/complete', {}, this, 'POST')
      // .then((response) => {
      console.log('Complete Service: ', JSON.stringify(response));
      if (response.error == 0) {

      }
      // });
    } catch (e) {
      console.log('Complete Payment Error: ', e);
    }
    console.log('onCompletePayment action done');
  }

  async function getCardToken() {
    console.log('Card Details: ', cardDetails);
    try {
      const token = await stripe.createTokenWithCard(cardDetails);
      console.log('Get Token: ', token);
      console.log('Service id: ', serviceItem);
      console.log('chooseService: ', chooseService);
      let params = {
        plan_id: serviceItem.plans[chooseService]._id,
        user_id: serviceItem.user_id,
        source_token: token.tokenId,
      }
      console.log('Params: ', params);
      setCardLoding(true);
      API.callUserApi(CONSTANTS.BASE_URL + 'service/request', params, this, 'POST')
        .then((response) => {
          console.log('Request Response: ', JSON.stringify(response));
          setCardLoding(false);
          setIsCardForm(false)
          navigation.goBack();
        });
    } catch (e) {
      console.log('Get Card Token Error: ', e);
    }
  }

  function handleFieldParamsChange(valid, params) {
    //console.log('valid: ',valid);
    setCardValid(valid);
    setCardDetails(params);
    //console.log('Params: ', params);
  }

  return (
    <View style={styles.container}>
      <DynamicImage source={CONSTANTS.USER.cover_pic != null ? { uri: CONSTANTS.USER.cover_pic } : user_cover} resizeMode="cover" style={{ width: '100%', height: 216 }} />
      <TouchableOpacity style={{ top: -180, marginLeft: 10, width: 40, justifyContent: 'center' }} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back-ios" color='#FFFFFF' size={20} />
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        {serviceItem != null ?
          <DynamicImage url={serviceItem.image} style={{ width: 111, height: 111, borderRadius: 111 / 2, alignSelf: 'center', marginTop: -111 / 2 }} />
          :
          <Image source={user_profile} style={{ width: 111, height: 111, borderRadius: 111 / 2, alignSelf: 'center', marginTop: -111 / 2 }} />
        }

      </View>
      <View style={{ flex: 1, marginLeft: 20, marginRight: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: colors.textColor, fontFamily: 'SFProDisplay-Regular', fontSize: 25, fontWeight: '800' }}>Services</Text>
          <TouchableOpacity style={[styles.btnFollowView, { marginTop: -20 }]}>
            <Text style={styles.txtFollowButton}>{chooseService == null ? 'Edit' : 'Message'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 8 }}>
          <View>
            <Text style={{ color: colors.textColor, fontFamily: 'SourceSansPro-Regular', fontSize: 15, marginTop: 8 }}>
              {serviceItem != null ? serviceItem.service_desc : 'With over 10 years experience in the recordinging and music management industry , I offer a wide range of services such as studio recording , mixing , production & song writing.'}
            </Text>

            {chooseService == null &&
              <TouchableOpacity style={[styles.btnFollowView, { alignSelf: 'flex-end', marginTop: 8 }]}>
                <Text style={styles.txtFollowButton}>Edit</Text>
              </TouchableOpacity>
            }
            {serviceItem != null ?
              <View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#8B8686', alignItems: 'center' }}>
                  {serviceItem.plans.map((row, index) => {
                    return (
                      <TouchableOpacity onPress={() => setPlan(row)} style={plan._id == row._id ? style.currentTabView : style.tabView}>
                        <Text style={plan._id == row._id ? style.currentTabTitle : style.tabTitle}>${row.plan_price}</Text>
                      </TouchableOpacity>
                    )
                  }
                  )}
                </View>

                <View style={{ marginTop: 15, alignItems: 'center' }}>
                  <Text style={{ color: colors.textColor, fontFamily: 'SFProDisplay-Regular', fontSize: 14, textTransform: 'uppercase' }}>{plan.plan_name}</Text>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
                    <Text style={style.serviceText}>{serviceItem.service_desc}</Text>
                  </View>

                  {/*<View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15}}>
                          <Text style={style.serviceText}>Includes MP3 File</Text>
                          <View style={{height: 2, backgroundColor: '#FBBB00', width: 23}} />
                        </View>

                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15}}>
                          <Text style={style.serviceText}>Includes WAV File</Text>
                          <View style={{height: 2, backgroundColor: '#FBBB00', width: 23}} />
                        </View>*/}

                  <TouchableOpacity onPress={() => purchasedServices ? onCompletePayment() : onRequestClick()} style={{ backgroundColor: '#FBBB00', borderRadius: 13, height: 50, justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 15 }}>
                    <Text style={{ fontFamily: 'SFProDisplay-Regular', fontSize: 20, color: '#000000' }}>{purchasedServices ? 'Complete Service' : 'Request Service'}</Text>
                  </TouchableOpacity>

                </View>

              </View>
              :
              <View>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  style={{ marginTop: 10, marginBottom: 20 }}
                  data={services}
                  renderItem={({ index, item }) =>
                    <TouchableOpacity onPress={() => {
                      //setPlan(item[0]);
                      setServiceItem(item);
                      setChooseService(index);
                    }} style={{ backgroundColor: chooseService == index ? (isDark ? 'transparent' : '#ECECEC') : '#FBBB00', borderRadius: 13, justifyContent: 'center', marginTop: 10, borderColor: isDark ? '#FBBB00' : '#ECECEC', borderWidth: chooseService == index ? 1 : 0, padding: 8 }}>
                      <Text style={{ fontFamily: 'SFProDisplay-Regular', fontSize: 25, color: chooseService == index ? (isDark ? '#FFFFFF' : '#384149') : '#000000', alignSelf: 'center' }}>{item.title}</Text>
                    </TouchableOpacity>
                  }
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            }

          </View>
        </ScrollView>

        <Modal
          animationType="slide"
          visible={isCardForm}
          onRequestClose={() => setIsCardForm(false)}>
          <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: 15 + DeviceInfo.hasNotch() ? 44 : 15 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15, marginRight: 15, marginBottom: 20 }}>
              <TouchableOpacity onPress={() => setIsCardForm(false)}>
                <Text style={{ fontFamily: 'SourceSansPro-Regular', color: '#FBBB00', fontSize: 18, fontWeight: '500' }}>Cancel</Text>
              </TouchableOpacity>
              <Text style={{ fontFamily: 'SourceSansPro-Regular', color: colors.textColor, fontSize: 18, fontWeight: '500', flex: 1, textAlign: 'center' }}>Add a Card</Text>

              {isCardLoding ?
                <ActivityIndicator color="#FBBB00" />
                :
                <TouchableOpacity disabled={!cardValid} onPress={() => getCardToken()}>
                  <Text style={{ fontFamily: 'SourceSansPro-Regular', color: cardValid ? '#FBBB00' : colors.textColor, fontSize: 18, fontWeight: '500' }}>Done</Text>
                </TouchableOpacity>
              }
            </View>

            <PaymentCardTextField
              ref={cardForm}
              style={{ borderColor: '#FBBB00', borderWidth: 0, borderRadius: 5, width: '98%' }}
              cursorColor={'#FBBB00'}
              onParamsChange={handleFieldParamsChange}
            />
          </View>
        </Modal>

      </View>
    </View>
  );
}
