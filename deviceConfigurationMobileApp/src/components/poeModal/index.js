import {Modal} from 'react-native';
import React from 'react';
import ErrorWindow from '../errorWindow';
import {translate} from '../../translations/translationHelper';
import {
  togglePoeOverride,
  updateAppModalFields,
} from '../../services/app/action';
import {useDispatch, useSelector} from 'react-redux';
import CustomLoader from '../customLoader';
import { updateBleDevicesFields } from '../../services/bleDevices/action';
export default function POEModal({navigation}) {
  const {showPoeModal} = useSelector(state => state.app);
  const dispatch = useDispatch();
  return (
    <Modal
      visible={showPoeModal}
      transparent={true}
      hideModal={() => {}}
      backdrop={true}>
      <ErrorWindow
        showGraphics={false}
        errorTitle={translate('thisWillReboot')}
        button1Action={() => {
          dispatch(updateAppModalFields('showDisconnectedModal', false));
          dispatch(updateAppModalFields('showPoeModal', false));
          dispatch(
            togglePoeOverride(() => {
              dispatch(updateBleDevicesFields('bluetoothDevices', []));
              navigation.navigate('BluetoothDevicesList')
            }),
          );
        }}
        button2Action={() => {
          dispatch(updateAppModalFields('showPoeModal', false));
        }}
        button1Title={translate('ok')}
        button2Title={translate('cancel')}
      />
      <CustomLoader />
    </Modal>
  );
}

