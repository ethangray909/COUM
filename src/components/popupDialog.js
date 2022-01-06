import React, { Component } from 'react'
import {
    Modal,
    View,
    ViewPropTypes,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Text,
    Platform,
} from 'react-native'
import PropTypes from 'prop-types';
import useGlobalStyles from '../styles/Styles';

let margin = 20;

function PopupDialog(props){
  const { onCancel, onOk, visible, onTouchOutside, title, description, okButtonText, calcelButtonText, enableOkButton, enableCancelButton, isDark } = props || {};
  const styles = useGlobalStyles();

  function isValidFunction(func) {
    return func && typeof func === 'function';
  }

  function onCancelClick(){
    console.log('onCancel Called');
    //this.props.onCancel();
    isValidFunction(onCancel) && onCancel();
  }

  function onOkClick(){
    console.log('onOk Called');
    //this.props.onOk();
    isValidFunction(onOk) && onOk();
  }

  function _renderOutsideTouchable(onTouch) {
      const view = <View style={{ flex: 1, width: '100%' }} />

      if (!onTouch) return view;

      return (
          <TouchableWithoutFeedback onPress={onTouch} style={{ flex: 1, width: '100%' }}>
              {view}
          </TouchableWithoutFeedback>
      )
  }

  return(
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}>

        <View style={{flex: 1 , backgroundColor: '#04040FB3', padding: 24}}>
          {_renderOutsideTouchable(onTouchOutside)}
            <View style={{
              backgroundColor: isDark ? '#000000' : '#FFFFFF',
            }}>

            <View style={{alignSelf: 'stretch', padding: 0, marginBottom: 30}}>
              <Text style={styles.popup_title}>
                {title}
              </Text>
              <View style={{width: '100%', backgroundColor: 'rgba(4, 4, 16, 0.67)', height: 0.5, opacity: 0.3, marginTop: 5}} />
              {description != '' &&
                <Text style={styles.popup_description}>
                  {description}
                </Text>
              }
              {props.children}
              <View style={styles.popup_button_view}>
                {enableCancelButton &&
                  <TouchableOpacity onPress={()=> onCancelClick()} style={styles.popup_cancel_button}>
                    <Text style={[styles.popup_button_text, {color: '#1B1B1B'}]}>
                      {calcelButtonText}
                    </Text>
                  </TouchableOpacity>
                }
                {enableOkButton &&
                  <TouchableOpacity onPress={()=> onOk()} style={styles.popup_yes_button}>
                    <Text style={[styles.popup_button_text, {color: '#000000'}]}>
                      {okButtonText}
                    </Text>
                  </TouchableOpacity>
                }
              </View>
            </View>

            </View>
          {_renderOutsideTouchable(onTouchOutside)}
        </View>
      </Modal>
    );
}

PopupDialog.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  okButtonText:PropTypes.string,
  calcelButtonText:PropTypes.string,
  enableOkButton:PropTypes.bool,
  enableCancelButton:PropTypes.bool,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  onTouchOutside: PropTypes.func,
  visible: PropTypes.bool,
  isDark: PropTypes.bool,
};

PopupDialog.defaultProps = {
  title: '',
  description: '',
  okButtonText:'Upload',
  calcelButtonText:'Cancel',
  enableOkButton:true,
  enableCancelButton:true,
  visible: false,
  isDark: true,
  onCancel: () => {},
  onOk: () => {},
};

export default PopupDialog;
