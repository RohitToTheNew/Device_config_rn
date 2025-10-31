import React from 'react';
import renderer, { act } from 'react-test-renderer';
import BleManager from '../../src/config/bleManagerInstance';
import { Header } from '../../src/components';
import * as AppActionFunctions from '../../src/services/app/action';
import { store } from '../../src/store/configureStore';
import Toast from 'react-native-toast-message';
import deviceType from '../../src/config/deviceType';
import { updateAuthDevices } from '../../src/services/authDevices/action';
import Utils from '../../src/utils';

// Use fake timers to control async operations
jest.useFakeTimers();

describe('on Header mounting', () => {
  let tree;
  let component;

  beforeEach(() => {
    act(() => {
      store.dispatch(
        AppActionFunctions.updateAppModalFields('deviceType', deviceType.ms700),
      );
    });
    act(() => {
      component = renderer.create(<Header />);
    });
    tree = component.toJSON();
  });

  afterEach(() => {
    if (component) {
      act(() => {
        component.unmount();
      });
      component = null;
    }
    tree = null;
    // Clear all timers to prevent "Cannot log after tests are done" errors
    jest.clearAllTimers();
  });

  it('renders Header correctly', () => {
    expect(tree).toMatchSnapshot();
  });
});

describe('function test case for reading PoE override value', () => {
  let spy;

  beforeEach(() => {
    spy = jest.spyOn(BleManager, 'readCharacteristicForDevice');
    act(() => {
      store.dispatch(
        updateAuthDevices('connectedDevice', { id: 1, localName: 'Brx-emulator' }),
      );
    });
  });

  afterEach(() => {
    if (spy) {
      spy.mockRestore();
    }
    act(() => {
      store.dispatch(updateAuthDevices('connectedDevice', {}));
    });
    // Clear all timers to prevent "Cannot log after tests are done" errors
    jest.clearAllTimers();
  });

  it('should read PoE override value from BLE', async () => {
    await act(async () => {
      await store.dispatch(AppActionFunctions.readPoeOverride());
    });
    expect(spy).toHaveBeenCalled();
  });
});

describe('function test case for changing PoE override value', () => {
  let spy, toastSpy;

  beforeEach(() => {
    spy = jest.spyOn(BleManager, 'writeCharacteristicWithResponseForDevice');
    toastSpy = jest.spyOn(Utils, 'showToast');
    act(() => {
      store.dispatch(
        updateAuthDevices('connectedDevice', { id: 1, localName: 'Brx-emulator' }),
      );
    });
  });

  afterEach(() => {
    if (spy) {
      spy.mockRestore();
    }
    if (toastSpy) {
      toastSpy.mockRestore();
    }
    act(() => {
      store.dispatch(updateAuthDevices('connectedDevice', {}));
    });
    // Clear all timers to prevent "Cannot log after tests are done" errors
    jest.clearAllTimers();
  });

  it('should toggle PoE settings on ms700 device', async () => {
    await act(async () => {
      await store.dispatch(
        AppActionFunctions.togglePoeOverride(() => { }),
      );
    });
    expect(spy).toBeCalled();
    expect(toastSpy).toBeCalled();
  });
});
