import React, { useEffect } from 'react';

import { Provider } from 'react-redux';
import ENV from './src/config/envs/env.json';
import { CustomLoader } from './src/components';
import * as Sentry from "@sentry/react-native";
import Toast from 'react-native-toast-message';
const { dsn, tracesSampleRate, environment } = ENV;
import SplashScreen from 'react-native-splash-screen';
import RootNavigator from './src/navigation/rootNavigator';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/store/configureStore';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { setI18nConfig } from './src/translations/translationHelper';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
    setI18nConfig();
  }, []);

  /**
   * initializing the sentry sdk
   */
  Sentry.init({
    dsn: dsn,
    tracesSampleRate: tracesSampleRate,
    environment: environment
  });

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <RootNavigator />
        </SafeAreaProvider>
        <Toast />
      </PersistGate>
      <CustomLoader />
    </Provider>
  );
};
export default Sentry.wrap(App);
