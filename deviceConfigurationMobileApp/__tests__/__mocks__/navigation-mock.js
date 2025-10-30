jest.mock("@react-navigation/native-stack",()=>{
    return {
        createNativeStackNavigator: ()=>true
    }
});
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
