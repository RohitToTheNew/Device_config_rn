import { StyleSheet } from 'react-native';
import { Colors, Mixins, Typography } from '../../config/styles';
import Utils from '../../utils';
const { isIpad } = Utils;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: Colors.COLOR_003E7E0D,
    alignItems: 'center',
  },
  thumbTextStyle: {
    top: 45,
    fontSize: Typography.FONT_SIZE_10,
    color: '#484949',
  },
  thumbStyle: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#003D7D',
  },
  sliderComponentContainer: {
    marginTop: Utils.isIpad ? Mixins.scaleSize(38) : Mixins.scaleSize(18),
    marginHorizontal: Mixins.scaleSize(16),
  },
  sliderHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Mixins.scaleSize(6),
  },
  sliderHeaderText: {
    fontWeight: '700',
    color: Colors.COLOR_484949,
    fontSize: Typography.FONT_SIZE_14,
    lineHeight: Typography.LINE_HEIGHT_16,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
  },
  topbarLabelStyle: focused => ({
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Typography.FONT_SIZE_14,
    fontWeight: Typography.LINE_HEIGHT_16,
    fontWeight: focused ? '700' : '400',
    textAlign: 'center',
    flex: 1,
    position: 'absolute',
    top: Utils.isIpad ? Mixins.scaleSize(-8) : -Mixins.scaleSize(24),
    left: -Mixins.scaleSize(16),
    textTransform: 'none',
    color: focused ? Colors.COLOR_003D7D : Colors.COLOR_1A1C1C,
  }),
  checkmarkContainer: bypassEQ => ({
    width: Mixins.scaleSize(20),
    height: Mixins.scaleSize(20),
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.COLOR_003D7D,
    backgroundColor: bypassEQ ? Colors.COLOR_FFFFFF : Colors.COLOR_003D7D,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  bypassHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Mixins.scaleSize(12),
    paddingVertical: Mixins.scaleSize(17),
    backgroundColor: Colors.COLOR_003D7D0D,
    marginHorizontal: Mixins.scaleSize(16),
    marginTop: Mixins.scaleSize(17),
    borderRadius: 4,
  },
  byPassTitle: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Typography.FONT_SIZE_16,
    lineHeight: Typography.LINE_HEIGHT_12,
    fontWeight: '700',
  },
  sliderStyle: bypassEQ => ({
    color: bypassEQ ? Colors.COLOR_7E96B0 : Colors.COLOR_003D7D,
  }),
  listStyle: {
    flexGrow: 1,
    paddingBottom: Mixins.scaleSize(30),
  },
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: Mixins.scaleSize(30),
  },
  flatlistStyle: {
    marginTop: Mixins.scaleSize(10),
  },
  muteButton: {
    paddingHorizontal: Mixins.scaleSize(10),
  },
  hitSlop: {
    top: 20,
    bottom: 20,
  },
  noiseSuppressionHeader: {
    marginStart: Mixins.scaleSize(16),
    marginTop: Mixins.scaleSize(20),
    marginBottom: Mixins.scaleSize(10),
  },
  radioButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    marginTop: isIpad ? Mixins.scaleSize(10) : Mixins.scaleSize(15),
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginEnd: Mixins.scaleSize(59),
  },
  outerCircle: {
    width: isIpad ? Mixins.scaleSize(20) : Mixins.scaleSize(24),
    height: isIpad ? Mixins.scaleSize(20) : Mixins.scaleSize(24),
    borderRadius: isIpad ? Mixins.scaleSize(10) : Mixins.scaleSize(12),
    borderColor: Colors.COLOR_003D7D,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: Mixins.scaleSize(8),
  },
  innerCircle: selected => ({
    width: isIpad ? Mixins.scaleSize(10) : Mixins.scaleSize(14),
    height: isIpad ? Mixins.scaleSize(10) : Mixins.scaleSize(14),
    borderRadius: isIpad ? Mixins.scaleSize(5) : Mixins.scaleSize(7),
    backgroundColor: selected ? Colors.COLOR_003D7D : Colors.COLOR_FFFFFF,
  }),
  textStyle: selected => ({
    fontSize: isIpad ? Mixins.scaleFont(13) : Mixins.scaleFont(14),
    color: selected ? Colors.COLOR_484949 : Colors.COLOR_808284,
    fontFamily: Typography.FONT_FAMILY_BOLD,
  }),
});

export default styles;
