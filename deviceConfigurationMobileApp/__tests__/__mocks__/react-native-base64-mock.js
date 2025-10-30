jest.mock('react-native-base64', () => ({
    decode: () => "20",
    encode: () => "MjA="
}));