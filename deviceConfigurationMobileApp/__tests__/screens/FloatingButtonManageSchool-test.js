// Mock the useBackButton hook from @react-navigation/native
jest.mock('@react-navigation/native/lib/commonjs/useBackButton.native', () => ({
  default: jest.fn(),
  __esModule: true,
}));

// Mock react-redux to provide showManageSchool state
jest.mock('react-redux', () => {
  const ActualReactRedux = jest.requireActual('react-redux');
  return {
    ...ActualReactRedux,
    useSelector: jest.fn((selector) => {
      return selector({
        app: {
          showManageSchool: true,
        },
      });
    }),
    useDispatch: jest.fn().mockImplementation(() => jest.fn()),
  };
});

import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import FloatingButtonManageSchool from '../../src/components/floatingButtonManageSchool';

// Use fake timers to handle async operations
jest.useFakeTimers();

let tree;

const props = {
  extraStyles: undefined,
  navigation: { push: jest.fn() },
};

describe('on Floating button for Manage School render', () => {
  beforeEach(() => {
    let component;
    act(() => {
      component = renderer.create(
        <NavigationContainer>
          <FloatingButtonManageSchool {...props} />
        </NavigationContainer>
      );
    });
    tree = component.toJSON();
  });

  it('should render Floating button correctly', () => {
    expect(tree).toMatchSnapshot();
  });
});

describe('Floating button icon', () => {
  it('if manageSchoolIcon pressed navigate to manageSchool', () => {
    let component;
    const navigationSpy = jest.spyOn(props.navigation, 'push');

    act(() => {
      component = renderer.create(
        <NavigationContainer>
          <FloatingButtonManageSchool {...props} />
        </NavigationContainer>,
      );
    });

    const manageSchoolIcon = component.root.findByProps({
      testID: 'manageSchoolButton',
    });

    act(() => {
      manageSchoolIcon.props.onPress();
    });

    expect(navigationSpy).toHaveBeenCalled();
  });
});
