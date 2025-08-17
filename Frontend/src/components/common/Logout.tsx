import React from "react";
import {
  Alert,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { logout } from "../../service/userService";

interface LogoutProps {
  width?: number | string;
}

export default function Logout({ width = 36 }: LogoutProps) {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await logout(navigation);
      navigation.reset({
        index: 0,
        routes: [{ name: "Auth" }],
      });
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error.message);
      Alert.alert("Erro", "Erro ao realizar logout.");
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      "Sair do perfil",
      "Você tem certeza que deseja sair?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair",
          style: "destructive",
          onPress: handleLogout,
        },
      ],
      { cancelable: true }
    );
  };

  const isSmall = Number(width) <= 36;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: isSmall ? 50 : undefined,
          height: isSmall ? 50 : undefined,
          borderRadius: isSmall ? 25 : 50,
          paddingHorizontal: isSmall ? 0 : 20,
        },
      ]}
      onPress={confirmLogout} // Alterado aqui para chamar o modal de confirmação
    >
      <Feather
        name="log-out"
        size={isSmall ? 18 : 20}
        color="#fff"
        style={!isSmall && styles.icon}
      />
      {!isSmall && <Text style={styles.text}>Sair</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#A93021",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
