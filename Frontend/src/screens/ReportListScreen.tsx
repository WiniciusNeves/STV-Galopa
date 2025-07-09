import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    Animated,
    Dimensions,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import colors from '../styles/Colors';
import ReportItem from '../components/reports/ReportItem';
import MenuBottom from '../components/common/MenuBottom';

import { useToast } from '../context/ToastContext';
import { getChecklistsWithAuth } from '../service/checklistService';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';

import Logout from '../components/common/Logout';

const { width } = Dimensions.get('window');
const buttonWidth = (width - 40) / 2;

type ChecklistItem = {
    id: string;
    nome?: string;
    createdAt: {
        _seconds: number;
        _nanoseconds: number;
    };
};

const convertFirestoreTimestampToDate = (timestamp: ChecklistItem['createdAt']): Date => {
    if (timestamp && typeof timestamp._seconds === 'number') {
        return new Date(timestamp._seconds * 1000 + (timestamp._nanoseconds || 0) / 1000000);
    }
    return new Date(0);
};

export default function ReportListScreen() {
    const navigation = useNavigation();

    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [selectedDateFilter, setSelectedDateFilter] = useState('today');
    const [checklists, setChecklists] = useState<ChecklistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const animation = useRef(new Animated.Value(0)).current;
    const toast = useToast();
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const storedRole = await AsyncStorage.getItem('@userRole');
                if (storedRole) {
                    setUserRole(storedRole);
                }
            } catch (error) {
                console.error('Falha ao buscar role do usuário no AsyncStorage:', error);
            }
        };
        fetchRole();
    }, []);

    const fetchChecklists = useCallback(async () => {
        setLoading(true);
        try {
            const fetchedData = await getChecklistsWithAuth();
            setChecklists(fetchedData);
        } catch (error) {
            console.error('Erro ao buscar checklists:', error);
            toast.show('Erro ao buscar relatórios. Tente novamente.', 'error');
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchChecklists();
    }, [fetchChecklists]);

    useEffect(() => {
        Animated.timing(animation, {
            toValue: selectedDateFilter === 'today' ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [selectedDateFilter, animation]);

    const highlightTranslate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, buttonWidth],
    });

    const handleDateConfirm = (selectedDate: Date) => {
        setDate(selectedDate);
        setShowPicker(false);
        setSelectedDateFilter('custom');
    };

    const handleDateCancel = () => {
        setShowPicker(false);
    };

    const filteredChecklists = checklists.filter((item) => {
        const createdAtDate = convertFirestoreTimestampToDate(item.createdAt);

        const todayLocal = new Date();
        todayLocal.setHours(0, 0, 0, 0);

        const itemDateLocal = new Date(createdAtDate);
        itemDateLocal.setHours(0, 0, 0, 0);

        const selectedDateLocal = new Date(date);
        selectedDateLocal.setHours(0, 0, 0, 0);

        if (selectedDateFilter === 'today') {
            return itemDateLocal.getTime() <= todayLocal.getTime();
        } else {
            return (
                itemDateLocal.getFullYear() === selectedDateLocal.getFullYear() &&
                itemDateLocal.getMonth() === selectedDateLocal.getMonth() &&
                itemDateLocal.getDate() === selectedDateLocal.getDate()
            );
        }
    }).sort((a, b) => {
        const dateA = convertFirestoreTimestampToDate(a.createdAt);
        const dateB = convertFirestoreTimestampToDate(b.createdAt);
        return dateB.getTime() - dateA.getTime();
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={require("../assets/img/logo.png")} style={styles.logoImage} />
                <View style={styles.logoutContainer}>
                    <Logout />
                </View>
            </View>
            <Image
                source={require('../assets/img/Cubes.png')}
                style={styles.cubesImage}
            />

            <View style={styles.dateFilterContainer}>
                <View style={styles.dateFilterButtonsWrapper}>
                    <Animated.View
                        style={[
                            styles.highlight,
                            { transform: [{ translateX: highlightTranslate }] },
                        ]}
                    />

                    <TouchableOpacity
                        style={styles.dateFilterButton}
                        onPress={() => {
                            setDate(new Date());
                            setSelectedDateFilter('today');
                        }}
                    >
                        <Text style={[
                            styles.dateFilterButtonText,
                            selectedDateFilter === 'today' && styles.dateFilterButtonTextSelected,
                        ]}>
                            Hoje: {new Date().getDate()} de {new Date().toLocaleString('default', { month: 'long' })}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.dateFilterButton}
                        onPress={() => setShowPicker(true)}
                    >
                        <Text style={[
                            styles.dateFilterButtonText,
                            selectedDateFilter === 'custom' && styles.dateFilterButtonTextSelected,
                        ]}>
                            Selecionar Data
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={colors.primary} style={styles.activityIndicator} />
            ) : (
                <FlatList
                    data={filteredChecklists}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.flatListContent}
                    renderItem={({ item }) => {
                        const displayCreatedAt = convertFirestoreTimestampToDate(item.createdAt);

                        const dateStr = displayCreatedAt
                            ? displayCreatedAt.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
                            : '-';

                        const timeStr = displayCreatedAt
                            ? displayCreatedAt.toLocaleTimeString('pt-BR', { 
                                hour: '2-digit', 
                                minute: '2-digit', 
                                timeZone: 'America/Sao_Paulo'
                              })
                            : '-';

                        return (
                            <ReportItem
                                user={item.nome || 'Sem nome'}
                                date={dateStr}
                                time={timeStr}
                                onPress={() => {
                                    navigation.navigate('ReportDetails', { report: item });
                                }}
                            />
                        );
                    }}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyListContainer}>
                            <Text style={styles.emptyListText}>Nenhum relatório encontrado para a data selecionada.</Text>
                            <TouchableOpacity
                                onPress={fetchChecklists}
                                style={styles.reloadButton}
                            >
                                <Text style={styles.reloadButtonText}>Recarregar</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}

            <MenuBottom userRole={userRole} />

            <DateTimePickerModal
                isVisible={showPicker}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={handleDateCancel}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
       
        zIndex: 2, // garante que fique acima da imagem de fundo
    },

    logoImage:{
        width: "100%", 
        marginBottom: 15,
    },

    logoutContainer: {
        padding: 5,
    },
    cubesImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
    },
    dateFilterContainer: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    dateFilterButtonsWrapper: {
        flexDirection: 'row',
        borderRadius: 10,
        backgroundColor: colors.darkCard,
        overflow: 'hidden',
        position: 'relative',
    },
    highlight: {
        position: 'absolute',
        height: '100%',
        width: buttonWidth,
        backgroundColor: colors.primary,
        borderRadius: 10,
    },
    dateFilterButton: {
        width: buttonWidth,
        padding: 12,
    },
    dateFilterButtonText: {
        textAlign: 'center',
        color: colors.text,
    },
    dateFilterButtonTextSelected: {
        color: colors.white,
    },
    activityIndicator: {
        marginTop: 50,
    },
    flatListContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    emptyListContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    emptyListText: {
        color: colors.text,
        marginBottom: 10,
    },
    reloadButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    reloadButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
