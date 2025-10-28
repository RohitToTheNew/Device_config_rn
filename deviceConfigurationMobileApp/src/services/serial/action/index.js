import Utils from '../../../utils';
import {UPDATE_SERIAL_SETTINGS} from '../constants';
import BleManager from '../../../config/bleManagerInstance';
import {UUIDMappingMS700} from '../../../constants';
import {translate} from '../../../translations/translationHelper';
import {updateAppModalFields} from '../../app/action';
import {sentryErrorHandler} from '../../../utils/errorHandler';

/**
 * function to update the serial settings store values
 * @param {string} key store key to update
 * @param {any} value value with which store key is to be updated
 */
export const updateSerialSettingsFields = (key, value) => dispatch => {
  dispatch({
    type: UPDATE_SERIAL_SETTINGS,
    payload: {[key]: value},
  });
};

/**
 * function to iterate the list port data and set selected to true for the values read from ble
 * @param {object} value fw behaviour values read from ble that are pre-selected
 * @param {object} portData port data values
 * @returns returns the port data with selected values
 */
const handleFWbehaviorValues = (value, portData) => {
  value.forEach(outerElement => {
    portData.forEach(innerElement => {
      if (innerElement.portNumber === parseInt(outerElement)) {
        innerElement.selected = true;
      }
    });
  });
  return portData;
};

/**
 * function to read serial settings values from MS700
 */
export const getSerialSettings = deviceType => {
  return async (dispatch, getState) => {
    const {connectedDevice} = getState().authDevices;
    const {serialSettings} = getState().serial;
    if (Utils.isCZA1300(deviceType)) {
      const rp1Value = await BleManager.readCharacteristicForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.fwBehaviourRP1,
      );
      const tcpValue = await BleManager.readCharacteristicForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.fwBehaviourTCP,
      );
      const xdValue = await BleManager.readCharacteristicForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.fwBehaviourXD,
      );
      const boudRateRP1Value = await BleManager.readCharacteristicForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.boudRateRP1,
      );
      const boudRateXDValue = await BleManager.readCharacteristicForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.boudRateXD,
      );
      const rp1ValueSplitted = Utils.decodeBase64(rp1Value.value).split(',');
      const xdValueSplitted = Utils.decodeBase64(xdValue.value).split(',');
      const tcpValueSplitted = Utils.decodeBase64(tcpValue.value).split(',');

      const rp1ValueMapped = handleFWbehaviorValues(
        rp1ValueSplitted,
        serialSettings[0].forwardingBehaviour,
      );
      serialSettings[0].forwardingBehaviour = rp1ValueMapped;
      const xdValueMapped = handleFWbehaviorValues(
        xdValueSplitted,
        serialSettings[1].forwardingBehaviour,
      );
      serialSettings[1].forwardingBehaviour = xdValueMapped;
      const tcpValueMapped = handleFWbehaviorValues(
        tcpValueSplitted,
        serialSettings[2].forwardingBehaviour,
      );
      serialSettings[2].forwardingBehaviour = tcpValueMapped;

      serialSettings[0].selectedBoudRate = parseInt(
        Utils.decodeBase64(boudRateRP1Value.value).split(':')[0],
      );
      serialSettings[1].selectedBoudRate = parseInt(
        Utils.decodeBase64(boudRateXDValue.value).split(':')[0],
      );
      dispatch(updateSerialSettingsFields('serialSettings', serialSettings));
    } else {
      try {
        const rp1Value = await BleManager.readCharacteristicForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.fwBehaviourRP1,
        );
        const rp2Value = await BleManager.readCharacteristicForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.fwBehaviourRP2,
        );
        const rp3Value = await BleManager.readCharacteristicForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.fwBehaviourRP3,
        );
        const serialValue = await BleManager.readCharacteristicForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.fwBehaviourSerial,
        );
        const tcpValue = await BleManager.readCharacteristicForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.fwBehaviourTCP,
        );
        const xdValue = await BleManager.readCharacteristicForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.fwBehaviourXD,
        );

        const boudRateRP1Value = await BleManager.readCharacteristicForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.boudRateRP1,
        );

        const boudRateRP2Value = await BleManager.readCharacteristicForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.boudRateRP2,
        );
        const boudRateRP3Value = await BleManager.readCharacteristicForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.boudRateRP3,
        );
        const boudRateSerialValue =
          await BleManager.readCharacteristicForDevice(
            connectedDevice.id,
            UUIDMappingMS700.rootServiceUDID,
            UUIDMappingMS700.boudRateSerial,
          );
        const boudRateXDValue = await BleManager.readCharacteristicForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.boudRateXD,
        );
        const rp1ValueSplitted = Utils.decodeBase64(rp1Value.value).split(',');
        const rp2ValueSplitted = Utils.decodeBase64(rp2Value.value).split(',');
        const rp3ValueSplitted = Utils.decodeBase64(rp3Value.value).split(',');
        const xdValueSplitted = Utils.decodeBase64(xdValue.value).split(',');
        const serialValueSplitted = Utils.decodeBase64(serialValue.value).split(
          ',',
        );
        const tcpValueSplitted = Utils.decodeBase64(tcpValue.value).split(',');

        const rp1ValueMapped = handleFWbehaviorValues(
          rp1ValueSplitted,
          serialSettings[0].forwardingBehaviour,
        );
        serialSettings[0].forwardingBehaviour = rp1ValueMapped;

        const rp2ValueMapped = handleFWbehaviorValues(
          rp2ValueSplitted,
          serialSettings[1].forwardingBehaviour,
        );
        serialSettings[1].forwardingBehaviour = rp2ValueMapped;

        const rp3ValueMapped = handleFWbehaviorValues(
          rp3ValueSplitted,
          serialSettings[2].forwardingBehaviour,
        );
        serialSettings[2].forwardingBehaviour = rp3ValueMapped;

        const xdValueMapped = handleFWbehaviorValues(
          xdValueSplitted,
          serialSettings[3].forwardingBehaviour,
        );
        serialSettings[3].forwardingBehaviour = xdValueMapped;

        const serialValueMapped = handleFWbehaviorValues(
          serialValueSplitted,
          serialSettings[4].forwardingBehaviour,
        );
        serialSettings[4].forwardingBehaviour = serialValueMapped;

        const tcpValueMapped = handleFWbehaviorValues(
          tcpValueSplitted,
          serialSettings[5].forwardingBehaviour,
        );
        serialSettings[5].forwardingBehaviour = tcpValueMapped;

        serialSettings[0].selectedBoudRate = parseInt(
          Utils.decodeBase64(boudRateRP1Value.value).split(':')[0],
        );
        serialSettings[1].selectedBoudRate = parseInt(
          Utils.decodeBase64(boudRateRP2Value.value).split(':')[0],
        );
        serialSettings[2].selectedBoudRate = parseInt(
          Utils.decodeBase64(boudRateRP3Value.value).split(':')[0],
        );
        serialSettings[4].selectedBoudRate = parseInt(
          Utils.decodeBase64(boudRateSerialValue.value).split(':')[0],
        );
        serialSettings[3].selectedBoudRate = parseInt(
          Utils.decodeBase64(boudRateXDValue.value).split(':')[0],
        );
        dispatch(updateSerialSettingsFields('serialSettings', serialSettings));
      } catch (error) {
        Utils.Log(Utils.logType.error, 'getSerialSettings', error);
        Utils.showToast(translate('unableToReadValuse'));
      }
    }
  };
};

/**
 * function to filter out selected fw behaviour values on UI
 * @param {object} fwBehaviour object containing the list of fw behaviour
 * @returns string containing selected fw behaviour, comma separated
 */
const handleSaveData = fwBehaviour => {
  return fwBehaviour
    .filter(element => element.selected === true)
    .map(inner => {
      return inner.portNumber;
    })
    .join(',');
};

/**
 * function to save serial settings on MS700
 * @param {function} callback function to execute when serial settings are saved successfully
 */
export const saveSerialSettings = (deviceType, callback) => {
  return async (dispatch, getState) => {
    const {connectedDevice} = getState().authDevices;
    const {serialSettings} = getState().serial;
    if (Utils.isCZA1300(deviceType)) {
      try {
        dispatch(updateAppModalFields('isLoading', true));
        const fwDataRP1 = handleSaveData(serialSettings[0].forwardingBehaviour);
        const fwDataXD = handleSaveData(serialSettings[1].forwardingBehaviour);
        const fwDataTCP = handleSaveData(serialSettings[2].forwardingBehaviour);
        await BleManager.writeCharacteristicWithResponseForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.fwBehaviourRP1,
          Utils.encodeBase64(fwDataRP1),
        );
        await BleManager.writeCharacteristicWithResponseForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.fwBehaviourTCP,
          Utils.encodeBase64(fwDataTCP),
        );
        await BleManager.writeCharacteristicWithResponseForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.fwBehaviourXD,
          Utils.encodeBase64(fwDataXD),
        );

        await BleManager.writeCharacteristicWithResponseForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.boudRateRP1,
          Utils.encodeBase64(`${serialSettings[0].selectedBoudRate}:N:8:1`),
        );
        await BleManager.writeCharacteristicWithResponseForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.boudRateXD,
          Utils.encodeBase64(`${serialSettings[1].selectedBoudRate}:N:8:1`),
        );
        await BleManager.writeCharacteristicWithResponseForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.applyChange,
          Utils.encodeBase64(''),
        );
        callback();
        dispatch(updateAppModalFields('isLoading', false));
        Utils.showToast('Changes saved successfully.', '', 'success');
      } catch (error) {
        dispatch(updateAppModalFields('isLoading', false));
        sentryErrorHandler(`save CZA1300 serial settings error ${error}`);
        Utils.showToast('Error', 'Not able to change the settings, try again.');
      }
    } else {
      try {
        dispatch(updateAppModalFields('isLoading', true));
        const fwDataRP1 = handleSaveData(serialSettings[0].forwardingBehaviour);
        const fw2ataRP2 = handleSaveData(serialSettings[1].forwardingBehaviour);
        const fwDataRP3 = handleSaveData(serialSettings[2].forwardingBehaviour);
        const fwDataXD = handleSaveData(serialSettings[3].forwardingBehaviour);
        const fwDataSerial = handleSaveData(
          serialSettings[4].forwardingBehaviour,
        );
        const fwDataTCP = handleSaveData(serialSettings[5].forwardingBehaviour);
        await BleManager.writeCharacteristicWithResponseForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.fwBehaviourRP1,
          Utils.encodeBase64(fwDataRP1),
        );
        await BleManager.writeCharacteristicWithResponseForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.fwBehaviourRP2,
          Utils.encodeBase64(fw2ataRP2),
        );
        await BleManager.writeCharacteristicWithResponseForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.fwBehaviourRP3,
          Utils.encodeBase64(fwDataRP3),
        );
        await BleManager.writeCharacteristicWithResponseForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.fwBehaviourSerial,
          Utils.encodeBase64(fwDataSerial),
        );
        await BleManager.writeCharacteristicWithResponseForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.fwBehaviourTCP,
          Utils.encodeBase64(fwDataTCP),
        );
        await BleManager.writeCharacteristicWithResponseForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.fwBehaviourXD,
          Utils.encodeBase64(fwDataXD),
        );

        await BleManager.writeCharacteristicWithResponseForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.boudRateRP1,
          Utils.encodeBase64(`${serialSettings[0].selectedBoudRate}:N:8:1`),
        );
        await BleManager.writeCharacteristicWithResponseForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.boudRateRP2,
          Utils.encodeBase64(`${serialSettings[1].selectedBoudRate}:N:8:1`),
        );
        await BleManager.writeCharacteristicWithResponseForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.boudRateRP3,
          Utils.encodeBase64(`${serialSettings[2].selectedBoudRate}:N:8:1`),
        );
        await BleManager.writeCharacteristicWithResponseForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.boudRateSerial,
          Utils.encodeBase64(`${serialSettings[4].selectedBoudRate}:N:8:1`),
        );
        await BleManager.writeCharacteristicWithResponseForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.boudRateXD,
          Utils.encodeBase64(`${serialSettings[3].selectedBoudRate}:N:8:1`),
        );
        await BleManager.writeCharacteristicWithResponseForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.applyChange,
          Utils.encodeBase64(''),
        );
        callback && callback();
        dispatch(updateAppModalFields('isLoading', false));
        Utils.showToast('Changes saved successfully.', '', 'success');
      } catch (error) {
        dispatch(updateAppModalFields('isLoading', false));
        sentryErrorHandler(`save MS700 serial settings error ${error}`);
        Utils.showToast('Error', 'Not able to change the settings, try again.');
      }
    }
  };
};
