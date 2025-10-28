import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
  BackHandler,
} from 'react-native';

import styles from './styles';
import Utils from '../../utils';
import { QRCodeBlue, RefreshIcon } from '../../config/imageConstants';
import DeviceItem from './deviceItem';
import {
  performAuthProcess,
  startDeviceScan,
  updateBleDevicesFields,
} from '../../services/bleDevices/action';
import { Mixins } from '../../config/styles';
import { ManageSchoolHeaderButton, RefreshComponent } from '../../components';
import { useSelector, useDispatch } from 'react-redux';
import { Header } from '../../components';
import { translate } from '../../translations/translationHelper';
import DisconnectionModal from '../../components/disconnectionModal';
import { updateAppModalFields } from '../../services/app/action';
import { identifyDeviceFromList } from '../../services/bleDevices/action';
import { useIsFocused } from '@react-navigation/native';
import deviceType from '../../config/deviceType';
const noDeviceBG = require('../../assets/images/NoDevicesPlaceholder.png');

const BluetoothDevicesList = props => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const [isScanning, setIsScanning] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { bluetoothDevices } = useSelector(state => state.ble);
  const { bluetoothState } = useSelector(state => state.app);
  const isFocused = useIsFocused();
  let spinValue = new Animated.Value(0);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  /**
   * handle refresh devices action from header
   */
  const handleRefresh = () => {
    dispatch(updateBleDevicesFields('bluetoothDevices', []));
    setIsRefreshing(true);
    setIsScanning(true);
    setTimeout(() => {
      dispatch(
        startDeviceScan(() => {
          setIsRefreshing(false);
          setIsScanning(false);
        }),
      );
    }, 1000);
  };

  useEffect(() => {
    dispatch(startDeviceScan(() => { }));
  }, [isFocused]);
  /**
   * function to handle the hardware back button action
   */
  const handleHardwareBackButton = () => {
    BackHandler.exitApp();
    return true;
  };

  useEffect(() => {
    if (isFocused) {
      BackHandler.addEventListener(
        'hardwareBackPress',
        handleHardwareBackButton,
      );
    } else {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleHardwareBackButton,
      );
    }
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleHardwareBackButton,
      );
    };
  }, [Utils.isAndroid, isFocused]);

  /**
   * function to handle the device pressed action
   * @param {object} devicePressed object containing the data of device pressed from devices list
   */
  const onDevicePress = devicePressed => {
    if (bluetoothState === 'PoweredOn') {
      dispatch(performAuthProcess(devicePressed, navigation, args => { }));
    } else {
      dispatch(updateAppModalFields('bluetoothState', 'PoweredOff'));
    }
  };

  /**
   * function to handle the QR Code button action
   */
  const handleQRCodePress = () => {
    navigation.navigate('CodeScanner');
  };
  /**
   * function to handle the identify device action
   * @param {object} devicePressed object containing the data of device pressed from devices list
   */
  const onIdentifyPress = devicePressed => {
    if (bluetoothState === 'PoweredOn') {
      dispatch(identifyDeviceFromList(devicePressed, navigation));
    } else {
      dispatch(updateAppModalFields('bluetoothState', 'PoweredOff'));
    }
  };

  /**
   *
   * @param {object} rowData object containing flatlist item's data
   * @returns component to be rendered as list item
   */
  const renderBluetoothDevice = rowData => {
    const { index, item } = rowData;
    if (!isScanning) {
      setIsScanning(true);
    }
    return (
      <DeviceItem
        item={item}
        index={index}
        onDevicePress={onDevicePress}
        onIdentifyPress={onIdentifyPress}
      />
    );
  };

  /**
   * function to render NoDevicesComponent
   */
  const renderNoDevicesComponent = () => {
    return (
      <View
        testID="noDevicesComponent"
        style={styles.noDeviceComponentContainer}>
        <Image
          style={{
            width: Mixins.scaleSize(165),
            height: Mixins.scaleSize(171.6),
          }}
          source={noDeviceBG}
        />
        <Text style={styles.noNearbyDevices}>
          {translate('noNearbyDevices')}
        </Text>
        <Text style={styles.pleaseMakeSure}>{translate('pleaseMakeSure')}</Text>
        <Text onPress={handleRefresh} style={styles.tryAgain}>
          {translate('tryAgain')}
        </Text>
      </View>
    );
  };
  /**
   * function to render buttons in header right
   */
  const headerRightButtons = () => {
    return (
      <View style={styles.headerButtonContainer}>
        <ManageSchoolHeaderButton navigation={navigation} />
        <TouchableOpacity testID="refreshButton" onPress={handleQRCodePress}>
          <QRCodeBlue
            width={Mixins.scaleSize(24)}
            height={Mixins.scaleSize(24)}
          />
        </TouchableOpacity>
        {isRefreshing ? (
          <RefreshComponent testID={'refreshComponent'} />
        ) : (
          <TouchableOpacity style={styles.refresh} onPress={handleRefresh}>
            <RefreshIcon
              width={Mixins.scaleSize(24)}
              height={Mixins.scaleSize(24)}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };
  return (
    <View style={styles.containerStyle}>
      <Header
        showBackButton={false}
        navigation={navigation}
        headerTitle={translate('nearbyDevices')}
        headerRightButtons={headerRightButtons}
      />
      {!isRefreshing && (
        <FlatList
          testID="devicesList"
          bounces={false}
          keyExtractor={(item, index) => index}
          data={bluetoothDevices}
          style={styles.listStyle}
          renderItem={renderBluetoothDevice}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderNoDevicesComponent}
          contentContainerStyle={styles.contentContainerStyle}
        />
      )}
      <DisconnectionModal
        navigation={navigation}
        showDeviceDisconnected={false}
        hideSecondaryButton={true}
      />
    </View>
  );
};
export default BluetoothDevicesList;
