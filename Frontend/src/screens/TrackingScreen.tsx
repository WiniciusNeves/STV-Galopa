import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import MenuBottom from "../components/common/MenuBottom";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CookieManager, { Cookie } from "@react-native-cookies/cookies";

export default function TrackingScreen() {
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const fetchRole = async () => {
      const storedRole = await AsyncStorage.getItem("@userRole");
      setUserRole(storedRole || "user");
    };

    fetchRole();
    restoreCookies();
  }, []);

  // Restaura cookies salvos
  const restoreCookies = async () => {
    const savedCookies = await AsyncStorage.getItem("@webCookies");
    if (savedCookies) {
      const cookies: Record<string, Cookie> = JSON.parse(savedCookies);

      for (const [name, cookie] of Object.entries(cookies)) {
        await CookieManager.set("https://rastreamento.stv.com.br", {
          name,
          value: cookie.value,
          domain: "rastreamento.stv.com.br", // ⚠️ define domínio manualmente
          path: "/",                          // ⚠️ define path padrão
          version: "1",
          secure: true,
          httpOnly: false,
        });
      }
    }
  };


  // Salva os cookies após carregamento da página
  const saveCookies = async () => {
    const cookies = await CookieManager.get("https://rastreamento.stv.com.br");
    await AsyncStorage.setItem("@webCookies", JSON.stringify(cookies));
    console.log("Cookies salvos:", cookies);
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: "https://rastreamento.stv.com.br/login/acesso" }}
        style={styles.webview}
        startInLoadingState={true}
        originWhitelist={["*"]}
        onLoadEnd={saveCookies}
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
  },
});
