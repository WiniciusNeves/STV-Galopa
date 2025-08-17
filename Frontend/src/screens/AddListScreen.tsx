import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  View, Text, Image, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert,
  Animated, // << MUDANÇA: Importado
  Dimensions // << MUDANÇA: Importado
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/addListStyles';
import MenuBottom from '../components/common/MenuBottom';
import Logout from '../components/common/Logout';
import colors from '../styles/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  getNames, addName, deleteName, updateName,
  getPlates, addPlate, deletePlate, updatePlate
} from '../service/namePlateService';

// Interfaces
interface DataItem {
  id: string;
  value: string;
}
interface EditingItem {
  id: string;
  type: 'name' | 'plate';
}

// << MUDANÇA: Lógica de medição para a animação
const { width } = Dimensions.get('window');
// Calcula a largura de cada botão, considerando as margens laterais (20 de cada lado)
const buttonWidth = (width - 40) / 2;

export default function AddListScreen() {
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'names' | 'plates'>('names');
  const [namesList, setNamesList] = useState<DataItem[]>([]);
  const [platesList, setPlatesList] = useState<DataItem[]>([]);
  const [nameInput, setNameInput] = useState('');
  const [plateInput, setPlateInput] = useState('');
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [userRole, setUserRole] = useState('');

  // << MUDANÇA: Setup da animação
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const storedRole = await AsyncStorage.getItem('@userRole');
        if (storedRole) setUserRole(storedRole);
      } catch (error) {
        console.error('Falha ao buscar o papel do usuário:', error);
      }
    };
    fetchUserRole();
  }, []);

  // << MUDANÇA: useEffect para disparar a animação quando a aba ativa muda
  useEffect(() => {
    Animated.timing(animation, {
      toValue: activeView === 'names' ? 0 : 1, // 0 para Nomes, 1 para Placas
      duration: 300,
      useNativeDriver: false, // Necessário para animar layout
    }).start();
  }, [activeView, animation]);
  
  // << MUDANÇA: Interpola o valor da animação para a posição (translateX)
  const highlightTranslate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, buttonWidth], // Desliza 0px ou a largura de um botão
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [namesData, platesData] = await Promise.all([getNames(), getPlates()]);
      setNamesList(namesData?.map(item => ({ id: item.id, value: item.name })) || []);
      setPlatesList(platesData?.map(item => ({ id: item.id, value: item.plate })) || []);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchData(); }, []));

  // Funções handleAddItem, handleStartEdit, handleCancelEdit, handleUpdateItem, handleDelete continuam iguais
  const handleAddItem = async () => {
    if (!nameInput.trim() && !plateInput.trim()) {
      Alert.alert("Atenção", "Preencha pelo menos um dos campos.");
      return;
    }
    const promises = [];
    if (nameInput.trim()) promises.push(addName(nameInput.trim()));
    if (plateInput.trim()) promises.push(addPlate(plateInput.trim()));
    try {
      await Promise.all(promises);
      Alert.alert("Sucesso", "Item(s) adicionado(s)!");
      setNameInput('');
      setPlateInput('');
      fetchData();
    } catch (error) {
      Alert.alert("Erro", "Falha ao adicionar. Verifique se o item já existe.");
    }
  };

  const handleStartEdit = (item: DataItem, type: 'name' | 'plate') => {
    setEditingItem({ id: item.id, type });
    if (type === 'name') {
      setNameInput(item.value);
      setPlateInput('');
    } else {
      setPlateInput(item.value);
      setNameInput('');
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setNameInput('');
    setPlateInput('');
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;
    try {
      if (editingItem.type === 'name') {
        if (!nameInput.trim()) throw new Error("O nome não pode ser vazio.");
        await updateName(editingItem.id, nameInput.trim());
      } else {
        if (!plateInput.trim()) throw new Error("A placa não pode ser vazia.");
        await updatePlate(editingItem.id, plateInput.trim());
      }
      Alert.alert("Sucesso", "Item atualizado!");
      handleCancelEdit();
      fetchData();
    } catch (error) {
      Alert.alert("Erro", `Não foi possível atualizar: ${error.message}`);
    }
  };

  const handleDelete = (item: DataItem, type: 'name' | 'plate') => {
    const itemType = type === 'name' ? 'nome' : 'placa';
    Alert.alert("Confirmar", `Deseja remover ${itemType} "${item.value}"?`, [
      { text: "Cancelar" },
      { text: "Excluir", onPress: async () => {
          try {
            if (type === 'name') await deleteName(item.id);
            else await deletePlate(item.id);
            fetchData();
          } catch (error) {
            Alert.alert("Erro", `Não foi possível deletar o ${itemType}.`);
          }
        }
      },
    ]);
  };

  const renderItem = ({ item }: { item: DataItem }) => {
    const type = activeView === 'names' ? 'name' : 'plate';
    return (
      <View style={styles.listItem}>
        <Text style={styles.listItemText}>{item.value}</Text>
        <View style={styles.listItemActions}>
          <TouchableOpacity style={styles.iconButton} onPress={() => handleStartEdit(item, type)}>
            <Ionicons name="pencil" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, styles.deleteButton]} onPress={() => handleDelete(item, type)}>
            <Ionicons name="trash" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header e Formulário continuam iguais */}
      <View style={styles.header}>
        <Image source={require('../assets/img/logo.png')} style={styles.logoImage} />
        <View style={styles.logoutContainer}>
          <Logout />
        </View>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, editingItem && editingItem.type !== 'name' && styles.inputDisabled]}
            placeholder="Nome"
            placeholderTextColor="#888"
            value={nameInput}
            onChangeText={setNameInput}
            editable={!editingItem || editingItem.type === 'name'}
          />
          <TextInput
            style={[styles.input, editingItem && editingItem.type !== 'plate' && styles.inputDisabled]}
            placeholder="Placa"
            placeholderTextColor="#888"
            value={plateInput}
            onChangeText={setPlateInput}
            editable={!editingItem || editingItem.type === 'plate'}
          />
        </View>

        <TouchableOpacity style={styles.addButton} onPress={editingItem ? handleUpdateItem : handleAddItem}>
          <Text style={styles.addButtonText}>{editingItem ? 'Atualizar' : 'Adicionar'}</Text>
        </TouchableOpacity>

        {editingItem && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
            <Text style={styles.cancelButtonText}>Cancelar Edição</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* << MUDANÇA: JSX do seletor de abas atualizado com a View animada */}
      <View style={styles.segmentedControlContainer}>
        <Animated.View 
          style={[
            styles.highlight, 
            { width: buttonWidth, transform: [{ translateX: highlightTranslate }] }
          ]} 
        />
        <TouchableOpacity style={styles.segmentButton} onPress={() => setActiveView('names')}>
          <Text style={[styles.segmentText, activeView === 'names' && styles.segmentTextActive]}>Nomes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.segmentButton} onPress={() => setActiveView('plates')}>
          <Text style={[styles.segmentText, activeView === 'plates' && styles.segmentTextActive]}>Placas</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={activeView === 'names' ? namesList : platesList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyListText}>Nenhum item cadastrado.</Text>}
        />
      )}
      
      <MenuBottom userRole={userRole} />
    </View>
  );
}