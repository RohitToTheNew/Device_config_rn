import React from 'react';
import AddDevice from '../../src/screens/addDevice/index';
import renderer from 'react-test-renderer';
import { fireEvent, render, screen, cleanup, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { store } from '../../src/store/configureStore';
import {
  roomDropDown,
  updateSelectedSchool,
  roomListUpdate,
  writeDataTolocalStorage,
  onBackPressSaveDevice,
  isDuplicateMacAddress,
} from '../../src/screens/addDevice/action';

import Toast from 'react-native-toast-message';
import * as addDeviceAction from '../../src/screens/addDevice/action';
import RNFS from 'react-native-fs';
import deviceType from '../../src/config/deviceType';

// Use fake timers to avoid async timer issues
jest.useFakeTimers();

// Global cleanup after each test
afterEach(() => {
  cleanup();
  jest.clearAllTimers();
});

const props = {
  writeDataTolocalStorage: jest
    .fn()
    .mockImplementation(() => Promise.resolve()),
  route: { params: [] },
  navigation: { push: () => jest.fn(), goBack: () => jest.fn() },
};

const tree = renderer.create(<AddDevice {...props} />).toJSON();
const tree1 = render(<AddDevice {...props} />);

describe('on landing to add device with scan result containing data', () => {
  it('should render add device correctly', () => {
    expect(tree).toMatchSnapshot();
  });
});

describe('on landing to add device with scan result containing no data', () => {
  const tree = renderer.create(<AddDevice {...props} />).toJSON();
  it('should render add device correctly', () => {
    expect(tree).toMatchSnapshot();
  });
});

describe('on landing to add device with scan result containing data', () => {
  let props, navigation;
  beforeEach(() => {
    navigation = { push: () => jest.fn() };
    props = {
      route: {
        params: { mac: 'AA:BB:CC:DD:EE:FF', serialNumber: 'SerialNumber 1', deviceType: deviceType.cza1300 },
      },
      navigation: navigation,
    };
    render(
      <Provider store={store}>
        <AddDevice {...props} />
      </Provider>,
    );
  });
  it('should render addDevice with macAddress, Serial number and device type pre-filled', async () => {
    const macProp = await screen.findByTestId('macPropselectedValue');
    expect(macProp).toHaveTextContent('AA:BB:CC:DD:EE:FF');
    const serialProp = await screen.findByTestId('serialPropselectedValue');
    expect(serialProp).toHaveTextContent('SerialNumber 1');
    const deviceTypeProp = await screen.findByTestId('deviceTypeProp');
    expect(deviceTypeProp).toHaveTextContent('CZA1300')
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

describe('Room drop down', () => {
  test('on selection of roomDropDown when school is not selected it should show toast', () => {
    let schoolId = 0;
    const setIsRoomDropDown = () => { };
    const setModalVisible = () => { };
    const modalVisible = () => { };
    const setSearch = () => { };
    const setRoomData = () => { };
    const setDataSource = () => { };

    jest.resetAllMocks();
    roomDropDown(
      schoolId,
      setIsRoomDropDown,
      setModalVisible,
      modalVisible,
      setSearch,
      setRoomData,
      setDataSource,
    );
    const toastSpy = jest.spyOn(Toast, 'show');
    expect(toastSpy).toBeCalled();
  });
});

describe('School drop down', () => {
  test('It should create `New School` and select it', async () => {
    render(
      <Provider store={store}>
        <AddDevice {...props} />
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

  describe('Update Selected School', () => {
    test('on Selection of a school having School 1 as a title, Room title should be reset to default', async () => {
      render(
        <Provider store={store}>
          <AddDevice {...props} />
        </Provider>,
      );

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
      const title = 'School 1';
      const setSchoolId = () => { };
      setSelectedSchool = () => { };
      setSelectedRoom = () => { };
      setModalVisible = () => { };
      setSearch = () => { };
      setSchoolSelectedFlag = () => { };

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

      const roomDropDownHeading = await screen.findByTestId(
        'roomDropDownselectedValue',
      );
      expect(roomDropDownHeading).toHaveTextContent(translate('selectRoom'));
    });
  });

  describe('Mac Address input', () => {
    test('on input to mac address, it should set mac address field', async () => {
      const onChangeTextFnSPy = jest.spyOn(
        addDeviceAction,
        'onChangeTextFunction',
      );

      render(
        <Provider store={store}>
          <AddDevice {...props} />
        </Provider>,
      );

      fireEvent.press(screen.getByTestId('macProp'));
      fireEvent.changeText(screen.getByTestId('macProp'), 'abcdefghijkl');

      expect(onChangeTextFnSPy).toHaveBeenCalled();
    });
  });

  describe('Serial number input', () => {
    test('on input to serial number, it should set serial number field', async () => {
      const onChangeTextFnSPy = jest.spyOn(
        addDeviceAction,
        'onChangeTextFunction',
      );
      render(
        <Provider store={store}>
          <AddDevice {...props} />
        </Provider>,
      );

      fireEvent.press(screen.getByTestId('serialProp'));
      fireEvent.changeText(screen.getByTestId('serialProp'), 'serial number 1');
      expect(onChangeTextFnSPy).toHaveBeenCalled();
    });
  });

  describe('on back press', () => {
    test('if submitted with invalid macaddress, it should show toast', async () => {
      render(
        <Provider store={store}>
          <AddDevice {...props} />
        </Provider>,
      );

      const macAddress = '';
      const serialNumber = 'serial number 1';
      const schoolId = '1';
      const roomId = '1';
      const navigation = () => { };

      onBackPressSaveDevice(
        macAddress,
        serialNumber,
        schoolId,
        roomId,
        navigation,
      );

      const toastSpy = jest.spyOn(Toast, 'show');
      expect(toastSpy).toBeCalled();
    });
  });

  describe('on back press', () => {
    test('if submitted with duplicate macaddress, it should show toast for duplicate mac', async () => {
      render(
        <Provider store={store}>
          <AddDevice {...props} />
        </Provider>,
      );

      const macAddress = 'AB:CD:EF:GH:VV';
      const serialNumber = 'serial number 1';
      const schoolId = '1';
      const roomId = '1';
      const navigation = () => { };

      onBackPressSaveDevice(
        macAddress,
        serialNumber,
        schoolId,
        roomId,
        navigation,
      );

      const toastSpy = jest.spyOn(Toast, 'show');
      expect(toastSpy).toBeCalled();
    });
  });

  describe('duplicate mac function', () => {
    test('if macAddress is duplicate, it should return true', async () => {
      render(
        <Provider store={store}>
          <AddDevice {...props} />
        </Provider>,
      );

      const macAddress = 'AB:LW:EF:GH:IJ';
      const schoolId = 1;

      const result = await isDuplicateMacAddress(schoolId, macAddress);
      expect(result).toBeTruthy();
    });
  });
});

describe('RoomDropDown Selection', () => {
  test('if school is selected, it should fetch rooms list under selected school', () => {
    let schoolId = 1;
    const setIsRoomDropDown = () => { };
    const setModalVisible = () => { };
    const modalVisible = () => { };
    const setSearch = () => { };
    const setRoomData = () => { };
    const setDataSource = () => { };

    const readValueSpy = jest.spyOn(RNFS, 'readFile');
    roomDropDown(
      schoolId,
      setIsRoomDropDown,
      setModalVisible,
      modalVisible,
      setSearch,
      setRoomData,
      setDataSource,
    );
    expect(readValueSpy).toBeCalled();
  });

  test('on selection of roomDropDown when school is selected and invoke getRoom', () => {
    let schoolId = 1;
    const setIsRoomDropDown = () => { };
    const setModalVisible = () => { };
    const modalVisible = () => { };
    const setSearch = () => { };
    const setRoomData = () => { };
    const setDataSource = () => { };

    const readValueSpy = jest.spyOn(RNFS, 'readFile').mockImplementation(() => {
      throw new Error('cannot read data from localStorage.');
    });
    roomDropDown(
      schoolId,
      setIsRoomDropDown,
      setModalVisible,
      modalVisible,
      setSearch,
      setRoomData,
      setDataSource,
    );
    expect(readValueSpy).toBeCalled();
  });

  test('it should show toast if school is not selected', () => {
    let schoolId = 0;
    const setIsRoomDropDown = () => { };
    const setModalVisible = () => { };
    const modalVisible = () => { };
    const setSearch = () => { };
    const setRoomData = () => { };
    const setDataSource = () => { };

    jest.resetAllMocks();
    roomDropDown(
      schoolId,
      setIsRoomDropDown,
      setModalVisible,
      modalVisible,
      setSearch,
      setRoomData,
      setDataSource,
    );
    const toastSpy = jest.spyOn(Toast, 'show');
    expect(toastSpy).toBeCalled();
  });
});
