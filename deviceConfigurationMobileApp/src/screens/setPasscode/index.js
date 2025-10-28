import React, { useState } from 'react';
import { View, Text, Keyboard } from 'react-native';

import styles from './styles';
import Utils from '../../utils';
import { useDispatch } from 'react-redux';
import { Mixins } from '../../config/styles';
import { SetPasscodeBG } from '../../config/imageConstants';
import { translate } from '../../translations/translationHelper';
import { CustomButton, CustomTextInput, Header } from '../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  handleAuthProcess,
  handleUpdateProcess,
} from '../../services/bleDevices/action';
import DisconnectionModal from '../../components/disconnectionModal'

const SetPasscode = props => {
  const dispatch = useDispatch();
  const { navigation, route } = props;
  const passcodeRef = React.createRef();
  const { isUpdateScreen } = route.params;
  const [passcode, setPasscode] = useState('');
  const devicePressed = route.params?.devicePressed;
  const [passcodeError, setPasscodeError] = useState('');

  /**
   * function handling the onChangeText callback of Passcode text input
   * @param {string} _ variable containing field name
   * @param {string} value variable containing value user types in Passcode input
   */
  const onChangeText = (_, value) => {
    setPasscodeError('');
    setPasscode(value);
  };

  /**
   * function to handle the Auth process
   */
  const handleAuth = () => {
    if (passcode.length < 6) {
      return;
    }
    setPasscodeError('')
    Keyboard.dismiss();
    dispatch(
      handleAuthProcess(
        devicePressed,
        passcode,
        navigation,
        () => {
          setPasscode('');
        },
        () => {
          setPasscodeError(translate('invalidDevicePin'));
        },
      ),
    );
  };

  /**
   * function to handle the update passcode process
   */
  const handleUpdate = () => {
    if (passcode.length < 6) {
      return;
    }
    Keyboard.dismiss();
    dispatch(
      handleUpdateProcess(devicePressed, passcode, navigation, () => {
        setPasscode('');
      }),
    );
  };

  /**
   * function to perform custom back button behaviour
   */
  const overrideBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.keyBoardContainer}
      style={{ flexGrow: 1 }}
      bounces={false}>
      <View style={styles.containerStyle}>
        <Header
          headerTitle={''}
          navigation={navigation}
          showBackButton={true}
          overrideBackPress={overrideBackPress}
        />
        <Text testID="setPasscodeHeading" style={styles.enterPasscodeHeading}>
          {isUpdateScreen
            ? translate('resetDevicePasscode')
            : translate('enterDevicePasscode')}
        </Text>
        <Text style={styles.enterPasscodeDescription}>
          {isUpdateScreen
            ? translate('enterNewPasscode')
            : `${translate('enterThe')}${devicePressed?.localName.replace(/ *\([^)]*\) */g, "") || 'Device'
            }${translate('fourDigit')}`}
        </Text>
        <CustomTextInput
          secureTextEntry
          autoFocus={true}
          value={passcode}
          editable={true}
          ref={passcodeRef}
          errorMessage={passcodeError}
          keyboardType="default"
          fieldName={'passcode'}
          testID={'passcodeInput'}
          returnKeyType={'done'}
          autoCapitalize={'none'}
          hideErrorMessage={false}
          showPasswordButton={true}
          onChangeText={onChangeText}
          label={
            isUpdateScreen
              ? translate('enterNewPasscodePlaceholder')
              : translate('enterCode')
          }
          onSubmitEditing={isUpdateScreen ? handleUpdate : handleAuth}
        />
        <CustomButton
          testID={'updateButton'}
          onPress={isUpdateScreen ? handleUpdate : handleAuth}
          buttonText={
            isUpdateScreen ? translate('update') : translate('connect')
          }
          disabledFlag={passcode.length < 6}
          disabledStyle={styles.disabledStyle}
          containerStyle={styles.connectButton}
        />
        <SetPasscodeBG
          testID={'setPasscodeBG'}
          style={Utils.isIOS ? styles.bgImageIOS : styles.bgImageAndroid}
          width={Mixins.scaleSize(326)}
          height={Mixins.scaleSize(184)}
        />
      </View>
      <DisconnectionModal navigation={navigation} showDeviceDisconnected={true} />
    </KeyboardAwareScrollView>
  );
};

export default SetPasscode;
