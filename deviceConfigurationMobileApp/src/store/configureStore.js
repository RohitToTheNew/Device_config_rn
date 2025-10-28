import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import rootReducer from './rootReducer';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const enhancers = [
  applyMiddleware(
    thunk,
    createLogger({
      collapsed: true,
    }),
  ),
];

const enhancer = compose(...enhancers);

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['authDevices'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, {}, enhancer);
export const persistor = persistStore(store);

export default {
  store,
  persistor,
};
