import {UPDATE_APP_MODAL_FIELDS} from '../constants';
import DeviceType from '../../../config/deviceType';

const initialAppState = {
  appState: '',
  showModal: false,
  isLoading: false,
  locationPermission: '',
  bluetoothState: 'PoweredOff',
  bleDisconnected: false,
  deviceType: DeviceType.ms700,
  showDisconnectedModal: false,
  showManageSchool: false,
  poeOverride:false,
  showPoeModal: false,
  routeName:null
};

export const appReducer = (state = initialAppState, action) => {
  switch (action.type) {
    case UPDATE_APP_MODAL_FIELDS: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
};
