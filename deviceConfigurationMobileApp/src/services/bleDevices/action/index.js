import md5 from 'md5';
import Utils from '../../../utils';
import {btoa} from 'react-native-quick-base64';
import {updateAppModalFields} from '../../app/action';
import {UPDATE_BLE_DEVICES_FIELDS} from '../constants';
import {updateAuthDevices} from '../../authDevices/action';
import BleManager from '../../../config/bleManagerInstance';
import {getInputSettingsValues, updateVolumeSettingsFields} from '../../volumes/action';
import {translate} from '../../../translations/translationHelper';
import {DefaultCredentials, UUIDMappingMS700} from '../../../constants';
import {sentryErrorHandler} from '../../../utils/errorHandler';
import {Keyboard} from 'react-native';
import deviceType from '../../../config/deviceType';
import {updateNetworkSettingsFields} from '../../network/action';
import {BleErrorCode} from 'react-native-ble-plx';
import { updateSerialSettingsFields } from '../../serial/action';
/**
 * function that updates values into the Ble Devices settings reducer
 * @param {string} key name of the entity to be updated
 * @param {any} value value that is to be stored on the respective key
 */
export const updateBleDevicesFields = (key, value) => dispatch => {
  dispatch({
    type: UPDATE_BLE_DEVICES_FIELDS,
    payload: {[key]: value},
  });
};

/**
 * function that attempts to perform authentication with BLW
 * @param {object} devicePressed details of the device tapped to authorize
 * @param {string} pin pin used to perform auth process
 * @param {function} dispatch redux dispatcher instance
 */
export const loginWithPin = async (devicePressed, pin, dispatch) => {
  let isAuthenticated;
  try {
    const isConnected = await BleManager.isDeviceConnected(devicePressed.id);
    if (isConnected) {
      await BleManager.cancelDeviceConnection(devicePressed.id);
    }
    const device = await BleManager.connectToDevice(devicePressed.id, {
      timeout: 30000,
    });
    await device.discoverAllServicesAndCharacteristics();
    const servicesNew = await device.services();
    for (const ser of servicesNew) {
      if (ser.uuid === UUIDMappingMS700.rootServiceUDID) {
        const characterstics = await ser.characteristics();
        const challangeNumberCharacterstics = characterstics.find(
          ele => ele.uuid === UUIDMappingMS700.challangeNumber,
        );
        const challangeNumber = await challangeNumberCharacterstics.read();
        const decodedChallangeNumber = Utils.decodeBase64(
          challangeNumber.value,
        );
        const actualChallangeNumber = decodedChallangeNumber.split(',')[5];
        const authenticationCode = [
          ...Utils.encodeToBytesArray(actualChallangeNumber),
          ...Utils.encodeToBytesArray(pin),
          ...Utils.encodeToBytesArray(DefaultCredentials.preSharedKey),
        ];
        const hashedMessage = md5(authenticationCode);
        const hexFields = Utils.encodeToHex('1,1,1,');
        const hexMessage = hexFields + hashedMessage;
        const hexInBytes = Utils.hexToBytes(hexMessage);
        const authCodeToSend = btoa(
          String.fromCharCode(...new Uint8Array(hexInBytes)),
        );
        await device.writeCharacteristicWithResponseForService(
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.authentication,
          authCodeToSend,
        );
        const authenticationStatusChar = characterstics.find(
          ele => ele.uuid === UUIDMappingMS700.authentication,
        );
        const authenticationStatus = await authenticationStatusChar.read();
        isAuthenticated = Utils.decodeBase64(authenticationStatus.value);
        return isAuthenticated;
      }
    }
  } catch (error) {
    sentryErrorHandler(`error while logging in ${JSON.stringify(error)}`);
    if (error.errorCode === BleErrorCode.CharacteristicReadFailed) {
      isAuthenticated = await loginWithPin(devicePressed, pin, dispatch);
    } else if (
      error.message === 'Operation timed out' ||
      error.message === 'Operation was cancelled'
    ) {
      isAuthenticated = 'timeoutError';
    }
    dispatch(updateAppModalFields('isLoading', false));
    return isAuthenticated;
  }
};

/**
 * function that updates the authenticated pin to redux
 * @param {string} deviceId id of the device authenticated
 * @param {string} pin pin used to perform auth process
 * @param {function} callback callback that is executed after device pin is updated
 */
export const handleAuthenticatedDevice = (deviceId, pin, callback) => {
  return async (dispatch, getState) => {
    const {authenticatedDevices} = getState().authDevices;
    try {
      const index = authenticatedDevices.findIndex(
          element => element.id === deviceId,
        ),
        tempData = authenticatedDevices;
      if (index > -1) {
        tempData[index].pin = Utils.encrypt(pin);
      } else {
        const object = {
          id: deviceId,
          pin: Utils.encrypt(pin),
        };
        tempData.push(object);
      }
      dispatch(updateAuthDevices('authenticatedDevices', tempData));
    } catch (error) {
      Utils.Log(
        Utils.logType.error,
        'Error in handleAuthenticatedDevice function',
        error,
      );
    }
  };
};

/**
 * function to read device type when it os not available from name
 * @param {object} devicePressed object containing the device details
 * @param {object} navigation navigation object
 * @param {function} callback callback function to execute
 * @returns returns the device type read from the ble
 */
export const getDeviceType = (devicePressed, navigation, callback) => {
  return async (dispatch, getState) => {
    const {bluetoothDevices} = getState().ble;
    let index, value;
    try {
      value = await BleManager.readCharacteristicForDevice(
        devicePressed.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.deviceType,
      );
      index = bluetoothDevices.findIndex(
        element => element.id === devicePressed.id,
      );
      if (index > -1) {
        bluetoothDevices[index].deviceType = Utils.isMS700(
          Utils.decodeBase64(value.value),
        )
          ? deviceType.ms700
          : Utils.isCZA1300(Utils.decodeBase64(value.value))
          ? deviceType.cza1300
          : deviceType.infoView;
      }
      callback && callback(Utils.decodeBase64(value.value));
      dispatch(updateBleDevicesFields('bluetoothDevices', bluetoothDevices));
    } catch (error) {
      sentryErrorHandler(`getDeviceType error ${error}`);
      Utils.showToast('Unhandled device type');
    }
  };
};

/**
 * function to check if device type is in name, otherwise read device type from device and navigate according to device type read
 * @param {object} devicePressed details of the device tapped to authorize
 * @param {object} navigation object containing instance of the navigation
 * @param {function} callback callback that is executed after device pin is updated
 */
export const navigateToDevice = (devicePressed, navigation, callback) => {
  return async (dispatch, getState) => {
    const {inputVolumeSettingsMS700, inputVolumeSettingsCZA1300, outputVolumeSettingsMS700, outputVolumeSettingsCZA1300} = getState().volume;
    const {settingsMapMS700, settingsMapCZA1300} = getState().serial;
    if (ms700Regex.test(devicePressed.nameWithType.toLowerCase())) {
      dispatch(updateAppModalFields('deviceType', deviceType.ms700));
      dispatch(updateVolumeSettingsFields('inputVolumeSettings',inputVolumeSettingsMS700));
      dispatch(updateVolumeSettingsFields('outputVolumeSettings',outputVolumeSettingsMS700));
      dispatch(updateSerialSettingsFields('serialSettings', settingsMapMS700));
      await dispatch(getInputSettingsValues());
      dispatch(handleIdentifyDevice(devicePressed));
      setTimeout(() => {
        navigation.navigate('HomeScreen');
        dispatch(updateAppModalFields('isLoading', false));
      }, 500);
    } else if (cza1300Regex.test(devicePressed.nameWithType.toLowerCase())) {
      dispatch(updateVolumeSettingsFields('inputVolumeSettings',inputVolumeSettingsCZA1300));
      dispatch(updateVolumeSettingsFields('outputVolumeSettings',outputVolumeSettingsCZA1300));
      dispatch(updateSerialSettingsFields('serialSettings', settingsMapCZA1300));
      await dispatch(getInputSettingsValues());
      dispatch(updateAppModalFields('deviceType', deviceType.cza1300));
      dispatch(handleIdentifyDevice(devicePressed));
      setTimeout(() => {
        navigation.navigate('HomeScreen');
        dispatch(updateAppModalFields('isLoading', false));
      }, 500);
    } else {
      dispatch(
        getDeviceType(devicePressed, navigation, async deviceTypeResponse => {
          if (Utils.isMS700(deviceTypeResponse)) {
            dispatch(updateAppModalFields('deviceType', deviceType.ms700));
            dispatch(updateVolumeSettingsFields('inputVolumeSettings',inputVolumeSettingsMS700));
            dispatch(updateVolumeSettingsFields('outputVolumeSettings',outputVolumeSettingsMS700));
            dispatch(updateSerialSettingsFields('serialSettings', settingsMapMS700));
            await dispatch(getInputSettingsValues());
            dispatch(handleIdentifyDevice(devicePressed));
          } else if(Utils.isCZA1300(deviceTypeResponse)){
            dispatch(updateAppModalFields('deviceType', deviceType.cza1300));
            dispatch(updateVolumeSettingsFields('inputVolumeSettings',inputVolumeSettingsCZA1300));
            dispatch(updateVolumeSettingsFields('outputVolumeSettings',outputVolumeSettingsCZA1300));
            dispatch(updateSerialSettingsFields('serialSettings', settingsMapCZA1300));
            await dispatch(getInputSettingsValues());
            dispatch(handleIdentifyDevice(devicePressed));
          } else {
            dispatch(updateAppModalFields('deviceType', deviceType.infoView));
            dispatch(handleIdentifyDevice(devicePressed));
          }
          setTimeout(() => {
            navigation.navigate('HomeScreen');
            dispatch(updateAppModalFields('isLoading', false));
          }, 500);
        }),
      );
    }
    callback && callback();
  };
};

/**
 * function that perform auth process with the BLE device and handle navigation basis the device type
 * @param {object} devicePressed details of the device tapped to authorize
 * @param {object} navigation object containing instance of the navigation
 * @param {function} callback callback that is executed after device pin is updated
 */
export const performAuthProcess = (devicePressed, navigation, callback) => {
  return async (dispatch, getState) => {
    const {authenticatedDevices} = getState().authDevices;
    try {
      dispatch(updateAppModalFields('isLoading', true));
      const index = authenticatedDevices.findIndex(
        ele => ele.id === devicePressed.id,
      );
      if (index > -1) {
        const authenticationResult = await loginWithPin(
          devicePressed,
          Utils.decrypt(authenticatedDevices[index].pin),
          dispatch,
        );
        if (authenticationResult == 'timeoutError') {
          dispatch(updateAppModalFields('isLoading', false));
          Utils.showToast(
            translate('deviceNotAvailable'),
            translate('pleaseTryAgain'),
          );
        } else if (authenticationResult == 'true') {
          dispatch(updateAuthDevices('connectedDevice', devicePressed));
          dispatch(
            handleAuthenticatedDevice(
              devicePressed.id,
              authenticatedDevices.find(
                device => device.id === devicePressed.id,
              )?.pin,
            ),
          );
          dispatch(navigateToDevice(devicePressed, navigation));
        } else {
          const authenticationResult = await loginWithPin(
            devicePressed,
            DefaultCredentials.defaultPin,
            dispatch,
          );
          if (authenticationResult == 'timeoutError') {
            dispatch(updateAppModalFields('isLoading', false));
            Utils.showToast(
              translate('deviceNotAvailable'),
              translate('pleaseTryAgain'),
            );
          } else if (authenticationResult == 'true') {
            dispatch(updateAuthDevices('connectedDevice', devicePressed));
            dispatch(
              handleAuthenticatedDevice(
                devicePressed.id,
                DefaultCredentials.defaultPin,
              ),
            );
            dispatch(navigateToDevice(devicePressed, navigation));
          } else if (authenticationResult == 'false') {
            dispatch(updateAppModalFields('isLoading', false));
            navigation.navigate('SetPasscode', {
              isUpdateScreen: false,
              devicePressed: devicePressed,
            });
          } else {
            dispatch(updateAppModalFields('isLoading', false));
            Utils.showToast(translate('unableToConnect'));
          }
        }
        dispatch(updateNetworkSettingsFields('mac', ''));
        dispatch(updateNetworkSettingsFields('ipAddress', ''));
      } else {
        let authenticationResult;
        authenticationResult = await loginWithPin(
          devicePressed,
          DefaultCredentials.defaultPin,
          dispatch,
        );
        if (authenticationResult == 'timeoutError') {
          dispatch(updateAppModalFields('isLoading', false));
          Utils.showToast(
            translate('deviceNotAvailable'),
            translate('pleaseTryAgain'),
          );
        } else if (authenticationResult == 'true') {
          dispatch(updateAuthDevices('connectedDevice', devicePressed));
          dispatch(
            handleAuthenticatedDevice(
              devicePressed.id,
              DefaultCredentials.defaultPin,
            ),
          );
          dispatch(navigateToDevice(devicePressed, navigation));
        } else if (authenticationResult == 'false') {
          dispatch(updateAppModalFields('isLoading', false));
          navigation.navigate('SetPasscode', {
            isUpdateScreen: false,
            devicePressed: devicePressed,
          });
        } else {
          dispatch(updateAppModalFields('isLoading', false));
          Utils.showToast(translate('unableToConnect'));
        }
      }
      dispatch(updateNetworkSettingsFields('mac', ''));
      dispatch(updateNetworkSettingsFields('ipAddress', ''));
    } catch (error) {
      sentryErrorHandler(`error in perform auth process ${error}`);
    }
  };
};

/**
 * function to handle the devices found during device discovery
 * @param {object} device object containig the details of the device found during discovery
 * @param {function} callback callback that is executed after device is discovered
 */
export const handleDevicesFound = (device, callback) => {
  return async (dispatch, getState) => {
    const {bluetoothDevices} = getState().ble;
    let temp = bluetoothDevices;
    try {
      const index = bluetoothDevices.findIndex(
        element => element.id === device.id,
      );
      if (index === -1) {
        device['isConnected'] = false;
        if (
          !!device.localName &&
          ms700Regex.test(device.localName.toLowerCase())
        ) {
          device.deviceType = deviceType.ms700;
          device.checkDeviceTypeAgain = false;
        } else if (
          !!device.localName &&
          cza1300Regex.test(device.localName.toLowerCase())
        ) {
          device.deviceType = deviceType.cza1300;
          device.checkDeviceTypeAgain = false;
        } else {
          device.deviceType = deviceType.infoView;
          device.checkDeviceTypeAgain = true;
        }
        device.nameWithType = device.localName;
        if (device.localName) {
          device.localName = device.localName.replace(/ *\([^)]*\) */g, '');
        }
        temp.push(device);
      }
      temp.sort((a, b) => b.rssi - a.rssi);
      dispatch(updateBleDevicesFields('bluetoothDevices', [...temp]));
      callback();
    } catch (error) {
      Utils.Log(
        Utils.logType.error,
        'Error in handleDevicesFound function',
        error,
      );
    }
  };
};

/**
 * function to start the device scanning process
 * @param {function} onDevicesFound function that is to be called when device is discovered
 */
export const startDeviceScan = onDevicesFound => {
  return async (dispatch, getState) => {
    const startTime = new Date();
    BleManager.startDeviceScan(
      null,
      {allowDuplicates: false},
      (error, device) => {
        if (error) {
          BleManager.stopDeviceScan();
          return;
        } else {
          const endTime = new Date();
          const timeDiff = endTime - startTime;
          const milliSeconds = Math.round(timeDiff);
          if (
            device.localName !== null &&
            device.localName.toLowerCase().includes('brx')
          ) {
            dispatch(
              handleDevicesFound(device, () => {
                onDevicesFound && onDevicesFound();
              }),
            );
          }
          if (milliSeconds > Utils.timeoutDuration) {
            BleManager.stopDeviceScan();
            onDevicesFound();
          }
        }
      },
    );
  };
};

/**
 * function to handle the authentication when user manually enters the device pin
 * @param {object} devicePressed details of the device tapped to authorize
 * @param {string} passcode passcode of the device entered by user
 * @param {object} navigation object containing instance of the navigation
 * @param {function} errorCallback function to execute when any error is occured
 * @param {function} successCallback function to execute when auth process is successful
 */
export const handleAuthProcess = (
  devicePressed,
  passcode,
  navigation,
  successCallback,
  errorCallback,
) => {
  return async (dispatch, getState) => {
    const authenticatedDevices = getState().authDevices.authenticatedDevices;
    try {
      dispatch(updateAppModalFields('isLoading', true));
      let authenticationResult;
      try {
        authenticationResult = await loginWithPin(
          devicePressed,
          passcode,
          dispatch,
        );
      } catch (error) {
        dispatch(updateAppModalFields('isLoading', false));
      }
      if (authenticationResult == 'timeoutError') {
        dispatch(updateAppModalFields('isLoading', false));
        Utils.showToast(
          translate('deviceNotAvailable'),
          translate('pleaseTryAgain'),
        );
      } else if (authenticationResult == 'true') {
        dispatch(updateAppModalFields('deviceType', devicePressed.deviceType));
        dispatch(updateAuthDevices('connectedDevice', devicePressed));
        dispatch(
          handleAuthenticatedDevice(
            devicePressed.id,
            DefaultCredentials.defaultPin,
          ),
        );

        dispatch(navigateToDevice(devicePressed, navigation, successCallback));
      } else {
        dispatch(updateAppModalFields('isLoading', false));
        errorCallback();
      }
    } catch (error) {
      dispatch(updateAppModalFields('isLoading', false));
    }
  };
};

/**
 * function to update the pin
 * @param {object} devicePressed details of the device tapped from listing screen
 * @param {string} passcode passcode of the device entered by user
 * @param {object} navigation object containing instance of the navigation
 * @param {function} callback function to execute when any error is occured
 */
export const handleUpdateProcess = (
  devicePressed,
  passcode,
  navigation,
  callback,
) => {
  return async (dispatch, getState) => {
    const {connectedDevice, authenticatedDevices} = getState().authDevices;
    if (passcode.length < 6) {
      return;
    }
    Keyboard.dismiss();
    try {
      dispatch(updateAppModalFields('isLoading', true));
      await BleManager.writeCharacteristicWithResponseForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.changePin,
        btoa(passcode),
      );
      await BleManager.writeCharacteristicWithResponseForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.applyChange,
        Utils.encodeBase64(''),
      );
      dispatch(updateAppModalFields('isLoading', false));
      let index = authenticatedDevices.findIndex(
        element => element.id === connectedDevice.id,
      );
      if (index > -1) {
        authenticatedDevices[index].pin = Utils.encrypt(passcode);
        dispatch(
          updateAuthDevices('authenticatedDevices', authenticatedDevices),
        );
      }
      Utils.showToast(translate('passcodeChanged'), '', 'success');
      callback();
      if (Utils.isMS700(devicePressed.deviceType)) {
        navigation.navigate('HomeScreen');
      } else if (Utils.isInfoView(devicePressed.deviceType)) {
        navigation.navigate('HomeScreen');
      }
    } catch (error) {
      Utils.Log(Utils.logType.error, 'handleUpdateProcess', error);
      dispatch(updateAppModalFields('isLoading', false));
    }
  };
};

/**
 *  function to add delay
 * @param {number} t indicating the delay is ms
 */
const delay = t => new Promise(resolve => setTimeout(resolve, t));

const ms700Regex = /ms.*700/;
const infoviewRegex = /infoview|info.*view/;
const cza1300Regex = /(?:cza[- ]?1300|CZA[- ]?1300)/;

/**
 * function to trigger the identify device flow for ms700 & infoview device
 * @param {object} device details of the device
 */
export const handleIdentifyDevice = device => {
  return async (dispatch, getState) => {
    try {
      if (Utils.isMS700(device.deviceType)) {
        await BleManager.writeCharacteristicWithResponseForDevice(
          device.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.identifyDevice,
          Utils.encodeBase64('beep-tone'),
        );
        await BleManager.writeCharacteristicWithResponseForDevice(
          device.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.identifyDevice,
          Utils.encodeBase64('xd-leds'),
        );
      } else if (Utils.isInfoView(device.deviceType)) {
        await BleManager.writeCharacteristicWithResponseForDevice(
          device.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.identifyDevice,
          Utils.encodeBase64('pop-up'),
        );
      } else if (Utils.isCZA1300(device.deviceType)) {
        await BleManager.writeCharacteristicWithResponseForDevice(
          device.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.identifyDevice,
          Utils.encodeBase64('beep-tone'),
        );
        await BleManager.writeCharacteristicWithResponseForDevice(
          device.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.identifyDevice,
          Utils.encodeBase64('blink-leds'),
        );
      }
      await BleManager.writeCharacteristicWithResponseForDevice(
        device.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.applyChange,
        Utils.encodeBase64(''),
      );
    } catch (error) {
      Utils.showToast('Something went wrong.', 'Please try again.');
      Utils.Log(Utils.logType.error, 'handleIdentifyDevice', error);
    }
  };
};

/**
 * function to check if device type is in name, otherwise read device type from device and identify according to device type read
 * @param {object} devicePressed details of the device
 * @param {object} navigation object containing instance of the navigation
 */
export const handleDeviceTypeBasedIdentify = (
  devicePressed,
  navigation,
  callback,
) => {
  return async (dispatch, getState) => {
    const {authenticatedDevices} = getState().authDevices;
    if (
      ms700Regex.test(devicePressed?.nameWithType.toLowerCase()) ||
      cza1300Regex.test(devicePressed?.nameWithType.toLowerCase())
    ) {
      dispatch(handleIdentifyDevice(devicePressed));
      callback && callback();
      dispatch(updateAppModalFields('deviceType', devicePressed.deviceType));
    } else {
      dispatch(
        getDeviceType(devicePressed, navigation, deviceTypeResponse => {
          devicePressed.deviceType = deviceTypeResponse;
          callback && callback();
          dispatch(handleIdentifyDevice(devicePressed));
        }),
      );
    }
  };
};

/**
 * function to identify the device from the device list screen
 * @param {object} devicePressed details of the device
 * @param {object} navigation object containing instance of the navigation
 */
export const identifyDeviceFromList = (devicePressed, navigation) => {
  return async (dispatch, getState) => {
    const {authenticatedDevices} = getState().authDevices;
    try {
      dispatch(updateAppModalFields('isLoading', true));
      let index = authenticatedDevices.findIndex(
        ele => ele.id === devicePressed.id,
      );
      if (index > -1) {
        const authenticationResult = await loginWithPin(
          devicePressed,
          Utils.decrypt(authenticatedDevices[index].pin),
          dispatch,
        );
        if (authenticationResult == 'timeoutError') {
          dispatch(updateAppModalFields('isLoading', false));
          Utils.showToast(
            translate('deviceNotAvailable'),
            translate('pleaseTryAgain'),
          );
        } else if (authenticationResult == 'true') {
          dispatch(
            handleDeviceTypeBasedIdentify(devicePressed, navigation, () => {
              dispatch(
                handleAuthenticatedDevice(
                  devicePressed.id,
                  authenticatedDevices.find(
                    device => device.id === devicePressed.id,
                  )?.pin,
                ),
              );
            }),
          );
        } else {
          const authenticationResult = await loginWithPin(
            devicePressed,
            DefaultCredentials.defaultPin,
            dispatch,
          );
          if (authenticationResult == 'timeoutError') {
            Utils.showToast(
              translate('deviceNotAvailable'),
              translate('pleaseTryAgain'),
            );
          } else if (authenticationResult == 'true') {
            dispatch(
              handleDeviceTypeBasedIdentify(devicePressed, navigation, () => {
                dispatch(
                  handleAuthenticatedDevice(
                    devicePressed.id,
                    DefaultCredentials.defaultPin,
                  ),
                );
              }),
            );
          } else if (authenticationResult == 'false') {
            navigation.navigate('SetPasscode', {
              isUpdateScreen: false,
              devicePressed: devicePressed,
            });
          } else {
            dispatch(updateAppModalFields('isLoading', false));
            Utils.showToast(translate('unableToConnect'));
          }
        }
      } else {
        let authenticationResult;
        authenticationResult = await loginWithPin(
          devicePressed,
          DefaultCredentials.defaultPin,
          dispatch,
        );
        if (authenticationResult == 'timeoutError') {
          Utils.showToast(
            translate('deviceNotAvailable'),
            translate('pleaseTryAgain'),
          );
        } else if (authenticationResult == 'true') {
          dispatch(
            handleDeviceTypeBasedIdentify(devicePressed, navigation, () => {
              dispatch(
                handleAuthenticatedDevice(
                  devicePressed.id,
                  DefaultCredentials.defaultPin,
                ),
              );
            }),
          );
        } else if (authenticationResult == 'false') {
          dispatch(updateAppModalFields('isLoading', false));
          navigation.navigate('SetPasscode', {
            isUpdateScreen: false,
            devicePressed: devicePressed,
          });
        } else {
          dispatch(updateAppModalFields('isLoading', false));
          Utils.showToast(translate('unableToConnect'));
        }
      }
      dispatch(updateAppModalFields('isLoading', false));
    } catch (error) {
      Utils.showToast('Oops', 'Something went wrong.');
      Utils.Log(Utils.logType.error, 'identifyDeviceFromList', error);
    }
  };
};
