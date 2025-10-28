const identifire = 'scanner-action log: ';
import { check, request, RESULTS, PERMISSIONS } from 'react-native-permissions';
import { RNCamera } from 'react-native-camera';
import utils from '../../utils';
import { translate } from '../../translations/translationHelper';
import RNFS from 'react-native-fs';

/**
 * On click Enter details manually and redirect user to Add device screen
 * @param {object} navigation it represents navigation object
 * @returns object
 */
function actionHandleManualDetails(navigation) {
  return () => {
    navigation.navigate('addDevice');
  };
}

/**
 * function to read local file data from storage
 * @returns file details read from storage
 */
const readFileFromLocalStorage = async () => {
  let result = RNFS.readFile(RNFS.DocumentDirectoryPath + '/test.txt', 'utf8');
  return result;
};

/**
 * function to check if the device details encoded into the QR code is having valid keys
 * @param {object} obj object containing the scanned data from QR code
 * @returns boolean indicating weather details are valid or not
 */
const isValidObject = (obj) =>
  obj?.serialNumber && obj?.serialNumber !== '' &&
  obj?.macAddress && obj?.macAddress !== '' &&
  obj?.deviceType && obj?.deviceType !== '';

/**
 * function to check if the device details encoded into the QR code is having valid keys
 * @param {object} obj object containing the scanned data from QR code
 * @returns boolean indicating weather details are valid or not
 */
const isValidDetails = (obj) =>
  obj?.serial && obj?.serial !== '' &&
  obj?.mac && obj?.mac !== '' &&
  obj?.device && obj?.device !== '';

/**
 * On successful scan
 * @param {object} navigation it represents navigation object
 * @param {function} setInvalidCode used to set invalid code boolean value
 * @param {object} e contains scan result
 */
function actionOnSuccess(navigation, setInvalidCode, e) {
  const typeToCheck = utils.isIOS ? 'org.iso.QRCode' : "QR_CODE"
  if (e.type === typeToCheck) {
    try {
      const scannedString = JSON.parse(e?.data);
      console.log('scanned string', scannedString)
      if (isValidObject(scannedString) || isValidDetails(scannedString)) {
        navigation.replace('addDevice', {
          mac: scannedString?.macAddress || scannedString?.mac,
          serialNumber: scannedString?.serialNumber || scannedString?.serial,
          deviceType: scannedString?.deviceType || scannedString?.device,
        });
      } else {
        setInvalidCode(true);
      }
    } catch (e) {
      setInvalidCode(true);
    }
  } else {
    setInvalidCode(true);
  }
}

/**
 * Click on close icon
 * @param {object} navigation it represents navigation object
 * @returns object
 */
function actionHandleClose(navigation) {
  return () => {
    navigation.goBack();
  };
}

/**
 * Click on flash icon
 * @param {boolean} isFlashOn used to identify if flash is on/off
 * @param {function} setFlash used to set flash on/off value
 * @param {function} setIsFlashOn used to set flash on value
 * @returns object
 */
function actionHandleFlash(isFlashOn, setFlash, setIsFlashOn) {
  return () => {
    if (isFlashOn) {
      setFlash(RNCamera.Constants.FlashMode.off);
      setIsFlashOn(false);
    } else {
      setFlash(RNCamera.Constants.FlashMode.torch);
      setIsFlashOn(true);
    }
  };
}

/**
 * To ask camera permission
 * @returns camera permission
 */
async function actionUseEffect() {

  try {
    const result = await check(PERMISSIONS.IOS.CAMERA);
    if (result !== RESULTS.GRANTED) {
      const askCameraPermission = await request(PERMISSIONS.IOS.CAMERA);
      return askCameraPermission;
    } else {
      utils.Log(utils.logType.log, identifire, 'Camera permisson granted');
    }
  } catch (Ex) {
    utils.showToast(translate('error'), translate('permissionsException'));
  }
}
export {
  actionHandleManualDetails,
  actionOnSuccess,
  actionHandleClose,
  actionUseEffect,
  actionHandleFlash,
};
