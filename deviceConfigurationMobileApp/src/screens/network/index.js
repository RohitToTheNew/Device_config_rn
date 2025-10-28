import React, { useEffect, useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Keyboard,
  Modal,
  BackHandler,
} from 'react-native';

import styles from './styles';
import Utils from '../../utils';
import { Mixins } from '../../config/styles';
import { ErrorWindow, Header } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import blemanager from '../../config/bleManagerInstance';
import { translate } from '../../translations/translationHelper';
import { updateAppModalFields } from '../../services/app/action';
import { CustomTextInput } from '../../components';
import { TickMark, TripleDot } from '../../config/imageConstants';
import {
  getNetworkSettingsInfoView,
  getNetworkSettingsMS700,
  handleSaveSettingsInfoview,
  handleSaveSettingsMS700,
  updateNetworkSettingsFields,
} from '../../services/network/action';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DisconnectionModal from '../../components/disconnectionModal';
import POEModal from '../../components/poeModal';

export default function Network(props) {
  const { navigation } = props;
  const dispatch = useDispatch();
  const epicIPRef = React.createRef();
  const ipAddressRef = React.createRef();
  const subnetRef = React.createRef();
  const gatewayRef = React.createRef();
  const primaryDnsRef = React.createRef();
  const secondaryDnsRef = React.createRef();
  const [enableEditing, setEnableEditing] = useState(false);
  const { bleDisconnected, bluetoothState, deviceType } = useSelector(
    state => state.app,
  );
  const { connectedDevice } = useSelector(state => state.authDevices);
  const {
    dhcpStatus,
    primaryDns,
    gateway,
    subnetMask,
    secondaryDns,
    ipAddress,
    epicServerUrl,
    unsavedModal,
  } = useSelector(state => state.network);

  const [primaryDnsError, setPrimaryDnsError] = useState('');
  const [secondaryDnsError, setSecondaryDnsError] = useState('');
  const [lastAction, setLastAction] = useState('');
  const [subnetError, setSubnetError] = useState('');
  const [gatewayError, setGatewayError] = useState('');
  const [ipAddressError, setIPAddressError] = useState('');
  const [serverUrlError, setServerUrlError] = useState('');

  useEffect(() => {
    if (connectedDevice) {
      if (!bleDisconnected) {
        if (Utils.isMS700(deviceType) || Utils.isCZA1300(deviceType)) {
          dispatch(getNetworkSettingsMS700());
        } else if (Utils.isInfoView(deviceType)) {
          dispatch(getNetworkSettingsInfoView());
        }
      } else {
        dispatch(updateAppModalFields('showDisconnectedModal', true));
      }
    }
  }, []);

  function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => ++value);
  }

  const forceUpdate = useForceUpdate();

  useEffect(() => {
    dispatch(updateAppModalFields('showModal', false));
    forceUpdate();
  }, [bluetoothState]);

  /**
   * function to handle the hardware back button behaviour on Android
   */
  const handleHardwareBackButton = () => {
    if (enableEditing) {
      dispatch(updateNetworkSettingsFields('unsavedModal', true));
      setLastAction('back');
    } else {
      navigation.navigate('BluetoothDevicesList');
      if (connectedDevice) {
        blemanager.cancelDeviceConnection(connectedDevice.id);
      }
    }
    return true;
  };

  /**
   * function to handle the hardware back button press
   */
  const handleBackButton = () => {
    if (enableEditing) {
      setLastAction('back');
      dispatch(updateNetworkSettingsFields('unsavedModal', true));
    } else {
      navigation.navigate('BluetoothDevicesList');
      if (connectedDevice) {
        blemanager.cancelDeviceConnection(connectedDevice.id);
      }
    }
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleHardwareBackButton);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleHardwareBackButton,
      );
    };
  }, [Utils.isAndroid]);

  /**
   * function to handle the triple dot menu CTA
   */
  const onOptionsPress = () => {
    dispatch(updateAppModalFields('showModal', true));
  };

  /**
   * function to handle the reset passcode CTA
   */
  const handleResetPasscode = () => {
    if (enableEditing) {
      setLastAction('resetPasscode');
      dispatch(updateAppModalFields('showModal', false));
      dispatch(updateNetworkSettingsFields('unsavedModal', true));
    } else {
      navigation.navigate('SetPasscode', {
        isUpdateScreen: true,
        devicePressed: connectedDevice,
      });
      dispatch(updateAppModalFields('showModal', false));
    }
  };

  /**
   * function to handle the OnChangeText callback of text inputs
   * @param {string} key variable containing the fieldName
   * @param {string} value variable containing the value received from text input
   */
  const onChangeText = (key, value) => {
    if (!enableEditing) {
      setEnableEditing(true);
    }
    switch (key) {
      case 'epicIP':
        setServerUrlError('');
        dispatch(updateNetworkSettingsFields('epicServerUrl', value));
        break;
      case 'ipAddress':
        setIPAddressError('');
        dispatch(updateNetworkSettingsFields('ipAddress', value.trim()));
        break;
      case 'subnetMask':
        setSubnetError('');
        dispatch(updateNetworkSettingsFields('subnetMask', value.trim()));
        break;
      case 'gateway':
        setGatewayError('');
        dispatch(updateNetworkSettingsFields('gateway', value.trim()));
        break;
      case 'primaryDns':
        setPrimaryDnsError('');
        dispatch(updateNetworkSettingsFields('primaryDns', value.trim()));
        break;
      case 'secondaryDns':
        setSecondaryDnsError('');
        dispatch(updateNetworkSettingsFields('secondaryDns', value.trim()));
        break;
      default:
        break;
    }
  };

  /**
   * function to reset the error values to default
   */
  const removeErrors = () => {
    setServerUrlError('');
    setIPAddressError('');
    setSubnetError('');
    setGatewayError('');
    setPrimaryDnsError('');
    setSecondaryDnsError('');
    setEnableEditing(false);
  };

  /**
   * function to handle the enable DHCP action
   */
  const enableDHCPConfiguration = async () => {
    removeErrors();
    dispatch(updateNetworkSettingsFields('dhcpStatus', 'dhcp'));
    setEnableEditing(true);
  };

  /**
   * function to handle the disable DHCP action
   */
  const disableDHCPConfiguration = async () => {
    removeErrors();
    dispatch(updateNetworkSettingsFields('dhcpStatus', 'static'));
    setEnableEditing(true);
  };

  /**
   * function to perform validation over input fields before saving to BLE device
   */
  const validateFields = () => {
    if (epicServerUrl.length <= 0) {
      setServerUrlError('Please provide valid EPIC IP');
    }
    if (!Utils.validateIP(ipAddress)) {
      setIPAddressError('Please provide valid IP Address');
    }
    if (!Utils.validateIP(subnetMask)) {
      setSubnetError('Please provide valid Subnet Mask');
    }
    if (!Utils.validateIP(gateway)) {
      setGatewayError('Please provide valid Gateway');
    }
    if (!Utils.validateIP(primaryDns)) {
      setPrimaryDnsError('Please provide valid Primary DNS');
    }
    if (secondaryDns.length > 0) {
      if (!Utils.validateIP(secondaryDns)) {
        setSecondaryDnsError('Please provide valid Secondary DNS');
      }
    }
  };

  /**
   * function to handle the save settings action
   */
  const handleSaveSettings = () => {
    if (!bleDisconnected) {
      if (Utils.isMS700(deviceType) || Utils.isCZA1300(deviceType)) {
        dispatch(
          handleSaveSettingsMS700(
            dhcpStatus,
            ipAddress,
            subnetMask,
            gateway,
            primaryDns,
            secondaryDns,
            epicServerUrl,
            validateFields,
            setServerUrlError,
            () => {
              setEnableEditing(false);
              dispatch(updateNetworkSettingsFields('unsavedModal', false));
              if (lastAction === 'back') {
                navigation.navigate('BluetoothDevicesList');
              } else if (lastAction === 'resetPasscode') {
                navigation.navigate('SetPasscode', { isUpdateScreen: true });
                dispatch(updateAppModalFields('showModal', false));
              } else {
                return;
              }
              setLastAction('');
            },
          ),
        );
      } else if (Utils.isInfoView(deviceType)) {
        dispatch(
          handleSaveSettingsInfoview(
            dhcpStatus,
            ipAddress,
            subnetMask,
            gateway,
            primaryDns,
            secondaryDns,
            epicServerUrl,
            validateFields,
            setServerUrlError,
            () => {
              setEnableEditing(false);
              dispatch(updateNetworkSettingsFields('unsavedModal', false));
              if (lastAction === 'back') {
                navigation.navigate('BluetoothDevicesList');
              } else if (lastAction === 'resetPasscode') {
                navigation.navigate('SetPasscode', { isUpdateScreen: true });
                dispatch(updateAppModalFields('showModal', false));
              } else {
                return;
              }
              setLastAction('');
            },
          ),
        );
      }
    } else {
      dispatch(updateAppModalFields('showDisconnectedModal', true));
    }
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

  return (
    <View style={styles.containerStyle}>
      <Header
        showBackButton={true}
        navigation={navigation}
        headerRightButtons={headerRightButtons}
        handleResetPasscode={handleResetPasscode}
        headerTitle={connectedDevice?.localName || translate('network')}
        overrideBackPress={handleBackButton}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.keyBoardContainer}
        showsVerticalScrollIndicator={false}
        style={styles.scrollableStyle}
        scrollEnabled={true}
        bounces={false}>
        <CustomTextInput
          ref={epicIPRef}
          editable={true}
          autoFocus={false}
          showDash={false}
          fieldName={'epicIP'}
          value={epicServerUrl}
          testID={'epicIPInput'}
          returnKeyType={'done'}
          style={{ marginTop: 28 }}
          keyboardType={'default'}
          onChangeText={onChangeText}
          label={translate('epicIP')}
          errorMessage={serverUrlError}
          onSubmitEditing={() => Keyboard.dismiss()}
          labelStyle={{ backgroundColor: 'transparent' }}
        />
        <Text style={styles.networkModeHeading}>
          {translate('networkMode')}
        </Text>
        <View style={styles.radionButtonContainer}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={enableDHCPConfiguration}>
            <View style={styles.radioButtonOuter}>
              {dhcpStatus === 'dhcp' && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
            <Text style={styles.radioButtonTitle(dhcpStatus === 'dhcp')}>
              {translate('dhcp')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={disableDHCPConfiguration}>
            <View
              style={[
                styles.radioButtonOuter,
                { marginStart: Mixins.scaleSize(111) },
              ]}>
              {dhcpStatus === 'static' && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
            <Text style={styles.radioButtonTitle(dhcpStatus === 'static')}>
              {translate('static')}
            </Text>
          </TouchableOpacity>
        </View>
        <CustomTextInput
          ref={ipAddressRef}
          value={ipAddress}
          autoFocus={false}
          returnKeyType={'done'}
          fieldName={'ipAddress'}
          style={{ marginTop: 30 }}
          keyboardType={'numeric'}
          testID={'ipAddressInput'}
          onChangeText={onChangeText}
          label={translate('ipAddress')}
          errorMessage={ipAddressError}
          showDash={dhcpStatus === 'dhcp'}
          editable={dhcpStatus === 'static'}
          labelStyle={{ backgroundColor: 'transparent' }}
          onSubmitEditing={() => Keyboard.dismiss()}
        />
        <CustomTextInput
          ref={subnetRef}
          value={subnetMask}
          autoFocus={false}
          returnKeyType={'done'}
          style={{ marginTop: 30 }}
          keyboardType={'numeric'}
          fieldName={'subnetMask'}
          testID={'subnetMaskInput'}
          onChangeText={onChangeText}
          errorMessage={subnetError}
          label={translate('subnetMask')}
          showDash={dhcpStatus === 'dhcp'}
          editable={dhcpStatus === 'static'}
          labelStyle={{ backgroundColor: 'transparent' }}
          onSubmitEditing={() => Keyboard.dismiss()}
        />
        <CustomTextInput
          value={gateway}
          ref={gatewayRef}
          autoFocus={false}
          fieldName={'gateway'}
          returnKeyType={'done'}
          style={{ marginTop: 30 }}
          testID={'gatewayInput'}
          keyboardType={'numeric'}
          errorMessage={gatewayError}
          onChangeText={onChangeText}
          label={translate('gateway')}
          showDash={dhcpStatus === 'dhcp'}
          editable={dhcpStatus === 'static'}
          labelStyle={{ backgroundColor: 'transparent' }}
          onSubmitEditing={() => Keyboard.dismiss()}
        />
        <CustomTextInput
          value={primaryDns}
          ref={primaryDnsRef}
          autoFocus={false}
          fieldName={'primaryDns'}
          testID={'primaryDnsInput'}
          returnKeyType={'done'}
          errorMessage={primaryDnsError}
          style={{ marginTop: 30 }}
          keyboardType={'numeric'}
          label={translate('primaryDns')}
          onChangeText={onChangeText}
          showDash={dhcpStatus === 'dhcp'}
          editable={dhcpStatus === 'static'}
          onSubmitEditing={() => Keyboard.dismiss()}
          labelStyle={{ backgroundColor: 'transparent' }}
        />
        <CustomTextInput
          value={secondaryDns}
          ref={secondaryDnsRef}
          autoFocus={false}
          fieldName={'secondaryDns'}
          testID={'secondaryDnsInput'}
          returnKeyType={'done'}
          errorMessage={secondaryDnsError}
          style={{ marginTop: 30 }}
          keyboardType={'numeric'}
          label={translate('secondaryDns')}
          onChangeText={onChangeText}
          showDash={dhcpStatus === 'dhcp'}
          editable={dhcpStatus === 'static'}
          onSubmitEditing={() => Keyboard.dismiss()}
          labelStyle={{ backgroundColor: 'transparent' }}
        />
      </KeyboardAwareScrollView>
      <Modal
        visible={unsavedModal}
        transparent={true}
        hideModal={() => { }}
        backdrop={true}>
        <ErrorWindow
          showGraphics={false}
          errorTitle={translate('youHaveUnsavedChanged')}
          button1Action={() => {
            dispatch(updateNetworkSettingsFields('unsavedModal', false));
            handleSaveSettings();
          }}
          button2Action={() => {
            dispatch(updateNetworkSettingsFields('unsavedModal', false));
            setEnableEditing(false);
            navigation.navigate('BluetoothDevicesList');
          }}
          button1Title={translate('save')}
          button2Title={translate('leave')}
        />
      </Modal>
      <DisconnectionModal
        navigation={navigation}
        showDeviceDisconnected={true}
      />
      <POEModal navigation={navigation} />
    </View>
  );
}
