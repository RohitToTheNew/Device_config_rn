import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Modal } from 'react-native';
import styles from './styles';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { Mixins } from '../../config/styles';
import {
  CloseWondowLight,
  FlashlightOff,
  FlashlightOn,
} from '../../config/imageConstants';
import {
  actionHandleManualDetails,
  actionOnSuccess,
  actionHandleClose,
  actionHandleFlash,
  actionUseEffect,
} from './action';
import { translate } from '../../translations/translationHelper';
import { ErrorWindow } from '../../components';
import { Colors } from '../../config/styles';
import { useSelector } from 'react-redux';

export default function CodeScanner(props) {
  const { navigation } = props;

  const [flash, setFlash] = useState(RNCamera.Constants.FlashMode.off);
  const [invalidCode, setInvalidCode] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const { routeName } = useSelector(state => state.app);

  const handleManualDetail = actionHandleManualDetails(navigation);

  const onSuccess = e => actionOnSuccess(navigation, setInvalidCode, e);

  useEffect(() => {
    actionUseEffect();
  }, []);

  return (
    <View style={styles.containerStyle}>
      <View style={styles.topBtnContainer}>
        <TouchableOpacity
          testID="handleCloseBtn"
          onPress={actionHandleClose(navigation)}
          style={styles.closebtn}>
          <CloseWondowLight
            width={Mixins.scaleSize(40)}
            height={Mixins.scaleSize(40)}
          />
        </TouchableOpacity>
        <TouchableOpacity
          testID="handleFlashBtn"
          onPress={actionHandleFlash(isFlashOn, setFlash, setIsFlashOn)}
          style={styles.flashbtn}>
          {isFlashOn ? (
            <FlashlightOn
              testID="flashOn"
              width={Mixins.scaleSize(27)}
              height={Mixins.scaleSize(29)}
            />
          ) : (
            <FlashlightOff
              testID="flashOff"
              width={Mixins.scaleSize(23)}
              height={Mixins.scaleSize(24)}
            />
          )}
        </TouchableOpacity>
      </View>
      {routeName == 'CodeScanner' && <QRCodeScanner
        testID="handleScannerSuccess"
        onRead={onSuccess}
        flashMode={flash}
        cameraStyle={styles.cameraStyle}
        cameraContainerStyle={styles.cameraContainerStyle}
        containerStyle={styles.qrCameraContainerStyle}
        topContent={
          <View style={styles.qrCodeTopContent}>
            <Text style={styles.scanDeviceQrCode}>
              {translate('scanDeviceQRCode')}
            </Text>
          </View>
        }
        bottomContent={
          <View style={styles.qrCodeBottomContent}>
            <TouchableOpacity
              testID="handleManualDetailBtn"
              onPress={handleManualDetail}>
              <Text style={styles.enterCodeManual}>
                {translate('enterDetailsManually')}
              </Text>
            </TouchableOpacity>
          </View>
        }
      />}
      <Modal
        testID="invalidCodeModel"
        visible={invalidCode}
        transparent={true}
        hideModal={() => { }}
        backdrop={true}>
        <ErrorWindow
          errorTitle={translate('invalidCode')}
          errorTitleColor={Colors.COLOR_E53935}
          button1Title={translate('retry')}
          button2Title={translate('cancel')}
          button1Action={() => navigation.replace('CodeScanner')}
          button2Action={() => navigation.goBack()}
        />
      </Modal>
    </View>
  );
}
