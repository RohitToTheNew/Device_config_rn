import { Text, TouchableOpacity, View, TextInput } from 'react-native';
import React from 'react';
import styles from './styles';
import { DropDown } from '../../config/imageConstants';
import { Mixins } from '../../config/styles';

export default function index({
  name,
  onPress,
  isDropDown,
  isEditable,
  onChangeText,
  testID,
  title,
  maxLength
}) {
  return (
    <View style={styles.containerStyle}>
      {showHeading(title)}
      <TouchableOpacity onPress={onPress} style={styles.rowStyle}>
        {isEditable ? (
          inputText(name, onChangeText, maxLength)
        ) : (
          <View style={{ flex: 1 }}>
            <Text testID={testID} style={styles.text}>{name}</Text>
          </View>
        )}
        {isDropDown && (
          <View style={{ flex: 0.1, alignItems: 'flex-end', marginRight: 5 }}>
            <DropDown
              width={Mixins.scaleSize(15)}
              height={Mixins.scaleSize(15)}
            />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
function inputText(name, onChangeText, maxLength) {
  return (
    <View style={{ flex: 1 }}>
      <TextInput
        value={name}
        style={styles.text}
        onChangeText={val => onChangeText(val)}
        maxLength={maxLength || undefined}
      />
    </View>
  );
}

function showHeading(heading) {
  return <Text style={styles.headingText}>{heading}</Text>;
}
