import {UPDATE_AUTH_DEVICES_MODAL_FIELDS} from '../constants';

const initialAppState = {
  authenticatedDevices: [],
  connectedDevice: {},
};

export const authDevicesReducer = (state = initialAppState, action) => {
  switch (action.type) {
    case UPDATE_AUTH_DEVICES_MODAL_FIELDS: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
};
