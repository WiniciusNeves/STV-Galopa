import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator, // Certifique-se de que está importado
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import styles from "../styles/Register";
import { createChecklistWithAuth } from "../service/checklistService";
import AnimatedSelect from "../components/common/AnimatedSelect";
import GradientButton from "../components/auth/GradientButton";
import { Entypo } from "@expo/vector-icons";
import MenuBottom from "../components/common/MenuBottom";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
    areaOptions,
    nameOptions,
    plateOptions,
    tireConditionOptions,
    fuelLevelOptions, // 🎉 IMPORTANTE: IMPORTE AS NOVAS OPÇÕES 🎉
} from "../constants/selectOptions";
import Logout from "../components/common/Logout";

export default function RegistroScreen() {
    const translateXAnim = useRef(new Animated.Value(-1000)).current;
    const [selectedArea, setSelectedArea] = useState("");
    const [selectedName, setSelectedName] = useState("");
    const [selectedPlate, setSelectedPlate] = useState("");
    const [km, setKm] = useState("");
    const [fuelLevel, setFuelLevel] = useState(""); // Este estado agora será para o valor do select
    const [tireCondition, setTireCondition] = useState("");
    const [hasSpareTire, setHasSpareTire] = useState(true);
    const [description, setDescription] = useState("");
    const [photos, setPhotos] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userRole, setUserRole] = useState("");
    const [openSelectKey, setOpenSelectKey] = useState<string | null>(null);

    useEffect(() => {
        Animated.timing(translateXAnim, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        const fetchRole = async () => {
            const storedRole = await AsyncStorage.getItem("@userRole");
            setUserRole(storedRole || "user");
        };
        fetchRole();
    }, []);

    const handleSelectGallery = async () => {
        if (isSubmitting) return;
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão Negada', 'Você precisa conceder permissão para acessar a galeria.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
            aspect: [4, 3],
        });

        if (!result.canceled && result.assets) {
            const selectedPhotos = result.assets.map((asset) => asset.uri);
            setPhotos((prev) => [...prev, ...selectedPhotos]);
        }
    };

    const handleTakePhoto = async () => {
        if (isSubmitting) return;
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão Negada', 'Você precisa conceder permissão para acessar a câmera.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            aspect: [4, 3],
        });

        if (!result.canceled && result.assets) {
            const photo = result.assets[0].uri;
            setPhotos((prev) => [...prev, photo]);
        }
    };

    const handleSave = async () => {
        if (isSubmitting) {
            console.log("Submissão já em andamento, ignorando clique.");
            return;
        }

        const requiredFields = {
            "Área": selectedArea,
            "Nome do PA": selectedName,
            "Placa do Carro": selectedPlate,
            "KM Atual": km,
            "Nível de Combustível": fuelLevel, // Agora valida o valor do select
            "Estado dos Pneus": tireCondition,
        };

        let missingFields = [];
        for (const [label, value] of Object.entries(requiredFields)) {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                missingFields.push(label);
            }
        }

        if (missingFields.length > 0) {
            return Alert.alert(
                "Campos Obrigatórios",
                `Por favor, preencha os seguintes campos: \n${missingFields.join('\n')}`
            );
        }

        if (isNaN(parseInt(km)) || parseInt(km) <= 0) {
            return Alert.alert("Erro", "Quilometragem deve ser um número válido e maior que zero.");
        }

        setIsSubmitting(true);

        const checklistData = {
            area: selectedArea,
            nome: selectedName,
            placa: selectedPlate,
            quilometragem: parseInt(km),
            nivelCombustivel: fuelLevel, // Envia o valor do select
            pneus: tireCondition === "Bom",
            temEstepe: hasSpareTire,
            descricao: description,
            fotoUrls: photos, // Adiciona fotoUrls conforme exigido pela interface Checklist
        };

        try {
            const formattedPhotos = photos.map(uri => ({ uri }));
            const result = await createChecklistWithAuth(checklistData, formattedPhotos);

            if (result) {
                Alert.alert("Sucesso", "Checklist enviado com sucesso!");
                setSelectedArea("");
                setSelectedName("");
                setSelectedPlate("");
                setKm("");
                setFuelLevel(""); // Limpa o estado
                setTireCondition("");
                setHasSpareTire(true);
                setDescription("");
                setPhotos([]);
            } else {
                Alert.alert("Erro", "Falha ao enviar o checklist. Tente novamente.");
            }
        } catch (error) {
            console.error("Erro inesperado ao salvar checklist no frontend:", error);
            Alert.alert("Erro", "Ocorreu um erro inesperado ao salvar o checklist.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <Image source={require("../assets/img/Cubes.png")} style={styles.backgroundImage} />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={require("../assets/img/logo.png")} style={styles.logo} />
                <Logout />
            </View>

            <KeyboardAwareScrollView
                contentContainerStyle={styles.scrollContent}
                enableOnAndroid
                keyboardShouldPersistTaps="handled"
            >
                <Animated.View style={[styles.formContainer, { transform: [{ translateX: translateXAnim }] }]}>
                    <View style={styles.row}>
                        <AnimatedSelect
                            label="Área"
                            selectedValue={selectedArea}
                            onValueChange={setSelectedArea}
                            options={areaOptions}
                            containerStyle={styles.flexItem}
                            selectKey="area"
                            openKey={openSelectKey}
                            setOpenKey={setOpenSelectKey}
                            disabled={isSubmitting}
                        />

                        <AnimatedSelect
                            label="Nome"
                            selectedValue={selectedName}
                            onValueChange={setSelectedName}
                            options={nameOptions}
                            containerStyle={styles.flexItem}
                            selectKey="nome"
                            openKey={openSelectKey}
                            setOpenKey={setOpenSelectKey}
                            disabled={isSubmitting}
                        />

                        <AnimatedSelect
                            label="Placa"
                            selectedValue={selectedPlate}
                            onValueChange={setSelectedPlate}
                            options={plateOptions}
                            containerStyle={styles.flexItem}
                            selectKey="placa"
                            openKey={openSelectKey}
                            setOpenKey={setOpenSelectKey}
                            disabled={isSubmitting}
                        />
                    </View>

                    <TextInput
                        style={[styles.input, { color: "#fff" }]}
                        placeholder="Quilometragem"
                        placeholderTextColor="#ccc"
                        keyboardType="numeric"
                        value={km}
                        onChangeText={setKm}
                        editable={!isSubmitting}
                    />

                    {/* 🎉 AQUI ESTÁ A MUDANÇA PARA AnimatedSelect PARA NÍVEL DE COMBUSTÍVEL 🎉 */}
                    <AnimatedSelect
                        label="Nível de Combustível"
                        selectedValue={fuelLevel}
                        onValueChange={setFuelLevel}
                        options={fuelLevelOptions} // Usando as novas opções
                        containerStyle={styles.flexItem} // Use um estilo existente ou defina fullWidthItem em seu styles
                        selectKey="fuelLevel"
                        openKey={openSelectKey}
                        setOpenKey={setOpenSelectKey}
                        disabled={isSubmitting}
                    />

                    <View style={styles.row}>
                        <TouchableOpacity onPress={() => setHasSpareTire(!hasSpareTire)} style={[styles.checkboxContainer, styles.flexItem]} disabled={isSubmitting}>
                            <Entypo name={hasSpareTire ? "check" : "circle"} size={24} color={hasSpareTire ? "green" : "gray"} />
                            <Text style={styles.checkboxLabel}>Tem estepe</Text>
                        </TouchableOpacity>
                        <AnimatedSelect
                            label="Estado dos pneus"
                            selectedValue={tireCondition}
                            onValueChange={setTireCondition}
                            options={tireConditionOptions}
                            containerStyle={styles.flexItem}
                            selectKey="tireCondition"
                            openKey={openSelectKey}
                            setOpenKey={setOpenSelectKey}
                            disabled={isSubmitting}
                        />
                    </View>
                    <TextInput
                        style={[styles.input, { height: 100, color: "#fff", textAlignVertical: "top" }]}
                        placeholder="Observações"
                        placeholderTextColor="#ccc"
                        multiline
                        value={description}
                        onChangeText={setDescription}
                        editable={!isSubmitting}
                    />
                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={handleSelectGallery} style={styles.photoButton} disabled={isSubmitting}>
                            <Text style={styles.photoButtonText}>Galeria</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleTakePhoto} style={styles.photoButton} disabled={isSubmitting}>
                            <Text style={styles.photoButtonText}>Câmera</Text>
                        </TouchableOpacity>
                    </View>
                    {photos.length > 0 && (
                        <FlatList
                            data={photos}
                            horizontal
                            keyExtractor={(item, index) => item + index}
                            renderItem={({ item }) => (
                                <View style={styles.photoPreview}>
                                    <Image source={{ uri: item }} style={styles.photoImage} />
                                </View>
                            )}
                            style={styles.photoList}
                        />
                    )}
                    <GradientButton
                        text={isSubmitting ? "Enviando..." : "Confirmar envio"}
                        onPress={handleSave}

                        style={{ marginHorizontal: 35, opacity: isSubmitting ? 0.7 : 1, marginTop: 20, }}
                        gradientStyle={{ height: 60, alignItems: "center", justifyContent: "center", }}
                    />
                </Animated.View>
            </KeyboardAwareScrollView>

            <MenuBottom userRole={userRole} />
        </KeyboardAvoidingView>
    );
}