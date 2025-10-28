import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';

import styles from './styles';
import { Mixins } from '../../config/styles';
import { SchoolIconHeader } from '../../config/imageConstants';
import { useDispatch, useSelector } from 'react-redux';
import { readFileFromLocalStorage } from '../../screens/addDevice/action';
import { updateAppModalFields } from '../../services/app/action';
import Utils from '../../utils';
import { useIsFocused } from '@react-navigation/native';

const ManageSchoolHeaderButton = props => {
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
   * function to navigate to Manage Schools Screen when pressed
   */
  const onManageSchoolPress = () => {
    navigation.push('manageSchool');
  };

  return (
    <>
      {showManageSchool && (
        <TouchableOpacity
          onPress={onManageSchoolPress}
          style={[styles.containerStyle, extraStyles]}>
          <SchoolIconHeader
            width={Mixins.scaleSize(24)}
            height={Mixins.scaleSize(24)}
          />
        </TouchableOpacity>
      )}
    </>
  );
};

export default ManageSchoolHeaderButton;