import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

import styles from './styles';
import Utils from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { Mixins } from '../../config/styles';
import { translate } from '../../translations/translationHelper';
import {
  Identify,
  LeftIcon,
  POEIcon,
  ResetPasscode,
} from '../../config/imageConstants';
import { updateAppModalFields } from '../../services/app/action';
import BleManager from '../../config/bleManagerInstance';
import { handleIdentifyDevice } from '../../services/bleDevices/action';

const Header = props => {
  const {
    navigation,
    headerTitle,
    showBackButton,
    overrideBackPress,
    headerRightButtons,
    handleResetPasscode,
  } = props;
  const { showModal, deviceType, poeOverride } = useSelector(state => state.app);
  const dispatch = useDispatch();

  const { connectedDevice } = useSelector(state => state.authDevices);

  /**
   * function to handle the back press action from header
   */
  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
    try {
      if (Object.keys(connectedDevice).length > 0) {
        BleManager.cancelDeviceConnection(connectedDevice?.id);
      }
    } catch (error) {
      Utils.Log(Utils.logType.error, 'backpress error', error);
    }
  };

  /**
   * function to handle the backdrop press on Modal
   */
  const handleBackdrop = () => {
    dispatch(updateAppModalFields('showModal', false));
  };

  /**
   * function to toggle poe override setting
   */
  const handlePoeOverride = () => {
    dispatch(updateAppModalFields('showModal', false));
    dispatch(updateAppModalFields('showPoeModal', true));
  };

  /**
   * function to perform identify action on BLE device
   */
  const identifyDeviceAction = () => {
    dispatch(updateAppModalFields('showModal', false));
    dispatch(handleIdentifyDevice(connectedDevice));
  };

  return (
    <View style={styles.containerStyle}>
      {showBackButton && (
        <TouchableOpacity
          testID="header-back-button"
          onPress={overrideBackPress ? overrideBackPress : handleBackPress}>
          <LeftIcon
            width={Mixins.scaleSize(24)}
            height={Mixins.scaleSize(24)}
            style={styles.leftArrowButton}
          />
        </TouchableOpacity>
      )}
      <Text numberOfLines={1} style={styles.headerTitle}>
        {headerTitle}
      </Text>
      {headerRightButtons && headerRightButtons()}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          dispatch(updateAppModalFields('showModal', !showModal));
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleBackdrop}
          style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={identifyDeviceAction}
              style={styles.buttonStyle}>
              <Identify
                height={
                  Utils.isIpad ? Mixins.scaleSize(16) : Mixins.scaleSize(20)
                }
                width={
                  Utils.isIpad ? Mixins.scaleSize(16) : Mixins.scaleSize(20)
                }
              />
              <Text style={styles.logoutText}>{translate('identify')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleResetPasscode}
              style={styles.resetButton}>
              <ResetPasscode
                height={
                  Utils.isIpad ? Mixins.scaleSize(16) : Mixins.scaleSize(20)
                }
                width={
                  Utils.isIpad ? Mixins.scaleSize(16) : Mixins.scaleSize(20)
                }
              />
              <Text style={styles.logoutText}>
                {translate('resetPasscode')}
              </Text>
            </TouchableOpacity>
            {Utils.isMS700(deviceType) && (
              <TouchableOpacity
                onPress={handlePoeOverride}
                style={styles.poeButton}>
                <POEIcon
                  height={
                    Utils.isIpad ? Mixins.scaleSize(16) : Mixins.scaleSize(20)
                  }
                  width={
                    Utils.isIpad ? Mixins.scaleSize(16) : Mixins.scaleSize(20)
                  }
                />
                <Text style={styles.logoutText}>
                  {poeOverride
                    ? translate('disablePOEOverride')
                    : translate('enablePOEOverride')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Header;
