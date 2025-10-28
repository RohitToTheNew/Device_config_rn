import { Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import styles from './styles';
import { DropDown } from '../../config/imageConstants';
import { Mixins } from '../../config/styles';
import { CustomTextInput } from '../../components';

export default function index({
  identity,
  name,
  onPress,
  isDropDown,
  isEditable,
  onChangeText,
  heading,
  isFieldSelected,
  ref,
  showDisabled,
  testID,
  title,
  testIDProp,
  maxLength
}) {
  return (
    <View style={isEditable === false || isDropDown ? styles.containerStyle : styles.containerStyleWithoutBorder}>
      <TouchableOpacity testID={`${testIDProp}Touchable`} onPress={onPress} style={styles.rowStyle}>
        {isEditable ? (
          inputText(name, onChangeText, heading, identity, ref, testIDProp, maxLength)
        ) : (
          <View style={styles.headingContainer}>
            {isFieldSelected && showHeading(heading, testIDProp)}
            <Text testID={`${testIDProp}selectedValue`} style={styles.text(isFieldSelected, showDisabled)}>{name}</Text>
          </View>
        )}
        {isDropDown && (
          <View style={styles.dropDownIconStyle}>
            <DropDown
              width={Mixins.scaleSize(12)}
              height={Mixins.scaleSize(12)}
            />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
function inputText(name, onChangeText, heading, identity, ref, testIDProp, maxLength) {
  return (
    <View style={styles.textInputView}>
      {identity === 'macAddress' ? (
        <CustomTextInput
          testID={testIDProp}
          value={name}
          ref={ref}
          onChangeText={onChangeText}
          autoFocus={false}
          style={{ marginTop: 10 }}
          fieldName={heading}
          keyboardType={'default'}
          editable={true}
          label={heading}
          maxLength={maxLength || undefined}
          labelStyle={{
            backgroundColor: 'transparent',
          }}
        />
      ) : (
        <CustomTextInput
          testID={testIDProp}
          value={name}
          ref={ref}
          onChangeText={onChangeText}
          autoFocus={false}
          editable={true}
          maxLength={maxLength || undefined}
          style={identity === 'deviceName' ? { marginTop: 15 } : { marginTop: 10 }}
          fieldName={heading}
          keyboardType={'default'}
          label={heading}
          labelStyle={{
            backgroundColor: 'transparent',
          }}
        />
      )}
    </View>
  );
}

function showHeading(heading, testIDProp) {
  return <Text testID={`heading${testIDProp}`} style={styles.headingText}>{heading}</Text>;
}
