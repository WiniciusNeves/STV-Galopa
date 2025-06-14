// src/styles/MenuBottom.ts
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
    position: 'absolute',
    bottom: 0,
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


export const modal = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    padding: 10,
    backgroundColor: '#0A8042',
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontWeight: '600',
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#F0C420',
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  cancelText: {
    color: '#fff',
    fontWeight: '600',
  },
});
