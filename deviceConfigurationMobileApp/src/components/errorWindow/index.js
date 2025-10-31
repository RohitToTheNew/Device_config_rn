import { View, TouchableOpacity, Text, Image } from 'react-native';
import React from 'react';

import styles from './styles';
import CustomButton from '../customButton';
import { Colors } from '../../config/styles';
import { translate } from '../../translations/translationHelper';
const deviceDisconnectedGraphic = require('../../assets/images/DeviceDisconnected.png')

export default function ErrorWindow({
  backdrop,
  hideModal,
  errorTitle,
  errorTitleColor,
  button1Title,
  button2Title,
  button1Action,
  button2Action,
  hideButton2,
  showGraphics,
  testId,
  button1Style,
  isRedAlert,
}) {
  return (
    <TouchableOpacity
      disabled={backdrop ? false : true}
      activeOpacity={1}
      onPress={hideModal}
      style={styles.centeredView}>
      <TouchableOpacity
        onPress={() => { }}
        activeOpacity={1}
        style={styles.modalView}>
        <View style={styles.titleView}>
          {showGraphics && (
            <>
              <Image source={deviceDisconnectedGraphic} style={styles.disconnectedImage} />
              <Text style={styles.disconnectedHeader} >{translate('deviceDisconnected')}</Text>
            </>
          )}
          <Text style={[styles.titleStyle, { color: errorTitleColor ? errorTitleColor : Colors.COLOR_484949 }]}>
            {errorTitle || translate('somethingWentWrong')}
          </Text>
          <CustomButton
            testID={testId || 'retryBtnOnPopup'}
            buttonText={button1Title || translate('tryAgain')}
            containerStyle={button1Style ? button1Style : styles.button1Style}
            onPress={button1Action}
            isRedAlert={isRedAlert}
            button1Style={button1Style}
          />
          {!hideButton2 && (
            <TouchableOpacity
              testID="closeBtnOnPopup"
              onPress={button2Action}
              style={styles.button2Container}>
              <Text style={styles.button2Title}>
                {button2Title || translate('exit')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
