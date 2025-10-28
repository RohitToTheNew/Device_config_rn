import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, Animated, TouchableOpacity, Keyboard } from 'react-native';

import styles from './styles';
import Utils from '../../utils';
import Dash from 'react-native-dash';
import { useSelector } from 'react-redux';
import { Colors, Mixins } from '../../config/styles';
import { CloseEyeIcon, EyeIcon } from '../../config/imageConstants';

const { tablet } = Utils;

const CustomTextInput = props => {
  const {
    value,
    label,
    style,
    editable,
    containerStyle,
    textinputStyle,
    errorMessage,
    errorMessageStyle,
    inputRef,
    hideErrorMessage,
    onChangeText,
    fieldName,
    autoCapitalize,
    alignment,
    testID,
    labelStyle,
    keyboardType,
    showDash,
    onSubmitEditing,
  } = props;
  const animatedValue = new Animated.Value(!value ? 0 : 1);
  const { isFoldableDevice } = useSelector(state => state.app);

  const [isFocused, setIsFocused] = useState(false);
  const [secureTextEntry, setIsSecureTextEntry] = useState(
    props.secureTextEntry,
  );
  const [showPasswordButton, setShowPasswordButton] = useState(
    props.showPasswordButton || false,
  );

  const isErrorMessage = !!errorMessage;
  const hideError = hideErrorMessage || false;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused || props.value !== '' ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  /**
   * function to handle the onFocus action on input
   */
  const handleFocus = () => {
    const { onInputFocus } = props;
    setIsFocused(true);
    onInputFocus && onInputFocus();
  };

  /**
   * function to handle the onBlur action on input
   */
  const handleBlur = () => {
    const { onInputBlur } = props;
    setIsFocused(false), onInputBlur && onInputBlur();
  };

  /**
   * 
   * @returns function to toggle the show/hide password action
   */
  const onShowPasswordButtonTapped = () =>
    setIsSecureTextEntry(!secureTextEntry);

  /**
   * 
   * @param {string} value function to handle the onChangeText callback from text input
   */
  const handleChangeText = value => {
    onChangeText(fieldName, value);
  };

  return (
    <View style={style}>
      <View
        style={[
          styles.textInputContainer(isErrorMessage, isFocused, showDash),
          containerStyle,
        ]}>
        <TextInput
          {...props}
          refs={inputRef}
          secureTextEntry={secureTextEntry}
          editable={editable}
          keyboardType={keyboardType || 'numeric'}
          testID={testID}
          style={[
            styles.textinputStyle(
              showPasswordButton,
              isFoldableDevice,
              editable,
            ),
            textinputStyle,
          ]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={onSubmitEditing}
          enablesReturnKeyAutomatically={true}
          onChangeText={handleChangeText}
          autoCapitalize={autoCapitalize}
          autoFocus={props.autoFocus || false}
        />
        {showPasswordButton && (
          <TouchableOpacity
            style={styles.showPasswordButton}
            onPress={onShowPasswordButtonTapped}>
            {secureTextEntry ? (
              <EyeIcon
                height={
                  tablet || isFoldableDevice
                    ? Mixins.scaleSize(22)
                    : Mixins.scaleSize(24)
                }
                width={
                  tablet || isFoldableDevice
                    ? Mixins.scaleSize(23)
                    : Mixins.scaleSize(25)
                }
              />
            ) : (
              <CloseEyeIcon
                height={
                  tablet || isFoldableDevice
                    ? Mixins.scaleSize(22)
                    : Mixins.scaleSize(24)
                }
                width={
                  tablet || isFoldableDevice
                    ? Mixins.scaleSize(23)
                    : Mixins.scaleSize(25)
                }
              />
            )}
          </TouchableOpacity>
        )}

        {showDash && (
          <Dash style={styles.dashStyle} dashThickness={1} dashColor={Colors.COLOR_808284} dashLength={3} />
        )}
      </View>
      <Animated.View
        style={[
          styles.labelContainer,
          {
            top:
              props.label &&
              animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  tablet || isFoldableDevice
                    ? Mixins.scaleSize(19)
                    : Mixins.scaleSize(14),
                  tablet || isFoldableDevice
                    ? Mixins.scaleSize(-0.05)
                    : Mixins.scaleSize(-6),
                ],
              }),
            zIndex: -1
          },
          labelStyle,
        ]}>
        <TouchableOpacity
          activeOpacity={isFocused ? 1 : 0.5}
          onPress={() => {
            setIsFocused(true);
            inputRef && inputRef.current.focus();
          }}>
          <Animated.Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[
              styles.label(isFoldableDevice),
              {
                fontSize: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    tablet || isFoldableDevice
                      ? Mixins.scaleFont(12.5)
                      : Mixins.scaleFont(16),
                    tablet || isFoldableDevice
                      ? Mixins.scaleFont(10)
                      : Mixins.scaleFont(13),
                  ],
                }),
                color: isErrorMessage
                  ? Colors.COLOR_FF0000
                  : isFocused
                    ? Colors.COLOR_808284
                    : Colors.COLOR_808284,
              },
            ]}>
            {label}
          </Animated.Text>
        </TouchableOpacity>
      </Animated.View>
      {!hideError && (
        <Text
          style={[
            styles.errorMessage(isFoldableDevice),
            errorMessageStyle,
            { textAlign: alignment ? alignment : 'right' },
          ]}>
          {!!errorMessage && !hideError && errorMessage}
        </Text>
      )}
    </View>
  );
};

export default CustomTextInput;
