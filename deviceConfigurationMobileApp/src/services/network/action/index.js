import Utils from '../../../utils';
import {UPDATE_NETWORK_SETTINGS} from '../constants';
import BleManager from '../../../config/bleManagerInstance';
import UUIDMappingInfoview from '../../../constants/uuidMapping-infoview';
import {Keyboard} from 'react-native';
import {btoa} from 'react-native-quick-base64';
import UUIDMappingMS700 from '../../../constants/uuidMapping-ms700';
import {translate} from '../../../translations/translationHelper';
import {sentryErrorHandler} from '../../../utils/errorHandler';
import {updateAppModalFields} from '../../app/action';

/**
 * function that updates values into the NETWORK settings reducer
 * @param {string} key name of the entity to be updated
 * @param {any} value value that is to be stored on the respective key
 */
export const updateNetworkSettingsFields = (key, value) => dispatch => {
  dispatch({
    type: UPDATE_NETWORK_SETTINGS,
    payload: {[key]: value},
  });
};

/**
 * a redux action that reads network settings from BLE and store values into network reducer for Infoview device
 */
export const getNetworkSettingsInfoView = () => {
  return async (dispatch, getState) => {
    const {connectedDevice} = getState().authDevices;
    try {
      const epicUrlValue = await BleManager.readCharacteristicForDevice(
        connectedDevice.id,
        UUIDMappingInfoview.rootServiceUDID,
        UUIDMappingInfoview.epicServerAddress,
      );
      const dhcpStatusValue = await BleManager.readCharacteristicForDevice(
        connectedDevice.id,
        UUIDMappingInfoview.rootServiceUDID,
        UUIDMappingInfoview.getDHCPStatus,
      );
      const ipAddressValue = await BleManager.readCharacteristicForDevice(
        connectedDevice.id,
        UUIDMappingInfoview.rootServiceUDID,
        UUIDMappingInfoview.ipAddress,
      );
      const subnetMaskValue = await BleManager.readCharacteristicForDevice(
        connectedDevice.id,
        UUIDMappingInfoview.rootServiceUDID,
        UUIDMappingInfoview.netMask,
      );
      const ipGatewayValue = await BleManager.readCharacteristicForDevice(
        connectedDevice.id,
        UUIDMappingInfoview.rootServiceUDID,
        UUIDMappingInfoview.ipGateway,
      );
      const dnsValue = await BleManager.readCharacteristicForDevice(
        connectedDevice.id,
        UUIDMappingInfoview.rootServiceUDID,
        UUIDMappingInfoview.dns,
      );
      if (Utils.decodeBase64(epicUrlValue.value) == '\u0000\u0000\u0000') {
        dispatch(updateNetworkSettingsFields('epicServerUrl', ''));
      } else {
        dispatch(
          updateNetworkSettingsFields(
            'epicServerUrl',
            Utils.decodeBase64(epicUrlValue.value),
          ),
        );
      }
      dispatch(
        updateNetworkSettingsFields(
          'dhcpStatus',
          Utils.decodeBase64(dhcpStatusValue.value) == 'true'
            ? 'dhcp'
            : 'static',
        ),
      );
      dispatch(
        updateNetworkSettingsFields(
          'ipAddress',
          Utils.decodeBase64(ipAddressValue.value),
        ),
      );
      dispatch(
        updateNetworkSettingsFields(
          'subnetMask',
          Utils.decodeBase64(subnetMaskValue.value),
        ),
      );
      dispatch(
        updateNetworkSettingsFields(
          'gateway',
          Utils.decodeBase64(ipGatewayValue.value),
        ),
      );
      if (Utils.IsJsonString(Utils.decodeBase64(dnsValue.value))) {
        if (Utils.decodeBase64(dnsValue.value) == '\u0000\u0000\u0000') {
          dispatch(updateNetworkSettingsFields('primaryDns', ''));
          dispatch(updateNetworkSettingsFields('secondaryDns', ''));
        } else {
          dispatch(
            updateNetworkSettingsFields(
              'primaryDns',
              JSON.parse(Utils.decodeBase64(dnsValue.value))[0],
            ),
          );
          dispatch(
            updateNetworkSettingsFields(
              'secondaryDns',
              JSON.parse(Utils.decodeBase64(dnsValue.value))[1],
            ),
          );
        }
      }
    } catch (error) {
      Utils.Log(Utils.logType.error, 'getNetworkSettingsInfoView', error);
      Utils.showToast(translate('unableToReadValuse'));
    }
  };
};

/**
 * a redux action that reads network settings from BLE and store values into network reducer for MS700 device
 */
export const getNetworkSettingsMS700 = () => {
  return async (dispatch, getState) => {
    const {connectedDevice} = getState().authDevices;
    try {
      const epicUrlValue = await BleManager.readCharacteristicForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.epicServerAddress,
      );
      const dhcpStatusValue = await BleManager.readCharacteristicForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.getDHCPStatus,
      );
      const ipAddressValue = await BleManager.readCharacteristicForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.ipAddress,
      );
      const subnetMaskValue = await BleManager.readCharacteristicForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.netMask,
      );
      const ipGatewayValue = await BleManager.readCharacteristicForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.ipGateway,
      );
      const dnsValue = await BleManager.readCharacteristicForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.dns,
      );
      const secondaryDnsValue = await BleManager.readCharacteristicForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.secondaryDns,
      );
      if (Utils.decodeBase64(epicUrlValue.value) == '\u0000\u0000\u0000') {
        dispatch(updateNetworkSettingsFields('epicServerUrl', ''));
      } else {
        dispatch(
          updateNetworkSettingsFields(
            'epicServerUrl',
            Utils.decodeBase64(epicUrlValue.value),
          ),
        );
      }
      dispatch(
        updateNetworkSettingsFields(
          'dhcpStatus',
          Utils.decodeBase64(dhcpStatusValue.value),
        ),
      );
      dispatch(
        updateNetworkSettingsFields(
          'ipAddress',
          Utils.decodeBase64(ipAddressValue.value),
        ),
      );
      dispatch(
        updateNetworkSettingsFields(
          'subnetMask',
          Utils.decodeBase64(subnetMaskValue.value),
        ),
      );
      dispatch(
        updateNetworkSettingsFields(
          'gateway',
          Utils.decodeBase64(ipGatewayValue.value),
        ),
      );
      if (Utils.decodeBase64(dnsValue.value) == '\u0000\u0000\u0000') {
        dispatch(updateNetworkSettingsFields('primaryDns', ''));
      } else {
        dispatch(
          updateNetworkSettingsFields(
            'primaryDns',
            Utils.decodeBase64(dnsValue.value),
          ),
        );
      }
      if (Utils.decodeBase64(secondaryDnsValue.value) == '\u0000\u0000\u0000') {
        dispatch(updateNetworkSettingsFields('secondaryDns', ''));
      } else {
        dispatch(
          updateNetworkSettingsFields(
            'secondaryDns',
            Utils.decodeBase64(secondaryDnsValue.value),
          ),
        );
      }
      if (Utils.decodeBase64(secondaryDnsValue.value) == '\u0000\u0000\u0000') {
        dispatch(updateNetworkSettingsFields('secondaryDns', ''));
      } else {
        dispatch(
          updateNetworkSettingsFields(
            'secondaryDns',
            Utils.decodeBase64(secondaryDnsValue.value),
          ),
        );
      }
    } catch (error) {
      sentryErrorHandler(error);
      Utils.Log(Utils.logType.error, 'getNetworkSettingsMS700', error);
      Utils.showToast(translate('somethingWentWrong'));
    }
  };
};

/**
 * function to check if secondary dns value is valid or not
 * @param {string} secondaryDns secondary dns field value
 * @returns returns weather secondary dns value is valid or not (in boolean)
 */
 const validateSecondaryDns = secondaryDns => {
  if (secondaryDns.length > 0 && !Utils.validateIP(secondaryDns)) {
    return false;
  }
  return true;
};

/**
 * redux action that saves network settings onto the BLE device for Infoview Device
 * @param {string} dhcpStatus indicates the network configuration selected via radio button
 * @param {string} ipAddress ip address field value to be saved
 * @param {string} subnetMask subnetMask field value to be saved
 * @param {string} gateway gateway field value to be saved
 * @param {string} primaryDns primaryDns field value to be saved
 * @param {string} secondaryDns secondaryDns field value to be saved
 * @param {string} epicServerUrl epicServerUrl field value to be saved
 * @param {function} validateFields function to validate the fields input by user before saving
 * @param {function} setServerUrlError seets server url error to be shown
 * @param {function} callback callback function that gets executed after settings are saved
 */
export const handleSaveSettingsInfoview = (
  dhcpStatus,
  ipAddress,
  subnetMask,
  gateway,
  primaryDns,
  secondaryDns,
  epicServerUrl,
  validateFields,
  setServerUrlError,
  callback,
) => {
  return async (dispatch, getState) => {
    const {connectedDevice} = getState().authDevices;
    Keyboard.dismiss();
    try {
      if (dhcpStatus === 'static') {
        const dnsArray = [primaryDns, secondaryDns];
        const stringifyDNSArray = JSON.stringify(dnsArray);
        const bytesArrayDNS = Utils.encodeToBytesArray(stringifyDNSArray);
        const dnsToSave = btoa(
          String.fromCharCode(...new Uint8Array(bytesArrayDNS)),
        );
        validateFields();
        if (
          Utils.validateIP(ipAddress) &&
          Utils.validateIP(subnetMask) &&
          Utils.validateIP(gateway) &&
          Utils.validateIP(primaryDns) &&
          epicServerUrl.length > 0 &&
          validateSecondaryDns(secondaryDns)
        ) {
          dispatch(updateAppModalFields('isLoading', true));
          await BleManager.writeCharacteristicWithResponseForDevice(
            connectedDevice.id,
            UUIDMappingInfoview.rootServiceUDID,
            UUIDMappingInfoview.getDHCPStatus,
            Utils.encodeBase64('false'),
          );
          await BleManager.writeCharacteristicWithResponseForDevice(
            connectedDevice.id,
            UUIDMappingInfoview.rootServiceUDID,
            UUIDMappingInfoview.epicServerAddress,
            Utils.encodeBase64(epicServerUrl),
          );
          await BleManager.writeCharacteristicWithResponseForDevice(
            connectedDevice.id,
            UUIDMappingInfoview.rootServiceUDID,
            UUIDMappingInfoview.ipAddress,
            Utils.encodeBase64(ipAddress),
          );
          await BleManager.writeCharacteristicWithResponseForDevice(
            connectedDevice.id,
            UUIDMappingInfoview.rootServiceUDID,
            UUIDMappingInfoview.netMask,
            Utils.encodeBase64(subnetMask),
          );
          await BleManager.writeCharacteristicWithResponseForDevice(
            connectedDevice.id,
            UUIDMappingInfoview.rootServiceUDID,
            UUIDMappingInfoview.ipGateway,
            Utils.encodeBase64(gateway),
          );
          await BleManager.writeCharacteristicWithResponseForDevice(
            connectedDevice.id,
            UUIDMappingInfoview.rootServiceUDID,
            UUIDMappingInfoview.dns,
            dnsToSave,
          );
          await BleManager.writeCharacteristicWithResponseForDevice(
            connectedDevice.id,
            UUIDMappingInfoview.rootServiceUDID,
            UUIDMappingInfoview.applyChange,
            Utils.encodeBase64(''),
          );
          dispatch(updateAppModalFields('isLoading', false));
          Utils.showToast(translate('changesSavedSuccessfully'), '', 'success');
          callback();
        } else {
          return;
        }
      } else {
        if (epicServerUrl.length <= 0) {
          setServerUrlError('Please provide valid EPIC IP');
          return;
        } else {
          dispatch(updateAppModalFields('isLoading', true));
          await BleManager.writeCharacteristicWithResponseForDevice(
            connectedDevice.id,
            UUIDMappingInfoview.rootServiceUDID,
            UUIDMappingInfoview.getDHCPStatus,
            Utils.encodeBase64('true'),
          );
          await BleManager.writeCharacteristicWithResponseForDevice(
            connectedDevice.id,
            UUIDMappingInfoview.rootServiceUDID,
            UUIDMappingInfoview.epicServerAddress,
            Utils.encodeBase64(epicServerUrl),
          );
          await BleManager.writeCharacteristicWithResponseForDevice(
            connectedDevice.id,
            UUIDMappingInfoview.rootServiceUDID,
            UUIDMappingInfoview.applyChange,
            Utils.encodeBase64(''),
          );
          dispatch(updateAppModalFields('isLoading', false));
          Utils.showToast(translate('changesSavedSuccessfully'), '', 'success');
          callback();
        }
      }
    } catch (error) {
      dispatch(updateAppModalFields('isLoading', false));
      Utils.Log(Utils.logType.error, 'handleSaveSettingsInfoview', error);
      Utils.showToast('Error', 'Not able to change the settings, try again.');
    }
  };
};

/**
 * redux action that saves network settings onto the BLE device for MS700 Device
 * @param {string} dhcpStatus indicates the network configuration selected via radio button
 * @param {string} ipAddress ip address field value to be saved
 * @param {string} subnetMask subnetMask field value to be saved
 * @param {string} gateway gateway field value to be saved
 * @param {string} primaryDns primaryDns field value to be saved
 * @param {string} secondaryDns secondaryDns field value to be saved
 * @param {string} epicServerUrl epicServerUrl field value to be saved
 * @param {function} validateFields function to validate the fields input by user before saving
 * @param {function} setServerUrlError seets server url error to be shown
 * @param {function} callback callback function that gets executed after settings are saved
 */
export const handleSaveSettingsMS700 = (
  dhcpStatus,
  ipAddress,
  subnetMask,
  gateway,
  primaryDns,
  secondaryDns,
  epicServerUrl,
  validateFields,
  setServerUrlError,
  callback,
) => {
  return async (dispatch, getState) => {
    const {connectedDevice} = getState().authDevices;
    Keyboard.dismiss();
    try {
      if (dhcpStatus === 'static') {
        validateFields();
        if (
          Utils.validateIP(ipAddress) &&
          Utils.validateIP(subnetMask) &&
          Utils.validateIP(gateway) &&
          Utils.validateIP(primaryDns) &&
          epicServerUrl.length > 0 &&
          validateSecondaryDns(secondaryDns)
        ) {
          dispatch(updateAppModalFields('isLoading', true));
          await BleManager.writeCharacteristicWithResponseForDevice(
            connectedDevice.id,
            UUIDMappingMS700.rootServiceUDID,
            UUIDMappingMS700.getDHCPStatus,
            Utils.encodeBase64('static'),
          );
          await BleManager.writeCharacteristicWithResponseForDevice(
            connectedDevice.id,
            UUIDMappingMS700.rootServiceUDID,
            UUIDMappingMS700.dnsType,
            Utils.encodeBase64('manual'),
          );
          await BleManager.writeCharacteristicWithResponseForDevice(
            connectedDevice.id,
            UUIDMappingMS700.rootServiceUDID,
            UUIDMappingMS700.epicServerAddress,
            Utils.encodeBase64(epicServerUrl),
          );
          await BleManager.writeCharacteristicWithResponseForDevice(
            connectedDevice.id,
            UUIDMappingMS700.rootServiceUDID,
            UUIDMappingMS700.ipAddress,
            Utils.encodeBase64(ipAddress),
          );
          await BleManager.writeCharacteristicWithResponseForDevice(
            connectedDevice.id,
            UUIDMappingMS700.rootServiceUDID,
            UUIDMappingMS700.netMask,
            Utils.encodeBase64(subnetMask),
          );
          await BleManager.writeCharacteristicWithResponseForDevice(
            connectedDevice.id,
            UUIDMappingMS700.rootServiceUDID,
            UUIDMappingMS700.ipGateway,
            Utils.encodeBase64(gateway),
          );
          await BleManager.writeCharacteristicWithResponseForDevice(
            connectedDevice.id,
            UUIDMappingMS700.rootServiceUDID,
            UUIDMappingMS700.dns,
            Utils.encodeBase64(primaryDns),
          );
          await BleManager.writeCharacteristicWithResponseForDevice(
            connectedDevice.id,
            UUIDMappingMS700.rootServiceUDID,
            UUIDMappingMS700.secondaryDns,
            Utils.encodeBase64(secondaryDns),
          );
          try {
            await BleManager.writeCharacteristicWithResponseForDevice(
              connectedDevice.id,
              UUIDMappingMS700.rootServiceUDID,
              UUIDMappingMS700.applyChange,
              Utils.encodeBase64(''),
            );
          } catch (error) {
            Utils.Log(
              Utils.logType.error,
              'error while writing apply characteristic',
              error,
            );
          }
          dispatch(updateAppModalFields('isLoading', false));
          Utils.showToast(translate('changesSavedSuccessfully'), '', 'success');
          callback();
        } else {
          return;
        }
      } else {
        if (epicServerUrl.length <= 0) {
          setServerUrlError('Please provide valid EPIC IP');
          return;
        } else {
          dispatch(updateAppModalFields('isLoading', true));
          await BleManager.writeCharacteristicWithResponseForDevice(
            connectedDevice.id,
            UUIDMappingMS700.rootServiceUDID,
            UUIDMappingMS700.getDHCPStatus,
            Utils.encodeBase64('dhcp'),
          );

          await BleManager.writeCharacteristicWithResponseForDevice(
            connectedDevice.id,
            UUIDMappingMS700.rootServiceUDID,
            UUIDMappingMS700.dnsType,
            Utils.encodeBase64('auto'),
          );
          await BleManager.writeCharacteristicWithResponseForDevice(
            connectedDevice.id,
            UUIDMappingMS700.rootServiceUDID,
            UUIDMappingMS700.epicServerAddress,
            Utils.encodeBase64(epicServerUrl),
          );
          try {
            await BleManager.writeCharacteristicWithResponseForDevice(
              connectedDevice.id,
              UUIDMappingMS700.rootServiceUDID,
              UUIDMappingMS700.applyChange,
              Utils.encodeBase64(''),
            );
          } catch (error) {
            Utils.Log(
              Utils.logType.error,
              'error while writing apply characteristic',
              error,
            );
          }
          dispatch(updateAppModalFields('isLoading', false));
          Utils.showToast(translate('changesSavedSuccessfully'), '', 'success');
          callback();
        }
      }
    } catch (error) {
      dispatch(updateAppModalFields('isLoading', false));
      Utils.Log(Utils.logType.error, 'handleSaveSettingsMS700', error);
      Utils.showToast('Error', 'Not able to change the settings, try again.');
    }
  };
};