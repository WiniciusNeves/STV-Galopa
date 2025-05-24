import React, { useEffect } from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from './src/styles/Colors';
import { checkAutoLogin } from './src/service/authService'; // Importe a função de login automático

export default function LoadingScreen() {
    const navigation = useNavigation<any>();

    useEffect(() => {
        const performAutoLogin = async () => {
            await checkAutoLogin(navigation);
        };

        performAutoLogin();
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Image
                source={require('./assets/icon_monochrome.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
});