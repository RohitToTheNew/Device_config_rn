const identifire = 'manage-school-log: ';
import { Alert } from 'react-native';
import RNFS from 'react-native-fs';
import Mailer from 'react-native-mail';
import Utils from '../../utils';
import { translate } from '../../translations/translationHelper';

/**
 * function to get saved Schools data from local storage
 */
function getSavedData() {
  const result = RNFS.readFile(RNFS.DocumentDirectoryPath + '/test.txt', 'utf8');
  return result;
}

/**
 * function for formatting the rooms data to desired CSV format
 * @param {object} parms object containing the data of rooms
 * @returns formatted CSV data
 */
function getDataInDesiredFormate(parms) {
  let CSVData = [];
  parms.forEach(room => {
    for (const key in room) {
      if (key === 'devices') {
        room[key].forEach(roomData => {
          let obj = {};
          obj.driverName = roomData.deviceType;
          obj.deviceName = roomData.deviceName;
          obj.ip = roomData.ipAddress || '';
          obj.mac = roomData.macAddress;
          obj.roomName = room['title'];
          CSVData.push(obj);
        });
      }
    }
  });
  return CSVData;
}

/**
 * function to save schools list to local storage
 * @param {object} schools object containing schools list
 * @returns 
 */
const writeDataTolocalStorage = async schools => {
  const data = JSON.stringify(schools);
  const path = RNFS.DocumentDirectoryPath + '/test.txt';
  try {
    await RNFS.writeFile(path, data, 'utf8');
    return `FILE WRITTEN!`;
  } catch (err) {
    Utils.Log(Utils.logType.error, 'error in writeDataTolocalStorage', err)
    return `Error while writing`;
  }
};

/**
 * function to write schools data to local storage
 * @param {object} schools object containing data of schools
 * @param {string} fileName name of file containing data of schools
 * @returns error(if any) during wiriting to local storage OR success message if writing is successful
 */

const writeCSVDataTolocalStorage = async (schools, fileName) => {
  const resultCSV = convertToCSV(schools);
  const pathToWrite = `${RNFS.DocumentDirectoryPath}/${fileName}.csv`;
  try {
    await RNFS.writeFile(pathToWrite, resultCSV, 'utf8');
    return `FILE WRITTEN!`;
  } catch (err) {
    Utils.showToast(translate('errorWhileWriting.'));
    return `Error while writing`;
  }
};
/**
 * function to attach generated CSV in email and open email client
 * @param {string} fileName name of file containing data of schools
 */
function sendCSVAsMail(schoolName, fileName) {
  try {
    Mailer.mail(
      {
        subject: `${schoolName} Devices`,
        isHTML: true,
        attachments: [
          {
            type: 'csv',
            path: `${RNFS.DocumentDirectoryPath}/${fileName}.csv`, // The absolute path of the file from which to read data.
          },
        ],
      },

      (error, event) => {
        Alert.alert(
          error,
          event,
          [
            {
              text: 'Ok',
              onPress: () => { },
            },
            {
              text: 'Cancel',
              onPress: () => { },
            },
          ],
          { cancelable: true },
        );
      },
    );
  } catch (error) {
    Utils.Log(Utils.logType.error, 'error in sendCSVAsMail', error);
  }
}

/**
 * function to handle the 'Export CSV' action for school
 * @param {object} parms object containig data of school
 */
async function handleExportCSV(parms) {
  try {
    const schoolName = parms?.schoolTitle;

    let month = new Date().getMonth() + 1;
    let date = new Date().getDate();
    const year = new Date().getFullYear();

    if (date < 10) date = '0' + date;
    if (month < 10) month = '0' + month;

    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    const second = new Date().getSeconds();

    const currentDate = `${month}-${date}-${year}`;
    const currentTime = `${hour}H${minute}M${second}S`;

    const fileName = `${schoolName}_Devices_${currentDate}_${currentTime}`
      .toString()
      .trim();
    const CSVData = getDataInDesiredFormate(parms?.rooms);
    await writeCSVDataTolocalStorage(CSVData, fileName);
    sendCSVAsMail(schoolName, fileName);
  } catch (error) {
    Utils.Log(Utils.logType.error, 'handleExportCSV', error);
  }
}

/**
 * function to convert the object data to desired CSV format
 * @param {object} arr array of rooms details
 * @returns
 */
function convertToCSV(arr) {
  const array = [Object.keys(arr[0])].concat(arr);
  return array
    .map(it => {
      return Object.values(it).toString();
    })
    .join('\n');
}

/**
 * function to show alert when delete button is pressed
 * @param {string} schoolTitle title of school
 * @param {string} schoolId school id
 * @param {function} setSchoolTitle function to set school title
 * @param {function} setSchoolId function to set school id
 * @param {function} setPopupToDeleteDevice function to set popup to show
 */
function deleteSchoolAlert(
  schoolTitle,
  schoolId,
  setSchoolTitle,
  setSchoolId,
  setPopupToDeleteDevice,
) {
  setSchoolTitle(schoolTitle);
  setSchoolId(schoolId);
  setPopupToDeleteDevice(true);
}

/**
 * function to delete school
 * @param {string} schoolID school id
 * @param {object} savedData object containing saved schools data
 * @param {function} setSavedData function to set saved schools data after change
 * @param {*} setPopupToDeleteDevice function to set popup to hide
 */
async function deleteSchool(
  schoolID,
  savedData,
  setSavedData,
  setPopupToDeleteDevice,
) {
  try {
    const filteredData = savedData.filter(school => school?.id !== schoolID);
    await writeDataTolocalStorage(filteredData);
    setSavedData(filteredData);
    setPopupToDeleteDevice(false);
  } catch (error) {
    Utils.Log(Utils.logType.error, 'deleteSchool', error);
  }
}
export {
  getSavedData,
  getDataInDesiredFormate,
  writeCSVDataTolocalStorage,
  sendCSVAsMail,
  handleExportCSV,
  deleteSchoolAlert,
  deleteSchool,
  writeDataTolocalStorage,
};
