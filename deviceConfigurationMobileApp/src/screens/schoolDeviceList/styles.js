import { StyleSheet } from 'react-native';
import { Colors, Mixins, Typography } from '../../config/styles';

const styles = StyleSheet.create({
  listItemContainer: {
    flex: 1,
    flexDirection: 'row',
    height: Mixins.scaleSize(50),
    marginVertical: Mixins.scaleSize(8),
    marginHorizontal: Mixins.scaleSize(16),
    backgroundColor: Colors.COLOR_FFFFFF,
    borderRadius: 8,
    paddingHorizontal: Mixins.scaleSize(12),
    paddingTop: Mixins.scaleSize(12),
    paddingBottom: Mixins.scaleSize(8),
  },
  noRoomStyle: {
    height: Mixins.scaleSize(50),
    backgroundColor: Colors.COLOR_E7E9EA,
    borderRadius: 8,
  },
  roomTitleContainer: {
    flexDirection: 'row',
    paddingTop: 15,
  },
  titleText: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Typography.FONT_SIZE_14,
    color: Colors.COLOR_FB8C00,
    fontWeight: '700',
    paddingLeft: 15,
  },
  roomDeviceContainer: {
    height: Mixins.scaleSize(20),
    width: '100%',
    marginTop: 8,
    flexDirection: 'row',
  },
  deviceContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  noDeviceContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Typography.FONT_SIZE_14,
  },
  deviceTextContainer: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Typography.FONT_SIZE_13,
    color: Colors.COLOR_808284,
    fontWeight: '400',
    paddingLeft: 10,
  },
  availableDeviceTextContainer: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Typography.FONT_SIZE_13,
    color: Colors.COLOR_003D7D,
    fontWeight: '700',
  },
  deviceType: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Typography.FONT_SIZE_12,
    lineHeight: Typography.LINE_HEIGHT_16,
    color: Colors.COLOR_808284,
    fontWeight: '400',
    marginTop: Mixins.scaleSize(2),
  },
  contentContainerStyle: {
    paddingBottom: 50,
    paddingTop: 20,
    paddingLeft: 5,
    paddingRight: 5,
  },
  noRoomStyleContainer: {
    paddingTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },
  deviceNameView: {
    marginStart: Mixins.scaleSize(10),
  },
  noDeviceView: {
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
});

export default styles;
