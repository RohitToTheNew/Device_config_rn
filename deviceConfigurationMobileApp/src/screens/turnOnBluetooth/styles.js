import { StyleSheet } from 'react-native';
import { Colors, Mixins, Typography } from '../../config/styles';
import Utils from '../../utils';

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: Colors.COLOR_FFFFFF,
  },
  button: {
    zIndex: 11,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: Mixins.scaleSize(40),
    marginTop: Mixins.scaleSize(450),
    borderRadius: Mixins.scaleSize(20),
    backgroundColor: Colors.COLOR_003D7D,
    width: Mixins.scaleSize(Mixins.WINDOW_WIDTH - 80),
  },
  waveImage: {
    zIndex: -1,
    position: 'absolute',
    height:
      Utils.isIpad || Utils.tablet
        ? Mixins.scaleSize(800)
        : Mixins.scaleSize(1000),
    marginTop: Utils.isIphone8()
      ? Mixins.scaleSize(-580)
      : Mixins.scaleSize(-500),
    width:
      Utils.isIpad || Utils.tablet
        ? Mixins.scaleSize(375)
        : Mixins.scaleSize(Mixins.WINDOW_WIDTH + 1),
  },
  qrcode: {
    position: 'absolute',
    // top: (Utils.isIpad || Utils.tablet)? Mixins.scaleSize(23) : Mixins.scaleSize(33),
    top:
      Utils.isIpad || Utils.tablet
        ? Mixins.scaleSize(23)
        : Utils.isIphone8()
          ? Mixins.scaleSize(33)
          : Mixins.scaleSize(53),
    right: Mixins.scaleSize(16),
  },
  manageSchoolButton: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    justifyContent: 'center',
    height: Mixins.scaleSize(54),
    width: Mixins.scaleSize(198),
    bottom: Mixins.scaleSize(37),
    borderRadius: Mixins.scaleSize(4),
    backgroundColor: Colors.COLOR_5D9D52,
  },
  manageSchoolText: {
    fontWeight: '700',
    color: Colors.COLOR_FFFFFF,
    fontSize: Typography.FONT_SIZE_14,
    marginStart: Mixins.scaleSize(13.5),
    fontFamily: Typography.FONT_FAMILY_REGULAR,
  },
  turnOnBluetoothText: {
    fontWeight: '700',
    textAlign: 'center',
    color: Colors.COLOR_484949,
    fontSize:
      Utils.isIpad || Utils.tablet
        ? Typography.FONT_SIZE_14
        : Typography.FONT_SIZE_18,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
  },
  turnOnTitle: {
    fontWeight: '700',
    alignSelf: 'center',
    color: Colors.COLOR_003D7D,
    fontSize:
      Utils.isIpad || Utils.tablet
        ? Typography.FONT_SIZE_12
        : Typography.FONT_SIZE_16,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
  },
  turnOnButton: {
    alignSelf: 'center',
    marginTop:
      Utils.isIpad || Utils.tablet
        ? Mixins.scaleSize(20)
        : Utils.isIphone8()
          ? Mixins.scaleSize(21)
          : Mixins.scaleSize(41),
    zIndex: 99,
  },
  turnOnButton: {
    alignSelf: 'center',
    marginTop:
      Utils.isIpad || Utils.tablet
        ? Mixins.scaleSize(20)
        : Utils.isIphone8()
          ? Mixins.scaleSize(21)
          : Mixins.scaleSize(41),
    zIndex: 99,
  },
  searchingForText: {
    fontWeight: '700',
    alignSelf: 'center',
    color: Colors.COLOR_FFFFFF,
    marginTop: Mixins.scaleSize(50),
    fontSize:
      Utils.isIpad || Utils.tablet
        ? Typography.FONT_SIZE_14
        : Typography.FONT_SIZE_18,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
  },
  bluetoothButton: {
    zIndex: 99,
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'white',
    justifyContent: 'center',
    width: Mixins.scaleSize(80),
    left: Mixins.scaleSize(111),
    height: Mixins.scaleSize(80),
    borderRadius: Mixins.scaleSize(40),
    top:
      Utils.isIpad || Utils.tablet
        ? Mixins.scaleSize(111)
        : Mixins.scaleSize(111),
  },
  circularWaveStyle: {
    zIndex: 55,
    alignItems: 'center',
    width: Mixins.scaleSize(300),
    height: Mixins.scaleSize(300),
  },
  circularWaveContainer: {
    alignSelf: 'center',
    width: Mixins.scaleSize(300),
    height: Mixins.scaleSize(300),
    marginTop:
      Utils.isIpad || Utils.tablet
        ? Mixins.scaleSize(50)
        : Utils.isIphone8()
          ? Mixins.scaleSize(60)
          : Mixins.scaleSize(120),
  },
});

export default styles;
