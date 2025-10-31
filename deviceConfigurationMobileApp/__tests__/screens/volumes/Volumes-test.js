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

// Mock the volumes action
jest.mock('../../../src/services/volumes/action', () => ({
  getBypassEQSetting: jest.fn(() => ({ type: 'MOCK_GET_BYPASS_EQ' })),
}));

import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Provider } from 'react-redux';
import { store } from '../../../src/store/configureStore';
import Volumes from '../../../src/screens/volumes';
import { updateAuthDevices } from '../../../src/services/authDevices/action';
import deviceType from '../../../src/config/deviceType';

jest.useFakeTimers();

describe('on successful auth with BLE', () => {
  let tree, component, navigation;

  beforeEach(() => {
    // Mock navigation
    navigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };

    // Set up connected device in store
    act(() => {
      store.dispatch(
        updateAuthDevices('connectedDevice', {
          id: 'test-device',
          localName: 'Test Device',
          deviceType: deviceType.ms700,
        })
      );
    });

    // Suppress console warnings during rendering
    const originalWarn = console.warn;
    const originalError = console.error;
    console.warn = jest.fn();
    console.error = jest.fn();

    component = renderer.create(
      <Provider store={store}>
        <NavigationContainer>
          <Volumes navigation={navigation} />
        </NavigationContainer>
      </Provider>,
    );
    tree = component.toJSON();

    // Restore console
    console.warn = originalWarn;
    console.error = originalError;
  });

  afterEach(() => {
    if (component) {
      component.unmount();
      component = null;
    }
    tree = null;
    // Clean up store
    act(() => {
      store.dispatch(updateAuthDevices('connectedDevice', {}));
    });
    jest.clearAllTimers();
  });

  it('should renders volumes screen correctly', () => {
    expect(tree).toMatchSnapshot();
  });
});
