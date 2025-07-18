import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Entypo } from '@expo/vector-icons';
import colors from '../../styles/Colors';
import styles from '../../styles/phoneStyler';

export interface PhotoWithMetadata {
    uri: string;
    type: string;
}

interface PhotoUploadSectionProps {
    vehicleCategory: string | null;
    onPhotosChange: (photos: PhotoWithMetadata[]) => void;
    isSubmitting: boolean;
    initialPhotos?: PhotoWithMetadata[];
}

const PHOTO_PLACEHOLDERS: { [key: string]: { label: string; image: any } } = {
    'VTR_Frente': { label: 'Frente', image: require('../../assets/img/placeholders/VTR/Frente.png') },
    'VTR_Traseira': { label: 'Traseira', image: require('../../assets/img/placeholders/VTR/Traseira.png') },
    'VTR_Lado Direito': { label: 'Lado Direito', image: require('../../assets/img/placeholders/VTR/Lado do passageiro.png') },
    'VTR_Lado Esquerdo': { label: 'Lado Esquerdo', image: require('../../assets/img/placeholders/VTR/Lado do motorista.png') },
    'VTR_Painel': { label: 'Painel', image: require('../../assets/img/placeholders/VTR/Painel do Carro (Quilometragem).png') },

    'MOTO_Frente': { label: 'Frente', image: require('../../assets/img/placeholders/MOTO/Frente.png') },
    'MOTO_Traseira': { label: 'Traseira', image: require('../../assets/img/placeholders/MOTO/Traseira.png') },
    'MOTO_Lado Direito': { label: 'Lado Direito', image: require('../../assets/img/placeholders/MOTO/Lado direito.png') },
    'MOTO_Lado Esquerdo': { label: 'Lado Esquerdo', image: require('../../assets/img/placeholders/MOTO/Lado esquerdo.png') },
    'MOTO_Painel': { label: 'Painel', image: require('../../assets/img/placeholders/MOTO/Painel da Moto (Quilometragem).png') },
};

const PhotoUploadSection: React.FC<PhotoUploadSectionProps> = ({
    vehicleCategory,
    onPhotosChange,
    isSubmitting,
    initialPhotos = [],
}) => {
    const [currentPhotos, setCurrentPhotos] = useState<PhotoWithMetadata[]>(initialPhotos);

    const getRequiredPhotoTypes = (category: string | null) => {
        if (category === 'VTR' || category === 'MOTO') {
            return ['Frente', 'Traseira', 'Lado Direito', 'Lado Esquerdo', 'Painel'];
        }
        return [];
    };

    useEffect(() => {
        const types = getRequiredPhotoTypes(vehicleCategory);
        setCurrentPhotos(types.map((type) => {
            const found = initialPhotos.find(p => p.type === type);
            return found || { uri: '', type };
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vehicleCategory]);

    useEffect(() => {
        const nonEmptyPhotos = currentPhotos.filter(p => p.uri !== '');
        onPhotosChange(nonEmptyPhotos);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPhotos]);


    const pickImage = async (type: string, source: 'camera' | 'gallery') => {
        if (isSubmitting) return;

        let result;
        if (source === 'camera') {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão Negada', 'Você precisa conceder permissão para acessar a câmera.');
                return;
            }
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.7,
                aspect: [4, 3],
            });
        } else {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão Negada', 'Você precisa conceder permissão para acessar a galeria.');
                return;
            }
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: false,
                quality: 0.7,
                aspect: [4, 3],
            });
        }

        if (!result.canceled && result.assets?.length) {
            const newUri = result.assets[0].uri;
            setCurrentPhotos(prev =>
                prev.map(photo => photo.type === type ? { ...photo, uri: newUri } : photo)
            );
        }
    };

    const removePhoto = (type: string) => {
        Alert.alert(
            'Remover Foto',
            `Deseja remover a foto de ${type}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: () => {
                        setCurrentPhotos(prev =>
                            prev.map(photo => photo.type === type ? { ...photo, uri: '' } : photo)
                        );
                    },
                },
            ]
        );
    };

    const renderSinglePhotoItem = (item: PhotoWithMetadata, isFullWidth = false) => {
        const placeholderKey = `${vehicleCategory}_${item.type}`;
        const placeholder = PHOTO_PLACEHOLDERS[placeholderKey];

        return (
            <View
                key={item.type}
                style={[
                    styles.photoContainer,
                    isFullWidth ? styles.fullWidthPhotoContainer : styles.halfWidthPhotoContainer
                ]}
            >
                <Text style={styles.photoLabel}>{placeholder?.label || item.type}</Text>
                <View style={styles.photoBox}>
                    {item.uri ? (
                        <Image source={{ uri: item.uri }} style={styles.photoImage} />
                    ) : placeholder?.image ? (
                        <Image source={placeholder.image} style={styles.placeholderIconImage} />
                    ) : (
                        <Text style={{ color: '#fff' }}>Foto</Text>
                    )}
                </View>

                {item.uri ? (
                    <TouchableOpacity
                        onPress={() => removePhoto(item.type)}
                        style={styles.removeButtonFullWidth}
                        disabled={isSubmitting}
                    >
                        <Text style={styles.removeButtonText}>Apagar foto</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.actionButtonsRow}>
                        <TouchableOpacity
                            onPress={() => pickImage(item.type, 'camera')}
                            style={styles.actionButton}
                            disabled={isSubmitting}
                        >
                            <Entypo name="camera" size={24} color={colors.white} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => pickImage(item.type, 'gallery')}
                            style={styles.actionButton}
                            disabled={isSubmitting}
                        >
                            <Entypo name="image" size={24} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    if (!vehicleCategory) return null;

    return (
        <View style={styles.photoSection}>
            <Text style={styles.sectionTitle}>Fotos do veículo</Text>

            <View style={styles.photoRow}>
                {currentPhotos.some(p => p.type === 'Frente') &&
                    renderSinglePhotoItem(currentPhotos.find(p => p.type === 'Frente')!)}
                {currentPhotos.some(p => p.type === 'Lado Direito') &&
                    renderSinglePhotoItem(currentPhotos.find(p => p.type === 'Lado Direito')!)}
            </View>

            <View style={styles.photoRow}>
                {currentPhotos.some(p => p.type === 'Traseira') &&
                    renderSinglePhotoItem(currentPhotos.find(p => p.type === 'Traseira')!)}
                {currentPhotos.some(p => p.type === 'Lado Esquerdo') &&
                    renderSinglePhotoItem(currentPhotos.find(p => p.type === 'Lado Esquerdo')!)}
            </View>

            <View style={styles.photoRow}>
                {currentPhotos.some(p => p.type === 'Painel') &&
                    renderSinglePhotoItem(currentPhotos.find(p => p.type === 'Painel')!, true)}
            </View>

        </View>
    );
};

export default PhotoUploadSection;
