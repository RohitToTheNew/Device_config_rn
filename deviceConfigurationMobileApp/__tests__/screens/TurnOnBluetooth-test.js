import React from 'react';
import {Linking} from 'react-native';
import {Provider} from 'react-redux';
import renderer from 'react-test-renderer';
import {BleManager} from 'react-native-ble-plx';
import {store} from '../../src/store/configureStore';
import TurnOnBluetooth from '../../src/screens/turnOnBluetooth';
import {translate} from '../../src/translations/translationHelper';
import {updateAppModalFields} from '../../src/services/app/action';
import {
  render,
  screen,
  fireEvent,
  cleanup,
} from '@testing-library/react-native';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {handleDevicesFoundInDiscovery} from '../../src/services/turnOnBluetooth/action';
import { NavigationContainer } from '@react-navigation/native';
import deviceType from '../../src/config/deviceType';

const mockStore = configureMockStore([thunk]);

afterEach(cleanup);
jest.useFakeTimers();

describe('TurnOnBluetooth Screen', () => {
  let tree;

  beforeEach(() => {
    const store = mockStore({
      app: {bluetoothState: 'PoweredOff', appState: 'active'},
      ble: {bluetoothDevices: []},
      authDevices: {connectedDevice: {}},
    });
    jest.mock('@react-navigation/native', () => ({
      useIsFocused: jest.fn(),
    }));    
    tree = renderer.create(
    <NavigationContainer>
      <TurnOnBluetooth />
    </NavigationContainer>
    ).toJSON();
  });

  it('should render TurnOnBluetooth screen correctly', () => {
    expect(tree).toMatchSnapshot();
  });
});

describe('on landing to TurnOnBluetoothScreen', () => {
  let props,
    bleManager,
    component,
    linkingSpy,
    bluetoothState,
    getByTestId,
    scannerSpy;

  beforeEach(() => {
    props = {navigation: {navigate: () => jest.fn()}};
    bleManager = new BleManager(true);
    component = (
      <Provider store={store}>
        <NavigationContainer>
        <TurnOnBluetooth />
        </NavigationContainer>
      </Provider>
    );
    getByTestId = render(component).getByTestId;
    linkingSpy = jest.spyOn(Linking, 'openURL').mockImplementation(() => {
      store.dispatch(updateAppModalFields('bluetoothState', 'PoweredOn'));
      bleManager.startDeviceScan(
        null,
        {allowDuplicates: false},
        async args => {},
      );
    });
    bluetoothState = store.getState().app.bluetoothState;
    fireEvent.press(getByTestId('turnOnButton'));
    scannerSpy = jest.spyOn(bleManager, 'startDeviceScan');
  });

  it('should turnOn bluetooth if it is off', () => {
    expect(screen.getByText(translate('turnOn'))).toBeTruthy();
    expect(screen.getByTestId('lottieWave')).toBeTruthy();
    expect(bluetoothState).toBe('PoweredOff');
    expect(linkingSpy).toBeCalled();
    setTimeout(() => {
      expect(bluetoothState).toBe('PoweredOn');
    }, 100);
    setTimeout(() => {
      expect(scannerSpy).toBeCalled();
    }, 100);
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
    const navigation = {replace: () => jest.fn()};
    store.dispatch(handleDevicesFoundInDiscovery(device, navigation));
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
    const navigation = {replace: () => jest.fn()};
    store.dispatch(handleDevicesFoundInDiscovery(device, navigation));
  });
  it('should check if the device found is CZA1300 device', () => {
    expect(store.getState().ble.bluetoothDevices[0].deviceType).toBe(deviceType.cza1300);
  });
});