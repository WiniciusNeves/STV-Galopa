import { StyleSheet } from 'react-native';
import colors from './colors';

export const container = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export const imageStyle = StyleSheet.create({
  base: {
    width: 440,
    height: 350,
    position: 'absolute',
    top: 0,
    borderRadius: 20,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
