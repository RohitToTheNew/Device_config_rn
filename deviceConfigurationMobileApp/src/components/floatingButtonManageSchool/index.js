import React, { useEffect } from 'react';
import { Alert, Text, Animated, TouchableOpacity } from 'react-native';

import styles from './styles';
import { Mixins } from '../../config/styles';
import { SchoolIcon } from '../../config/imageConstants';
import { translate } from '../../translations/translationHelper';
import { useDispatch, useSelector } from 'react-redux';
import { readFileFromLocalStorage } from '../../screens/addDevice/action';
import { updateAppModalFields } from '../../services/app/action';
import Utils from '../../utils';
import { useIsFocused } from '@react-navigation/native';
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const ManageSchool = props => {
  const { extraStyles, navigation } = props;
  const { showManageSchool } = useSelector(state => state.app);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await readFileFromLocalStorage();
        const parsedData = JSON.parse(result);
        if (parsedData.length > 0) {
          dispatch(updateAppModalFields('showManageSchool', true));
        } else {
          dispatch(updateAppModalFields('showManageSchool', false));
        }
      } catch (error) {
        Utils.Log(Utils.logType.error, 'error', error);
      }
    }
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  /**
   * function to handle the manage school button press
   */
  const onManageSchoolPress = () => {
    navigation.push('manageSchool');
  };

  return (
    <>
      {showManageSchool && (
        <AnimatedTouchable
          testID="manageSchoolButton"
          onPress={onManageSchoolPress}
          style={[styles.containerStyle, extraStyles]}>
          <SchoolIcon
            width={Mixins.scaleSize(24)}
            height={Mixins.scaleSize(24)}
          />
          <Text style={styles.manageSchoolText}>
            {translate('manageSchools')}
          </Text>
        </AnimatedTouchable>
      )}
    </>
  );
};

export default ManageSchool;