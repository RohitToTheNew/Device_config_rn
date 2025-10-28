import React, { useEffect } from 'react';
import { View, StatusBar, Platform } from 'react-native';

import styles from './styles';
import Utils from '../../utils';
import Lottie from 'lottie-react-native';
import { useSelector } from 'react-redux';
import BleManager from '../../config/bleManagerInstance';
import {
  checkLocationPermission,
  showExitAlert,
} from '../../services/splash/action';

import {
  checkMultiple,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
const Splash = props => {
  const { navigation } = props;
  const source =
    Utils.isIOS && Utils.isIpad
      ? require('../../assets/lottiejson/iPad.json')
      : Utils.isIOS
        ? require('../../assets/lottiejson/Device_Config_iOS_Splash.json')
        : Utils.tablet && Utils.isAndroid
          ? require('../../assets/lottiejson/iPad.json')
          : require('../../assets/lottiejson/Device_Config_iOS_Splash.json');

  const { bluetoothState } = useSelector(state => state.app);

  const onAnimationFinished = async () => {
    if (Utils.isAndroid) {
      const version = Platform.constants.Release;
      if (version > 11) {
        const permissionState = await checkMultiple([
          PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
          PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        ]);
        if (permissionState['android.permission.BLUETOOTH_CONNECT'] === RESULTS.GRANTED && permissionState['android.permission.BLUETOOTH_SCAN'] === RESULTS.GRANTED) {
          BleManager.enable();
        } else {
          const response = await requestMultiple([
            PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
            PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
          ]);
          if (response['android.permission.BLUETOOTH_CONNECT'] === RESULTS.GRANTED && response['android.permission.BLUETOOTH_SCAN'] === RESULTS.GRANTED) {
            BleManager.enable();
          } else {
            showExitAlert();
          }
        }
      } else {
        BleManager.enable();
      }
      checkLocationPermission(navigation);
    } else {
      navigation.navigate('TurnOnBluetooth');
    }
  };

  return (
    <View style={styles.containerStyle}>
      <StatusBar
        backgroundColor={'transparent'}
        translucent={true}
        barStyle={'dark-content'}
      />
      <Lottie
        testID="lottie"
        onAnimationFinish={onAnimationFinished}
        resizeMode="cover"
        source={source}
        autoPlay
        loop={false}
        style={{ width: '100%', height: '100%' }}
      />
    </View>
  );
};

export default Splash;
