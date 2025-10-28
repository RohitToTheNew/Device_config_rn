import { StyleSheet } from 'react-native';
import { Colors, Mixins, Typography } from '../../config/styles';
import Utils from '../../utils';

const styles = StyleSheet.create({
  listItemContainer: {
    flex: 1,
    flexDirection: 'row',
    height: Mixins.scaleSize(70),
    padding: Mixins.scaleSize(10),
    marginVertical: Mixins.scaleSize(7),
    marginHorizontal: 10,
    backgroundColor: Colors.COLOR_FFFFFF,
    borderRadius: 8,
  },
  listItemTitle: {
    height: Mixins.scaleSize(20),
    flex: 0.7,
    flexDirection: 'column',
  },
  titleText: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Typography.FONT_SIZE_14,
    color: Colors.COLOR_003D7D,
    fontWeight: '700',
  },
  roomDeviceContainer: {
    height: Mixins.scaleSize(20),
    width: '100%',
    marginTop: Mixins.scaleSize(8),
    flexDirection: 'row',
  },
  roomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Mixins.scaleSize(5),
    paddingRight: Mixins.scaleSize(20),
  },
  roomTextContainer: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Typography.FONT_SIZE_12,
    color: Colors.COLOR_000000,
    fontWeight: '100',
    paddingLeft: Mixins.scaleSize(5),
  },
  deviceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Mixins.scaleSize(5),
    paddingRight: Mixins.scaleSize(20),
  },
  deviceTextContainer: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Typography.FONT_SIZE_12,
    color: Colors.COLOR_000000,
    fontWeight: '100',
    paddingLeft: Mixins.scaleSize(5),
  },
  iconContainer: {
    flex: 0.3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: Mixins.scaleSize(20)
  },
  csvContainer: {
    marginLeft: Mixins.scaleSize(40)
  },
  codeScanner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: Mixins.scaleSize(10),
  },
  alertbtnStyle: {
    backgroundColor: Colors.COLOR_E53935,
    width: Mixins.scaleSize(242),
    height: Mixins.scaleSize(46),
    marginTop: Mixins.scaleSize(16),
  },
  deleteIconStyle: {
    width: Mixins.scaleSize(40),
    height: Mixins.scaleSize(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Mixins.scaleSize(20),
  },
  csvIconStyle: {
    width: Mixins.scaleSize(40),
    height: Mixins.scaleSize(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainerStyle: {
    paddingBottom: Mixins.scaleSize(50),
    paddingTop: Mixins.scaleSize(20),
    paddingLeft: Mixins.scaleSize(5),
    paddingRight: Mixins.scaleSize(5)
  }
});

export default styles;
