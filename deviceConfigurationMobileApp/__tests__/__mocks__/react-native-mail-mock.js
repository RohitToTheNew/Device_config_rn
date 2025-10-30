jest.mock('react-native-mail', () => {
  return {
    // mail: jest.fn().mockImplementation(() => Promise.reject(false)),
    mail(arg, callback){
        callback('dummy','success');
    }
  };
});
