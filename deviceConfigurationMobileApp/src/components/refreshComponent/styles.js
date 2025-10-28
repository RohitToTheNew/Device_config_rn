import { StyleSheet } from 'react-native';
import { Mixins } from '../../config/styles';

const styles = StyleSheet.create({
  refreshButtonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: Mixins.scaleSize(24),
    height: Mixins.scaleSize(24),
    marginStart: Mixins.scaleSize(20),
  },
});

export default styles;
