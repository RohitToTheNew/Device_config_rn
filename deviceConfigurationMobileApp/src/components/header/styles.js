import { StyleSheet } from 'react-native';

import Utils from '../../utils';
import { Colors, Mixins, Typography } from '../../config/styles';

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:
      Utils.tablet || Utils.isIpad
        ? Mixins.scaleSize(23)
        : Utils.isIOS
          ? Mixins.scaleSize(51)
          : Mixins.scaleSize(23),
    marginHorizontal: Mixins.scaleSize(16),
  },
  headerTitle: {
    flex: 1,
    fontWeight: '700',
    color: Colors.COLOR_FB8C00,
    fontSize: Typography.FONT_SIZE_18,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
  },
  leftArrowButton: {
    marginEnd: Mixins.scaleSize(8),
  },
  centeredView: {
    flex: 1,
  },
  modalView: {
    elevation: 4,
    shadowRadius: 4,
    shadowOpacity: 0.25,
    alignSelf: 'flex-end',
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    shadowColor: Colors.COLOR_000,
    paddingVertical: Mixins.scaleSize(12),
    paddingStart: Mixins.scaleSize(12),
    paddingEnd: Mixins.scaleSize(16),
    // paddingEnd:Mixins.scaleSize(16),
    borderRadius: Mixins.scaleSize(8),
    minWidth: Mixins.scaleSizeWidth(170),
    marginTop: Utils.isIpad ? Mixins.scaleSize(45) : Utils.isIOS ? Mixins.scaleSize(75) : Mixins.scaleSize(45),
    marginHorizontal: Utils.isIpad ? Mixins.scaleSize(25) : Utils.isIOS ? Mixins.scaleSize(30) : Mixins.scaleSize(25),
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  buttonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Mixins.scaleSize(12),
  },
  logoutText: {
    color: Colors.COLOR_1A1C1C,
    marginTop: Mixins.scaleSize(1),
    fontSize: Typography.FONT_SIZE_14,
    marginLeft: Mixins.scaleSize(16),
    marginBottom: Mixins.scaleSize(2),
    fontFamily: Typography.FONT_FAMILY_BOLD,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Mixins.scaleSize(12)
  },
  poeButton: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default styles;
