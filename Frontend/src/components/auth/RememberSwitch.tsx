import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import colors from '../../styles/Colors';

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export default function RememberSwitch({ value, onValueChange }: Props) {
  const { t } = useTranslation();
  const { colors: themeColors } = useTheme();

  return (
    <View style={[styles.container, { marginBottom: 20 }]}>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.card, true: colors.primary }}
        thumbColor={colors.white}
        style={styles.switch}
      />
      <Text style={styles.rememberText}>{t('Lembrar-me')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
    marginRight: 10,
  },
  rememberText: {
    color: colors.grey,
    fontSize: 16,
    marginLeft: 10,
  },
});
