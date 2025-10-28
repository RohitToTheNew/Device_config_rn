// Shim for ViewPropTypes which was removed from React Native 0.68+
import { ViewPropTypes as RNViewPropTypes } from 'deprecated-react-native-prop-types';

// Monkey patch React Native to include ViewPropTypes
if (typeof global !== 'undefined') {
    const ReactNative = require('react-native');

    if (!ReactNative.ViewPropTypes) {
        ReactNative.ViewPropTypes = RNViewPropTypes;
    }

    // Also patch it on the global object for libraries that access it directly
    if (!global.ViewPropTypes) {
        global.ViewPropTypes = RNViewPropTypes;
    }
}

