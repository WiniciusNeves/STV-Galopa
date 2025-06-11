import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Modal,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import 'moment/locale/pt-br';
import styles from '../styles/reportDetailStyles';
import MenuBottom from '../components/common/MenuBottom';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logout from '../components/common/Logout';

interface Report {
  area: string;
  nome: string;
  placa: string;
  quilometragem: number;
  nivelCombustivel: string;
  temEstepe: boolean;
  pneus: boolean;
  descricao: string;
  fotos: string[];
  createdAt: any;
}

export default function ReportDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const report = (route.params as any)?.report as Report;
  const [userRole, setUserRole] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('@userRole')
      .then(role => role && setUserRole(role))
      .catch(err => console.error(err));
  }, []);

  const getDateObject = (ts: any) => {
    if (!ts) return null;
    if (ts.toDate && typeof ts.toDate === 'function') return ts.toDate();
    if (ts._seconds != null) return new Date(ts._seconds * 1000);
    if (typeof ts === 'string' || ts instanceof Date) return new Date(ts);
    return null;
  };

  const dateObj = getDateObject(report?.createdAt);

  const handleImagePress = (uri: string) => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Topo */}
      <View style={styles.header}>
        <Image
          source={require('../assets/img/logo.png')}
          style={styles.logoImage}
        />
        <View style={styles.logoutContainer}>
          <Logout />
        </View>
      </View>

      {/* Data e hora */}
      <View style={styles.dateTime}>
        <View style={styles.iconText}>
          <Ionicons name="calendar-outline" size={26} color="#FFD700" />
          <Text style={styles.dateText}>
            {dateObj ? moment(dateObj).locale('pt-br').format('DD/MM/YYYY') : '–'}
          </Text>
        </View>

        <View style={{ width: 20 }} />

        <View style={styles.iconText}>
          <Ionicons name="time-outline" size={26} color="#FFD700" />
          <Text style={[styles.dateText, { marginLeft: 6 }]}>
            {dateObj ? moment(dateObj).locale('pt-br').format('HH:mm') : '–'}
          </Text>
        </View>
      </View>

      {/* Conteúdo */}
      <ScrollView style={styles.content}>
        {[
          { label: 'Área', value: report?.area },
          { label: 'Nome', value: report?.nome },
          { label: 'Placa', value: report?.placa },
          {
            label: 'Quilometragem',
            value: report?.quilometragem != null
              ? `${report.quilometragem} km`
              : '–',
          },
          { label: 'Nível de combustível', value: report?.nivelCombustivel },
          { label: 'Tem estepe', value: report?.temEstepe ? 'Sim' : 'Não' },
          { label: 'Pneus em bom estado', value: report?.pneus ? 'Sim' : 'Não' },
        ].map((item, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.labelInline}>{item.label}</Text>
            <View style={styles.inlineInput}>
              <Text style={styles.fieldText}>{item.value || '–'}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.label}>Descrição</Text>
        <View style={styles.descricaoBox}>
          <Text style={styles.descricaoText}>
            {report?.descricao || '–'}
          </Text>
        </View>

        <Text style={styles.label}>Fotos</Text>
        <View style={styles.photoContainer}>
          {report?.fotos?.length ? (
            report.fotos.map((url, idx) => (
              <TouchableOpacity key={idx} onPress={() => handleImagePress(url)}>
                <Image source={{ uri: url }} style={styles.photo} />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noPhotosText}>Nenhuma foto disponível</Text>
          )}
        </View>
      </ScrollView>

      {/* Modal de imagem em zoom */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <Image source={{ uri: selectedImage || '' }} style={styles.modalImage} />
        </View>
      </Modal>


      {/* Rodapé */}
      <MenuBottom userRole={userRole} />
    </View>
  );
}
