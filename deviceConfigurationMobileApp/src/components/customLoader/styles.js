import { StyleSheet } from 'react-native';
import { Mixins, Colors } from '../../config/styles';

export default StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.COLOR_00000033,
  },
  loaderViewStyle: {
    width: Mixins.scaleSize(140),
    height: Mixins.scaleSize(140),
  },
});
