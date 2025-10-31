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

// Mock Utils to spy on showToast
jest.mock('../../../src/utils', () => ({
  __esModule: true,
  default: {
    showToast: jest.fn(),
    Log: jest.fn(),
    isMS700: jest.fn(() => true),
    isCZA1300: jest.fn(() => false),
    isInfoView: jest.fn(() => false),
    isAndroid: false,
    logType: {
      error: 'error',
      info: 'info',
      warn: 'warn',
    },
  },
}));

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
import Utils from '../../../src/utils';

jest.mock('@react-navigation/native', () => ({
  useIsFocused: jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Setup fake timers to control animations
jest.useFakeTimers();

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
  let tree, component;

  beforeEach(() => {
    rendererAct(() => {
      component = renderer.create(<Settings />);
      tree = component.toJSON();
    });
  });

  afterEach(() => {
    if (component) {
      rendererAct(() => {
        component.unmount();
      });
      component = null;
    }
    tree = null;
  });

  it('should match snapshot of settings screen', () => {
    expect(tree).toMatchSnapshot();
  });
});

describe('Settings', () => {
  test('renders correctly', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <Settings />
      </Provider>
    );
    expect(getByTestId('settings')).toBeDefined();
  });

  test('renders back button correctly', () => {
    const navigation = {
      canGoBack: jest.fn(() => true),
      goBack: jest.fn(),
      navigate: jest.fn(),
    };
    const { getByTestId } = render(
      <Provider store={store}>
        <Settings navigation={navigation} route={{ params: {} }} />
      </Provider>
    );
    const backButton = getByTestId('header-back-button');
    
    // Verify back button exists and is pressable
    expect(backButton).toBeTruthy();
    fireEvent.press(backButton);
    // The button was successfully pressed (no errors thrown)
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
  test('on selection of roomDropDown when school is not selected it should show toast', () => {
    let schoolId = 0;
    const setIsRoomDropDown = jest.fn();
    const setDeviceTypeSelected = jest.fn();
    const setModalVisible = jest.fn();
    const modalVisible = false;
    const setSearch = jest.fn();
    const setRoomData = jest.fn();
    const setDataSource = jest.fn();

    // Clear previous calls
    Utils.showToast.mockClear();

    // roomDropDown returns a function, so we need to call it
    const dropDownHandler = roomDropDown(
      schoolId,
      setIsRoomDropDown,
      setDeviceTypeSelected,
      setModalVisible,
      modalVisible,
      setSearch,
      setRoomData,
      setDataSource,
    );
    
    // Call the returned function
    dropDownHandler();

    expect(Utils.showToast).toHaveBeenCalled();
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

  test('It should show modal and search when school dropdown is pressed', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <Settings {...props} />
      </Provider>,
    );
    
    // Press the school dropdown touchable
    const schoolDropDown = getByTestId('schoolDropDownTouchable');
    fireEvent.press(schoolDropDown);
    
    // Verify modal is displayed
    const modal = getByTestId('listModel');
    expect(modal).toBeTruthy();
    expect(modal.props.visible).toBe(true);
    
    // Verify search bar is present
    const searchBar = getByTestId('searchBar');
    expect(searchBar).toBeTruthy();
    
    // Type in search bar
    fireEvent.changeText(searchBar, 'New School');
    
    // Verify the create button appears
    const createButton = getByTestId('rendeItemBtn');
    expect(createButton).toBeTruthy();
  });
});