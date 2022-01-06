'use strict';

import database from '@react-native-firebase/database';
import uuid from 'react-native-uuid';
const CONSTANTS = require('./constants.js');

let room="AudioRoom";
let participant = 'participant';
let speakers = 'speakers';

export function createRoom(roomName) {
  database()
    .ref(room)
    .push({
      //_id: uuid.v4(),
      channel_name: roomName,
      speakers: [],
      participants: [],
      host_id: CONSTANTS.USER._id,
      host_image: CONSTANTS.USER.profile_image,
      host_name: CONSTANTS.USER.user_name,
      status: 'active'
    }).
    then(()=> {
      return {error: 0, message: 'database create success'};
    });
}

export function addParticipant(key) {
  return database()
      .ref(room)
      .child(key)
      .child(participant)
      .push({
        user_id: CONSTANTS.USER._id,
        user_image: CONSTANTS.USER.profile_image,
        user_name: CONSTANTS.USER.user_name,
        status: 'active'
      })
      .then(()=> {
        return {error: 0, message: 'Add participant success'};
      });
}

export function getparticipant(key) {

}

export function removeParticipant(key) {
  database()
    .ref(room)
    .child(key)
    .child(participant)
    .child(CONSTANTS.USER._id)
    .update({
      status: 'inactive'
    })
    then(()=> {
      return {error: 0, message: 'remove participant success'};
    })
}

export function addSpeaker(key) {
  return database()
      .ref(room)
      .child(key)
      .child(speakers)
      .push({
        user_id: CONSTANTS.USER._id,
        user_image: CONSTANTS.USER.profile_image,
        user_name: CONSTANTS.USER.user_name,
        status: 'active'
      })
      .then(()=> {
        return {error: 0, message: 'Add participant success'};
      });
}

export function getSpeaker(key) {

}

export function removeSpeaker(key) {
  database()
    .ref(room)
    .child(key)
    .child(speakers)
    .child(CONSTANTS.USER._id)
    .update({
      status: 'inactive'
    })
    then(()=> {
      return {error: 0, message: 'remove speakers success'};
    })
}

export function getRoomList() {
  database()
    .ref(room)
    .on('value', (snapshot) => {
      if (dataSnapshot.val()) {
        console.log('dataSnapshot: ', snapshot.val());
      }
    });
}
