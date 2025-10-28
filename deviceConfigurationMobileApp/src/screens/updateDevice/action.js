const identifire = 'add device log: ';
import RNFS from 'react-native-fs';
import {translate} from '../../translations/translationHelper';
import styles from './styles';
import {View, Text} from 'react-native';
import Utils from '../../utils';

/**
 * To return content of localStorage file
 * @returns the data stored in local file
 */
const readFileFromLocalStorage = async () => {
  const result = RNFS.readFile(
    RNFS.DocumentDirectoryPath + '/test.txt',
    'utf8',
  );
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
 * @param {boolean} modalVisible for showing model
 * @param {function} setModalVisible set model visibility
 * @param {function} setSearch setting search input value
 * @param {function} setDataSource container for School/Room data
 * @param {boolean} setDeviceTypeSelected check for device type selection
 */
function deviceTypeDropDown(
  modalVisible,
  setModalVisible,
  setSearch,
  setDataSource,
  setDeviceTypeSelected,
) {
  setModalVisible(!modalVisible);
  setSearch('');
  setDeviceTypeSelected(true);
  setDataSource([{deviceType: 'MS700'}, {deviceType: 'InfoViewPlayer'}, {deviceType:'CZA1300'}]);
}

/**
 * School drop down click
 * @param {function} setIsRoomDropDown This will set the roomDropDown flag value
 * @param {function} setDeviceTypeSelected for setting the selected device type
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
    setDeviceTypeSelected(false);
    setIsRoomDropDown(false);
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
    Utils.Log(Utils.logType.error, 'Error in getSchoolData()', e);
  }
};

/**
 * Room drop down is click
 * @param {variable} schoolId it represents school in numeric form
 * @param {function} setIsRoomDropDown a function which set roomDropDown value in form of true/false
 * @param {function} setDeviceTypeSelected a function which sets the selected device type
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

    const schools = JSON.parse(data);
    const school = schools.filter(item => item.id === schoolId);
    const availableRooms = school[0].rooms;

    setRoomData(availableRooms);
    setDataSource(availableRooms);
  } catch (e) {
    Utils.Log(Utils.logType.error, 'Error in getRoom()', e);
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
  const obj = dataSource.find(data => data.title === title.title.item.title);
  if (obj) {
    setSchoolSelectedFlag(true);
    setSchoolId(obj.id);
    setSelectedSchool(title.title.item.title);
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
    const newRecord = {id: schoolData.length + 1, title: title, rooms: []};
    schoolData.push(newRecord);

    writeDataTolocalStorage(schoolData);
    setModalVisible(false);
    setSearch('');

    try {
      const data = await readFileFromLocalStorage();
      setDataSource(JSON.parse(data));
      setSchoolData(JSON.parse(data));
    } catch (e) {
      Utils.Log(Utils.logType.error, 'Error in updateSchoolList()', e);
    }

    const obj = dataSource.find(data => data.title === title);
    if (obj) {
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
    const newRecord = {id: roomData.length + 1, title: title, devices: []};
    try {
      const data = await readFileFromLocalStorage();
      const schools = JSON.parse(data);
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
      Utils.Log(Utils.logType.error, 'Error in updateRoomList()', e);
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
  setRoomSelectedFlag(true);
  setSelectedRoom(title.title.item.title);
  setRoomId(title.title.item.id);
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
                item,
                setSchoolId,
                setSelectedSchool,
                setSelectedRoom,
                setModalVisible,
                setSearch,
                setSchoolSelectedFlag,
              );
        }}>
        {item.title.item.title}
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
            .replace(/[^\d|A-Z|a-z]/g, '')
            .match(/.{1,2}/g || [])
            .join(':');
        setMacAddress(mac);
        break;
      case 'Serial Number':
        setSerialNumber(value);
        break;
      case 'deviceName':
      case 'Device Name':
        let result = value.replace(/[^\d|A-Z|a-z_-]/g, '');
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
) {
  return () => {
    if (
      macAddress &&
      macAddress !== '' &&
      serialNumber &&
      serialNumber !== '' &&
      selectedSchool &&
      selectedSchool !== 'Select School' &&
      selectedRoom &&
      selectedRoom !== 'Select Room'
    ) {
      return true;
    }
  };
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
    // Check if searched text is not blank
    if (text) {
      const dataToSearch = isRoomDropDown ? roomData : schoolData;
      let newData = dataToSearch.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData = item.title
          ? item.title.toUpperCase()
          : ''.toUpperCase();
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
 * function to check duplicacy of the entered mac address
 * @param {string} schoolId id of the school under which duplicacy is to be checked
 * @param {string} mac mac address to check for duplicacy
 * @returns if the mac address is duplicate in true/false form
 */
async function isDublicateMacAddress(schoolId, mac) {
  try {
    const data = await readFileFromLocalStorage();
    const parsedData = JSON.parse(data);

    const rooms = parsedData.filter(d => d.id === schoolId)[0].rooms;
    let macAddressContainer = [];
    for (const dat of rooms) {
      for (const macAddress in dat.devices) {
        macAddressContainer.push(dat.devices[macAddress].macAddress);
      }
    }
    if (macAddressContainer.indexOf(mac) === -1) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    Utils.Log(Utils.logType.error, 'Error in isDublicateMacAddress()', e);
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
 * function for validating if all the input field values are valid and not null
 * @param {string} macAddress mac address
 * @param {string} serialNumber serial number
 * @param {string} deviceName name of the device
 * @param {string} deviceType  device type selected
 * @param {string} schoolId selected school's id
 * @param {string} roomId selected room's id
 * @returns
 */
function isFieldsNotNull(
  macAddress,
  serialNumber,
  deviceName,
  deviceType,
  schoolId,
  roomId,
) {
  if (
    macAddress &&
    macAddress !== '' &&
    serialNumber &&
    serialNumber !== '' &&
    schoolId &&
    schoolId !== '' &&
    roomId &&
    roomId !== '' &&
    deviceName &&
    deviceName !== '' &&
    deviceType &&
    deviceType !== ''
  ) {
    return true;
  }
}

/**
 * function to update device details for selected school
 * @param {object} localData local data read from the Local Storage
 * @param {string} routeSchoolId id of the school when clicked from the listing page
 * @param {string} routeRoomId id of the room when clicked from the listing page
 * @param {string} schoolId id of the selected school while updation
 * @param {string} roomId id of the selected room
 * @param {object} deviceData data of the device selected for updation
 * @param {string} macAddress mac address
 * @param {object} navigation instance of the navigation object
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
  routeMacAddress
) {
  try {
    const data = JSON.parse(localData);
    const dataCanBeSaved = await isDublicateMacAddress(schoolId, macAddress);
    if (dataCanBeSaved) {
      const schools = data.find(schools => schools.id === routeSchoolId);
      const rooms = schools.rooms.find(rooms => rooms.id === routeRoomId);
      const devices = rooms.devices.filter(
        devices => devices.macAddress !== macAddress,
      );
      rooms.devices = devices;
      if(routeMacAddress !== macAddress){
        const newDevices = rooms.devices.filter(devices => devices.macAddress !== routeMacAddress,)
        rooms.devices = newDevices;
      }
      const schools1 = data.find(schools => schools.id === schoolId);
      const rooms1 = schools1.rooms.find(rooms => rooms.id === roomId);
      deviceData.deviceID = rooms1.devices.length + 1;
      rooms1.devices.push(deviceData);
      writeDataTolocalStorage(data);
      Utils.showToast(translate('deviceDetailsUpdated'));
      navigation.replace('manageSchool');
    } else {
      Utils.showToast(translate('macAddressShouldBeUnique'));
    }
  } catch (error) {
    Utils.Log(Utils.logType.error, 'updateDeviceAtSchoolLevel', error);
  }
}

/**
 * function to update the device under selected room
 * @param {object} localData data read from the local storage
 * @param {string} schoolId  selected device's school id
 * @param {string} roomId selected device's room id
 * @param {object} deviceData data of the device in updation
 * @param {string} macAddress  mac address of device
 * @param {object} navigation instance of the navigation
 */
async function updateDeviceField(
  localData,
  schoolId,
  roomId,
  deviceData,
  macAddress,
  navigation,
  routeMacAddress,
) {
  try {
    const data = JSON.parse(localData);
    let dataCanBeSaved = true;
    if (routeMacAddress !== macAddress) {
      dataCanBeSaved = await isDublicateMacAddress(schoolId, macAddress);
    }
    if (dataCanBeSaved) {
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
      navigation.replace('manageSchool');
      Utils.showToast(translate('deviceDetailsUpdated'));
    } else {
      Utils.showToast(translate('macAddressShouldBeUnique'));
    }
  } catch (error) {
    Utils.Log(Utils.logType.error, 'updateDeviceField', error);
  }
}

/**
 * On click back button
 * @param {variable} routeSchoolId it represents mac address
 * @param {variable} routeRoomId it represents serial number
 * @param {variable} macAddress it represents school in numeric form
 * @param {variable} serialNumber it represents school in numeric form
 * @param {variable} deviceName it represents school in numeric form
 * @param {variable} deviceType it represents school in numeric form
 * @param {variable} DeviceId it represents school in numeric form
 * @param {variable} schoolId it represents school in numeric form
 * @param {vaiable} roomId it represents room in numeric form
 * @param {object} navigation it represents navigation object
 */
const onBackPressSaveDevice = async (
  routeSchoolId,
  routeRoomId,
  macAddress,
  serialNumber,
  deviceName,
  deviceType,
  DeviceId,
  schoolId,
  roomId,
  navigation,
  routeMacAddress,
) => {
  try {
    const deviceData = {
      macAddress: macAddress,
      serialNumber: serialNumber,
      deviceName: deviceName,
      deviceType: deviceType,
      deviceID: DeviceId,
    };
    if (
      isFieldsNotNull(
        macAddress,
        serialNumber,
        deviceName,
        deviceType,
        schoolId,
        roomId,
      )
    ) {
      if (isValidMacAddress(macAddress)) {
        const localData = await readFileFromLocalStorage();
        if (routeSchoolId !== schoolId) {
          updateDeviceAtSchoolLevel(
            localData,
            routeSchoolId,
            routeRoomId,
            schoolId,
            roomId,
            deviceData,
            macAddress,
            navigation,
            routeMacAddress
          );
        } else if (routeRoomId !== roomId) {
          updateDeviceAtSchoolLevel(
            localData,
            routeSchoolId,
            routeRoomId,
            schoolId,
            roomId,
            deviceData,
            macAddress,
            navigation,
            routeMacAddress
          );
        } else {
          updateDeviceField(
            localData,
            schoolId,
            roomId,
            deviceData,
            macAddress,
            navigation,
            routeMacAddress,
          );
        }
      } else {
        Utils.showToast(translate('pleaseProvideValidMacAddress'));
      }
    } else {
      Utils.showToast(translate('pleaseProvideDetailsToSave'));
    }
  } catch (error) {
    Utils.Log(Utils.logType.error, 'onBackPressSaveDevice', error);
  }
};

/**
 * function for deleting the device from a room
 * @param {object} params object containing the school id, room id, etc.
 */
async function deleteDevice(params) {
  try {
    const localData = await readFileFromLocalStorage();

    const data = JSON.parse(localData);
    const schools = data.find(schools => schools.id === params?.schoolId);
    const rooms = schools.rooms.find(rooms => rooms.id === params?.roomId);

    const devices = rooms.devices.filter(
      devices => devices.deviceID !== params.DeviceId,
    );
    rooms.devices = devices;
    writeDataTolocalStorage(data);
    params.navigation.replace('manageSchool');
  } catch (ex) {
    Utils.Log(Utils.logType.error, 'Error while reading data..', ex);
  }
}

/**
 * function to update the device type
 * @param {string} deviceType type of device selected from dropdown
 * @param {function} setDeviceType function to set the selected device type
 * @param {boolean} modalVisible for showing model
 * @param {function} setModalVisible used to set model visibility
 */
function updateDeviceType(
  deviceType,
  setDeviceType,
  modalVisible,
  setModalVisible,
) {
  setDeviceType(deviceType);
  setModalVisible(!modalVisible);
}

/**
 * function to check if data has actually changed or same as older data
 * @param {object} screenData data on the screen while updating the device details
 * @param {string} schoolId it represents school id in numeric form
 * @param {string} roomId it represents room id in numeric form
 * @param {string} deviceId it represents device id in numeric form
 * @returns
 */
async function isAnyDataChanged(screenData, schoolId, roomId, deviceId) {
  try {
    const data = await readFileFromLocalStorage();

    if (schoolId) {
      const schoolData = JSON.parse(data).find(s => s?.id === schoolId);
      const roomData = schoolData?.rooms?.find(r => r?.id === roomId);

      const deviceData = roomData?.devices?.find(d => d?.deviceID === deviceId);

      if (schoolData?.title !== screenData.schoolTitle) {
        return true;
      } else if (roomData?.title !== screenData.roomTitle) {
        return true;
      } else if (deviceData?.deviceType !== screenData.deviceType) {
        return true;
      } else if (deviceData?.deviceName !== screenData.deviceName) {
        return true;
      } else if (deviceData?.macAddress !== screenData.macAddress) {
        return true;
      } else if (deviceData?.serialNumber !== screenData.serialNumber) {
        return true;
      } else {
        return false;
      }
    }
  } catch (ex) {
    Utils.Log(Utils.logType.error, 'isAnyDataChanged', ex);
  }
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
  isDublicateMacAddress,
  onBackPressSaveDevice,
  deleteDevice,
  deviceTypeDropDown,
  updateDeviceType,
  getRoom,
  isAnyDataChanged,
};