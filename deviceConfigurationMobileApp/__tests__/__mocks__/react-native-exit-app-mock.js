jest.mock('react-native-exit-app', () => {
  return {
    exitApp: () => jest.fn(),
  };
});