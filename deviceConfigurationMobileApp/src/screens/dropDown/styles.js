import { StyleSheet } from 'react-native';
import { Colors, Mixins, Typography } from '../../config/styles';
import Utils from '../../utils';

const styles = StyleSheet.create({
  containerStyle: {
    height: Mixins.scaleSize(60),
    width: '98%',
    backgroundColor: Colors.COLOR_FFFFFF0D,
    borderBottomColor: Colors.COLOR_808284,
    borderBottomWidth: 1,
    marginTop: Utils.tablet ? 1 : 20,
  },
  containerStyleWithoutBorder: {
    height: Mixins.scaleSize(60),
    width: '100%',
    backgroundColor: Colors.COLOR_FFFFFF0D,
    marginTop: Mixins.scaleSize(20),
  },
  rowStyle: {
    flex: 1,
    flexDirection: 'row',
    bottom: 2,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    margin: Mixins.scaleSize(12),
    padding: Mixins.scaleSize(10),
  },
  text: (isFieldSelected, showDisabled) => ({
    flex: 1,
    fontSize:
      Utils.tablet || Utils.isFoldableDevice
        ? Mixins.scaleFont(12.5)
        : Mixins.scaleFont(16),
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    color: showDisabled
      ? Colors.COLOR_B0B99990
      : isFieldSelected
        ? Colors.COLOR_1A1C1C
        : Colors.COLOR_808284,
    paddingBottom: 0,
    paddingLeft: 0,
  }),
  text1: {
    flex: 1,
    fontSize:
      Utils.tablet || Utils.isIpad
        ? Typography.FONT_SIZE_12
        : Typography.FONT_SIZE_16,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    backgroundColor: 'transparent',
  },
  headingText: {
    flex: 1,
    fontSize:
      Utils.tablet || Utils.isIpad
        ? Typography.FONT_SIZE_10
        : Typography.FONT_SIZE_12,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    color: Colors.COLOR_808284,
    paddingTop: 12,
    paddingLeft: 0,
  },
  textInputView: {
    height: Mixins.scaleSize(57),
    width: '100%',
  },
  headingContainer: {
    flex: 1,
    paddingBottom: Mixins.scaleSize(5),
  },
  dropDownIconStyle: {
    alignSelf: 'flex-end',
    marginBottom: Mixins.scaleSize(5),
  },
});

export default styles;
