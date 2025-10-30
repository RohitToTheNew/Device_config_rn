// Mock the useBackButton hook from @react-navigation/native
jest.mock('@react-navigation/native/lib/commonjs/useBackButton.native', () => ({
  default: jest.fn(),
  __esModule: true,
}));

import React from 'react';
import ManageSchool from '../../src/screens/manageSchool/index';
import { NavigationContainer } from '@react-navigation/native';
import { render } from '@testing-library/react-native';
import renderer, { act } from 'react-test-renderer';
import RNFS from 'react-native-fs';
import { getSavedData, handleExportCSV, getDataInDesiredFormate, writeDataTolocalStorage, sendCSVAsMail, writeCSVDataTolocalStorage } from '../../src/screens/manageSchool/action';
import Mailer from 'react-native-mail';

// Use fake timers to handle async operations
jest.useFakeTimers();

// Clean up after each test
afterEach(() => {
  jest.clearAllTimers();
});

describe('on landing to manage school', () => {
  let component, props;
  beforeEach(() => {
    props = { navigation: { push: () => jest.fn() } };
    component = (
      <NavigationContainer>
        <ManageSchool {...props} />
      </NavigationContainer>
    );
    render(component);
  });
  it('should render manage school correctly', () => {
    expect(component).toMatchSnapshot();
  });
});

describe('if raw parms provided to getDataInDesiredFormate function', () => {
  const parms = [
    {
      id: 1,
      title: 'Room 1 for School 3',
      devices: [
        {
          macAddress: 'MACADDRESSSSSSSS5',
          serialNumber: 'Serial number 5',
          deviceName: "Suresh's Device",
          deviceType: 'MS700',
          deviceID: 1,
        },
      ],
    },
    {
      id: 2,
      title: 'Room 2 for School 3',
      devices: [
        {
          macAddress: 'MACADDRESSSSSSSS6',
          serialNumber: 'Serial number 6',
          deviceName: "Hitesh's Device",
          deviceType: 'MS700',
          deviceID: 1,
        },
      ],
    },
    {
      id: 3,
      title: 'Room 3 for School 3',
      devices: [
        {
          macAddress: 'MACADDRESSSSSSSS4',
          serialNumber: 'Serial number 4',
          deviceName: "Rakesh's Device",
          deviceType: 'InfoViewPlayer',
          deviceID: 1,
        },
      ],
    },
  ];

  test('it should make it in desired CSV formate', async () => {
    const result = getDataInDesiredFormate(parms);
    expect(result).toStrictEqual([
      {
        ip: '',
        deviceName: "Suresh's Device",
        driverName: 'MS700',
        mac: 'MACADDRESSSSSSSS5',
        roomName: 'Room 1 for School 3',
      },
      {
        ip: '',
        deviceName: "Hitesh's Device",
        driverName: 'MS700',
        mac: 'MACADDRESSSSSSSS6',
        roomName: 'Room 2 for School 3',
      },
      {
        ip: '',
        deviceName: "Rakesh's Device",
        driverName: 'InfoViewPlayer',
        mac: 'MACADDRESSSSSSSS4',
        roomName: 'Room 3 for School 3',
      },
    ]);
  });
});

describe('Write file', () => {
  const mockData = [
    {
      id: 1,
      title: 'School 1',
      rooms: [
        {
          id: 1,
          title: 'Room 1 for School 1',
          devices: [
            {
              macAddress: 'macaddreeesssss12',
              serialNumber: 'serial number 2',
              deviceName: "Developer's device",
              deviceType: 'MS700',
              deviceID: 2,
            },
          ],
        },
      ],
    },
  ];

  test('should write a file', async () => {
    const result = await writeDataTolocalStorage(mockData);
    expect(result).toEqual('FILE WRITTEN!');
  });
  test('should write a file CSV formate', async () => {
    const result = await writeCSVDataTolocalStorage(mockData);
    expect(result).toEqual('FILE WRITTEN!');
  });
  test('should throw an error while write a file', async () => {
    jest.spyOn(RNFS, 'writeFile').mockImplementation(() => {
      throw new Error('Error while writing');
    });

    const result = await writeDataTolocalStorage(mockData);
    expect(result).toEqual('Error while writing');
  });
  test('should throw an error while write a file for CSV', async () => {
    jest.spyOn(RNFS, 'writeFile').mockImplementation(() => {
      throw new Error('Error while writing');
    });

    const result = await writeCSVDataTolocalStorage(mockData);
    expect(result).toEqual('Error while writing');
  });
});

describe('mail test', () => {
  const mailSpy = jest.spyOn(Mailer, 'mail');
  sendCSVAsMail();
  expect(mailSpy).toBeCalled();
})

describe('delete school', () => {
  let tree, props, component;
  beforeEach(() => {
    props = { navigation: { push: () => jest.fn() } };
    act(() => {
      const testRenderer = renderer.create(
        <NavigationContainer>
          <ManageSchool {...props} />
        </NavigationContainer>,
      );
      tree = testRenderer.toJSON();
      component = testRenderer;
    });
  });

  test('delete button press', () => {
    const button = component.root.findByProps({ testID: 'deleteAlert' }).props;
    act(() => button.onPress());

    const model = component.root.findByProps({ testID: 'modelAlert' }).props;
    expect(model).toBeTruthy();

    const alertConfirm = component.root.findByProps({ testID: 'alertPopup' }).props;
    act(() => alertConfirm.onPress());

    const writeFileSpy = jest.spyOn(RNFS, 'writeFile');
    expect(writeFileSpy).toBeCalled();

  });
})

