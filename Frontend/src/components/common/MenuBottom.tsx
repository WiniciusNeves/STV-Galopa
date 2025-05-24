import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Modal, StyleSheet } from 'react-native';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../styles/Colors';
import { container, item, register } from '../../styles/MenuBottom';
import { useToast } from '../../context/ToastContext'; // Adicionando o uso do Toast
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../../service/userService';

interface MenuBottomProps {
  userRole: string;
}

export default function MenuBottom({ userRole }: MenuBottomProps) {
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar a visibilidade do modal
  const navigation = useNavigation();
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
    navigation.navigate('ReportListScreen');
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

  // Função para lidar com o logout
  const handleLogoutPress = () => {
    setModalVisible(true); // Exibe o modal de confirmação
  };

  const confirmLogout = async () => {
    try {
      // Lógica de logout
      await logout(); // Chamada da função de logout, sem necessidade de 'auth'
      await AsyncStorage.removeItem('@token'); // Remove o token do AsyncStorage

      console.log("token" + await AsyncStorage.getItem('@token'));
      showToast({
        type: 'success',
        text1: 'Logout efetuado!',
        text2: 'Você foi desconectado com sucesso.',
      });
      navigation.navigate('Auth'); // Redireciona para a tela de autenticação
    } catch (error) {
      showToast({
        type: 'error',
        text1: 'Erro ao fazer logout!',
        text2: error.message,
      });
    } finally {
      setModalVisible(false); // Fecha o modal após a tentativa de logout
    }
  };

  const cancelLogout = () => {
    setModalVisible(false); // Fecha o modal sem fazer nada
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

      {/* Botão de Logout - Posicionado no canto superior direito e vermelho */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogoutPress}
        alignItems="center"
      >
        <Feather name="log-out" size={25} color="#fff" />
        <Text style={{ color: '#fff', marginLeft: 10, fontSize: 20 }}>Sair</Text>
      </TouchableOpacity>

      {/* Modal de confirmação de logout */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={cancelLogout}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ width: 300, padding: 20, backgroundColor: '#fff', borderRadius: 10 }}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>Tem certeza que deseja sair?</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={confirmLogout} style={{ padding: 10, backgroundColor: '#0A8042', borderRadius: 5 }}>
                <Text style={{ color: '#fff' }}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={cancelLogout} style={{ padding: 10, backgroundColor: '#F0C420', borderRadius: 5 }}>
                <Text style={{ color: '#fff' }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    position: 'absolute',
    top: -60,
    right: 20,
    backgroundColor: '#E74C3C', // Cor vermelha
    borderRadius: 50,
    padding: 10,
    zIndex: 10, // Garante que o botão fique sobre os outros componentes
    width: 150,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
