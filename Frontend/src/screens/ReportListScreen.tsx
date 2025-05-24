import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    Animated,
    Dimensions
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import colors from '../styles/Colors';
import ReportItem from '../components/reports/ReportItem';
import MenuBottom from '../components/common/MenuBottom';

import { useToast } from '../context/ToastContext';

const { width } = Dimensions.get('window');
const buttonWidth = (width - 40) / 2;

export default function ReportListScreen() {
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [selected, setSelected] = useState('today'); // 'today' or 'custom'
    const animation = useRef(new Animated.Value(0)).current;
    const toast = useToast();

    const data = [
        { id: '1', date: '17/04/2025', time: '10:30', user: 'Usuário selecionado' },
        { id: '2', date: '18/04/2025', time: '14:20', user: 'Outro usuário' },
    ];

    const handleConfirm = (selectedDate) => {
        setDate(selectedDate);
        setShowPicker(false);
        setSelected('custom');
    };

    useEffect(() => {
        Animated.timing(animation, {
            toValue: selected === 'today' ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [selected]);

    const highlightTranslate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, buttonWidth],
    });

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <Image
                source={require('../assets/img/logo.png')}
                style={{
                    width: '100%',
                    height: "15%",
                    marginBottom: 40,
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                }}
            />
            <Image
                source={require('../assets/img/Cubes.png')}
                style={{
                    width: '100%',
                    height: "100%",
                    position: 'absolute',
                    top: 0,
                }}
            />

            {/* Botões com animação */}
            <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
                <View style={{
                    flexDirection: 'row',
                    borderRadius: 10,
                    backgroundColor: colors.darkCard,
                    overflow: 'hidden',
                    position: 'relative',
                }}>
                    {/* Highlight animado */}
                    <Animated.View
                        style={{
                            position: 'absolute',
                            height: '100%',
                            width: buttonWidth,
                            backgroundColor: colors.primary,
                            transform: [{ translateX: highlightTranslate }],
                            borderRadius: 10,
                        }}
                    />

                    {/* Botão Hoje */}
                    <TouchableOpacity
                        style={{ width: buttonWidth, padding: 12 }}
                        onPress={() => {
                            setDate(new Date());
                            setSelected('today');
                        }}
                    >
                        <Text style={{
                            textAlign: 'center',
                            color: selected === 'today' ? colors.white : colors.text
                        }}>
                            Hoje: {date.getDate()} de {date.toLocaleString('default', { month: 'long' })}
                        </Text>
                    </TouchableOpacity>

                    {/* Botão Selecionar */}
                    <TouchableOpacity
                        style={{ width: buttonWidth, padding: 12 }}
                        onPress={() => setShowPicker(true)}
                    >
                        <Text style={{
                            textAlign: 'center',
                            color: selected === 'custom' ? colors.white : colors.text
                        }}>
                            Selecionar Data
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Lista de relatórios */}
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => { /* navegação futura */ }}>
                        <ReportItem {...item} />
                    </TouchableOpacity>
                )}
            />

            {/* Menu e Date Picker */}
            <MenuBottom />

            <DateTimePickerModal
                isVisible={showPicker}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={() => setShowPicker(false)}
            />
        </View>
    );
}