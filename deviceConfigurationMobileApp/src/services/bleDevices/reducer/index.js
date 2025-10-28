import {UPDATE_BLE_DEVICES_FIELDS} from '../constants';

const initialState = {
  bluetoothDevices: [],
  discoveredBleDevices:[]
};

export const bleDevicesReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_BLE_DEVICES_FIELDS: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
};
