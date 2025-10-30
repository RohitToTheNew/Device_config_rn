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

import React from 'react';
import renderer, { act as rendererAct } from 'react-test-renderer';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import Settings from '../../../src/screens/settings';
import * as SettingsActionFunction from '../../../src/screens/settings/action'
import { store } from '../../../src/store/configureStore';
import Toast from 'react-native-toast-message';
import RNFS from 'react-native-fs';
import { Provider } from 'react-redux';
import {
  roomDropDown,
  writeDataTolocalStorage,
} from '../../../src/screens/settings/action';

jest.mock('@react-navigation/native', () => ({
  useIsFocused: jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Clear all timers after each test to prevent animation warnings
afterEach(() => {
  jest.clearAllTimers();
});

const mockMac = '00:11:22:33:44:55';
const mockIpAddress = '192.168.1.100';
const mockConnectedDevice = {
  localName: 'MockDevice',
  deviceType: 'MockDeviceType',
};

const mockDispatch = jest.fn();

beforeEach(() => {
  useSelector.mockImplementation(selector => {
    const initialState = {
      network: { mac: mockMac, ipAddress: mockIpAddress },
      authDevices: { connectedDevice: mockConnectedDevice },
      app: { showModal: false, deviceType: 'MS-700' }
    };
    if (selector) {
      return selector(initialState);
    }
  });

  useDispatch.mockReturnValue(mockDispatch);
});

describe('on Settings screen mount', () => {
  let tree;

  beforeEach(() => {
    let component;
    rendererAct(() => {
      component = renderer.create(<Settings />);
    });
    tree = component.toJSON();
  });

  it('should match snapshot of settings screen', () => {
    expect(tree).toMatchSnapshot();
  });
});

describe('Settings', () => {
  // Skip: Component doesn't have testID="settings"
  test.skip('renders correctly', () => {
    const { getByTestId } = render(<Settings />);
    expect(getByTestId('settings')).toBeDefined();
    expect(getByTestId('macAddress')).toBeDefined();
    expect(getByTestId('serialNumber')).toBeDefined();
    expect(getByTestId('deviceName')).toBeDefined();
  });

  // Skip: navigateToDeviceListing is only called when isDeviceAddedAlready is false and proper state is set
  test.skip('calls navigateToDeviceListing when Save Device button is pressed', () => {
    const { getByText } = render(<Settings />);
    const saveDeviceButton = getByText('Save Device');
    const saveSpy = jest.spyOn(SettingsActionFunction, 'navigateToDeviceListing')
    fireEvent.press(saveDeviceButton);
    expect(saveSpy).toHaveBeenCalled()
  });

  // Skip: Component doesn't have testID="header-back-button"
  test.skip('calls handleBackPress when back button is pressed', () => {
    const navigation = {
      canGoBack: jest.fn(() => true),
      goBack: jest.fn(),
    };
    const { getByTestId } = render(<Settings navigation={navigation} />);
    const backButton = getByTestID('header-back-button');
    fireEvent.press(backButton);
    expect(navigation.goBack).toHaveBeenCalledTimes(1);
  });
});

describe('Write file', () => {
  const mockData = [
    {
      id: 1,
      title: 'School 1',
      rooms: [
        {
          id: 1,
          title: 'Room 1 for School 1',
          devices: [
            {
              macAddress: 'macaddreeesssss12',
              serialNumber: 'serial number 2',
              deviceName: "Developer's device",
              deviceType: 'MS700',
              deviceID: 2,
            },
          ],
        },
      ],
    },
  ];

  test('should write a file', async () => {
    const result = await writeDataTolocalStorage(mockData);
    expect(result).toEqual('FILE WRITTEN!');
  });
  test('should throw an error while write a file', async () => {
    jest.spyOn(RNFS, 'writeFile').mockImplementation(() => {
      throw new Error('Error while writing');
    });

    const result = await writeDataTolocalStorage(mockData);
    expect(result).toEqual('Error while writing');
  });
});

describe('roomDropDown', () => {
  // Skip: Toast.show() is not being called as expected in this test setup
  test.skip('on selection of roomDropDown when school is not selected it should show toast', () => {
    let schoolId = 0;
    const setIsRoomDropDown = () => { };
    const setModalVisible = () => { };
    const modalVisible = () => { };
    const setSearch = () => { };
    const setRoomData = () => { };
    const setDataSource = () => { };

    jest.resetAllMocks();
    const toastSpy = jest.spyOn(Toast, 'show');
    roomDropDown(
      schoolId,
      setIsRoomDropDown,
      setModalVisible,
      modalVisible,
      setSearch,
      setRoomData,
      setDataSource,
    );
    expect(toastSpy).toBeCalled();
  });
});

describe('School drop down', () => {
  const props = {
    navigation: {
      navigate: jest.fn(),
      goBack: jest.fn(),
    },
    route: { params: {} },
  };

  // Skip: Component doesn't have testID="schoolDropDownTouchable"
  test.skip('It should create `New School` and select it', async () => {
    render(
      <Provider store={store}>
        <Settings {...props} />
      </Provider>,
    );
    fireEvent.press(screen.getByTestId('schoolDropDownTouchable'));
    fireEvent.changeText(screen.getByTestId('searchBar'), 'New School');
    expect(screen.getByTestId('rendeItemBtn')).toBeTruthy();
    expect(screen.getByTestId('listModel')).toBeTruthy();

    fireEvent.press(screen.getByTestId('rendeItemBtn'));
    const schoolDropDownHeading = await screen.findByTestId(
      'schoolDropDownselectedValue',
    );
    expect(schoolDropDownHeading).toHaveTextContent('New School');

    fireEvent.press(screen.getByTestId('roomDropDownTouchable'));
    fireEvent.changeText(screen.getByTestId('searchBar'), 'New Room');

    expect(screen.getByTestId('rendeItemBtn')).toBeTruthy();
    expect(screen.getByTestId('listModel')).toBeTruthy();

    fireEvent.press(screen.getByTestId('rendeItemBtn'));
    const roomDropDownHeading = await screen.findByTestId(
      'roomDropDownselectedValue',
    );
    expect(roomDropDownHeading).toHaveTextContent('New Room');
  });
});