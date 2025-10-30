/**
 * @format
 */

import 'react-native';
import App from '../App';
import React from 'react';
import renderer from 'react-test-renderer';
import SplashScreen from 'react-native-splash-screen';
import {store} from '../src/store/configureStore';
import {updateAppModalFields} from '../src/services/app/action';
import {cleanup} from '@testing-library/react-native';

afterEach(cleanup);
jest.useFakeTimers();
describe('on splashscreen launch', () => {
  let isHidden, splashSpy;
  beforeEach(() => {
    store.dispatch(updateAppModalFields('appState', 'active'));
    renderer.create(<App />);
    splashSpy = jest.spyOn(SplashScreen, 'hide');
    isHidden = SplashScreen.hide();
  });
  it('should hide the native splash screen', () => {
    expect(splashSpy).toHaveBeenCalled();
    expect(isHidden).toBe(true);
  });
});
