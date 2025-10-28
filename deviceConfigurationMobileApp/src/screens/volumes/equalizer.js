import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { Mixins } from '../../config/styles';
import styles from './styles';
import { SliderComponent } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import { Checkmark } from '../../config/imageConstants';
import {
  changeSpeakerImpedence,
  geteqSettingsValues,
  getNoiseSuppressionSettings,
  getSpeakerImpedence,
  toggleBypassEQSetting,
  toggleNoiseSuppressionSetting,
  updateNoiseSuppressionThreshold,
  updateVolumeSettingsFields,
  writeeqSettingsValues,
} from '../../services/volumes/action';
import { translate } from '../../translations/translationHelper';
import { updateAppModalFields } from '../../services/app/action';

export default function Equalizer() {
  const dispatch = useDispatch();
  const { eqVolumeSettings, bypassEQ, noiseSuppressionEnabled, noiseSuppressionThreshold, speakerImpedence } = useSelector(state => state.volume);
  const { bleDisconnected, bluetoothState } = useSelector(state => state.app);

  useEffect(() => {
    if (!bleDisconnected) {
      dispatch(geteqSettingsValues());
      dispatch(getNoiseSuppressionSettings())
      dispatch(getSpeakerImpedence())
    }
  }, []);

  /**
   * function to handle the ByPass EQ CTA button
   */
  const handleByPassEQ = () => {
    if (!bleDisconnected && bluetoothState === 'PoweredOn') {
      dispatch(
        toggleBypassEQSetting(() => {
          dispatch(updateVolumeSettingsFields('bypassEQ', !bypassEQ));
        }),
      );
    } else if (bleDisconnected) {
      dispatch(updateAppModalFields('showDisconnectedModal', true));
    }
  };

  const renderSliderComponent = rowData => {
    /**
     * function to handle the value received after sliding complete on volume settings sliders
     * @param {string} value
     */
    const onValueChange = value => {
      if (!bleDisconnected && bluetoothState === 'PoweredOn') {
        dispatch(writeeqSettingsValues(rowData, value));
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
          <Text>{rowData.item.maxValue}</Text>
        </View>
        <SliderComponent
          minValue={-10}
          maxValue={10}
          bypassEQ={!bypassEQ}
          isDisabled={
            rowData.item.isDisabled || rowData.item.isMuted || !bypassEQ
          }
          sliderStyle={styles.sliderStyle(bypassEQ)}
          value={rowData.item.value}
          onValueChange={onValueChange}
        />
      </View>
    );
  };

  /**
   * callback function that is executed when slider is changed
   * @param {array} value array with a single value at 0th position
   */
  const onNoiseSuppressionValueChange = value => {
    dispatch(updateNoiseSuppressionThreshold(value[0]))
  };

  /**
   * function to change the noise suppression checkbox value
   */
  const handleNoiseSuppressionToggle = () => {
    dispatch(toggleNoiseSuppressionSetting(() => { }))
  };

  /**
   * function to handle the speaker impedence value change
   * @param {string} value speaker impedence value selected on the radio button 
   */
  const onSpeakerImpedenceChange = (value) => {
    dispatch(changeSpeakerImpedence(value))
  }

  const renderNoiseSuppressionButtons = () => {
    return (
      <View>
        <View style={styles.bypassHeader}>
          <Text style={styles.byPassTitle}>{translate('automaticNoise')}</Text>
          <TouchableOpacity
            onPress={handleNoiseSuppressionToggle}
            style={styles.checkmarkContainer(noiseSuppressionEnabled)}>
            {!noiseSuppressionEnabled && (
              <Checkmark
                width={Mixins.scaleSize(8.9)}
                height={Mixins.scaleSize(6.1)}
              />
            )}
          </TouchableOpacity>
        </View>
        <View>
          <SliderComponent
            minValue={-79}
            maxValue={16}
            isDisabled={!noiseSuppressionEnabled}
            sliderStyle={styles.sliderStyle(noiseSuppressionEnabled)}
            value={noiseSuppressionThreshold}
            onValueChange={onNoiseSuppressionValueChange}
          />
        </View>
      </View>
    );
  };

  const renderImpedenceSettings = () => {
    return (
      <View style={styles.noiseSuppressionHeader}>
        <Text style={styles.sliderHeaderText}>
          {translate('nominalSpeakerImpedance')}
        </Text>
        <View style={styles.radioButtonContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onSpeakerImpedenceChange('2')}>
            <View
              style={[
                styles.buttonContainer,
                { marginEnd: Mixins.scaleSize(40) },
              ]}>
              <View style={styles.outerCircle}>
                <View style={styles.innerCircle(speakerImpedence == '2')} />
              </View>
              <Text style={styles.textStyle(speakerImpedence == '2')}>
                2 {translate('ohm')}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onSpeakerImpedenceChange('4')}>
            <View
              style={[
                styles.buttonContainer,
                { marginEnd: Mixins.scaleSize(40) },
              ]}>
              <View style={styles.outerCircle}>
                <View style={styles.innerCircle(speakerImpedence == '4')} />
              </View>
              <Text style={styles.textStyle(speakerImpedence == '4')}>
                4 {translate('ohm')}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onSpeakerImpedenceChange('8')}>
            <View
              style={[
                styles.buttonContainer,
                { marginEnd: Mixins.scaleSize(40) },
              ]}>
              <View style={styles.outerCircle}>
                <View style={styles.innerCircle(speakerImpedence == '8')} />
              </View>
              <Text style={styles.textStyle(speakerImpedence == '8')}>
                8 {translate('ohm')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainerStyle} >
      <View style={styles.bypassHeader}>
        <Text style={styles.byPassTitle}>{translate('bypassEqualizer')}</Text>
        <TouchableOpacity
          onPress={handleByPassEQ}
          style={styles.checkmarkContainer(bypassEQ)}>
          {!bypassEQ && (
            <Checkmark
              width={Mixins.scaleSize(8.9)}
              height={Mixins.scaleSize(6.1)}
            />
          )}
        </TouchableOpacity>
      </View>
      <FlatList
        testID="equalizerVolumeSettingsList"
        style={styles.flatlistStyle}
        contentContainerStyle={styles.contentContainerStyle}
        showsVerticalScrollIndicator={false}
        data={eqVolumeSettings}
        renderItem={renderSliderComponent}
      />
      {renderNoiseSuppressionButtons()}
      {renderImpedenceSettings()}
    </ScrollView>
  );
}
