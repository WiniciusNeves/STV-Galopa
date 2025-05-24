import React, { useState, useRef } from "react";
import {
  Animated,
  TouchableOpacity,
  Text,
  View,
  FlatList,
  StyleSheet,
} from "react-native";

const AnimatedSelect = ({ options = [], selectedValue, onValueChange, placeholder }) => {
  const [expanded, setExpanded] = useState(false);
  const heightAnim = useRef(new Animated.Value(50)).current;

  const toggleDropdown = () => {
    setExpanded(!expanded);
    Animated.timing(heightAnim, {
      toValue: expanded ? 50 : 200,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleSelect = (item) => {
    onValueChange(item.value);
    toggleDropdown(); // close with animation
  };

  return (
    <Animated.View style={[styles.container, { height: heightAnim }]}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.button}>
        <Text style={styles.buttonText}>
          {options.find((opt) => opt.value === selectedValue)?.label || placeholder}
        </Text>
      </TouchableOpacity>
      {expanded && (
        <FlatList
          data={options}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.option} onPress={() => handleSelect(item)}>
              <Text style={styles.optionText}>{item.label}</Text>
            </TouchableOpacity>
          )}
          nestedScrollEnabled={true}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '85%',
    backgroundColor: '#003322',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  button: {
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 15,
    backgroundColor: '#004D3C',
  },
  buttonText: {
    color: "white",
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#00594C',
    borderBottomWidth: 1,
    borderBottomColor: '#007F6D',
  },
  optionText: {
    color: "white",
  },
});

export default AnimatedSelect;

