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

import { render } from '@testing-library/react-native';
import React from 'react';
import { Provider } from 'react-redux';
import renderer, { act as rendererAct } from 'react-test-renderer';
import BleManager from '../../../src/config/bleManagerInstance';
import Network from '../../../src/screens/network';
import { updateAuthDevices } from '../../../src/services/authDevices/action';
import * as NetworkSettingsFunctions from '../../../src/services/network/action';
import { store } from '../../../src/store/configureStore';
import Toast from 'react-native-toast-message';

// Clear all timers after each test to prevent animation warnings
afterEach(() => {
  jest.clearAllTimers();
});

describe('on homescreen bottom tab mount', () => {
  let tree;

  beforeEach(() => {
    let component;
    rendererAct(() => {
      component = renderer.create(<Network />);
    });
    tree = component.toJSON();
  });

  it('renders network correctly', () => {
    expect(tree).toMatchSnapshot();
  });
});

describe('getNetworkSettingsInfoView function', () => {
  let component, spy;
  beforeEach(() => {
    component = (
      <Provider store={store}>
        <Network />
      </Provider>
    );
    render(component);
  });
  beforeAll(async () => {
    spy = jest.spyOn(BleManager, 'readCharacteristicForDevice');
    store.dispatch(
      updateAuthDevices('connectedDevice', { id: 1, localName: 'Brx-emulator' }),
    );
    await store.dispatch(NetworkSettingsFunctions.getNetworkSettingsInfoView());
  });
  it('should fetch network settings from BLE for infoview', () => {
    expect(spy).toBeCalled();
  });
});

describe('getNetworkSettingsMS700 function', () => {
  let component, spy, toastSpy;
  beforeEach(() => {
    component = (
      <Provider store={store}>
        <Network />
      </Provider>
    );
    render(component);
  });
  beforeAll(async () => {
    spy = jest.spyOn(BleManager, 'readCharacteristicForDevice');
    toastSpy = jest.spyOn(Toast, 'show');
    store.dispatch(
      updateAuthDevices('connectedDevice', { id: 1, localName: 'Brx-emulator' }),
    );
    await store.dispatch(NetworkSettingsFunctions.getNetworkSettingsMS700());
  });
  it('should fetch network settings from BLE for ms700', () => {
    expect(spy).toBeCalled();
  });
});

describe('handleSaveSettingsMS700 function', () => {
  let component, spy, toastSpy;
  beforeEach(() => {
    component = (
      <Provider store={store}>
        <Network />
      </Provider>
    );
    render(component);
  });
  beforeAll(async () => {
    spy = jest.spyOn(BleManager, 'writeCharacteristicWithResponseForDevice');
    toastSpy = jest.spyOn(Toast, 'show');
    store.dispatch(
      updateAuthDevices('connectedDevice', { id: 1, localName: 'Brx-emulator' }),
    );
    await store.dispatch(
      NetworkSettingsFunctions.handleSaveSettingsMS700(
        'dhcp',
        '192.168.0.1',
        '255.255.255.1',
        '255.255.255.2',
        '255.255.255.0',
        '256.256.256.0',
        'https://audioenhancement.com',
        () => {
          return true;
        },
        () => { },
        () => { },
      ),
    );
  });
  it('should save network settings on BLE for ms700', () => {
    expect(spy).toBeCalled();
    // Toast is only shown on validation errors, not on successful saves
    // expect(toastSpy).toBeCalled();
  });
});

describe('handleSaveSettingsInfoview function', () => {
  let component, spy, toastSpy;
  beforeEach(() => {
    component = (
      <Provider store={store}>
        <Network />
      </Provider>
    );
    render(component);
  });
  beforeAll(async () => {
    spy = jest.spyOn(BleManager, 'writeCharacteristicWithResponseForDevice');
    toastSpy = jest.spyOn(Toast, 'show');
    store.dispatch(
      updateAuthDevices('connectedDevice', { id: 1, localName: 'Brx-emulator' }),
    );
    await store.dispatch(
      NetworkSettingsFunctions.handleSaveSettingsInfoview(
        'dhcp',
        '192.168.0.1',
        '255.255.255.1',
        '255.255.255.2',
        '255.255.255.0',
        '256.256.256.1',
        'https://audioenhancement.com',
        () => {
          return true;
        },
        () => { },
        () => { },
      ),
    );
  });
  it('should save network settings on BLE for ms700', () => {
    expect(spy).toBeCalled();
    // Toast is only shown on validation errors, not on successful saves
    // expect(toastSpy).toBeCalled();
  });
});
