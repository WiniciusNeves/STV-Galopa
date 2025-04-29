import React, { useState } from 'react';
import { TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import colors from '../../styles/Colors';

interface PasswordInputProps extends React.ComponentProps<typeof TextInput> {
  placeholder?: string;
}
export default function PasswordInput({ ...rest }: PasswordInputProps) {
  const [secure, setSecure] = useState(true);

  return (
    <View style={styles.container}>
      <Icon name="lock" size={18} color={colors.white} style={styles.icon} />
      <TextInput
        placeholder={rest.placeholder}
        placeholderTextColor={colors.placeholder}
        secureTextEntry={secure}
        style={styles.input}
        {...rest}
      />
      <TouchableOpacity onPress={() => setSecure(!secure)}>
        <Icon
          name={secure ? 'eye' : 'eye-off'}
          size={18}
          color={colors.white}
        />
      </TouchableOpacity>
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
    color: colors.white,
  },
});
