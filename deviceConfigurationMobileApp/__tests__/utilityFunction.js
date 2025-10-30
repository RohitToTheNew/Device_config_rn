import { combineReducers, createStore } from "redux";
import { appReducer } from "../src/services/app/reducer";
import { authDevicesReducer } from "../src/services/authDevices/reducer";
import { bleDevicesReducer } from "../src/services/bleDevices/reducer";
import { volumeSettingsReducer } from "../src/services/volumes/reducer";

export function createTestStore() {
    const store = createStore(
      combineReducers({
        app: appReducer,
        ble: bleDevicesReducer,
        authDevices: authDevicesReducer,
        volume: volumeSettingsReducer,
      })
    );
    return store;
  }