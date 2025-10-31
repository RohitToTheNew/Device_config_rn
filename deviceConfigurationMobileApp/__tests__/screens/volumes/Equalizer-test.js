// Mock BackHandler before other imports
jest.mock('react-native/Libraries/Utilities/BackHandler', () => {
  return {
    __esModule: true,
    default: {
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
      removeEventListener: jest.fn(),
    },
  };
});

import React from 'react';
import { Provider } from 'react-redux';
import renderer, { act as rendererAct } from 'react-test-renderer';
import { createTestStore } from '../../utilityFunction';
import Equalizer from '../../../src/screens/volumes/equalizer';
import { store } from '../../../src/store/configureStore';
import { render, screen } from '@testing-library/react-native';
import { updateAuthDevices } from '../../../src/services/authDevices/action';
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
import { UUIDMappingMS700 } from '../../../src/constants';
import Toast from 'react-native-toast-message';
import base64 from 'react-native-base64';
import Utils from '../../../src/utils';

// Mock Utils to spy on showToast
jest.mock('../../../src/utils', () => {
  const actualUtils = jest.requireActual('../../../src/utils');
  return {
    __esModule: true,
    default: {
      ...actualUtils.default,
      showToast: jest.fn(),
      Log: jest.fn(),
    },
  };
});

// Setup fake timers to control animations
jest.useFakeTimers();

// Clear all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Clear all timers after each test to prevent animation warnings
afterEach(() => {
  jest.clearAllTimers();
});

describe('on Equalizer screen mounting', () => {
  let tree;
  beforeEach(() => {
    let component;
    rendererAct(() => {
      component = renderer.create(<Equalizer />);
    });
    tree = component.toJSON();
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
      updateAuthDevices('connectedDevice', { id: 1, localName: 'Brx-emulator' }),
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
  let component, rowData, toastSpy, writeSpy;
  
  beforeEach(async () => {
    // Setup connected device
    await rendererAct(async () => {
      await store.dispatch(
        updateAuthDevices('connectedDevice', { id: 1, localName: 'Brx-emulator' }),
      );
      
      // Initialize equalizerVolumeSettings in store
      await store.dispatch(
        updateVolumeSettingsFields('equalizerVolumeSettings', [
          {
            settingName: 'Band 1',
            value: '0',
            charactersticId: UUIDMappingMS700.eqBand1,
          },
        ])
      );
    });
    
    rowData = {
      index: 0,
      item: { id: 1, charactersticId: UUIDMappingMS700.eqBand1 },
    };
    
    // Setup spy that throws error
    writeSpy = jest
      .spyOn(BleManager, 'writeCharacteristicWithResponseForDevice')
      .mockRejectedValue(new Error('cannot write values because BLE is shutdown.'));
    
    toastSpy = jest.spyOn(Utils, 'showToast');
    
    component = (
      <Provider store={store}>
        <Equalizer />
      </Provider>
    );
    render(component);
  });
  
  afterEach(() => {
    // Clean up spies - CRITICAL for test isolation
    if (writeSpy) {
      writeSpy.mockRestore();
    }
    if (toastSpy) {
      toastSpy.mockRestore();
    }
    // Clean up connected device and settings
    rendererAct(() => {
      store.dispatch(updateAuthDevices('connectedDevice', {}));
      store.dispatch(updateVolumeSettingsFields('equalizerVolumeSettings', []));
    });
  });
  
  it('should get error from BLE when writing equalizer settings on BLE', async () => {
    await rendererAct(async () => {
      await store.dispatch(writeeqSettingsValues(rowData, [30]));
    });
    expect(toastSpy).toBeCalled();
  });
});

describe('writeeqSettingsValues function', () => {
  let component, rowData, writeSpy, encodeSpy;
  
  beforeEach(async () => {
    await rendererAct(async () => {
      await store.dispatch(
        updateAuthDevices('connectedDevice', { id: 1, localName: 'Brx-emulator' }),
      );
    });
    
    rowData = {
      index: 0,
      item: { id: 1, charactersticId: UUIDMappingMS700.eqBand1 },
    };
    
    writeSpy = jest.spyOn(
      BleManager,
      'writeCharacteristicWithResponseForDevice',
    );
    
    encodeSpy = jest.spyOn(base64, 'encode').mockImplementation(() => {
      return "30"; // Return string to match expected behavior
    });

    component = (
      <Provider store={store}>
        <Equalizer />
      </Provider>
    );
    render(component);
  });
  
  afterEach(() => {
    // Clean up spies
    if (writeSpy) {
      writeSpy.mockRestore();
    }
    if (encodeSpy) {
      encodeSpy.mockRestore();
    }
    // Clean up connected device
    rendererAct(() => {
      store.dispatch(updateAuthDevices('connectedDevice', {}));
    });
  });
  
  it('should update equalizer settings values on the BLE', async () => {
    await rendererAct(async () => {
      await store.dispatch(writeeqSettingsValues(rowData, [30]));
    });
    
    expect(writeSpy).toBeCalledWith(
      1,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.eqBand1,
      "30", // Value is sent as string
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
      updateAuthDevices('connectedDevice', { id: 1, localName: 'Brx-emulator' }),
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
      updateAuthDevices('connectedDevice', { id: 1, localName: 'Brx-emulator' }),
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
  let component, writeSpy, encodeSpy;
  
  beforeEach(async () => {
    await rendererAct(async () => {
      await store.dispatch(
        updateAuthDevices('connectedDevice', { id: 1, localName: 'Brx-emulator' }),
      );
    });
    
    writeSpy = jest.spyOn(
      BleManager,
      'writeCharacteristicWithResponseForDevice',
    );
    
    encodeSpy = jest.spyOn(base64, 'encode').mockImplementation(() => {
      return "30"; // Return string to match expected behavior
    });

    component = (
      <Provider store={store}>
        <Equalizer />
      </Provider>
    );
    render(component);
  });
  
  afterEach(() => {
    // Clean up spies
    if (writeSpy) {
      writeSpy.mockRestore();
    }
    if (encodeSpy) {
      encodeSpy.mockRestore();
    }
    // Clean up connected device
    rendererAct(() => {
      store.dispatch(updateAuthDevices('connectedDevice', {}));
    });
  });
  
  it('should update noise suppression threshold setting value on the BLE', async () => {
    await rendererAct(async () => {
      await store.dispatch(updateNoiseSuppressionThreshold([30]));
    });
    
    expect(writeSpy).toBeCalledWith(
      1,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.noiseSuppressionThreshold,
      "30", // Value is sent as string
    );
  });
});

describe('toggleNoiseSuppressionSetting function', () => {
  let component, callback, writeSpy, encodeSpy;
  
  beforeEach(async () => {
    await rendererAct(async () => {
      await store.dispatch(
        updateAuthDevices('connectedDevice', { id: 1, localName: 'Brx-emulator' }),
      );
    });
    
    callback = jest.fn();
    writeSpy = jest.spyOn(
      BleManager,
      'writeCharacteristicWithResponseForDevice',
    );
    
    encodeSpy = jest.spyOn(base64, 'encode').mockImplementation(() => {
      return 'true'; // Return 'true' to match expected behavior
    });

    component = (
      <Provider store={store}>
        <Equalizer />
      </Provider>
    );
    render(component);
  });
  
  afterEach(() => {
    // Clean up spies
    if (writeSpy) {
      writeSpy.mockRestore();
    }
    if (encodeSpy) {
      encodeSpy.mockRestore();
    }
    // Clean up connected device
    rendererAct(() => {
      store.dispatch(updateAuthDevices('connectedDevice', {}));
    });
  });
  
  it('should toggle noise suppression enabled setting value on the BLE', async () => {
    await rendererAct(async () => {
      await store.dispatch(toggleNoiseSuppressionSetting(callback));
    });
    
    expect(writeSpy).toBeCalledWith(
      1,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.noiseSuppression,
      'true',
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
      updateAuthDevices('connectedDevice', { id: 1, localName: 'Brx-emulator' }),
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
    beforeEach(async () => {
      await store.dispatch(
        updateAuthDevices('connectedDevice', {
          id: 1,
          localName: 'Brx-emulator',
        }),
      );
      writeSpy = jest.spyOn(
        BleManager,
        'writeCharacteristicWithResponseForDevice',
      );

      component = (
        <Provider store={store}>
          <Equalizer />
        </Provider>
      );
      render(component);
    });
    it('should toggle bypass EQ Setting on the BLE, when byPass is enabled', async () => {
      const callbackFunction = jest.fn();
      // Mock encode to return "true" for byPassEQ and then "" for applyChange
      const encodeSpy = jest.spyOn(base64, 'encode')
        .mockImplementationOnce(() => "true")
        .mockImplementationOnce(() => "");
      
      await rendererAct(async () => {
        await store.dispatch(toggleBypassEQSetting(callbackFunction));
      });
      
      expect(writeSpy).toHaveBeenCalledWith(
        1,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.byPassEQ,
        "true", // Value is sent as string
      );
      expect(writeSpy).toHaveBeenCalledWith(
        1,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.applyChange,
        "", // Value is sent as empty string
      );
      
      // Cleanup
      encodeSpy.mockRestore();
    });
    it('should toggle bypass EQ Setting on the BLE, resets the EQ band values to 0, when byPass is disabled', async () => {
      // Setup: Enable bypass first
      await rendererAct(async () => {
        await store.dispatch(updateVolumeSettingsFields('bypassEQ', true));
        // Initialize equalizerVolumeSettings with 5 bands
        await store.dispatch(
          updateVolumeSettingsFields('equalizerVolumeSettings', [
            { id: 1, charactersticId: UUIDMappingMS700.eqBand1, value: '5' },
            { id: 2, charactersticId: UUIDMappingMS700.eqBand2, value: '5' },
            { id: 3, charactersticId: UUIDMappingMS700.eqBand3, value: '5' },
            { id: 4, charactersticId: UUIDMappingMS700.eqBand4, value: '5' },
            { id: 5, charactersticId: UUIDMappingMS700.eqBand5, value: '5' },
          ])
        );
      });
      
      const callbackFunction = jest.fn();
      const encodeSpy = jest
        .spyOn(base64, 'encode')
        .mockImplementationOnce(() => '0')
        .mockImplementationOnce(() => '0')
        .mockImplementationOnce(() => '0')
        .mockImplementationOnce(() => '0')
        .mockImplementationOnce(() => '0')
        .mockImplementationOnce(() => 'true')
        .mockImplementationOnce(() => ''); // For applyChange
      
      await rendererAct(async () => {
        await store.dispatch(toggleBypassEQSetting(callbackFunction));
      });
      
      // Verify EQ bands were reset to 0
      expect(writeSpy).toHaveBeenCalledWith(
        1,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.eqBand1,
        '0',
      );
      expect(writeSpy).toHaveBeenCalledWith(
        1,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.eqBand2,
        '0',
      );
      expect(writeSpy).toHaveBeenCalledWith(
        1,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.eqBand3,
        '0',
      );
      expect(writeSpy).toHaveBeenCalledWith(
        1,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.eqBand4,
        '0',
      );
      expect(writeSpy).toHaveBeenCalledWith(
        1,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.eqBand5,
        '0',
      );
      expect(writeSpy).toHaveBeenCalledWith(
        1,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.byPassEQ,
        "true", // Value is sent as string
      );
      expect(writeSpy).toHaveBeenCalledWith(
        1,
        UUIDMappingMS700.rootServiceUDID,
        UUIDMappingMS700.applyChange,
        "", // Value is sent as empty string
      );
      
      // Cleanup
      encodeSpy.mockRestore();
      await rendererAct(async () => {
        await store.dispatch(updateVolumeSettingsFields('bypassEQ', false));
        await store.dispatch(updateVolumeSettingsFields('equalizerVolumeSettings', []));
      });
    });
  });
});
