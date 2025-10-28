import {Dimensions, PixelRatio} from 'react-native';
import utils from '../../utils';

const {isIOS} = utils;

const WINDOW_WIDTH = Dimensions.get('screen').width;

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

export const scaleSize = size => {
  const scaledWidth = (WINDOW_WIDTH / guidelineBaseWidth) * size;
  return scaledWidth < 1 ? scaledWidth : Math.floor(scaledWidth);
};

const WINDOW_HEIGHT = Dimensions.get('screen').height;

export const scaleSizeHeight = size => {
  const scaledHeight = (WINDOW_HEIGHT / guidelineBaseHeight) * size;
  return scaledHeight < 1 ? scaledHeight : Math.floor(scaledHeight);
};

const scale = WINDOW_WIDTH / guidelineBaseWidth;

export const scaleFont = size => {
  const newSize = size * scale;
  if (isIOS) {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

export const scaleSizeWidth = size =>
  Math.floor((WINDOW_WIDTH / guidelineBaseWidth) * size);

export {WINDOW_HEIGHT, WINDOW_WIDTH};
