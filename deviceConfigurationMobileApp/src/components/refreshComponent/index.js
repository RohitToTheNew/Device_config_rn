import { Animated } from 'react-native';
import React, { useEffect } from 'react';

import styles from './styles';
import { Mixins } from '../../config/styles';
import { RefreshIcon } from '../../config/imageConstants';

const RefreshComponent = props => {
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    startRotation();
  }, []);

  const startRotation = () => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ).start();
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  return (
    <Animated.View
      testID={props.refreshComponent}
      style={[
        styles.refreshButtonStyle,
        {
          transform: [{ rotate: spin }],
        },
      ]}>
      <RefreshIcon width={Mixins.scaleSize(24)} height={Mixins.scaleSize(24)} />
    </Animated.View>
  );
};

export default RefreshComponent;
