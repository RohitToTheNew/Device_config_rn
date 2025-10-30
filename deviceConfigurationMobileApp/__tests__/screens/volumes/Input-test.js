import React from 'react';
import {Provider} from 'react-redux';
import renderer from 'react-test-renderer';
import {createTestStore} from '../../utilityFunction';
import Input from '../../../src/screens/volumes/input';
import {store} from '../../../src/store/configureStore';
import {render, screen} from '@testing-library/react-native';
import BleManager from '../../../src/config/bleManagerInstance';
import {updateAuthDevices} from '../../../src/services/authDevices/action';
import {
  getInputSettingsValues,
  writeInputValueSettings,
  toggleMuteSettings,
} from '../../../src/services/volumes/action';
import {UUIDMappingMS700} from '../../../src/constants';
import base64 from 'react-native-base64';
import Toast from 'react-native-toast-message';

describe('on Input screen mounting', () => {
  let tree;
  beforeEach(() => {
    tree = renderer.create(<Input />).toJSON();
  });

  it('renders Input screen correctly', () => {
    expect(tree).toMatchSnapshot();
  });
});

describe('Input volumes settings', () => {
  let component, myStore;
  beforeEach(() => {
    myStore = createTestStore();
    component = (
      <Provider store={myStore}>
        <Input />
      </Provider>
    );
    render(component);
  });
  it('should render input settings list', () => {
    expect(screen.getByTestId('inputVolumeSettingsList')).toBeTruthy();
  });
});

describe('getInputSettingsValues function', () => {
  let component, readSpy;
  beforeEach(() => {
    component = (
      <Provider store={store}>
        <Input />
      </Provider>
    );
    render(component);
  });
  beforeAll(async () => {
    store.dispatch(
      updateAuthDevices('connectedDevice', {id: 1, localName: 'Brx-emulator'}),
    );
    readSpy = jest.spyOn(BleManager, 'readCharacteristicForDevice');
  });
  it('should fetch input settings from BLE', async () => {
    await store.dispatch(getInputSettingsValues());
    expect(readSpy).toBeCalledWith(
      1,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.classroomMicrophone,
    );
    expect(readSpy).toBeCalledWith(
      1,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.muteClassroomMicrophone,
    );
  });
});

describe('writeInputValueSettings function', () => {
  let component, writeSpy, rowData;
  beforeEach(() => {
    component = (
      <Provider store={store}>
        <Input />
      </Provider>
    );
    render(component);
  });
  beforeAll(async () => {
    store.dispatch(
      updateAuthDevices('connectedDevice', {id: 1, localName: 'Brx-emulator'}),
    );
    rowData = {
      index: 0,
      item: {id: 1, charactersticId: UUIDMappingMS700.classroomMicrophone},
    };
    writeSpy = jest.spyOn(
      BleManager,
      'writeCharacteristicWithResponseForDevice',
    );
    jest.spyOn(base64, 'encode').mockImplementation(() => {
      return 30;
    });
  });
  it('should update input settings values on the BLE', async () => {
    await store.dispatch(writeInputValueSettings(rowData, [30]));
    expect(writeSpy).toBeCalledWith(
      1,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.classroomMicrophone,
      30,
    );
  });
});

describe('writeInputValueSettings function with error in writing values on BLE', () => {
  let component, toastSpy, rowData;
  beforeEach(() => {
    component = (
      <Provider store={store}>
        <Input />
      </Provider>
    );
    render(component);
  });
  beforeAll(async () => {
    store.dispatch(updateAuthDevices('connectedDevice', {}));
    rowData = {
      index: 0,
      item: {id: 1, charactersticId: UUIDMappingMS700.classroomMicrophone},
    };
    jest
      .spyOn(BleManager, 'writeCharacteristicWithResponseForDevice')
      .mockImplementation(() => {
        throw new Error('cannot write values because BLE is shutdown.');
      });
    toastSpy = jest.spyOn(Toast, 'show');
  });
  it('should get error from BLE when writing input settings on BLE', async () => {
    await store.dispatch(writeInputValueSettings(rowData, [30]));
    expect(toastSpy).toBeCalled();
  });
});

describe('toggleMuteSettings function', () => {
  let spy, rowData;
  beforeAll(() => {
    spy = jest.spyOn(BleManager, 'writeCharacteristicWithResponseForDevice');
    rowData = {
      index: 0,
      item: {id: 1, muteCharacter: UUIDMappingMS700.muteClassroomMicrophone},
    };
  });
  jest.spyOn(base64, 'encode').mockImplementation(() => {
    return 'false';
  });
  it('should toggle the mute/unmute input setting onto BLE', () => {
    store.dispatch(toggleMuteSettings(rowData));
    expect(spy).toBeCalledWith(
      1,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.muteClassroomMicrophone,
      'false',
    );
  });
});
