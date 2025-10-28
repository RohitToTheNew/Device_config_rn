import {RESET_NETWORK_SETTINGS, UPDATE_NETWORK_SETTINGS} from '../constants';

const initialState = {
  epicServerUrl: '',
  networkMode: '',
  ipAddress: '',
  subnetMask: '',
  gateway: '',
  primaryDns: '',
  secondaryDns:'',
  dhcpStatus: 'static',
  unsavedModal: false,
  mac:''
};

export const networkSettingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_NETWORK_SETTINGS: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case RESET_NETWORK_SETTINGS: {
      return {
        ...state,
        epicServerUrl: '',
        ipAddress: '',
        subnetMask: '',
        gateway: '',
        dns: '',
        dhcpStatus: 'static',
      };
    }
    default:
      return state;
  }
};
