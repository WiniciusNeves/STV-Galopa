import React, { useEffect } from 'react';
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

export default function App() {  // <- ALTERADO de LoadingScreen para App
    const navigation = useNavigation<any>();
    const { user, userRole, isLoadingAuth } = useAuth();

    useEffect(() => {
        console.info('App - useEffect disparado');
        console.info('App - user:', user);
        console.info('App - userRole:', userRole);
        console.info('App - isLoadingAuth:', isLoadingAuth);

        if (!isLoadingAuth) {
            if (userRole === 'admin') {
                console.info('App - Navegando para ReportListScreen (Admin)');
                navigation.replace('ReportListScreen');
            } else if (userRole === 'user') {
                console.info('App - Navegando para ChecklistScreen (User)');
                navigation.replace('ChecklistScreen');
            } else {
                console.info('App - Navegando para Auth');
                navigation.replace('Auth');
            }
        }
    }, [user, userRole, isLoadingAuth, Error, navigation]);

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

