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

import React from 'react';
import { Provider } from 'react-redux';
import renderer, { act as rendererAct } from 'react-test-renderer';
import Output from '../../../src/screens/volumes/output';
import { store } from '../../../src/store/configureStore';
import { fireEvent, render, screen } from '@testing-library/react-native';
import BleManager from '../../../src/config/bleManagerInstance';
import { updateAuthDevices } from '../../../src/services/authDevices/action';
import {
  getOutputSettingsValues,
  toggleMuteOutputSettings,
  writeOutputVolumeSettings,
  updateVolumeSettingsFields,
} from '../../../src/services/volumes/action';
import * as outputSettingsFunctions from '../../../src/services/volumes/action';
import { createTestStore } from '../../utilityFunction';
import { UUIDMappingMS700 } from '../../../src/constants';
import Toast from 'react-native-toast-message';
import base64 from 'react-native-base64';
import Utils from '../../../src/utils';

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

describe('on Output screen mounting', () => {
  let tree;
  beforeEach(() => {
    let component;
    rendererAct(() => {
      component = renderer.create(<Output />);
    });
    tree = component.toJSON();
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
  
  beforeEach(async () => {
    // Setup connected device first
    await rendererAct(async () => {
      await store.dispatch(
        updateAuthDevices('connectedDevice', { id: 1, localName: 'Brx-emulator' }),
      );
      
      // Initialize outputVolumeSettings in store
      await store.dispatch(
        updateVolumeSettingsFields('outputVolumeSettings', [
          {
            settingName: 'Speaker Output',
            value: '-10',
            charactersticId: UUIDMappingMS700.speakerOutput,
            isMuted: false,
            muteCharacter: UUIDMappingMS700.muteSpeakerOutput,
          },
        ])
      );
    });
    
    // Setup spy
    readSpy = jest.spyOn(BleManager, 'readCharacteristicForDevice')
      .mockResolvedValue({ value: 'LTEw' }); // base64 encoded "-10"
    
    // Render component
    component = (
      <Provider store={store}>
        <Output />
      </Provider>
    );
    render(component);
  });
  
  afterEach(() => {
    // Clean up spy
    if (readSpy) {
      readSpy.mockRestore();
    }
    // Clean up connected device and settings
    rendererAct(() => {
      store.dispatch(updateAuthDevices('connectedDevice', {}));
      store.dispatch(updateVolumeSettingsFields('outputVolumeSettings', []));
    });
  });
  
  it('should fetch output settings from BLE', async () => {
    await rendererAct(async () => {
      await store.dispatch(getOutputSettingsValues());
    });
    
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
  let component, toastSpy, rowData, readSpy;
  
  beforeEach(async () => {
    // Setup connected device first
    await rendererAct(async () => {
      await store.dispatch(
        updateAuthDevices('connectedDevice', { id: 1, localName: 'Brx-emulator' }),
      );
      
      // Initialize outputVolumeSettings in store
      await store.dispatch(
        updateVolumeSettingsFields('outputVolumeSettings', [
          {
            settingName: 'Speaker Output',
            value: '-10',
            charactersticId: UUIDMappingMS700.speakerOutput,
            isMuted: false,
            muteCharacter: UUIDMappingMS700.muteSpeakerOutput,
          },
        ])
      );
    });
    
    rowData = {
      index: 0,
      item: { id: 1, charactersticId: UUIDMappingMS700.speakerOutput },
    };
    
    // Setup spy that throws error
    readSpy = jest
      .spyOn(BleManager, 'readCharacteristicForDevice')
      .mockRejectedValue(new Error('cannot read values because BLE is shutdown.'));
    
    toastSpy = jest.spyOn(Utils, 'showToast');
    
    // Render component
    component = (
      <Provider store={store}>
        <Output />
      </Provider>
    );
    render(component);
  });
  
  afterEach(() => {
    // Clean up spies - CRITICAL for test isolation
    if (readSpy) {
      readSpy.mockRestore();
    }
    if (toastSpy) {
      toastSpy.mockRestore();
    }
    // Clean up connected device and settings
    rendererAct(() => {
      store.dispatch(updateAuthDevices('connectedDevice', {}));
      store.dispatch(updateVolumeSettingsFields('outputVolumeSettings', []));
    });
  });
  
  it('should get error from BLE when reading output settings from BLE', async () => {
    await rendererAct(async () => {
      await store.dispatch(getOutputSettingsValues(rowData, [30]));
    });
    expect(toastSpy).toBeCalled();
  });
});

describe('test for toggleMuteOutputSettings function with error', () => {
  let writeSpy, rowData, toastSpy;
  
  beforeEach(async () => {
    // Setup connected device first
    await rendererAct(async () => {
      await store.dispatch(
        updateAuthDevices('connectedDevice', { id: 1, localName: 'Brx-emulator' }),
      );
      
      // Initialize outputVolumeSettings in store
      await store.dispatch(
        updateVolumeSettingsFields('outputVolumeSettings', [
          {
            settingName: 'Speaker Output',
            value: '-10',
            charactersticId: UUIDMappingMS700.speakerOutput,
            isMuted: false,
            muteCharacter: UUIDMappingMS700.muteSpeakerOutput,
          },
        ])
      );
    });
    
    // Setup spy that throws error
    writeSpy = jest
      .spyOn(BleManager, 'writeCharacteristicWithResponseForDevice')
      .mockRejectedValue(new Error('cannot write values because BLE is shutdown.'));
    
    rowData = {
      index: 0,
      item: { id: 1, charactersticId: UUIDMappingMS700.speakerOutput },
    };
    
    toastSpy = jest.spyOn(Utils, 'showToast');
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
      store.dispatch(updateVolumeSettingsFields('outputVolumeSettings', []));
    });
  });
  
  it('should toggle the mute/unmute output setting onto BLE ', async () => {
    await rendererAct(async () => {
      await store.dispatch(toggleMuteOutputSettings(rowData));
    });
    expect(toastSpy).toBeCalled();
  });
});

describe('writeOutputValueSettings function', () => {
  let component, rowData, writeSpy, encodeSpy;
  
  beforeEach(async () => {
    await rendererAct(async () => {
      await store.dispatch(
        updateAuthDevices('connectedDevice', { id: 1, localName: 'Brx-emulator' }),
      );
    });
    
    rowData = {
      index: 0,
      item: { id: 1, charactersticId: UUIDMappingMS700.speakerOutput },
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
        <Output />
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
  
  it('should update output settings values on the BLE', async () => {
    await rendererAct(async () => {
      await store.dispatch(
        outputSettingsFunctions.writeOutputVolumeSettings(rowData, [30]),
      );
    });
    
    expect(writeSpy).toBeCalledWith(
      1,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.speakerOutput,
      "30", // Value is sent as string
    );
  });
});

describe('writeOutputValueSettings function with error in writing values on BLE', () => {
  let component, toastSpy, rowData, writeSpy;
  
  beforeEach(async () => {
    // Setup connected device
    await rendererAct(async () => {
      await store.dispatch(
        updateAuthDevices('connectedDevice', { id: 1, localName: 'Brx-emulator' }),
      );
      
      // Initialize outputVolumeSettings in store
      await store.dispatch(
        updateVolumeSettingsFields('outputVolumeSettings', [
          {
            settingName: 'Speaker Output',
            value: '-10',
            charactersticId: 'asdfghjkl',
            isMuted: false,
            muteCharacter: UUIDMappingMS700.muteSpeakerOutput,
          },
        ])
      );
    });
    
    rowData = { index: 0, item: { id: 1, charactersticId: 'asdfghjkl' } };
    
    // Setup spy that throws error
    writeSpy = jest
      .spyOn(BleManager, 'writeCharacteristicWithResponseForDevice')
      .mockRejectedValue(new Error('cannot write values because BLE is shutdown.'));
    
    toastSpy = jest.spyOn(Utils, 'showToast');
    
    // Render component
    component = (
      <Provider store={store}>
        <Output />
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
      store.dispatch(updateVolumeSettingsFields('outputVolumeSettings', []));
    });
  });
  
  it('should get error from BLE when writing output settings on BLE', async () => {
    await rendererAct(async () => {
      await store.dispatch(writeOutputVolumeSettings(rowData, [30]));
    });
    expect(toastSpy).toBeCalled();
  });
});
