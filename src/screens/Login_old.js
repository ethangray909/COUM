// 'use strict';

// import React, {useRef, useEffect, useState, useCallback} from 'react';
// import {
//     Text,
//     View,
//     TextInput,
//     NativeModules,
//     Platform,
//     Modal,
//     TouchableHighlight,
//     TouchableOpacity,
//     SafeAreaView,
//     StatusBar,
//     ImageBackground,
//     Image,
//     Dimensions,
//     StyleSheet,
//     Button,
//     Alert,
//     ActivityIndicator,
//     Keyboard,
//     Animated,
//     ScrollView,
//     LayoutAnimation,
//     Clipboard,
//     AppState,
//     FlatList,
//     Linking
// } from 'react-native';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import AsyncStorage from '@react-native-community/async-storage';
// import OTPTextView from 'react-native-otp-textinput';
// import Autocomplete from 'react-native-autocomplete-input';
// import { LoginManager, AccessToken } from 'react-native-fbsdk';
// import SplashScreen from 'react-native-splash-screen';
// import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
// import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
// //import { WebView } from 'react-native-webview';
// import DeviceInfo from 'react-native-device-info';
// import SpinnerButton from 'react-native-spinner-button';
// import Snackbar from 'react-native-snackbar';
// import {AppleButton, appleAuth} from '@invertase/react-native-apple-authentication';
// import messaging from '@react-native-firebase/messaging';

// import styles from '../styles/Styles';

// import background_blur from '../images/background_blur.png';
// import background_ from '../images/background_.png';
// import logo from '../images/logo.png';
// import googleLogo from '../images/google_logo.png';
// import facebookLogo from '../images/facebook_logo.png';
// import twitterLogo from '../images/twitter_logo.png';

// let {height, width} = Dimensions.get('window');
// const API = require('../network/api.js')
// const CONSTANTS = require('../global/constants.js')
// const FUNCTIONS = require('../global/functions.js')
// let notchPadding = DeviceInfo.hasNotch() ? 20 : 0;

// function comp(a, b) {
//   return a.toLowerCase().trim() === b.toLowerCase().trim();
// }

// function findTags(query, tag) {
//   if (query === '') {
//     return [];
//   }
//   if (query != null) {
//     const regex = new RegExp(`${query.trim()}`, 'i');
//     return tag.filter((tag) => tag.name.search(regex) >= 0);
//   }
//   return tag;
// }

// export default function Login() {
//   const navigation = useNavigation();
//   const{colors, isDark} = useTheme();
//   const ref_username = useRef();
//   const ref_password = useRef();
//   const otpInput = useRef(null);
//   const ref_location = useRef();
//   const ref_instagram_link = useRef();
//   const ref_twitter_link = useRef();
//   const ref_facebook_link = useRef();
//   const ref_spotify_apple_link = useRef();
//   const[email,setEmail] = useState('');
//   const[token,setToken] = useState('');
//   const[password,setPassword] = useState('');
//   const[otp,setOtp] = useState('');
//   const[forgotpassword, setForgotPassword] = useState('');
//   const[confirmpassword, setConfirmPassword] = useState('');

//   const[userName, setUserName] = useState('');
//   const[location, setLocation] = useState('');
//   const[instagramLink, setInstagramLink] = useState('');
//   const[twitterLink, setTwitterLink] = useState('');
//   const[facebookLink, setFacebookLink] = useState('');
//   const[spotifyAppleLink, setSpotifyAppleLink] = useState('');
//   const[tags, setTags] = useState([]);
//   const[tagInput, setTagInput] = useState(null);
//   const[designationList, setDesignationList] = useState([]);
//   const[tagsList, setTagsList] = useState();

//   const[keyboardOffset,setKeyboardOffset] = useState(0);
//   const[isLogin,setIsLogin] = useState(true);
//   const[isOption,setIsOption] = useState(false);
//   const[isForgotemail,setIsForgotemail] = useState(true);
//   const[isForgotPin,setIsForgotPin] = useState(false);
//   const[isTagsOption,setIsTagsOption] = useState(true);
//   const[isForgotPasswordandConfirm,setIsForgotPasswordandConfirm] = useState(false);
//   const[isRegister,setIsRegister] = useState(false);
//   const[isForgotPassword,setIsForgotPassword] = useState(false);
//   const[loginLoading, setLoginLoading] = useState(false);
//   const[loading, setLoading] = useState(false);
//   const[isSignUpOtp, setIsSignUpOtp] = useState(false);
//   const[isDesignation, setIsDesignation] = useState(false);
//   const searchTags = findTags(tagInput, tagsList);
//   const[fcmToken, setFcmToken] = useState('');

//   const onTokenRefreshListener = messaging().onTokenRefresh(getToken => {
//       console.log('Update Token:', getToken);
//       setFcmToken(getToken);
//   });

//   const style = StyleSheet.create({
//       container: {
//           flex: 1,
//           justifyContent: 'center',
//           alignItems: 'stretch',
//           backgroundColor: colors.background,
//       },
//       imgBackground: {
//         position: 'absolute',
//         top: (!isOption && !isForgotPassword) ? -height/(DeviceInfo.hasNotch() ? 6.4 : 3.4) :isForgotPassword ? -height/(DeviceInfo.hasNotch() ? 13 : 3.5) : -height/(DeviceInfo.hasNotch() ? 2 : 1.5),
//         width: width,
//         resizeMode: 'stretch'
//       },
//       forminput: {
//           color: '#FFFFFF',
//           borderBottomWidth: 0.5,
//           borderColor: '#FFFFFF',
//           fontFamily: 'SourceSansPro-Regular',
//           fontSize: 14,
//           padding: 0
//       },
//       formLabel: {
//           color: '#FFFFFF',
//           fontFamily: 'SourceSansPro-Regular',
//           fontSize: 14,
//       },
//       loginButton: {
//           marginRight: '10%',
//           marginLeft: '10%',
//           marginTop: 25,
//           borderRadius: 20,
//           height: 46,
//           justifyContent: 'center',
//       },
//       loginButton2: {
//           backgroundColor: 'white',
//           marginRight: '10%',
//           width:'90%',
//           marginLeft: '10%',
//           marginTop: 25,
//           borderRadius: 20,
//           height: 46,
//           justifyContent: 'center',
//           fontFamily: 'SourceSansPro-Regular'
//       },
//       signup_button: {
//         marginRight: '10%',
//         marginLeft: '10%',
//         marginTop: 25,
//         borderRadius: 20,
//         width: '90%',
//         height: 46,
//         backgroundColor: colors.buttonBackground,
//         justifyContent: 'center',
//         fontFamily: 'SourceSansPro-Regular'
//       },
//       option_button:{
//         backgroundColor: '#1C1C1C',
//         borderRadius: 10,
//         marginTop: 20,
//       },
//       option_text: {
//         padding: 12,
//         fontSize: 20,
//         fontFamily: 'SFProDisplay-Regular',
//         fontWeight: '600',
//         color: '#FFFFFF',
//       },
//       privacyText: {
//           color: '#4E5B73',
//           fontFamily: 'SourceSansPro-Regular',
//           fontSize: 20
//       },
//       button_text: {
//         alignSelf: 'center',
//         color: colors.btnTextColor,
//         paddingLeft: 40,
//         paddingRight: 40,
//         fontFamily: 'SourceSansPro-Regular',
//         fontSize: 16,
//         textTransform: 'uppercase',
//       },
//       textContainer: {
//           flex: 1,
//           alignItems: 'center',
//           padding: 20,
//           backgroundColor: 'green'
//       },
//       defaultButtonStyle: {
//           justifyContent: 'center',
//           alignItems: 'center',
//           height: 50,
//           backgroundColor: '#25CAC6',
//       },
//       socialLoginView: {
//         height: 50,
//         width: 50,
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: isDark ? '#1C1C1C' : '#FFFFFF',
//         borderRadius: 10,
//         borderWidth: isDark ? 0 : 1,
//         borderColor: isDark ? 'transparent' : 'rgba(112, 112, 112, 0.2)',
//       },
//   });

//   useEffect(() => {
//     Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
//     Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

//     checkFirebasePermmision();

//     FUNCTIONS.getItem('token').then((getToken) => {
//       console.log('GetToken : ',getToken);
//       if (getToken != null) {
//         setToken(getToken);
//         FUNCTIONS.getItem('user').then((getUser)=> {
//           if (getUser != null) {
//             let updateUser = JSON.parse(getUser);
//             console.log('User : ', updateUser);
//             onLoggedIn(getToken, updateUser);
//           }
//         });
//       }
//     });

//     let timer1 = setTimeout(() => {
//       console.log('Timer off : ',token);
//       SplashScreen.hide();
//       // if (token != '' && token != null) {
//       //   navigation.replace('TabScreens');
//       // }
//     }, 2000);

//     GoogleSignin.configure({
//       scopes: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
//       webClientId: CONSTANTS.GOOGLE_WEB_CLIENT_ID,
//       offlineAccess: true,
//       hostedDomain: '',
//       loginHint: '',
//       forceConsentPrompt: true,
//       accountName: '',
//       iosClientId: CONSTANTS.GOOGLE_IOS_CLIENT_ID,
//       profileImageSize: 120
//       });

//     getCoumData();

//     // cleanup function
//     return () => {
//       clearTimeout(timer1);
//       Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
//       Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
//     };
//   }, []);

//   const _keyboardDidShow = () => {
//     setKeyboardOffset(Platform.OS === 'android' ? -100 : - (height / 4));
//     //keyboardOffset = Platform.OS==='android' ? - 100 : - (height/4);
//   };

//   const _keyboardDidHide = () => {
//     setKeyboardOffset(0);
//   };

//   async function requestPermission() {
//       messaging().requestPermission()
//         .then(() => {
//           console.log('permission allow');
//           getFirebaseToken(isLoading);
//         })
//         .catch(error => {
//           console.log('Firebase Permission Error : ', error);
//         });
//   }

//   async function checkFirebasePermmision() {
//     const authStatus = await messaging().requestPermission();
//     const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
//     if (enabled) {
//       getFirebaseToken(false);
//     }else {
//       requestPermission();
//     }
//   }

//   async function getFirebaseToken(isLogin) {
//     console.log('getFirebaseToken Called');
//     const enabled = await messaging().hasPermission();
//     if (enabled) {
//       let getToken = await messaging().getToken();
//       if (getToken) {
//         console.log('FCM Token : ',getToken);
//         setFcmToken(getToken);
//       }
//     }else {
//       requestPermission();
//     }
//   }

//   function getCoumData() {
//     console.log('Get Coum Data');
//     try {
//       API.callUserApi(CONSTANTS.BASE_URL+ 'data', {}, this, 'GET')
//         .then((response)=> {
//           setLoading(false);
//           console.log('Get CoumData : ', JSON.stringify(response));
//           if (response.error == 0) {
//             CONSTANTS.COUM_DATA = response.result;
//           }
//         });
//     } catch (e) {
//       console.log('Get Data Error: ', e);
//     }
//   }

//   function continueClick(status) {
//     let designation = [];

//     if (status == 'custom') {
//       console.log('Customise');
//       if (userName == '') {
//         Snackbar.show({  text: 'Please enter user name',  duration: Snackbar.LENGTH_SHORT});
//       }else {
//         setIsOption(true);
//         setIsTagsOption(false);
//         setIsDesignation(true);
//         //setIsTagsOption(false);
//       }
//     } else if (status == 'designation') {

//       designationList.filter((row, index)=> {
//         if (row.isCheck) {
//           console.log('Row : ', row);
//           designation.push(row._id);
//         }
//       });
//       console.log('Designation : ', designation);

//       if (designation.length == 0) {
//         Snackbar.show({  text: 'Please select designation',  duration: Snackbar.LENGTH_SHORT});
//         //setIsDesignation(false);
//       }else {
//         setIsDesignation(false);
//       }
//     }else if (status == 'tags') {
//       console.log('Tags');
//       if (tags.length < 4) {
//         Snackbar.show({  text: 'Please enter 4 coum tags',  duration: Snackbar.LENGTH_SHORT});
//         return;
//       }else {
//         designationList.filter((row, index)=> {
//           if (row.isCheck) {
//             console.log('Row : ', row);
//             let obj = {id: row._id}
//             designation.push(obj);
//           }
//         });
//         let getTags = [];
//         tags.filter((row, index)=> {
//           let obj = {id: row._id}
//           getTags.push(obj);
//         });
//         let obj = {
//           user_name: userName,
//           //subscribe: yes,
//           location: location,
//           instagram: instagramLink,
//           twitter: twitterLink,
//           facebook: facebookLink,
//           spotify_apple: spotifyAppleLink,
//           designation: JSON.stringify(designation),
//           tags: JSON.stringify(getTags),
//         };

//         //return;

//         try {
//           setLoading(true);
//           API.callUpdateUser(CONSTANTS.BASE_URL + 'user/update', obj)
//             .then((response)=> {
//               setLoading(false);
//               console.log('Update User Response : ', JSON.stringify(response));
//               if (response.error == 0) {
//                 onLoggedIn(response.user.request_token, response.user);
//               }
//             });
//         } catch (e) {
//           setLoading(false);
//           console.log('Update Profile Error : ', e);
//         }
//       }
//     }
//   }

//   const forgotPasswordClicked = () => {
//     setIsForgotPassword(true);
//     setLoading(false);
//     setIsLogin(false);
//     setUserName('');
//     setPassword('');
//     setIsForgotemail(true);
//   }

//   const loginClick = () => {
//     console.log('Login Click');
//     try {
//       let obj= {
//         email: email,
//         password: password,
//         device_id: FUNCTIONS.deviceId,
//         device_info: JSON.stringify(FUNCTIONS.getSyncDeviceInfo()),
//         device_token: fcmToken,
//       };
//       setLoginLoading(true);
//       API.callRegisterationApi(CONSTANTS.BASE_URL + 'login', obj)
//         .then((response)=> {
//           console.log('Login Response : ',JSON.stringify(response));
//           setLoginLoading(false);
//           Snackbar.show({  text: response.message,  duration: Snackbar.LENGTH_SHORT});
//           if (response.error == 0) {
//             onLoggedIn(response.token, response.user);
//           }
//         });
//     } catch (e) {
//       setLoginLoading(false);
//       console.log('Login Error : ', e);
//     }
//   }

//   function onSignUpClick(status){
//     // if (status == 'signup') {
//     //   setIsLogin(false);
//     //   setIsSignUpOtp(true);
//     // }else {
//     //   setIsOption(true);
//     //   setOtp('');
//     //   setIsSignUpOtp(false);
//     // }
//     // return;

//     try {
//       if (status == 'signup' || status == 'otp') {
//         let obj = {
//           email: email,
//           password: password,
//           device_id: FUNCTIONS.deviceId,
//           device_info: JSON.stringify(FUNCTIONS.getSyncDeviceInfo()),
//           device_token: fcmToken,
//         };
//         if (status == 'otp') {
//           obj.otp = otp;
//         }else {
//           obj.send_otp = true;
//         }
//         Keyboard.dismiss();

//         setLoading(true);
//         API.callRegisterationApi(CONSTANTS.BASE_URL + 'register', obj)
//           .then((response)=> {
//             setLoading(false);
//             console.log('SIGNUP Response: ', JSON.stringify(response));
//             Snackbar.show({  text: response.message,  duration: Snackbar.LENGTH_SHORT});
//             if (response.error == 0) {
//               if (status == 'signup') {
//                 setIsLogin(false);
//                 setIsSignUpOtp(true);
//               }else {
//                 setIsOption(true);
//                 setOtp('');
//                 setIsSignUpOtp(false);
//                 CONSTANTS.USER = response.user;
//                 CONSTANTS.ACCESS_TOKEN = response.token;
//                 FUNCTIONS.setItem('token', response.token);
//                 FUNCTIONS.setItem('user', JSON.stringify(response.user));
//                 setDesignationList(response.coum_data.designation);
//                 setTagsList(response.coum_data.tags);
//               }
//             }
//           });
//       }
//     } catch (e) {
//       setLoading(false);
//       console.log('Sign up error : ', e);
//     }
//   }

//   function forgotpasswordClick(status) {
//     // if (isForgotemail) {
//     //   setIsForgotPin(true);
//     //   setIsForgotemail(false);
//     // }else if (isForgotPin) {
//     //   setIsForgotPin(false);
//     //   setIsForgotPasswordandConfirm(true);
//     // }else {
//     //   setIsForgotPassword(false);
//     //   setIsOption(false);
//     //   setIsForgotPasswordandConfirm(false);
//     //   setIsLogin(true);
//     // }

//     try {
//       let obj = {
//         email: email
//       };
//       if (status == 'otp') {
//         obj.otp = otp;
//       }
//       if (status == 'password') {
//         obj.new_password = forgotpassword;
//         obj.confirm_password = confirmpassword;
//       }
//       setLoading(true);
//       API.callRegisterationApi(CONSTANTS.BASE_URL + 'forget', obj)
//         .then((response)=> {
//           console.log('Forget Response: ',JSON.stringify(response));
//           Snackbar.show({  text: response.message,  duration: Snackbar.LENGTH_SHORT});
//           setLoading(false);
//           if (response.error == 0) {
//             if (status == 'email') {
//               setIsForgotPin(true);
//               setIsForgotemail(false);
//             }else if (status == 'otp') {
//               setIsForgotPin(false);
//               setIsForgotPasswordandConfirm(true);
//             }else {
//               setIsForgotPassword(false);
//               setIsOption(false);
//               setIsForgotPasswordandConfirm(false);
//               setEmail('');
//               setIsLogin(true);
//             }
//           }
//         });
//     } catch (e) {
//       setLoading(false);
//       console.log('Forgot Password : ', e);
//     }
//   }

//   function onLoggedIn(token, user) {
//     CONSTANTS.ACCESS_TOKEN = token;
//     FUNCTIONS.setItem('token', token);
//     if (user != null) {
//       FUNCTIONS.setItem('user', JSON.stringify(user));
//       CONSTANTS.USER = user;
//     }
//     navigation.replace('TabScreens');
//   }

//   const loginSignupClick = () => {
//     if (isLogin) {
//       //SIGN UP
//       console.log('SIGN UP');
//       setIsLogin(false);
//       setIsSignUpOtp(false);
//       setIsRegister(true);
//     }else {
//       //LOGIN
//       console.log('LOGIN');
//       setIsLogin(true);
//       setIsSignUpOtp(false);
//       setIsRegister(false);
//     }
//   }

//   const googleLoginPressed = async() => {
//     console.log('Google Login Press');
//     try {
//       await GoogleSignin.hasPlayServices();
//       const loggedInUser = await GoogleSignin.signIn();
//       console.log('google token: ', JSON.stringify(loggedInUser));
//       loginWithGoogle(loggedInUser.idToken)
//     } catch (e) {
//       console.log('Google Login Error: ',e);
//     }
//   }

//   function loginWithGoogle(token){
//       API.callRegisterationApi(CONSTANTS.BASE_URL + 'google/oauth2callback', {
//         access_token: token,
//         device_id: FUNCTIONS.deviceId,
//         device_token: fcmToken,
//         device_info: JSON.stringify(FUNCTIONS.getSyncDeviceInfo()),
//       })
//       .then((response) => {

//         console.log('response Google: ', JSON.stringify(response));
//           if(response.error == 0){
//             onLoggedIn(response.token, response.user);
//           }
//       });
//   }

//   const facebookLoginPressed = () => {
//     console.log('Facebook Login Press');
//     LoginManager.logOut();
//     LoginManager.logInWithPermissions(['public_profile', 'email']).then(
//       function(result) {
//         if (result.isCancelled) {
//           console.log('Facebook login cancelled');
//         } else {
//           console.log('Login success with permissions: ', result.grantedPermissions.toString());
//           AccessToken.getCurrentAccessToken().then((accessToken) => loginWithFB(accessToken.accessToken));
//         }
//       },
//       function(error) {
//         console.log('facebook fail with error: ', error);
//       }
//     );
//   }

//   function loginWithFB(token){
//     console.log('Token : ', JSON.stringify(token));
//     API.callRegisterationApi(CONSTANTS.BASE_URL + 'facebook', {
//       access_token: token,
//       bundle_id: FUNCTIONS.bundleId,
//       device_token: fcmToken,
//       device_id: FUNCTIONS.deviceId,
//       device_info: JSON.stringify(FUNCTIONS.getSyncDeviceInfo()),
//     })
//     .then((response) => {
//       console.log('response FB: ', JSON.stringify(response));
//         if(response.error == 0){
//           onLoggedIn(response.token, response.user)
//         }
//     });
//   }

//   const appleLoginPressed = async() => {
//     console.log('Apple Login Press');
//     try {
//       /*const appleAuthRequestResponse = await appleAuth.performRequest({
//           requestedOperation: appleAuth.Operation.LOGIN,
//           requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
//       });

//       console.log('appleAuthRequestResponse', appleAuthRequestResponse);

//       const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

//       if (credentialState === appleAuth.State.AUTHORIZED) {
//         console.log('user authunticated');
//         const {
//           fullName,
//           email,
//           identityToken,
//         } = appleAuthRequestResponse;

//         try {
//           let obj = {
//             bundle_id: FUNCTIONS.bundleId,
//             device_id: FUNCTIONS.deviceId,
//             access_token: identityToken,
//             email: email == null ? '' : email,
//             first_name: fullName.givenName,
//             last_name: fullName.familyName,
//             device_info: JSON.stringify(FUNCTIONS.getSyncDeviceInfo()),
//           };
//           API.callRegisterationApi(CONSTANTS.BASE_URL + 'apple', obj)
//             .then((response)=> {
//               console.log('Apple Login Response : ',JSON.stringify(response));

//               if (response.error == 0) {
//                 this.onLoggedIn(response.token, response.user);
//               }
//             });
//         } catch (e) {
//           console.log('Apple Error : ', e);
//         }
//       }*/
//     } catch (e) {
//       console.log('Apple Login Error: ', e);
//     }
//   }

//   function designationItemClick(item) {
//     let updateArray = designationList.map((row, index)=> {
//       if (row._id == item._id) {
//         if (item.isCheck) {
//           row.isCheck = false;
//         }else {
//           row.isCheck = true;
//         }
//       }
//       return row;
//     });
//     setDesignationList(updateArray);
//   }

//   function onTagsItemClick(item) {
//     let updateTags = tags;
//     console.log('updateTags', updateTags);
//     updateTags.push(item);
//     //setTags(updateTags);
//     let pp = updateTags.filter( (ele, ind) => ind === updateTags.findIndex( elem => elem._id === ele._id && elem._id === ele._id));
//     setTags(pp);
//     setTagInput(null);
//   }

//   function onRemoveTags(item) {
//     let updateTags = [];
//     tags.map((row, index)=> {
//       if (item._id != row._id) {
//         updateTags.push(row);
//       }
//     });
//     setTags(updateTags);
//   }

//   const renderDesignation = ({item, index}) => {
//     return(
//       <TouchableOpacity onPress={()=> designationItemClick(item)} style={[style.option_button, {backgroundColor: item.isCheck ? '#FBBB00' : '#1C1C1C'}]}>
//         <Text style={[style.option_text, {color: item.isCheck ? '#0F0F0F' : '#FFFFFF'}]}>{item.name}</Text>
//       </TouchableOpacity>
//     );
//   }

//   return(
//       <View style={[style.container]}>
//         {Platform.OS == "android" && <StatusBar backgroundColor="transparent" translucent/>}
//         <Image source={background_} style={style.imgBackground}/>
//         <Image source={background_blur} style={style.imgBackground}/>
//         <View style={{position: 'absolute', top: height*0.06, width: width}}>
//           <Image source={logo} style={{resizeMode: 'contain', width: 204, height: 123, alignSelf: 'center'}} />
//           {!isOption &&
//             <View style={{marginLeft: 30, marginRight: 30}}>
//                 <Text style={{color: '#FFFFFF', fontFamily: 'SourceSansPro-SemiBold', fontSize: 30, textAlign: isSignUpOtp ? 'center' :isForgotPin ? 'center' : 'left' }}>
//                     {isLogin ? 'Login' :isForgotPassword ? 'Forgotten Password' : 'Sign Up'}
//                 </Text>
//                 <View style={{backgroundColor: '#FFFFFF', marginTop: 12, height: 2, width: isSignUpOtp ? 86 : 32, alignSelf: isSignUpOtp ? 'center' :isForgotPin ? 'center' : 'flex-start'}} />
//             </View>
//           }
//           <Text style={{marginTop: 20, padding: 0, color: '#FFFFFF', fontFamily: 'SourceSansPro-Regular', fontSize: 14, textAlign: 'center', marginLeft: 30, marginRight: 30}}>
//             {isSignUpOtp ? 'A verification code has been sent to your email,\nplease enter the digits received  below' :isForgotPin ? 'A verification code has been sent to your email,\nplease enter the digits received  below' : ''}
//           </Text>
//         </View>
//         <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
//           <View style={{ height: height}}>
//             {(!isOption && !isForgotPassword) ?
//               <View style={{flex: 1 }}>
//                   <View style={{marginLeft: 30, marginRight: 30, justifyContent: 'space-between', marginTop: height*0.3, backgroundColor: 'transparent'}}>

//                         {!isSignUpOtp ?
//                           <View style={{marginTop: 50}}>
//                             <View>
//                                 <Text style={style.formLabel}>
//                                     Email
//                                 </Text>
//                                 <TextInput
//                                   underlineColorAndroid="transparent"
//                                   style={style.forminput}
//                                   value={email}
//                                   autoFocus={false}
//                                   returnKeyType = { 'next' }
//                                   keyboardType = { 'email-address' }
//                                   autoCapitalize="none"
//                                   autoCorrect={false}
//                                   onSubmitEditing={() => ref_password.current.focus()}
//                                   onChangeText={(text) => { setEmail(text) }}
//                                   blurOnSubmit={false} />
//                             </View>

//                             <View style={{marginTop: 25}}>
//                                 <Text style={style.formLabel}>
//                                     Password
//                                 </Text>
//                                 <TextInput
//                                     underlineColorAndroid="transparent"
//                                     style={style.forminput}
//                                     value={password}
//                                     secureTextEntry={true}
//                                     ref={ref_password}
//                                     onChangeText={(text) => { setPassword(text) }}
//                                     blurOnSubmit={true} />

//                                 {isLogin &&
//                                   <TouchableOpacity onPress={() => forgotPasswordClicked()} style={{ flexDirection: 'row', alignSelf: 'flex-end', marginTop: 10, marginRight: 0}}>
//                                     <Text style={{color: '#FFFFFF', fontSize: 12, alignSelf: 'flex-end', marginLeft: 5, fontFamily: 'SourceSansPro-Regular'}}>
//                                       Forgot Password?
//                                     </Text>
//                                   </TouchableOpacity>
//                                 }
//                             </View>
//                           </View>
//                           :
//                           <View style={{marginTop: 20}}>

//                               <OTPTextView
//                                   handleTextChange={(text) => setOtp(text)}
//                                   textInputStyle={{borderRadius: 14, borderWidth: 1, borderColor: '#FBBB00', color: '#FBBB00', borderBottomWidth: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 30, padding: 0, paddingLeft: 4}}
//                                   containerStyle={{marginTop: keyboardOffset == 0 ? '78%' : '10%',}}
//                                   inputCount={4}
//                                   tintColor="#FBBB00"
//                                   offTintColor="#FBBB00"
//                                   secureTextEntry={true}
//                                   keyboardType="numeric"/>
//                           </View>
//                         }

//                         <View style={{flexDirection: 'row', justifyContent: 'center'}}>
//                             {isLogin ? <View style={{flexDirection:'row', justifyContent:'center',}}>
//                               <TouchableOpacity
//                                   style={{backgroundColor: '#FFFFFF', marginRight: '10%',  marginLeft: '10%',  marginTop: 25,  borderRadius: 20,  height: 46,  justifyContent: 'center',}}
//                                   isLoading={loading}
//                                   onPress={() => {
//                                     onSignUpClick('signup');
//                                   }}
//                                   indicatorCount={10}>
//                                       <View style={{opacity: 0.6}}>
//                                         <Text style={{alignSelf: 'center', color: '#1B1B1B', paddingLeft: 40, paddingRight: 40, fontFamily: 'SourceSansPro-Regular', fontSize: 16}}>SIGN UP</Text>
//                                       </View>
//                               </TouchableOpacity>

//                               <TouchableOpacity
//                                   style={{backgroundColor: '#FBBB00', marginRight: '10%',  marginLeft: '10%',  marginTop: 25,  borderRadius: 20,  height: 46,  justifyContent: 'center',}}
//                                   isLoading={loginLoading}
//                                   onPress={() => loginClick()}
//                                   indicatorCount={10}>

//                                       <Text style={{alignSelf: 'center', color: '#000000', paddingLeft: 40, paddingRight: 40, fontFamily: 'SourceSansPro-SemiBold', fontSize: 16}}>LOGIN</Text>

//                               </TouchableOpacity>
//                             </View>
//                             :
//                             <View style={{flexDirection: 'row', justifyContent: 'center'}}>
//                               <TouchableOpacity
//                                   style={{backgroundColor: '#FBBB0E', marginRight: '10%',  marginLeft: '10%',  marginTop: height*0.05,  borderRadius: 20,  height: 46,  justifyContent: 'center', minWidth:255, borderWidth: isSignUpOtp ? 0 : 1, borderColor: '#E2E2E2'}}
//                                   isLoading={loading}
//                                   onPress={() => {
//                                     onSignUpClick(isSignUpOtp ? 'otp' : 'signup');
//                                   }}
//                                   indicatorCount={10}>
//                                   <View style={{opacity: 0.6}}>
//                                         <Text style={{alignSelf: 'center', color: '#1B1B1B', paddingLeft: 40, paddingRight: 40, fontFamily: 'SourceSansPro-Regular', fontSize: 16}}>
//                                           {isSignUpOtp ? "Continue " : "SIGNUP"}
//                                         </Text>
//                                   </View>
//                               </TouchableOpacity>
//                             </View>
//                             }
//                         </View>

//                   </View>

//                   {!isSignUpOtp &&
//                     <View style={{flex: 1, justifyContent: 'center'}}>
//                       <Text style={{color: colors.textColor, fontFamily: 'SourceSansPro-Regular', fontSize: 14, alignSelf: 'center'}}>
//                           {isLogin ? "or login with" : "or Sign Up with"}
//                       </Text>

//                       <View style={{flex: 0.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: 'transparent'}}>
//                           {Platform.OS == 'ios' &&
//                             <TouchableOpacity style={style.socialLoginView} onPress={()=> appleLoginPressed()}>
//                                 <AntDesign name="apple-o" size={25} color={colors.textColor} />
//                             </TouchableOpacity>
//                           }
//                           <TouchableOpacity style={style.socialLoginView} onPress={()=> googleLoginPressed()}>
//                               <Image source={googleLogo} style={{width: 25, height: 25, marginLeft: 0}} />
//                           </TouchableOpacity>
//                           <TouchableOpacity style={style.socialLoginView} onPress={()=> facebookLoginPressed()}>
//                               <Image source={facebookLogo} style={{width: 12, height: 25, marginLeft: 0}} />
//                           </TouchableOpacity>
//                           {/*<TouchableOpacity style={style.socialLoginView} onPress={()=> twitterLoginPressed()}>
//                               <Image source={twitterLogo} style={{width: 25, height: 25, marginLeft: 0}} />
//                           </TouchableOpacity>*/}
//                       </View>
//                     </View>
//                   }

//                   <View style={{position: 'absolute', bottom: 20 + notchPadding , left: 0, right: 0}}>
//                     <View style={{flexDirection: 'row', justifyContent: 'center'}}>
//                       <Text style={{color: colors.textColor, fontSize: 12, alignSelf: 'flex-end', marginLeft: 5, fontFamily: 'SourceSansPro-Regular'}}>
//                         {isLogin ? "Don't have an account?" : "Already have an account?"}
//                       </Text>
//                       <TouchableOpacity style={{marginLeft: 15}} onPress={()=>loginSignupClick()}>
//                         <Text style={{color: colors.textColor, fontSize: 12, alignSelf: 'flex-end', marginLeft: 5, fontFamily: 'SourceSansPro-SemiBold'}}>
//                             {isLogin ? "SIGN UP" : "LOGIN"}
//                         </Text>
//                       </TouchableOpacity>
//                     </View>

//                   </View>
//               </View>
//             :isForgotPassword ?
//               <View style={{flex: 1}}>

//                 <View style={{marginLeft: 38, marginRight: 38, marginTop: height*0.3}}>
//                     <View style={{marginTop: height*0.1}}>
//                       {isForgotemail &&
//                         <View>
//                             <Text style={{marginTop: 0, padding: 0, color: '#FFFFFF', fontFamily: 'SourceSansPro-Regular', fontSize: 14,}}>
//                                 Please provide your email
//                             </Text>
//                             <TextInput
//                               underlineColorAndroid="transparent"
//                               style={{marginBottom: 0, color: '#FFFFFF',  borderBottomWidth: 0.5, borderColor: '#FFFFFF', fontFamily: 'SourceSansPro-Regular', fontSize: 14, height: 40}}
//                               value={email}
//                               autoFocus={false}
//                               returnKeyType = { 'done' }
//                               keyboardType = { 'email-address' }
//                               autoCapitalize="none"
//                               autoCorrect={false}
//                               onChangeText={(text) => { setEmail(text) }}
//                               blurOnSubmit={false} />
//                         </View>
//                       }
//                       {isForgotPin &&
//                         <View style={{marginTop: 20}}>

//                             <OTPTextView
//                                 handleTextChange={(text) => setOtp(text)}
//                                 textInputStyle={{borderRadius: 14, borderWidth: 1, borderColor: '#FBBB00', color: '#FBBB00', borderBottomWidth: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 30, padding: 0, paddingLeft: 4}}
//                                 containerStyle={{marginTop: keyboardOffset == 0 ? '65%' : '10%'}}
//                                 inputCount={4}
//                                 tintColor="#FBBB00"
//                                 offTintColor="#FBBB00"
//                                 secureTextEntry={true}
//                                 keyboardType="numeric"/>
//                         </View>
//                       }
//                       {isForgotPasswordandConfirm &&
//                         <View>
//                           <View>
//                               <Text style={{marginTop: 0, padding: 0, color: '#FFFFFF', fontFamily: 'SourceSansPro-Regular', fontSize: 14}}>
//                                   Enter new password
//                               </Text>
//                               <TextInput
//                                 style={{color: '#FFFFFF',  borderBottomWidth: 0.5, borderColor: '#FFFFFF', fontFamily: 'SourceSansPro-Regular', height: 40}}
//                                 onChangeText={text => setForgotPassword(text)}
//                                 secureTextEntry={true}
//                                 value={forgotpassword}
//                               />


//                           </View>
//                           <View style={{marginTop:'10%'}}>
//                               <Text style={{marginTop: 0, padding: 0, color: '#FFFFFF', fontFamily: 'SourceSansPro-Regular', fontSize: 14,}}>
//                                   confirm new password
//                               </Text>
//                               <TextInput
//                               underlineColorAndroid="transparent"
//                               style={{marginBottom: 0, color: '#FFFFFF',  borderBottomWidth: 0.5, borderColor: '#FFFFFF', fontFamily: 'SourceSansPro-Regular', fontSize: 14, height: 40}}
//                               value={confirmpassword}
//                               secureTextEntry={true}
//                               //ref='password'
//                               onChangeText={(text) => { setConfirmPassword(text) }}
//                               blurOnSubmit={true} />

//                           </View>
//                         </View>
//                       }
//                     </View>

//                         <TouchableOpacity
//                             style={{backgroundColor: '#FBBB00', minWidth:255, marginTop:'18%', marginRight: '10%', marginLeft: '10%', borderRadius: 20, height: 46, justifyContent: 'center',}}
//                             isLoading={loading}
//                             onPress={() => forgotpasswordClick(isForgotPasswordandConfirm ? "password" :isForgotPin ? "otp" : "email")}
//                             indicatorCount={10}>
//                               <View style={{opacity: isForgotPin ? 0.6 : 10}}>
//                                 <Text style={{alignSelf: 'center', color: '#000000', paddingLeft: 40, paddingRight: 40, fontFamily: 'SourceSansPro-Regular', fontSize: 16,}}>
//                                   {isForgotPasswordandConfirm ? "LOGIN" :isForgotPin ? "Continue" : "CONTINUE"}
//                                 </Text>
//                               </View>
//                         </TouchableOpacity>
//                 </View>
//               </View>
//             :
//               <View style={{flex: 1}}>
//                 <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
//                   <View style={{paddingLeft:'10%', paddingRight:'10%', paddingLeft: 38, paddingRight: 38, marginTop: DeviceInfo.hasNotch() ? height*0.3 : height*0.35, marginBottom: 20}}>
//                     <Text style={{fontSize:19, fontFamily:'SFProDisplay-Regular', color: colors.textColor, alignSelf:'center'}}>{isTagsOption ? "Customise your account" :isDesignation ? 'What best describes you?' : "Select 4 Coum Tags"}</Text>

//                         {isTagsOption ?
//                           <View>
//                             <TouchableOpacity style={style.option_button}>
//                               <TextInput
//                                   underlineColorAndroid="transparent"
//                                   style={style.option_text}
//                                   value={userName}
//                                   ref={ref_username}
//                                   onChangeText={(text) => { setUserName(text) }}
//                                   placeholder="UserName"
//                                   onSubmitEditing={() => ref_location.current.focus()}
//                                   placeholderTextColor="#FFFFFF"
//                                   returnKeyType="next"
//                                   blurOnSubmit={true} />
//                             </TouchableOpacity>
//                             <TouchableOpacity style={style.option_button}>
//                               <TextInput
//                                   underlineColorAndroid="transparent"
//                                   style={style.option_text}
//                                   value={location}
//                                   ref={ref_location}
//                                   onChangeText={(text) => { setLocation(text) }}
//                                   placeholder="Location"
//                                   placeholderTextColor="#FFFFFF"
//                                   onSubmitEditing={() => ref_instagram_link.current.focus()}
//                                   returnKeyType="next"
//                                   blurOnSubmit={true} />
//                             </TouchableOpacity>
//                             <TouchableOpacity style={style.option_button}>
//                               <TextInput
//                                   underlineColorAndroid="transparent"
//                                   style={style.option_text}
//                                   value={instagramLink}
//                                   ref={ref_instagram_link}
//                                   onChangeText={(text) => { setInstagramLink(text) }}
//                                   placeholder="Instagram Link"
//                                   keyboardType="url"
//                                   placeholderTextColor="#FFFFFF"
//                                   onSubmitEditing={() => ref_twitter_link.current.focus()}
//                                   returnKeyType="next"
//                                   blurOnSubmit={true} />
//                             </TouchableOpacity>
//                             <TouchableOpacity style={style.option_button}>
//                               <TextInput
//                                   underlineColorAndroid="transparent"
//                                   style={style.option_text}
//                                   value={twitterLink}
//                                   ref={ref_twitter_link}
//                                   onChangeText={(text) => { setTwitterLink(text) }}
//                                   placeholder="Twitter Link"
//                                   keyboardType="url"
//                                   placeholderTextColor="#FFFFFF"
//                                   onSubmitEditing={() => ref_facebook_link.current.focus()}
//                                   blurOnSubmit={true} />
//                             </TouchableOpacity>
//                             <TouchableOpacity style={style.option_button}>
//                               <TextInput
//                                   underlineColorAndroid="transparent"
//                                   style={style.option_text}
//                                   value={facebookLink}
//                                   ref={ref_facebook_link}
//                                   onChangeText={(text) => { setFacebookLink(text) }}
//                                   placeholder="Facebook Link"
//                                   keyboardType="url"
//                                   placeholderTextColor="#FFFFFF"
//                                   onSubmitEditing={() => ref_spotify_apple_link.current.focus()}
//                                   returnKeyType="next"
//                                   blurOnSubmit={true} />
//                             </TouchableOpacity>
//                             <TouchableOpacity style={style.option_button}>
//                               <TextInput
//                                   underlineColorAndroid="transparent"
//                                   style={style.option_text}
//                                   value={spotifyAppleLink}
//                                   ref={ref_spotify_apple_link}
//                                   onChangeText={(text) => { setSpotifyAppleLink(text) }}
//                                   placeholder="Spotify/Apply Music Link"
//                                   keyboardType="url"
//                                   placeholderTextColor="#FFFFFF"
//                                   onSubmitEditing={Keyboard.dismiss}
//                                   returnKeyType="done"
//                                   blurOnSubmit={true} />
//                             </TouchableOpacity>

//                           </View>
//                           :isDesignation ?
//                           <View style={{flex: 1}}>
//                             <FlatList
//                                showsVerticalScrollIndicator={false}
//                                data={designationList}
//                                renderItem={renderDesignation}
//                                keyExtractor={(item, index) => index.toString()}
//                                />
//                           </View>
//                           :
//                           <View>
//                             <View style={{backgroundColor: isDark ? '#1C1C1C' : '#F2F2F4', borderColor: 'transparent', marginTop: 20, borderRadius: 10, minHeight: tags.length < 4 ? 230 : 190}}>
//                               {tags.length < 4 &&
//                                 <View style={{marginLeft: 10, marginRight: 15, marginTop: 4, zIndex: 1}}>
//                                   <Autocomplete
//                                     data={searchTags.length === 1 && comp(tagInput, searchTags[0].name) ? [] : searchTags}
//                                     value={tagInput}
//                                     hideResults={tagInput != null ? false : true}
//                                     onChangeText={(text) => setTagInput(text)}
//                                     placeholder="Search tags..."
//                                     style={{backgroundColor: isDark ? '#000000' : '#FFFFFF', padding: 8, borderWidth: 0, borderColor: 'transparent', borderRadius: 8, color: colors.textColor}}
//                                     inputContainerStyle={{marginLeft: 10, marginBottom: 6, overflow: 'hidden', backgroundColor: isDark ? '#FFFFFF' : '#000000', borderWidth: 0, backgroundColor: isDark ? '#000000' : '#FFFFFF', borderRadius: 8}}
//                                     flatListProps={{
//                                       keyExtractor: (_, idx) => idx.toString(),
//                                       renderItem: ({ item }) =>
//                                         <TouchableOpacity style={{backgroundColor: isDark ? '#000000' : '#FFFFFF'}} onPress={()=> onTagsItemClick(item)}>
//                                           <Text style={{padding: 4, color: colors.textColor, fontSize: 14, fontFamily: 'SourceSansPro-Regular'}}>{item.name}</Text>
//                                         </TouchableOpacity>,
//                                     }}
//                                   />
//                                 </View>
//                               }
//                               {tags.map((row,index)=> {
//                                 return(
//                                   <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 15/2, marginBottom: 15/2, marginLeft: 15, marginRight: 15}}>
//                                     <TouchableOpacity onPress={()=> onRemoveTags(row)} style={{backgroundColor: '#FBBB00', width: 30, height: 30, borderRadius: 30/2, justifyContent: 'center', alignItems: 'center'}}>
//                                       <Text style={{fontFamily: 'SFProDisplay-Regular', fontSize: 18, color: '#000000', fontWeight: '800', alignSelf: 'center'}}>X</Text>
//                                     </TouchableOpacity>
//                                     <Text style={{color: colors.textColor, fontFamily: 'SFProDisplay-Regular', fontSize: 23, marginLeft: 10}}>{row.name}</Text>
//                                   </View>
//                                 )
//                               })
//                               }
//                             </View>
//                           </View>

//                         }
//                         <TouchableOpacity
//                             style={{backgroundColor: '#FBBB0E', minWidth: 255, marginTop: isTagsOption ? 25 : '90%', marginRight: '10%', marginLeft: '10%', marginTop: 50, borderRadius: 20, height: 46, justifyContent: 'center', position: (!isDesignation && !isTagsOption) ? 'absolute' : 'relative', top: (!isDesignation && !isTagsOption) ? 0 : 0, overflow: 'hidden'}}
//                             isLoading={loading}
//                             onPress={() => continueClick(isTagsOption ? 'custom' :isDesignation ? 'designation' : 'tags')}
//                             indicatorCount={10}>
//                             <View style={{opacity: 0.6}}>
//                               <Text style={{alignSelf: 'center', color: '#1B1B1B', paddingLeft: 40, paddingRight: 40, fontFamily: 'SourceSansPro-Regular', fontSize: 16, textTransform:'uppercase',}}>Continue</Text>
//                             </View>
//                         </TouchableOpacity>

//                   </View>
//                 </ScrollView>
//               </View>
//           }
//           </View>
//         </ScrollView>
//       </View>
//     );
// }
