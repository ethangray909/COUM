import database from '@react-native-firebase/database';

function checkIsImage(url) {
  let type = ['jpg','jpeg','tiff','png','gif','bmp'];
  let extension = url.split('.').pop();
  if(type.indexOf(extension.toLowerCase()) !== -1) {
    return true;
  }
  return false;
}

export const SendMessage = async (currentUId, guestUId, msgValue,imgSource) => {
  try {
    let message = {
      text: msgValue,
      image: "",
      video: "",
      createdAt: `${new Date()}`,
      sender: currentUId,
      reciever: guestUId,
    }
    if (checkIsImage(imgSource)) {
      message.image = imgSource;
    }else {
      message.video = imgSource;
    }
    return await database()
      .ref('messages/' + currentUId)
      .child(guestUId)
      .child('messages')
      .push({
          messege: message,
      })
  } catch (error) {
      return error;
  }
}

export const RecieveMessage = async (currentUId, guestUId, msgValue, imgSource) => {
    try {
      let message = {
        text: msgValue,
        image: "",
        video: "",
        createdAt: `${new Date()}`,
        sender: currentUId,
        reciever: guestUId,
      }
      if (checkIsImage(imgSource)) {
        message.image = imgSource;
      }else {
        message.video = imgSource;
      }
      return await database()
          .ref('messages/' + guestUId)
          .child(currentUId)
          .child('messages')
          .push({
              messege: message,
          })
    } catch (error) {
        return error;
    }
}

export function userActive(userId, value) {
   return database()
    .ref('messages/' + userId)
    .update({
        active: value,
    });
}
