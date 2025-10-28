import BleManager from '../../../config/bleManagerInstance';
import { UUIDMappingMS700 } from '../../../constants';
import Utils from '../../../utils';
import {UPDATE_APP_MODAL_FIELDS} from '../constants';
import {sentryErrorHandler} from '../../../utils/errorHandler';
import { translate } from '../../../translations/translationHelper';

export const updateAppModalFields = (key, value) => dispatch => {
  dispatch({
    type: UPDATE_APP_MODAL_FIELDS,
    payload: {[key]: value},
  });
};

/**
 * function that reads POR override value from BLE
 */
export const readPoeOverride = () => {
  return async (dispatch, getState) => {
    const {connectedDevice} = getState().authDevices;
    try {
      const poeValue = await BleManager.readCharacteristicForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.poeOverrride,
      );
      if (Utils.decodeBase64(poeValue.value) == '\u0000\u0000\u0000' || Utils.decodeBase64(poeValue.value) == "" ) {
        dispatch(updateAppModalFields('poeOverride', false)) 
      }else{
        const valueObtained =  Utils.decodeBase64(poeValue.value) == 'true' ? true : false;
        dispatch(updateAppModalFields('poeOverride', valueObtained)) 
      }
    } catch (error) {
      Utils.Log(Utils.logType.error, 'readPoeOverride', error);
      Utils.showToast(translate('unableToReadValuse'));
    }
  };
};

/**
 * redux action that saves POE override settings onto MS700 Device
 * @param {function} callback callback function that gets executed after settings are saved
 */
export const togglePoeOverride = callback => {
  return async (dispatch, getState) => {
    const {connectedDevice} = getState().authDevices;
    const {poeOverride} = getState().app;
    try {
      const valueToUpdate = poeOverride ? "false" : "true"
      await BleManager.writeCharacteristicWithResponseForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.poeOverrride,
        Utils.encodeBase64(valueToUpdate),
      );
      await BleManager.writeCharacteristicWithResponseForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.applyChange,
        Utils.encodeBase64('')
      );
      Utils.showToast('',poeOverride ?'PoE Override disabled' :'PoE Override enabled','success')
      dispatch(updateAppModalFields('poeOverride', !poeOverride))
      callback();
    } catch (error) {
      sentryErrorHandler(`togglePoeOverride eror ${JSON.stringify(error)}`)
      Utils.showToast('Error', 'Not able to change the poe settings, try again.');
    }
  };
};