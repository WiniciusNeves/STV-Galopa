import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Modal,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import 'moment/locale/pt-br';
import styles from '../styles/reportDetailStyles';
import MenuBottom from '../components/common/MenuBottom';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logout from '../components/common/Logout';
import colors from '../styles/Colors';

interface Report {
  area?: string;
  nome: string;
  placa: string;
  quilometragem?: number;
  nivelCombustivel?: string;
  nivelOleo?: string;
  pneus?: string | boolean;
  temEstepe?: boolean;
  relacaoTransmissao?: string;
  temBau?: boolean;
  temDocumento?: boolean;
  temCartaoCombustivel?: boolean;
  statusRecebimentoEntrega: string;
  descricao?: string;
  fotos: string[] | { url: string; tipo: string }[];
  createdAt: any;
  sector: string;
  type?: string;
  vehicleCategory: string;
}

export default function ReportDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation<any>();
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

  const handleImagePress = (url: string) => {
    setSelectedImage(url || '');
    setModalVisible(true);
  };

  if (!report) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando detalhes do relatório...</Text>
      </View>
    );
  }

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
          { label: 'Setor', value: report?.sector },
          { label: 'Área', value: report?.area },
          { label: 'Nome', value: report?.nome },
          { label: 'Placa', value: report?.placa },
          { label: 'Tipo de Veículo', value: report?.vehicleCategory },
          { label: 'KM Atual', value: report?.quilometragem != null ? `${report.quilometragem} km` : '–' },
          { label: 'Nível de Combustível', value: report?.nivelCombustivel },
          { label: 'Nível de Óleo', value: report?.nivelOleo },
          { label: 'Estado dos Pneus', value: report?.pneus ? (report.pneus === true ? 'Sim' : report.pneus) : '–' },
          { label: 'Tem Estepe', value: report?.temEstepe ? 'Sim' : 'Não', condition: report?.type === 'carro' },
          { label: 'Relação da Transmissão', value: report?.relacaoTransmissao, condition: report?.type === 'moto' },
          { label: 'Tem Baú', value: report?.temBau ? 'Sim' : 'Não', condition: report?.type === 'moto' },
          { label: 'Tem Documento', value: report?.temDocumento ? 'Sim' : 'Não' },
          { label: 'Tem Cartão Combustível', value: report?.temCartaoCombustivel ? 'Sim' : 'Não' },
          { label: 'Status Recebimento/Entrega', value: report?.statusRecebimentoEntrega },
        ].map((item, i) => (
          (item.condition === undefined || item.condition) ? (
            <View key={i} style={styles.row}>
              <Text style={styles.labelInline}>{item.label}</Text>
              <View style={styles.inlineInput}>
                <Text style={styles.fieldText}>{item.value || '–'}</Text>
              </View>
            </View>
          ) : null
        ))}

        <Text style={styles.label}>Observações</Text>
        <View style={styles.descricaoBox}>
          <Text style={styles.descricaoText}>
            {report?.descricao || '–'}
          </Text>
        </View>

        <Text style={styles.label}>Fotos</Text>
        <View style={styles.photoGridContainer}>
          {report?.fotos?.length ? (
            report.fotos.map((fotoItem, idx) => {
              const imageUrl = typeof fotoItem === 'string' ? fotoItem : fotoItem.url;
              const imageType = typeof fotoItem === 'string' ? 'Foto Genérica' : fotoItem.tipo;

              return (
                <View key={idx} style={styles.photoItem}>
                  <TouchableOpacity onPress={() => handleImagePress(imageUrl)}>
                    {imageUrl ? (
                      <Image
                        key={imageUrl}
                        source={{ uri: imageUrl }}
                        style={[styles.photo, { backgroundColor: 'lightgray' }]}
                        onError={(e) => console.error("Erro ao carregar imagem:", imageUrl, e.nativeEvent.error)}
                      />
                    ) : (
                      <View style={[styles.photo, { backgroundColor: 'darkgray', justifyContent: 'center', alignItems: 'center' }]}>
                          <Text style={{ color: colors.white, fontSize: 10 }}>URL Inválida</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  <Text style={styles.photoTypeText}>{imageType || 'Sem Tipo'}</Text>
                </View>
              );
            })
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
          {selectedImage ? (
            <Image
              key={selectedImage}
              source={{ uri: selectedImage }}
              style={[styles.modalImage, { backgroundColor: 'lightgray' }]}
            />
          ) : (
            <View style={[styles.modalImage, { backgroundColor: 'darkgray', justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: colors.white, fontSize: 12 }}>Imagem não disponível</Text>
            </View>
          )}
        </View>
      </Modal>
      
      {/* Botão de voltar */}
      <Pressable
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={30} color="#fff" />
      </Pressable>
      
      {/* Rodapé */}
      <MenuBottom userRole={userRole} />
    </View>
  );
}
