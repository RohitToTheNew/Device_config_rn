import { useEffect } from 'react';

import Volumes from '../screens/volumes';
import {
  NetworkIconSelected,
  NetworkIconUnselected,
  SerialIconSelected,
  SerialIconUnselected,
  SettingsIconSelected,
  SettingsIconUnselected,
  VolumesIconSelected,
  VolumesIconUnselected,
} from '../config/imageConstants';
import Utils from '../utils';
import Serial from '../screens/serial';
import Network from '../screens/network';
import Settings from '../screens/settings';
import { Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Blemanager from '../config/bleManagerInstance';
import { translate } from '../translations/translationHelper';
import { readPoeOverride, updateAppModalFields } from '../services/app/action';
import DeviceType from '../config/deviceType';
import { Mixins, Typography, Colors } from '../config/styles';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const BottomTab = ({ navigation }) => {
  const { connectedDevice } = useSelector(state => state.authDevices);
  const { deviceType } = useSelector(state => state.app);
  const dispatch = useDispatch();
  useEffect(() => {
    let listener
    if (connectedDevice) {
      listener = Blemanager.onDeviceDisconnected(
        connectedDevice.id,
        response => {
          dispatch(updateAppModalFields('bleDisconnected', true));
          dispatch(updateAppModalFields('showDisconnectedModal', true));
        },
      );
    }
    if (Utils.isMS700(deviceType)) {
      dispatch(readPoeOverride())
    }
    return () => {
      if (connectedDevice) {
        listener.remove();
      }
    };
  }, []);

  return (
    <Tab.Navigator
      testID={'bottomTabComponent'}
      initialRouteName={'Volumes'}
      screenOptions={{
        keyboardHidesTabBar: true,
        tabBarStyle: styles.tabcontainer(false),
        activeTintColor: Colors.COLOR_003D7D,
        inactiveTintColor: Colors.COLOR_808284,
        headerShown: false,
        tabBarLabelPosition: 'below-icon',
      }}>
      {(Utils.isMS700(deviceType) || Utils.isCZA1300(deviceType)) && (
        <Tab.Screen
          name="Volumes"
          component={Volumes}
          options={({ route }) => ({
            tabBarLabel: ({ focused }) => {
              return (
                <Text style={styles.labelStyle(focused)}>
                  {translate('volumes')}
                </Text>
              );
            },
            unmountOnBlur: false,
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) =>
              focused ? (
                <VolumesIconSelected
                  height={Mixins.scaleSize(24)}
                  width={Mixins.scaleSize(24)}
                />
              ) : (
                <VolumesIconUnselected
                  height={Mixins.scaleSize(24)}
                  width={Mixins.scaleSize(24)}
                />
              ),
          })}
        />
      )}
      <Tab.Screen
        name="Network"
        component={Network}
        options={({ route }) => ({
          tabBarLabel: ({ focused }) => {
            return (
              <Text style={styles.labelStyle(focused)}>
                {translate('network')}
              </Text>
            );
          },
          unmountOnBlur: true,
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <NetworkIconSelected
                height={Mixins.scaleSize(24)}
                width={Mixins.scaleSize(24)}
              />
            ) : (
              <NetworkIconUnselected
                height={Mixins.scaleSize(24)}
                width={Mixins.scaleSize(24)}
              />
            ),
        })}
      />
      {(Utils.isMS700(deviceType) || Utils.isCZA1300(deviceType)) && (
        <Tab.Screen
          name="Serial"
          component={Serial}
          options={({ route }) => ({
            tabBarLabel: ({ focused }) => {
              return (
                <Text style={styles.labelStyle(focused)}>
                  {translate('serial')}
                </Text>
              );
            },
            unmountOnBlur: true,
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) =>
              focused ? (
                <SerialIconSelected
                  height={Mixins.scaleSize(24)}
                  width={Mixins.scaleSize(24)}
                />
              ) : (
                <SerialIconUnselected
                  height={Mixins.scaleSize(24)}
                  width={Mixins.scaleSize(24)}
                />
              ),
          })}
        />
      )}
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={({ route }) => ({
          tabBarLabel: ({ focused }) => {
            return (
              <Text style={styles.labelStyle(focused)}>
                {translate('settings')}
              </Text>
            );
          },
          unmountOnBlur: true,
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <SettingsIconSelected
                height={Mixins.scaleSize(24)}
                width={Mixins.scaleSize(24)}
              />
            ) : (
              <SettingsIconUnselected
                height={Mixins.scaleSize(24)}
                width={Mixins.scaleSize(24)}
              />
            ),
        })}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;

const styles = StyleSheet.create({
  tabcontainer: isFoldableDevice => ({
    height: Utils.isIOS
      ? Mixins.scaleSizeHeight(83)
      : Mixins.scaleSizeHeight(63),
    borderColor: Colors.COLOR_BCBABA,
    elevation: 8,
    zIndex: 999,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowColor: Colors.COLOR_000,
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  }),
  labelStyle: focused => ({
    fontSize: Utils.isIOS ? Typography.FONT_SIZE_12 : Typography.FONT_SIZE_10,
    alignItems: 'center',
    textAlign: 'center',
    fontFamily: focused
      ? Typography.FONT_FAMILY_BOLD
      : Typography.FONT_FAMILY_REGULAR,
    marginBottom: Utils.isIOS ? Mixins.scaleSize(8) : Mixins.scaleSize(14),
    color: focused ? Colors.COLOR_003D7D : Colors.COLOR_808284,
    fontWeight: focused ? '700' : '400',
  }),
});
