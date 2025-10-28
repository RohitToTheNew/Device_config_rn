import { Text, TouchableOpacity, View, TextInput } from 'react-native';
import React from 'react';
import styles from './styles';
import { DropDown } from '../../config/imageConstants';
import { Mixins, Colors } from '../../config/styles';
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
  maxLength
}) {
  return (
    <View testID={testID} style={isDropDown ? styles.containerStyle : styles.containerStyleWithoutBorder}>
      <TouchableOpacity onPress={onPress} style={styles.rowStyle}>
        {isEditable ? (
          inputText(name, onChangeText, heading, identity, ref, maxLength)
        ) : (
          <View style={{ flex: 1, borderBottomWidth: identity === 'macAddress' ? 1 : 0, borderBottomColor: Colors.COLOR_808284 }}>
            {isFieldSelected && showHeading(heading)}
            <Text style={styles.text(isFieldSelected, showDisabled)}>{name}</Text>
          </View>
        )}
        {isDropDown && (
          <View>
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
function inputText(name, onChangeText, heading, identity, ref, maxLength) {
  return (
    <View style={styles.textInputView}>
      {identity === 'macAddress' ? (
        <CustomTextInput
          value={name}
          ref={ref}
          onChangeText={onChangeText}
          autoFocus={false}
          style={{ marginTop: 10 }}
          fieldName={heading}
          label={heading}
          maxLength={maxLength || undefined}
          keyboardType={'default'}
          labelStyle={{
            backgroundColor: 'transparent',
          }}
        />
      ) : (
        <CustomTextInput
          value={name}
          ref={ref}
          onChangeText={onChangeText}
          autoFocus={false}
          editable={true}
          maxLength={maxLength || undefined}
          style={identity === 'deviceName' ? { marginTop: 15 } : { marginTop: 10 }}
          fieldName={heading}
          label={heading}
          keyboardType={'default'}
          labelStyle={{
            backgroundColor: 'transparent',
          }}
        />
      )}
    </View>
  );
}

function showHeading(heading) {
  return <Text style={styles.headingText}>{heading}</Text>;
}
