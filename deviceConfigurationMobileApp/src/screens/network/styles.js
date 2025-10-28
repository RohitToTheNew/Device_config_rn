import { StyleSheet } from 'react-native';
import { Colors, Mixins, Typography } from '../../config/styles';

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: Colors.COLOR_003E7E0D,
    alignItems: 'center',
  },
  networkModeHeading: {
    marginTop: Mixins.scaleSize(20),
    alignSelf: 'flex-start',
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Typography.FONT_SIZE_16,
    lineHeight: Typography.LINE_HEIGHT_20,
    color: Colors.COLOR_484949,
    marginStart: Mixins.scaleSize(16),
    marginBottom: Mixins.scaleSize(20),
  },
  radionButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  tickMarkStyle: { marginEnd: Mixins.scaleSize(8) },
  radioButtonOuter: {
    width: Mixins.scaleSize(24),
    height: Mixins.scaleSize(24),
    borderRadius: Mixins.scaleSize(12),
    borderColor: Colors.COLOR_003D7D,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginStart: Mixins.scaleSize(19),
    marginEnd: Mixins.scaleSize(8),
  },
  radioButtonInner: {
    width: Mixins.scaleSize(14),
    height: Mixins.scaleSize(14),
    borderRadius: Mixins.scaleSize(7),
    backgroundColor: Colors.COLOR_003D7D,
  },
  radioButtonTitle: selected => ({
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Typography.FONT_SIZE_12,
    lineHeight: Typography.LINE_HEIGHT_16,
    fontWeight: selected ? '700' : '400',
    color: Colors.COLOR_484949,
  }),
  keyBoardContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  scrollableStyle: {
    width: '100%',
    height: '100%',
  },
});

export default styles;
