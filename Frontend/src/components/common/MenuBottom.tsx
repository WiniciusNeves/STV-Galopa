import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, Modal, Keyboard, Animated, StyleSheet } from 'react-native';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../../styles/Colors'; // Certifique-se que o caminho está correto
import { container, item, register, logout as logoutStyles, modal as modalStyles } from '../../styles/MenuBottom';
import { useToast } from '../../context/ToastContext';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../../service/userService';

interface MenuBottomProps {
  userRole: string;
}

export default function MenuBottom({ userRole }: MenuBottomProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const { showToast } = useToast();

  // Estado para controlar a visibilidade do menu (true = visível, false = escondido)
  const [menuVisible, setMenuVisible] = useState(true);
  // Animação para a transição do menu
  const menuTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Listener para quando o teclado aparece
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setMenuVisible(false); // Esconde o menu
        Animated.timing(menuTranslateY, {
          toValue: 100, // Move o menu 100px para baixo (fora da tela)
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    );

    // Listener para quando o teclado desaparece
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setMenuVisible(true); // Mostra o menu
        Animated.timing(menuTranslateY, {
          toValue: 0, // Retorna o menu à sua posição original
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    );

    // Limpeza dos listeners ao desmontar o componente
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [menuTranslateY]); // O dependency array garante que o efeito só rode uma vez

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

  const handleLogoutPress = () => {
    setModalVisible(true);
  };

  const confirmLogout = async () => {
    try {
      await logout(navigation);
      showToast({
        type: 'success',
        text1: 'Logout efetuado!',
        text2: 'Você foi desconectado com sucesso.',
      });
    } catch (error: any) {
      showToast({
        type: 'error',
        text1: 'Erro ao fazer logout!',
        text2: error.message || 'Ocorreu um erro desconhecido.',
      });
    } finally {
      setModalVisible(false);
    }
  };

  const cancelLogout = () => {
    setModalVisible(false);
  };

  return (
    // Usa Animated.View para aplicar a animação de translateY
    <Animated.View style={[container.base, { transform: [{ translateY: menuTranslateY }] }]}>
      {/* O menu inteiro é ocultado quando o teclado está ativo */}
      {menuVisible && (
        <>
          <TouchableOpacity style={item.base} onPress={handleReportPress}>
            <MaterialIcons name="description" size={36} color="#fff" style={item.icon} />
            <Text style={item.label}>Relatórios</Text>
          </TouchableOpacity>

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

          <TouchableOpacity style={item.base} onPress={handleTrackingPress}>
            <MaterialIcons name="track-changes" size={36} color="#fff" style={item.icon} />
            <Text style={item.label}>Rastreamento</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={logoutStyles.button}
            onPress={handleLogoutPress}
          >
            <Feather name="log-out" size={24} color="#fff" />
          </TouchableOpacity>
        </>
      )}

      {/* Modal de confirmação de logout */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={cancelLogout}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.container}>
            <Text style={modalStyles.title}>Tem certeza que deseja sair?</Text>
            <View style={modalStyles.buttons}>
              <TouchableOpacity onPress={confirmLogout} style={modalStyles.confirmButton}>
                <Text style={modalStyles.confirmText}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={cancelLogout} style={modalStyles.cancelButton}>
                <Text style={modalStyles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}