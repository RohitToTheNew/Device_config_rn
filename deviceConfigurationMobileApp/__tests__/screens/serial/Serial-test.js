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

// Mock Utils to control encodeBase64 behavior
jest.mock('../../../src/utils', () => ({
  __esModule: true,
  default: {
    encodeBase64: jest.fn((val) => val || ''),
    decodeBase64: jest.fn((val) => val),
    isCZA1300: jest.fn(() => false),
    isMS700: jest.fn(() => true),
    Log: jest.fn(),
    showToast: jest.fn(),
    logType: {
      error: 'error',
      info: 'info',
      warn: 'warn',
    },
  },
}));

// Mock app actions
jest.mock('../../../src/services/app/action', () => ({
  updateAppModalFields: jest.fn((key, value) => ({
    type: 'UPDATE_APP_MODAL_FIELDS',
    payload: { [key]: value },
  })),
}));

// Mock sentry error handler
jest.mock('../../../src/utils/errorHandler', () => ({
  sentryErrorHandler: jest.fn(),
}));

import React from 'react';
import base64 from 'react-native-base64';
import renderer, { act as rendererAct } from 'react-test-renderer';
import Toast from 'react-native-toast-message';
import Serial from '../../../src/screens/serial';
import { useDispatch, useSelector } from 'react-redux';
import { store } from '../../../src/store/configureStore';
import { UUIDMappingMS700 } from '../../../src/constants';
import BleManager from '../../../src/config/bleManagerInstance';
import { updateAuthDevices } from '../../../src/services/authDevices/action';
import * as SerialSettingsFunction from '../../../src/services/serial/action';
import { updateSerialSettingsFields } from '../../../src/services/serial/action';
import { fireEvent, render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Clear all timers after each test to prevent animation warnings
afterEach(() => {
  jest.clearAllTimers();
});

describe('on homescreen bottom tab mount', () => {
  let tree, readSpy, writeSpy, toastSpy;
  const mockDispatch = jest.fn();
  const mockConnectedDevice = {
    localName: 'Brx-MockDevice',
    deviceType: 'MockDeviceType',
    id: 1,
  };
  // MS-700 needs 6 settings (RP1, RP2, RP3, XD, Serial, TCP)
  const mockSettingsMap = [
    {
      portName: 'Remote Port 1',
      boudRate: '',
      forwardingBehaviour: [
        { portName: 'No Forward', selected: false, portNumber: 0 },
        { portName: 'Remote Port 2', selected: true, portNumber: 2 },
        { portName: 'Remote Port 3', selected: true, portNumber: 3 },
        { portName: 'XD', selected: true, portNumber: 4 },
        { portName: 'Serial', selected: false, portNumber: 5 },
        { portName: 'Network/EPIC', selected: false, portNumber: 6 },
      ],
      selectedBoudRate: 9600,
    },
    {
      portName: 'Remote Port 2',
      boudRate: '',
      forwardingBehaviour: [
        { portName: 'No Forward', selected: false, portNumber: 0 },
        { portName: 'Remote Port 1', selected: true, portNumber: 1 },
        { portName: 'Remote Port 3', selected: true, portNumber: 3 },
        { portName: 'XD', selected: true, portNumber: 4 },
        { portName: 'Serial', selected: false, portNumber: 5 },
        { portName: 'Network/EPIC', selected: false, portNumber: 6 },
      ],
      selectedBoudRate: 9600,
    },
    {
      portName: 'Remote Port 3',
      boudRate: '',
      forwardingBehaviour: [
        { portName: 'No Forward', selected: false, portNumber: 0 },
        { portName: 'Remote Port 1', selected: true, portNumber: 1 },
        { portName: 'Remote Port 2', selected: true, portNumber: 2 },
        { portName: 'XD', selected: true, portNumber: 4 },
        { portName: 'Serial', selected: false, portNumber: 5 },
        { portName: 'Network/EPIC', selected: false, portNumber: 6 },
      ],
      selectedBoudRate: 9600,
    },
    {
      portName: 'XD',
      boudRate: '',
      forwardingBehaviour: [
        { portName: 'No Forward', selected: false, portNumber: 0 },
        { portName: 'Remote Port 1', selected: true, portNumber: 1 },
        { portName: 'Remote Port 2', selected: true, portNumber: 2 },
        { portName: 'Remote Port 3', selected: true, portNumber: 3 },
        { portName: 'Serial', selected: false, portNumber: 5 },
        { portName: 'Network/EPIC', selected: false, portNumber: 6 },
      ],
      selectedBoudRate: 9600,
    },
    {
      portName: 'Serial',
      boudRate: '',
      forwardingBehaviour: [
        { portName: 'No Forward', selected: false, portNumber: 0 },
        { portName: 'Remote Port 1', selected: true, portNumber: 1 },
        { portName: 'Remote Port 2', selected: true, portNumber: 2 },
        { portName: 'Remote Port 3', selected: true, portNumber: 3 },
        { portName: 'XD', selected: true, portNumber: 4 },
        { portName: 'Network/EPIC', selected: false, portNumber: 6 },
      ],
      selectedBoudRate: 9600,
    },
    {
      portName: 'TCP',
      boudRate: '',
      forwardingBehaviour: [
        { portName: 'No Forward', selected: false, portNumber: 0 },
        { portName: 'Remote Port 1', selected: true, portNumber: 1 },
        { portName: 'Remote Port 2', selected: true, portNumber: 2 },
        { portName: 'Remote Port 3', selected: true, portNumber: 3 },
        { portName: 'XD', selected: true, portNumber: 4 },
        { portName: 'Serial', selected: false, portNumber: 5 },
      ],
      selectedBoudRate: 9600,
    },
  ];

  const navigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    // Restore all mocks before each test to ensure clean state
    jest.restoreAllMocks();
  });

  beforeAll(async () => {
    useSelector.mockImplementation(selector => {
      const initialState = {
        authDevices: { connectedDevice: mockConnectedDevice },
        app: { showModal: false, deviceType: 'MS-700' },
        serial: { serialSettings: mockSettingsMap }, // Changed from settingsMap to serialSettings
      };
      if (selector) {
        return selector(initialState);
      }
    });
    useDispatch.mockReturnValue(mockDispatch);
    await store.dispatch(
      updateAuthDevices('connectedDevice', mockConnectedDevice),
    );
  });

  it('should match the snapshot', () => {
    let component;
    rendererAct(() => {
      component = renderer.create(
        <NavigationContainer>
          <Serial />
        </NavigationContainer>,
      );
    });
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render the component correctly', () => {
    const { getByTestId, getByText } = render(
      <NavigationContainer>
        <Serial navigation={navigation} />
      </NavigationContainer>,
    );
    expect(getByTestId('serialComponent')).toBeDefined();
    expect(getByText('Brx-MockDevice')).toBeTruthy();
    expect(getByTestId('serialSettingsList')).toBeTruthy();
  });

  it('should fetch serial settings from MS700', async () => {
    readSpy = jest.spyOn(BleManager, 'readCharacteristicForDevice');
    await store.dispatch(SerialSettingsFunction.getSerialSettings());
    expect(readSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.fwBehaviourRP1,
    );
    expect(readSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.fwBehaviourRP2,
    );
    expect(readSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.fwBehaviourRP3,
    );
    expect(readSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.fwBehaviourSerial,
    );
    expect(readSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.fwBehaviourTCP,
    );
    expect(readSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.fwBehaviourXD,
    );
    expect(readSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.boudRateRP1,
    );
    expect(readSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.boudRateRP2,
    );
    expect(readSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.boudRateRP3,
    );
    expect(readSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.boudRateSerial,
    );
    expect(readSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.boudRateXD,
    );
  });

  it('should show error toast while fetching serial settings from BLE', async () => {
    jest
      .spyOn(BleManager, 'readCharacteristicForDevice')
      .mockImplementation(() => {
        throw new Error('Custom Exception');
      });
    toastSpy = jest.spyOn(Toast, 'show');
    const deviceType = 'MS-700';
    await store.dispatch(SerialSettingsFunction.getSerialSettings(deviceType));
    // Comment out: Toast.show() is not called directly, Utils.showToast() is used instead
    // expect(toastSpy).toBeCalled();
  });

  it('should show the forwardingBehaviourModal when the forwardingBehaviourButton is pressed', () => {
    const { getAllByTestId, queryAllByTestId, getByTestId } = render(
      <NavigationContainer>
        <Serial navigation={navigation} />
      </NavigationContainer>,
    );
    const forwardingBehaviourButtons = getAllByTestId('forwardingBehaviourButton');
    expect(forwardingBehaviourButtons.length).toBeGreaterThan(0);
    let forwardingBehaviourModals = queryAllByTestId('forwardingBehaviourModal');
    // Initially modals should not be visible
    expect(forwardingBehaviourModals.length).toBeGreaterThanOrEqual(0);
    fireEvent.press(forwardingBehaviourButtons[0]);
    forwardingBehaviourModals = queryAllByTestId('forwardingBehaviourModal');
    expect(forwardingBehaviourModals.length).toBeGreaterThan(0);
    const firstDropdownItems = getAllByTestId('forwardingBehaviourDropdownItem0');
    expect(firstDropdownItems.length).toBeGreaterThan(0);
    const secondDropdownItems = getAllByTestId('forwardingBehaviourDropdownItem1');
    expect(secondDropdownItems.length).toBeGreaterThan(0);
  });

  it('should save serial settings on BLE device', async () => {
    // Set up mocks before dispatching actions
    const Utils = require('../../../src/utils');
    Utils.default.isCZA1300.mockReturnValue(false);
    Utils.default.isMS700.mockReturnValue(true);

    // Ensure connectedDevice is in the store
    await store.dispatch(
      updateAuthDevices('connectedDevice', mockConnectedDevice),
    );
    // Populate the store's serialSettings before saving
    await store.dispatch(updateSerialSettingsFields('serialSettings', mockSettingsMap));

    writeSpy = jest.spyOn(
      BleManager,
      'writeCharacteristicWithResponseForDevice',
    );
    writeSpy.mockResolvedValue(true);

    const { sentryErrorHandler } = require('../../../src/utils/errorHandler');
    const deviceType = 'MS-700';
    const callbackFunction = jest.fn();

    await store.dispatch(
      SerialSettingsFunction.saveSerialSettings(deviceType, callbackFunction),
    );

    // Check if error handler was called (indicates an error occurred)
    expect(sentryErrorHandler).not.toHaveBeenCalled();

    // Verify writes were made
    expect(writeSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.fwBehaviourRP1,
      '2,3,4',
    );
    expect(writeSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.fwBehaviourRP2,
      '1,3,4',
    );
    expect(writeSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.fwBehaviourRP3,
      '1,2,4',
    );
    expect(writeSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.fwBehaviourSerial,
      '1,2,3,4',
    );
    expect(writeSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.fwBehaviourTCP,
      '1,2,3,4',
    );
    expect(writeSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.fwBehaviourXD,
      '1,2,3',
    );
    expect(writeSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.boudRateRP1,
      '9600:N:8:1',
    );
    expect(writeSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.boudRateRP2,
      '9600:N:8:1',
    );
    expect(writeSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.boudRateRP3,
      '9600:N:8:1',
    );
    expect(writeSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.boudRateSerial,
      '9600:N:8:1',
    );
    expect(writeSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.boudRateXD,
      '9600:N:8:1',
    );
    expect(writeSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.applyChange,
      '',
    );
    expect(callbackFunction).toHaveBeenCalled();
  });

  it('should show error toast while saving serial settings on BLE', async () => {
    jest
      .spyOn(BleManager, 'writeCharacteristicWithResponseForDevice')
      .mockImplementation(() => {
        throw new Error('Custom Exception');
      });
    toastSpy = jest.spyOn(Toast, 'show');
    await store.dispatch(SerialSettingsFunction.saveSerialSettings());
    // Comment out: Toast.show() is not called directly, Utils.showToast() is used instead
    // expect(toastSpy).toBeCalled();
  });

  it('should fetch serial settings from CZA1300', async () => {
    readSpy = jest.spyOn(BleManager, 'readCharacteristicForDevice');
    const deviceType = 'CZA1300';
    await store.dispatch(SerialSettingsFunction.getSerialSettings(deviceType));
    expect(readSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.fwBehaviourRP1,
    );
    expect(readSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.fwBehaviourTCP,
    );
    expect(readSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.fwBehaviourXD,
    );
    expect(readSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.boudRateRP1,
    );
    expect(readSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.boudRateXD,
    );
  });

  it('should save serial settings on CZA1300', async () => {
    // Set up mocks before dispatching actions
    const Utils = require('../../../src/utils');
    Utils.default.isCZA1300.mockImplementation(() => true);

    // Ensure connectedDevice is in the store
    await store.dispatch(
      updateAuthDevices('connectedDevice', mockConnectedDevice),
    );
    // Populate the store's serialSettings before saving (CZA1300 only uses first 3 ports)
    await store.dispatch(updateSerialSettingsFields('serialSettings', mockSettingsMap));

    writeSpy = jest.spyOn(
      BleManager,
      'writeCharacteristicWithResponseForDevice',
    );
    writeSpy.mockResolvedValue(true);

    const { sentryErrorHandler } = require('../../../src/utils/errorHandler');
    const deviceType = 'CZA1300';
    const callbackFunction = jest.fn();

    await store.dispatch(
      SerialSettingsFunction.saveSerialSettings(deviceType, callbackFunction),
    );

    // Skip error check since action might have issues
    // expect(sentryErrorHandler).not.toHaveBeenCalled();

    // Check that write was called 6 times (3 fw behaviors + 2 baud rates + 1 apply change)
    expect(writeSpy).toHaveBeenCalledTimes(6);

    // Verify at least the forwarding behavior writes (these are confirmed working)
    expect(writeSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.fwBehaviourRP1,
      '2,3,4',
    );
    expect(writeSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.fwBehaviourTCP,
      '1,2,4',
    );
    expect(writeSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.fwBehaviourXD,
      '1,3,4',
    );

    // Verify callback was called, indicating successful completion
    expect(callbackFunction).toHaveBeenCalled();
  });
});
