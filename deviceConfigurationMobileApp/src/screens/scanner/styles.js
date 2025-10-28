import { StyleSheet } from 'react-native';
import { Colors, Mixins, Typography } from '../../config/styles';
import Utils from '../../utils';

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.COLOR_000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBtnContainer: {
    height: Mixins.scaleSize(80),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Utils.isAndroid || Utils.isIpad ? Mixins.scaleSize(5) : Mixins.scaleSize(50),
    zIndex: 1
  },
  closebtn: {
    height: Mixins.scaleSize(80),
    width: Mixins.scaleSize(80),
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashbtn: {
    height: Mixins.scaleSize(80),
    width: Mixins.scaleSize(80),
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  QrContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    height: Mixins.scaleSize(100),
    width: Mixins.scaleSize(230),
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeScannerManual: {
    height: Mixins.scaleSize(230),
    width: Mixins.scaleSize(230),
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: Mixins.scaleSize(60),
  },
  enterCodeManual: {
    fontSize: 18,
    textDecorationLine: 'underline',
    fontWeight: '700',
    color: Colors.COLOR_5D9D52,
    fontSize:
      Utils.tablet || Utils.isIpad
        ? Typography.FONT_SIZE_12
        : Typography.FONT_SIZE_18,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
  },
  scanDeviceQrCode: {
    fontWeight: '300',
    color: Colors.COLOR_FFFFFF,
    fontSize:
      Utils.tablet || Utils.isIpad
        ? Typography.FONT_SIZE_12
        : Typography.FONT_SIZE_20,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
  },
  modelContainer: {
    flex: 1,
    height: Mixins.scaleSize(100),
    width: '85%',
    marginTop: Mixins.scaleSize(250),
    marginBottom: Mixins.scaleSize(300),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.COLOR_FFFFFF,
    borderRadius: 10,
    borderWidth: 5,
    marginLeft: Mixins.scaleSize(30),
    marginRight: Mixins.scaleSize(30),
  },
  modelSubContainer: {
    height: Mixins.scaleSize(50),
    width: '100%',
    flex: 1,
  },
  invalidCodeText: {
    alignSelf: 'center',
    marginTop: 30,
    justifyContent: 'flex-start',
    color: Colors.COLOR_FF0000,
    fontWeight: '300',
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize:
      Utils.tablet || Utils.isIpad
        ? Typography.FONT_SIZE_12
        : Typography.FONT_SIZE_18,
  },
  codeRetryContainer: {
    backgroundColor: Colors.COLOR_003D7D,
    height: Mixins.scaleSize(45),
    width: '80%',
    marginLeft: Mixins.scaleSize(30),
    marginRight: Mixins.scaleSize(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeRetryText: {
    color: Colors.COLOR_FFFFFF,
    fontWeight: '300',
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize:
      Utils.tablet || Utils.isIpad
        ? Typography.FONT_SIZE_12
        : Typography.FONT_SIZE_18,
  },
  cancelBtnContainer: {
    height: Mixins.scaleSize(45),
    width: '80%',
    marginTop: Mixins.scaleSize(10),
    marginLeft: Mixins.scaleSize(30),
    marginRight: Mixins.scaleSize(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: Colors.COLOR_003D7D,
    fontWeight: '600',
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize:
      Utils.tablet || Utils.isIpad
        ? Typography.FONT_SIZE_12
        : Typography.FONT_SIZE_16,
  },
  cameraStyle: {
    height: Mixins.scaleSize(232),
    width: Mixins.scaleSize(232),
    alignSelf: 'center',
    overflow: 'hidden',
  },
  cameraContainerStyle: {
    height: Mixins.scaleSize(240),
    width: Mixins.scaleSize(240),
    borderColor: Colors.COLOR_FB8C00,
    borderWidth: 4,
  },
  qrCameraContainerStyle: {
    height: Mixins.scaleSize(232),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Mixins.scaleSize(-74),
  },
  qrCodeTopContent: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCodeBottomContent: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
