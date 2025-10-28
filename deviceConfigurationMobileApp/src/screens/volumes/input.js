import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

import styles from './styles';
import { Mixins } from '../../config/styles';
import { SliderComponent } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import { VolumeOff, VolumeOn } from '../../config/imageConstants';
import {
  getInputSettingsValues,
  toggleMuteSettings,
  writeInputValueSettings,
} from '../../services/volumes/action';
import { updateAppModalFields } from '../../services/app/action';

export default function Input() {
  const dispatch = useDispatch();
  const { inputVolumeSettings } = useSelector(state => state.volume);
  const { bleDisconnected, bluetoothState, isLoading } = useSelector(
    state => state.app,
  );

  useEffect(() => {
    dispatch(updateAppModalFields('isLoading', true));
    dispatch(
      getInputSettingsValues(() => {
        setTimeout(() => {
          dispatch(updateAppModalFields('isLoading', false));
        }, 2000);
      }),
    );
  }, []);

  const renderSliderComponent = rowData => {
    /**
     * function to handle the value received after sliding complete on volume settings sliders
     * @param {string} value
     */
    const onValueChange = value => {
      if (!bleDisconnected && bluetoothState === 'PoweredOn') {
        dispatch(writeInputValueSettings(rowData, value));
      } else if (bleDisconnected) {
        dispatch(updateAppModalFields('showDisconnectedModal', true));
      }
    };

    /**
     * function to handle the mute/ unmute CTA button
     */
    const onToggleMute = () => {
      if (!bleDisconnected && bluetoothState === 'PoweredOn') {
        dispatch(toggleMuteSettings(rowData));
      } else if (bleDisconnected) {
        dispatch(updateAppModalFields('showDisconnectedModal', true));
      }
    };

    return (
      <View key={rowData.index} style={styles.sliderComponentContainer}>
        <View style={styles.sliderHeaderContainer}>
          <Text style={styles.sliderHeaderText}>
            {rowData.item.settingName}
          </Text>
          <TouchableOpacity
            testID={`toggleMuteButton${rowData.index}`}
            style={{ paddingHorizontal: Mixins.scaleSize(10) }}
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
      {!isLoading && (
        <FlatList
          style={{ marginTop: Mixins.scaleSize(10) }}
          testID={'inputVolumeSettingsList'}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          data={inputVolumeSettings}
          renderItem={renderSliderComponent}
        />
      )}
    </View>
  );
}
