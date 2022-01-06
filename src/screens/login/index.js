'use strict';

import messaging from '@react-native-firebase/messaging';
import {
  GoogleSignin
} from '@react-native-google-signin/google-signin';
import { useNavigation, useTheme } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions, Image, Keyboard, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import OTPTextView from 'react-native-otp-textinput';
import Snackbar from 'react-native-snackbar';
// import SplashScreen from 'react-native-splash-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import background_ from '../../images/background_.png';
import background_blur from '../../images/background_blur.png';
import facebookLogo from '../../images/facebook_logo.png';
import googleLogo from '../../images/google_logo.png';
import logo from '../../images/logo.png';
// import SpinnerButton from 'react-native-spinner-button';



let { height, width } = Dimensions.get('window');
const API = require('../../network/api.js');
const CONSTANTS = require('../../global/constants.js');
const FUNCTIONS = require('../../global/functions.js');
let notchPadding = DeviceInfo.hasNotch() ? 20 : 0;

export default function Login() {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const ref_password = useRef();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [forgotpassword, setForgotPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');

  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotemail, setIsForgotemail] = useState(true);
  const [isForgotPin, setIsForgotPin] = useState(false);

  const [isForgotPasswordandConfirm, setIsForgotPasswordandConfirm] = useState(
    false,
  );
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUpOtp, setIsSignUpOtp] = useState(false);
  const [fcmToken, setFcmToken] = useState('');

  const onTokenRefreshListener = messaging().onTokenRefresh((getToken) => {
    console.log('Update Token:', getToken);
    setFcmToken(getToken);
  });

  const style = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'stretch',
      backgroundColor: colors.background,
    },
    imgBackground: {
      position: 'absolute',
      top: !isForgotPassword
        ? -height / (DeviceInfo.hasNotch() ? 6.4 : 6.4) //3.4
        : isForgotPassword
          ? -height / (DeviceInfo.hasNotch() ? 13 : 10) //3.5
          : -height / (DeviceInfo.hasNotch() ? 2 : 1.5),
      width: width,
      resizeMode: 'stretch',
      // backgroundColor: 'red'
    },
    forminput: {
      color: '#FFFFFF',
      borderBottomWidth: 0.5,
      borderColor: '#FFFFFF',
      fontFamily: 'SourceSansPro-Regular',
      fontSize: 14,
      padding: 0,
    },
    formLabel: {
      color: '#FFFFFF',
      fontFamily: 'SourceSansPro-Regular',
      fontSize: 14,
    },
    loginButton: {
      marginRight: '10%',
      marginLeft: '10%',
      marginTop: 25,
      borderRadius: 20,
      height: 46,
      justifyContent: 'center',
    },
    socialLoginView: {
      height: 50,
      width: 50,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? '#1C1C1C' : '#FFFFFF',
      borderRadius: 10,
      borderWidth: isDark ? 0 : 1,
      borderColor: isDark ? 'transparent' : 'rgba(112, 112, 112, 0.2)',
    },
  });

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    checkFirebasePermmision();

    FUNCTIONS.getItem('token').then((getToken) => {
      console.log('GetToken : ', getToken);
      if (getToken != null) {
        setToken(getToken);
        FUNCTIONS.getItem('user').then((getUser) => {
          if (getUser != null) {
            let updateUser = JSON.parse(getUser);
            console.log('User : ', updateUser);
            onLoggedIn(getToken, updateUser);
          }
        });
      }
    });
    console.log('SplashScreen.hide called');
    // SplashScreen.hide();
    let timer1 = setTimeout(() => {
      console.log('Timer off : ', token);
      // if (token != '' && token != null) {
      //   navigation.replace('TabScreens');
      // }
    }, 2000);

    GoogleSignin.configure({
      scopes: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
      webClientId: CONSTANTS.GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
      hostedDomain: '',
      loginHint: '',
      forceConsentPrompt: true,
      accountName: '',
      iosClientId: CONSTANTS.GOOGLE_IOS_CLIENT_ID,
      profileImageSize: 120,
    });

    getCoumData();

    // cleanup function
    return () => {
      clearTimeout(timer1);
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = () => {
    setKeyboardOffset(Platform.OS === 'android' ? -100 : -(height / 4));
    //keyboardOffset = Platform.OS==='android' ? - 100 : - (height/4);
  };

  const _keyboardDidHide = () => {
    setKeyboardOffset(0);
  };

  async function requestPermission() {
    messaging()
      .requestPermission()
      .then(() => {
        console.log('permission allow');
        getFirebaseToken(isLoading);
      })
      .catch((error) => {
        console.log('Firebase Permission Error : ', error);
      });
  }

  async function checkFirebasePermmision() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      getFirebaseToken(false);
    } else {
      requestPermission();
    }
  }

  async function getFirebaseToken(isLogin) {
    console.log('getFirebaseToken Called');
    const enabled = await messaging().hasPermission();
    if (enabled) {
      let getToken = await messaging().getToken();
      if (getToken) {
        console.log('FCM Token : ', getToken);
        setFcmToken(getToken);
      }
    } else {
      requestPermission();
    }
  }

  function getCoumData() {
    console.log('Get Coum Data');
    try {
      API.callUserApi(CONSTANTS.BASE_URL + 'data', {}, this, 'GET').then(
        (response) => {
          setLoading(false);
          console.log('Get CoumData : ', JSON.stringify(response));
          if (response.error == 0) {
            CONSTANTS.COUM_DATA = response.result;
          }
        },
      );
    } catch (e) {
      console.log('Get Data Error: ', e);
    }
  }

  const forgotPasswordClicked = () => {
    setIsForgotPassword(true);
    setLoading(false);
    setIsLogin(false);
    setPassword('');
    setIsForgotemail(true);
  };

  const loginClick = () => {
    console.log('Login Click');
    try {
      let obj = {
        email: email,
        password: password,
        device_id: FUNCTIONS.deviceId,
        device_info: '',//JSON.stringify(FUNCTIONS.getSyncDeviceInfo()),
        device_token: fcmToken,
      };
      console.log('data in screen: ', obj);
      // setLoginLoading(true);
      API.callRegisterationApi(CONSTANTS.BASE_URL + 'login', obj).then(
        (response) => {
          console.log('Login Response : ', response); //JSON.stringify(response)
          setLoginLoading(false);
          // Snackbar.show({
          //   text: response.message,
          //   duration: Snackbar.LENGTH_SHORT,
          // });
          if (response.error == 0) {
            onLoggedIn(response.token, response.user);
          }
        },
      );
    } catch (e) {
      setLoginLoading(false);
      console.log('Login Error : ', e);
    }
  };

  function onSignUpClick(status) {
    // if (status == 'signup') {
    //   setIsLogin(false);
    //   setIsSignUpOtp(true);
    // }else {
    //   setOtp('');
    //   setIsSignUpOtp(false);
    //   navigation.navigate('UpdateUser', {accessToken: "accessToken parse"});
    // }
    // return;

    try {
      let obj = {
        email: email,
        password: password,
        device_id: FUNCTIONS.deviceId,
        device_info: JSON.stringify(FUNCTIONS.getSyncDeviceInfo()),
        device_token: fcmToken,
      };
      if (status == 'otp') {
        obj.otp = otp;
      } else {
        obj.send_otp = true;
      }
      Keyboard.dismiss();

      setLoading(true);
      API.callRegisterationApi(CONSTANTS.BASE_URL + 'register', obj).then(
        (response) => {
          setLoading(false);
          console.log('SIGNUP Response: ', JSON.stringify(response));
          Snackbar.show({
            text: response.message,
            duration: Snackbar.LENGTH_SHORT,
          });
          if (response.error == 0) {
            if (status == 'signup') {
              setIsLogin(false);
              setIsSignUpOtp(true);
            } else {
              setOtp('');
              setIsSignUpOtp(false);
              //CONSTANTS.USER = response.user;
              //CONSTANTS.ACCESS_TOKEN = response.token;
              //FUNCTIONS.setItem('token', response.token);
              //FUNCTIONS.setItem('user', JSON.stringify(response.user));
              updateUser(response.token, response.user);
            }
          }
        },
      );
    } catch (e) {
      setLoading(false);
      console.log('Sign up error : ', e);
    }
  }

  function forgotpasswordClick(status) {
    // if (isForgotemail) {
    //   setIsForgotPin(true);
    //   setIsForgotemail(false);
    // }else if (isForgotPin) {
    //   setIsForgotPin(false);
    //   setIsForgotPasswordandConfirm(true);
    // }else {
    //   setIsForgotPassword(false);
    //   setIsForgotPasswordandConfirm(false);
    //   setIsLogin(true);
    // }
    // return;
    try {
      let obj = {
        email: email,
      };
      if (status == 'otp') {
        obj.otp = otp;
      }
      if (status == 'password') {
        obj.new_password = forgotpassword;
        obj.confirm_password = confirmpassword;
      }
      setLoading(true);
      API.callRegisterationApi(CONSTANTS.BASE_URL + 'forget', obj).then(
        (response) => {
          console.log('Forget Response: ', JSON.stringify(response));
          Snackbar.show({
            text: response.message,
            duration: Snackbar.LENGTH_SHORT,
          });
          setLoading(false);
          if (response.error == 0) {
            if (status == 'email') {
              setIsForgotPin(true);
              setIsForgotemail(false);
            } else if (status == 'otp') {
              setIsForgotPin(false);
              setIsForgotPasswordandConfirm(true);
            } else {
              setIsForgotPassword(false);
              setIsForgotPasswordandConfirm(false);
              setEmail('');
              setIsLogin(true);
            }
          }
        },
      );
    } catch (e) {
      setLoading(false);
      console.log('Forgot Password : ', e);
    }
  }

  function onLoggedIn(token, user) {
    CONSTANTS.ACCESS_TOKEN = token;
    FUNCTIONS.setItem('token', token);
    if (user != null) {
      FUNCTIONS.setItem('user', JSON.stringify(user));
      CONSTANTS.USER = user;
    }
    navigation.replace('TabScreens');
  }

  const loginSignupClick = () => {
    if (isLogin) {
      //SIGN UP
      console.log('SIGN UP');
      setIsLogin(false);
      setIsSignUpOtp(false);
      setIsRegister(true);
    } else {
      //LOGIN
      console.log('LOGIN');
      setIsLogin(true);
      setIsSignUpOtp(false);
      setIsRegister(false);
    }
  };

  const googleLoginPressed = async () => {
    console.log('Google Login Press');
    try {
      await GoogleSignin.hasPlayServices();
      const loggedInUser = await GoogleSignin.signIn();
      console.log('google token: ', JSON.stringify(loggedInUser));
      loginWithGoogle(loggedInUser.idToken);
    } catch (e) {
      console.log('Google Login Error: ', e);
    }
  };

  function loginWithGoogle(token) {
    API.callRegisterationApi(CONSTANTS.BASE_URL + 'google/oauth2callback', {
      access_token: token,
      device_id: FUNCTIONS.deviceId,
      device_token: fcmToken,
      device_info: JSON.stringify(FUNCTIONS.getSyncDeviceInfo()),
    }).then((response) => {
      console.log('response Google: ', JSON.stringify(response));
      if (response.error == 0) {
        //onLoggedIn(response.token, response.user);
        if (response.user.hasOwnProperty('tags')) {
          onLoggedIn(response.token, response.user);
        } else {
          updateUser(response.token, response.user);
        }
      }
    });
  }

  const facebookLoginPressed = () => {
    console.log('Facebook Login Press');
    LoginManager.logOut();
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      function (result) {
        if (result.isCancelled) {
          console.log('Facebook login cancelled');
        } else {
          console.log(
            'Login success with permissions: ',
            result.grantedPermissions.toString(),
          );
          AccessToken.getCurrentAccessToken().then((accessToken) =>
            loginWithFB(accessToken.accessToken),
          );
        }
      },
      function (error) {
        console.log('facebook fail with error: ', error);
      },
    );
  };

  function loginWithFB(token) {
    console.log('Token : ', JSON.stringify(token));
    API.callRegisterationApi(CONSTANTS.BASE_URL + 'facebook', {
      access_token: token,
      bundle_id: FUNCTIONS.bundleId,
      device_token: fcmToken,
      device_id: FUNCTIONS.deviceId,
      device_info: JSON.stringify(FUNCTIONS.getSyncDeviceInfo()),
    }).then((response) => {
      console.log('response FB: ', JSON.stringify(response));
      if (response.error == 0) {
        //onLoggedIn(response.token, response.user);
        if (response.user.hasOwnProperty('tags')) {
          onLoggedIn(response.token, response.user);
        } else {
          updateUser(response.token, response.user);
        }
      }
    });
  }

  const appleLoginPressed = async () => {
    console.log('Apple Login Press');
    try {
      /*const appleAuthRequestResponse = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      console.log('appleAuthRequestResponse', appleAuthRequestResponse);

      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

      if (credentialState === appleAuth.State.AUTHORIZED) {
        console.log('user authunticated');
        const {
          fullName,
          email,
          identityToken,
        } = appleAuthRequestResponse;

        try {
          let obj = {
            bundle_id: FUNCTIONS.bundleId,
            device_id: FUNCTIONS.deviceId,
            access_token: identityToken,
            email: email == null ? '' : email,
            first_name: fullName.givenName,
            last_name: fullName.familyName,
            device_info: JSON.stringify(FUNCTIONS.getSyncDeviceInfo()),
          };
          API.callRegisterationApi(CONSTANTS.BASE_URL + 'apple', obj)
            .then((response)=> {
              console.log('Apple Login Response : ',JSON.stringify(response));

              if (response.error == 0) {
                //this.onLoggedIn(response.token, response.user);
                if (response.user.hasOwnProperty('tags')) {
                  onLoggedIn(response.token, response.user);
                }else {
                  updateUser(response.token, response.user);
                }
              }
            });
        } catch (e) {
          console.log('Apple Error : ', e);
        }
      }*/
    } catch (e) {
      console.log('Apple Login Error: ', e);
    }
  };

  function updateUser(token, getUser) {
    navigation.replace('UpdateUser', { accessToken: token, user: getUser });
  }

  return (
    <View style={[style.container]}>
      {Platform.OS == 'android' && (
        <StatusBar backgroundColor="transparent" translucent />
      )}
      <Image source={background_} style={style.imgBackground} />
      <Image source={background_blur} style={style.imgBackground} />
      <View style={{ position: 'absolute', top: height * 0.06, width: width }}>
        <Image
          source={logo}
          style={{
            resizeMode: 'contain',
            width: 204,
            height: 123,
            alignSelf: 'center',
          }}
        />
        <View style={{ marginLeft: 30, marginRight: 30 }}>
          <Text
            style={{
              color: '#FFFFFF',
              fontFamily: 'SourceSansPro-SemiBold',
              fontSize: 30,
              textAlign: isSignUpOtp
                ? 'center'
                : isForgotPin
                  ? 'center'
                  : 'left',
            }}>
            {isLogin
              ? 'Login'
              : isForgotPassword
                ? 'Forgotten Password'
                : 'Sign Up'}
          </Text>
          <View
            style={{
              backgroundColor: '#FFFFFF',
              marginTop: 12,
              height: 2,
              width: isSignUpOtp ? 86 : 32,
              alignSelf: isSignUpOtp
                ? 'center'
                : isForgotPin
                  ? 'center'
                  : 'flex-start',
            }}
          />
        </View>
        <Text
          style={{
            marginTop: 20,
            padding: 0,
            color: '#FFFFFF',
            fontFamily: 'SourceSansPro-Regular',
            fontSize: 14,
            textAlign: 'center',
            marginLeft: 30,
            marginRight: 30,
          }}>
          {isSignUpOtp
            ? 'A verification code has been sent to your email,\nplease enter the digits received  below'
            : isForgotPin
              ? 'A verification code has been sent to your email,\nplease enter the digits received  below'
              : ''}
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}>
        <View style={{ height: height }}>
          {isForgotPassword ? (
            <View style={{ flex: 1 }}>
              <View
                style={{
                  marginLeft: 38,
                  marginRight: 38,
                  marginTop: height * 0.3,
                }}>
                <View style={{ marginTop: height * 0.1 }}>
                  {isForgotemail && (
                    <View>
                      <Text
                        style={{
                          marginTop: 0,
                          padding: 0,
                          color: '#FFFFFF',
                          fontFamily: 'SourceSansPro-Regular',
                          fontSize: 14,
                        }}>
                        Please provide your email
                      </Text>
                      <TextInput
                        underlineColorAndroid="transparent"
                        style={{
                          marginBottom: 0,
                          color: '#FFFFFF',
                          borderBottomWidth: 0.5,
                          borderColor: '#FFFFFF',
                          fontFamily: 'SourceSansPro-Regular',
                          fontSize: 14,
                          height: 40,
                        }}
                        value={email}
                        autoFocus={false}
                        returnKeyType={'done'}
                        keyboardType={'email-address'}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={(text) => {
                          setEmail(text);
                        }}
                        blurOnSubmit={false}
                      />
                    </View>
                  )}
                  {isForgotPin && (
                    <View style={{ marginTop: 20 }}>
                      <OTPTextView
                        handleTextChange={(text) => setOtp(text)}
                        textInputStyle={{
                          borderRadius: 14,
                          borderWidth: 1,
                          borderColor: '#FBBB00',
                          color: '#FBBB00',
                          borderBottomWidth: 1,
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: 30,
                          padding: 0,
                          paddingLeft: 4,
                        }}
                        containerStyle={{
                          marginTop: keyboardOffset == 0 ? '65%' : '10%',
                        }}
                        inputCount={4}
                        tintColor="#FBBB00"
                        offTintColor="#FBBB00"
                        secureTextEntry={true}
                        keyboardType="numeric"
                      />
                    </View>
                  )}
                  {isForgotPasswordandConfirm && (
                    <View>
                      <View>
                        <Text
                          style={{
                            marginTop: 0,
                            padding: 0,
                            color: '#FFFFFF',
                            fontFamily: 'SourceSansPro-Regular',
                            fontSize: 14,
                          }}>
                          Enter new password
                        </Text>
                        <TextInput
                          style={{
                            color: '#FFFFFF',
                            borderBottomWidth: 0.5,
                            borderColor: '#FFFFFF',
                            fontFamily: 'SourceSansPro-Regular',
                            height: 40,
                          }}
                          onChangeText={(text) => setForgotPassword(text)}
                          secureTextEntry={true}
                          value={forgotpassword}
                        />
                      </View>
                      <View style={{ marginTop: '10%' }}>
                        <Text
                          style={{
                            marginTop: 0,
                            padding: 0,
                            color: '#FFFFFF',
                            fontFamily: 'SourceSansPro-Regular',
                            fontSize: 14,
                          }}>
                          confirm new password
                        </Text>
                        <TextInput
                          underlineColorAndroid="transparent"
                          style={{
                            marginBottom: 0,
                            color: '#FFFFFF',
                            borderBottomWidth: 0.5,
                            borderColor: '#FFFFFF',
                            fontFamily: 'SourceSansPro-Regular',
                            fontSize: 14,
                            height: 40,
                          }}
                          value={confirmpassword}
                          secureTextEntry={true}
                          //ref='password'
                          onChangeText={(text) => {
                            setConfirmPassword(text);
                          }}
                          blurOnSubmit={true}
                        />
                      </View>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  style={{
                    backgroundColor: '#FBBB00',
                    minWidth: 255,
                    marginTop: '18%',
                    marginRight: '10%',
                    marginLeft: '10%',
                    borderRadius: 20,
                    height: 46,
                    justifyContent: 'center',
                  }}
                  isLoading={loading}
                  onPress={() =>
                    forgotpasswordClick(
                      isForgotPasswordandConfirm
                        ? 'password'
                        : isForgotPin
                          ? 'otp'
                          : 'email',
                    )
                  }
                  indicatorCount={10}>
                  <View style={{ opacity: isForgotPin ? 0.6 : 10 }}>
                    <Text
                      style={{
                        alignSelf: 'center',
                        color: '#000000',
                        paddingLeft: 40,
                        paddingRight: 40,
                        fontFamily: 'SourceSansPro-Regular',
                        fontSize: 16,
                      }}>
                      {isForgotPasswordandConfirm
                        ? 'LOGIN'
                        : isForgotPin
                          ? 'Continue'
                          : 'CONTINUE'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <View
                style={{
                  marginLeft: 30,
                  marginRight: 30,
                  justifyContent: 'space-between',
                  marginTop: height * 0.3,
                  backgroundColor: 'transparent',
                }}>
                {!isSignUpOtp ? (
                  <View style={{ marginTop: 50 }}>
                    <View>
                      <Text style={style.formLabel}>Email</Text>
                      <TextInput
                        underlineColorAndroid="transparent"
                        style={style.forminput}
                        value={email}
                        autoFocus={false}
                        returnKeyType={'next'}
                        keyboardType={'email-address'}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onSubmitEditing={() => ref_password.current.focus()}
                        onChangeText={(text) => {
                          setEmail(text);
                        }}
                        blurOnSubmit={false}
                      />
                    </View>

                    <View style={{ marginTop: 25 }}>
                      <Text style={style.formLabel}>Password</Text>
                      <TextInput
                        underlineColorAndroid="transparent"
                        style={style.forminput}
                        value={password}
                        secureTextEntry={true}
                        ref={ref_password}
                        onChangeText={(text) => {
                          setPassword(text);
                        }}
                        blurOnSubmit={true}
                      />

                      {isLogin && (
                        <TouchableOpacity
                          onPress={() => forgotPasswordClicked()}
                          style={{
                            flexDirection: 'row',
                            alignSelf: 'flex-end',
                            marginTop: 10,
                            marginRight: 0,
                          }}>
                          <Text
                            style={{
                              color: '#FFFFFF',
                              fontSize: 12,
                              alignSelf: 'flex-end',
                              marginLeft: 5,
                              fontFamily: 'SourceSansPro-Regular',
                            }}>
                            Forgot Password?
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ) : (
                  <View style={{ marginTop: 20 }}>
                    <OTPTextView
                      handleTextChange={(text) => setOtp(text)}
                      textInputStyle={{
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: '#FBBB00',
                        color: '#FBBB00',
                        borderBottomWidth: 1,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: 30,
                        padding: 0,
                        paddingLeft: 4,
                      }}
                      containerStyle={{
                        marginTop: keyboardOffset == 0 ? '78%' : '10%',
                      }}
                      inputCount={4}
                      tintColor="#FBBB00"
                      offTintColor="#FBBB00"
                      secureTextEntry={true}
                      keyboardType="numeric"
                    />
                  </View>
                )}

                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  {isLogin ? (
                    <View
                      style={{ flexDirection: 'row', justifyContent: 'center' }}>
                      <TouchableOpacity
                        style={{
                          backgroundColor: '#FFFFFF',
                          marginRight: '10%',
                          marginLeft: '10%',
                          marginTop: 25,
                          borderRadius: 20,
                          height: 46,
                          justifyContent: 'center',
                        }}
                        isLoading={loading}
                        onPress={() => {
                          onSignUpClick('signup');
                        }}
                        indicatorCount={10}>
                        <View style={{ opacity: 0.6 }}>
                          <Text
                            style={{
                              alignSelf: 'center',
                              color: '#1B1B1B',
                              paddingLeft: 40,
                              paddingRight: 40,
                              fontFamily: 'SourceSansPro-Regular',
                              fontSize: 16,
                            }}>
                            SIGN UP
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{
                          backgroundColor: '#FBBB00',
                          marginRight: '10%',
                          marginLeft: '10%',
                          marginTop: 25,
                          borderRadius: 20,
                          height: 46,
                          justifyContent: 'center',
                        }}
                        isLoading={loginLoading}
                        onPress={() => loginClick()}
                        indicatorCount={10}>
                        <Text
                          style={{
                            alignSelf: 'center',
                            color: '#000000',
                            paddingLeft: 40,
                            paddingRight: 40,
                            fontFamily: 'SourceSansPro-SemiBold',
                            fontSize: 16,
                          }}>
                          LOGIN
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View
                      style={{ flexDirection: 'row', justifyContent: 'center' }}>
                      <TouchableOpacity
                        style={{
                          backgroundColor: '#FBBB0E',
                          marginRight: '10%',
                          marginLeft: '10%',
                          marginTop: height * 0.05,
                          borderRadius: 20,
                          height: 46,
                          justifyContent: 'center',
                          minWidth: 255,
                          borderWidth: isSignUpOtp ? 0 : 1,
                          borderColor: '#E2E2E2',
                        }}
                        isLoading={loading}
                        onPress={() => {
                          onSignUpClick(isSignUpOtp ? 'otp' : 'signup');
                        }}
                        indicatorCount={10}>
                        <View style={{ opacity: 0.6 }}>
                          <Text
                            style={{
                              alignSelf: 'center',
                              color: '#1B1B1B',
                              paddingLeft: 40,
                              paddingRight: 40,
                              fontFamily: 'SourceSansPro-Regular',
                              fontSize: 16,
                            }}>
                            {isSignUpOtp ? 'Continue ' : 'SIGNUP'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
              {!isSignUpOtp && (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text
                    style={{
                      color: colors.textColor,
                      fontFamily: 'SourceSansPro-Regular',
                      fontSize: 14,
                      alignSelf: 'center',
                    }}>
                    {isLogin ? 'or login with' : 'or Sign Up with'}
                  </Text>

                  <View
                    style={{
                      flex: 0.5,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-evenly',
                      backgroundColor: 'transparent',
                    }}>
                    {Platform.OS == 'ios' && (
                      <TouchableOpacity
                        style={style.socialLoginView}
                        onPress={() => appleLoginPressed()}>
                        <AntDesign
                          name="apple-o"
                          size={25}
                          color={colors.textColor}
                        />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={style.socialLoginView}
                      onPress={() => googleLoginPressed()}>
                      <Image
                        source={googleLogo}
                        style={{ width: 25, height: 25, marginLeft: 0 }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={style.socialLoginView}
                      onPress={() => facebookLoginPressed()}>
                      <Image
                        source={facebookLogo}
                        style={{ width: 12, height: 25, marginLeft: 0 }}
                      />
                    </TouchableOpacity>
                    {/*<TouchableOpacity style={style.socialLoginView} onPress={()=> twitterLoginPressed()}>
                              <Image source={twitterLogo} style={{width: 25, height: 25, marginLeft: 0}} />
                          </TouchableOpacity>*/}
                  </View>
                </View>
              )}
              <View
                style={{
                  position: 'absolute',
                  bottom: 20 + notchPadding,
                  left: 0,
                  right: 0,
                }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text
                    style={{
                      color: colors.textColor,
                      fontSize: 12,
                      alignSelf: 'flex-end',
                      marginLeft: 5,
                      fontFamily: 'SourceSansPro-Regular',
                    }}>
                    {isLogin
                      ? "Don't have an account?"
                      : 'Already have an account?'}
                  </Text>
                  <TouchableOpacity
                    style={{ marginLeft: 15 }}
                    onPress={() => loginSignupClick()}>
                    <Text
                      style={{
                        color: colors.textColor,
                        fontSize: 12,
                        alignSelf: 'flex-end',
                        marginLeft: 5,
                        fontFamily: 'SourceSansPro-SemiBold',
                      }}>
                      {isLogin ? 'SIGN UP' : 'LOGIN'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
