import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    Alert,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../styles/Colors';
import * as s from '../styles/Auth';
import Input from '../components/auth/Input';
import PasswordInput from '../components/auth/PasswordInput';
import GradientButton from '../components/auth/GradientButton';
import RememberSwitch from '../components/auth/RememberSwitch';
import { login } from '../service/userService';

export default function LoginScreen() {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erro', 'Por favor, preencha email e senha.');
            return;
        }
        setLoading(true);
        try {
            const user = await login(email.trim(), password);

            if (!user) {
                Alert.alert('Erro', 'Usuário ou senha inválidos.');
                return;
            }

            if (user.role === 'admin') {
                navigation.replace('ReportListScreen');
            } else {
                navigation.replace('Register');
            }
        } catch (error: any) {
            Alert.alert('Erro', error.message || 'Erro ao realizar login.');
            console.error('[LOGIN] Erro ao fazer login:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={s.container.base}>
                    <Image
                        source={require('../assets/img/Cubes.png')}
                        style={{
                            position: 'absolute',
                            top: 0,
                            width: '100%',
                            height: '100%',
                        }}
                    />

                    <Image
                        source={require('../assets/img/logoAuth.png')}
                        style={s.imageStyle.base}
                    />

                    <View
                        style={{
                            width: '90%',
                            padding: 20,
                            borderRadius: 10,
                            alignItems: 'center',
                            marginTop: 80,
                            position: 'absolute',
                            top: 200,
                        }}
                    >
                        <Text style={{ color: colors.white, fontSize: 24, marginBottom: 20 }}>
                            Login
                        </Text>

                        <Input
                            icon="mail"
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                        />

                        <PasswordInput
                            placeholder="Senha"
                            value={password}
                            onChangeText={setPassword}
                        />

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%',
                                marginTop: 10,
                            }}
                        >
                            <RememberSwitch
                                value={remember}
                                onValueChange={setRemember}
                            />
                        </View>

                        <GradientButton text="Acessar" onPress={handleLogin} />
                    </View>

                    <View style={{ alignItems: 'center', position: 'absolute', top: 700 }}>
                        <Text style={{ color: colors.grey, textAlign: 'center' }}>
                            2025 STV Segurança
                        </Text>
                        <Text style={{ color: colors.grey, textAlign: 'center' }}>
                            Versão 1.0.0
                        </Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}