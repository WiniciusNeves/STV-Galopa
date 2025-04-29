import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../styles/Colors';

interface GradientButtonProps {
  text: string;
  onPress: () => void;
}
export default function GradientButton({ text, onPress }: GradientButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <LinearGradient
        colors={[colors.degradeStart, colors.degradeEnd]}
        start={[0, 0]}
        end={[1, 0]}
        style={styles.gradient}
      >
        <Text style={styles.text}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 24,
    overflow: 'hidden',
    width: '80%',
  },
  gradient: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 24,
  },
  text: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
