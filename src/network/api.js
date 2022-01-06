import { Alert } from 'react-native';
const axios = require('axios');
import Snackbar from 'react-native-snackbar';
const CONSTANTS = require('../global/constants.js')
const FUNCTIONS = require('../global/functions.js')

export function callRegisterationApi(url, params) {

  let formBody = [];
  for (let property in params) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(params[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  console.log('Url : ', url);
  console.log("Request params: " + JSON.stringify(params));

  return fetch(url, {
    method: 'POST',
    headers: new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', // <-- Specifying the Content-Type
    }),
    body: formBody
  })
    .then((response) => response.json())
    .then((responseData) => {

      if (responseData.error == 2) {
        let arrayKeys = []
        let str = ""
        let dict = responseData.validation

        Object.values(dict).map((value) => {
          console.log("values: " + JSON.stringify(value.message));
          str = str + "\n- " + value.message;
        })

        Alert.alert(CONSTANTS.APP_NAME, responseData.message + "\n" + str)
      }
      return responseData;
    })
    .catch((error) => {
      console.error(error);
    });
}

export function callUpdateUser(url, params) {

  const formData = new FormData()
  Object.keys(params).forEach((key) => {
    formData.append(key, params[key])
  })
  console.log('Url : ', url);

  return axios.put(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + CONSTANTS.ACCESS_TOKEN,
    },
  })
    .then((response) => {
      console.log('Update User : ', response);
      return response.data;
    })
    .catch((error) => {
      console.log('Update User Error : ', error);
      return { error: 1, message: 'Update User Error: ', error }
    });

}

export function callUserApi(url, params, parent, type = 'POST') {
  console.log('callUserApi api call');
  let formBody = [];
  for (let property in params) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(params[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  console.log("Url Params : " + url);
  console.log("Request params: " + JSON.stringify(params) + "\ntoken: " + CONSTANTS.ACCESS_TOKEN);

  //const token = JSON.parse(CONSTANTS.ACCESS_TOKEN)
  let bearer = 'Bearer ' + CONSTANTS.ACCESS_TOKEN;
  console.log('bearer accessToken: ', bearer);
  let headerParams = {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    'Authorization': bearer,
  };
  if (CONSTANTS.ACCESS_TOKEN == null || CONSTANTS.ACCESS_TOKEN == 'null' || CONSTANTS.ACCESS_TOKEN == '') {
    headerParams = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  }
  //console.log('Header Params : ',JSON.stringify(headerParams));
  return fetch(url, {
    method: type,
    headers: new Headers(headerParams),
    body: formBody
  })
    .then((response) => response.json())
    .then((responseData) => {

      if (responseData.error == 1) {
        //Alert.alert(CONSTANTS.APP_NAME,  responseData.message)
      }
      else if (responseData.error == 2) {
        console.log("hpp: ", responseData);
        let str = ""
        if (responseData.hasOwnProperty('validation')) {
          let dict = responseData.validation

          Object.values(dict).map((value) => {
            console.log("values: " + JSON.stringify(value.message));
            str = str + "\n- " + value.message;
          });
        }
        Alert.alert(CONSTANTS.APP_NAME, responseData.message + "\n" + str)
      }
      else if (responseData.error == 3) {
        //parent.setState({ isUserValid : false });
        Snackbar.show({ text: responseData.message, duration: Snackbar.LENGTH_SHORT });
        // Alert.alert(
        //   CONSTANTS.APP_NAME,
        //   responseData.message,
        //   [
        //     {text: 'LOGIN', onPress: () => {
        //       FUNCTIONS.Logout();
        //       //const {navigate} = parent.props.navigation;
        //       navigation.navigate('Login');
        //     }},
        //     {text: 'CANCEL'},
        //   ],
        // );
      }
      return responseData;
    })
    .catch((error) => {
      Snackbar.show({ text: 'Something went wrong. Please try again', duration: Snackbar.LENGTH_SHORT });
      console.error(error);
    });
}

export function callUploadFile(url, params, images, coverImage, callback) {

  let formdata = new FormData();
  formdata.append("title", params.title);
  formdata.append("type", params.type);
  formdata.append("status", params.status);
  if (coverImage != null) {
    formdata.append("cover_image", { uri: coverImage.filepath, name: coverImage.filename, type: coverImage.filetype });
  }

  for (var i = 0; i < images.length; i++) {
    formdata.append("work" + i, { uri: images[i].filepath, name: images[i].filename, type: images[i].filetype });
  }
  console.log('Url : ', url);
  console.log('Body : ', JSON.stringify(formdata));

  let headers = {
    'Content-Type': 'multipart/form-data',
    'Authorization': 'Bearer ' + CONSTANTS.ACCESS_TOKEN,
  }

  return axios.post(url, formdata, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + CONSTANTS.ACCESS_TOKEN,
    },
    onUploadProgress: callback,
  })
    .then((response) => {
      console.log('Response : ', JSON.stringify(response));
      return response.data;
    })
    .catch((error) => {
      console.log('File Upload Error : ', error);
      return { error: 1, message: 'File Upload Error: ', error }
    });
}

export function callUploadUserImages(url, profileImage, coverPic) {
  console.log('Url: ', url);
  const formData = new FormData()

  if (profileImage != null) {
    formData.append("profile_image", { uri: profileImage.filepath, name: profileImage.filename, type: profileImage.filetype });
  }
  if (coverPic != null) {
    formData.append("cover_pic", { uri: coverPic.filepath, name: coverPic.filename, type: coverPic.filetype });
  }

  console.log('Url: ', url);

  let headerParams = {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
    'Authorization': 'Bearer ' + CONSTANTS.ACCESS_TOKEN,
  };

  return fetch(url, {
    method: 'PUT',
    headers: new Headers(headerParams),
    body: formData,
  })
    .then((responseData) => responseData.json())
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log('Add Service Error: ', error);
    })

}

export function callAddServices(url, serviceData, description, image) {
  console.log('Url: ', url);
  const formData = new FormData()
  //   Object.keys(params).forEach((key) => {
  //   formData.append(key, params[key])
  // });

  formData.append("service_desc", description);
  formData.append("service", JSON.stringify(serviceData));
  if (image != null) {
    formData.append("service_logo", { uri: image.filepath, name: image.filename, type: image.filetype });
  }

  console.log('Url: ', url);
  console.log('Params: ', JSON.stringify(serviceData));

  let headerParams = {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
    'Authorization': 'Bearer ' + CONSTANTS.ACCESS_TOKEN,
  };

  return fetch(url, {
    method: 'PUT',
    headers: new Headers(headerParams),
    body: formData,
  })
    .then((responseData) => responseData.json())
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log('Add Service Error: ', error);
    })

}

export function callChatUploadFile(url, file, uploadProgress) {
  let formdata = new FormData();
  formdata.append("file", { uri: file.filepath, name: file.filename, type: file.filetype });

  console.log('Url: ', url);
  console.log('Params: ', file);

  return axios.post(url, formdata, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + CONSTANTS.ACCESS_TOKEN,
    },
    onUploadProgress: uploadProgress,
  })
    .then((response) => {
      console.log('Response : ', JSON.stringify(response));
      return response.data;
    })
    .catch((error) => {
      console.log('File Upload Error : ', error);
      return { error: 1, message: 'File Upload Error: ', error }
    });
}
