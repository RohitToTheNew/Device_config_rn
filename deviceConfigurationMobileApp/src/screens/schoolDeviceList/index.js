import { FlatList, View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { Header } from '../../components';
import { translate } from '../../translations/translationHelper';
import { Mixins } from '../../config/styles';
import { DeviceIcon, QRCodeBlue } from '../../config/imageConstants';
import styles from './styles';
import Utils from '../../utils';
import { getSavedData } from '../manageSchool/action';
import { useState } from 'react';
import { useIsFocused } from '@react-navigation/native';

export default function SchoolDevicesList({ navigation, route }) {
  let SchoolId = '';
  let SchoolTitile = '';
  let dataTorender = [];
  if (route?.params) {
    SchoolId = route?.params?.SchoolId;
    SchoolTitile = route?.params?.SchoolTitle;
    dataTorender = route?.params?.dataToRender;
  }

  const [savedData, setSavedData] = useState([]);
  const isFocused = useIsFocused();

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

  const RoomItem = item => (
    <View>
      <TouchableOpacity style={styles.roomTitleContainer}>
        <Text style={styles.titleText}>{item?.titleObj?.title}</Text>
      </TouchableOpacity>
      {item?.titleObj?.devices.length !== 0 ? (
        item?.titleObj?.devices.map(device => (
          <TouchableOpacity
            style={styles.listItemContainer}
            onPress={() => {
              navigation.navigate('updateDevice', {
                SchoolId: SchoolId,
                RoomId: item?.titleObj?.id,
                DeviceId: device.deviceID,
                DeviceName: device.deviceName,
              });
            }}>
            <View style={styles.deviceContainer}>
              <DeviceIcon
                width={Mixins.scaleSize(32)}
                height={Mixins.scaleSize(32)}
              />
              <View style={styles.deviceNameView}>
                <Text style={styles.availableDeviceTextContainer}>
                  {`${device.deviceName}`}
                </Text>
                <Text style={styles.deviceType}>{device.deviceType}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.noDeviceView}>
          <TouchableOpacity style={styles.noRoomStyle}>
            <View style={styles.noDeviceContainer}>
              <Text style={styles.deviceTextContainer}>
                {translate('noDevicesInThisRoom')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderItem = item => <RoomItem titleObj={item} />;

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

  return (
    <View>
      <Header
        showBackButton={true}
        navigation={navigation}
        headerTitle={SchoolTitile}
        headerRightButtons={headerRightButtons}
      />
      {dataTorender.length !== 0 ? (
        <FlatList
          data={dataTorender}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.contentContainerStyle}
        />
      ) : (
        <View style={styles.noRoomStyleContainer}>
          <TouchableOpacity style={styles.noRoomStyle}>
            <View style={styles.noDeviceContainer}>
              <Text style={styles.deviceTextContainer}>
                {translate('noRoomCreated')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
