jest.mock('react-native-localize', () => {
  return {
    findBestAvailableLanguage: () => true,
  };
});
