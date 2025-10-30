// Mock the BLE devices actions before importing the component
jest.mock('../../src/services/bleDevices/action', () => {
  const originalModule = jest.requireActual('../../src/services/bleDevices/action');
  return {
    ...originalModule,
    handleUpdateProcess: jest.fn((devicePressed, passcode, navigation, callback) => {
      return (dispatch) => {
        callback && callback();
        navigation.navigate('HomeScreen');
        return Promise.resolve();
      };
    }),
    handleAuthProcess: jest.fn((devicePressed, passcode, navigation, successCallback, errorCallback) => {
      return (dispatch) => {
        successCallback && successCallback();
        navigation.navigate('HomeScreen');
        return Promise.resolve();
      };
    }),
  };
});

import React from 'react';
import renderer, { act } from 'react-test-renderer';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { store } from '../../src/store/configureStore';

import SetPasscode from '../../src/screens/setPasscode';
import { updateAppModalFields } from '../../src/services/app/action';
import { updateAuthDevices } from '../../src/services/authDevices/action';

// Use fake timers to handle async operations
jest.useFakeTimers();

// Clean up after each test
afterEach(() => {
  cleanup();
  jest.clearAllTimers();
});

describe('on landing to SetPasscode screen', () => {
  let tree, props;
  beforeEach(() => {
    props = {
      route: {
        params: {
          isUpdateScreen: false,
          devicePressed: { id: 'Brx-emulator', localName: 'Brx-emulator' },
        },
      },
    };
    act(() => {
      tree = renderer.create(<SetPasscode {...props} />).toJSON();
    });
  });

  it('should render SetPasscode correctly', () => {
    expect(tree).toMatchSnapshot();
  });
});

describe('SetPasscode screen test with update passcode flow', () => {
  let props, setPasscodeHeading, navigation, navigationSpy;

  beforeEach(() => {
    navigation = { navigate: jest.fn(), goBack: jest.fn() };
    navigationSpy = jest.spyOn(navigation, 'navigate');
    props = {
      route: {
        params: {
          isUpdateScreen: true,
          devicePressed: { id: 'Brx-emulator', localName: 'Brx-emulator', deviceType: 'MS700' },
        },
      },
      navigation,
    };
    // Set up connectedDevice for the update process
    store.dispatch(updateAuthDevices('connectedDevice', { id: 'Brx-emulator', localName: 'Brx-emulator', deviceType: 'MS700' }));
    store.dispatch(updateAppModalFields('isFoldableDevice', false));
    store.dispatch(updateAuthDevices('authenticatedDevices', []));
    render(<SetPasscode {...props} />);
    setPasscodeHeading = screen.getByTestId('setPasscodeHeading');
  });

  it('should render the update passcode screen with textinput', () => {
    expect(setPasscodeHeading).toBeTruthy();
    expect(screen.getByTestId('setPasscodeBG')).toBeTruthy();
    expect(screen.getByTestId('passcodeInput')).toBeTruthy();
  });
  it('should trigger textinput and enter 111111 as dummy passcode for auth flow', async () => {
    fireEvent.changeText(
      screen.getByTestId('passcodeInput'),
      '111111',
    );
    fireEvent.press(screen.getByTestId('updateButton'));
    await waitFor(() => {
      expect(navigationSpy).toBeCalledWith('HomeScreen');
    });
  });
});

describe('SetPasscode screen test with login with passcode flow', () => {
  let props, setPasscodeHeading, navigation, navigationSpy;

  beforeEach(() => {
    navigation = { navigate: jest.fn(), replace: jest.fn() };
    navigationSpy = jest.spyOn(navigation, 'navigate');
    props = {
      route: {
        params: {
          isUpdateScreen: false,
          devicePressed: { id: 'Brx-emulator', localName: 'Brx-emulator', deviceType: 'MS700' },
        },
      },
      navigation,
    };
    store.dispatch(updateAppModalFields('isFoldableDevice', false));
    store.dispatch(updateAuthDevices('authenticatedDevices', []));
    render(<SetPasscode {...props} />);
    setPasscodeHeading = screen.getByTestId('setPasscodeHeading');
  });

  it('should render the login with passcode screen with textinput', async () => {
    expect(setPasscodeHeading).toBeTruthy();
    expect(screen.getByTestId('setPasscodeBG')).toBeTruthy();
    expect(screen.getByTestId('passcodeInput')).toBeTruthy();
    fireEvent.changeText(
      screen.getByTestId('passcodeInput'),
      '111111',
    );
    fireEvent.press(screen.getByTestId('updateButton'));
    await waitFor(() => {
      expect(navigationSpy).toBeCalledWith('HomeScreen');
    });
  });
});
