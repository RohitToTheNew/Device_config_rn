import Utils from '../../utils';
const { tablet } = Utils;
import { StyleSheet } from 'react-native';
import { Colors, Mixins, Typography } from '../../config/styles';

export default StyleSheet.create({
  textInputContainer: (isInvalid, isFocused, showDash) => ({
    flexDirection: 'row',
    borderColor: isInvalid
      ? Colors.COLOR_FF0000
      : isFocused
        ? Colors.COLOR_808284
        : Colors.COLOR_808284,
    borderStyle: 'solid',
    alignItems: 'flex-end',
    height: Mixins.scaleSize(40),
    width: Mixins.scaleSize(340),
    justifyContent: 'space-between',
    borderRadius: Mixins.scaleSize(3),
    paddingBottom: Mixins.scaleSize(6),
    borderBottomWidth: showDash ? 0 : 1,
  }),
  textinputStyle: (showPasswordButton, isFoldableDevice, editable) => ({
    fontSize:
      tablet || isFoldableDevice ? Mixins.scaleFont(12) : Mixins.scaleFont(16),
    flex: 1,
    color: editable ? Colors.COLOR_1A1C1C : Colors.COLOR_808284,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    padding: 0,
    paddingStart: 1,
    marginTop:
      tablet || isFoldableDevice ? Mixins.scaleSize(10) : Mixins.scaleSize(15),
    textDecorationLine: 'none',
    fontWeight: '400',
  }),
  errorMessage: isFoldableDevice => ({
    color: Colors.COLOR_FF0000,
    fontSize:
      tablet || isFoldableDevice ? Mixins.scaleFont(8) : Mixins.scaleFont(12),
    marginTop:
      tablet || isFoldableDevice ? Mixins.scaleSize(5) : Mixins.scaleSize(8),
    textAlign: 'right',
    fontFamily: Typography.FONT_FAMILY_BOLD,
  }),
  showPasswordButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginStart: Mixins.scaleSize(10),
  },
  labelContainer: {
    position: 'absolute',
    backgroundColor: Colors.COLOR_FFFFFF,
    justifyContent: 'center',
    alignItems: 'center',
    // height:Mixins.scaleSizeHeight(68),
  },
  label: (isFoldableDevice, editable) => ({
    fontSize:
      tablet || isFoldableDevice ? Mixins.scaleFont(16) : Mixins.scaleFont(20),
    textAlign: 'left',
    fontFamily: Typography.FONT_FAMILY_REGULAR
  }),
  auxiliaryBtnStyle: isFoldableDevice => ({
    fontWeight: '700',
    fontSize: tablet || isFoldableDevice ? Mixins.scaleSize(10) : null,
  }),
  dashStyle: {
    width: '100%',
    height: 1,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
  },
});
