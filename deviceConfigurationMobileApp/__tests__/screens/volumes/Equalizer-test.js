import React from 'react';
import {Provider} from 'react-redux';
import renderer from 'react-test-renderer';
import {createTestStore} from '../../utilityFunction';
import Equalizer from '../../../src/screens/volumes/equalizer';
import {store} from '../../../src/store/configureStore';
import {render, screen} from '@testing-library/react-native';
import {updateAuthDevices} from '../../../src/services/authDevices/action';
import {
  changeSpeakerImpedence,
  geteqSettingsValues,
  getNoiseSuppressionSettings,
  getSpeakerImpedence,
  toggleBypassEQSetting,
  toggleNoiseSuppressionSetting,
  updateNoiseSuppressionThreshold,
  updateVolumeSettingsFields,
  writeeqSettingsValues,
} from '../../../src/services/volumes/action';
import BleManager from '../../../src/config/bleManagerInstance';
import {UUIDMappingMS700} from '../../../src/constants';
import Toast from 'react-native-toast-message';
import base64 from 'react-native-base64';

describe('on Equalizer screen mounting', () => {
  let tree;
  beforeEach(() => {
    tree = renderer.create(<Equalizer />).toJSON();
  });

  it('renders Equalizer screen correctly', () => {
    expect(tree).toMatchSnapshot();
  });
});

describe('Equalizer settings', () => {
  let component, myStore;
  beforeEach(() => {
    myStore = createTestStore();
    component = (
      <Provider store={myStore}>
        <Equalizer />
      </Provider>
    );
    render(component);
  });
  it('should render equalizer settings list', () => {
    expect(screen.getByTestId('equalizerVolumeSettingsList')).toBeTruthy();
  });
});

describe('geteqSettingsValues function', () => {
  let component, readSpy;
  beforeEach(() => {
    component = (
      <Provider store={store}>
        <Equalizer />
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
  it('should fetch equalizer settings from BLE', async () => {
    await store.dispatch(geteqSettingsValues());
    expect(readSpy).toBeCalledWith(
      1,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.eqBand1,
    );
  });
});

describe('writeeqSettingsValues function with error in writing values on BLE', () => {
  let component, rowData, toastSpy;
  beforeEach(() => {
    component = (
      <Provider store={store}>
        <Equalizer />
      </Provider>
    );
    render(component);
  });
  beforeAll(async () => {
    store.dispatch(updateAuthDevices('connectedDevice', {}));
    rowData = {
      index: 0,
      item: {id: 1, charactersticId: UUIDMappingMS700.eqBand1},
    };
    jest
      .spyOn(BleManager, 'writeCharacteristicWithResponseForDevice')
      .mockImplementation(() => {
        throw new Error('cannot write values because BLE is shutdown.');
      });
    toastSpy = jest.spyOn(Toast, 'show');
  });
  it('should get error from BLE when writing equalizer settings on BLE', async () => {
    await store.dispatch(writeeqSettingsValues(rowData, [30]));
    expect(toastSpy).toBeCalled();
  });
});

describe('writeeqSettingsValues function', () => {
  let component, rowData, writeSpy;
  beforeEach(() => {
    component = (
      <Provider store={store}>
        <Equalizer />
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
      item: {id: 1, charactersticId: UUIDMappingMS700.eqBand1},
    };
    writeSpy = jest.spyOn(
      BleManager,
      'writeCharacteristicWithResponseForDevice',
    );
    jest.spyOn(base64, 'encode').mockImplementation(() => {
      return 30;
    });
  });
  it('should update equalizer settings values on the BLE', async () => {
    await store.dispatch(writeeqSettingsValues(rowData, [30]));
    expect(writeSpy).toBeCalledWith(
      1,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.eqBand1,
      30,
    );
  });
});

describe('getNoiseSuppressionSettings function', () => {
  let component, readSpy;
  beforeEach(() => {
    component = (
      <Provider store={store}>
        <Equalizer />
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
  it('should fetch noise suppression settings from BLE', async () => {
    await store.dispatch(getNoiseSuppressionSettings());
    expect(readSpy).toBeCalledWith(
      1,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.noiseSuppression,
    );
    expect(readSpy).toBeCalledWith(
      1,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.noiseSuppressionThreshold,
    );
  });
});

describe('getSpeakerImpedence function', () => {
  let component, readSpy;
  beforeEach(() => {
    component = (
      <Provider store={store}>
        <Equalizer />
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
  it('should fetch speaker impedence settings from BLE', async () => {
    await store.dispatch(getSpeakerImpedence());
    expect(readSpy).toBeCalledWith(
      1,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.speakerImpedence,
    );
  });
});

describe('updateNoiseSuppressionThreshold function', () => {
  let component, writeSpy;
  beforeEach(() => {
    component = (
      <Provider store={store}>
        <Equalizer />
      </Provider>
    );
    render(component);
  });
  beforeAll(async () => {
    store.dispatch(
      updateAuthDevices('connectedDevice', {id: 1, localName: 'Brx-emulator'}),
    );
    writeSpy = jest.spyOn(
      BleManager,
      'writeCharacteristicWithResponseForDevice',
    );
    jest.spyOn(base64, 'encode').mockImplementation(() => {
      return 30;
    });
  });
  it('should update noise suppression threshold setting value on the BLE', async () => {
    await store.dispatch(updateNoiseSuppressionThreshold([30]));
    expect(writeSpy).toBeCalledWith(
      1,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.noiseSuppressionThreshold,
      30,
    );
  });
});

describe('toggleNoiseSuppressionSetting function', () => {
  let component, callback, writeSpy;
  beforeEach(() => {
    component = (
      <Provider store={store}>
        <Equalizer />
      </Provider>
    );
    render(component);
  });
  beforeAll(async () => {
    store.dispatch(
      updateAuthDevices('connectedDevice', {id: 1, localName: 'Brx-emulator'}),
    );
    callback = jest.fn();
    writeSpy = jest.spyOn(
      BleManager,
      'writeCharacteristicWithResponseForDevice',
    );
    jest.spyOn(base64, 'encode').mockImplementation(() => {
      return 'false';
    });
  });
  it('should toggle noise suppression enabled setting value on the BLE', async () => {
    await store.dispatch(toggleNoiseSuppressionSetting(callback));
    expect(writeSpy).toBeCalledWith(
      1,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.noiseSuppressionThreshold,
      'false',
    );
  });
});

describe('changeSpeakerImpedence function', () => {
  let component, writeSpy;
  beforeEach(() => {
    component = (
      <Provider store={store}>
        <Equalizer />
      </Provider>
    );
    render(component);
  });
  beforeAll(async () => {
    store.dispatch(
      updateAuthDevices('connectedDevice', {id: 1, localName: 'Brx-emulator'}),
    );
    writeSpy = jest.spyOn(
      BleManager,
      'writeCharacteristicWithResponseForDevice',
    );
    jest.spyOn(base64, 'encode').mockImplementation(() => {
      return '8';
    });
  });
  it('should update speaker impedence setting value on the BLE', async () => {
    await store.dispatch(changeSpeakerImpedence('8'));
    expect(writeSpy).toBeCalledWith(
      1,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.speakerImpedence,
      '8',
    );
    });

  describe('toggleBypassEQSetting function', () => {
    let component, writeSpy;
    beforeEach(() => {
      component = (
        <Provider store={store}>
          <Equalizer />
        </Provider>
      );
      render(component);
    });
    beforeAll(async () => {
      store.dispatch(
        updateAuthDevices('connectedDevice', {
          id: 1,
          localName: 'Brx-emulator',
        }),
      );
      writeSpy = jest.spyOn(
        BleManager,
        'writeCharacteristicWithResponseForDevice',
      );
    });
    it('should toggle bypass EQ Setting on the BLE, when byPass is enabled', async () => {
      const callbackFunction = jest.fn();
      jest.spyOn(base64, 'encode').mockImplementation(() => {
        return true;
      });
      await store.dispatch(toggleBypassEQSetting(callbackFunction));
      expect(writeSpy).toBeCalledWith(
        1,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.byPassEQ,
        true,
      );
      expect(writeSpy).toBeCalledWith(
        1,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.applyChange,
        true,
      );
    });
    it('should toggle bypass EQ Setting on the BLE, resets the EQ band values to 0, when byPass is disabled', async () => {
      store.dispatch(updateVolumeSettingsFields('bypassEQ', true));
      const callbackFunction = jest.fn();
      jest
        .spyOn(base64, 'encode')
        .mockImplementationOnce(() => {
          return '0';
        })
        .mockImplementationOnce(() => {
          return '0';
        })
        .mockImplementationOnce(() => {
          return '0';
        })
        .mockImplementationOnce(() => {
          return '0';
        })
        .mockImplementationOnce(() => {
          return '0';
        })
        .mockImplementationOnce(() => {
          return true;
        });
      await store.dispatch(toggleBypassEQSetting(callbackFunction));
      expect(writeSpy).toBeCalledWith(
        1,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.eqBand1,
        '0',
      );
      expect(writeSpy).toBeCalledWith(
        1,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.eqBand2,
        '0',
      );
      expect(writeSpy).toBeCalledWith(
        1,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.eqBand3,
        '0',
      );
      expect(writeSpy).toBeCalledWith(
        1,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.eqBand4,
        '0',
      );
      expect(writeSpy).toBeCalledWith(
        1,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.eqBand5,
        '0',
      );
      expect(writeSpy).toBeCalledWith(
        1,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.byPassEQ,
        true,
      );
      expect(writeSpy).toBeCalledWith(
        1,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.applyChange,
        true,
      );
    });
  });
});
