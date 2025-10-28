import {translate} from '../../translations/translationHelper';
import {Alert} from 'react-native';
import RNExitApp from 'react-native-exit-app';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import Utils from '../../utils';

const permissionToRequest = Utils.isIOS
  ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
  : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

export const showExitAlert = () => {
  Alert.alert(translate('locationPermission'), translate('appWontRunWithout'), [
    {
      text: 'Give permission',
      onPress: () => {
        request(permissionToRequest).then(result => {
          if (result === RESULTS.BLOCKED) {
            openSettings();
          }
        });
      },
    },
    {
      text: 'Exit',
      onPress: () => RNExitApp.exitApp(),
      style: 'cancel',
    },
  ]);
};

export const requestLocationPermission = async navigation => {
  try {
    const permissionRequestResult = await request(permissionToRequest);
    switch (permissionRequestResult) {
      case RESULTS.UNAVAILABLE:
        break;
      case RESULTS.DENIED:
        showExitAlert();
        break;
      case RESULTS.LIMITED:
        navigation.replace('TurnOnBluetooth');
        break;
      case RESULTS.GRANTED:
        navigation.replace('TurnOnBluetooth');
        break;
      case RESULTS.BLOCKED:
        showExitAlert();
        break;
      default:
        showExitAlert();
        break;
    }
  } catch (error) {
    Utils.Log(
      Utils.logType.error,
      'error in requestLocationPermission fn',
      error,
    );
  }
};

export const checkLocationPermission = navigation => {
  check(permissionToRequest)
    .then(result => {
      switch (result) {
        case RESULTS.DENIED:
          requestLocationPermission(navigation);
          break;
        case RESULTS.GRANTED:
          navigation.replace('TurnOnBluetooth');
          break;
        default:
          requestLocationPermission(navigation);
          break;
      }
    })
    .catch(error => {
      Utils.Log(Utils.logType.error, 'checkLocationPermission', error);
    });
};
