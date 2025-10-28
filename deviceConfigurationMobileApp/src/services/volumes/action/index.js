import Utils from '../../../utils';
import {UUIDMappingMS700} from '../../../constants';
import {UPDATE_VOLUME_SETTINGS} from '../constants';
import BleManager from '../../../config/bleManagerInstance';
import { updateAppModalFields } from '../../app/action';

/**
 * function that updates values into the volume settings reducer
 * @param {string} key name of the entity to be updated
 * @param {any} value value that is to be stored on the respective key
 */
export const updateVolumeSettingsFields = (key, value) => dispatch => {
  dispatch({
    type: UPDATE_VOLUME_SETTINGS,
    payload: {[key]: value},
  });
};

/**
 * a redux action that reads input settings from MS700 and store values into volume reducer
 */
export const getInputSettingsValues = (callback) => {
  return async (dispatch, getState) => {
    const {inputVolumeSettings} = getState().volume;
    const {connectedDevice} = getState().authDevices;
    inputVolumeSettings.forEach(async element => {
      try {
        const value = await BleManager.readCharacteristicForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          element.charactersticId,
        );
        let muteValue = await BleManager.readCharacteristicForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          element.muteCharacter,
        );
        if (Utils.decodeBase64(value.value) !== '\x00\x00\x00') {
          element.value = Utils.decodeBase64(value.value);
        }
        element.isMuted = muteValue.value ? Utils.decodeBase64(muteValue.value) !== 'true' : false;
      } catch (error) {
        Utils.Log(Utils.logType.error, 'getInputSettingsValues', error);
        dispatch(updateAppModalFields('isLoading', false))
      }
    });
    dispatch(
      updateVolumeSettingsFields('inputVolumeSettings', inputVolumeSettings),
    );
    callback && callback()
  };
};

/**
 * a redux action that reads output settings from BLE and store values into volume reducer
 */
export const getOutputSettingsValues = () => {
  return async (dispatch, getState) => {
    const {outputVolumeSettings} = getState().volume;
    const {connectedDevice} = getState().authDevices;
    outputVolumeSettings.forEach(async element => {
      try {
        const value = await BleManager.readCharacteristicForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          element.charactersticId,
        );
        let muteValue = await BleManager.readCharacteristicForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          element.muteCharacter,
        );
        if (Utils.decodeBase64(value.value) !== '\x00\x00\x00') {
          element.value = Utils.decodeBase64(value.value);
        }
        element.isMuted =
          Utils.decodeBase64(muteValue.value) == 'true' ? false : true;
      } catch (error) {
        Utils.showToast('Error', 'Not able to read the settings, try again.');
        Utils.Log(Utils.logType.error, 'getOutputSettingsValues', error);
      }
    });
    dispatch(
      updateVolumeSettingsFields('outputVolumeSettings', outputVolumeSettings),
    );
  };
};

/**
 * a redux action that reads equalizer settings from BLE and store values into volume reducer
 */
export const geteqSettingsValues = () => {
  return async (dispatch, getState) => {
    const {eqVolumeSettings} = getState().volume;
    const {connectedDevice} = getState().authDevices;
    eqVolumeSettings.forEach(async element => {
      try {
        const value = await BleManager.readCharacteristicForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          element.charactersticId,
        );
        if (Utils.decodeBase64(value.value) !== '\x00\x00\x00') {
          element.value = Utils.decodeBase64(value.value);
        }
      } catch (error) {
        Utils.Log(Utils.logType.error, 'eqVolumeSettings', error);
      }
    });
    dispatch(updateVolumeSettingsFields('eqVolumeSettings', eqVolumeSettings));
  };
};

/**
 * function that writes updated input settings values over the BLE
 * @param {object} rowData data of the input settings row containing index and actual settings data
 * @param {object} value value selected on the input settings slider
 */
export const writeInputValueSettings = (rowData, value) => {
  return async (dispatch, getState) => {
    const {connectedDevice} = getState().authDevices;
    const {inputVolumeSettings} = getState().volume;
    try {
      await BleManager.writeCharacteristicWithResponseForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        rowData.item.charactersticId,
        Utils.encodeBase64(`${value[0]}`),
      );
      await BleManager.writeCharacteristicWithResponseForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.applyChange,
        Utils.encodeBase64(''),
      );
      inputVolumeSettings[rowData.index].value = value[0];
      dispatch(
        updateVolumeSettingsFields('inputVolumeSettings', inputVolumeSettings),
      );
    } catch (error) {
      // Utils.Log(Utils.logType.error, 'writeInputValueSettings', error);
      Utils.showToast('Error', 'Not able to change the settings, try again.');
      Utils.Log(Utils.logType.error, 'writeInputValueSettings', error);
    }
  };
};

/**
 * function to toggle mute/ unmute input settings and update the same in volumes reducer
 * @param {object} rowData data of the input settings row containing index and actual settings data that is to be muted
 */
export const toggleMuteSettings = rowData => {
  return async (dispatch, getState) => {
    const {connectedDevice} = getState().authDevices;
    const {inputVolumeSettings} = getState().volume;
    if (!inputVolumeSettings[rowData.index].isMuted) {
      try {
        await BleManager.writeCharacteristicWithResponseForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          rowData.item.muteCharacter,
          Utils.encodeBase64('false'),
        );
        await BleManager.writeCharacteristicWithResponseForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.applyChange,
          Utils.encodeBase64(''),
        );
        inputVolumeSettings[rowData.index].isMuted =
          !inputVolumeSettings[rowData.index].isMuted;
        dispatch(
          updateVolumeSettingsFields(
            'inputVolumeSettings',
            inputVolumeSettings,
          ),
        );
      } catch (error) {
        Utils.Log(Utils.logType.error, 'toggleMuteSettings', error);
        Utils.showToast('Error', 'Not able to change the settings, try again.');
      }
    } else if (inputVolumeSettings[rowData.index].isMuted) {
      try {
        await BleManager.writeCharacteristicWithResponseForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          rowData.item.muteCharacter,
          Utils.encodeBase64('true'),
        );
        await BleManager.writeCharacteristicWithResponseForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.applyChange,
          Utils.encodeBase64(''),
        );
        inputVolumeSettings[rowData.index].isMuted =
          !inputVolumeSettings[rowData.index].isMuted;
        dispatch(
          updateVolumeSettingsFields(
            'inputVolumeSettings',
            inputVolumeSettings,
          ),
        );
      } catch (error) {
        Utils.Log(Utils.logType.error, 'toggleMuteSettings', error);
        Utils.showToast('Error', 'Not able to change the settings, try again.');
      }
    }
  };
};

/**
 * function to toggle mute/ unmute output settings and update the same in volumes reducer
 * @param {object} rowData data of the output settings row containing index and actual settings data that is to be muted
 */
export const toggleMuteOutputSettings = rowData => {
  return async (dispatch, getState) => {
    const {connectedDevice} = getState().authDevices;
    const {outputVolumeSettings} = getState().volume;
    if (!outputVolumeSettings[rowData.index].isMuted) {
      try {
        await BleManager.writeCharacteristicWithResponseForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          rowData.item.muteCharacter,
          Utils.encodeBase64(`false`),
        );
        await BleManager.writeCharacteristicWithResponseForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.applyChange,
          Utils.encodeBase64(''),
        );
        outputVolumeSettings[rowData.index].isMuted =
          !outputVolumeSettings[rowData.index].isMuted;
        dispatch(
          updateVolumeSettingsFields(
            'outputVolumeSettings',
            outputVolumeSettings,
          ),
        );
      } catch (error) {
        Utils.Log(Utils.logType.error, 'toggleMuteOutputSettings', error);
        Utils.showToast('Error', 'Not able to change the settings, try again.');
      }
    } else if (outputVolumeSettings[rowData.index].isMuted) {
      try {
        await BleManager.writeCharacteristicWithResponseForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          rowData.item.muteCharacter,
          Utils.encodeBase64('true'),
        );
        await BleManager.writeCharacteristicWithResponseForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.applyChange,
          Utils.encodeBase64(''),
        );
        outputVolumeSettings[rowData.index].isMuted =
          !outputVolumeSettings[rowData.index].isMuted;
        dispatch(
          updateVolumeSettingsFields(
            'outputVolumeSettings',
            outputVolumeSettings,
          ),
        );
      } catch (error) {
        Utils.Log(Utils.logType.error, 'toggleMuteOutputSettings', error);
        Utils.showToast('Error', 'Not able to change the settings, try again.');
      }
    }
  };
};

/**
 * function that writes updated output settings values over the BLE
 * @param {object} rowData data of the output settings row containing index and actual settings data
 * @param {object} value value selected on the output settings slider
 */
export const writeOutputVolumeSettings = (rowData, value) => {
  return async (dispatch, getState) => {
    const {connectedDevice} = getState().authDevices;
    const {outputVolumeSettings} = getState().volume;
    try {
      await BleManager.writeCharacteristicWithResponseForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        rowData.item.charactersticId,
        Utils.encodeBase64(`${value[0]}`),
      );
      await BleManager.writeCharacteristicWithResponseForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.applyChange,
        Utils.encodeBase64(''),
      );
      outputVolumeSettings[rowData.index].value = value[0];
      dispatch(
        updateVolumeSettingsFields(
          'outputVolumeSettings',
          outputVolumeSettings,
        ),
      );
    } catch (error) {
      Utils.Log(Utils.logType.error, 'writeOutputVolumeSettings', error);
      Utils.showToast('Error', 'Not able to change the settings, try again.');
    }
  };
};

/**
 * function that write updated equalizer setting values on BLE
 * @param {object} rowData data of the equalizer settings row containing index and actual settings data
 * @param {object} value value selected on the equalizer settings slider
 */
export const writeeqSettingsValues = (rowData, value) => {
  return async (dispatch, getState) => {
    const {connectedDevice} = getState().authDevices;
    const {eqVolumeSettings} = getState().volume;
    try {
      await BleManager.writeCharacteristicWithResponseForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        rowData.item.charactersticId,
        Utils.encodeBase64(`${value[0]}`),
      );
      await BleManager.writeCharacteristicWithResponseForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.applyChange,
        Utils.encodeBase64(''),
      );
      eqVolumeSettings[rowData.index].value = value[0];
      dispatch(
        updateVolumeSettingsFields('eqVolumeSettings', eqVolumeSettings),
      );
    } catch (error) {
      Utils.Log(Utils.logType.error, 'writeeqSettingsValues', error);
      Utils.showToast('Error', 'Not able to change the settings, try again.');
    }
  };
};

/**
 * a redux action that reads bypass equalizer setting from BLE and store value into volume reducer
 */
export const getBypassEQSetting = () => {
  return async (dispatch, getState) => {
    const {connectedDevice} = getState().authDevices;
    try {
      const value = await BleManager.readCharacteristicForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.byPassEQ,
      );
      if (Utils.IsJsonString(Utils.decodeBase64(value.value))) {
        dispatch(
          updateVolumeSettingsFields(
            'bypassEQ',
            JSON.parse(Utils.decodeBase64(value.value)),
          ),
        );
      } else {
        dispatch(updateVolumeSettingsFields('bypassEQ', true));
      }
    } catch (error) {
      Utils.Log(Utils.logType.error, 'getBypassEQSetting', error);
      Utils.showToast('Error', 'Not able to read the settings, try again.');
    }
  };
};

/**
 *  function to toggle the ByPass Equalizer setting over the BLE
 * @param {function} callback callback function that is executed when toggleBypassEQSetting is executed successfully
 */
export const toggleBypassEQSetting = callback => {
  return async (dispatch, getState) => {
    const {connectedDevice} = getState().authDevices;
    const {bypassEQ, eqVolumeSettings} = getState().volume;
    try {
      if(bypassEQ){
        eqVolumeSettings.forEach(async setting =>{
          await BleManager.writeCharacteristicWithResponseForDevice(
            connectedDevice.id,
            UUIDMappingMS700.rootServiceUDID,
            setting.charactersticId,
            Utils.encodeBase64('0'),
            );
          setting.value = '0';
        })
      dispatch(updateVolumeSettingsFields('eqVolumeSettings',eqVolumeSettings))  
      }
      await BleManager.writeCharacteristicWithResponseForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.byPassEQ,
        Utils.encodeBase64(`${!bypassEQ}`),
      );
      await BleManager.writeCharacteristicWithResponseForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.applyChange,
        Utils.encodeBase64(''),
      );
      callback();
    } catch (error) {
      Utils.Log(Utils.logType.error, 'toggleBypassEQSetting', error);
      Utils.showToast('Error', 'Not able to change the settings, try again.');
    }
  };
};

/**
 * a redux action that reads Noise Suppression settings from BLE and store values into volume reducer
 */
export const getNoiseSuppressionSettings = () => {
  return async (dispatch, getState) => {
    const {connectedDevice} = getState().authDevices;
    try {
      const noiseSuppressionData = await BleManager.readCharacteristicForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.noiseSuppression,
      );
      const noiseSuppressionThresholdData =
        await BleManager.readCharacteristicForDevice(
          connectedDevice.id,
          UUIDMappingMS700.rootServiceUDID,
          UUIDMappingMS700.noiseSuppressionThreshold,
        );
      if (Utils.IsJsonString(Utils.decodeBase64(noiseSuppressionData.value))) {
        dispatch(
          updateVolumeSettingsFields(
            'noiseSuppressionEnabled',
            JSON.parse(Utils.decodeBase64(noiseSuppressionData.value)),
          ),
        );
      }
      const parsedNoiseSuppression = parseInt(Utils.decodeBase64(noiseSuppressionThresholdData.value))
      if(!isNaN(parsedNoiseSuppression)){
        dispatch(
          updateVolumeSettingsFields(
            'noiseSuppressionThreshold',
            Utils.decodeBase64(noiseSuppressionThresholdData.value),
          ),
        );
      }else{
        Utils.Log(Utils.logType.error,'error in getSpeakerImpedence','Invalid value from BLE')
      }
    } catch (error) {
      Utils.Log(Utils.logType.error, 'getNoiseSuppressionSettings', error);
    }
  };
};

/**
 * a redux action that reads Speaker Impedence settings from BLE and store values into volume reducer
 */
export const getSpeakerImpedence = () => {
  return async (dispatch, getState) => {
    const {connectedDevice} = getState().authDevices;
    try {
      const speakerImpedenceData = await BleManager.readCharacteristicForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.speakerImpedence,
      );
      const parsedSpeakerImpedence = parseInt(Utils.decodeBase64(speakerImpedenceData.value))
      if(!isNaN(parsedSpeakerImpedence)){
          dispatch(
            updateVolumeSettingsFields(
              'speakerImpedence',
              Utils.decodeBase64(speakerImpedenceData.value),
            ),
          );
      }else{
        Utils.Log(Utils.logType.error,'error in getSpeakerImpedence','Invalid value from BLE')
      }
    } catch (error) {
      Utils.Log(Utils.logType.error, 'getNoiseSuppressionSettings', error);
    }
  };
};

/**
 *  function to toggle the Noise Suppression Enable/Disable setting over the BLE
 * @param {function} callback callback function that is executed when toggleBypassEQSetting is executed successfully
 */
export const toggleNoiseSuppressionSetting = callback => {
  return async (dispatch, getState) => {
    const {connectedDevice} = getState().authDevices;
    const {noiseSuppressionEnabled} = getState().volume;
    try {
      await BleManager.writeCharacteristicWithResponseForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.noiseSuppression,
        Utils.encodeBase64(`${!noiseSuppressionEnabled}`),
      );
      await BleManager.writeCharacteristicWithResponseForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.applyChange,
        Utils.encodeBase64(''),
      );
      dispatch(
        updateVolumeSettingsFields(
          'noiseSuppressionEnabled',
          !noiseSuppressionEnabled,
        ),
      );
      callback();
    } catch (error) {
      Utils.Log(Utils.logType.error, 'toggleBypassEQSetting', error);
      Utils.showToast('Error', 'Not able to change the settings, try again.');
    }
  };
};

/**
 * function to change speaker impedence value setting over the BLE
 * @param {string} value speaker impedence value selected from radio button
 */
export const changeSpeakerImpedence = value => {
  return async (dispatch, getState) => {
    const {connectedDevice} = getState().authDevices;
    try {
      await BleManager.writeCharacteristicWithResponseForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.speakerImpedence,
        Utils.encodeBase64(value),
      );
      await BleManager.writeCharacteristicWithResponseForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.applyChange,
        Utils.encodeBase64(''),
      );
      dispatch(updateVolumeSettingsFields('speakerImpedence', value));
    } catch (error) {
      Utils.Log(Utils.logType.error, 'toggleBypassEQSetting', error);
      Utils.showToast('Error', 'Not able to change the settings, try again.');
    }
  };
};

/**
 * function that toggles noise suppression threshold settings values over the BLE
 * @param {number} value value selected on the input settings slider
 */
export const updateNoiseSuppressionThreshold = value => {
  return async (dispatch, getState) => {
    const {connectedDevice} = getState().authDevices;
    try {
      await BleManager.writeCharacteristicWithResponseForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.noiseSuppressionThreshold,
        Utils.encodeBase64(`${value}`),
      );
      await BleManager.writeCharacteristicWithResponseForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.applyChange,
        Utils.encodeBase64(''),
      );
      dispatch(
        updateVolumeSettingsFields('noiseSuppressionThreshold', value),
      );
    } catch (error) {
      Utils.showToast('Error', 'Not able to change the settings, try again.');
      Utils.Log(Utils.logType.error, 'writeInputValueSettings', error);
    }
  };
};
