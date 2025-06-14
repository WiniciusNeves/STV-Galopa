import React from "react";
import {
  Alert,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { logout } from "../../service/userService";

export default function Logout() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await logout(navigation);
      navigation.reset({
        index: 0,
        routes: [{ name: "Auth" }],
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error.message);
      Alert.alert("Erro", "Erro ao realizar logout.");
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.triggerButton}
        onPress={handleLogout}
      >
        <Feather name="log-out" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.triggerButtonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  triggerButton: {
    right: "80%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#A93021",
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    width: "70%",
    justifyContent: "center",
  },
  icon: {
    marginRight: 8,
  },
  triggerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
