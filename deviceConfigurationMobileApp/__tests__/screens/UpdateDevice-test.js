import React from 'react';
import UpdateDevice from '../../src/screens/updateDevice/index';
import renderer from 'react-test-renderer';
import {fireEvent, render, screen} from '@testing-library/react-native';
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
  updateDevice,
  onBackPressSaveDevice,
  navigateToDeviceListing,
  updateDeviceType,
} from '../../src/screens/updateDevice/action';

import Toast from 'react-native-toast-message';
import {NavigationContainer} from '@react-navigation/native';
import RNFS from 'react-native-fs';

const props = {
  writeDataTolocalStorage: jest
    .fn()
    .mockImplementation(() => Promise.resolve()),
  route: {params: []},
  navigation: {push: () => jest.fn(), goBack: () => jest.fn()},
};

describe('on landing to Update device', () => {
  let tree, navigationSpy;
  beforeEach(() => {
    navigationSpy = jest.spyOn(props.navigation, 'push');
    tree = renderer.create(
      <NavigationContainer>
        <UpdateDevice {...props} />
      </NavigationContainer>,
    );
    render(
      <NavigationContainer>
        <UpdateDevice {...props} />
      </NavigationContainer>,
    );
  });
  it('should render add device correctly', () => {
    expect(tree.toJSON()).toMatchSnapshot();
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
    let component = renderer.create(
      <NavigationContainer>
        <UpdateDevice {...props} />
      </NavigationContainer>,
    );

    const deviceTypeDropDown = component.root.findByProps({
      testID: 'deviceTypeDropDown',
    }).props;
    deviceTypeDropDown.onPress();

    const dropDownHeading = component.root.findByProps({
      testID: 'dropDownHeading',
    }).props.children;

    expect(dropDownHeading).toBe('Select Device Type');
  });
});

describe('schoolDropDown pressed', () => {
  it('model should be visible', () => {
    let component = renderer.create(
      <NavigationContainer>
        <UpdateDevice {...props} />
      </NavigationContainer>,
    );

    const schoolDropDown = component.root.findByProps({
      testID: 'schoolDropDownbtn',
    }).props;
    schoolDropDown.onPress();

    const dropDownHeading = component.root.findByProps({
      testID: 'dropDownHeading',
    }).props.children;
    expect(dropDownHeading).toBe('Select School');
  });
});

describe('on selecting room dropdown', () => {
  beforeEach(() => {
    component = (
      <NavigationContainer>
        <UpdateDevice {...props} />
      </NavigationContainer>
    );
    render(component);
  });

  test('if school is not selected should show toast', () => {
    let schoolId = 0;
    const setIsRoomDropDown = () => {};
    const setDeviceTypeSelected = () => {};
    const setModalVisible = () => {};
    const modalVisible = () => {};
    const setSearch = () => {};
    const setRoomData = () => {};
    const setDataSource = () => {};

    const toastSpy = jest.spyOn(Toast, 'show');
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
    expect(toastSpy).toBeCalled();
  });

  test('if school is selected, model should open', () => {
    let schoolId = 1;
    const setIsRoomDropDown = () => {};
    const setDeviceTypeSelected = () => {};
    const setModalVisible = () => {};
    const modalVisible = () => {};
    const setSearch = () => {};
    const setRoomData = () => {};
    const setDataSource = () => {};
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
    let component = renderer.create(
      <NavigationContainer>
        <UpdateDevice {...props} />
      </NavigationContainer>,
    );
    const dropDownHeading = component.root.findByProps({
      testID: 'dropDownHeading',
    }).props.children;

    expect(dropDownHeading).toBe('Select School');
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
  const title = {title: {item: {title: 'School 1'}}};
  const setSchoolId = () => {};
  const setSelectedSchool = () => {};
  const setSelectedRoom = () => {};
  const setModalVisible = () => {};
  const setSearch = () => {};
  const setSchoolSelectedFlag = () => {};

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

  let component = renderer.create(
    <NavigationContainer>
      <UpdateDevice {...props} />
    </NavigationContainer>,
  );

  test('model should be close after school is selected', () => {
    const modelComponent = component
      .toJSON()
      .children.filter(data => data.type === 'Modal');
    const modelForListComponent = modelComponent.filter(
      data => data.props.testID === 'modelForList',
    );
    expect(modelForListComponent?.[0].props.visible).toBeFalsy();
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
  const setModalVisible = () => {};
  const setSearch = () => {};
  const setDataSource = () => {};
  const setSchoolData = () => {};
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
  const setSchoolId = () => {};
  const setSelectedSchool = () => {};
  const setSelectedRoom = () => {};
  const setSchoolSelectedFlag = () => {};

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

describe('updateDevice', () => {
  let navigationSpy = '';
  let updatedDevice = {
    deviceID: '1',
    deviceName: 'dummy Device',
    deviceType: 'MS700',
    macAddress: 'MacAddressssss',
    serialNumber: 'Serial number 1',
  };

  beforeEach(() => {
    navigationSpy = jest.spyOn(props.navigation, 'goBack');
    tree = renderer.create(
      <NavigationContainer>
        <UpdateDevice {...props} />
      </NavigationContainer>,
    );
    render(
      <NavigationContainer>
        <UpdateDevice {...props} />
      </NavigationContainer>,
    );
  });

  test('it should navigate back after saving device', () => {
    updateDevice(updatedDevice);
    setTimeout(() => {
      expect(navigationSpy).toBeCalled();
    }, 100);
  });
});

describe('onBackPressSaveDevice', () => {
  let navigationSpy = '';
  const macAddress = 'AB:BC:SD:FR:FR:QW';
  const serialNumber = 'Serial number';
  const schoolId = 1;
  const roomId = 1;

  beforeEach(() => {
    navigationSpy = jest.spyOn(props.navigation, 'goBack');
    tree = renderer.create(
      <NavigationContainer>
        <UpdateDevice {...props} />
      </NavigationContainer>,
    );
    render(
      <NavigationContainer>
        <UpdateDevice {...props} />
      </NavigationContainer>,
    );
  });

  test('it should navigate back', () => {
    onBackPressSaveDevice(macAddress, serialNumber, schoolId, roomId);
    setTimeout(() => {
      expect(navigationSpy).toBeCalled();
    }, 100);
  });
});

describe('navigateToDeviceListing', () => {
  let navigationSpy = '';
  const macAddress = 'AB:BC:SD:FR:FR:QW';
  const serialNumber = 'Serial number';
  const schoolId = 1;
  const roomId = 1;

  beforeEach(() => {
    navigationSpy = jest.spyOn(props.navigation, 'push');
    tree = renderer.create(
      <NavigationContainer>
        <UpdateDevice {...props} />
      </NavigationContainer>,
    );
    render(
      <NavigationContainer>
        <UpdateDevice {...props} />
      </NavigationContainer>,
    );
  });

  test('it should navigate to manageSchool screen', () => {
    navigateToDeviceListing(macAddress, serialNumber, schoolId, roomId);
    setTimeout(() => {
      expect(navigationSpy).toBeCalled();
    }, 100);
  });
});

describe('Device type update', () => {
  const deviceType = 'MS700';
  const setDeviceType = () => {};
  const modalVisible = true;
  const setModalVisible = () => {};

  updateDeviceType(deviceType, setDeviceType, modalVisible, setModalVisible);

  let component = renderer.create(
    <NavigationContainer>
      <UpdateDevice {...props} />
    </NavigationContainer>,
  );

  test('model should be visible', () => {
    const modelForList = component.root.findByProps({
      testID: 'modelForList',
    }).props.children;
    expect(modelForList).toBe('Select School');
  });
});
