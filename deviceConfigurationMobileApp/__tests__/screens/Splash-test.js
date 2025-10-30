import React from 'react';
import thunk from 'redux-thunk';
import Utils from '../../src/utils';
import { Provider } from 'react-redux';
import renderer, { act } from 'react-test-renderer';
import Splash from '../../src/screens/splash';
import configureMockStore from 'redux-mock-store';
import Permissions from 'react-native-permissions';
import BleManager from '../../src/config/bleManagerInstance';
import { checkLocationPermission } from '../../src/services/splash/action';
import Toast from 'react-native-toast-message';

const mockStore = configureMockStore([thunk]);

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

describe('on splash screen animation launch', () => {
  let tree;
  beforeEach(() => {
    act(() => {
      tree = renderer.create(<Splash />).toJSON();
    });
  });

  it('renders splashscreen correctly', () => {
    expect(tree).toMatchSnapshot();
  });
});

describe('splash screen animation launch, check if android, then enable bluetooth on android automatically', () => {
  let component, bleManagerSpy;
  beforeEach(() => {
    Utils.isAndroid = true;
    bleManagerSpy = jest.spyOn(BleManager, 'enable');
    const store = mockStore({
      app: { bluetoothState: 'PoweredOff' },
    });
    act(() => {
      component = renderer.create(
        <Provider store={store}>
          <Splash />
        </Provider>,
      );
    });
  });
  it('renders splashscreen correctly and enable bluetooth on android', () => {
    const lottie = component.root.findByProps({ testID: 'lottie' });
    act(() => {
      lottie.props.onAnimationFinish();
    });
    expect(bleManagerSpy).toBeCalled();
  });
});

describe('function test case for checking location permission with granted', () => {
  let navigation, navigationSpy;

  beforeEach(() => {
    navigation = { navigate: jest.fn(), replace: jest.fn() };
    navigationSpy = jest.spyOn(navigation, 'replace');
    jest.spyOn(Permissions, 'check').mockResolvedValue('granted');
  });
  it('should check location permission with user when splash finishes', done => {
    checkLocationPermission(navigation);
    setImmediate(() => {
      expect(navigationSpy).toHaveBeenCalledWith('TurnOnBluetooth');
      done();
    });
  });
});

describe('function test case for checking location permission with denied, then request granted', () => {
  let navigation, navigationSpy, requestPermissionSpy;

  beforeEach(() => {
    navigation = { navigate: jest.fn(), replace: jest.fn() };
    navigationSpy = jest.spyOn(navigation, 'replace');
    jest
      .spyOn(Permissions, 'check')
      .mockImplementation(() => Promise.resolve('denied'));
    requestPermissionSpy = jest.spyOn(Permissions, 'request').mockResolvedValue('granted');
  });
  it('should check location permission with user when splash finishes', done => {
    checkLocationPermission(navigation);
    setImmediate(() => {
      expect(requestPermissionSpy).toBeCalled();
      done();
    });
  });
});

describe('function test case for checking location permission for unrecognized permission', () => {
  let navigation, requestPermissionSpy;
  beforeEach(() => {
    navigation = { navigate: jest.fn(), replace: jest.fn() };
    jest
      .spyOn(Permissions, 'check')
      .mockImplementation(() => Promise.resolve('xyz'));
    requestPermissionSpy = jest.spyOn(Permissions, 'request').mockResolvedValue('granted');
  });
  it('should call requestLocationPermission when unrecognized permission status', done => {
    checkLocationPermission(navigation);
    // Wait for promise chain to complete
    setImmediate(() => {
      expect(requestPermissionSpy).toBeCalled();
      done();
    });
  });
});

describe('function test case for checking location permission with limited permission', () => {
  let navigation, navigationSpy;
  beforeEach(() => {
    navigation = { navigate: jest.fn(), replace: jest.fn() };
    navigationSpy = jest.spyOn(navigation, 'replace');
    jest.spyOn(Permissions, 'check').mockResolvedValue('denied');
    jest
      .spyOn(Permissions, 'request')
      .mockImplementation(() => Promise.resolve('limited'));
  });
  it('should check location permission with user when splash finishes', done => {
    checkLocationPermission(navigation);
    setImmediate(() => {
      expect(navigationSpy).toBeCalledWith('TurnOnBluetooth');
      done();
    });
  });
});

describe('function test case for checking location permission with unavailable location permission', () => {
  let navigation, requestPermissionSpy;
  beforeEach(() => {
    navigation = { navigate: jest.fn(), replace: jest.fn() };
    jest.spyOn(Permissions, 'check').mockResolvedValue('denied');
    requestPermissionSpy = jest
      .spyOn(Permissions, 'request')
      .mockImplementation(() => Promise.resolve('unavailable'));
  });
  it('should call request but do nothing when permission is unavailable', done => {
    checkLocationPermission(navigation);
    setImmediate(() => {
      expect(requestPermissionSpy).toBeCalled();
      done();
    });
  });
});

describe('function test case for checking location permission with error case', () => {
  let navigation, logSpy;
  beforeEach(() => {
    navigation = { navigate: jest.fn(), replace: jest.fn() };
    jest.spyOn(Permissions, 'check').mockRejectedValue(new Error('Permission error'));
    logSpy = jest.spyOn(Utils, 'Log');
  });
  it('should log error when permission check fails', done => {
    checkLocationPermission(navigation);
    setImmediate(() => {
      expect(logSpy).toBeCalledWith(Utils.logType.error, 'checkLocationPermission', expect.any(Error));
      done();
    });
  });
});
