import { StyleSheet } from 'react-native';
import { Colors, Mixins, Typography } from '../../config/styles';
import Utils from '../../utils';

const styles = StyleSheet.create({
  thumbTextStyle: {
    fontWeight: '700',
    top: Utils.isIpad ? Mixins.scaleSize(35) : Mixins.scaleSize(45),
    color: Colors.COLOR_484949,
    fontSize: Typography.FONT_SIZE_10,
    lineHeight: Typography.LINE_HEIGHT_13,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
  },
  thumbStyle: (isDisabled, byPassEQ) => ({
    borderRadius: 4,
    width: Mixins.scaleSize(18),
    height: Mixins.scaleSize(18),
    backgroundColor: byPassEQ
      ? Colors.COLOR_7E96B0
      : isDisabled
        ? Colors.COLOR_808284
        : Colors.COLOR_003D7D,
  }),
  slider: {
    alignSelf: 'center',
    width: Mixins.scaleSize(323),
  },
  trackStyle: {
    height: Mixins.scaleSize(6),
    borderRadius: 15,
  },
});

export default styles;
