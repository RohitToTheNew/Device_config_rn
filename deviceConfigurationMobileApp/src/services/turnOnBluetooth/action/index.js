import BleManager from '../../../config/bleManagerInstance';
import DeviceType from '../../../config/deviceType';
import Utils from '../../../utils';
import {sentryErrorHandler} from '../../../utils/errorHandler';
import {updateBleDevicesFields} from '../../bleDevices/action';

const ms700Regex = /ms.*700/;
const cza1300Regex = /(?:cza[- ]?1300|CZA[- ]?1300)/;

/**
 * function to handle the devices found during scanning process
 * @param {object} device object containing the device details
 * @param {object} navigation instance of the navigation object
 * @param {function} callback function that is executed when device found is added into the redux list
 */
export const handleDevicesFoundInDiscovery = (device, navigation, callback) => {
  return async (dispatch, getState) => {
    device.isConnected = false;
    device.nameWithType = device.localName;
    if (!!device.localName && ms700Regex.test(device.localName.toLowerCase())) {
      device.deviceType = DeviceType.ms700;
      device.checkDeviceTypeAgain = false;
    } else if (
      !!device.localName &&
      cza1300Regex.test(device.localName.toLowerCase())
    ) {
      device.deviceType = DeviceType.cza1300;
      device.checkDeviceTypeAgain = false;
    } else {
      device.deviceType = DeviceType.infoView;
      device.checkDeviceTypeAgain = true;
    }
    if (device.localName) {
      device.localName = device.localName.replace(/ *\([^)]*\) */g, '');
    }
    dispatch(updateBleDevicesFields('bluetoothDevices', [device]));
    BleManager.stopDeviceScan();
    callback();
    navigation.replace('BluetoothDevicesList');
  };
};

/**
 * function to start the device scanning on turning on the bluetooth
 * @param {object} navigation instance of the navigation object
 * @param {function} callback function that is executed when device found is added into the redux list
 */
export const startDeviceScanOnBtTurnOn = (navigation, callback) => {
  return async (dispatch, getState) => {
    try {
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
            var timeDiff = endTime - startTime;
            var milliSeconds = Math.round(timeDiff);
            if (
              device.localName !== null &&
              device.localName.toLowerCase().includes('brx')
            ) {
              BleManager.stopDeviceScan();
              dispatch(
                handleDevicesFoundInDiscovery(device, navigation, callback),
              );
              if (milliSeconds > Utils.timeoutDuration) {
                BleManager.stopDeviceScan();
              }
            }
          }
        },
      );
    } catch (error) {
      sentryErrorHandler(error);
      Utils.Log(Utils.logType.error, 'startDeviceScanOnBtTurnOn', error);
    }
  };
};
