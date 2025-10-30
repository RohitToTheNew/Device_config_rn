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

import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import renderer, { act as rendererAct } from 'react-test-renderer';
import Volumes from '../../../src/screens/volumes';

describe('on successful auth with BLE', () => {
  let tree;

  beforeEach(() => {
    // Suppress console warnings for this test
    const originalWarn = console.warn;
    const originalError = console.error;
    console.warn = jest.fn();
    console.error = jest.fn();

    tree = renderer
      .create(
        <NavigationContainer>
          <Volumes />
        </NavigationContainer>,
      )
      .toJSON();

    // Restore console
    console.warn = originalWarn;
    console.error = originalError;
  });

  it('should renders volumes screen correctly', () => {
    expect(tree).toMatchSnapshot();
  });
});
