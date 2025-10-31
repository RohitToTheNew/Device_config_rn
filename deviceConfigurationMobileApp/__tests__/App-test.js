/**
 * @format
 */

import 'react-native';
import App from '../App';
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import SplashScreen from 'react-native-splash-screen';
import { store } from '../src/store/configureStore';
import { updateAppModalFields } from '../src/services/app/action';
import { cleanup } from '@testing-library/react-native';

// Mock translations
jest.mock('../src/translations/translationHelper', () => ({
  setI18nConfig: jest.fn(),
  translate: jest.fn((key) => key),
  translationGetters: {
    en: () => ({}),
  },
}));

afterEach(cleanup);
jest.useFakeTimers();
describe('on splashscreen launch', () => {
  let isHidden, splashSpy, component;
  beforeEach(() => {
    act(() => {
      store.dispatch(updateAppModalFields('appState', 'active'));
    });
    act(() => {
      component = renderer.create(<App />);
    });
    splashSpy = jest.spyOn(SplashScreen, 'hide');
    isHidden = SplashScreen.hide();
  });
  afterEach(() => {
    if (component) {
      act(() => {
        component.unmount();
      });
      component = null;
    }
    jest.clearAllTimers();
  });
  it('should hide the native splash screen', () => {
    expect(splashSpy).toHaveBeenCalled();
    expect(isHidden).toBe(true);
  });
});
