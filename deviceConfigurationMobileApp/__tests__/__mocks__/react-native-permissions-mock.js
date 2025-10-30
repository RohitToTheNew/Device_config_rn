jest.mock('react-native-permissions', () => {
  return {
    openSettings: () => jest.fn(),
    check: jest.fn(() => new Promise(resolve => resolve('granted'))),
    request: jest.fn(() => new Promise(resolve => resolve('granted'))),
    PERMISSIONS: {
      IOS: {
        LOCATION_WHEN_IN_USE: 'ios.permission.LOCATION_WHEN_IN_USE',
        CAMERA: 'ios.permission.CAMERA',
      },
      ANDROID: {
        ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
        CAMERA: 'android.permission.CAMERA',
      },
    },
    RESULTS: {
      UNAVAILABLE: 'unavailable',
      BLOCKED: 'blocked',
      DENIED: 'denied',
      GRANTED: 'granted',
      LIMITED: 'limited',
    },
  };
});