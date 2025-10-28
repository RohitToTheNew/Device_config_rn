import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import styles from './styles';

const CustomButton = ({
  icon,
  testID,
  onPress,
  textStyle,
  buttonText,
  disabledFlag,
  disabledStyle,
  containerStyle,
  isRedAlert,
  button1Style
}) => (
  <TouchableOpacity
    testID={testID}
    disabled={disabledFlag}
    style={
      isRedAlert ? [styles.container, button1Style] :
      disabledFlag
        ? [styles.container, disabledStyle, containerStyle]
        : [styles.container, containerStyle]
    }
    onPress={() => onPress && onPress()}>
    {icon && icon}
    <Text style={[styles.defaultTextStyle, textStyle]}>{buttonText}</Text>
  </TouchableOpacity>
);

export default CustomButton;
