import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import MenuBottom from "../components/common/MenuBottom";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TrackingScreen() {
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const fetchRole = async () => {
      const storedRole = await AsyncStorage.getItem("@userRole");
      setUserRole(storedRole || "user");
    };
    fetchRole();
  }, []);

  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: "https://rastreamento.stv.com.br/login/acesso" }}
        style={styles.webview}
        startInLoadingState={true}
        originWhitelist={["*"]}
      />
      <MenuBottom userRole={userRole} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
    marginBottom: 60, // espaço para o MenuBottom
  },
});

