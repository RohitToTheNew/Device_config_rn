import React, {useEffect, useState} from 'react';
import {Modal, Linking} from 'react-native';

import Utils from '../../utils';
import ErrorWindow from '../errorWindow';
import CustomLoader from '../customLoader';
import {useDispatch, useSelector} from 'react-redux';
import BleManager from '../../config/bleManagerInstance';
import {loginWithPin} from '../../services/bleDevices/action';
import {translate} from '../../translations/translationHelper';
import {updateAppModalFields} from '../../services/app/action';
import Toast from 'react-native-toast-message';

export default function DisconnectionModal(props) {
  const {navigation, showDeviceDisconnected, hideSecondaryButton} = props;
  const dispatch = useDispatch();

  const {connectedDevice, authenticatedDevices} = useSelector(
    state => state.authDevices,
  );
  const {bluetoothState, showDisconnectedModal, showPoeModal} = useSelector(
    state => state.app,
  );

  function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => ++value);
  }

  const forceUpdate = useForceUpdate();

  useEffect(() => {
    dispatch(updateAppModalFields('showModal', false));
    forceUpdate();
  }, [bluetoothState, showDisconnectedModal]);

  /**
   * function to perform GoTo Home action
   */
  const goHomeAction = () => {
    if (navigation.canGoBack()) {
      navigation.navigate('BluetoothDevicesList');
    }
    dispatch(updateAppModalFields('bluetoothState', 'PoweredOn'));
  };

  /**
   * function to perfrom TurnOn Bluetooth action
   */
  const turnOnAction = () => {
    if (Utils.isAndroid) {
      BleManager.enable();
    } else {
      Linking.openURL('App-Prefs:Bluetooth');
    }
    dispatch(updateAppModalFields('showDisconnectedModal', true));
  };

  /**
   * function to handle the close action from modal
   */
  const closeAction = () => {
    dispatch(updateAppModalFields('showDisconnectedModal', false));
  };

  /**
   * function to perform tryAgain action from modal
   */
  const tryAgainAction = async () => {
    dispatch(updateAppModalFields('isLoading', true));
    dispatch(updateAppModalFields('bleDisconnected', false));
    try {
      const index = authenticatedDevices.findIndex(
        element => element.id === connectedDevice.id,
      );
      const authResult = await loginWithPin(
        {id: connectedDevice.id},
        Utils.decrypt(authenticatedDevices[index].pin),
        dispatch,
      );
      dispatch(updateAppModalFields('isLoading', false));
      if (authResult == 'true') {
        dispatch(updateAppModalFields('bleDisconnected', false));
        dispatch(updateAppModalFields('showDisconnectedModal', false));
      } else {
        dispatch(updateAppModalFields('bleDisconnected', true));
      }
    } catch (error) {
      dispatch(updateAppModalFields('isLoading', true));
    }
  };

  return (
    <Modal
      visible={
        bluetoothState !== 'PoweredOn' ||
        (showDisconnectedModal && showDeviceDisconnected && !showPoeModal)
      }
      transparent={true}
      hideModal={() => {}}
      backdrop={true}>
      {bluetoothState !== 'PoweredOn' ? (
        <ErrorWindow
          showGraphics={true}
          errorTitle={translate('turnOnYourBluetooth')}
          button1Action={turnOnAction}
          button2Action={goHomeAction}
          button1Title={translate('turnOn')}
          button2Title={translate('goToHome')}
          hideButton2={hideSecondaryButton}
        />
      ) : (
        <>
          <ErrorWindow
            showGraphics={true}
            errorTitle={translate('pleaseMakeSure')}
            button1Action={tryAgainAction}
            button2Action={closeAction}
            button1Title={translate('tryAgain')}
            button2Title={translate('close')}
          />
          <CustomLoader />
          <Toast />
        </>
      )}
    </Modal>
  );
}
