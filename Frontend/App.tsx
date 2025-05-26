import React, { useEffect } from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from './src/styles/Colors';
import { useAuth } from './src/context/AuthContext';

export default function App() {  // <- ALTERADO de LoadingScreen para App
    const navigation = useNavigation<any>();
    const { user, userRole, isLoadingAuth } = useAuth();

    useEffect(() => {
        console.log('App - useEffect disparado');
        console.log('App - user:', user);
        console.log('App - userRole:', userRole);
        console.log('App - isLoadingAuth:', isLoadingAuth);

        if (!isLoadingAuth) {
            if (userRole === 'admin') {
                console.log('App - Navegando para ReportListScreen (Admin)');
                navigation.replace('ReportListScreen');
            } else if (userRole === 'user') {
                console.log('App - Navegando para ChecklistScreen (User)');
                navigation.replace('ChecklistScreen');
            } else {
                console.log('App - Navegando para Auth');
                navigation.replace('Auth');
            }
        }
    }, [user, userRole, isLoadingAuth, navigation]);

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
