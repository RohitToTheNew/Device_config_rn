import { StyleSheet } from 'react-native';
import { Colors, Mixins, Typography } from '../../config/styles';
import Utils from '../../utils';

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: Colors.COLOR_E5E5E5,
  },

  tickMarkStyle: {
    marginEnd: Mixins.scaleSize(8),
  },
  listStyle: {
    marginHorizontal: Mixins.scaleSize(16),
    marginTop: Mixins.scaleSize(30),
  },
  headingStyle: {
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontSize: Typography.FONT_SIZE_14,
    lineHeight: Typography.LINE_HEIGHT_16,
    color: Colors.COLOR_FB8C00,
    marginBottom: Mixins.scaleSize(44),
  },
  listItemContainer: {
    marginBottom: Mixins.scaleSize(52),
  },
  boudRateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: Colors.COLOR_808284,
    borderBottomWidth: 1,
    paddingBottom: Mixins.scaleSize(4),
  },
  forwardingBehaviourButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: Colors.COLOR_808284,
    borderBottomWidth: 1,
    paddingBottom: Mixins.scaleSize(4),
    marginTop: Mixins.scaleSize(64),
  },
  selectText: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Typography.FONT_SIZE_16,
    lineHeight: Typography.LINE_HEIGHT_20,
    color: Colors.COLOR_808284,
    marginTop: Mixins.scaleSize(-3),
  },
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: Colors.COLOR_1A1C1CCC,
  },
  centeredView1: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  modalView: {
    backgroundColor: Colors.COLOR_FFFFFF,
    borderTopStartRadius: Mixins.scaleSize(8),
    borderTopEndRadius: Mixins.scaleSize(8),
    width: '100%',
  },
  modalView1: {
    backgroundColor: Colors.COLOR_FFFFFF,
    borderTopStartRadius: Mixins.scaleSize(8),
    borderTopEndRadius: Mixins.scaleSize(8),
    width: '100%',
  },
  dropdownItemText: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Typography.FONT_SIZE_16,
    lineHeight: Typography.LINE_HEIGHT_20,
    color: Colors.COLOR_000,
  },
  dropdownItem: {
    marginHorizontal: Mixins.scaleSize(16),
    paddingHorizontal: Mixins.scaleSize(37),
    paddingVertical: Mixins.scaleSize(14),
    marginTop: Mixins.scaleSize(4),
  },
  dropdownHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Mixins.scaleSize(16),
    marginTop: Mixins.scaleSize(24),
  },
  dropdownHeader: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Typography.FONT_SIZE_16,
    lineHeight: Typography.LINE_HEIGHT_22,
    color: Colors.COLOR_000,
    fontWeight: '700',
  },
  hitSlop: {
    left: 15,
    bottom: 15,
    right: 15,
    top: 15,
  },
  chipView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: Colors.COLOR_3581E4,
    marginEnd: 4,
    borderRadius: 4,
    marginBottom: 2,
  },
  chipViewText: {
    marginEnd: 8,
    color: 'white',
    fontSize: 14,
    fontWeight: '400',
  }
});

export default styles;
