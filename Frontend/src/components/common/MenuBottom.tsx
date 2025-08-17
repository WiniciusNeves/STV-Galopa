import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, Modal, Keyboard, Animated } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';

import colors from '../../styles/Colors';
import { container, item, register } from '../../styles/MenuBottom';
import { useToast } from '../../context/ToastContext';

interface MenuBottomProps {
  userRole: string;
}

export default function MenuBottom({ userRole }: MenuBottomProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const route = useRoute(); // ⬅️ Pegando a rota atual
  const { showToast } = useToast();

  const [menuVisible, setMenuVisible] = useState(true);
  const menuTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setMenuVisible(false);
      Animated.timing(menuTranslateY, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setMenuVisible(true);
      Animated.timing(menuTranslateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [menuTranslateY]);

  const handleReportPress = () => {
    if (userRole !== 'admin' && userRole !== 'manager') {
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
    if (userRole !== 'admin') {
      showToast({
        type: 'error',
        text1: 'Acesso negado!',
        text2: 'Você precisa da permissão de administrador ou usuário para acessar rastreamento.',
      });
      return;
    }
    navigation.navigate('TrackingScreen');
  };

  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };

  const isActive = (routeName: string) => route.name === routeName;

  return (
    <Animated.View style={[container.base, { transform: [{ translateY: menuTranslateY }] }]}>
      {menuVisible && (
        <>
          <TouchableOpacity style={item.base} onPress={handleReportPress}>
            <MaterialIcons
              name="description"
              size={36}
              color={isActive('ReportListScreen') ? '#F0C420' : '#fff'}
              style={item.icon}
            />
            <Text style={[item.label, isActive('ReportListScreen') && { color: '#F0C420' }]}>
              Relatórios
            </Text>
          </TouchableOpacity>

          <View style={register.wrapper}>
            <TouchableOpacity style={register.button} onPress={handleRegisterPress}>
              <LinearGradient
                colors={['#F0C420', '#0A8042']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={register.gradient}
              >
                <Ionicons
                  name="add"
                  size={32}
                  color={isActive('Register') ? '#F0C420' : '#fff'}
                />
              </LinearGradient>
            </TouchableOpacity>
            <Text style={[item.label, isActive('Register') && { color: '#F0C420' }]}>
              Registrar
            </Text>
          </View>

          <TouchableOpacity style={item.base} onPress={handleTrackingPress}>
            <MaterialIcons
              name="track-changes"
              size={36}
              color={isActive('TrackingScreen') ? '#F0C420' : '#fff'}
              style={item.icon}
            />
            <Text style={[item.label, isActive('TrackingScreen') && { color: '#F0C420' }]}>
              Rastreamento
            </Text>
          </TouchableOpacity>
        </>
      )}
    </Animated.View>
  );
}
