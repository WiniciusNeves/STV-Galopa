import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
} from "react-native";

const ITEM_HEIGHT = 40;
const MAX_DROPDOWN_HEIGHT = 320; // Altura máxima FIXA do dropdown para ativar o scroll

export default function AnimatedSelect({
  label,
  selectedValue,
  onValueChange,
  options = [],
  containerStyle,
  selectKey,
  openKey,
  setOpenKey,
  disabled,
}: any) {
  const isOpen = openKey === selectKey;
  const [displayDropdown, setDisplayDropdown] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    setDisplayDropdown(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && selectedValue) {
      const selectedIndex = options.findIndex((opt: string) => opt === selectedValue);
      if (selectedIndex >= 0 && scrollRef.current) {
        scrollRef.current.scrollTo({ y: selectedIndex * ITEM_HEIGHT, animated: true });
      }
    }
  }, [isOpen, selectedValue, options]);

  const toggleDropdown = () => {
    if (!disabled) {
      setOpenKey(isOpen ? null : selectKey);
    }
  };

  const handleOptionSelect = (option: string) => {
    onValueChange(option);
    setOpenKey(null);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        onPress={toggleDropdown}
        style={styles.selector}
        disabled={disabled}
      >
        <Text style={styles.selectorText}>{selectedValue || "Selecione..."}</Text>
      </TouchableOpacity>

      {displayDropdown && (
        <View style={styles.dropdown}>
          <ScrollView
            ref={scrollRef}
            style={styles.scrollViewExplicitHeight}
            contentContainerStyle={styles.scrollViewContentContainer}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            scrollEventThrottle={16}
          >
            {options.map((option: string, index: number) => (
              <TouchableOpacity
                key={option + index}
                onPress={() => handleOptionSelect(option)}
                style={styles.option}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
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
    overflow: "scroll",
    zIndex: 99,
    elevation: 5,
    borderRadius: 6,
    maxHeight: MAX_DROPDOWN_HEIGHT,
  },
  scrollViewExplicitHeight: {
    height: "100%",
  },
  scrollViewContentContainer: {
    // Adicione padding ou outras propriedades para o conteúdo dentro do ScrollView, se necessário
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#444",
    height: ITEM_HEIGHT,
    justifyContent: 'center',
  },
  optionText: {
    color: "#fff",
  },
});
