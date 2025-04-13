import React, { useState } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import colors from '../../styles/colors';

export default function RememberSwitch() {
    const { t } = useTranslation();
    const [remember, setRemember] = useState(false);
    const { colors: themeColors } = useTheme();

    return (
        <View style={[styles.container, { marginBottom: 20 }]}>
            <Switch
                value={remember}
                onValueChange={() => setRemember(!remember)}
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

