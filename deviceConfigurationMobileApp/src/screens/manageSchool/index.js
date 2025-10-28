import { FlatList, View, Text, TouchableOpacity, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Header, ErrorWindow } from '../../components';
import { translate } from '../../translations/translationHelper';
import { getSavedData, handleExportCSV, deleteSchoolAlert, deleteSchool } from './action';
import { Mixins } from '../../config/styles';
import {
  ExportCSVIcon,
  DeleteIcon,
  RoomsIcon,
  DeviceIcon,
  QRCodeBlue,
} from '../../config/imageConstants';
import styles from './styles';
import Utils from '../../utils';

export default function ManageSchools({ navigation }) {
  const [savedData, setSavedData] = useState([]);
  const isFocused = useIsFocused();
  const [popupToDeleteDevice, setPopupToDeleteDevice] = useState(false);
  const [schoolTitle, setSchoolTitle] = useState('');
  const [schoolId, setSchoolId] = useState('');

  const SchoolItem = item => (
    <TouchableOpacity
      style={styles.listItemContainer}
      onPress={() => {
        navigation.navigate('schoolDevicesList', {
          dataToRender: item?.rooms,
          SchoolTitle: item?.schoolTitle,
          SchoolId: item?.schoolId,
        });
      }}>
      <View style={styles.listItemTitle}>
        <Text style={styles.titleText}>{item.schoolTitle}</Text>
        <View style={styles.roomDeviceContainer}>
          <View style={styles.roomContainer}>
            <RoomsIcon
              width={Mixins.scaleSize(12)}
              height={Mixins.scaleSize(12)}
            />
            <Text style={styles.roomTextContainer}>
              {`${item.rooms?.length} Rooms`}
            </Text>
          </View>
          <View style={styles.deviceContainer}>
            <DeviceIcon
              width={Mixins.scaleSize(12)}
              height={Mixins.scaleSize(12)}
            />
            <Text style={styles.deviceTextContainer}>
              {`${item?.devices} Devices`}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          style={styles.csvContainer}
          onPress={() => handleExportCSV(item)}>
          <ExportCSVIcon
            width={Mixins.scaleSize(20)}
            height={Mixins.scaleSize(20)}
          />
        </TouchableOpacity>
        <TouchableOpacity
          testID="deleteAlert"
          onPress={async () =>
            deleteSchoolAlert(
              item?.schoolTitle,
              item?.schoolId,
              setSchoolTitle,
              setSchoolId,
              setPopupToDeleteDevice,
            )
          }>
          <View style={styles.deleteIconStyle}>
            <DeleteIcon
              width={Mixins.scaleSize(20)}
              height={Mixins.scaleSize(20)}
            />
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  function getNumberOfDevices(rooms) {
    let numberOfDevices = 0;
    for (let i = 0; i < rooms.length; i++) {
      numberOfDevices += rooms[i]?.devices.length;
    }
    return numberOfDevices;
  }

  const renderItem = item => (
    <SchoolItem
      devices={getNumberOfDevices(item.rooms)}
      schoolId={item.id}
      schoolTitle={item.title}
      rooms={item.rooms}
    />
  );
  const headerRightButtons = () => {
    return (
      <TouchableOpacity
        testID="codeScan"
        onPress={() => navigation.push('CodeScanner')}
        style={styles.codeScanner}>
        <QRCodeBlue
          width={Mixins.scaleSize(24)}
          height={Mixins.scaleSize(24)}
          style={{}}
        />
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getSavedData();
        setSavedData(JSON.parse(result));
      } catch (ex) {
        Utils.showToast(translate('somethingWentWrong'));
      }
    }
    if (isFocused) {
      fetchData();
    }
  }, [navigation, isFocused]);

  const handleBackButton = () => {
    navigation.navigate('BluetoothDevicesList')
  }

  return (
    <View>
      <Header
        showBackButton={true}
        navigation={navigation}
        headerTitle={translate('manageSchools')}
        headerRightButtons={headerRightButtons}
        overrideBackPress={handleBackButton}
      />
      <FlatList
        data={savedData}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.contentContainerStyle}
      />
      <Modal
        testID='modelAlert'
        visible={popupToDeleteDevice}
        transparent={true}
        hideModal={() => { }}
        backdrop={true}>
        <ErrorWindow
          testId={'alertPopup'}
          errorTitle={
            translate('areYouSureYouWantToDelete') + '\n' + schoolTitle
          }
          button1Style={styles.alertbtnStyle}
          button1Title={translate('deleteButton')}
          button2Title={translate('cancel')}
          button1Action={() => deleteSchool(schoolId, savedData, setSavedData, setPopupToDeleteDevice)}
          button2Action={() => setPopupToDeleteDevice(false)}
          isRedAlert={true}
        />
      </Modal>
    </View>
  );
}
