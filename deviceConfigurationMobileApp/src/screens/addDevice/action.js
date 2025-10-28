const identifire = 'add device log: ';
import RNFS from 'react-native-fs';
import {translate} from '../../translations/translationHelper';
import styles from './styles';
import {View, Text} from 'react-native';
import Utils from '../../utils';
import {CommonActions} from '@react-navigation/native';

/**
 * To read content of localStorage file
 * @returns the data stored in local file
 */
const readFileFromLocalStorage = async () => {
  const result = RNFS.readFile(RNFS.DocumentDirectoryPath + '/test.txt', 'utf8');
  return result;
};

/**
 * To write content to localStorage file
 * @param {variable} schools contains data of school to write in localStorage
 * @returns the status if file is written or error occurred
 */
const writeDataTolocalStorage = async schools => {
  const data = JSON.stringify(schools);
  const path = RNFS.DocumentDirectoryPath + '/test.txt';
  try {
    await RNFS.writeFile(path, data, 'utf8');
    return `FILE WRITTEN!`;
  } catch (err) {
    return `Error while writing`;
  }
};

/**
 * function to handle the device type dropdown click
 * @param {boolean} modalVisible for showing model
 * @param {function} setModalVisible set model visibility
 * @param {function} setSearch setting search input value
 * @param {function} setDataSource container for School/Room data
 * @param {boolean} setDeviceTypeSelected check for device type selection
 */
function deviceTypeDropDown(
  setIsRoomDropDown,
  modalVisible,
  setModalVisible,
  setSearch,
  setDataSource,
  setDeviceTypeSelected,
) {
  setIsRoomDropDown(false);
  setModalVisible(true);
  setSearch('');
  setDeviceTypeSelected(true);
  setDataSource([{deviceType: 'MS-700'}, {deviceType: 'InfoViewPlayer'}, {deviceType: 'CZA1300'}]);
}

/**
 * School drop down click
 * @param {function} setIsRoomDropDown This will set the roomDropDown flag value
 * @param {boolean} modalVisible for showing model
 * @param {function} setModalVisible set model visibility
 * @param {function} setSearch setting search input value
 * @param {function} setDataSource container for School/Room data
 * @param {function} setSchoolData container for School data
 */
function schoolDropDown(
  setIsRoomDropDown,
  setDeviceTypeSelected,
  modalVisible,
  setModalVisible,
  setSearch,
  setDataSource,
  setSchoolData,
) {
  return () => {
    setIsRoomDropDown(false);
    setDeviceTypeSelected(false);
    setModalVisible(!modalVisible);
    setSearch('');
    getSchoolData(setDataSource, setSchoolData);
  };
}

/**
 * Setting data for Schools and Rooms
 * @param {function} setDataSource used to set data for School/Room
 * @param {function} setSchoolData used to set school data
 */
const getSchoolData = async (setDataSource, setSchoolData) => {
  setDataSource([]);
  setSchoolData([]);
  try {
    const data = await readFileFromLocalStorage();
    setDataSource(JSON.parse(data));
    setSchoolData(JSON.parse(data));
  } catch (e) {
    Utils.showToast(translate('error'), translate('errorInReadingSchool'));
  }
};

/**
 * Room drop down is click
 * @param {variable} schoolId it represents school in numeric form
 * @param {function} setIsRoomDropDown a function which set roomDropDown value in form of true/false
 * @param {function} setModalVisible a function which sets visibility of model
 * @param {boolean} modalVisible boolean value
 * @param {function} setSearch for setting search text
 * @param {function} setRoomData container for roomData
 * @param {function} setDataSource container for data source Room/School data
 */

function roomDropDown(
  schoolId,
  setIsRoomDropDown,
  setDeviceTypeSelected,
  setModalVisible,
  modalVisible,
  setSearch,
  setRoomData,
  setDataSource,
  schoolData,
) {
  return () => {
    if (schoolId !== 0) {
      setDeviceTypeSelected(false);
      setIsRoomDropDown(true);
      setModalVisible(true);
      setSearch('');
      getRoom(schoolId, setRoomData, setDataSource, schoolData);
    } else {
      Utils.showToast(
        translate('actionRequired'),
        translate('pleaseSelectSchoolFirst'),
      );
    }
  };
}

/**
 * function to read rooms data from local storage and set into data source
 * @param {variable} schoolId id of the school under consideration
 * @param {function} setRoomData function to set the room data
 * @param {function} setDataSource function to set the DataSource
 * @param {object} schoolData object containing the school data
 */
const getRoom = async (schoolId, setRoomData, setDataSource, schoolData) => {
  setRoomData([]);
  setDataSource([]);
  try {
    const data = await readFileFromLocalStorage();
    const schools = JSON.parse(data);
    const school = schools.find(item => item.id === schoolId);
    const availableRooms = school.rooms;

    setRoomData(availableRooms);
    setDataSource(availableRooms);
  } catch (e) {
    Utils.Log(Utils.logType.log, 'Error in getRoom()', e);
  }
};

/**
 * On selection of school
 * @param {vaiable} dataSource container which holds data School/Room
 * @param {variable} title title for model
 * @param {function} setSchoolId used to set schoolId
 * @param {function} setSelectedSchool used to set selected School
 * @param {function} setSelectedRoom used to set selected Room
 * @param {function} setModalVisible used to set model visibility
 * @param {function} setSearch for setting search text
 * @param {function} setSchoolSelectedFlag used to set schoolSelected flag
 */
const updateSelectedSchool = (
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
) => {
  const obj = dataSource.find(data => data.title === title?.data?.item?.title);
  if (obj !== undefined) {
    setSchoolSelectedFlag(true);
    setSchoolId(obj?.id);
    setSelectedSchool(title.data.item.title);
    setSelectedRoom(translate('selectRoom'));
  }
  setModalVisible(false);
  setSearch('');

  const paramsToCallRoomDropDown = {
    schoolId: obj?.id,
    setIsRoomDropDown,
    setDeviceTypeSelected,
    setModalVisible,
    modalVisible,
    setSearch,
    setRoomData,
    setDataSource,
  };
  openRoomDropDown(paramsToCallRoomDropDown);
};

/**
 * function to open the room dropdown picker
 * @param {object} paramsToCallRoomDropDown object containing data to call room dropdown
 */
function openRoomDropDown(paramsToCallRoomDropDown) {
  roomDropDown(
    paramsToCallRoomDropDown.schoolId,
    paramsToCallRoomDropDown.setIsRoomDropDown,
    paramsToCallRoomDropDown.setDeviceTypeSelected,
    paramsToCallRoomDropDown.setModalVisible,
    paramsToCallRoomDropDown.modalVisible,
    paramsToCallRoomDropDown.setSearch,
    paramsToCallRoomDropDown.setRoomData,
    paramsToCallRoomDropDown.setDataSource,
    paramsToCallRoomDropDown.schoolData,
  )();
}

/**
 * To update school list in data
 * @param {variable} schoolData used to store school data
 * @param {function} setModalVisible used to set model visibility
 * @param {function} setSearch for setting search text
 * @param {function} setDataSource container for data source Room/School data
 * @param {function} setSchoolData container for School data
 * @param {vaiable} dataSource container which holds data School/Room
 * @param {function} setSchoolId used to set schoolId
 * @param {function} setSelectedSchool used to set selected School
 * @param {function} setSelectedRoom used to set selected Room
 * @param {function} setSchoolSelectedFlag used to set schoolSelected flag
 * @returns title for model
 */
function schoolListUpdate(
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
  setIsRoomDropDown,
  modalVisible,
  setDeviceTypeSelected,
  setRoomData,
) {
  return async title => {
    try {
      const result = await readFileFromLocalStorage();
    } catch (Ex) {
      let dataToBeSave = [];
      writeDataTolocalStorage(dataToBeSave);
    }
    setModalVisible(false);
    setSearch('');
    setSchoolSelectedFlag(true);
    setSchoolId(schoolData.length + 1);
    setSelectedSchool(title);
    setSelectedRoom(translate('selectRoom'));
    setModalVisible(false);
    setSearch('');
    const paramsToCallRoomDropDown = {
      schoolId: schoolData.length + 1,
      setIsRoomDropDown,
      setDeviceTypeSelected,
      setModalVisible,
      modalVisible,
      setSearch,
      setRoomData,
      setDataSource,
      schoolData,
    };
    openRoomDropDown(paramsToCallRoomDropDown);
  };
}

/**
 * To update room list in localStorage
 * @param {variable} roomData used to store data for room
 * @param {variable} schoolId it represents school in numeric form
 * @param {function} setRoomData container for roomData
 * @param {function} setRoomId used to set RoomId
 * @param {function} setDataSource container for data source Room/School data
 * @param {function} setSelectedRoom used to set selected Room
 * @param {function} setModalVisible used to set model visibility
 * @param {function} setSearch for setting search text
 * @param {function} setRoomSelectedFlag used to set roomSelected flag
 * @returns title for model
 */
function roomListUpdate(
  dataSource,
  roomData,
  schoolId,
  setRoomData,
  setRoomId,
  setDataSource,
  setSelectedRoom,
  setModalVisible,
  setSearch,
  setRoomSelectedFlag,
  setIsRoomDropDown,
  modalVisible,
  setDeviceTypeSelected,
  deviceTypeScanIsValid
) {
  return async title => {
    try {
      setModalVisible(false);
      setSearch('');
      setRoomId(roomData.length + 1);
      setRoomSelectedFlag(true);
      setSelectedRoom(title);
      setModalVisible(false);
      setSearch('');
      if(!deviceTypeScanIsValid) {
        deviceTypeDropDown(
          setIsRoomDropDown,
          modalVisible,
          setModalVisible,
          setSearch,
          setDataSource,
          setDeviceTypeSelected,
          deviceTypeScanIsValid
        );
      }
    } catch (e) {
      Utils.Log(Utils.logType.log, 'Error in updateRoomList()', e);
    }
  };
}

/**
 * On selection of room
 * @param {variable} title title for model
 * @param {function} setSelectedRoom used to set selected Room
 * @param {function} setModalVisible used to set model visibility
 * @param {function} setSearch for setting search text
 * @param {function} setRoomSelectedFlag used to set roomSelected flag
 * @param {variable} roomData used to store data for room
 * @param {function} setRoomId used to set RoomId
 */
const updateSelectedRoom = (
  title,
  setSelectedRoom,
  setModalVisible,
  setSearch,
  setRoomSelectedFlag,
  roomData,
  setRoomId,
  setIsRoomDropDown,
  modalVisible,
  setDataSource,
  setDeviceTypeSelected,
  deviceTypeScanIsValid
) => {
  setRoomSelectedFlag(true);
  setSelectedRoom(title.data.item.title);
  setRoomId(title.data.item.id);
  setModalVisible(false);
  setSearch('');
  if(!deviceTypeScanIsValid){
    deviceTypeDropDown(
      setIsRoomDropDown,
      modalVisible,
      setModalVisible,
      setSearch,
      setDataSource,
      setDeviceTypeSelected,
    );
  }
};

/**
 * On model close.
 * @param {function} setModalVisible used to set model visibility
 * @param {boolean} modalVisible used to set model visibility
 * @param {function} setSearch for setting search text
 * @returns object
 */

function searchBarClose(setModalVisible, modalVisible, setSearch) {
  return () => {
    setModalVisible(!modalVisible);
    setSearch('');
  };
}

/**
 * To render school/room on model
 * @param {boolean} isRoomDropDown used to identify Room drop down is clicked
 * @param {function} setSelectedRoom used to set selected Room
 * @param {function} setModalVisible used to set model visibility
 * @param {function} setSearch for setting search text
 * @param {vaiable} dataSource container which holds data School/Room
 * @param {function} setSchoolId used to set schoolId
 * @param {function} setRoomId used to set RoomId
 * @param {function} setSelectedSchool used to set selected School
 * @param {function} setSchoolSelectedFlag used to set schoolSelected flag
 * @param {function} setRoomSelectedFlag used to set roomSelected flag
 * @param {variable} roomData used to store data for room
 * @returns view
 */
function renderListItem(
  isRoomDropDown,
  setSelectedRoom,
  setModalVisible,
  setSearch,
  dataSource,
  setSchoolId,
  setRoomId,
  setSelectedSchool,
  setSchoolSelectedFlag,
  setRoomSelectedFlag,
  roomData,
  schoolId,
  setIsRoomDropDown,
  setDeviceTypeSelected,
  modalVisible,
  setRoomData,
  setDataSource,
  deviceTypeScanIsValid
) {
  return item => (
    <View style={styles.item}>
      <Text
        style={styles.title}
        onPress={() => {
          isRoomDropDown
            ? updateSelectedRoom(
                item,
                setSelectedRoom,
                setModalVisible,
                setSearch,
                setRoomSelectedFlag,
                roomData,
                setRoomId,
                setIsRoomDropDown,
                modalVisible,
                setDataSource,
                setDeviceTypeSelected,
                deviceTypeScanIsValid
              )
            : updateSelectedSchool(
                dataSource,
                item,
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
        }}>
        {item?.data?.item?.title}
      </Text>
    </View>
  );
}

/**
 * On type of Mac address/ Serial number
 * @param {function} setMacAddress used to set macaddress
 * @param {function} setSerialNumber used to set serial number
 * @param {function} setDeviceName used to set device name
 * @returns object
 */
function onChangeTextFunction(setMacAddress, setSerialNumber, setDeviceName) {
  return (key, value) => {
    switch (key) {
      case 'MAC Address':
        const mac =
          value &&
          value
            .replace(/[^\d|A-Z|a-z]/g, '')
            .match(/.{1,2}/g || [])
            .join(':');
        setMacAddress(mac);
        break;
      case 'Serial Number':
        setSerialNumber(value);
        break;
      case 'Device Name':
        const result = value.replace(/[^\d|A-Z|a-z_-]/g, '');
        setDeviceName(result);
      default:
        break;
    }
  };
}

/**
 * To check if user filled all the required fields
 * @param {variable} macAddress used to set mac address
 * @param {variable} serialNumber used to set serial number
 * @param {variable} selectedSchool used to set selected school
 * @param {variable} selectedRoom used to set selected room
 * @returns boolean
 */
function saveDeviceEnableCheck(
  macAddress,
  serialNumber,
  selectedSchool,
  selectedRoom,
  deviceName,
  deviceType,
) {
  return (
    macAddress &&
    serialNumber &&
    selectedSchool &&
    selectedSchool !== 'Select School' &&
    selectedRoom &&
    selectedRoom !== 'Select Room' &&
    deviceName &&
    deviceType &&
    deviceType !== 'Select Device Type'
  );
}

/**
 * On entering any text in search box
 * @param {*} isRoomDropDown
 * @param {variable} roomData used to store data for room
 * @param {variable} schoolData used to store school data
 * @param {function} setDataSource container for data source Room/School data
 * @param {function} setSearch for setting search text
 * @returns text to search
 */
function searchFilter(
  isRoomDropDown,
  roomData,
  schoolData,
  setDataSource,
  setSearch,
) {
  return text => {
    if (text) {
      const dataToSearch = isRoomDropDown ? roomData : schoolData;
      let newData = dataToSearch.filter(function (item) {
        const itemData = item.title ? item.title.toUpperCase() : '';
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      if (newData.length === 0) {
        newData = [
          ...newData,
          {id: dataToSearch.length + 1, title: text, isNewEntry: true},
        ];
      }
      setDataSource(newData);
      setSearch(text);
    } else {
      if (!isRoomDropDown) {
        setDataSource(schoolData);
      } else {
        setDataSource(roomData);
      }
      setSearch(text);
    }
  };
}

/**
 * To check if any duplicate Mac address found
 * @param {variable} schoolId it represents school in numeric form
 * @param {variable} mac it represents mac address
 * @returns boolean
 */
async function isDuplicateMacAddress(schoolId, mac) {
  try {
    const data = await readFileFromLocalStorage();
    const parsedData = JSON.parse(data);
    if (parsedData.length === 0) {
      return true;
    }
    const rooms = parsedData?.find(d => d?.id === schoolId)?.rooms;
    if (rooms !== undefined) {
      let macAddressContainer = [];
      for (const dat of rooms) {
        for (const macAddress in dat.devices) {
          macAddressContainer.push(dat.devices[macAddress].macAddress);
        }
      }
      return macAddressContainer.indexOf(mac) === -1;
    } else {
      return true;
    }
  } catch (e) {
    Utils.Log(
      Utils.logType.log,
      identifire,
      'Error in isDuplicateMacAddress()',
    );
    return true;
  }
}

/**
 * To save device details corrosponding to school/ Room
 * @param {variable} schoolId it represents school in numeric form
 * @param {vaiable} roomId it represents room in numeric form
 * @param {object} device it holds device information
 */
async function addDeviceToRoom(schoolId, roomId, device) {
  try {
    let rooms = [];
    const data = await readFileFromLocalStorage();
    const parsedData = JSON.parse(data);
    if (parsedData.length !== 0) {
      let schoolData = parsedData?.find(d => d.id === schoolId);
      if (schoolData !== undefined) {
        rooms = schoolData?.rooms.find(roomData => roomData.id === roomId);
        if (rooms !== undefined) {
          device.deviceID = rooms?.devices?.length + 1;
          rooms.devices.push(device);
          await writeDataTolocalStorage(parsedData);
        } else {
          const roomData = {
            id: roomId,
            title: device.roomTitle,
            devices: [
              {
                macAddress: device.macAddress,
                serialNumber: device.serialNumber,
                deviceName: device.deviceName,
                deviceType: device.deviceType,
                deviceID: 1,
              },
            ],
          };
          schoolData?.rooms.push(roomData);
          await writeDataTolocalStorage(parsedData);
        }
      } else {
        const dataToBeSave = {
          id: schoolId,
          title: device.schoolTitle,
          rooms: [
            {
              id: roomId,
              title: device.roomTitle,
              devices: [
                {
                  macAddress: device.macAddress,
                  serialNumber: device.serialNumber,
                  deviceName: device.deviceName,
                  deviceType: device.deviceType,
                  deviceID: 1,
                },
              ],
            },
          ],
        };
        parsedData.push(dataToBeSave);
        writeDataTolocalStorage(parsedData);
      }
    } else {
      const dataToBeSave = [
        {
          id: schoolId,
          title: device.schoolTitle,
          rooms: [
            {
              id: roomId,
              title: device.roomTitle,
              devices: [
                {
                  macAddress: device.macAddress,
                  serialNumber: device.serialNumber,
                  deviceName: device.deviceName,
                  deviceType: device.deviceType,
                  deviceID: 1,
                },
              ],
            },
          ],
        },
      ];
      writeDataTolocalStorage(dataToBeSave);
    }
  } catch (e) {
    Utils.Log(Utils.logType.log, identifire, 'Error in addDeviceToRoom()');
  }
}

/**
 * To validate Mac address length
 * @param {variable} macAddress it represents mac address
 * @returns boolean
 */
const isValidMacAddress = macAddress => {
  return macAddress.length === 17;
};

/**
 * Mac address validation then save device info
 * @param {variable} macAddress it represents mac address
 * @param {variable} serialNumber it represents serial number
 * @param {variable} schoolId it represents school in numeric form
 * @param {vaiable} roomId it represents room in numeric form
 * @param {object} navigation it represents navigation object
 */
const navigateToDeviceListing = async params => {
  if (isValidMacAddress(params.macAddress)) {
    const dataCanBeSaved = await isDuplicateMacAddress(
      params.schoolId,
      params.macAddress,
    );
    if (dataCanBeSaved) {
      const deviceData = {
        macAddress: params.macAddress,
        serialNumber: params.serialNumber,
        deviceName: params.deviceName,
        deviceType: params.deviceType,
        schoolTitle: params.selectedSchool,
        roomTitle: params.selectedRoom,
      };
      await addDeviceToRoom(params.schoolId, params.roomId, deviceData);
      Utils.showToast(translate('deviceAddedSuccessfully'));
      setTimeout(() => {
        const resetAction = CommonActions.reset({
          index: 1,
          routes: [{name: 'manageSchool'}],
        });
        params.navigation.dispatch(resetAction);
        params.navigation.replace('manageSchool');
      }, 500);
    } else {
      Utils.showToast(translate('macAddressShouldBeUnique'));
    }
  } else {
    Utils.showToast(translate('pleaseProvideValidMacAddress'));
  }
};

/**
 * On click back button
 * @param {variable} macAddress it represents mac address
 * @param {variable} serialNumber it represents serial number
 * @param {variable} schoolId it represents school in numeric form
 * @param {vaiable} roomId it represents room in numeric form
 * @param {object} navigation it represents navigation object
 */
const onBackPressSaveDevice = async (
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
) => {
  let deviceData = {
    macAddress: macAddress,
    serialNumber: serialNumber,
    deviceName: deviceName,
    deviceType: deviceType,
    schoolTitile: selectedSchool,
    roomTitle: selectedRoom,
  };
  if (
    macAddress &&
    macAddress !== '' &&
    serialNumber &&
    serialNumber !== '' &&
    schoolId &&
    schoolId !== '' &&
    roomId &&
    roomId !== ''
  ) {
    if (isValidMacAddress(macAddress)) {
      let dataCanBeSaved = await isDuplicateMacAddress(schoolId, macAddress);
      if (dataCanBeSaved) {
        addDeviceToRoom(schoolId, roomId, deviceData);
        Utils.showToast(translate('deviceAddedSuccessfully'));
        navigation.goBack();
      } else {
        Utils.showToast(translate('macAddressShouldBeUnique'));
      }
    } else {
      Utils.showToast(translate('pleaseProvideValidMacAddress'));
    }
  } else {
    setDismissPopup(!dismissPopup);
    Utils.showToast(translate('pleaseProvideDetailsToSave'));
  }
};

/**
 * function to update the device type selected from dropdown
 * @param {variable} deviceType it represents the device type
 * @param {function} setDeviceType function to set the device type flag
 * @param {boolean} modalVisible it represents whether the modal is visible
 * @param {function} setModalVisible sets the modalVisible flag
 * @param {function} setDeviceTypeSelectedFlag set the deviceTypeSelectedFlag
 */
function updateDeviceType(
  deviceType,
  setDeviceType,
  modalVisible,
  setModalVisible,
  setDeviceTypeSelectedFlag,
) {
  setDeviceType(deviceType);
  setModalVisible(!modalVisible);
  setDeviceTypeSelectedFlag(true);
}

/**
 * function to check if any data has changed on settings screen
 * @param {object} data object containing the devices data
 * @returns boolean
 */
function isAnyDataChanged(data) {
  return !(
    data.deviceName === '' &&
    data.deviceType === 'Select Device Type' &&
    data.macAddress === '' &&
    data.roomTitle === 'Select Room' &&
    data.schoolTitle === 'Select School' &&
    data.serialNumber === ''
  );
}

export {
  readFileFromLocalStorage,
  writeDataTolocalStorage,
  schoolDropDown,
  roomDropDown,
  updateSelectedSchool,
  updateSelectedRoom,
  schoolListUpdate,
  roomListUpdate,
  searchBarClose,
  renderListItem,
  onChangeTextFunction,
  saveDeviceEnableCheck,
  searchFilter,
  isDuplicateMacAddress,
  addDeviceToRoom,
  onBackPressSaveDevice,
  navigateToDeviceListing,
  deviceTypeDropDown,
  updateDeviceType,
  isAnyDataChanged,
};
