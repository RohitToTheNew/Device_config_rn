import React from 'react';
import renderer from 'react-test-renderer';
import BleManager from '../../src/config/bleManagerInstance';
import { Header } from '../../src/components';
import * as AppActionFunctions from '../../src/services/app/action';
import { store } from '../../src/store/configureStore';
import Toast from 'react-native-toast-message';
import deviceType from '../../src/config/deviceType';
import { updateAuthDevices } from '../../src/services/authDevices/action';

describe('on Header mounting', () => {
  let tree;
  beforeEach(() => {
    store.dispatch(
      AppActionFunctions.updateAppModalFields('deviceType', deviceType.ms700),
    );
    tree = renderer.create(<Header />).toJSON();
  });

  it('renders Header correctly', () => {
    expect(tree).toMatchSnapshot();
  });
});

describe('function test case for reading PoE override value', () => {
  let spy;
  beforeAll(async () => {
    spy = jest.spyOn(BleManager, 'readCharacteristicForDevice');
    store.dispatch(
      updateAuthDevices('connectedDevice', { id: 1, localName: 'Brx-emulator' }),
    );
    await store.dispatch(AppActionFunctions.readPoeOverride());
  });
  it('should read PoE override value from BLE', async () => {
    expect(spy).toHaveBeenCalled();
  });
});

describe('function test case for changing PoE override value', () => {
  let spy, toastSpy;

  beforeAll(async () => {
    spy = jest.spyOn(BleManager, 'writeCharacteristicWithResponseForDevice');
    toastSpy = jest.spyOn(Toast, 'show');
    store.dispatch(
      updateAuthDevices('connectedDevice', { id: 1, localName: 'Brx-emulator' }),
    );
    await store.dispatch(
      AppActionFunctions.togglePoeOverride(() => { }),
    );
  });
  it('should toggle PoE settings on ms700 device', () => {
    expect(spy).toBeCalled();
    expect(toastSpy).toBeCalled();
  });
});
