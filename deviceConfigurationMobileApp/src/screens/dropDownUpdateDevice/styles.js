import { StyleSheet } from 'react-native';
import { Colors, Mixins, Typography } from '../../config/styles';
import Utils from '../../utils';

const styles = StyleSheet.create({
  containerStyle: {
    height: 60,
    width: '100%',
    backgroundColor: Colors.COLOR_FFFFFF0D,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginTop: 20,
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
    margin: 12,
    padding: 10,
  },
  text: {
    flex: 1,
    fontSize:
      Utils.tablet || Utils.isIpad
        ? Typography.FONT_SIZE_12
        : Typography.FONT_SIZE_16,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    color: Colors.COLOR_1A1C1C,
    paddingBottom: 0,
    paddingLeft: 0,
  },
  headingText: {
    flex: 1,
    fontSize:
      Utils.tablet || Utils.isIpad
        ? Typography.FONT_SIZE_10
        : Typography.FONT_SIZE_12,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    color: '#808284',
    paddingTop: 12,
    paddingLeft: 0,
  },
});

export default styles;
