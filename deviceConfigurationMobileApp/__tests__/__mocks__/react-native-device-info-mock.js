jest.mock('react-native-device-info', () => {
  return {
    isTablet: jest.fn(() => true),
    getDeviceId: jest.fn(() => '123456'),
  };
});
