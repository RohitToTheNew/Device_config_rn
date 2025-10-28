import { StyleSheet } from 'react-native';
import { Colors, Typography } from '../../config/styles';
export default StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.COLOR_003D7D,
  },
  defaultTextStyle: {
    fontWeight: '700',
    textAlign: 'center',
    alignItems: 'center',
    color: Colors.COLOR_FFFFFF,
    fontSize: Typography.FONT_SIZE_18,
    fontFamily: Typography.FONT_FAMILY_BOLD,
  },
});
