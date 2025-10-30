import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import renderer from 'react-test-renderer';
import Volumes from '../../../src/screens/volumes';

describe('on successful auth with BLE', () => {
  let tree;

  beforeEach(() => {
    tree = renderer
      .create(
        <NavigationContainer>
          <Volumes />
        </NavigationContainer>,
      )
      .toJSON();
  });

  it('should renders volumes screen correctly', () => {
    expect(tree).toMatchSnapshot();
  });
});
