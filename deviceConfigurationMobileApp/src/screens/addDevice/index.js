import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  FlatList,
  TextInput,
  Keyboard,
} from 'react-native';
import { Mixins, Colors } from '../../config/styles';
import { translate } from '../../translations/translationHelper';
import { CloseWondow, SearchIcon } from '../../config/imageConstants';
import DropDown from '../dropDown/index';
import styles from './styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
  isAnyDataChanged,
  deleteSchoolOrRoomWithoutDevice,
} from './action';
import utils from '../../utils';
import DeviceType from '../../config/deviceType'

export default function AddDevice({ route, navigation }) {
  let deviceTypeScanIsValid = false;
  let deviceTypeScanValue = '';
  if (route?.params?.deviceType !== undefined) {
    const deviceTypeByScan = route?.params?.deviceType.toLowerCase();
    if (deviceTypeByScan === 'ms700' || deviceTypeByScan === 'infoviewplayer') {
      deviceTypeScanIsValid = true;
      if (deviceTypeByScan === 'ms700') {
        deviceTypeScanValue = 'MS700';
      } else if (deviceTypeByScan === 'infoviewplayer') {
        deviceTypeScanValue = 'infoViewPlayer';
      }
    } else {
      deviceTypeScanIsValid = true;
      deviceTypeScanValue = deviceTypeByScan.toUpperCase()
    }
  }

  const macAddressRef = React.createRef();
  const serialNumberRef = React.createRef();
  const deviceNameRef = React.createRef();

  const [dismissPopup, setDismissPopup] = useState(false);
  const [schoolId, setSchoolId] = useState(0);
  const [roomId, setRoomId] = useState(0);

  let [dataSource, setDataSource] = useState([]);
  let [schoolData, setSchoolData] = useState([]);
  let [roomData, setRoomData] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');

  const [selectedSchool, setSelectedSchool] = useState(
    translate('selectSchool'),
  );
  const [selectedRoom, setSelectedRoom] = useState(translate('selectRoom'));

  const [deviceTypeSelected, setDeviceTypeSelected] = useState(false);
  const [deviceName, setDeviceName] = useState('');

  const [macAddress, setMacAddress] = useState(
    route?.params?.mac === undefined ? '' : route?.params?.mac,
  );
  const [serialNumber, setSerialNumber] = useState(
    route?.params?.serialNumber === undefined
      ? ''
      : route?.params?.serialNumber,
  );
  const [deviceType, setDeviceType] = useState(
    deviceTypeScanIsValid ? deviceTypeScanValue : 'Select Device Type',
  );

  let [isRoomDropDown, setIsRoomDropDown] = useState(false);
  let [schoolSelectedFlag, setSchoolSelectedFlag] = useState(false);
  let [roomSelectedFlag, setRoomSelectedFlag] = useState(false);
  let [deviceTypeSelectedFlag, setDeviceTypeSelectedFlag] = useState(false);

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
    schoolId,
    setIsRoomDropDown,
    setDeviceTypeSelected,
    modalVisible,
    setRoomData,
    setDataSource,
    deviceTypeScanIsValid
  );
  const renderItem = rowData => {
    return rowData.item.isNewEntry ? (
      <TouchableOpacity
        style={styles.renderItemSelectStyle}
        onPress={() =>
          isRoomDropDown
            ? updateRoomList(rowData.item.title)
            : updateSchoolList(rowData.item.title)
        }>
        <Text
          style={
            styles.renderItemCreateStyle
          }>{`+ Create ${rowData.item.title}`}</Text>
      </TouchableOpacity>
    ) : (
      <>
        <ListItem data={rowData} />
      </>
    );
  };
  const renderDeviceType = item => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        updateDeviceType(
          item.item.deviceType,
          setDeviceType,
          modalVisible,
          setModalVisible,
          setDeviceTypeSelectedFlag,
        )
      }>
      <Text style={styles.title}>{item.item.deviceType}</Text>
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
    setIsRoomDropDown,
    modalVisible,
    setDeviceTypeSelected,
    setRoomData,
  );

  const updateRoomList = roomListUpdate(
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
  );

  const handleCloseSearchBar = searchBarClose(
    setModalVisible,
    modalVisible,
    setSearch,
  );

  const headerRightButtons = () => {
    return <View style={styles.headerButtonContainer}></View>;
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
    let data = {
      schoolTitle: selectedSchool,
      roomTitle: selectedRoom,
      deviceType: deviceType,
      deviceName: deviceName,
      macAddress: macAddress,
      serialNumber: serialNumber,
    };
    // deleteSchoolOrRoomWithoutDevice();
    if (isAnyDataChanged(data)) {
      setDismissPopup(true);
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.containerStyle}>
      <Header
        showBackButton={true}
        navigation={navigation}
        headerTitle={translate('addDevice')}
        overrideBackPress={handleBackPress}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ marginTop: Mixins.scaleSize(15) }}
        style={{ flexGrow: 1 }}
        bounces={false}>
        <View style={styles.dropDownContainerStyle}>
          <DropDown
            identity={'selectSchool'}
            testIDProp="schoolDropDown"
            isBorderRequired={true}
            isFieldSelected={schoolSelectedFlag}
            heading={'Select School'}
            name={selectedSchool}
            isDropDown={true}
            isEditable={false}
            onPress={handleSchoolDropDown}
          />
          <DropDown
            identity={'selectRoom'}
            testIDProp="roomDropDown"
            isBorderRequired={true}
            isFieldSelected={roomSelectedFlag}
            heading={'Select Room'}
            name={selectedRoom}
            isDropDown={true}
            isEditable={false}
            showDisabled={schoolId !== 0 ? false : true}
            onPress={() => schoolId !== 0 && handleRoomDropDown()}
          />

          <DropDown
            identity={'deviceType'}
            testIDProp="deviceTypeProp"
            isBorderRequired={true}
            isFieldSelected={deviceTypeSelectedFlag}
            heading={'Select Device Type'}
            name={deviceType}
            isDropDown={true}
            isEditable={false}
            onPress={() =>
              !deviceTypeScanIsValid &&
              deviceTypeDropDown(
                setIsRoomDropDown,
                modalVisible,
                setModalVisible,
                setSearch,
                setDataSource,
                setDeviceTypeSelected,
              )
            }
          />
          <DropDown
            identity={'deviceName'}
            isFieldSelected={true}
            heading={'Device Name'}
            ref={deviceNameRef}
            name={deviceName}
            isDropDown={false}
            maxLength={45}
            isEditable={true}
            onChangeText={onChangeText}
          />
          <DropDown
            identity={'macAddress'}
            testIDProp="macProp"
            isFieldSelected={true}
            maxLength={17}
            heading={'MAC Address'}
            ref={macAddressRef}
            name={macAddress}
            isDropDown={false}
            isEditable={route?.params?.mac === undefined ? true : false}
            onChangeText={onChangeText}
          />
          <DropDown
            identity={'serialNumber'}
            testIDProp="serialProp"
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
                isSaveDeviceEnable
                  ? styles.saveButtonTO
                  : styles.saveButtonTODisable
              }
              disabled={isSaveDeviceEnable ? false : true}
              onPress={() => {
                Keyboard.dismiss();
                let params = {
                  macAddress,
                  serialNumber,
                  schoolId,
                  roomId,
                  deviceName,
                  deviceType,
                  selectedSchool,
                  selectedRoom,
                  navigation,
                };
                navigateToDeviceListing(params);
              }}>
              <Text style={styles.saveButtonText}>Save Device</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
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
              <Text testID="dropDownHeading" style={styles.selectSchoolText}>
                {deviceTypeSelected
                  ? 'Select Device Type'
                  : isRoomDropDown
                    ? translate('selectRoom')
                    : translate('selectSchool')}
              </Text>
              <TouchableOpacity
                onPress={handleCloseSearchBar}
                style={styles.closeIconStyle}>
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
              renderItem={
                isRoomDropDown
                  ? renderItem
                  : isRoomDropDown === false && deviceTypeSelected === false
                    ? renderItem
                    : renderDeviceType
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
          button1Action={() =>
            onBackPressSaveDevice(
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
            )
          }
          button2Action={() => navigation.goBack()}
        />
      </Modal>
    </View>
  );
}
