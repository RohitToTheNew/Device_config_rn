jest.mock('react-native-ble-plx', () => {
  return {
    BleError: {
      CharacteristicReadFailed: 'CharacteristicReadFailed',
      CharacteristicWriteFailed: 'CharacteristicWriteFailed',
      DeviceDisconnected: 'DeviceDisconnected',
      OperationCancelled: 'OperationCancelled',
      ConnectionFailed: 'ConnectionFailed',
    },
    State: {
      PoweredOn: 'PoweredOn',
      PoweredOff: 'PoweredOff',
      Resetting: 'Resetting',
      Unauthorized: 'Unauthorized',
      Unsupported: 'Unsupported',
      Unknown: 'Unknown',
    },
    BleManager: class BleManager {
      constructor(returnDevices) {
        this.returnDevices = returnDevices;
      }
      startDeviceScan(UUId, scanConfig, callback) {
        if (this.returnDevices) {
          callback({ deviceName: 'Brx-test-data', isConnectable: false });
        } else {
          callback({ message: 'No devices found' });
        }
      }
      stopDeviceScan() {
        return jest.fn();
      }
      isDeviceConnected(deviceId) {
        return true;
      }
      cancelDeviceConnection(deviceId) {
        return true;
      }
      connectToDevice() {
        jest.fn((_, resolveTo) => new Promise(resolve => resolve(true)));
      }
      discoverAllServicesAndCharacteristics() {
        return [{}, {}, {}];
      }
      services() {
        return [
          {
            id: 10738841728,
            deviceID: 'BDCB6EA5-D458-DD27-E14E-169930912022',
            isPrimary: true,
            uuid: '0000180a-0000-1000-8000-00805f9b34fb',
          },
          {
            id: 10738841664,
            deviceID: 'BDCB6EA5-D458-DD27-E14E-169930912022',
            isPrimary: true,
            uuid: '00000000-0000-1000-8000-0242ac120002',
          },
        ];
      }
      characteristics() {
        jest.fn();
      }
      enable() {
        jest.fn();
      }
      writeCharacteristicWithResponseForDevice() {
        return Promise.resolve(true);
      }
      readCharacteristicForDevice() {
        return Promise.resolve({ value: 'MjA=' });
      }
    },
  };
});
