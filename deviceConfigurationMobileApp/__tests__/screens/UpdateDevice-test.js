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
jest.mock('../../src/utils', () => ({
  __esModule: true,
  default: {
    showToast: jest.fn(),
    Log: jest.fn(),
    isMS700: jest.fn(() => false),
    isCZA1300: jest.fn(() => false),
    logType: {
      error: 'error',
      info: 'info',
      warn: 'warn',
    },
  },
}));

import React from 'react';
import UpdateDevice from '../../src/screens/updateDevice/index';
import renderer, { act as rendererAct } from 'react-test-renderer';
import { fireEvent, render, screen } from '@testing-library/react-native';
import {
  writeDataTolocalStorage,
  readFileFromLocalStorage,
  roomDropDown,
  updateSelectedSchool,
  updateSelectedRoom,
  schoolListUpdate,
  roomListUpdate,
  searchBarClose,
  onChangeTextFunction,
  searchFilter,
  deviceTypeDropDown,
  getRoom,
  onBackPressSaveDevice,
  updateDeviceType,
} from '../../src/screens/updateDevice/action';

import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import Utils from '../../src/utils';

// Setup fake timers to control animations
jest.useFakeTimers();

// Clear all timers after each test to prevent animation warnings
afterEach(() => {
  jest.clearAllTimers();
});

const props = {
  writeDataTolocalStorage: jest
    .fn()
    .mockImplementation(() => Promise.resolve()),
  route: { params: [] },
  navigation: { push: () => jest.fn(), goBack: () => jest.fn() },
};

describe('on landing to Update device', () => {
  let tree, navigationSpy;
  beforeEach(() => {
    navigationSpy = jest.spyOn(props.navigation, 'push');
    let component;
    rendererAct(() => {
      component = renderer.create(
        <NavigationContainer>
          <UpdateDevice {...props} />
        </NavigationContainer>,
      );
    });
    tree = component.toJSON();
  });
  it('should render add device correctly', () => {
    expect(tree).toMatchSnapshot();
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
  test('should throw the error if write fails', async () => {
    jest.spyOn(RNFS, 'writeFile').mockImplementation(() => {
      throw new Error('Error while writing');
    });

    const result = await writeDataTolocalStorage(mockData);
    expect(result).toEqual('Error while writing');
  });
});

describe('deviceTypeDropDown pressed', () => {
  it('model should be visible', () => {
    let component;
    rendererAct(() => {
      component = renderer.create(
        <NavigationContainer>
          <UpdateDevice {...props} />
        </NavigationContainer>,
      );
    });

    const deviceTypeDropDown = component.root.findByProps({
      testID: 'deviceTypeDropDown',
    }).props;
    rendererAct(() => {
      deviceTypeDropDown.onPress();
    });

    const dropDownHeading = component.root.findByProps({
      testID: 'dropDownHeading',
    }).props.children;

    expect(dropDownHeading).toBe('Select Device Type');
  });
});

describe('schoolDropDown pressed', () => {
  it('model should be visible', () => {
    let component;
    rendererAct(() => {
      component = renderer.create(
        <NavigationContainer>
          <UpdateDevice {...props} />
        </NavigationContainer>,
      );
    });

    const schoolDropDown = component.root.findByProps({
      testID: 'schoolDropDownbtn',
    }).props;
    rendererAct(() => {
      schoolDropDown.onPress();
    });

    const dropDownHeading = component.root.findByProps({
      testID: 'dropDownHeading',
    }).props.children;
    expect(dropDownHeading).toBe('Select School');
  });
});

describe('on selecting room dropdown', () => {
  test('if school is not selected should show toast', () => {
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

    roomDropDown(
      schoolId,
      setIsRoomDropDown,
      setDeviceTypeSelected,
      setModalVisible,
      modalVisible,
      setSearch,
      setRoomData,
      setDataSource,
    );

    expect(Utils.showToast).toHaveBeenCalled();
  });

  test('if school is selected, model should open', () => {
    let schoolId = 1;
    const setIsRoomDropDown = jest.fn();
    const setDeviceTypeSelected = jest.fn();
    const setModalVisible = jest.fn();
    const modalVisible = false;
    const setSearch = jest.fn();
    const setRoomData = jest.fn();
    const setDataSource = jest.fn();

    roomDropDown(
      schoolId,
      setIsRoomDropDown,
      setDeviceTypeSelected,
      setModalVisible,
      modalVisible,
      setSearch,
      setRoomData,
      setDataSource,
    );

    // Verify that modal visibility was toggled
    expect(setModalVisible).toHaveBeenCalledWith(true);
    // Verify room dropdown flag was set
    expect(setIsRoomDropDown).toHaveBeenCalledWith(true);
  });
});

describe('updateSelectedSchool called', () => {
  const dataSource = [
    {
      id: 1,
      title: 'School 1',
      rooms: [
        {
          id: 1,
          title: 'Room 1',
          devices: [
            {
              macAddress: 'AAAAAAAAAAAAAAAAA',
              serialNumber: 'serial number',
            },
          ],
        },
      ],
    },
  ];
  const title = { title: { item: { title: 'School 1' } } };
  const setSchoolId = () => { };
  const setSelectedSchool = () => { };
  const setSelectedRoom = () => { };
  const setModalVisible = () => { };
  const setSearch = () => { };
  const setSchoolSelectedFlag = () => { };

  updateSelectedSchool(
    dataSource,
    title,
    setSchoolId,
    setSelectedSchool,
    setSelectedRoom,
    setModalVisible,
    setSearch,
    setSchoolSelectedFlag,
  );

  let component;
  rendererAct(() => {
    component = renderer.create(
      <NavigationContainer>
        <UpdateDevice {...props} />
      </NavigationContainer>,
    );
  });

  test('model should be close after school is selected', () => {
    const jsonTree = component.toJSON();
    const modelComponent = jsonTree
      ? jsonTree.children?.filter(data => data.type === 'Modal') || []
      : [];
    const modelForListComponent = modelComponent.filter(
      data => data.props.testID === 'modelForList',
    );
    expect(modelForListComponent?.[0]?.props.visible).toBeFalsy();
  });
});

describe('Create new School', () => {
  const schoolData = [
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
  const setModalVisible = () => { };
  const setSearch = () => { };
  const setDataSource = () => { };
  const setSchoolData = () => { };
  const dataSource = [
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
  const setSchoolId = () => { };
  const setSelectedSchool = () => { };
  const setSelectedRoom = () => { };
  const setSchoolSelectedFlag = () => { };

  schoolListUpdate(
    schoolData,
    setModalVisible,
    setSearch,
    setDataSource,
    setSchoolData,
    dataSource,
    setSchoolId,
    setSelectedSchool,
    setSelectedRoom,
    setSchoolSelectedFlag,
  )('new School');
});

describe('updateDevice functionality', () => {
  test('it should navigate to manageSchool after saving device with valid data', async () => {
    const mockNavigation = {
      replace: jest.fn(),
      goBack: jest.fn(),
    };

    const routeSchoolId = 1;
    const routeRoomId = 1;
    const macAddress = 'AB:BC:SD:EE:FF:GG';
    const serialNumber = 'Serial number 1';
    const deviceName = 'dummy Device';
    const deviceType = 'MS700';
    const deviceID = 1;
    const schoolId = 1;
    const roomId = 1;
    const routeMacAddress = 'AB:BC:SD:EE:FF:GG';

    // Mock RNFS to return valid data
    jest.spyOn(RNFS, 'readFile').mockResolvedValue(JSON.stringify([
      {
        id: 1,
        title: 'School 1',
        rooms: [
          {
            id: 1,
            title: 'Room 1',
            devices: [
              {
                macAddress: 'AB:BC:SD:EE:FF:GG',
                serialNumber: 'Serial',
                deviceName: 'Device',
                deviceType: 'MS-700',
                deviceID: 1,
              },
            ],
          },
        ],
      },
    ]));

    await onBackPressSaveDevice(
      routeSchoolId,
      routeRoomId,
      macAddress,
      serialNumber,
      deviceName,
      deviceType,
      deviceID,
      schoolId,
      roomId,
      mockNavigation,
      routeMacAddress,
    );

    // Verify navigation was called after updating device
    expect(mockNavigation.replace).toHaveBeenCalledWith('manageSchool');
  });
});

describe('onBackPressSaveDevice', () => {
  const routeSchoolId = 1;
  const routeRoomId = 1;
  const macAddress = 'AB:BC:SD:FR:FR:QW';
  const serialNumber = 'Serial number';
  const deviceName = 'Device Name';
  const deviceType = 'MS-700';
  const DeviceId = 1;
  const schoolId = 1;
  const roomId = 1;
  const routeMacAddress = 'AB:BC:SD:FR:FR:QW';

  const mockNavigation = {
    replace: jest.fn(),
    goBack: jest.fn(),
  };

  test('it should call navigation.replace when valid data is provided', async () => {
    // Mock RNFS to return valid data
    jest.spyOn(RNFS, 'readFile').mockResolvedValue(JSON.stringify([
      {
        id: 1,
        title: 'School 1',
        rooms: [
          {
            id: 1,
            title: 'Room 1',
            devices: [
              {
                macAddress: 'AB:BC:SD:FR:FR:QW',
                serialNumber: 'Serial',
                deviceName: 'Device',
                deviceType: 'MS-700',
                deviceID: 1,
              },
            ],
          },
        ],
      },
    ]));

    await onBackPressSaveDevice(
      routeSchoolId,
      routeRoomId,
      macAddress,
      serialNumber,
      deviceName,
      deviceType,
      DeviceId,
      schoolId,
      roomId,
      mockNavigation,
      routeMacAddress,
    );

    // Since the school/room are the same, it should call updateDeviceField
    // which calls navigation.replace
    expect(mockNavigation.replace).toHaveBeenCalledWith('manageSchool');
  });
});

describe('navigate to device listing after update', () => {
  test('it should navigate to manageSchool screen when device is successfully updated', async () => {
    const mockNavigation = {
      replace: jest.fn(),
      goBack: jest.fn(),
    };

    const routeSchoolId = 1;
    const routeRoomId = 1;
    const macAddress = 'AA:BB:CC:DD:EE:FF';
    const serialNumber = 'Serial number 2';
    const deviceName = 'Updated Device';
    const deviceType = 'CZA1300';
    const deviceID = 1;
    const schoolId = 1;
    const roomId = 1;
    const routeMacAddress = 'AA:BB:CC:DD:EE:FF';

    // Mock RNFS to return valid data
    const readFileSpy = jest.spyOn(RNFS, 'readFile').mockResolvedValue(JSON.stringify([
      {
        id: 1,
        title: 'School 1',
        rooms: [
          {
            id: 1,
            title: 'Room 1',
            devices: [
              {
                macAddress: 'AA:BB:CC:DD:EE:FF',
                serialNumber: 'Serial',
                deviceName: 'Device',
                deviceType: 'MS-700',
                deviceID: 1,
              },
            ],
          },
        ],
      },
    ]));

    await onBackPressSaveDevice(
      routeSchoolId,
      routeRoomId,
      macAddress,
      serialNumber,
      deviceName,
      deviceType,
      deviceID,
      schoolId,
      roomId,
      mockNavigation,
      routeMacAddress,
    );

    // Verify navigation.replace was called to navigate to manageSchool
    expect(mockNavigation.replace).toHaveBeenCalledWith('manageSchool');
    
    // Clean up
    readFileSpy.mockRestore();
  });
});

describe('Device type update', () => {
  test('model should be visible', () => {
    const deviceType = 'MS700';
    const setDeviceType = jest.fn();
    const modalVisible = true;
    const setModalVisible = jest.fn();

    updateDeviceType(deviceType, setDeviceType, modalVisible, setModalVisible);

    // Verify that the function was called with expected values
    expect(setDeviceType).toHaveBeenCalledWith(deviceType);
    expect(setModalVisible).toHaveBeenCalledWith(false);
  });
});
