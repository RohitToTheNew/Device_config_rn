// import Cryptr from 'react-native-cryptr';
import base64 from 'react-native-base64';
import {Dimensions, Platform} from 'react-native';
import {isTablet, getDeviceId} from 'react-native-device-info';
import Toast from 'react-native-toast-message';
import {sentryErrorHandler} from '../utils/errorHandler';
import { translate } from '../translations/translationHelper';

const foldableDevice = () => {
  let deviceWidth = Dimensions.get('screen').width,
    deviceHeight = Dimensions.get('screen').height,
    isTablet = false;
  if (deviceHeight / deviceWidth < 1.6) {
    isTablet = true;
  } else {
    isTablet = false;
  }
  return isTablet;
};

const isAndroid = Platform.OS === 'android';

const isIOS = Platform.OS === 'ios';

const isIpad = Platform.isPad;

const tablet = isTablet();

const isIphone8 = (deviceId = getDeviceId()) => {
  return deviceId === 'iPhone10,1' || deviceId === 'iPhone10,4';
};

const logType = {
  log: 'log',
  error: 'error',
};

const Log = (
  type = logType.log,
  message = translate('somethingWentWrong'),
  value,
) => {
  type === logType.log
    ? console.log(message, value)
    : (console.error(message, value), sentryErrorHandler(value));
};
const isFoldableDevice = foldableDevice();

const timeoutDuration = 20000;

const capitalizeText = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const IsJsonString = str => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

const splitJoin = string => {
  return string.split('.').join('');
};

const hexToBytes = hex => {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
};

const decodeBase64 = (base64Value = '') => {
  return base64.decode(base64Value);
};

const encodeBase64 = (base64Value = '') => {
  return base64.encode(base64Value);
};

const encodeToBytesArray = string => {
  return string.split('').map(e => e.charCodeAt());
};

const encodeToHex = string => {
  return string
    .split('')
    .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
};
// const cryptr = new Cryptr('secretKey');

const encrypt = string => {
  return string;
  // return cryptr.encrypt(string);
};

const decrypt = string => {
  return string;
  // return cryptr.decrypt(string);
};
const showToast = (
  message = translate('actionRequired'),
  message2,
  type = 'error',
) => {
  Toast.show({
    type: type,
    text1: message,
    text2: message2,
    position: 'bottom',
    visibilityTime: 3000,
    autoHide: true,
  });
};

const validateIP = ip => {
  if (
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      ip,
    )
  ) {
    return true;
  }
  return false;
};

const isInfoView = device => {
  const lowerCaseDevice = device && device.replace(/[^\w\s]/gi, '').toLocaleLowerCase();
  return lowerCaseDevice && lowerCaseDevice.includes('infoview');
};

const isMS700 = device => {
  const lowerCaseDevice = device && device.replace(/[^\w\s]/gi, '').toLocaleLowerCase();
  return lowerCaseDevice && lowerCaseDevice.includes('ms700');
};

const isCZA1300  = device => {
  const lowerCaseDevice = device && device.replace(/[^\w\s]/gi, '').toLocaleLowerCase();
  return lowerCaseDevice && lowerCaseDevice.includes('cza');
}

const stringArrayToByteArray = array => {
  const encoder = new TextEncoder();
  return encoder.encode(array.join(''));
};

export default {
  Log,
  isIOS,
  isIpad,
  tablet,
  encrypt,
  decrypt,
  logType,
  isAndroid,
  showToast,
  isIphone8,
  splitJoin,
  validateIP,
  hexToBytes,
  encodeToHex,
  IsJsonString,
  decodeBase64,
  encodeBase64,
  capitalizeText,
  timeoutDuration,
  foldableDevice,
  encodeToBytesArray,
  isFoldableDevice,
  encodeToBytesArray,
  isInfoView,
  isMS700,
  stringArrayToByteArray,
  isCZA1300
};
