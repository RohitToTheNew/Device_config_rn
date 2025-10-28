import { StyleSheet } from 'react-native';
import { Colors, Mixins, Typography } from '../../config/styles';
import Utils from '../../utils';

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: Colors.COLOR_FFFFFF,
    alignItems: 'center',
  },
  keyBoardContainer: {
    flex: 1,
    alignItems: 'center',
  },
  enterPasscodeHeading: {
    fontWeight: '700',
    textAlign: 'center',
    color: Colors.COLOR_FB8C00,
    marginTop: (Utils.isIpad || Utils.tablet) ? Mixins.scaleSize(19) : Mixins.scaleSize(39),
    fontSize: Typography.FONT_SIZE_22,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
  },
  enterPasscodeDescription: {
    fontWeight: '400',
    textAlign: 'center',
    color: Colors.COLOR_484949,
    marginTop: Mixins.scaleSize(12),
    fontSize: Typography.FONT_SIZE_14,
    marginBottom: (Utils.isIpad || Utils.tablet) ? Mixins.scaleSize(22) : Mixins.scaleSize(52),
    marginHorizontal: Mixins.scaleSize(32),
    fontFamily: Typography.FONT_FAMILY_REGULAR,
  },
  header: {
    width: '100%',
    paddingStart: Mixins.scaleSize(16),
    marginTop: Mixins.scaleSize(51),
  },
  connectButton: {
    width: Mixins.scaleSize(220),
    height: Mixins.scaleSize(46),
    marginTop: (Utils.isIpad || Utils.tablet) ? Mixins.scaleSize(27) : Mixins.scaleSize(47),
  },
  bgImageIOS: {
    position: 'absolute',
    bottom: Utils.isIphone8() ? Mixins.scaleSize(70) : Utils.isIpad ? Mixins.scaleSize(26) : Mixins.scaleSize(186),
    alignSelf: 'center',
  },
  bgImageAndroid: {
    marginTop: Utils.tablet ? Mixins.scaleSize(20) : Mixins.scaleSize(70),
    alignSelf: 'center',
  },
  disabledStyle: {
    backgroundColor: Colors.COLOR_003D7D80,
  },
});

export default styles;
