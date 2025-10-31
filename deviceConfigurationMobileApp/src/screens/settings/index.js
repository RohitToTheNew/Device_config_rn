import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  FlatList,
  TextInput,
  BackHandler,
} from 'react-native';
import { Mixins, Colors } from '../../config/styles';
import { translate } from '../../translations/translationHelper';
import { CloseWondow, SearchIcon, TripleDot } from '../../config/imageConstants';
import DropDownForSettings from '../../components/customDropDownForSettings/index';
import styles from './styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useIsFocused } from '@react-navigation/native';

import { Header, ErrorWindow } from '../../components';
import {
  schoolDropDown,
  roomDropDown,
  schoolListUpdate,
  roomListUpdate,
  searchBarClose,
  renderListItem,
  onChangeTextFunction,
  saveDeviceEnableCheck,
  searchFilter,
  onBackPressSaveDevice,
  navigateToDeviceListing,
  deviceTypeDropDown,
  updateDeviceType,
  readMacAddress,
  readMacAddressInfoview,
  updateDeviceDetails,
  writeDataTolocalStorage,
} from './action';
import { useDispatch, useSelector } from 'react-redux';
import { updateAppModalFields } from '../../services/app/action';
import { getSavedData } from '../manageSchool/action';
import Utils from '../../utils';
import { isAnyDataChanged } from './action';
import DisconnectionModal from '../../components/disconnectionModal';
import POEModal from '../../components/poeModal';
import { updateNetworkSettingsFields } from '../../services/network/action';
export default function Settings({ route, navigation }) {
  const dispatch = useDispatch();

  const { mac, ipAddress } = useSelector(state => state.network);
  const { connectedDevice } = useSelector(state => state.authDevices);
  const macAddressRef = React.createRef();
  const serialNumberRef = React.createRef();
  const deviceNameRef = React.createRef();
  const isFocused = useIsFocused();

  const [dismissPopup, setDismissPopup] = useState(false);
  const [schoolId, setSchoolId] = useState(0);
  const [roomId, setRoomId] = useState(0);
  const [deviceId, setDeviceId] = useState(0);

  let [dataSource, setDataSource] = useState([]);
  let [schoolData, setSchoolData] = useState([]);
  let [roomData, setRoomData] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [deviceDetailsRead, setDeviceDetailsRead] = useState({});

  const [selectedSchool, setSelectedSchool] = useState(
    translate('selectSchool'),
  );
  const [selectedRoom, setSelectedRoom] = useState(translate('selectRoom'));

  const [deviceTypeSelected, setDeviceTypeSelected] = useState(false);
  const [deviceName, setDeviceName] = useState(
    connectedDevice?.localName || '',
  );

  const [macAddress, setMacAddress] = useState(mac ? mac : '');
  const [serialNumber, setSerialNumber] = useState(
    route?.params?.serialNumber === undefined
      ? ''
      : route?.params?.serialNumber,
  );
  const [deviceType, setDeviceType] = useState(
    connectedDevice?.deviceType || 'Select Device Type',
  );

  let [isRoomDropDown, setIsRoomDropDown] = useState(false);
  let [schoolSelectedFlag, setSchoolSelectedFlag] = useState(false);
  let [roomSelectedFlag, setRoomSelectedFlag] = useState(false);
  let [deviceTypeSelectedFlag, setDeviceTypeSelectedFlag] = useState(false);
  const [isDeviceAddedAlready, setIsDeviceAddedAlready] = useState(false);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [Utils.isAndroid]);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getSavedData();
        let parsedResult = JSON.parse(result);
        if (
          Utils.isMS700(connectedDevice?.deviceType) ||
          Utils.isCZA1300(connectedDevice?.deviceType)
        ) {
          if (parsedResult.length > 0) {
            for (let school of parsedResult) {
              for (let room of school.rooms) {
                for (let device of room.devices) {
                  if (device.macAddress === mac) {
                    setSelectedSchool(school.title);
                    setSelectedRoom(room.title);
                    setSerialNumber(device.serialNumber);
                    setSchoolSelectedFlag(true);
                    setRoomSelectedFlag(true);
                    setDeviceTypeSelectedFlag(true);
                    setSchoolId(school.id);
                    setRoomId(room.id);
                    setMacAddress(device.macAddress);
                    setDeviceName(device.deviceName);
                    setDeviceType(device.deviceType);
                    setIsDeviceAddedAlready(true);
                    setDeviceId(device.id);
                    const data = {
                      selectedSchool: school.title,
                      selectedRoom: room.title,
                      serialNumber: device.serialNumber,
                      schoolId: school.id,
                      macAddress: device.macAddress,
                      deviceName: device.deviceName,
                      deviceType: device.deviceType,
                      roomId: room.id,
                    };
                    setDeviceDetailsRead(data);
                    return;
                  }
                }
              }
            }
          }
        } else if (Utils.isInfoView(connectedDevice?.deviceType)) {
          if (parsedResult.length > 0) {
            for (let school of parsedResult) {
              for (let room of school.rooms) {
                const device = room.devices.find(
                  device => device.deviceName === deviceName,
                );
                if (device) {
                  setSelectedSchool(school.title);
                  setSelectedRoom(room.title);
                  setSerialNumber(device.serialNumber);
                  setSchoolSelectedFlag(true);
                  setRoomSelectedFlag(true);
                  setDeviceTypeSelectedFlag(true);
                  setSchoolId(school.id);
                  setRoomId(room.id);
                  setMacAddress(device.macAddress);
                  setDeviceName(device.deviceName);
                  setDeviceType(device.deviceType);
                  setIsDeviceAddedAlready(true);
                  setDeviceId(device.id);
                  const data = {
                    selectedSchool: school.title,
                    selectedRoom: room.title,
                    serialNumber: device.serialNumber,
                    schoolId: school.id,
                    macAddress: device.macAddress,
                    deviceName: device.deviceName,
                    deviceType: device.deviceType,
                    roomId: room.id,
                  };
                  setDeviceDetailsRead(data);
                  return;
                }
              }
            }
          }
        }
      } catch (ex) {
        Utils.Log(Utils.logType.error, 'fetchData', ex);
      }
    }
    if (connectedDevice) {
      if (
        Utils.isMS700(connectedDevice?.deviceType) ||
        Utils.isCZA1300(connectedDevice?.deviceType)
      ) {
        dispatch(
          readMacAddress(mac => {
            setMacAddress(mac);
            if (isFocused) {
              fetchData();
            }
          }),
        );
      } else if (Utils.isInfoView(connectedDevice?.deviceType)) {
        dispatch(updateNetworkSettingsFields('mac', ''));
        dispatch(
          readMacAddressInfoview(mac => {
            setMacAddress(mac);
            if (isFocused) {
              fetchData();
            }
          }),
        );
      }
    }
  }, [isFocused, mac]);

  const ListItem = renderListItem(
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
  );

  const renderItem = rowData => {
    return rowData.isNewEntry ? (
      <TouchableOpacity
        testID="rendeItemBtn"
        style={styles.renderItemSelectStyle}
        onPress={() =>
          isRoomDropDown
            ? updateRoomList(rowData.title)
            : updateSchoolList(rowData.title)
        }>
        <Text
          style={
            styles.renderItemCreateStyle
          }>{`+ Create ${rowData.title}`}</Text>
      </TouchableOpacity>
    ) : (
      <ListItem data={rowData} />
    );
  };

  const renderDeviceType = item => (
    <TouchableOpacity
      style={styles.itemDeviceType}
      onPress={() =>
        updateDeviceType(
          item.deviceType,
          setDeviceType,
          modalVisible,
          setModalVisible,
          setDeviceTypeSelectedFlag,
        )
      }>
      <Text style={styles.title}>{item.deviceType}</Text>
    </TouchableOpacity>
  );

  const updateSchoolList = schoolListUpdate(
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
  );

  const updateRoomList = roomListUpdate(
    roomData,
    schoolId,
    setRoomData,
    setRoomId,
    setDataSource,
    setSelectedRoom,
    setModalVisible,
    setSearch,
    setRoomSelectedFlag,
  );

  const handleCloseSearchBar = searchBarClose(
    setModalVisible,
    modalVisible,
    setSearch,
  );

  const onOptionsPress = () => {
    dispatch(updateAppModalFields('showModal', true));
  };

  const headerRightButtons = () => {
    return (
      <TouchableOpacity onPress={onOptionsPress}>
        <TripleDot width={Mixins.scaleSize(24)} height={Mixins.scaleSize(24)} />
      </TouchableOpacity>
    );
  };

  const handleSchoolDropDown = schoolDropDown(
    setIsRoomDropDown,
    setDeviceTypeSelected,
    modalVisible,
    setModalVisible,
    setSearch,
    setDataSource,
    setSchoolData,
  );

  const handleRoomDropDown = roomDropDown(
    schoolId,
    setIsRoomDropDown,
    setDeviceTypeSelected,
    setModalVisible,
    modalVisible,
    setSearch,
    setRoomData,
    setDataSource,
  );

  const searchFilterFunction = searchFilter(
    isRoomDropDown,
    roomData,
    schoolData,
    setDataSource,
    setSearch,
  );

  const isSaveDeviceEnable = saveDeviceEnableCheck(
    macAddress,
    serialNumber,
    selectedSchool,
    selectedRoom,
    deviceName,
    deviceType,
  );

  const onChangeText = onChangeTextFunction(
    setMacAddress,
    setSerialNumber,
    setDeviceName,
  );

  const handleBackPress = () => {
    const newData = {
      selectedRoom,
      selectedSchool,
      deviceType,
      serialNumber,
      macAddress,
      macAddress,
      deviceName,
      schoolId,
      roomId,
    };
    let isChanged = isAnyDataChanged(
      deviceDetailsRead,
      newData,
      connectedDevice,
      mac,
    );
    if (isChanged) {
      setDismissPopup(true);
    } else {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
    return true;
  };

  const onSaveDevice = async callback => {
    if (isDeviceAddedAlready) {
      const result = await getSavedData();
      let parsedResult = JSON.parse(result);
      if (parsedResult.length > 0) {
        for (let school of parsedResult) {
          for (let room of school.rooms) {
            for (let device of room.devices) {
              if (device.macAddress === macAddress) {
                if (school.id === schoolId && room.id === roomId) {
                  device.deviceName = deviceName;
                  device.deviceType = deviceType;
                  device.serialNumber = serialNumber;
                  device.macAddress = macAddress;
                } else if (school.id === schoolId && room.id !== roomId) {
                  let index = room.devices.indexOf(
                    e => e.macAddress === macAddress,
                  );
                  room.devices.splice(index, 1);
                  let roomFound = school.rooms.find(e => e.id === roomId);
                  if (roomFound !== undefined) {
                    roomFound.devices.push({
                      deviceId: roomFound.devices.length + 1,
                      deviceName: deviceName,
                      deviceType: deviceType,
                      ipAddress: ipAddress,
                      macAddress: macAddress,
                      serialNumber: serialNumber,
                    });
                  }
                } else if (school.id !== schoolId) {
                  let schoolFound = parsedResult.find(e => e.id === schoolId);
                  let roomFound = schoolFound.rooms.find(e => e.id === roomId);
                  let index = room.devices.indexOf(
                    e => e.macAddress === macAddress,
                  );
                  room.devices.splice(index, 1);
                  if (schoolFound !== undefined) {
                    roomFound.devices.push({
                      macAddress: macAddress,
                      serialNumber: serialNumber,
                      deviceName: deviceName,
                      deviceType: deviceType,
                      deviceId: 1,
                      ipAddress: ipAddress,
                    });
                  }
                }
              }
            }
          }
        }
      }
      writeDataTolocalStorage(parsedResult);
      Utils.showToast(translate('deviceDetailsUpdated'));
      setDismissPopup(false);
      callback && callback();
    } else {
      await navigateToDeviceListing(
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
      );
    }
  };

  return (
    <View testID="settings" style={styles.containerStyle}>
      <Header
        showBackButton={true}
        navigation={navigation}
        headerTitle={translate('settings')}
        headerRightButtons={headerRightButtons}
        overrideBackPress={handleBackPress}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.keyBoardAwareStyle}
        style={styles.flexGrow}
        bounces={false}>
        <View style={styles.dropDownContainerStyle}>
          <DropDownForSettings
            testID="schoolDropDownTouchable"
            identity={'selectSchool'}
            isBorderRequired={true}
            isFieldSelected={schoolSelectedFlag}
            heading={translate('selectSchool')}
            name={selectedSchool}
            isDropDown={true}
            isEditable={false}
            onPress={() => handleSchoolDropDown()}
          />
          <DropDownForSettings
            identity={'selectRoom'}
            isBorderRequired={true}
            isFieldSelected={roomSelectedFlag}
            heading={translate('selectRoom')}
            name={selectedRoom}
            isDropDown={true}
            isEditable={false}
            onPress={() => schoolId !== 0 && handleRoomDropDown()}
            showDisabled={schoolId !== 0 ? false : true}
          />

          <DropDownForSettings
            identity={'deviceType'}
            isBorderRequired={true}
            isFieldSelected={deviceTypeSelectedFlag}
            heading={'Select Device Type'}
            name={deviceType}
            isDropDown={true}
            isEditable={false}
            onPress={
              deviceType === 'Select Device Type'
                ? () =>
                  deviceTypeDropDown(
                    setIsRoomDropDown,
                    modalVisible,
                    setModalVisible,
                    setSearch,
                    setDataSource,
                    setDeviceTypeSelected,
                  )
                : () => { }
            }
          />
          <DropDownForSettings
            identity={'deviceName'}
            isFieldSelected={true}
            heading={'Device Name'}
            ref={deviceNameRef}
            name={deviceName}
            maxLength={45}
            isDropDown={false}
            isEditable={true}
            onChangeText={onChangeText}
          />
          <DropDownForSettings
            identity={'macAddress'}
            isFieldSelected={true}
            heading={'Mac Address'}
            maxLength={17}
            ref={macAddressRef}
            name={macAddress}
            isDropDown={false}
            isEditable={mac.length === 0 ? true : false}
            onChangeText={onChangeText}
          />
          <DropDownForSettings
            identity={'serialNumber'}
            isFieldSelected={true}
            heading={'Serial Number'}
            ref={serialNumberRef}
            name={serialNumber}
            isDropDown={false}
            isEditable={
              route?.params?.serialNumber === undefined ? true : false
            }
            onChangeText={onChangeText}
          />
          <View style={styles.saveButtonView}>
            <TouchableOpacity
              style={
                isSaveDeviceEnable()
                  ? styles.saveButtonTO
                  : styles.saveButtonTODisable
              }
              disabled={isSaveDeviceEnable() ? false : true}
              onPress={onSaveDevice}>
              <Text style={styles.saveButtonText}>
                {isDeviceAddedAlready ? 'Update Device' : 'Save Device'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <DisconnectionModal
        navigation={navigation}
        showDeviceDisconnected={true}
      />
      <POEModal navigation={navigation} />
      <Modal
        testID="listModel"
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          setSearch('');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.closeIcon}>
              <Text style={styles.selectSchoolText}>
                {deviceTypeSelected
                  ? translate('selectDeviceType')
                  : isRoomDropDown
                    ? translate('selectRoom')
                    : translate('selectSchool')}
              </Text>
              <TouchableOpacity onPress={handleCloseSearchBar}>
                <CloseWondow
                  width={Mixins.scaleSize(20)}
                  height={Mixins.scaleSize(20)}
                />
              </TouchableOpacity>
            </View>
            {!deviceTypeSelected && (
              <View style={styles.searchStyle}>
                <View style={styles.searchIcon}>
                  <SearchIcon
                    width={Mixins.scaleSize(14)}
                    height={Mixins.scaleSize(14)}
                  />
                </View>
                <TextInput
                  testID="searchBar"
                  onChangeText={text => searchFilterFunction(text)}
                  value={search}
                  underlineColorAndroid="transparent"
                  placeholder={translate('typeToSearchOrAdd')}
                  placeholderTextColor={Colors.COLOR_808284}
                  style={styles.textInputStyle}
                />
              </View>
            )}
            <FlatList
              data={dataSource}
              renderItem={({ item }) =>
                isRoomDropDown
                  ? renderItem(item)
                  : isRoomDropDown === false && deviceTypeSelected === false
                    ? renderItem(item)
                    : renderDeviceType(item)
              }
              keyExtractor={item => item.id}
            />
          </View>
        </View>
      </Modal>
      <Modal
        visible={dismissPopup}
        transparent={true}
        hideModal={() => { }}
        backdrop={true}>
        <ErrorWindow
          errorTitle={translate('doYouWantToSaveThemBeforeMovingToOtherScreen')}
          button1Title={translate('save')}
          button2Title={translate('leave')}
          button1Action={() => {
            onSaveDevice(() => {
              navigation.goBack();
            });
          }}
          button2Action={() => navigation.goBack()}
        />
      </Modal>
    </View>
  );
}
