import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importar navegação
import colors from '../styles/Colors';
import * as s from '../styles/Auth';
import Input from '../components/auth/Input';
import PasswordInput from '../components/auth/PasswordInput';
import GradientButton from '../components/auth/GradientButton';
import RememberSwitch from '../components/auth/RememberSwitch';


export default function LoginScreen() {
  const navigation = useNavigation(); // Hook de navegação
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleLogin = async () => {
     navigation.navigate('ReportListScreen'); // Navegar para a tela principal após o login
  };

  const handleRememberMe = () => {
    setRemember(!remember);
  };

  return (
    <View style={s.container.base}>
      <Image source={require('../assets/img/Cubes.png')} style={{ position: 'absolute', top: 0, width: '100%', height: '100%' }} />
      <Image source={require('../assets/img/logo.png')} style={s.imageStyle.base} />

      <View style={{ width: '90%', padding: 20, borderRadius: 10, alignItems: 'center', marginTop: 80 }}>
        <Text style={{ color: colors.white, fontSize: 24, marginBottom: 20 }}>Login</Text>

        <Input
          icon="mail"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <PasswordInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
          <RememberSwitch value={remember} onValueChange={handleRememberMe} />
        </View>

        <GradientButton text="Acessar" onPress={handleLogin} />
      </View>

      <Text style={{ color: colors.grey, textAlign: 'center', position: 'absolute', bottom: 150 }}>
        2025 STV Segurança
      </Text>
      <Text style={{ color: colors.grey, textAlign: 'center', position: 'absolute', bottom: 120 }}>
        Versão 1.0.0
      </Text>
    </View>
  );
}
