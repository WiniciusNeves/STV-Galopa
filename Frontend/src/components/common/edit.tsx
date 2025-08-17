import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../../styles/Colors';

interface EditProps {
  onPress: () => void;
}

export function Edit({ onPress }: EditProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <FontAwesome name="edit" size={18} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
