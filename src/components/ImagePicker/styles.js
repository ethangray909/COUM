import { StyleSheet } from 'react-native';
import vw from '../../Units/vw';
import vh from '../../Units/vh';
const styles = StyleSheet.create({
  modalTouchable: {
    backgroundColor: 'rgba(0,0,0,.5)',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: vh * 100,
    width: vw * 100,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 3 * vw,
    paddingTop: vh * 2,
    paddingBottom: vh * 4,
    alignItems: 'center',
    paddingHorizontal: vw * 8,
  },
  check: { width: vw * 15, height: vh * 5, marginBottom: vh * 1 },
  title: { fontSize: vw * 5, marginVertical: vh * 1 },
  Message: {
    color: '#333333',
    fontSize: vh * 1.8,
    width: '80%',
    alignSelf: 'flex-start',
    marginVertical: vh * 2,
  },
  redirect: { fontSize: vw * 3.5, marginTop: vh * 3 },
  login: {
    fontSize: vw * 3.5,
    textDecorationLine: 'underline',
    color: '#00AF41',
  },
  BtnContainer: { marginTop: vh * 3, width: '50%' },
  cross: { width: vh * 3, height: vh * 3 },
  imageBg: {
    backgroundColor: 'white',
    borderTopRightRadius: 7 * vw,
    borderTopLeftRadius: 7 * vw,
    position: 'absolute',

    paddingBottom: vh * 4,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },

    bottom: 0,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 30 * vh,
    width: 100 * vw,
    // minHeight:vh*20,
  },

  facebooktext: {
    fontSize: vh * 1.7,
    textAlign: 'center',

    color: '#333333',
  },
  crossContainer: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    paddingTop: vh * 2,
    paddingRight: vh * 2,
  },
  // cross:{
  //   width: vw * 3,

  // },
  container: {
    paddingHorizontal: vw * 6,
    marginTop: 2 * vh,
  },
  checkMark: { width: vw * 10, height: vh * 5 },
  text: {
    fontSize: vh * 2.3,
    width: '95%',

    color: '#000000',
  },
  btnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vh * 2,
    width: '80%',
  },
  yesBtn: { backgroundColor: '#FF4343', width: '48%' },
  noBtn: {
    width: 45 * vw,
    backgroundColor: '#000000',
    color: '#92278F',

    height: vh * 5.7,
    marginTop: 2 * vh,
  },
  request: { backgroundColor: '#92278F', width: '45%', marginTop: vh * 2 },
  feedback: { color: '#333333', fontSize: vh * 2.5 },
  description: {
    color: '#999999',
    fontSize: vh * 1.8,
    marginTop: vh * 1,
    marginBottom: vh * 0.8,
  },
  txtArea: {
    width: '100%',
    borderRadius: vw * 1,
    height: vh * 15,
    marginBottom: vh * 1,
    borderColor: '#E6E6E6',
  },
  field: { width: '100%', marginBottom: vh * 1, borderColor: '#E6E6E6' },
  btn: {
    width: '40%',
    height: vh * 5.5,
    alignSelf: 'flex-end',
    marginTop: vh * 1,
  },
});

export default styles