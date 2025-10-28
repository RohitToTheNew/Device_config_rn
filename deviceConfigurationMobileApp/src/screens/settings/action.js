const identifire = 'add device log: ';
import RNFS from 'react-native-fs';
import {translate} from '../../translations/translationHelper';
import styles from './styles';
import {View, Text} from 'react-native';
import Utils from '../../utils';
import {updateNetworkSettingsFields} from '../../services/network/action';
import BleManager from '../../config/bleManagerInstance';
import {UUIDMappingInfoView, UUIDMappingMS700} from '../../constants';
import {sentryErrorHandler} from '../../utils/errorHandler';
import {isDublicateMacAddress} from '../updateDevice/action';

/**
 * To return content of localStorage file
 * @returns the data stored in local file
 */
const readFileFromLocalStorage = async () => {
  let result = RNFS.readFile(RNFS.DocumentDirectoryPath + '/test.txt', 'utf8');
  return result;
};

/**
 * To writes content to localStorage file
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
 * @param {boolean} setIsRoomDropDown set is a dropdown
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
  setModalVisible(!modalVisible);
  setSearch('');
  setDeviceTypeSelected(true);
  setDataSource([{deviceType: 'MS700'}, {deviceType: 'InfoViewPlayer'}, {deviceType: 'CZA1300'}]);
}

/**
 * School drop down click
 * @param {function} setIsRoomDropDown This will set the roomDropDown flag value
 * @param {function} setDeviceTypeSelected This will set the deviceTypeSelected flag value
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
 * @param {function} setDeviceTypeSelected This will set the deviceTypeSelected flag value
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
) {
  return () => {
    if (schoolId !== 0) {
      setDeviceTypeSelected(false);
      setIsRoomDropDown(true);
      setModalVisible(!modalVisible);
      setSearch('');
      getRoom(schoolId, setRoomData, setDataSource);
    } else {
      Utils.showToast(
        translate('actionRequired'),
        translate('pleaseSelectSchoolFirst'),
      );
    }
  };
}

/**
 * To filters and set room data
 * @param {variable} schoolId it represents school in numeric form
 * @param {function} setRoomData container for roomData
 * @param {function} setDataSource container for data source Room/School data
 */
const getRoom = async (schoolId, setRoomData, setDataSource) => {
  setRoomData([]);
  setDataSource([]);
  try {
    const data = await readFileFromLocalStorage();
    const school = JSON.parse(data).find(item => item.id === schoolId);
    const availableRooms = school?.rooms;
    setRoomData(availableRooms);
    setDataSource(availableRooms);
  } catch (e) {
    Utils.Log(Utils.logType.error,'Error in getRoom()', e);
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
) => {
  const newObject = dataSource.find(data => data.title === title);
  if (newObject !== undefined) {
    setSchoolSelectedFlag(true);
    setSchoolId(newObject?.id);
    setSelectedSchool(title);
    setSelectedRoom(translate('selectRoom'));
  }
  setModalVisible(false);
  setSearch('');
};

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
) {
  return async title => {
    let newRecord = {id: schoolData.length + 1, title: title, rooms: []};
    schoolData.push(newRecord);

    writeDataTolocalStorage(schoolData);
    setModalVisible(false);
    setSearch('');

    try {
      let data = await readFileFromLocalStorage();
      setDataSource(JSON.parse(data));
      setSchoolData(JSON.parse(data));
    } catch (e) {
      Utils.Log(Utils.logType.error,'Error in updateSchoolList()', e);
    }

    let obj = dataSource.filter(data => data.title === title);
    if (obj.length === 1) {
      setSchoolSelectedFlag(true);
      setSchoolId(newRecord.id);
      setSelectedSchool(newRecord.title);
      setSelectedRoom(translate('selectRoom'));
    }
    setModalVisible(false);
    setSearch('');
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
  roomData,
  schoolId,
  setRoomData,
  setRoomId,
  setDataSource,
  setSelectedRoom,
  setModalVisible,
  setSearch,
  setRoomSelectedFlag,
) {
  return async title => {
    let newRecord = {id: roomData.length + 1, title: title, devices: []};
    try {
      let data = await readFileFromLocalStorage();
      let schools = JSON.parse(data);
      const school = schools.filter(item => item.id === schoolId);
      const availableRooms = school[0]?.rooms;

      availableRooms.push(newRecord);

      writeDataTolocalStorage(schools);
      setModalVisible(false);
      setSearch('');
      setRoomId(roomData.length + 1);
      setRoomData(availableRooms);
      setDataSource(availableRooms);

      setRoomSelectedFlag(true);
      setSelectedRoom(newRecord.title);
      setRoomId(newRecord.id);
      setModalVisible(false);
      setSearch('');
    } catch (e) {
      Utils.Log(Utils.logType.error,'Error in updateRoomList()', e);
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
) => {
  const roomTitle = title?.data?.title;
  const roomId = title?.data?.id;
  setRoomSelectedFlag(true);
  setSelectedRoom(roomTitle);
  setRoomId(roomId);
  setModalVisible(false);
  setSearch('');
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
              )
            : updateSelectedSchool(
                dataSource,
                item.data.title,
                setSchoolId,
                setSelectedSchool,
                setSelectedRoom,
                setModalVisible,
                setSearch,
                setSchoolSelectedFlag,
              );
        }}>
        {item.data.title}
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
      case 'Mac Address':
        let mac =
          value &&
          value
            .toUpperCase()
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
  return () => {
    if (
      macAddress &&
      serialNumber &&
      selectedSchool &&
      selectedSchool !== 'Select School' &&
      selectedRoom &&
      selectedRoom !== 'Select Room' &&
      deviceName &&
      deviceType &&
      deviceType !== 'Select Device Type'
    ) {
      return true;
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
      Utils.showToast(translate('somethingWentWrong'));
    }
  } catch (e) {
    Utils.Log(Utils.logType.error,'Error in isDuplicateMacAddress()', e);
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

    const schoolData = parsedData?.find(d => d.id === schoolId);

    if (schoolData !== undefined) {
      rooms = schoolData?.rooms.find(roomData => roomData.id === roomId);
      device.deviceID = rooms?.devices?.length + 1;
      rooms.devices.push(device);
      writeDataTolocalStorage(parsedData);
    } else {
      let dataToBeSave = [
        {
          id: schoolId,
          title: device.schoolTitile,
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
                  ipAddress: ipAddress,
                },
              ],
            },
          ],
        },
      ];
      writeDataTolocalStorage(dataToBeSave);
    }
  } catch (e) {
    Utils.Log(Utils.logType.error,'Error in addDeviceToRoom()', e);
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
 * @param @param {variable} serialNumber it represents serial number
 * @param {variable} schoolId it represents school in numeric form
 * @param {variable} roomId it represents room in numeric form
 * @param {variable} deviceName it represents the device name
 * @param {variable} deviceType it represents the device type
 * @param {object} navigation object containing the navigation instance
 * @param {variable} ipAddress it represents the ipAddress of device
 * @param {function} setIsDeviceAddedAlready set the isDeviceTypeAlready flag
 */
const navigateToDeviceListing = async (
  macAddress,
  serialNumber,
  schoolId,
  roomId,
  deviceName,
  deviceType,
  navigation,
  ipAddress,
  setIsDeviceAddedAlready,
  callback,
) => {
  const deviceData = {
    macAddress: macAddress,
    serialNumber: serialNumber,
    deviceName: deviceName,
    deviceType: deviceType,
    ipAddress: ipAddress,
  };
  if (isValidMacAddress(macAddress)) {
    const dataCanBeSaved = await isDuplicateMacAddress(schoolId, macAddress);
    if (dataCanBeSaved) {
      addDeviceToRoom(schoolId, roomId, deviceData);
      Utils.showToast(translate('deviceAddedSuccessfully'));
      setTimeout(() => {
        setIsDeviceAddedAlready(true);
      }, 500);
      callback && callback();
    } else {
      Utils.showToast(translate('macAddressShouldBeUnique'));
    }
  } else {
    Utils.showToast(translate('pleaseProvideValidMacAddress'));
  }
};

/**
 * function to check if any data has changed on settings screen
 * @param {object} oldData object containing the old devices data
 * @param {*} newData object containing the new devices data
 * @returns boolean
 */
const isAnyDataChanged = (oldData, newData, connectedDevice, mac) => {
  let changed = false;
  if (Object.keys(oldData).length === 0) {
    if (newData.selectedSchool !== 'Select School') {
      changed = true;
    } else if (newData.selectedRoom !== 'Select Room') {
      changed = true;
    } else if (newData.deviceType !== connectedDevice?.deviceType) {
      changed = true;
    } else if (newData.deviceName !== connectedDevice?.localName) {
      changed = true;
    } else if (newData.macAddress !== mac) {
      changed = true;
    } else if (newData.serialNumber.length > 0) {
      changed = true;
    }
  } else {
    if (oldData.selectedRoom !== newData.selectedRoom) {
      changed = true;
    } else if (oldData.selectedSchool !== newData.selectedSchool) {
      changed = true;
    } else if (oldData.deviceType !== newData.deviceType) {
      changed = true;
    } else if (oldData.serialNumber !== newData.serialNumber) {
      changed = true;
    } else if (oldData.macAddress !== newData.macAddress) {
      changed = true;
    } else if (oldData.macAddress !== newData.macAddress) {
      changed = true;
    }
  }
  return changed;
};

/**
 * function to update the device details
 * @param {variable} macAddress it represents mac address
 * @param @param {variable} serialNumber it represents serial number
 * @param {variable} schoolId it represents school in numeric form
 * @param {variable} roomId it represents room in numeric form
 * @param {variable} deviceName it represents the device name
 * @param {variable} deviceType it represents the device type
 * @param {object} navigation object containing the navigation instance
 * @param {variable} ipAddress it represents the ipAddress of device
 * @param {function} setIsDeviceAddedAlready set the isDeviceTypeAlready flag
 * @param {object} previousData it represents the previous data
 */
export const updateDeviceDetails = async (
  macAddress,
  serialNumber,
  schoolId,
  roomId,
  deviceName,
  deviceType,
  navigation,
  ipAddress,
  setIsDeviceAddedAlready,
  previousData,
) => {
  let deviceData = {
    macAddress: macAddress,
    serialNumber: serialNumber,
    deviceName: deviceName,
    deviceType: deviceType,
    ipAddress: ipAddress,
  };
  if (isValidMacAddress(macAddress)) {
    const localData = await readFileFromLocalStorage();
    if (previousData.schoolId !== schoolId) {
      updateDeviceAtSchoolLevel(
        localData,
        previousData.schoolId,
        previousData.roomId,
        schoolId,
        roomId,
        deviceData,
        macAddress,
        navigation,
      );
    } else if (previousData.roomId !== roomId) {
      updateDeviceAtSchoolLevel(
        localData,
        previousData.schoolId,
        previousData.roomId,
        schoolId,
        roomId,
        deviceData,
        macAddress,
        navigation,
      );
    } else {
      updateDeviceField(
        localData,
        schoolId,
        roomId,
        deviceData,
        macAddress,
        navigation,
      );
    }
    Utils.showToast(translate('deviceDetailsUpdated'));
    setTimeout(() => {
      setIsDeviceAddedAlready(true);
    }, 500);
  } else {
    Utils.showToast(translate('pleaseProvideValidMacAddress'));
  }
};

/**
 * function to update the devices fields
 * @param {object} localData object containing the local data on setting screen
 * @param {variable} schoolId it represnts the school id
 * @param {variable} roomId it represents the room id
 * @param {object} deviceData object containing the device data
 * @param {variable} macAddress it represents the mac address
 * @param {object} navigation object containing the instance on navigation
 */
async function updateDeviceField(
  localData,
  schoolId,
  roomId,
  deviceData,
  macAddress,
  navigation,
) {
  try {
    const data = JSON.parse(localData);
    const dataCanBeSaved = await isDublicateMacAddress(schoolId, macAddress);
    const schools = data.find(schools => schools.id === schoolId);
    const rooms = schools.rooms.find(rooms => rooms.id === roomId);

    const devices = rooms.devices.filter(
      devices => devices.macAddress === macAddress,
    );
    const devicesCount = rooms.devices.filter(
      devices => devices.macAddress !== macAddress,
    );
    if (devices.length === 0) {
      rooms.devices.map(device => {
        if (device.deviceID === deviceData.deviceID) {
          device.macAddress = macAddress;
          device.serialNumber = deviceData.serialNumber;
          device.deviceName = deviceData.deviceName;
          device.deviceType = deviceData.deviceType;
          device.deviceID = deviceData.deviceID;
        }
      });
    } else {
      rooms.devices = devicesCount;
      rooms.devices.push(deviceData);
    }
    writeDataTolocalStorage(data);
  } catch (error) {
    Utils.Log(Utils.logType.error, 'updateDeviceField', error);
  }
}

/**
 *
 * @param {object} localData object containing the local data of settings screen
 * @param {variable} routeSchoolId it represents the initial school id
 * @param {variable} routeRoomId it represents the initial room id
 * @param {variable} schoolId it represents the school id when changed
 * @param {variable} roomId it represents the room id when changed
 * @param {object} deviceData it contains the device data
 * @param {variable} macAddress it represents the mac address
 * @param {object} navigation object containing the instance on navigation
 */
async function updateDeviceAtSchoolLevel(
  localData,
  routeSchoolId,
  routeRoomId,
  schoolId,
  roomId,
  deviceData,
  macAddress,
  navigation,
) {
  try {
    const data = JSON.parse(localData);
    const schools = data.find(schools => schools.id === routeSchoolId);
    const rooms = schools.rooms.find(rooms => rooms.id === routeRoomId);
    const devices = rooms.devices.filter(
      devices => devices.macAddress !== macAddress,
    );
    rooms.devices = devices;
    const schools1 = data.find(schools => schools.id === schoolId);
    const rooms1 = schools1.rooms.find(rooms => rooms.id === roomId);
    deviceData.deviceID = rooms1.devices.length + 1;
    rooms1.devices.push(deviceData);
    writeDataTolocalStorage(data);
    navigation.replace('manageSchool');
  } catch (error) {
    Utils.Log(Utils.logType.error, 'updateDeviceAtSchoolLevel', error);
  }
}

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
  ipAddress,
) => {
  let deviceData = {
    macAddress: macAddress,
    serialNumber: serialNumber,
    deviceName: deviceName,
    deviceType: deviceType,
    schoolTitile: selectedSchool,
    roomTitle: selectedRoom,
    ipAddress: ipAddress,
  };
  if (macAddress && serialNumber && schoolId && roomId) {
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

/**
 * a redux action that read MacAddress value from BLE and store value into network reducer
 */
export const readMacAddress = callback => {
  return async (dispatch, getState) => {
    const {connectedDevice} = getState().authDevices;
    try {
      const macAddressValue = await BleManager.readCharacteristicForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.macAddress,
      );
      const ipValue = await BleManager.readCharacteristicForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.ipAddress,
      );
      if (Utils.decodeBase64(ipValue.value) == '\u0000\u0000\u0000') {
        dispatch(updateNetworkSettingsFields('ipAddress', ''));
      } else {
        dispatch(
          updateNetworkSettingsFields(
            'ipAddress',
            Utils.decodeBase64(ipValue.value),
          ),
        );
      }
      if (Utils.decodeBase64(macAddressValue.value) == '\u0000\u0000\u0000') {
        dispatch(updateNetworkSettingsFields('mac', ''));
      } else {
        dispatch(
          updateNetworkSettingsFields(
            'mac',
            Utils.decodeBase64(macAddressValue.value),
          ),
        );
        callback(Utils.decodeBase64(macAddressValue.value));
      }
    } catch (error) {
      sentryErrorHandler(`error in read mac address function${error}`);
    }
  };
};

export const readMacAddressInfoview = callback => {
  return async (dispatch, getState) => {
    const {connectedDevice} = getState().authDevices;
    try {
      const ipValue = await BleManager.readCharacteristicForDevice(
        connectedDevice.id,
        UUIDMappingInfoView.rootServiceUDID,
        UUIDMappingInfoView.ipAddress,
      );
      if (Utils.decodeBase64(ipValue.value) == '\u0000\u0000\u0000') {
        dispatch(updateNetworkSettingsFields('ipAddress', ''));
      } else {
        dispatch(
          updateNetworkSettingsFields(
            'ipAddress',
            Utils.decodeBase64(ipValue.value),
          ),
        );
      }
      callback();
    } catch (error) {
      sentryErrorHandler(`error in read mac address function infoview${error}`);
    }
  };
};

/**
 * a redux action that read MacAddress value from BLE and store value into network reducer
 */
export const readIPAddress = callback => {
  return async (dispatch, getState) => {
    const {connectedDevice} = getState().authDevices;
    try {
      const ipValue = await BleManager.readCharacteristicForDevice(
        connectedDevice.id,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.ipAddress,
      );
      if (Utils.decodeBase64(ipValue.value) == '\u0000\u0000\u0000') {
        dispatch(updateNetworkSettingsFields('ipAddress', ''));
      } else {
        dispatch(
          updateNetworkSettingsFields(
            'ipAddress',
            Utils.decodeBase64(ipValue.value),
          ),
        );
      }
    } catch (error) {
      sentryErrorHandler(`error in read ip address function ms700${error}`);
    }
  };
};
export const readIPAddressInfoview = callback => {
  return async (dispatch, getState) => {
    const {connectedDevice} = getState().authDevices;
    try {
      const ipValue = await BleManager.readCharacteristicForDevice(
        connectedDevice.id,
        UUIDMappingInfoView.rootServiceUDID,
        UUIDMappingInfoView.ipAddress,
      );
      if (Utils.decodeBase64(ipValue.value) == '\u0000\u0000\u0000') {
        dispatch(updateNetworkSettingsFields('ipAddress', ''));
      } else {
        dispatch(
          updateNetworkSettingsFields(
            'ipAddress',
            Utils.decodeBase64(ipValue.value),
          ),
        );
      }
    } catch (error) {
      sentryErrorHandler(`error in read ip address function infoview${error}`);
    }
  };
};
