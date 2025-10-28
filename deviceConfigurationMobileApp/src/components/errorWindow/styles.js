import { StyleSheet } from 'react-native';
import { Colors, Mixins, Typography } from '../../config/styles';

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.COLOR_1A1C1CCC,
  },
  modalView: {
    backgroundColor: Colors.COLOR_FFFFFF,
    borderRadius: Mixins.scaleSizeWidth(8),
    maxWidth: Mixins.scaleSize(297),
  },
  titleView: {
    paddingHorizontal: Mixins.scaleSize(27.5),
    paddingTop: Mixins.scaleSize(32),
    paddingBottom: Mixins.scaleSize(24),
  },
  titleStyle: {
    fontWeight: '400',
    color: Colors.COLOR_484949,
    fontSize: Typography.FONT_SIZE_14,
    lineHeight: Typography.LINE_HEIGHT_16,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    textAlign: 'center',
  },
  button1Style: {
    width: Mixins.scaleSize(242),
    height: Mixins.scaleSize(46),
    marginTop: Mixins.scaleSize(16),
  },
  button2Title: {
    fontWeight: '700',
    color: Colors.COLOR_003D7D,
    fontSize: Typography.FONT_SIZE_14,
    lineHeight: Typography.LINE_HEIGHT_16,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    textAlign: 'center',
  },
  button2Container: {
    alignSelf: 'center',
    marginTop: Mixins.scaleSize(25),
  },
  graphicStyle: {
    alignSelf: 'center',
    marginBottom: Mixins.scaleSize(32),
  },
  disconnectedHeader: {
    marginBottom: Mixins.scaleSize(16),
    alignSelf: 'center',
    fontWeight: '700',
    color: Colors.COLOR_000,
    fontSize: Typography.FONT_SIZE_16,
    lineHeight: Typography.LINE_HEIGHT_20,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
  },
  disconnectedImage: {
    width: Mixins.scaleSize(95),
    height: Mixins.scaleSize(50),
    alignSelf: 'center',
    marginBottom: Mixins.scaleSize(32),
  },
});

export default styles;
