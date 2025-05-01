import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../styles/Colors';
import { container, item, register } from '../../styles/MenuBottom';
import { useToast } from '../../context/ToastContext'; // Adicionando o uso do Toast

import { useNavigation } from '@react-navigation/native';

interface MenuBottomProps {
  navigation: any;
  userRole: string;
}

export default function MenuBottom({ navigation, userRole }: MenuBottomProps) {

  const { showToast } = useToast(); // Hook do ToastContext

  const handleReportPress = () => {
    if (userRole !== 'admin') {
      showToast({
        type: 'error',
        text1: 'Acesso negado!',
        text2: 'Você precisa da permissão de administrador para acessar relatórios.',
      });
      return;
    }

    showToast({
      type: 'info',
      text1: 'Acessando relatórios...',
      text2: 'Carregando informações dos relatórios.',
    });
    
  };

  const handleTrackingPress = () => {
    showToast({
      type: 'info',
      text1: 'Em manutenção...',
      text2: 'O recurso de rastreamento está em desenvolvimento.',
    });
    
    
  };

  const handleRegisterPress = () => {
    navigation.navigate('Register');
   
   
  };

  return (
    <View style={container.base}>
      {/* Botão para acessar relatórios */}
      <TouchableOpacity style={item.base} onPress={handleReportPress}>
        <MaterialIcons name="description" size={36} color="#fff" style={item.icon} />
        <Text style={item.label}>Relatórios</Text>
      </TouchableOpacity>

      {/* Botão para registrar um novo item */}
      <View style={register.wrapper}>
        <TouchableOpacity style={register.button} onPress={handleRegisterPress}>
          <LinearGradient
            colors={['#F0C420', '#0A8042']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={register.gradient}
          >
            <Ionicons name="add" size={32} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
        <Text style={item.label}>Registrar</Text>
      </View>

      {/* Botão para rastreamento */}
      <TouchableOpacity style={item.base} onPress={handleTrackingPress}>
        <MaterialIcons name="track-changes" size={36} color="#fff" style={item.icon} />
        <Text style={item.label}>Rastreamento</Text>
      </TouchableOpacity>
    </View>
  );
}

