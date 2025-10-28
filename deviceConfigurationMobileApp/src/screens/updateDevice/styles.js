import { StyleSheet } from 'react-native';
import { Colors, Mixins, Typography } from '../../config/styles';
import Utils from '../../utils';

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: Colors.COLOR_E5E5E5,
  },
  centeredView: {
    flex: 1,
    width: '100%',
    marginTop: Mixins.scaleSize(290),
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: Mixins.scaleSize(40),
    marginTop: Mixins.scaleSize(290),
  },
  modalView: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    shadowColor: Colors.COLOR_00000040,
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
    borderRadius: 24,
    backgroundColor: Colors.COLOR_FFFFFF,
  },
  closeIcon: {
    marginStart: Mixins.scaleSize(16),
    height: Mixins.scaleSize(50),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flatListContainer: {
    height: '85%',
    width: '100%',
  },
  item: {
    padding: Mixins.scaleSize(15),
    marginLeft: Mixins.scaleSize(32),
    marginHorizontal: Mixins.scaleSize(10),
  },
  title: {
    fontSize: 15,
    color: Colors.COLOR_000000,
  },
  textInputStyle: {
    fontSize: Typography.FONT_SIZE_16,
    flex: 0.9,
    marginLeft: 0,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    color: Colors.COLOR_000000,
  },
  selectSchoolText: {
    flex: 0.9,
    fontWeight: '700',
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Typography.FONT_SIZE_18,
    color: Colors.COLOR_000000,
  },
  saveButtonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Mixins.scaleSize(50),
    marginBottom: Utils.isIphone8 ? Mixins.scaleSize(10) : ''
  },
  saveButtonTODisable: {
    paddingRight: 5,
    backgroundColor: Colors.COLOR_808284,
    height: Mixins.scaleSize(50),
    width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonTO: {
    backgroundColor: Colors.COLOR_003D7D,
    height: Mixins.scaleSize(50),
    width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonEnable: {
    backgroundColor: Colors.COLOR_E53935,
    height: Mixins.scaleSize(50),
    width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontWeight: '700',
    fontSize: Typography.FONT_SIZE_16,
    color: Colors.COLOR_FFFFFF,
  },
  deleteButtonText: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontWeight: '700',
    fontSize: Typography.FONT_SIZE_16,
    color: Colors.COLOR_FFFFFF,
  },
  searchStyle: {
    flexDirection: 'row',
    borderRadius: 12,
    height: Mixins.scaleSize(40),
    width: Mixins.scaleSize(343),
    backgroundColor: Colors.COLOR_B0B6BB,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Mixins.scaleSize(15),
    marginRight: Mixins.scaleSize(15),
  },
  searchIcon: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  renderItemSelectStyle: {
    width: '100%',
    height: Mixins.scaleSize(30),
    backgroundColor: Colors.COLOR_FFFFFF,
  },
  renderItemCreateStyle: {
    paddingTop: Mixins.scaleSize(10),
    paddingLeft: Mixins.scaleSize(20),
    color: Colors.COLOR_003D7D,
  },
  dropDownContainerStyle: {
    flex: 1,
    flexDirection: 'column',
    padding: 15,
  },
  alertRedBtnStyle: {
    backgroundColor: Colors.COLOR_E53935,
    width: Mixins.scaleSize(242),
    height: Mixins.scaleSize(46),
    marginTop: Mixins.scaleSize(16),
  },
  alertBlueBtnStyle: {
    backgroundColor: Colors.COLOR_003D7D,
    width: Mixins.scaleSize(242),
    height: Mixins.scaleSize(46),
    marginTop: Mixins.scaleSize(16),
  },
  closeIconStyle: {
    flex: 0.1,
  },
});

export default styles;
