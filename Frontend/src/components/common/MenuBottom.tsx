import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../styles/Colors';
import { container, item, register } from '../../styles/MenuBottom';
import { useToast } from '../../context/ToastContext'; // Adicionando o uso do Toast

interface MenuBottomProps {
  navigation: any;
  userRole: string;
}

export default function MenuBottom({ navigation, userRole }: MenuBottomProps) {
  const { showToast } = useToast(); // Hook do ToastContext

  const handleReportPress = () => {
    showToast({
      type: 'info',
      text1: 'Acessando relatórios...',
      text2: 'Carregando informações dos relatórios.',
    });
    
  };

  const handleTrackingPress = () => {
    showToast({
      type: 'info',
      text1: 'Acessando rastreamento...',
      text2: 'Verificando a localização...',
    });
    
    
  };

  const handleRegisterPress = () => {
    showToast({
      type: 'success',
      text1: 'Registrando novo item!',
      text2: 'Você pode agora adicionar um novo registro.',
    });
   
   
  };

  return (
    <View style={container.base}>
      {/* Botão para acessar relatórios */}
      <TouchableOpacity style={item.base} onPress={handleReportPress}>
        <Feather name="file-text" size={36} color="#fff" style={item.icon} />
        <Text style={item.label}>Reportes</Text>
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
        <Feather name="map" size={36} color="#fff" style={item.icon} />
        <Text style={item.label}>Rastreamento</Text>
      </TouchableOpacity>
    </View>
  );
}
