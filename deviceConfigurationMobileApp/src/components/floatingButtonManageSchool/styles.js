import { StyleSheet } from 'react-native';
import { Colors, Mixins, Typography } from '../../config/styles';
import Utils from '../../utils';

const styles = StyleSheet.create({
  containerStyle: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    justifyContent: 'center',
    height: Mixins.scaleSize(54),
    width: Mixins.scaleSize(198),
    bottom:
      Utils.isIpad || Utils.tablet
        ? Mixins.scaleSize(20)
        : Utils.isIOS
          ? Mixins.scaleSize(50)
          : Mixins.scaleSize(30),
    borderRadius: Mixins.scaleSize(4),
    backgroundColor: Colors.COLOR_5D9D52,
  },
  manageSchoolText: {
    fontWeight: '700',
    color: Colors.COLOR_FFFFFF,
    fontSize:
      Utils.isIpad || Utils.tablet
        ? Typography.FONT_SIZE_12
        : Typography.FONT_SIZE_14,
    lineHeight: Typography.LINE_HEIGHT_16,
    marginStart: Mixins.scaleSize(13.5),
    fontFamily: Typography.FONT_FAMILY_REGULAR,
  },
});
export default styles;
