import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Easing,
} from "react-native";
export default function AnimatedSelect({
  label,
  selectedValue,
  onValueChange,
  options = [],
  containerStyle,
  selectKey,
  openKey,
  setOpenKey,
}: any) {
  const isOpen = openKey === selectKey;
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isOpen ? options.length * 40 : 0,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.out(Easing.ease),
    }).start();
  }, [isOpen]);

  const toggleDropdown = () => {
    setOpenKey(isOpen ? null : selectKey);
  };

  return (
    <View style={[styles.container, containerStyle, { zIndex: isOpen ? 100 : 10 }]}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity onPress={toggleDropdown} style={styles.selector}>
        <Text style={styles.selectorText}>{selectedValue || "Selecione..."}</Text>
      </TouchableOpacity>

      {isOpen && (
        <Animated.View style={[styles.dropdown, { height: animation }]}>
          {options.map((option: string) => (
            <TouchableOpacity
              key={option}
              onPress={() => {
                onValueChange(option);
                setOpenKey(null);
              }}
              style={styles.option}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: "#fff",
  },
  selector: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    backgroundColor: "transparent",
  },
  selectorText: {
    color: "#fff",
  },
  dropdown: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: "#222",
    borderWidth: 1,
    borderColor: "#ccc",
    overflow: "hidden",
    zIndex: 99,
    elevation: 5,
    borderRadius: 6,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#444",
  },
  optionText: {
    color: "#fff",
  },
});

