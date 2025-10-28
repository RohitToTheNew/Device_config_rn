import {combineReducers} from 'redux';
import {appReducer} from '../services/app/reducer';
import {bleDevicesReducer} from '../services/bleDevices/reducer';
import {authDevicesReducer} from '../services/authDevices/reducer';
import {volumeSettingsReducer} from '../services/volumes/reducer';
import {networkSettingsReducer} from '../services/network/reducer';
import {serialSettingsReducer} from '../services/serial/reducer';
export default combineReducers({
  app: appReducer,
  ble: bleDevicesReducer,
  authDevices: authDevicesReducer,
  volume: volumeSettingsReducer,
  network:networkSettingsReducer,
  serial:serialSettingsReducer
});
