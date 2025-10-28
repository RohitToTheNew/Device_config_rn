import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  BackHandler,
} from 'react-native';

import styles from './styles';
import { CustomLoader, ErrorWindow, Header } from '../../components';
import { Mixins } from '../../config/styles';
import { useDispatch, useSelector } from 'react-redux';
import { updateAppModalFields } from '../../services/app/action';
import { translate } from '../../translations/translationHelper';
import {
  CrossIcon,
  DropdownArrow,
  TripleDot,
  TickMark,
  CloseWondowLight,
} from '../../config/imageConstants';
import {
  getSerialSettings,
  getSerialSettingsCZA1300,
  saveSerialSettings,
  saveSerialSettingsCZA1300,
  updateSerialSettingsFields,
} from '../../services/serial/action';
import DisconnectionModal from '../../components/disconnectionModal';
import Utils from '../../utils';
import { useIsFocused } from '@react-navigation/native';
import POEModal from '../../components/poeModal';

export default function Serial(props) {
  const { navigation } = props;
  const { connectedDevice } = useSelector(state => state.authDevices);
  const { serialSettings, showUnsavedModal } = useSelector(state => state.serial);
  const dispatch = useDispatch();

  const [enableEditing, setEnableEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalId, setModalId] = useState(-1);
  const [boudModalVisible, setBoudModalVisible] = useState(false);

  const [selectedPort, setSelectedPort] = useState(0);
  const isFocused = useIsFocused();

  useEffect(() => {
    dispatch(getSerialSettings(connectedDevice?.deviceType));
  }, []);

  const handleHardwareBackButton = () => {
    if (enableEditing) {
      dispatch(updateSerialSettingsFields('showUnsavedModal', true));
    } else {
      if (navigation.canGoBack()) navigation.goBack();
    }
    return true;
  };

  useEffect(() => {
    if (isFocused) {
      BackHandler.addEventListener(
        'hardwareBackPress',
        handleHardwareBackButton,
      );
    } else {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleHardwareBackButton,
      );
    }
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleHardwareBackButton,
      );
    };
  }, [Utils.isAndroid, isFocused, enableEditing]);

  const onOptionsPress = () => {
    setModalId(-1);
    dispatch(updateAppModalFields('showModal', true));
  };

  const handleSaveSettings = () => {
    setModalId(-1);
    dispatch(
      saveSerialSettings(connectedDevice?.deviceType, () => {
        setEnableEditing(false);
        dispatch(updateSerialSettingsFields('showUnsavedModal', false));
      }),
    );
  };
  const handleSaveSettingsOnBack = () => {
    setModalId(-1);
    dispatch(
      saveSerialSettings(connectedDevice?.deviceType, () => {
        setEnableEditing(false);
        dispatch(updateSerialSettingsFields('showUnsavedModal', false));
        navigation.goBack();
      }),
    );
  };

  const headerRightButtons = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {enableEditing && (
          <TouchableOpacity onPress={handleSaveSettings}>
            <TickMark
              width={Mixins.scaleSize(24)}
              height={Mixins.scaleSize(24)}
              style={styles.tickMarkStyle}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onOptionsPress}>
          <TripleDot
            width={Mixins.scaleSize(24)}
            height={Mixins.scaleSize(24)}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const getNumColumns = listLength => {
    return 2;
  };

  const renderMultiSelectedView = rowData => {
    let itemToRender;
    const filteredItem = rowData.item.forwardingBehaviour.filter(
      element => element.selected,
    );

    const renderChipView = innerRowData => {
      const onRemovePress = () => {
        let innerIndex = serialSettings[
          rowData.index
        ].forwardingBehaviour.findIndex(
          element => element.portNumber === innerRowData.item.portNumber,
        );
        serialSettings[rowData.index].forwardingBehaviour[
          innerIndex
        ].selected = false;
        dispatch(
          updateSerialSettingsFields('serialSettings', [...serialSettings]),
        );
        setEnableEditing(true);
      };

      return (
        <TouchableOpacity
          onPress={() => { }}
          activeOpacity={1}
          style={styles.chipView}>
          <Text style={styles.chipViewText}>{innerRowData.item.portName}</Text>
          <TouchableOpacity hitSlop={styles.hitSlop} onPress={onRemovePress}>
            <CloseWondowLight width={18} height={18} />
          </TouchableOpacity>
        </TouchableOpacity>
      );
    };

    if (filteredItem.length === 0) {
      itemToRender = (
        <Text style={styles.selectText}>
          {translate('selectForwardingBehaviour')}
        </Text>
      );
    } else {
      itemToRender = (
        <ScrollView
          horizontal={true}
          containerStyle={{
            flexDirection: 'column',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
          }}>
          <FlatList
            scrollEnabled={false}
            numColumns={2}
            data={filteredItem}
            renderItem={renderChipView}
            columnWrapperStyle={
              getNumColumns(filteredItem.length) > 1
                ? { flexWrap: 'wrap' }
                : undefined
            }
          />
        </ScrollView>
      );
    }
    return itemToRender;
  };

  const renderItem = rowData => {
    const { item, index } = rowData;
    return (
      <View style={styles.listItemContainer}>
        <Text style={styles.headingStyle}>{item.portName}</Text>
        {item.portName == 'Network/EPIC' ? (
          <>
            <TouchableOpacity
              testID="forwardingBehaviourButton"
              onPress={() => {
                setSelectedPort(index);
                setModalVisible(!modalVisible);
                if (modalId === -1) {
                  setModalId(item.id);
                } else {
                  setModalId(-1);
                }
              }}
              style={[styles.forwardingBehaviourButton, { marginTop: 0 }]}>
              {renderMultiSelectedView(rowData)}
              <DropdownArrow
                width={Mixins.scaleSize(24)}
                height={Mixins.scaleSize(24)}
              />
            </TouchableOpacity>
            {modalId === item.id && (
              <View
                testID="forwardingBehaviourModal"
                style={styles.centeredView1}>
                <View style={styles.modalView1}>
                  <TouchableOpacity
                    style={{
                      alignSelf: 'flex-end',
                      marginEnd: 20,
                      marginTop: 20,
                      marginBottom: 10,
                    }}
                    hitSlop={styles.hitSlop}
                    onPress={() => {
                      setModalId(-1);
                    }}>
                    <CrossIcon
                      width={Mixins.scaleSize(24)}
                      height={Mixins.scaleSize(24)}
                    />
                  </TouchableOpacity>
                  <FlatList
                    data={serialSettings[selectedPort].forwardingBehaviour}
                    renderItem={renderDropdownItem}
                    contentContainerStyle={{
                      paddingBottom: Mixins.scaleSize(44),
                    }}
                  />
                </View>
              </View>
            )}
          </>
        ) : (
          <>
            <TouchableOpacity
              testID="boudRateButton"
              onPress={() => {
                setSelectedPort(index);
                setBoudModalVisible(!boudModalVisible);
                setModalId(-1);
              }}
              style={styles.boudRateButton}>
              <Text style={styles.selectText}>
                {item.selectedBoudRate || translate('selectBoudRate')}
              </Text>
              <DropdownArrow
                width={Mixins.scaleSize(24)}
                height={Mixins.scaleSize(24)}
              />
            </TouchableOpacity>
            <TouchableOpacity
              testID="forwardingBehaviourButton"
              onPress={() => {
                setSelectedPort(index);
                setModalVisible(!modalVisible);
                if (modalId === -1) {
                  setModalId(item.id);
                } else {
                  setModalId(-1);
                }
              }}
              style={styles.forwardingBehaviourButton}>
              {renderMultiSelectedView(rowData)}
              <DropdownArrow
                width={Mixins.scaleSize(24)}
                height={Mixins.scaleSize(24)}
              />
            </TouchableOpacity>
            {modalId === item.id && (
              <View
                testID="forwardingBehaviourModal"
                style={styles.centeredView1}>
                <View style={styles.modalView1}>
                  <TouchableOpacity
                    style={{
                      alignSelf: 'flex-end',
                      marginEnd: 20,
                      marginTop: 20,
                      marginBottom: 10,
                    }}
                    hitSlop={styles.hitSlop}
                    onPress={() => {
                      setModalId(-1);
                    }}>
                    <CrossIcon
                      width={Mixins.scaleSize(24)}
                      height={Mixins.scaleSize(24)}
                    />
                  </TouchableOpacity>
                  <FlatList
                    data={serialSettings[selectedPort].forwardingBehaviour}
                    renderItem={renderDropdownItem}
                    contentContainerStyle={{
                      paddingBottom: Mixins.scaleSize(44),
                    }}
                  />
                </View>
              </View>
            )}
          </>
        )}
      </View>
    );
  };

  const renderDropdownItem = rowData => {
    const { item, index } = rowData;
    const isSelected =
      serialSettings[selectedPort].forwardingBehaviour[index].selected;
    return (
      <TouchableOpacity
        testID={`forwardingBehaviourDropdownItem${index}`}
        style={styles.dropdownItem}
        onPress={() => {
          serialSettings[selectedPort].forwardingBehaviour[index].selected =
            !isSelected;
          dispatch(
            updateSerialSettingsFields('serialSettings', serialSettings),
          );
          if (!enableEditing) {
            setEnableEditing(true);
          }
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.dropdownItemText}>{item.portName}</Text>
          {item.selected && (
            <TickMark
              width={Mixins.scaleSize(16)}
              height={Mixins.scaleSize(16)}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderBoudDropdownItem = rowData => {
    const { item, index } = rowData;
    return (
      <TouchableOpacity
        style={styles.dropdownItem}
        onPress={() => {
          let tempData = serialSettings;
          tempData[selectedPort].selectedBoudRate = item;
          dispatch(updateSerialSettingsFields('serialSettings', tempData));
          if (!enableEditing) {
            setEnableEditing(true);
          }
          setBoudModalVisible(false);
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.dropdownItemText}>{item}</Text>
          {serialSettings[selectedPort].selectedBoudRate === item && (
            <TickMark
              width={Mixins.scaleSize(16)}
              height={Mixins.scaleSize(16)}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const handleBackButton = () => {
    if (enableEditing) {
      dispatch(updateSerialSettingsFields('showUnsavedModal', true));
    } else {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  };

  return (
    <View testID="serialComponent" style={styles.containerStyle}>
      <Header
        showBackButton={true}
        navigation={navigation}
        headerRightButtons={headerRightButtons}
        headerTitle={connectedDevice?.localName || translate('serial')}
        overrideBackPress={handleBackButton}
      />
      <FlatList
        style={styles.listStyle}
        data={serialSettings}
        testID="serialSettingsList"
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
      <DisconnectionModal
        navigation={navigation}
        showDeviceDisconnected={true}
      />
      <POEModal navigation={navigation} />
      <Modal
        visible={showUnsavedModal}
        transparent={true}
        hideModal={() => { }}
        backdrop={true}>
        <>
          <ErrorWindow
            showGraphics={false}
            errorTitle={translate('youHaveUnsavedChanged')}
            button1Action={handleSaveSettingsOnBack}
            button2Action={() => {
              navigation.goBack();
              dispatch(updateSerialSettingsFields('showUnsavedModal', false));
              setEnableEditing(false);
            }}
            button1Title={translate('save')}
            button2Title={translate('leave')}
          />
          <CustomLoader />
        </>
      </Modal>
      <Modal
        testID="boudRateModal"
        animationType="slide"
        transparent={true}
        visible={boudModalVisible}
        onRequestClose={() => {
          setBoudModalVisible(!boudModalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.dropdownHeaderContainer}>
              <Text style={styles.dropdownHeader}>
                {translate('selectForwardingBehaviour')}
              </Text>
              <TouchableOpacity
                hitSlop={styles.hitSlop}
                onPress={() => {
                  setBoudModalVisible(!boudModalVisible);
                }}>
                <CrossIcon
                  width={Mixins.scaleSize(24)}
                  height={Mixins.scaleSize(24)}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={[9600, 19200, 38400, 57600, 115200]}
              renderItem={renderBoudDropdownItem}
              contentContainerStyle={styles.listContainerStyle}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
