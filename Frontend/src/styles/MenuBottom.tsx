import { StyleSheet } from 'react-native';
import colors from './Colors';

export const container = StyleSheet.create({
  base: {
    flexDirection: 'row',
    backgroundColor: colors.greenlight,
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
});

export const item = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  icon: {
    marginBottom: 15,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export const register = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  button: {
    marginBottom: 10,
  },
  gradient: {
    width: 130,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
});
