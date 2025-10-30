// Mock the useBackButton hook from @react-navigation/native
jest.mock('@react-navigation/native/lib/commonjs/useBackButton.native', () => ({
  default: jest.fn(),
  __esModule: true,
}));

import React from 'react';
import renderer, { act } from 'react-test-renderer';
import SchoolDevicesList from '../../src/screens/schoolDeviceList';
import { NavigationContainer } from '@react-navigation/native';

// Use fake timers to handle async operations
jest.useFakeTimers();

// Clean up after each test
afterEach(() => {
  jest.clearAllTimers();
});

let tree;
let SchoolTitile = 'School1';
let dataToRender = [
  {
    devices: [
      {
        deviceName: 'Device 1 for Room 2',
        macAddress: 'Macaaaaaaaaaaaaaa',
        serialNumber: 'aaaa',
      },
      {
        deviceName: 'Device 2 for Room 2',
        macAddress: 'MacAddresssssssss',
        serialNumber: 'serial number',
      },
    ],
    id: 1,
    title: 'Room 1',
  },
];

const props = {
  route: { params: { SchoolTitile, dataToRender } },
  navigation: { push: () => jest.fn() },
};

describe('on landing to SchoolDevicesList', () => {
  beforeEach(() => {
    act(() => {
      tree = renderer.create(
        <NavigationContainer>
          <SchoolDevicesList {...props} />
        </NavigationContainer>
      ).toJSON();
    });
  });
  it('should render SchoolDevicesList correctly', () => {
    expect(tree).toMatchSnapshot();
  });
});

describe('scanner icon', () => {
  it('if scanner icon pressed navigate to CodeScanner', () => {
    const navigationSpy = jest.spyOn(props.navigation, 'push');
    let component;
    act(() => {
      component = renderer.create(
        <NavigationContainer>
          <SchoolDevicesList {...props} />
        </NavigationContainer>,
      );
    });
    const codeScanIcon = component.root.findByProps({
      testID: 'codeScan',
    }).props;
    act(() => {
      codeScanIcon.onPress();
    });
    expect(navigationSpy).toHaveBeenCalled();
  });
});
