import React from 'react';
import base64 from 'react-native-base64';
import renderer from 'react-test-renderer';
import Toast from 'react-native-toast-message';
import Serial from '../../../src/screens/serial';
import {useDispatch, useSelector} from 'react-redux';
import {store} from '../../../src/store/configureStore';
import {UUIDMappingMS700} from '../../../src/constants';
import BleManager from '../../../src/config/bleManagerInstance';
import {updateAuthDevices} from '../../../src/services/authDevices/action';
import * as SerialSettingsFunction from '../../../src/services/serial/action';
import {fireEvent, render} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

describe('on homescreen bottom tab mount', () => {
  let tree, readSpy, writeSpy, toastSpy;
  const mockDispatch = jest.fn();
  const mockConnectedDevice = {
    localName: 'Brx-MockDevice',
    deviceType: 'MockDeviceType',
    id: 1,
  };
  const mockSettingsMap = [
    {
      portName: 'Remote Port 1',
      boudRate: '',
      forwardingBehaviour: [
        {portName: 'No Forward', selected: false, portNumber: 0},
        {portName: 'Remote Port 2', selected: false, portNumber: 2},
        {portName: 'Remote Port 3', selected: false, portNumber: 3},
        {portName: 'XD', selected: false, portNumber: 4},
        {portName: 'Serial', selected: false, portNumber: 5},
        {portName: 'Network/EPIC', selected: false, portNumber: 6},
      ],
      selectedBoudRate: '',
    },
  ];

  const navigation = {
    navigate: jest.fn(),
  };

  beforeAll(async () => {
    useSelector.mockImplementation(selector => {
      const initialState = {
        authDevices: {connectedDevice: mockConnectedDevice},
        app: {showModal: false, deviceType: 'MS-700'},
        serial: {settingsMap: mockSettingsMap},
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
    tree = renderer
      .create(
        <NavigationContainer>
          <Serial />
        </NavigationContainer>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render the component correctly', () => {
    const {getByTestId, getByText} = render(
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
    const deviceType = 'MS-700';
    await store.dispatch(SerialSettingsFunction.getSerialSettings(deviceType));
    toastSpy = jest.spyOn(Toast, 'show');
    expect(toastSpy).toBeCalled();
  });

  it('should show the forwardingBehaviourModal when the forwardingBehaviourButton is pressed', () => {
    const {getByTestId, queryByTestId} = render(
      <NavigationContainer>
        <Serial navigation={navigation} />
      </NavigationContainer>,
    );
    const forwardingBehaviourButton = getByTestId('forwardingBehaviourButton');
    expect(forwardingBehaviourButton).toBeDefined();
    const forwardingBehaviourModal = queryByTestId('forwardingBehaviourModal');
    expect(forwardingBehaviourModal).toBeNull();
    fireEvent.press(forwardingBehaviourButton);
    expect(queryByTestId('forwardingBehaviourModal')).toBeDefined();
    const firstDropdownItem = getByTestId('forwardingBehaviourDropdownItem0');
    expect(firstDropdownItem).toBeDefined();
    const secondDropdownItem = getByTestId('forwardingBehaviourDropdownItem1');
    expect(secondDropdownItem).toBeDefined();
  });

  it('should save serial settings on BLE device', async () => {
    writeSpy = jest.spyOn(
      BleManager,
      'writeCharacteristicWithResponseForDevice',
    );
    jest.spyOn(base64, 'encode').mockImplementation(() => {
      return '1,2,3,4';
    });
    const deviceType = 'MS-700';
    const callbackFunction = () => {};
    await store.dispatch(
      SerialSettingsFunction.saveSerialSettings(deviceType, callbackFunction),
    );
    expect(writeSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.fwBehaviourRP1,
      '1,2,3,4',
    );
    expect(writeSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.fwBehaviourRP2,
      '1,2,3,4',
    );
    expect(writeSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.fwBehaviourRP3,
      '1,2,3,4',
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
      UUIDMappingMS700.boudRateXD,
      '1,2,3,4',
    );
    expect(writeSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.boudRateRP1,
      '1,2,3,4',
    );
    expect(writeSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.boudRateRP2,
      '1,2,3,4',
    );
    expect(writeSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.boudRateRP3,
      '1,2,3,4',
    );
    expect(writeSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.boudRateSerial,
      '1,2,3,4',
    );
    expect(writeSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.boudRateXD,
      '1,2,3,4',
    );
  });

  it('should show error toast while saving serial settings on BLE', async () => {
    jest
      .spyOn(BleManager, 'writeCharacteristicWithResponseForDevice')
      .mockImplementation(() => {
        throw new Error('Custom Exception');
      });
    await store.dispatch(SerialSettingsFunction.saveSerialSettings());
    toastSpy = jest.spyOn(Toast, 'show');
    expect(toastSpy).toBeCalled();
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
    writeSpy = jest.spyOn(
      BleManager,
      'writeCharacteristicWithResponseForDevice',
    );
    jest.spyOn(base64, 'encode').mockImplementation(() => {
      return '1,2,3,4';
    });
    const deviceType = 'CZA1300';
    const callbackFunction = () => {};
    await store.dispatch(
      SerialSettingsFunction.saveSerialSettings(deviceType, callbackFunction),
    );
    expect(writeSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.fwBehaviourRP1,
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
      UUIDMappingMS700.boudRateXD,
      '1,2,3,4',
    );
    expect(writeSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.boudRateRP1,
      '1,2,3,4',
    );
    expect(writeSpy).toBeCalledWith(
      mockConnectedDevice.id,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.boudRateXD,
      '1,2,3,4',
    );
  });
});
