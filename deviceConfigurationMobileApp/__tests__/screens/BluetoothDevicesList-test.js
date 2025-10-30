import React from 'react';
import renderer from 'react-test-renderer';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {store} from '../../src/store/configureStore';
import {RefreshComponent} from '../../src/components';
import blemanager from '../../src/config/bleManagerInstance';
import {updateAppModalFields} from '../../src/services/app/action';
import {
  render,
  screen,
  fireEvent,
  cleanup,
} from '@testing-library/react-native';
import {
  getDeviceType,
  handleDevicesFound,
  handleDeviceTypeBasedIdentify,
  handleIdentifyDevice,
  identifyDeviceFromList,
  navigateToDevice,
  performAuthProcess,
} from '../../src/services/bleDevices/action';
import BluetoothDevicesList from '../../src/screens/bluetoothDevicesList';
import {updateBleDevicesFields} from '../../src/services/bleDevices/action';
import {updateAuthDevices} from '../../src/services/authDevices/action';
import DeviceType from '../../src/config/deviceType';
import BleManager from '../../src/config/bleManagerInstance';
import { UUIDMappingMS700 } from '../../src/constants';
import base64 from 'react-native-base64';
import deviceType from '../../src/config/deviceType';

afterEach(cleanup);
jest.mock('../../src/components/disconnectionModal', () => {
  return {
    __esModule: true,
    default: jest.fn(() => null),
  };
});
const mockDispatch = jest.fn();
const mockBluetoothDevices = [{id: '1', localName: 'Brx-ajdhas8asn',startPairing:true}];
useDispatch.mockReturnValue(mockDispatch);
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn().mockImplementation(mockDispatch),
}));

jest.mock('@react-navigation/native', () => ({
  useIsFocused: jest.fn(),
}));

beforeEach(() => {
  useSelector.mockImplementation(selector => {
    const initialState = {
      ble: {bluetoothDevices: mockBluetoothDevices},
      app: {bluetoothState: 'PoweredOn', showDisconnectedModal: false},
      authDevices: {connectedDevice: {id: 1, localName: 'Brx-asdkasbj'}},
    };
    if (selector) {
      return selector(initialState);
    }
  });

  useDispatch.mockReturnValue(mockDispatch);
});

describe('on landing to bluetooth devices list', () => {
  let tree;

  beforeEach(() => {
    tree = renderer.create(<BluetoothDevicesList />).toJSON();
  });
  it('should render devices list correctly', () => {
    expect(tree).toMatchSnapshot();
  });
});

describe('Bluetooth devices list found during discovery', () => {
  let component, scanSpy;
  beforeEach(() => {
    component = (
      <>
        <RefreshComponent />
        <BluetoothDevicesList />
      </>
    );
    useSelector.mockImplementation(selector => {
      const initialState = {
        ble: {bluetoothDevices: mockBluetoothDevices},
        app: {bluetoothState: 'PoweredOn', showDisconnectedModal: false},
        authDevices: {connectedDevice: {}},
      };
      if (selector) {
        return selector(initialState);
      }
    });
    getByTestId = render(component).getByTestId;
    scanSpy = jest.spyOn(blemanager, 'startDeviceScan');
    store.dispatch(updateAppModalFields('isLoading', false));
  });
  it('should render devices list screen', () => {
      expect(screen.getByTestId('devicesList')).toBeTruthy();
      expect(screen.getByTestId('bluetoothDeviceItem')).toBeTruthy();
  });
});

describe('No Bluetooth devices found during discovery', () => {
  let component, getByTestId;
  beforeEach(() => {
    component = (
        <BluetoothDevicesList />
    );
    useSelector.mockImplementation(selector => {
      const initialState = {
        ble: {bluetoothDevices: []},
        app: {bluetoothState: 'PoweredOn', showDisconnectedModal: false},
        authDevices: {connectedDevice: {}},
      };
      if (selector) {
        return selector(initialState);
      }
    });
    getByTestId = render(component).getByTestId;
  });
  it('should render no device screen', () => {
    expect(screen.getByTestId('noDevicesComponent')).toBeTruthy();
  });
});

describe('performAuthProcess function', () => {
  let navigation, navigationSpy;
  beforeEach(() => {
    navigation = {navigate: jest.fn()};
    navigationSpy = jest.spyOn(navigation, 'navigate');
    store.dispatch(
      updateBleDevicesFields('bluetoothDevices', [{localName: 'Brx-emulator'}]),
    );
  });
  it('should take device id and perform auth process', async () => {
    store.dispatch(updateAuthDevices('authenticatedDevices', []));
    await store.dispatch(performAuthProcess({deviceId:1,deviceType:DeviceType.ms700}, navigation, ()=>{}));
    expect(navigationSpy).toBeCalledWith('SetPasscode',{isUpdateScreen: false, devicePressed:{deviceId:1,deviceType:DeviceType.ms700}});
  });
});

describe('handleIdentifyDevice function for ms700', () => {
  let writeSpy;
  beforeEach(() => {
    writeSpy = jest.spyOn(BleManager, 'writeCharacteristicWithResponseForDevice')
    store.dispatch(
      updateBleDevicesFields('bluetoothDevices', [{localName: 'Brx-emulator'}]),
    );
  });
  it('should trigger identify device alarm on BLE device', async () => {
    jest.spyOn(base64,'encode').mockImplementation(()=>{
      return 'beep-tone'
    })
    await store.dispatch(handleIdentifyDevice({id:1, deviceType:DeviceType.ms700}));
    expect(writeSpy).toBeCalledWith(1,UUIDMappingMS700.rootServiceUDID, UUIDMappingMS700.identifyDevice,'beep-tone');
  });
});

describe('handleIdentifyDevice function for infoview', () => {
  let writeSpy;
  beforeEach(() => {
    writeSpy = jest.spyOn(BleManager, 'writeCharacteristicWithResponseForDevice')
    store.dispatch(
      updateBleDevicesFields('bluetoothDevices', [{localName: 'Brx-emulator'}]),
    );
  });
  it('should trigger identify device alarm on BLE device', async () => {
    jest.spyOn(base64,'encode').mockImplementation(()=>{
      return 'pop-up'
    })
    await store.dispatch(handleIdentifyDevice({id:1, deviceType:DeviceType.infoView}));
    expect(writeSpy).toBeCalledWith(1,UUIDMappingMS700.rootServiceUDID, UUIDMappingMS700.identifyDevice,'beep-tone');
  });
});

describe('handleIdentifyDevice function for CZA1300', () => {
  let writeSpy;
  beforeEach(() => {
    writeSpy = jest.spyOn(BleManager, 'writeCharacteristicWithResponseForDevice')
    store.dispatch(
      updateBleDevicesFields('bluetoothDevices', [{localName: 'Brx-emulator (cza1300)'}]),
    );
  });
  it('should trigger identify device alarm on BLE device', async () => {
    jest.spyOn(base64,'encode').mockImplementation(()=>{
      return 'blink-leds'
    })
    await store.dispatch(handleIdentifyDevice({id:1, deviceType:DeviceType.cza1300}));
    expect(writeSpy).toBeCalledWith(1,UUIDMappingMS700.rootServiceUDID, UUIDMappingMS700.identifyDevice,'blink-leds');
  });
});

describe('getDeviceType function', () => {
  let readSpy;
  beforeEach(() => {
    readSpy = jest.spyOn(BleManager, 'readCharacteristicForDevice')
    store.dispatch(
      updateBleDevicesFields('bluetoothDevices', [{localName: 'Brx-emulator', deviceType:'',id:1}]),
    );
  });
  it('should read device type from BLE device', async () => {
    jest.spyOn(BleManager,'connectToDevice').mockResolvedValueOnce({discoverAllServicesAndCharacteristics: jest.fn()})
    jest.spyOn(BleManager,'readCharacteristicForDevice').mockResolvedValueOnce({value: 'TVMtNzAw'})
    jest.spyOn(base64,'decode').mockImplementation(()=>{
      return 'MS-700'
    })
    await store.dispatch(getDeviceType({id:1,deviceType:''}));
    expect(readSpy).toBeCalledWith(1,UUIDMappingMS700.rootServiceUDID, UUIDMappingMS700.deviceType);
  });
});

describe('identifyDeviceFromList function', () => {
  let writeSpy, navigation;
  beforeEach(() => {
    writeSpy = jest.spyOn(BleManager, 'writeCharacteristicWithResponseForDevice')
    navigation = {navigate: jest.fn()};
    store.dispatch(
      updateBleDevicesFields('bluetoothDevices', [{localName: 'Brx-emulator', deviceType:'',id:1}]),
    );
    jest.spyOn(BleManager,'connectToDevice').mockResolvedValueOnce({discoverAllServicesAndCharacteristics: jest.fn(), })
  });
  it('should trigger identify device alarm on BLE device', async () => {
    await store.dispatch(identifyDeviceFromList({id: 1, localName: 'Brx-asdkasbj', deviceType:DeviceType.ms700},navigation));
    expect(writeSpy).toBeCalledWith(1,UUIDMappingMS700.rootServiceUDID, UUIDMappingMS700.identifyDevice,'beep-tone');
  });
});

describe('handleDeviceTypeBasedIdentify function', () => {
  let writeSpy, navigation, readSpy;
  beforeEach(() => {
    writeSpy = jest.spyOn(BleManager, 'writeCharacteristicWithResponseForDevice')
    readSpy = jest.spyOn(BleManager, 'readCharacteristicForDevice')
    navigation = {navigate: jest.fn()};
    jest.spyOn(BleManager,'connectToDevice').mockResolvedValueOnce({discoverAllServicesAndCharacteristics: jest.fn(), })
  });
  it('should trigger identify device alarm on BLE device, when device type is in name itself', async () => {
    jest.spyOn(base64,'encode').mockImplementation(()=>{
      return 'beep-tone'
    }) 
    await store.dispatch(handleDeviceTypeBasedIdentify({id: 1, localName: 'Brx-asdkasbj', deviceType:DeviceType.ms700, nameWithType:'Brx-asdkasbj(MS700)' },navigation));
    expect(writeSpy).toBeCalledWith(1,UUIDMappingMS700.rootServiceUDID, UUIDMappingMS700.identifyDevice,'beep-tone');
  });
  it('should read device type from BLE and then perform Identify, when device type is not in the name, and the BLE is MS700', async () => {

    jest.spyOn(BleManager,'connectToDevice').mockResolvedValueOnce({discoverAllServicesAndCharacteristics: jest.fn()})
    jest.spyOn(BleManager,'readCharacteristicForDevice').mockResolvedValueOnce({value: 'TVMtNzAw'})
    jest.spyOn(base64,'decode').mockImplementation(()=>{
      return 'MS-700'
    })
    await store.dispatch(handleDeviceTypeBasedIdentify({id: 1, localName: 'Brx-asdkasbj', deviceType:DeviceType.infoView, nameWithType:'Brx-asdkasbj'},navigation,()=>{}));
    expect(readSpy).toBeCalledWith(1,UUIDMappingMS700.rootServiceUDID, UUIDMappingMS700.deviceType);
    expect(writeSpy).toBeCalledWith(1,UUIDMappingMS700.rootServiceUDID, UUIDMappingMS700.identifyDevice,'beep-tone');
  });
  it('should read device type from BLE and then perform Identify, when device type is not in the name, and the BLE is Infoview', async () => {
    jest.spyOn(base64,'encode').mockImplementation(()=>{
      return 'beep-tone'
    }) 
    jest.spyOn(base64,'encode').mockImplementation(()=>{
      return 'InfoviewPlayer'
    }) 
    await store.dispatch(handleDeviceTypeBasedIdentify({id: 1, localName: 'Brx-asdkasbj', deviceType:DeviceType.infoView, nameWithType:'Brx-asdkasbj' },navigation));
    expect(readSpy).toBeCalledWith(1,UUIDMappingMS700.rootServiceUDID, UUIDMappingMS700.deviceType);
    expect(writeSpy).toBeCalledWith(1,UUIDMappingMS700.rootServiceUDID, UUIDMappingMS700.identifyDevice,'beep-tone');
  });
  it('should read device type from BLE and then perform Identify, when device type is not in the name, and the BLE is CZA1300', async () => {
    jest.spyOn(base64,'encode').mockImplementation(()=>{
      return 'blink-leds'
    }) 
    jest.spyOn(base64,'encode').mockImplementation(()=>{
      return 'cza1300'
    }) 
    await store.dispatch(handleDeviceTypeBasedIdentify({id: 1, localName: 'Brx-asdkasbj', deviceType:DeviceType.cza1300, nameWithType:'Brx-asdkasbj' },navigation));
    expect(readSpy).toBeCalledWith(1,UUIDMappingMS700.rootServiceUDID, UUIDMappingMS700.deviceType);
    expect(writeSpy).toBeCalledWith(1,UUIDMappingMS700.rootServiceUDID, UUIDMappingMS700.identifyDevice,'blink-leds');
  });
});

describe('navigateToDevice function', () => {
  let writeSpy, navigation, readSpy, navigationSpy;
  beforeEach(() => {
    writeSpy = jest.spyOn(BleManager, 'writeCharacteristicWithResponseForDevice')
    readSpy = jest.spyOn(BleManager, 'readCharacteristicForDevice')
    store.dispatch(
      updateBleDevicesFields('bluetoothDevices', [{localName: 'Brx-emulator', deviceType:'',id:1}]),
    );
    navigation = {navigate: jest.fn()};
    navigationSpy = jest.spyOn(navigation,'navigate')
  });
  it('should navigate to BLE device setings screen', async () => {
    jest.spyOn(base64,'encode').mockImplementation(()=>{
      return 'beep-tone'
    }) 
    await store.dispatch(navigateToDevice({id: 1, localName: 'Brx-asdkasbj', deviceType:DeviceType.ms700, nameWithType:'Brx-asdkasbj(MS700)' },navigation));
    expect(navigationSpy).toBeCalledWith('HomeScreen');
  });
  it('should navigate to device setings screen, when CZA1300 device is pressed', async () => {
    jest.spyOn(base64,'encode').mockImplementation(()=>{
      return 'beep-tone'
    }) 
    await store.dispatch(navigateToDevice({id: 1, localName: 'Brx-asdkasbj', deviceType:DeviceType.cza1300, nameWithType:'Brx-asdkasbj(CZA-1300)' },navigation));
    expect(navigationSpy).toBeCalledWith('HomeScreen');
  });
  it('should read device type from BLE, then navigate to device settings screen', async () => {
    jest.spyOn(BleManager,'connectToDevice').mockResolvedValueOnce({discoverAllServicesAndCharacteristics: jest.fn()})
    jest.spyOn(BleManager,'readCharacteristicForDevice').mockResolvedValueOnce({value: 'TVMtNzAw'})
    jest.spyOn(base64,'decode').mockImplementation(()=>{
      return 'MS-700'
    })
    await store.dispatch(navigateToDevice({id: 1, localName: 'Brx-asdkasbj', deviceType:DeviceType.infoView, nameWithType:'Brx-asdkasbj' },navigation));
    expect(readSpy).toBeCalledWith(1,UUIDMappingMS700.rootServiceUDID, UUIDMappingMS700.deviceType);
    expect(navigationSpy).toBeCalledWith('HomeScreen');
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
    const callback = jest.fn();
    store.dispatch(handleDevicesFound(device,callback));
  });
  it('should check if the device found is CZA1300 device', () => {
    expect(store.getState().ble.bluetoothDevices[0].deviceType).toBe(deviceType.cza1300);
  });
});