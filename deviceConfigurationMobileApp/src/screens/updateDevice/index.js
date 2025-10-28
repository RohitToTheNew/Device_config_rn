import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  FlatList,
  TextInput,
  ScrollView,
} from 'react-native';
import { Mixins, Colors } from '../../config/styles';
import { translate } from '../../translations/translationHelper';
import { CloseWondow, SearchIcon } from '../../config/imageConstants';
import DropDown from '../dropDownUpdateDevice';
import styles from './styles';
import { useIsFocused } from '@react-navigation/native';
import Utils from '../../utils';

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
  readFileFromLocalStorage,
  deleteDevice,
  deviceTypeDropDown,
  updateDeviceType,
  isAnyDataChanged,
} from './action';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function UpdateDevice({ route, navigation }) {
  const isFocused = useIsFocused();
  const [dismissPopup, setDismissPopup] = useState(false);
  const [popupToDeleteDevice, setPopupToDeleteDevice] = useState(false);

  const [schoolId, setSchoolId] = useState(0);
  const [roomId, setRoomId] = useState(0);

  //Data sources
  let [dataSource, setDataSource] = useState([]);
  let [schoolData, setSchoolData] = useState([]);
  let [roomData, setRoomData] = useState([]);
  const [initialMacAddress, setInitialMacAddress] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');

  //States for textInput
  const [selectedSchool, setSelectedSchool] = useState(
    translate('selectSchool'),
  );
  const [selectedRoom, setSelectedRoom] = useState(translate('selectRoom'));

  const [deviceType, setDeviceType] = useState('');
  const [deviceTypeSelected, setDeviceTypeSelected] = useState(false);
  const [deviceName, setDeviceName] = useState('');

  const [macAddress, setMacAddress] = useState('');

  const [serialNumber, setSerialNumber] = useState('');

  let [isRoomDropDown, setIsRoomDropDown] = useState(false);
  let [schoolSelectedFlag, setSchoolSelectedFlag] = useState(false);
  let [roomSelectedFlag, setRoomSelectedFlag] = useState(false);
  const [deleteDeviceButtonPressed, setDeleteDeviceButtonPressed] =
    useState(false);

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

  const renderItem = item =>
    item.item.isNewEntry ? (
      <TouchableOpacity
        style={styles.renderItemSelectStyle}
        onPress={() =>
          isRoomDropDown
            ? updateRoomList(item.item.title)
            : updateSchoolList(item.item.title)
        }>
        <Text
          testID="createElement"
          style={
            styles.renderItemCreateStyle
          }>{`+ Create ${item.item.title}`}</Text>
      </TouchableOpacity>
    ) : (
      <ListItem title={item} />
    );

  const renderDeviceType = item => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        updateDeviceType(
          item.item.deviceType,
          setDeviceType,
          modalVisible,
          setModalVisible,
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
  );

  const onChangeText = onChangeTextFunction(
    setMacAddress,
    setSerialNumber,
    setDeviceName,
  );

  const handleBackPress = async () => {
    const screenData = {
      schoolTitle: selectedSchool,
      roomTitle: selectedRoom,
      deviceType: deviceType,
      deviceName: deviceName,
      macAddress: macAddress,
      serialNumber: serialNumber,
    };

    const result = await isAnyDataChanged(
      screenData,
      route?.params?.SchoolId,
      route?.params?.RoomId,
      route?.params?.DeviceId,
    );
    if (result) {
      setDismissPopup(true);
    } else {
      navigation.goBack();
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        let data = await readFileFromLocalStorage();

        if (route.params) {
          let schoolData = JSON.parse(data).find(
            s => s?.id === route?.params?.SchoolId,
          );

          setSchoolId(schoolData?.id);
          setSelectedSchool(schoolData?.title);

          let roomData = schoolData?.rooms?.find(
            r => r?.id === route?.params?.RoomId,
          );

          setRoomId(roomData?.id);
          setSelectedRoom(roomData?.title);

          let deviceData = roomData?.devices?.find(
            d => d?.deviceID === route?.params?.DeviceId,
          );

          setDeviceType(deviceData?.deviceType);
          setDeviceName(deviceData?.deviceName);
          setMacAddress(deviceData?.macAddress);
          setSerialNumber(deviceData?.serialNumber);
          setInitialMacAddress(deviceData?.macAddress);
        }
      } catch (ex) {
        Utils.Log(
          Utils.logType.error,
          'fetchData function in updateDevice',
          ex,
        );
      }
    }
    if (isFocused) {
      fetchData();
    }
  }, [navigation, isFocused]);

  return (
    <View style={styles.containerStyle}>
      <Header
        showBackButton={true}
        navigation={navigation}
        headerTitle={`Edit ${deviceName}`}
        headerRightButtons={headerRightButtons}
        overrideBackPress={handleBackPress}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ marginTop: Mixins.scaleSize(15) }}
        style={{ flexGrow: 1 }}
        bounces={false}>
        <View style={styles.dropDownContainerStyle}>
          <DropDown
            title={translate('selectSchoolOrTypeToAddNew')}
            testID="schoolDropDownbtn"
            name={selectedSchool}
            isDropDown={true}
            isEditable={false}
            onPress={() => handleSchoolDropDown()}
          />
          <DropDown
            title={translate('selectRoomOrTypeToAddNew')}
            testID="roomDropDownbtn"
            name={selectedRoom}
            isDropDown={true}
            isEditable={false}
            onPress={() =>
              roomDropDown(
                schoolId,
                setIsRoomDropDown,
                setDeviceTypeSelected,
                setModalVisible,
                modalVisible,
                setSearch,
                setRoomData,
                setDataSource,
              )
            }
          />

          <DropDown
            title={translate('selectDeviceTypeOrTapToAddNew')}
            testID="deviceTypeDropDown"
            name={deviceType}
            isDropDown={true}
            isEditable={false}
            onPress={() =>
              deviceTypeDropDown(
                modalVisible,
                setModalVisible,
                setSearch,
                setDataSource,
                setDeviceTypeSelected,
              )
            }
          />
          <DropDown
            title={translate('selectDeviceNameOrAddNew')}
            name={deviceName}
            isDropDown={false}
            isEditable={true}
            maxLength={45}
            onChangeText={value => onChangeText('deviceName', value)}
          />
          <DropDown
            title={translate('macAddress')}
            name={macAddress}
            isDropDown={false}
            isEditable={true}
            maxLength={17}
            onChangeText={value => onChangeText('Mac Address', value)}
          />
          <DropDown
            title={translate('serialNumber')}
            name={serialNumber}
            isDropDown={false}
            isEditable={true}
            onChangeText={value => onChangeText('Serial Number', value)}
          />
          <View style={styles.saveButtonView}>
            <TouchableOpacity
              style={styles.deleteButtonEnable}
              onPress={() => setDeleteDeviceButtonPressed(true)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                isSaveDeviceEnable()
                  ? styles.saveButtonTO
                  : styles.saveButtonTODisable
              }
              disabled={isSaveDeviceEnable() ? false : true}
              onPress={() =>
                onBackPressSaveDevice(
                  route?.params?.SchoolId,
                  route?.params?.RoomId,
                  macAddress,
                  serialNumber,
                  deviceName,
                  deviceType,
                  route?.params?.DeviceId,
                  schoolId,
                  roomId,
                  navigation,
                  initialMacAddress,
                )
              }>
              <Text style={styles.saveButtonText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <Modal
        testID="modelForList"
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
                    ? 'Select Room'
                    : 'Select School'}
              </Text>
              <TouchableOpacity
                testID="closeModel"
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
              renderItem={deviceTypeSelected ? renderDeviceType : renderItem}
              keyExtractor={item => item.id}
            />
          </View>
        </View>
      </Modal>
      <Modal
        visible={dismissPopup || deleteDeviceButtonPressed}
        transparent={true}
        hideModal={() => { }}
        backdrop={true}>
        <ErrorWindow
          errorTitle={
            deleteDeviceButtonPressed
              ? translate('areYouSureYouWantToDeleteDevice') + ' ' + deviceName
              : translate('doYouWantToSaveThemBeforeMovingToOtherScreen')
          }
          button1Title={
            deleteDeviceButtonPressed ? translate('delete') : translate('save')
          }
          button2Title={
            deleteDeviceButtonPressed ? translate('cancel') : translate('leave')
          }
          button1Style={
            deleteDeviceButtonPressed
              ? styles.alertRedBtnStyle
              : styles.alertBlueBtnStyle
          }
          button1Action={() =>
            isSaveDeviceEnable()
              ? deleteDeviceButtonPressed
                ? deleteDevice({
                  schoolId,
                  roomId,
                  DeviceId: route?.params?.DeviceId,
                  navigation,
                })
                : onBackPressSaveDevice(
                  route?.params?.SchoolId,
                  route?.params?.RoomId,
                  macAddress,
                  serialNumber,
                  deviceName,
                  deviceType,
                  route?.params?.DeviceId,
                  schoolId,
                  roomId,
                  navigation,
                  initialMacAddress,
                )
              : Utils.showToast(translate('pleaseFillAllTheDetails'))
          }
          button2Action={() =>
            deleteDeviceButtonPressed
              ? setDeleteDeviceButtonPressed(false)
              : navigation.goBack()
          }
        />
      </Modal>
    </View>
  );
}
