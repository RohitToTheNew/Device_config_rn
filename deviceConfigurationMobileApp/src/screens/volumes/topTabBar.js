import React from 'react';

import Input from './input';
import Output from './output';
import styles from './styles';
import { Text } from 'react-native';
import Equalizer from './equalizer';
import { useDispatch, useSelector } from 'react-redux';
import { Mixins, Colors } from '../../config/styles';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import utils from '../../utils';

const Tab = createMaterialTopTabNavigator();

export default function TopTabBar(props) {
  const { deviceType } = useSelector(state => state.app);
  const dispatch = useDispatch();
  return (
    <Tab.Navigator
      swipeEnabled={false}
      style={{ width: '100%' }}
      screenOptions={({ route }) => ({
        tabBarPressColor: 'transparent',
        tabBarStyle: {
          backgroundColor: 'transparent',
          height: Mixins.scaleSize(29),
          marginTop: Mixins.scaleSize(20),
        },
        tabBarIndicatorStyle: {
          backgroundColor: Colors.COLOR_003D7D,
          marginBottom: -2,
          width: utils.isCZA1300(deviceType)
            ? Mixins.scaleSize(130)
            : Mixins.scaleSize(90),
          marginStart: utils.isCZA1300(deviceType) ? Mixins.scaleSize(38) : Mixins.scaleSize(22),
        },
        tabBarIndicatorContainerStyle: {
          borderBottomWidth: 2,
          borderBottomColor: Colors.COLOR_FFFFFF,
        },
        tabBarLabel: ({ focused }) => {
          return (
            <Text style={styles.topbarLabelStyle(focused)}>{route.name}</Text>
          );
        },
      })}
      initialRouteName="Input">
      <Tab.Screen name="Input" component={Input} />
      <Tab.Screen name="Output" component={Output} />
      {!utils.isCZA1300(deviceType) && (
        <Tab.Screen name="Other" component={Equalizer} />
      )}
    </Tab.Navigator>
  );
}
