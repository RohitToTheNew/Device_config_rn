import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

import styles from './styles';
import { Mixins } from '../../config/styles';
import { SliderComponent } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import { VolumeOff, VolumeOn } from '../../config/imageConstants';
import {
  getOutputSettingsValues,
  toggleMuteOutputSettings,
  writeOutputVolumeSettings,
} from '../../services/volumes/action';
import { updateAppModalFields } from '../../services/app/action';

export default function Output() {
  const { outputVolumeSettings } = useSelector(state => state.volume);
  const { bleDisconnected, bluetoothState } = useSelector(state => state.app);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!bleDisconnected) {
      dispatch(getOutputSettingsValues());
    }
  }, []);

  const renderSliderComponent = rowData => {
    /**
     * function to handle the value received after sliding complete on volume settings sliders
     * @param {string} value 
     */
    const onValueChange = value => {
      if (!bleDisconnected && bluetoothState === 'PoweredOn') {
        dispatch(writeOutputVolumeSettings(rowData, value));
      } else if (bleDisconnected) {
        dispatch(updateAppModalFields('showDisconnectedModal', true));
      }
    };

    /**
     * function to handle the mute/ unmute CTA button
     */
    const onToggleMute = () => {
      if (!bleDisconnected && bluetoothState === 'PoweredOn') {
        dispatch(toggleMuteOutputSettings(rowData));
      } else if (bleDisconnected) {
        dispatch(updateAppModalFields('showDisconnectedModal', true));
      }
    };

    return (
      <View style={styles.sliderComponentContainer}>
        <View style={styles.sliderHeaderContainer}>
          <Text style={styles.sliderHeaderText}>
            {rowData.item.settingName}
          </Text>
          <TouchableOpacity
            testID={`toggleMuteButton${rowData.index}`}
            style={styles.muteButton}
            hitSlop={styles.hitSlop}
            onPress={onToggleMute}>
            {rowData.item.isMuted ? (
              <VolumeOff
                width={Mixins.scaleSize(20)}
                height={Mixins.scaleSize(20)}
              />
            ) : (
              <VolumeOn
                width={Mixins.scaleSize(20)}
                height={Mixins.scaleSize(20)}
              />
            )}
          </TouchableOpacity>
        </View>
        <SliderComponent
          testID={`sliderComponent${rowData.index}`}
          minValue={-79}
          maxValue={16}
          isDisabled={rowData.item.isDisabled || rowData.item.isMuted}
          value={rowData.item.value}
          onValueChange={onValueChange}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        testID="outputVolumeSettingsList"
        style={styles.flatlistStyle}
        contentContainerStyle={styles.contentContainerStyle}
        showsVerticalScrollIndicator={false}
        data={outputVolumeSettings}
        renderItem={renderSliderComponent}
      />
    </View>
  );
}
