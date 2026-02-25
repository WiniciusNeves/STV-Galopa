import React, { useEffect, useRef } from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
    Image,
    Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from './src/styles/Colors';
import { useAuth } from './src/context/AuthContext';

export default function App() {
    const navigation = useNavigation<any>();
    const { user, userRole, isLoadingAuth } = useAuth();
    const hasNavigated = useRef(false);

    useEffect(() => {
        console.info('App - Estado atual no useEffect:');
        console.info('App - user:', user ? user.uid : 'null');
        console.info('App - userRole:', userRole);
        console.info('App - isLoadingAuth:', isLoadingAuth);
        console.info('App - hasNavigated.current:', hasNavigated.current);

        if (!isLoadingAuth && !hasNavigated.current) {
            if (user) {
                if (userRole === 'admin') {
                    console.info('App - Navegando para ReportListScreen (Admin)');
                    navigation.replace('ReportListScreen');
                    hasNavigated.current = true;
                } else if (userRole === 'user') {
                    console.info('App - Navegando para ChecklistScreen (User)');
                    navigation.replace('ChecklistScreen');
                    hasNavigated.current = true;
                } else {
                    console.warn('App - Usuário logado com role inesperado. Navegando para Auth.');
                    navigation.replace('Auth');
                    hasNavigated.current = true;
                }
            } else {
                console.info('App - Navegando para Auth');
                navigation.replace('Auth');
                hasNavigated.current = true;
            }
        }

        // Se o usuário deslogar (user == null), resetar o flag para permitir navegação futura
        if (!user) {
            hasNavigated.current = false;
        }
    }, [isLoadingAuth, user, userRole, navigation]);


    if (isLoadingAuth || user === undefined) {
        return (
            <View style={styles.container}>
                <Image
                    source={require('./assets/icon_monochrome.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ color: colors.text, marginTop: 10 }}>Carregando autenticação...</Text>
            </View>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: 20,
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
});
