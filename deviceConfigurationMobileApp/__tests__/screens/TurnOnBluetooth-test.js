// Mock BackHandler before other imports
jest.mock('react-native/Libraries/Utilities/BackHandler', () => {
  return {
    __esModule: true,
    default: {
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
      removeEventListener: jest.fn(),
    },
  };
});

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useIsFocused: jest.fn(() => true),
}));

import React from 'react';
import { Linking } from 'react-native';
import { Provider } from 'react-redux';
import renderer, { act as rendererAct } from 'react-test-renderer';
import { BleManager } from 'react-native-ble-plx';
import { store } from '../../src/store/configureStore';
import TurnOnBluetooth from '../../src/screens/turnOnBluetooth';
import { translate } from '../../src/translations/translationHelper';
import { updateAppModalFields } from '../../src/services/app/action';
import {
  render,
  screen,
  fireEvent,
  cleanup,
} from '@testing-library/react-native';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { handleDevicesFoundInDiscovery } from '../../src/services/turnOnBluetooth/action';
import { NavigationContainer } from '@react-navigation/native';
import deviceType from '../../src/config/deviceType';

const mockStore = configureMockStore([thunk]);

afterEach(() => {
  cleanup();
  jest.clearAllTimers();
});
jest.useFakeTimers();

describe('TurnOnBluetooth Screen', () => {
  let tree;

  beforeEach(() => {
    const testStore = mockStore({
      app: { bluetoothState: 'PoweredOff', appState: 'active' },
      ble: { bluetoothDevices: [] },
      authDevices: { connectedDevice: {} },
    });

    let component;
    rendererAct(() => {
      component = renderer.create(
        <Provider store={testStore}>
          <NavigationContainer>
            <TurnOnBluetooth />
          </NavigationContainer>
        </Provider>
      );
    });
    tree = component.toJSON();
  });

  it('should render TurnOnBluetooth screen correctly', () => {
    expect(tree).toMatchSnapshot();
  });
});

describe('on landing to TurnOnBluetoothScreen', () => {
  let linkingSpy, BleManagerEnableSpy;

  beforeEach(() => {
    // Reset store to PoweredOff state
    rendererAct(() => {
      store.dispatch(updateAppModalFields('bluetoothState', 'PoweredOff'));
    });
    
    // Mock Linking.openURL for iOS
    linkingSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
    
    // Mock BleManager.enable for Android
    BleManagerEnableSpy = jest.spyOn(
      require('../../src/config/bleManagerInstance').default,
      'enable'
    ).mockImplementation(() => {
      // Simulate bluetooth turning on
      store.dispatch(updateAppModalFields('bluetoothState', 'PoweredOn'));
      return Promise.resolve();
    });
  });

  afterEach(() => {
    if (linkingSpy) {
      linkingSpy.mockRestore();
    }
    if (BleManagerEnableSpy) {
      BleManagerEnableSpy.mockRestore();
    }
    // Clean up store
    rendererAct(() => {
      store.dispatch(updateAppModalFields('bluetoothState', 'PoweredOff'));
    });
  });

  it('should turnOn bluetooth if it is off', () => {
    const component = (
      <Provider store={store}>
        <NavigationContainer>
          <TurnOnBluetooth />
        </NavigationContainer>
      </Provider>
    );
    
    const { getByTestId, getByText } = render(component);
    
    // Verify initial render
    expect(getByText(translate('turnOn'))).toBeTruthy();
    expect(getByTestId('lottieWave')).toBeTruthy();
    
    // Verify initial state is PoweredOff
    expect(store.getState().app.bluetoothState).toBe('PoweredOff');
    
    // Press the turn on button
    rendererAct(() => {
      fireEvent.press(getByTestId('turnOnButton'));
    });
    
    // Verify that either Linking.openURL (iOS) or BleManager.enable (Android) was called
    // Since Utils.isIOS determines which one is called, we check if at least one was called
    const wasCalledCorrectly = linkingSpy.mock.calls.length > 0 || BleManagerEnableSpy.mock.calls.length > 0;
    expect(wasCalledCorrectly).toBe(true);
    
    // If BleManager.enable was called (Android), verify state changed
    if (BleManagerEnableSpy.mock.calls.length > 0) {
      expect(store.getState().app.bluetoothState).toBe('PoweredOn');
    }
  });
});

describe('handling the bluetooth devices found during the device discovery phase', () => {
  beforeEach(() => {
    const device = {
      id: 'BDCB6EA5-D458-DD27-E14E-169930912022',
      localName: 'Brx-emulator (MS-700)',
      name: 'osboxes',
      isConnected: false,
    };
    const navigation = { replace: jest.fn() };
    const callback = jest.fn();
    store.dispatch(handleDevicesFoundInDiscovery(device, navigation, callback));
  });
  it('should add device to the previously added devices list', () => {
    expect(store.getState().ble.bluetoothDevices[0].deviceType).toBe(deviceType.ms700);
  });
});

describe('check device type of devices found during the device discovery phase', () => {
  beforeEach(() => {
    const device = {
      id: 'BDCB6EA5-D458-DD27-E14E-169930912022',
      localName: 'Brx-emulator (CZA-1300)',
      name: 'osboxes',
      isConnected: false,
    };
    const navigation = { replace: jest.fn() };
    const callback = jest.fn();
    store.dispatch(handleDevicesFoundInDiscovery(device, navigation, callback));
  });
  it('should check if the device found is CZA1300 device', () => {
    expect(store.getState().ble.bluetoothDevices[0].deviceType).toBe(deviceType.cza1300);
  });
});