import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import styles from './styles';
import { Mixins } from '../../config/styles';
import {
  AverageSignalIcon,
  BestSignalIcon,
  BluetoothDevice,
  GoodSignalIcon,
  LowSignalIcon,
  VeryLowSignalIcon,
  IdentifyIcon,
  NoSignalIcon,
} from '../../config/imageConstants';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Utils from '../../utils';
import deviceType from '../../config/deviceType';

const DeviceItem = props => {
  const [loading, setLoading] = useState(false);

  /**
   * function to check if number lies between range of numbers
   * @param {number} x number for which range is to be checked
   * @param {number} min minimum range value
   * @param {number} max maximum range value
   * @returns
   */
  const numberInRange = (x, min, max) => {
    return x >= min && x <= max;
  };

  /**
   *
   * @param {number} rssi number indicating the rssi value of ble device
   * @returns signal strength icon based on rssi value
   */
  const getIcon = rssi => {
    let icon;
    if (numberInRange(rssi, -69, 0) || rssi > 0) {
      icon = (
        <BestSignalIcon
          width={Mixins.scaleSize(18)}
          height={Mixins.scaleSize(18)}
        />
      );
    } else if (numberInRange(rssi, -75, -70)) {
      icon = (
        <GoodSignalIcon
          width={Mixins.scaleSize(18)}
          height={Mixins.scaleSize(18)}
        />
      );
    } else if (numberInRange(rssi, -80, -76)) {
      icon = (
        <AverageSignalIcon
          width={Mixins.scaleSize(18)}
          height={Mixins.scaleSize(18)}
        />
      );
    } else if (numberInRange(rssi, -89, -81)) {
      icon = (
        <LowSignalIcon
          width={Mixins.scaleSize(18)}
          height={Mixins.scaleSize(18)}
        />
      );
    } else if (numberInRange(rssi, -99, -91)) {
      icon = (
        <VeryLowSignalIcon
          width={Mixins.scaleSize(18)}
          height={Mixins.scaleSize(18)}
        />
      );
    } else if (rssi < -100) {
      icon = (
        <NoSignalIcon
          width={Mixins.scaleSize(18)}
          height={Mixins.scaleSize(18)}
        />
      );
    } else {
      icon = (
        <AverageSignalIcon
          width={Mixins.scaleSize(18)}
          height={Mixins.scaleSize(18)}
        />
      );
    }
    return icon;
  };

  return (
    <TouchableOpacity
      onPress={() => {
        props.onDevicePress(props.item);
      }}
      testID="bluetoothDeviceItem"
      style={styles.listItemStyle}>
      <View>
        {getIcon(props.item.rssi)}
        <BluetoothDevice
          width={Mixins.scaleSize(20)}
          height={Mixins.scaleSize(20)}
        />
      </View>
      <View style={styles.deviceNameContainer}>
        <Text style={styles.deviceTitle}>
          {(props.item?.localName &&
            props.item?.localName.replace(/ *\([^)]*\) */g, '')) ||
            ''}
        </Text>
        {loading ? (
          <SkeletonPlaceholder>
            <Text style={styles.deviceSubHeadingShimmer}>{ }</Text>
          </SkeletonPlaceholder>
        ) : (
          <Text style={styles.deviceSubHeading}>
            {Utils.isMS700(props.item.deviceType)
              ? deviceType.ms700
              : Utils.isCZA1300(props.item.deviceType) ? deviceType.cza1300 : deviceType.infoView}
          </Text>
        )}
      </View>
      <TouchableOpacity
        hitSlop={styles.hitSlop}
        onPress={() => props.onIdentifyPress(props.item)}>
        <IdentifyIcon
          width={Mixins.scaleSize(32)}
          height={Mixins.scaleSize(32)}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default DeviceItem;
