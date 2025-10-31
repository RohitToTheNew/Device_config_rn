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
import Input from '../../../src/screens/volumes/input';
import { store } from '../../../src/store/configureStore';
import { render, screen } from '@testing-library/react-native';
import BleManager from '../../../src/config/bleManagerInstance';
import { updateAuthDevices } from '../../../src/services/authDevices/action';
import {
  getInputSettingsValues,
  writeInputValueSettings,
  toggleMuteSettings,
  updateVolumeSettingsFields,
} from '../../../src/services/volumes/action';
import { UUIDMappingMS700 } from '../../../src/constants';
import base64 from 'react-native-base64';
import Toast from 'react-native-toast-message';
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

describe('on Input screen mounting', () => {
  let tree;
  beforeEach(() => {
    let component;
    rendererAct(() => {
      component = renderer.create(<Input />);
    });
    tree = component.toJSON();
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
  
  beforeEach(async () => {
    // Setup connected device first
    await rendererAct(async () => {
      await store.dispatch(
        updateAuthDevices('connectedDevice', { id: 1, localName: 'Brx-emulator' }),
      );
      
      // Initialize inputVolumeSettings in store
      await store.dispatch(
        updateVolumeSettingsFields('inputVolumeSettings', [
          {
            settingName: 'Classroom Microphone',
            value: '-10',
            charactersticId: UUIDMappingMS700.classroomMicrophone,
            isMuted: false,
            muteCharacter: UUIDMappingMS700.muteClassroomMicrophone,
          },
        ])
      );
    });
    
    // Setup spy
    readSpy = jest.spyOn(BleManager, 'readCharacteristicForDevice')
      .mockResolvedValue({ value: 'LTEw' }); // base64 encoded "-10"

    component = (
      <Provider store={store}>
        <Input />
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
      store.dispatch(updateVolumeSettingsFields('inputVolumeSettings', []));
    });
  });
  
  it('should fetch input settings from BLE', async () => {
    await rendererAct(async () => {
      await store.dispatch(getInputSettingsValues());
    });
    
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
  let component, writeSpy, rowData, encodeSpy;
  
  beforeEach(async () => {
    await rendererAct(async () => {
      await store.dispatch(
        updateAuthDevices('connectedDevice', { id: 1, localName: 'Brx-emulator' }),
      );
    });
    
    rowData = {
      index: 0,
      item: { id: 1, charactersticId: UUIDMappingMS700.classroomMicrophone },
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
        <Input />
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
  
  it('should update input settings values on the BLE', async () => {
    await rendererAct(async () => {
      await store.dispatch(writeInputValueSettings(rowData, [30]));
    });
    
    expect(writeSpy).toBeCalledWith(
      1,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.classroomMicrophone,
      "30", // Value is sent as string
    );
  });
});

describe('writeInputValueSettings function with error in writing values on BLE', () => {
  let component, toastSpy, rowData, writeSpy;
  
  beforeEach(async () => {
    // Setup connected device
    await rendererAct(async () => {
      await store.dispatch(
        updateAuthDevices('connectedDevice', { id: 1, localName: 'Brx-emulator' }),
      );
      
      // Initialize inputVolumeSettings in store
      await store.dispatch(
        updateVolumeSettingsFields('inputVolumeSettings', [
          {
            settingName: 'Classroom Microphone',
            value: '-10',
            charactersticId: UUIDMappingMS700.classroomMicrophone,
            isMuted: false,
            muteCharacter: UUIDMappingMS700.muteClassroomMicrophone,
          },
        ])
      );
    });
    
    rowData = {
      index: 0,
      item: { id: 1, charactersticId: UUIDMappingMS700.classroomMicrophone },
    };
    
    // Setup spy that throws error
    writeSpy = jest
      .spyOn(BleManager, 'writeCharacteristicWithResponseForDevice')
      .mockRejectedValue(new Error('cannot write values because BLE is shutdown.'));
    
    toastSpy = jest.spyOn(Utils, 'showToast');
    
    component = (
      <Provider store={store}>
        <Input />
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
      store.dispatch(updateVolumeSettingsFields('inputVolumeSettings', []));
    });
  });
  
  it('should get error from BLE when writing input settings on BLE', async () => {
    await rendererAct(async () => {
      await store.dispatch(writeInputValueSettings(rowData, [30]));
    });
    expect(toastSpy).toBeCalled();
  });
});

describe('toggleMuteSettings function', () => {
  let spy, rowData;
  beforeEach(async () => {
    await store.dispatch(
      updateAuthDevices('connectedDevice', { id: 1, localName: 'Brx-emulator' }),
    );
    // Populate inputVolumeSettings with proper data structure
    await store.dispatch(updateVolumeSettingsFields('inputVolumeSettings', [
      { id: 1, isMuted: false, value: 0 }
    ]));

    spy = jest.spyOn(BleManager, 'writeCharacteristicWithResponseForDevice');
    jest.spyOn(base64, 'encode').mockImplementation(() => {
      return 'false';
    });

    rowData = {
      index: 0,
      item: { id: 1, muteCharacter: UUIDMappingMS700.muteClassroomMicrophone },
    };
  });

  it('should toggle the mute/unmute input setting onto BLE', async () => {
    await store.dispatch(toggleMuteSettings(rowData));
    expect(spy).toBeCalledWith(
      1,
      UUIDMappingMS700.rootServiceUDID,
      UUIDMappingMS700.muteClassroomMicrophone,
      'false',
    );
  });
});
