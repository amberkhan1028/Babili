import { createText, createBox } from '@shopify/restyle';
import { moderateScale } from 'react-native-size-matters';

const theme = {
  colors: {
    white: '#fff',
    primary: '#2e86ab',
    text: '#272829',
    button: '1f271b',
    color: '#0c0d34',
    grey: '#E8E8E8',
    danger: '#f42b03',
    green: '#0f9535',
    black: '#000',
  },

  spacing: {
    s: 8,
    m: 10,
    l: 24,
    xl: 40,
  },

  borderRadius: {
    s: 4,
    m: 10,
    l: 25,
    xl: 75,
  },
  textVariants: {
    title: {
      fontSize: moderateScale(15),
      fontFamily: 'Gotham-Black',
      color: 'white',
    },
    body: {
      fontSize: 16,
      lineHeight: 25,
      fontFamily: 'Gotham-Medium',
      text: 'text',
    },
    button: {
      fontSize: 15,
      fontFamily: 'Gotham-Bold',
      color: 'text',
    },
    breakpoints: {},
  },
};
export const Text = createText();
export const Box = createBox();
export default theme;
