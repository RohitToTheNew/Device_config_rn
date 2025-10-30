jest.mock("react-native-splash-screen",()=>{
    return {
        hide: ()=>true
    }
});