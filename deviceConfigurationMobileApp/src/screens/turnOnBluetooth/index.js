import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Linking,
  Platform,
  Animated,
  TouchableOpacity,
} from 'react-native';

import styles from './styles';
import Utils from '../../utils';
import Lottie from 'lottie-react-native';
import { ManageSchool } from '../../components';
import { Mixins } from '../../config/styles';
import { MagnifyingGlass, QRCode } from '../../config/imageConstants';
import { useDispatch, useSelector } from 'react-redux';
import BleManager from '../../config/bleManagerInstance';
import { translate } from '../../translations/translationHelper';
import { startDeviceScanOnBtTurnOn } from '../../services/turnOnBluetooth/action';
const animatedImageSource = require('../../assets/images/Waves.jpg');
const source = require('../../assets/lottiejson/SearchingDevice.json');
const bluetoothIcon = require('../../assets/images/BluetoothIcon.png');

const TurnOnBluetooth = props => {
  let timeout;
  const { navigation } = props;
  const dispatch = useDispatch();
  const waveLottieRef = React.createRef();
  const [fadeAnim] = useState(new Animated.Value(0));
  const { bluetoothState, appState } = useSelector(state => state.app);
  const { bluetoothDevices } = useSelector(state => state.ble);
  const { connectedDevice } = useSelector(state => state.authDevices);
  const [textfade, setTextfade] = useState(new Animated.Value(0));
  const [animatedY, setAnimatedY] = useState(new Animated.Value(0));
  const [bottomViewfade, setBottomViewfade] = useState(new Animated.Value(1));

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  /**
   * function to start sliding down animation on turnon bluetooth screen
   */
  const startAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }).start(),
      Animated.timing(bottomViewfade, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }).start(),
      Animated.timing(textfade, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }).start(),
      Animated.timing(animatedY, {
        toValue:
          Platform.OS === 'ios' ? Mixins.scaleSize(450) : Mixins.scaleSize(460),
        duration: 2000,
        useNativeDriver: true,
      }).start(),
    ]).start(() =>
      setTimeout(() => {
        dispatch(
          startDeviceScanOnBtTurnOn(navigation, () => {
            clearTimeout(timeout);
          }),
        );
      }, 3000),
    );
  };

  useEffect(() => {
    if (connectedDevice && connectedDevice?.id) {
      const disconnect = async () => {
        try {
          const connected = await BleManager.isDeviceConnected(
            connectedDevice.id,
          );
          if (connected) {
            await BleManager.cancelDeviceConnection(connectedDevice.id);
          }
        } catch (error) {
          Utils.Log(
            Utils.logType.log,
            'error in cancel device connection in turnonBT',
            error,
          );
        }
      };
      disconnect();
    }
    return () => {
      BleManager.stopDeviceScan();
    };
  }, []);

  useEffect(() => {
    if (appState === 'active') {
      waveLottieRef.current.play();
    }
  }, [appState]);

  useEffect(() => {
    if (bluetoothState === 'PoweredOn') {
      setAnimatedY(
        Platform.OS === 'ios' ? Mixins.scaleSize(450) : Mixins.scaleSize(460),
      );
      setTextfade(1);
      setBottomViewfade(0);
      startAnimation();
    }
  }, []);

  useEffect(() => {
    if (bluetoothState === 'PoweredOn') {
      startAnimation();
    }
  }, [bluetoothState]);

  useEffect(() => {
    if (bluetoothState === 'PoweredOn') {
      timeout = setTimeout(() => {
        bluetoothDevices.length === 0 &&
          navigation.replace('BluetoothDevicesList');
        BleManager.stopDeviceScan();
      }, Utils.timeoutDuration);
    }
  }, [bluetoothDevices, bluetoothState]);

  /**
   * function to handle TurnOn Bluetooth action
   */
  const turnOnBluetooth = () => {
    if (bluetoothState !== 'PoweredOn') {
      Utils.isIOS
        ? Linking.openURL('App-Prefs:Bluetooth')
        : BleManager.enable();
    }
  };

  return (
    <View style={styles.containerStyle}>
      <Animated.Image
        source={animatedImageSource}
        resizeMode="stretch"
        style={[
          styles.waveImage,
          {
            transform: [
              {
                translateY: animatedY,
              },
            ],
          },
        ]}
      />
      <AnimatedTouchable
        onPress={() => navigation.navigate('CodeScanner')}
        hitSlop={{ top: 10, left: 20, bottom: 20, right: 10 }}
        style={[styles.qrcode, { opacity: bottomViewfade }]}>
        <QRCode
          width={Mixins.scaleSize(24)}
          height={Mixins.scaleSize(24)}
        />
      </AnimatedTouchable>
      <View testID="lottieWave" style={styles.circularWaveContainer}>
        {
          <Animated.View
            style={[styles.circularWaveStyle, { opacity: fadeAnim }]}>
            <Lottie
              testID="wavelottie"
              ref={waveLottieRef}
              source={source}
              autoPlay
              resizeMode={'cover'}
              style={{ width: '100%', height: '100%' }}
            />

          </Animated.View>
        }
        <TouchableOpacity
          style={styles.bluetoothButton}
          onPress={turnOnBluetooth}
          activeOpacity={0.8}>
          <MagnifyingGlass />
        </TouchableOpacity>
      </View>

      <Animated.Text style={[styles.searchingForText, { opacity: textfade }]}>
        {translate('searchingForNearby')}
      </Animated.Text>
      <Animated.View
        style={{
          opacity: bottomViewfade,
          marginTop:
            Utils.isIpad || Utils.tablet
              ? Mixins.scaleSize(-100)
              : Utils.isIphone8()
                ? Mixins.scaleSize(13)
                : Mixins.scaleSize(43),
        }}>
        <Text style={styles.turnOnBluetoothText}>
          {translate('turnOnYour')}
        </Text>
        <TouchableOpacity
          testID="turnOnButton"
          style={styles.turnOnButton}
          onPress={turnOnBluetooth}>
          <Text style={styles.turnOnTitle}>{translate('turnOn')}</Text>
        </TouchableOpacity>
      </Animated.View>
      {bluetoothState !== 'PoweredOn' && (
        <ManageSchool
          navigation={navigation}
          extraStyles={{ opacity: bottomViewfade }}
        />
      )}
    </View>
  );
};

export default TurnOnBluetooth;
