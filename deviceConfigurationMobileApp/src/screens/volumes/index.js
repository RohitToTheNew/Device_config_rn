import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Modal, Linking } from 'react-native';

import styles from './styles';
import TopTabBar from './topTabBar';
import { Header } from '../../components';
import { Mixins } from '../../config/styles';
import { useDispatch, useSelector } from 'react-redux';
import { TripleDot } from '../../config/imageConstants';
import { updateAppModalFields } from '../../services/app/action';
import { getBypassEQSetting } from '../../services/volumes/action';
import DisconnectionModal from '../../components/disconnectionModal';
import POEModal from '../../components/poeModal';
import Utils from '../../utils';

export default function Volumes(props) {
  const { navigation } = props;
  const dispatch = useDispatch();
  const { connectedDevice } = useSelector(state => state.authDevices);
  const { bluetoothState } = useSelector(state => state.app);
  function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => ++value);
  }

  const forceUpdate = useForceUpdate();

  useEffect(() => {
    if (Utils.isMS700(connectedDevice.deviceType)) {
      dispatch(getBypassEQSetting());
    }
  }, []);

  useEffect(() => {
    dispatch(updateAppModalFields('showModal', false));
    forceUpdate();
  }, [bluetoothState]);

  /**
   * function to handle the triple dot menu button action
   */
  const onOptionsPress = () => {
    dispatch(updateAppModalFields('showModal', true));
  };


  const headerRightButtons = () => {
    return (
      <TouchableOpacity onPress={onOptionsPress}>
        <TripleDot width={Mixins.scaleSize(24)} height={Mixins.scaleSize(24)} />
      </TouchableOpacity>
    );
  };

  /**
   * function to reset passcode of BLE device
   */
  const handleResetPasscode = () => {
    navigation.navigate('SetPasscode', {
      isUpdateScreen: true,
      devicePressed: connectedDevice,
    });
    dispatch(updateAppModalFields('showModal', false));
  };

  return (
    <View style={styles.containerStyle}>
      <Header
        headerTitle={connectedDevice?.localName || 'Volumes'}
        showBackButton={true}
        headerRightButtons={headerRightButtons}
        navigation={navigation}
        handleResetPasscode={handleResetPasscode}
      />
      <TopTabBar />
      <DisconnectionModal
        navigation={navigation}
        showDeviceDisconnected={true}
      />
      <POEModal navigation={navigation} />
    </View>
  );
}
