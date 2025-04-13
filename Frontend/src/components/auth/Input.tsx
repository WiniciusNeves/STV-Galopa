import React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import colors from '../../styles/colors';

interface InputProps extends React.ComponentProps<typeof TextInput> {
  icon: string;
  placeholder: string;
}

export default function Input({ icon, placeholder, ...rest }: InputProps) {
  return (
    <View style={styles.container}>
      <Icon name={icon} size={18} color={colors.white} style={styles.icon} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        style={styles.input}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 45,
    marginBottom: 15,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: colors.grey,
  },
});
