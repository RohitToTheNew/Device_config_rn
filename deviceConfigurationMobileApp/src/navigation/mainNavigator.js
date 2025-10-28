import React, {useEffect} from 'react';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AppState} from 'react-native';

import BottomTab from './bottomTab';
import Splash from '../screens/splash';
import {useDispatch, useSelector} from 'react-redux';
import SetPasscode from '../screens/setPasscode';
import Blemanager from '../config/bleManagerInstance';
import TurnOnBluetooth from '../screens/turnOnBluetooth';
import {updateAppModalFields} from '../services/app/action';
import BluetoothDevicesList from '../screens/bluetoothDevicesList';
import CodeScanner from '../screens/scanner/index';
import AddDevice from '../screens/addDevice';
import ManageSchool from '../screens/manageSchool';
import SchoolDevices from '../screens/schoolDeviceList';
import UpdateDevices from '../screens/updateDevice';
import Network from '../screens/network';

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        options={{headerShown: false}}
        name="Splash"
        component={Splash}
      />
      <Stack.Screen
        options={{headerShown: false, gestureEnabled: false}}
        name="TurnOnBluetooth"
        component={TurnOnBluetooth}
      />
      <Stack.Screen
        options={{headerShown: false, gestureEnabled: false}}
        name="BluetoothDevicesList"
        component={BluetoothDevicesList}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="SetPasscode"
        component={SetPasscode}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Network"
        component={Network}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="CodeScanner"
        component={CodeScanner}
      />
      <Stack.Screen
        options={{headerShown: false, gestureEnabled: false}}
        name="addDevice"
        component={AddDevice}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="HomeScreen"
        component={BottomTab}
      />
       <Stack.Screen
        options={{headerShown: false}}
        name="manageSchool"
        component={ManageSchool}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="schoolDevicesList"
        component={SchoolDevices}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="updateDevice"
        component={UpdateDevices}
      />
    </Stack.Navigator>
  );
};

export const navigationRef = createNavigationContainerRef();
const MainNavigator = props => {
  let bluetoothStateListener;
  const dispatch = useDispatch();
  const {appState} = useSelector(state => state.app);
  useEffect(() => {
    Blemanager.state().then(result =>
      dispatch(updateAppModalFields('bluetoothState', result)),
    );
    bluetoothStateListener = Blemanager.onStateChange(state => {
      if (state !== 'Resetting') {
        dispatch(updateAppModalFields('bluetoothState', state));
      }
    });
    return () => {
      bluetoothStateListener.remove();
    };
  }, [appState]);

  useEffect(() => {
    dispatch(updateAppModalFields('appState', 'active'));
    const subscription = AppState.addEventListener('change', nextAppState => {
      dispatch(updateAppModalFields('appState', nextAppState));
    });
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {}}
      onStateChange={async (state) => {
        dispatch(updateAppModalFields('routeName', navigationRef.getCurrentRoute().name))
      }}>
      <AppStack />
    </NavigationContainer>
  );
};

export default MainNavigator;
