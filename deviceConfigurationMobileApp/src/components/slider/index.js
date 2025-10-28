import React from 'react';
import { View, Text } from 'react-native';

import styles from './styles';
import { Slider } from '../react-native-slider/lib/index';
import { Colors } from '../../config/styles';

export default function SliderComponent(props) {

  /**
   * function to render the squared thumb component on the slider
   */
  const renderThumbComponent = () => {
    return <View style={styles.thumbStyle(props.isDisabled, props.bypassEQ)} />;
  };

  return (
    <Slider
      testID={props.testID}
      containerStyle={styles.slider}
      animateTransitions={true}
      disabled={props.isDisabled || false}
      maximumTrackTintColor={Colors.COLOR_BABCBC}
      minimumTrackTintColor={
        props.bypassEQ
          ? Colors.COLOR_7E96B0
          : props.isDisabled
            ? Colors.COLOR_808284
            : Colors.COLOR_003D7D
      }
      trackStyle={styles.trackStyle}
      step={1}
      minimumValue={props.minValue}
      maximumValue={props.maxValue}
      renderAboveThumbComponent={() => {
        return (
          <Text
            style={[
              styles.thumbTextStyle,
              {
                marginStart:
                  props.value === 0 ? 20 : props.value === 50 ? 8 : 12,
              },
            ]}>
            {props.value} db
          </Text>
        );
      }}
      value={props.value}
      renderThumbComponent={renderThumbComponent}
      onSlidingComplete={props.onValueChange}
    />
  );
}
