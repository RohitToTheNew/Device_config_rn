import React from 'react';
import AddDevice from '../../src/screens/addDevice/index';
import renderer, { act as rendererAct } from 'react-test-renderer';
import { fireEvent, render, screen, cleanup, waitFor } from '@testing-library/react-native';
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
import { translate } from '../../src/translations/translationHelper';
import Utils from '../../src/utils';

// Global cleanup after each test
afterEach(() => {
  cleanup();
});

const props = {
  writeDataTolocalStorage: jest
    .fn()
    .mockImplementation(() => Promise.resolve()),
  route: { params: [] },
  navigation: { push: () => jest.fn(), goBack: () => jest.fn() },
};

describe('on landing to add device with scan result containing data', () => {
  let tree;
  
  beforeEach(() => {
    rendererAct(() => {
      tree = renderer.create(<AddDevice {...props} />).toJSON();
    });
  });

  it('should render add device correctly', () => {
    expect(tree).toMatchSnapshot();
  });
});

describe('on landing to add device with scan result containing no data', () => {
  let tree;
  
  beforeEach(() => {
    rendererAct(() => {
      tree = renderer.create(<AddDevice {...props} />).toJSON();
    });
  });

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
    const deviceTypeProp = await screen.findByTestId('deviceTypePropselectedValue');
    expect(deviceTypeProp).toHaveTextContent('CZA1300');
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
    const setIsRoomDropDown = jest.fn();
    const setDeviceTypeSelected = jest.fn();
    const setModalVisible = jest.fn();
    const modalVisible = false;
    const setSearch = jest.fn();
    const setRoomData = jest.fn();
    const setDataSource = jest.fn();
    const schoolData = [];

    const toastSpy = jest.spyOn(Utils, 'showToast');
    
    roomDropDown(
      schoolId,
      setIsRoomDropDown,
      setDeviceTypeSelected,
      setModalVisible,
      modalVisible,
      setSearch,
      setRoomData,
      setDataSource,
      schoolData,
    )(); // Call the returned function
    
    expect(toastSpy).toBeCalled();
    toastSpy.mockRestore();
  });
});

describe('School drop down', () => {
  test('It should show create new school option when typing', async () => {
    const { getByTestId, findByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <AddDevice {...props} />
      </Provider>,
    );
    
    fireEvent.press(getByTestId('schoolDropDownTouchable'));
    fireEvent.changeText(getByPlaceholderText(translate('typeToSearchOrAdd')), 'New School');
    
    // Verify that the "Create New School" button appears
    const createSchoolBtn = await findByText('+ Create New School');
    expect(createSchoolBtn).toBeTruthy();
    expect(getByTestId('listModel')).toBeTruthy();

    // Press the create button
    fireEvent.press(createSchoolBtn);
    
    // After creating a school, the room dropdown should open automatically
    await waitFor(() => {
      const dropDownHeading = getByTestId('dropDownHeading');
      // The room dropdown heading should appear
      expect(dropDownHeading).toBeTruthy();
    });
  });

  describe('Update Selected School', () => {
    test('on Selection of a school having School 1 as a title, Room title should be reset to default', () => {
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
      const title = { data: { item: { title: 'School 1' } } };
      const schoolId = 0;
      const setSchoolId = jest.fn();
      const setSelectedSchool = jest.fn();
      const setSelectedRoom = jest.fn();
      const setModalVisible = jest.fn();
      const setSearch = jest.fn();
      const setSchoolSelectedFlag = jest.fn();
      const setIsRoomDropDown = jest.fn();
      const setDeviceTypeSelected = jest.fn();
      const modalVisible = false;
      const setRoomData = jest.fn();
      const setDataSource = jest.fn();

      updateSelectedSchool(
        dataSource,
        title,
        setSchoolId,
        setSelectedSchool,
        setSelectedRoom,
        setModalVisible,
        setSearch,
        setSchoolSelectedFlag,
        schoolId,
        setIsRoomDropDown,
        setDeviceTypeSelected,
        modalVisible,
        setRoomData,
        setDataSource,
      );

      // Verify that the function called setSelectedRoom with the translated text
      expect(setSelectedRoom).toHaveBeenCalledWith(translate('selectRoom'));
      expect(setSelectedSchool).toHaveBeenCalledWith('School 1');
      expect(setSchoolSelectedFlag).toHaveBeenCalledWith(true);
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

      const toastSpy = jest.spyOn(Utils, 'showToast');

      const macAddress = '';
      const serialNumber = 'serial number 1';
      const schoolId = '1';
      const roomId = '1';
      const deviceName = 'Test Device';
      const deviceType = 'MS700';
      const selectedSchool = 'School 1';
      const selectedRoom = 'Room 1';
      const navigation = { goBack: jest.fn() };
      const dismissPopup = false;
      const setDismissPopup = jest.fn();

      await onBackPressSaveDevice(
        macAddress,
        serialNumber,
        schoolId,
        roomId,
        deviceName,
        deviceType,
        selectedSchool,
        selectedRoom,
        navigation,
        dismissPopup,
        setDismissPopup,
      );

      expect(toastSpy).toBeCalled();
      toastSpy.mockRestore();
    });
  });

  describe('on back press', () => {
    test('if submitted with duplicate macaddress, it should show toast for duplicate mac', async () => {
      render(
        <Provider store={store}>
          <AddDevice {...props} />
        </Provider>,
      );

      const toastSpy = jest.spyOn(Utils, 'showToast');

      const macAddress = 'AB:CD:EF:GH:VV';
      const serialNumber = 'serial number 1';
      const schoolId = '1';
      const roomId = '1';
      const deviceName = 'Test Device';
      const deviceType = 'MS700';
      const selectedSchool = 'School 1';
      const selectedRoom = 'Room 1';
      const navigation = { goBack: jest.fn() };
      const dismissPopup = false;
      const setDismissPopup = jest.fn();

      await onBackPressSaveDevice(
        macAddress,
        serialNumber,
        schoolId,
        roomId,
        deviceName,
        deviceType,
        selectedSchool,
        selectedRoom,
        navigation,
        dismissPopup,
        setDismissPopup,
      );

      expect(toastSpy).toBeCalled();
      toastSpy.mockRestore();
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
    const readValueSpy = jest.spyOn(RNFS, 'readFile');
    
    let schoolId = 1;
    const setIsRoomDropDown = jest.fn();
    const setDeviceTypeSelected = jest.fn();
    const setModalVisible = jest.fn();
    const modalVisible = false;
    const setSearch = jest.fn();
    const setRoomData = jest.fn();
    const setDataSource = jest.fn();
    const schoolData = [];

    roomDropDown(
      schoolId,
      setIsRoomDropDown,
      setDeviceTypeSelected,
      setModalVisible,
      modalVisible,
      setSearch,
      setRoomData,
      setDataSource,
      schoolData,
    )(); // Call the returned function
    
    expect(readValueSpy).toBeCalled();
    readValueSpy.mockRestore();
  });

  test('on selection of roomDropDown when school is selected and invoke getRoom', () => {
    const readValueSpy = jest.spyOn(RNFS, 'readFile').mockImplementation(() => {
      throw new Error('cannot read data from localStorage.');
    });
    
    let schoolId = 1;
    const setIsRoomDropDown = jest.fn();
    const setDeviceTypeSelected = jest.fn();
    const setModalVisible = jest.fn();
    const modalVisible = false;
    const setSearch = jest.fn();
    const setRoomData = jest.fn();
    const setDataSource = jest.fn();
    const schoolData = [];

    roomDropDown(
      schoolId,
      setIsRoomDropDown,
      setDeviceTypeSelected,
      setModalVisible,
      modalVisible,
      setSearch,
      setRoomData,
      setDataSource,
      schoolData,
    )(); // Call the returned function
    
    expect(readValueSpy).toBeCalled();
    readValueSpy.mockRestore();
  });

  test('it should show toast if school is not selected', () => {
    const toastSpy = jest.spyOn(Utils, 'showToast');
    
    let schoolId = 0;
    const setIsRoomDropDown = jest.fn();
    const setDeviceTypeSelected = jest.fn();
    const setModalVisible = jest.fn();
    const modalVisible = false;
    const setSearch = jest.fn();
    const setRoomData = jest.fn();
    const setDataSource = jest.fn();
    const schoolData = [];

    roomDropDown(
      schoolId,
      setIsRoomDropDown,
      setDeviceTypeSelected,
      setModalVisible,
      modalVisible,
      setSearch,
      setRoomData,
      setDataSource,
      schoolData,
    )(); // Call the returned function
    
    expect(toastSpy).toBeCalled();
    toastSpy.mockRestore();
  });
});
