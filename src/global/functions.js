/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

 import AsyncStorage from '@react-native-community/async-storage';
 import {  getManufacturer,
   getManufacturerSync,
   useBatteryLevel,
   useBatteryLevelIsLow,
   usePowerState,
   useFirstInstallTime,
   useDeviceName,
   useHasSystemFeature,
   useIsEmulator,
   getVersion
  } from 'react-native-device-info';

import DeviceInfo from 'react-native-device-info';
const CONSTANTS = require('../global/constants.js')

 export const getItem = async (key) => {
    //  const result = await AsyncStorage.getItem(key);
     return "";
   };

   export const setItem = async (key, value) => {
     (async() => {
         try {
          //  await AsyncStorage.setItem(key, value)
         } catch (e) {
           console.log("errr onLoggedIn: " + e);
         }
     })();
   };

   export const removeItem = async (key) => {
     (async() => {
         try {
           await AsyncStorage.removeItem(key)
         } catch (e) {
           console.log("errr onLoggedIn: " + e);
         }
     })();
   };

   export const checkValidUser = (parent) => {
     if(parent.state.isUserValid == false){

       logoutUser(parent);
     }
   };

   export const deviceId = DeviceInfo.getUniqueId();
   export const bundleId = DeviceInfo.getBundleId();

   export function logoutUser(){
     console.log('Logout FUNCTIONS called');
       CONSTANTS.ACCESS_TOKEN = '';
       CONSTANTS.USER = '';
       removeItem('token');
       removeItem('user');
       // const {navigate} = parent.props.navigation;
       // navigate('Login');
   }

   export function bytesToSize(bytes) {
       var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
       if (bytes == 0) return '0 Byte';
       var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
       return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

   export const getSyncDeviceInfo = () => {

       let deviceJSON = {};

       deviceJSON.manufacturer = getManufacturerSync();
       deviceJSON.buildId = DeviceInfo.getBuildIdSync();
       deviceJSON.iosVersion = DeviceInfo.getSystemVersion();
       deviceJSON.appVersion = DeviceInfo.getVersion();
       deviceJSON.isCameraPresent = DeviceInfo.isCameraPresentSync();
       deviceJSON.deviceName = DeviceInfo.getDeviceNameSync();
       deviceJSON.usedMemory = DeviceInfo.getUsedMemorySync();
       deviceJSON.instanceId = DeviceInfo.getInstanceIdSync();
       deviceJSON.installReferrer = DeviceInfo.getInstallReferrerSync();
       deviceJSON.isEmulator = DeviceInfo.isEmulatorSync();
       deviceJSON.fontScale = DeviceInfo.getFontScaleSync();
       deviceJSON.hasNotch = DeviceInfo.hasNotch();
       deviceJSON.firstInstallTime = DeviceInfo.getFirstInstallTimeSync();
       deviceJSON.lastUpdateTime = DeviceInfo.getLastUpdateTimeSync();
       deviceJSON.serialNumber = DeviceInfo.getSerialNumberSync();
       deviceJSON.androidId = DeviceInfo.getAndroidIdSync();
       deviceJSON.IpAddress = DeviceInfo.getIpAddressSync();
       deviceJSON.MacAddress = DeviceInfo.getMacAddressSync(); // needs android.permission.ACCESS_WIFI_STATE
       deviceJSON.phoneNumber = DeviceInfo.getPhoneNumberSync(); // needs android.permission.READ_PHONE_STATE
       deviceJSON.ApiLevel = DeviceInfo.getApiLevelSync();
       deviceJSON.carrier = DeviceInfo.getCarrierSync();
       deviceJSON.totalMemory = DeviceInfo.getTotalMemorySync();
       deviceJSON.maxMemory = DeviceInfo.getMaxMemorySync();
       deviceJSON.totalDiskCapacity = DeviceInfo.getTotalDiskCapacitySync();
       deviceJSON.freeDiskStorage = DeviceInfo.getFreeDiskStorageSync();
       deviceJSON.batteryLevel = DeviceInfo.getBatteryLevelSync();
       deviceJSON.isLandscape = DeviceInfo.isLandscapeSync();
       deviceJSON.isAirplaneMode = DeviceInfo.isAirplaneModeSync();
       deviceJSON.isBatteryCharging = DeviceInfo.isBatteryChargingSync();
       deviceJSON.isPinOrFingerprintSet = DeviceInfo.isPinOrFingerprintSetSync();
       deviceJSON.supportedAbis = DeviceInfo.supportedAbisSync();
       deviceJSON.hasSystemFeature = DeviceInfo.hasSystemFeatureSync(
         'android.software.webview',
       );
       deviceJSON.getSystemAvailableFeatures = DeviceInfo.getSystemAvailableFeaturesSync();
       deviceJSON.powerState = DeviceInfo.getPowerStateSync();
       deviceJSON.isLocationEnabled = DeviceInfo.isLocationEnabledSync();
       deviceJSON.headphones = DeviceInfo.isHeadphonesConnectedSync();
       deviceJSON.getAvailableLocationProviders = DeviceInfo.getAvailableLocationProvidersSync();
       deviceJSON.bootloader = DeviceInfo.getBootloaderSync();
       deviceJSON.device = DeviceInfo.getDeviceSync();
       deviceJSON.display = DeviceInfo.getDisplaySync();
       deviceJSON.fingerprint = DeviceInfo.getFingerprintSync();
       deviceJSON.hardware = DeviceInfo.getHardwareSync();
       deviceJSON.host = DeviceInfo.getHostSync();
       deviceJSON.product = DeviceInfo.getProductSync();
       deviceJSON.tags = DeviceInfo.getTagsSync();
       deviceJSON.type = DeviceInfo.getTypeSync();
       deviceJSON.baseOS = DeviceInfo.getBaseOsSync();
       deviceJSON.previewSdkInt = DeviceInfo.getPreviewSdkIntSync();
       deviceJSON.securityPatch = DeviceInfo.getSecurityPatchSync();
       deviceJSON.codename = DeviceInfo.getCodenameSync();
       deviceJSON.incremental = DeviceInfo.getIncrementalSync();
       deviceJSON.supported32BitAbis = DeviceInfo.supported32BitAbisSync();
       deviceJSON.supported64BitAbis = DeviceInfo.supported64BitAbisSync();

       return deviceJSON;
 }
