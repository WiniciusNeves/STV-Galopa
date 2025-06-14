import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../styles/Colors';

interface GradientButtonProps {
  text: string;
  onPress: () => void;
  style?: ViewStyle; // Add this line
  gradientStyle?: ViewStyle;
}

export default function GradientButton({ text, onPress, style, gradientStyle }: GradientButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <LinearGradient
        colors={[colors.degradeStart, colors.degradeEnd]}
        start={[0, 0]}
        end={[1, 0]}
        style={[styles.gradient, gradientStyle]}
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
