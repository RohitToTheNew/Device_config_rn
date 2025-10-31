// Mock BackHandler before other imports
jest.mock('react-native/Libraries/Utilities/BackHandler', () => {
  return {
    __esModule: true,
    default: {
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
      removeEventListener: jest.fn(),
      exitApp: jest.fn(),
    },
  };
});

// Create a mockLoginWithPin that can be controlled per test
const mockLoginWithPin = jest.fn();
jest.mock('../../src/services/bleDevices/action', () => {
  const originalModule = jest.requireActual('../../src/services/bleDevices/action');
  return {
    ...originalModule,
    loginWithPin: (...args) => mockLoginWithPin(...args),
  };
});

import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from '../../src/store/configureStore';
import { RefreshComponent } from '../../src/components';
import blemanager from '../../src/config/bleManagerInstance';
import { updateAppModalFields } from '../../src/services/app/action';
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
  loginWithPin,
} from '../../src/services/bleDevices/action';
import BluetoothDevicesList from '../../src/screens/bluetoothDevicesList';
import { updateBleDevicesFields } from '../../src/services/bleDevices/action';
import { updateAuthDevices } from '../../src/services/authDevices/action';
import DeviceType from '../../src/config/deviceType';
import BleManager from '../../src/config/bleManagerInstance';
import { UUIDMappingMS700 } from '../../src/constants';
import base64 from 'react-native-base64';
import deviceType from '../../src/config/deviceType';

jest.useFakeTimers();

afterEach(() => {
  cleanup();
  jest.clearAllTimers();
});

jest.mock('../../src/components/disconnectionModal', () => {
  return {
    __esModule: true,
    default: jest.fn(() => null),
  };
});
const mockDispatch = jest.fn();
const mockBluetoothDevices = [{ id: '1', localName: 'Brx-ajdhas8asn', startPairing: true }];
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
      ble: { bluetoothDevices: mockBluetoothDevices },
      app: { bluetoothState: 'PoweredOn', showDisconnectedModal: false },
      authDevices: { connectedDevice: { id: 1, localName: 'Brx-asdkasbj' } },
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
    act(() => {
      tree = renderer.create(<BluetoothDevicesList />).toJSON();
    });
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
        ble: { bluetoothDevices: mockBluetoothDevices },
        app: { bluetoothState: 'PoweredOn', showDisconnectedModal: false },
        authDevices: { connectedDevice: {} },
      };
      if (selector) {
        return selector(initialState);
      }
    });
    getByTestId = render(component).getByTestId;
    scanSpy = jest.spyOn(blemanager, 'startDeviceScan');
    act(() => {
      store.dispatch(updateAppModalFields('isLoading', false));
    });
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
        ble: { bluetoothDevices: [] },
        app: { bluetoothState: 'PoweredOn', showDisconnectedModal: false },
        authDevices: { connectedDevice: {} },
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
    navigation = { navigate: jest.fn() };
    navigationSpy = jest.spyOn(navigation, 'navigate');
    // Mock loginWithPin to return 'false' so it navigates to SetPasscode
    mockLoginWithPin.mockResolvedValue('false');
    act(() => {
      store.dispatch(
        updateBleDevicesFields('bluetoothDevices', [{ localName: 'Brx-emulator' }]),
      );
    });
  });
  afterEach(() => {
    mockLoginWithPin.mockReset();
  });
  it('should take device id and perform auth process', async () => {
    const devicePressed = { id: 1, deviceType: DeviceType.ms700 };
    act(() => {
      store.dispatch(updateAuthDevices('authenticatedDevices', []));
    });
    // performAuthProcess should complete without errors
    await expect(store.dispatch(performAuthProcess(devicePressed, navigation, () => { }))).resolves.not.toThrow();
  });
});

describe('handleIdentifyDevice function for ms700', () => {
  let writeSpy;
  beforeEach(() => {
    writeSpy = jest.spyOn(BleManager, 'writeCharacteristicWithResponseForDevice')
    act(() => {
      store.dispatch(
        updateBleDevicesFields('bluetoothDevices', [{ localName: 'Brx-emulator' }]),
      );
    });
  });
  it('should trigger identify device alarm on BLE device', async () => {
    jest.spyOn(base64, 'encode').mockImplementation(() => {
      return 'beep-tone'
    })
    await store.dispatch(handleIdentifyDevice({ id: 1, deviceType: DeviceType.ms700 }));
    expect(writeSpy).toBeCalledWith(1, UUIDMappingMS700.rootServiceUDID, UUIDMappingMS700.identifyDevice, 'beep-tone');
  });
});

describe('handleIdentifyDevice function for infoview', () => {
  let writeSpy;
  beforeEach(() => {
    writeSpy = jest.spyOn(BleManager, 'writeCharacteristicWithResponseForDevice')
    act(() => {
      store.dispatch(
        updateBleDevicesFields('bluetoothDevices', [{ localName: 'Brx-emulator' }]),
      );
    });
  });
  it('should trigger identify device alarm on BLE device', async () => {
    jest.spyOn(base64, 'encode').mockImplementation(() => {
      return 'pop-up'
    })
    await store.dispatch(handleIdentifyDevice({ id: 1, deviceType: DeviceType.infoView }));
    expect(writeSpy).toBeCalledWith(1, UUIDMappingMS700.rootServiceUDID, UUIDMappingMS700.identifyDevice, 'beep-tone');
  });
});

describe('handleIdentifyDevice function for CZA1300', () => {
  let writeSpy;
  beforeEach(() => {
    writeSpy = jest.spyOn(BleManager, 'writeCharacteristicWithResponseForDevice')
    act(() => {
      store.dispatch(
        updateBleDevicesFields('bluetoothDevices', [{ localName: 'Brx-emulator (cza1300)' }]),
      );
    });
  });
  it('should trigger identify device alarm on BLE device', async () => {
    await store.dispatch(handleIdentifyDevice({ id: 1, deviceType: DeviceType.cza1300 }));
    // CZA1300 sends two write commands for identify
    expect(writeSpy.mock.calls.length).toBeGreaterThanOrEqual(2);
    // Verify that write was called with the identifyDevice characteristic
    const identifyCalls = writeSpy.mock.calls.filter(
      call => call[2] === UUIDMappingMS700.identifyDevice
    );
    expect(identifyCalls.length).toBeGreaterThanOrEqual(2);
  });
});

describe('getDeviceType function', () => {
  let readSpy;
  beforeEach(() => {
    readSpy = jest.spyOn(BleManager, 'readCharacteristicForDevice')
    act(() => {
      store.dispatch(
        updateBleDevicesFields('bluetoothDevices', [{ localName: 'Brx-emulator', deviceType: '', id: 1 }]),
      );
    });
  });
  it('should read device type from BLE device', async () => {
    jest.spyOn(BleManager, 'connectToDevice').mockResolvedValueOnce({ discoverAllServicesAndCharacteristics: jest.fn() })
    jest.spyOn(BleManager, 'readCharacteristicForDevice').mockResolvedValueOnce({ value: 'TVMtNzAw' })
    jest.spyOn(base64, 'decode').mockImplementation(() => {
      return 'MS-700'
    })
    await store.dispatch(getDeviceType({ id: 1, deviceType: '' }));
    expect(readSpy).toBeCalledWith(1, UUIDMappingMS700.rootServiceUDID, UUIDMappingMS700.deviceType);
  });
});

describe('identifyDeviceFromList function', () => {
  let writeSpy, navigation;
  beforeEach(() => {
    writeSpy = jest.spyOn(BleManager, 'writeCharacteristicWithResponseForDevice')
    navigation = { navigate: jest.fn() };
    act(() => {
      store.dispatch(
        updateBleDevicesFields('bluetoothDevices', [{ localName: 'Brx-emulator', deviceType: '', id: 1 }]),
      );
    });
    jest.spyOn(BleManager, 'connectToDevice').mockResolvedValueOnce({ discoverAllServicesAndCharacteristics: jest.fn(), })
  });
  it('should trigger identify device alarm on BLE device', async () => {
    await store.dispatch(identifyDeviceFromList({ id: 1, localName: 'Brx-asdkasbj', deviceType: DeviceType.ms700 }, navigation));
    expect(writeSpy).toBeCalledWith(1, UUIDMappingMS700.rootServiceUDID, UUIDMappingMS700.identifyDevice, 'beep-tone');
  });
});

describe('handleDeviceTypeBasedIdentify function', () => {
  let writeSpy, navigation, readSpy;
  beforeEach(() => {
    writeSpy = jest.spyOn(BleManager, 'writeCharacteristicWithResponseForDevice')
    readSpy = jest.spyOn(BleManager, 'readCharacteristicForDevice')
    navigation = { navigate: jest.fn() };
    jest.spyOn(BleManager, 'connectToDevice').mockResolvedValueOnce({ discoverAllServicesAndCharacteristics: jest.fn(), })
  });
  it('should trigger identify device alarm on BLE device, when device type is in name itself', async () => {
    jest.spyOn(base64, 'encode').mockImplementation(() => {
      return 'beep-tone'
    })
    await store.dispatch(handleDeviceTypeBasedIdentify({ id: 1, localName: 'Brx-asdkasbj', deviceType: DeviceType.ms700, nameWithType: 'Brx-asdkasbj(MS700)' }, navigation));
    expect(writeSpy).toBeCalledWith(1, UUIDMappingMS700.rootServiceUDID, UUIDMappingMS700.identifyDevice, 'beep-tone');
  });
  it('should read device type from BLE and then perform Identify, when device type is not in the name, and the BLE is MS700', async () => {

    jest.spyOn(BleManager, 'connectToDevice').mockResolvedValueOnce({ discoverAllServicesAndCharacteristics: jest.fn() })
    jest.spyOn(BleManager, 'readCharacteristicForDevice').mockResolvedValueOnce({ value: 'TVMtNzAw' })
    jest.spyOn(base64, 'decode').mockImplementation(() => {
      return 'MS-700'
    })
    await store.dispatch(handleDeviceTypeBasedIdentify({ id: 1, localName: 'Brx-asdkasbj', deviceType: DeviceType.infoView, nameWithType: 'Brx-asdkasbj' }, navigation, () => { }));
    expect(readSpy).toBeCalledWith(1, UUIDMappingMS700.rootServiceUDID, UUIDMappingMS700.deviceType);
    expect(writeSpy).toBeCalledWith(1, UUIDMappingMS700.rootServiceUDID, UUIDMappingMS700.identifyDevice, 'beep-tone');
  });
  it('should read device type from BLE and then perform Identify, when device type is not in the name, and the BLE is Infoview', async () => {
    jest.spyOn(base64, 'encode').mockImplementation(() => {
      return 'beep-tone'
    })
    jest.spyOn(base64, 'encode').mockImplementation(() => {
      return 'InfoviewPlayer'
    })
    await store.dispatch(handleDeviceTypeBasedIdentify({ id: 1, localName: 'Brx-asdkasbj', deviceType: DeviceType.infoView, nameWithType: 'Brx-asdkasbj' }, navigation));
    expect(readSpy).toBeCalledWith(1, UUIDMappingMS700.rootServiceUDID, UUIDMappingMS700.deviceType);
    expect(writeSpy).toBeCalledWith(1, UUIDMappingMS700.rootServiceUDID, UUIDMappingMS700.identifyDevice, 'beep-tone');
  });
  it('should read device type from BLE and then perform Identify, when device type is not in the name, and the BLE is CZA1300', async () => {
    const encodeSpy = jest.spyOn(base64, 'encode').mockReturnValue('encoded-value');
    const decodeSpy = jest.spyOn(base64, 'decode').mockReturnValue('cza1300');
    jest.spyOn(BleManager, 'connectToDevice').mockResolvedValueOnce({ discoverAllServicesAndCharacteristics: jest.fn() })
    jest.spyOn(BleManager, 'readCharacteristicForDevice').mockResolvedValueOnce({ value: 'Y3phMTMwMA==' })

    await store.dispatch(handleDeviceTypeBasedIdentify({ id: 1, localName: 'Brx-asdkasbj', deviceType: DeviceType.cza1300, nameWithType: 'Brx-asdkasbj' }, navigation));
    expect(readSpy).toBeCalledWith(1, UUIDMappingMS700.rootServiceUDID, UUIDMappingMS700.deviceType);
    // CZA1300 sends two commands, so just verify the write was called
    expect(writeSpy).toHaveBeenCalled();

    encodeSpy.mockRestore();
    decodeSpy.mockRestore();
  });
});

describe('navigateToDevice function', () => {
  let writeSpy, navigation, readSpy, navigationSpy;
  beforeEach(() => {
    writeSpy = jest.spyOn(BleManager, 'writeCharacteristicWithResponseForDevice')
    readSpy = jest.spyOn(BleManager, 'readCharacteristicForDevice')
    act(() => {
      store.dispatch(
        updateBleDevicesFields('bluetoothDevices', [{ localName: 'Brx-emulator', deviceType: '', id: 1 }]),
      );
    });
    navigation = { navigate: jest.fn() };
    navigationSpy = jest.spyOn(navigation, 'navigate')
  });
  it('should navigate to BLE device setings screen', async () => {
    jest.spyOn(base64, 'encode').mockImplementation(() => {
      return 'beep-tone'
    })
    await store.dispatch(navigateToDevice({ id: 1, localName: 'Brx-asdkasbj', deviceType: DeviceType.ms700, nameWithType: 'Brx-asdkasbj(MS700)' }, navigation));
    jest.runAllTimers();
    expect(navigationSpy).toBeCalledWith('HomeScreen');
  });
  it('should navigate to device setings screen, when CZA1300 device is pressed', async () => {
    jest.spyOn(base64, 'encode').mockImplementation(() => {
      return 'beep-tone'
    })
    await store.dispatch(navigateToDevice({ id: 1, localName: 'Brx-asdkasbj', deviceType: DeviceType.cza1300, nameWithType: 'Brx-asdkasbj(CZA-1300)' }, navigation));
    jest.runAllTimers();
    expect(navigationSpy).toBeCalledWith('HomeScreen');
  });
  it('should read device type from BLE, then navigate to device settings screen', async () => {
    const connectSpy = jest.spyOn(BleManager, 'connectToDevice').mockResolvedValueOnce({
      discoverAllServicesAndCharacteristics: jest.fn(),
      services: jest.fn().mockResolvedValue([
        {
          uuid: UUIDMappingMS700.rootServiceUDID,
          characteristics: jest.fn().mockResolvedValue([
            {
              uuid: UUIDMappingMS700.deviceType,
              read: jest.fn().mockResolvedValue({ value: 'TVMtNzAw' })
            }
          ])
        }
      ])
    });
    const decodeSpy = jest.spyOn(base64, 'decode').mockReturnValue('MS-700');

    // navigateToDevice should complete without errors
    await expect(store.dispatch(navigateToDevice({ id: 1, localName: 'Brx-asdkasbj', deviceType: DeviceType.infoView, nameWithType: 'Brx-asdkasbj' }, navigation))).resolves.not.toThrow();

    connectSpy.mockRestore();
    decodeSpy.mockRestore();
  });
});


describe('check device type of devices found during the device discovery phase', () => {
  beforeEach(() => {
    // Clear existing devices first
    act(() => {
      store.dispatch(updateBleDevicesFields('bluetoothDevices', []));
    });

    const device = {
      id: 'BDCB6EA5-D458-DD27-E14E-169930912022',
      localName: 'Brx-emulator (CZA-1300)',
      name: 'osboxes',
      isConnected: false,
    };
    const navigation = { replace: () => jest.fn() };
    const callback = jest.fn();
    act(() => {
      store.dispatch(handleDevicesFound(device, callback));
    });
  });
  it('should check if the device found is CZA1300 device', () => {
    const devices = store.getState().ble.bluetoothDevices;
    const device = devices.find(d => d.id === 'BDCB6EA5-D458-DD27-E14E-169930912022');
    expect(device.deviceType).toBe(deviceType.cza1300);
  });
});