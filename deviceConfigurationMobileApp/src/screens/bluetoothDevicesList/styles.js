import { StyleSheet } from 'react-native';
import { Colors, Mixins, Typography } from '../../config/styles';
import Utils from '../../utils';

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: Colors.COLOR_E5E5E5,
  },
  listStyle: {
    flex: 1,
    marginTop: Mixins.scaleSize(10),
    paddingTop: Mixins.scaleSize(19),
    marginHorizontal: Mixins.scaleSize(16),
  },
  listItemStyle: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    padding: Mixins.scaleSize(12),
    borderRadius: Mixins.scaleSize(8),
    marginBottom: Mixins.scaleSize(8),
    backgroundColor: Colors.COLOR_FFFFFF,
  },
  deviceTitle: {
    fontWeight: '700',
    color: Colors.COLOR_003D7D,
    fontSize: Typography.FONT_SIZE_16,
    lineHeight: Typography.LINE_HEIGHT_16,
    marginTop: Mixins.scaleSize(0.5),
    fontFamily: Typography.FONT_FAMILY_REGULAR,
  },
  refreshButtonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: Mixins.scaleSize(24),
    height: Mixins.scaleSize(24),
    marginStart: Mixins.scaleSize(20),
  },
  noDeviceComponentContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: Mixins.scaleSize(16),
  },
  headerButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noNearbyDevices: {
    fontWeight: '700',
    color: Colors.COLOR_808284,
    marginTop: Mixins.scaleSize(25),
    fontSize:
      Utils.tablet || Utils.isIpad
        ? Typography.FONT_SIZE_14
        : Typography.FONT_SIZE_18,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
  },
  pleaseMakeSure: {
    fontWeight: '400',
    color: Colors.COLOR_808284,
    marginTop: Mixins.scaleSize(9),
    fontSize: Typography.FONT_SIZE_14,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
  },
  tryAgain: {
    fontWeight: '700',
    color: Colors.COLOR_003D7D,
    marginTop: Mixins.scaleSize(37),
    fontSize: Typography.FONT_SIZE_16,
    lineHeight: Typography.LINE_HEIGHT_20,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
  },
  refresh: {
    marginStart: Mixins.scaleSize(20),
  },
  deviceNameContainer: {
    marginStart: Mixins.scaleSize(22),
    flex: 1,
  },
  deviceSubHeading: {
    fontWeight: '400',
    color: Colors.COLOR_808284,
    marginTop: Mixins.scaleSize(6),
    fontSize: Typography.FONT_SIZE_12,
    lineHeight: Typography.LINE_HEIGHT_16,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
  },
  deviceSubHeadingShimmer: {
    fontWeight: '400',
    color: Colors.COLOR_808284,
    marginTop: Mixins.scaleSize(6),
    fontSize: Typography.FONT_SIZE_12,
    lineHeight: Typography.LINE_HEIGHT_14,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    minWidth: Mixins.scaleSize(60),
    maxWidth: Mixins.scaleSize(100),
  },
  footerContainer: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Mixins.scaleSize(10),
    marginBottom: Mixins.scaleSize(80),
    paddingVertical: Mixins.scaleSize(6),
  },
  loadMoreText: {
    fontWeight: '700',
    color: Colors.COLOR_003D7D,
    marginStart: Mixins.scaleSize(10),
    fontSize: Typography.FONT_SIZE_14,
    lineHeight: Typography.LINE_HEIGHT_16,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
  },
  contentContainerStyle: {
    paddingBottom: Mixins.scaleSize(50)
  },
  hitSlop: {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  },
});

export default styles;
