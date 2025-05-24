import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View, Text, TextInput, TouchableOpacity, Image, FlatList,
  KeyboardAvoidingView, Platform, Animated, Alert,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';

import { createChecklistWithAuth } from "../service/checklistService";
import colors from "../styles/Colors";
import styles from "../styles/Register"; // Supondo que isso defina seus estilos
import MenuBottom from "../components/common/MenuBottom";
import GradientButton from "../components/auth/GradientButton";
import AnimatedSelect from '../components/common/AnimatedSelect'; // Supondo que este componente exista

export default function Register({ userRole = 'admin' }) {
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [selectedPlate, setSelectedPlate] = useState("");
  const [km, setKm] = useState("");
  const [fuelLevel, setFuelLevel] = useState("");
  const [tireCondition, setTireCondition] = useState("");
  const [hasSpareTire, setHasSpareTire] = useState(true);
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const translateXAnim = useRef(new Animated.Value(0)).current;

  // Constantes para opções de seleção - movidas para dentro do componente ou para fora se forem realmente estáticas
  const OPTIONS = {
    PA_NAMES: [{ label: "PA 1", value: "pa1" }, { label: "PA 2", value: "pa2" }],
    AREAS: [{ label: "Área 1", value: "area1" }, { label: "Área 2", value: "area2" }],
    PLATES: [{ label: "ABC-1234", value: "abc1234" }, { label: "XYZ-5678", value: "xyz5678" }],
    FUEL_LEVELS: [{ label: "Baixo", value: "baixo" }, { label: "Médio", value: "medio" }, { label: "Alto", value: "alto" }],
    TIRE_CONDITIONS: [{ label: "Bom", value: "bom" }, { label: "Trocar", value: "trocar" }]
  };

  useEffect(() => {
    Animated.spring(translateXAnim, {
      toValue: hasSpareTire ? 0 : 130,
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
      useNativeDriver: true,
    }).start();
  }, [hasSpareTire, translateXAnim]); // Adicionado translateXAnim ao array de dependências

  // Função unificada para solicitar permissão e escolher imagem
  const requestPermissionAndPickImage = useCallback(async (source) => {
    let permission;
    if (source === 'camera') {
      permission = await ImagePicker.requestCameraPermissionsAsync();
    } else {
      permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    }

    if (permission.status !== 'granted') {
      Alert.alert('Permissão Negada', 'Você precisa conceder permissão para acessar a ' + (source === 'camera' ? 'câmera' : 'galeria') + '.');
      return;
    }

    let result;
    if (source === 'camera') {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8
      });
    }

    if (!result.canceled && result.assets) {
      setPhotos(prevPhotos => [...prevPhotos, ...result.assets]);
    }
  }, []);

  const takePhoto = () => requestPermissionAndPickImage('camera');
  const chooseFromGallery = () => requestPermissionAndPickImage('gallery');


  const handleSave = async () => {
    if (!selectedArea || !selectedName || !selectedPlate || !km || !fuelLevel || !tireCondition) {
      return Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
    }

    // Validação básica para KM
    if (isNaN(parseInt(km)) || parseInt(km) <= 0) {
        return Alert.alert("Erro", "Quilometragem deve ser um número válido e maior que zero.");
    }

    const checklistData = {
      area: selectedArea,
      nome: selectedName,
      placa: selectedPlate,
      quilometragem: parseInt(km),
      nivelCombustivel: fuelLevel,
      pneus: tireCondition === "Bom", // Assumindo que "Bom" significa true
      temEstepe: hasSpareTire,
      descricao: description,
    };

    try {
      const result = await createChecklistWithAuth(checklistData, photos);

      if (result) {
        Alert.alert("Sucesso", "Checklist enviado com sucesso!");
        // Limpa todos os campos em caso de sucesso
        setSelectedArea("");
        setSelectedName("");
        setSelectedPlate("");
        setKm("");
        setFuelLevel("");
        setTireCondition("");
        setHasSpareTire(true);
        setDescription("");
        setPhotos([]);
      } else {
        // Erro já logado em createChecklistWithAuth
        Alert.alert("Erro", "Falha ao enviar o checklist. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro inesperado ao salvar checklist no frontend:", error);
      Alert.alert("Erro", "Ocorreu um erro inesperado ao salvar o checklist.");
    }
  };

  // renderPhotoItem memoizado para performance
  const renderPhotoItem = useCallback(({ item }) => (
    <Image
      source={{ uri: item.uri }}
      style={{ width: 100, height: 100, marginRight: 10, borderRadius: 5 }}
    />
  ), []); // Sem dependências, então só renderiza novamente se as props mudarem

  // Renderização do formulário separada em uma função distinta para clareza
  const renderForm = () => (
    <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'flex-start', paddingBottom: 80 }}>
      {/* Imagens de fundo */}
      <Image source={require('../assets/img/Cubes.png')} style={{ position: 'absolute', top: 0, width: '100%', height: '100%', zIndex: -1 }} />
      <Image source={require('../assets/img/logo.png')} style={{ width: "100%", height: 160, position: "relative", top: 0 }} />

      {/* Campos do Formulário */}
      <Text style={styles.label}>Área</Text>
      <AnimatedSelect
        placeholder={"Selecione uma Área"}
        label="Área"
        options={OPTIONS.AREAS}
        selectedValue={selectedArea}
        onValueChange={setSelectedArea}
      />

      <Text style={styles.label}>Nomes dos PA</Text>
      <AnimatedSelect
        placeholder={"Selecione um PA"}
        label="Nomes dos PA"
        options={OPTIONS.PA_NAMES}
        selectedValue={selectedName}
        onValueChange={setSelectedName}
      />

      <Text style={styles.label}>Placas dos Carros</Text>
      <AnimatedSelect
        placeholder={"Selecione uma Placa"}
        label="Placas dos Carros"
        options={OPTIONS.PLATES}
        selectedValue={selectedPlate}
        onValueChange={setSelectedPlate}
      />

      <Text style={styles.label}>KM Atual</Text>
      <TextInput
        style={styles.input}
        value={km}
        onChangeText={(text) => setKm(text.replace(/[^0-9]/g, ''))} // Garante apenas números
        placeholder="Digite a quilometragem"
        placeholderTextColor={colors.placeholder}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Nível de Combustível</Text>
      <AnimatedSelect
        placeholder={"Selecione o nível de combustível"}
        label="Nível de Combustível"
        options={OPTIONS.FUEL_LEVELS}
        selectedValue={fuelLevel}
        onValueChange={setFuelLevel}
      />

      <Text style={styles.label}>Estado dos Pneus</Text>
      <AnimatedSelect
        placeholder={"Selecione o estado dos pneus"}
        label="Estado dos Pneus"
        options={OPTIONS.TIRE_CONDITIONS}
        selectedValue={tireCondition}
        onValueChange={setTireCondition}
      />

      <Text style={[styles.label, { color: 'white', alignSelf: 'flex-start' }]}>
        Viatura tem estepe?
      </Text>
      <View style={{
        flexDirection: 'row',
        borderRadius: 10,
        backgroundColor: colors.darkCard,
        overflow: 'hidden',
        position: 'relative',
        width: 250,
        height: 45,
        marginBottom: 20,
      }}>
        <Animated.View
          style={{
            position: 'absolute',
            width: '50%',
            height: '100%',
            backgroundColor: colors.primary,
            borderRadius: 10,
            transform: [{ translateX: translateXAnim }],
          }}
        />
        <TouchableOpacity
          onPress={() => setHasSpareTire(true)}
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 1 }}
        >
          <Text style={{ color: hasSpareTire === true ? 'white' : 'gray' }}>Sim</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setHasSpareTire(false)}
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 1 }}
        >
          <Text style={{ color: hasSpareTire === false ? 'white' : 'gray' }}>Não</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Descrição / Observação</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top', marginBottom: 10 }]}
        value={description}
        onChangeText={setDescription}
        multiline
        placeholder="Digite aqui sua observação"
        placeholderTextColor="gray"
      />

      {/* Botões de Upload de Fotos e Exibição */}
      <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', width: '80%', marginBottom: 20 }}>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#F8A500' }]} onPress={takePhoto}>
          <Text style={styles.buttonText}>Usar Câmera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#007AFF', marginTop: 10 }]} onPress={chooseFromGallery}>
          <Text style={styles.buttonText}>Escolher da Galeria</Text>
        </TouchableOpacity>

        {photos.length > 0 && (
          <View style={{ width: '100%', alignItems: 'center', marginTop: 20 }}>
            <Text style={styles.label}>Fotos Adicionadas</Text>
            <FlatList
              data={photos}
              horizontal
              // Usa 'uri' como chave se for único, ou adicione um ID único
              keyExtractor={(item) => item.uri} 
              renderItem={renderPhotoItem}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
      </View>

      <GradientButton text="Confirmar envio" onPress={handleSave} style={{ marginTop: 20 }} />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <FlatList
        data={[{ key: 'form' }]}
        renderItem={renderForm} // Renderiza o formulário
        keyExtractor={(item) => item.key}
        ListFooterComponent={<View style={{ height: 100 }} />} // Adiciona um preenchimento na parte inferior para o teclado
      />
      <MenuBottom userRole={userRole} />
    </KeyboardAvoidingView>
  );
}