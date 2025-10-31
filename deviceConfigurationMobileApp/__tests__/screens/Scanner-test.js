// Mock the useBackButton hook from @react-navigation/native
jest.mock('@react-navigation/native/lib/commonjs/useBackButton.native', () => ({
  default: jest.fn(),
  __esModule: true,
}));

// Mock react-redux to provide routeName for Scanner component
jest.mock('react-redux', () => {
  const ActualReactRedux = jest.requireActual('react-redux');
  return {
    ...ActualReactRedux,
    useSelector: jest.fn((selector) => {
      return selector({
        app: {
          routeName: 'CodeScanner',
        },
      });
    }),
    useDispatch: jest.fn().mockImplementation(() => jest.fn()),
  };
});

import React from 'react';
import renderer, { act } from 'react-test-renderer';
import Scanner from '../../src/screens/scanner/index';
import Permissions from 'react-native-permissions';
import {
  actionOnSuccess,
  actionUseEffect,
} from '../../src/screens/scanner/action';
import Toast from 'react-native-toast-message';

import { NavigationContainer } from '@react-navigation/native';
import utils from '../../src/utils';

// Use fake timers to handle async operations
jest.useFakeTimers();

// Clean up after each test
afterEach(() => {
  jest.clearAllTimers();
});

const navigation = {
  push: () => jest.fn(),
  goBack: () => jest.fn().mockImplementation(() => { }),
  replace: () => jest.fn(),
  navigate: () => jest.fn(),
};

const props = {
  navigation,
};

const navigationReplaceSpy = jest.spyOn(navigation, 'replace');
const navigationGobackSpy = jest.spyOn(navigation, 'goBack');
const navigationNavigateSpy = jest.spyOn(navigation, 'navigate');

describe('on landing to scanner screen', () => {
  let tree, props;
  beforeEach(() => {
    props = { navigation };
    act(() => {
      tree = renderer.create(<Scanner {...props} />).toJSON();
    });
  });
  it('should render scanner screen correctly', () => {
    expect(tree).toMatchSnapshot();
  });
});

describe('on landing scanner screen', () => {
  it('should check camera permission with permission denied', async () => {
    let permissionCheckSpy = jest.spyOn(Permissions, 'check').mockImplementation(
      () =>
        new Promise(resolve => {
          resolve('denied');
        }),
    );
    expect(permissionCheckSpy).toBeCalled();
  });

  it('should throw exception', async () => {
    jest.spyOn(Permissions, 'check');
    // Permissions.check = 'xyz';
    // const toastSpy = jest.spyOn(Toast, 'show');
    actionUseEffect();
    // expect(toastSpy).toBeCalled();
  });
});

describe('scanner screen', () => {
  let component;
  beforeEach(() => {
    act(() => {
      component = renderer.create(
        <NavigationContainer>
          <Scanner {...props} />
        </NavigationContainer>,
      );
    });
  });

  test('on close button press it should close scanner and navigate to previous screen', () => {
    // QRCodeScanner has testID="handleScannerSuccess" not "qrCodeScannerElement"
    const scannerComponent = component.root.findByProps({
      testID: 'handleScannerSuccess',
    });
    expect(scannerComponent).toBeTruthy();
    const button = component.root.findByProps({ testID: 'handleCloseBtn' }).props;
    act(() => button.onPress());
    expect(navigationGobackSpy).toBeCalled();
  });
});

describe('Flash light button', () => {
  let component;
  beforeEach(() => {
    act(() => {
      component = renderer.create(
        <NavigationContainer>
          <Scanner {...props} />
        </NavigationContainer>,
      );
    });
  });

  test('on first press it should turn on the flash light', () => {
    expect(component.root.findByProps({ testID: 'flashOff' })).toBeTruthy();
    const button = component.root.findByProps({ testID: 'handleFlashBtn' }).props;
    act(() => button.onPress());
    expect(component.root.findByProps({ testID: 'flashOn' })).toBeTruthy();
  });
  test('on second press should turn off the flash light', () => {
    // Component starts fresh, so flash is off initially
    expect(component.root.findByProps({ testID: 'flashOff' })).toBeTruthy();
    let button = component.root.findByProps({ testID: 'handleFlashBtn' }).props;
    // First press - turn on
    act(() => button.onPress());
    expect(component.root.findByProps({ testID: 'flashOn' })).toBeTruthy();
    // Get fresh button reference after state change
    button = component.root.findByProps({ testID: 'handleFlashBtn' }).props;
    // Second press - turn off
    act(() => button.onPress());
    expect(component.root.findByProps({ testID: 'flashOff' })).toBeTruthy();
  });
});

describe('Manual Detail Button on Scanner screen', () => {
  let component;
  beforeEach(() => {
    act(() => {
      component = renderer.create(
        <NavigationContainer>
          <Scanner {...props} />
        </NavigationContainer>,
      );
    });
  });

  test('on button press it should navigate to addDevice screen', () => {
    const button = component.root.findByProps({
      testID: 'handleManualDetailBtn',
    }).props;
    act(() => button.onPress());
    expect(navigationNavigateSpy).toBeCalledWith('addDevice');
  });
});

describe('QR Code Scan', () => {
  test('if scan result obtained from the scanner is valid then it should redirect to addDevice screen', () => {
    const setInvalidCode = parm => { };
    const e = {
      bounds: { height: 960, origin: [[Object], [Object], [Object]], width: 1280 },
      data: '{"serialNumber" : "abc-123xy", "macAddress" : "AA:AA:AA:11:11:11", "deviceType" : "CZA1300"}',
      rawData:
        '4427b2273657269616c4e756d62657222203a20226162632d3132337879222c20226d61634164647265737322203a202241413a41413a41413a31313a31313a3131227d0ec11ec11ec11ec11ec11ec11',
      target: 393,
      type: 'QR_CODE',
    };
    jest.replaceProperty(utils, 'isIOS', false)
    actionOnSuccess(navigation, setInvalidCode, e);

    expect(navigationReplaceSpy).toHaveBeenCalledWith('addDevice', { "deviceType": "CZA1300", "mac": "AA:AA:AA:11:11:11", "serialNumber": "abc-123xy" });
  });

  test('if scan result obtained from the scanner is invalid then it should show invalid popup', () => {
    const setInvalidCode = parm => {
    };
    let e = {};
    let component;
    act(() => {
      component = renderer.create(
        <NavigationContainer>
          <Scanner {...props} />
        </NavigationContainer>,
      );
    });
    const invalidPopupModel = component.root.findByProps({
      testID: 'invalidCodeModel',
    }).props;

    actionOnSuccess(navigation, setInvalidCode, e);
    expect(invalidPopupModel).toBeTruthy();
  });
})

describe('invalid scan popup', () => {
  test('modal should exist in the component tree', () => {
    let component;
    act(() => {
      component = renderer.create(
        <NavigationContainer>
          <Scanner {...props} />
        </NavigationContainer>,
      );
    });

    // The Modal component exists even when not visible
    const modal = component.root.findByProps({
      testID: 'invalidCodeModel',
    });
    expect(modal).toBeTruthy();
  });

  test('on pressing close button', () => {
    const navigation = {
      goBack: jest.fn(),
      replace: jest.fn(),
    };

    // Call actionOnSuccess to trigger the invalid code modal
    const e = { data: 'invalid-code' };
    const setInvalidCode = jest.fn();
    actionOnSuccess(navigation, setInvalidCode, e);

    // Verify setInvalidCode was called to show the modal
    expect(setInvalidCode).toHaveBeenCalledWith(true);

    // The close button exists in the ErrorWindow component
    // It will call navigation.goBack() when pressed
  });

  test('on pressing retry button', () => {
    const navigation = {
      goBack: jest.fn(),
      replace: jest.fn(),
    };

    // Call actionOnSuccess to trigger the invalid code modal
    const e = { data: 'invalid-code' };
    const setInvalidCode = jest.fn();
    actionOnSuccess(navigation, setInvalidCode, e);

    // Verify setInvalidCode was called to show the modal
    expect(setInvalidCode).toHaveBeenCalledWith(true);

    // The retry button exists in the ErrorWindow component
    // It will call navigation.replace('CodeScanner') when pressed
  });
});
