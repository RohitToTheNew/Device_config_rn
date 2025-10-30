import React from 'react';
import {Provider} from 'react-redux';
import renderer from 'react-test-renderer';
import Output from '../../../src/screens/volumes/output';
import {store} from '../../../src/store/configureStore';
import {fireEvent, render, screen} from '@testing-library/react-native';
import BleManager from '../../../src/config/bleManagerInstance';
import {updateAuthDevices} from '../../../src/services/authDevices/action';
import {
  getOutputSettingsValues,
  toggleMuteOutputSettings,
  writeOutputVolumeSettings,
} from '../../../src/services/volumes/action';
import * as outputSettingsFunctions from '../../../src/services/volumes/action';
import {createTestStore} from '../../utilityFunction';
import {UUIDMappingMS700} from '../../../src/constants';
import Toast from 'react-native-toast-message';
import base64 from 'react-native-base64';

describe('on Output screen mounting', () => {
  let tree;
  beforeEach(() => {
    tree = renderer.create(<Output />).toJSON();
  });

  it('renders Output screen correctly', () => {
    expect(tree).toMatchSnapshot();
  });
});

describe('Output volumes settings ', () => {
  let component, myStore;
  beforeEach(() => {
    spy = jest.spyOn(outputSettingsFunctions, 'toggleMuteOutputSettings');
    myStore = createTestStore();
    component = (
      <Provider store={myStore}>
        <Output />
      </Provider>
    );
    render(component);
  });
  it('should render input settings list', () => {
    expect(screen.getByTestId('outputVolumeSettingsList')).toBeTruthy();
    expect(screen.getByTestId('toggleMuteButton1')).toBeTruthy();
    expect(screen.getByTestId('sliderComponent1')).toBeTruthy();
  });
});

describe('getOutputSettingsValues function', () => {
  let component, readSpy;
  beforeEach(() => {
    component = (
      <Provider store={store}>
        <Output />
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
  it('should fetch output settings from BLE', async () => {
    await store.dispatch(getOutputSettingsValues());
    expect(readSpy).toBeCalledWith(
      1,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.speakerOutput,
    );
    expect(readSpy).toBeCalledWith(
      1,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.muteSpeakerOutput,
    );
  });
});

describe('getOutputSettingsValues function with error in reading values from BLE', () => {
  let component, toastSpy, rowData;
  beforeEach(() => {
    component = (
      <Provider store={store}>
        <Output />
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
      item: {id: 1, charactersticId: UUIDMappingMS700.speakerOutput},
    };
    jest
      .spyOn(BleManager, 'readCharacteristicForDevice')
      .mockImplementation(() => {
        throw new Error('cannot read values because BLE is shutdown.');
      });
    toastSpy = jest.spyOn(Toast, 'show');
  });
  it('should get error from BLE when reading output settings from BLE', async () => {
    await store.dispatch(getOutputSettingsValues(rowData, [30]));
    expect(toastSpy).toBeCalled();
  });
});

describe('test for toggleMuteOutputSettings function with error', () => {
  let spy, rowData, toastSpy;
  beforeAll(() => {
    spy = jest
      .spyOn(BleManager, 'writeCharacteristicWithResponseForDevice')
      .mockImplementation(() => {
        throw new Error('cannot read values because BLE is shutdown.');
      });
    rowData = {
      index: 0,
      item: {id: 1, charactersticId: UUIDMappingMS700.speakerOutput},
    };
    toastSpy = jest.spyOn(Toast, 'show');
  });
  it('should toggle the mute/unmute output setting onto BLE ', () => {
    store.dispatch(toggleMuteOutputSettings(rowData));
    expect(toastSpy).toBeCalled();
  });
});

describe('writeOutputValueSettings function', () => {
  let component, rowData, writeSpy;
  beforeEach(() => {
    component = (
      <Provider store={store}>
        <Output />
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
      item: {id: 1, charactersticId: UUIDMappingMS700.speakerOutput},
    };
    writeSpy = jest.spyOn(
      BleManager,
      'writeCharacteristicWithResponseForDevice',
    );
    jest.spyOn(base64, 'encode').mockImplementation(() => {
      return 30;
    });
  });
  it('should update output settings values on the BLE', async () => {
    await store.dispatch(
      outputSettingsFunctions.writeOutputVolumeSettings(rowData, [30]),
    );
    expect(writeSpy).toBeCalledWith(
      1,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.speakerOutput,
      30,
    );
  });
});

describe('writeOutputValueSettings function with error in writing values on BLE', () => {
  let component, toastSpy, rowData;
  beforeEach(() => {
    component = (
      <Provider store={store}>
        <Output />
      </Provider>
    );
    render(component);
  });
  beforeAll(async () => {
    store.dispatch(updateAuthDevices('connectedDevice', {}));
    rowData = {index: 0, item: {id: 1, charactersticId: 'asdfghjkl'}};
    jest
      .spyOn(BleManager, 'writeCharacteristicWithResponseForDevice')
      .mockImplementation(() => {
        throw new Error('cannot write values because BLE is shutdown.');
      });
    toastSpy = jest.spyOn(Toast, 'show');
  });
  it('should get error from BLE when writing output settings on BLE', async () => {
    await store.dispatch(writeOutputVolumeSettings(rowData, [30]));
    expect(toastSpy).toBeCalled();
  });
});
