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
    ActivityIndicator, 
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
    areaOptions as areaPAOptions, 
    nameOptions,
    allPlateOptions, 
    tireConditionOptions,
    fuelLevelOptions, 
    oilLevelOptions, 
    sectorOptions, 
    vehicleCategoryOptionsPA, 
    vehicleCategoryOptionsFT, 
    relacaoTransmissaoOptions, 
    statusRecebimentoEntregaOptions,
} from "../constants/selectOptions";
import Logout from "../components/common/Logout";

export default function RegistroScreen() {
    const translateXAnim = useRef(new Animated.Value(-1000)).current;

    const [selectedSector, setSelectedSector] = useState<string | null>(null);
    const [selectedArea, setSelectedArea] = useState("");
    const [selectedVehicleCategory, setSelectedVehicleCategory] = useState<string | null>(null);

    const [selectedName, setSelectedName] = useState("");
    const [filteredPlateOptions, setFilteredPlateOptions] = useState<string[]>([]);
    const [selectedPlate, setSelectedPlate] = useState("");
    const [km, setKm] = useState("");
    const [fuelLevel, setFuelLevel] = useState("");
    const [oilLevel, setOilLevel] = useState("");
    const [tireCondition, setTireCondition] = useState("");

    const [hasSpareTire, setHasSpareTire] = useState(false);
    const [relacaoTransmissao, setRelacaoTransmissao] = useState("");
    const [temBau, setTemBau] = useState(false);

    const [temDocumento, setTemDocumento] = useState(false);
    const [temCartaoCombustivel, setTemCartaoCombustivel] = useState(false);
    const [statusRecebimentoEntrega, setStatusRecebimentoEntrega] = useState("");

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

    useEffect(() => {
        let plates: string[] = [];
        if (selectedVehicleCategory === "VTR") {
            plates = allPlateOptions.filter(plate => plate.startsWith("VTR "));
        } else if (selectedVehicleCategory === "MOTO") {
            plates = allPlateOptions.filter(plate => plate.startsWith("MOTO "));
        }
        setFilteredPlateOptions(plates);
        setSelectedPlate("");
    }, [selectedVehicleCategory]);

    useEffect(() => {
        setSelectedArea("");
        setSelectedVehicleCategory(null);
        setFilteredPlateOptions([]);
        setSelectedPlate("");
        setKm(""); 
        setFuelLevel(""); 
        setOilLevel(""); 
        setTireCondition(""); 
        setHasSpareTire(false);
        setRelacaoTransmissao("");
        setTemBau(false);
        setTemDocumento(false);
        setTemCartaoCombustivel(false);
        setStatusRecebimentoEntrega("");
        setDescription("");
        setPhotos([]);
    }, [selectedSector]);

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
            const selectedPhotosUris = result.assets.map((asset) => asset.uri);
            setPhotos((prev) => [...prev, ...selectedPhotosUris]); 
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
            const photoUri = result.assets[0].uri;
            setPhotos((prev) => [...prev, photoUri]); 
        }
    };

    const handleSave = async () => {
        if (isSubmitting) {
            console.log("Submissão já em andamento, ignorando clique.");
            return;
        }

        const vehicleTypeForBackend = selectedVehicleCategory === "VTR" ? "carro" : (selectedVehicleCategory === "MOTO" ? "moto" : "");

        const requiredFields: { [key: string]: any } = {
            "Setor": selectedSector,
            "Placa do Veículo": selectedPlate,
            "KM Atual": km,
            "Nível de Combustível": fuelLevel,
            "Nível de Óleo": oilLevel,
            "Estado dos Pneus": tireCondition,
            "Nome": selectedName,
            "Tipo de Veículo": selectedVehicleCategory,
            "Status de Recebimento/Entrega": statusRecebimentoEntrega,
        };

        if (selectedSector === "PRONTO ATENDIMENTO") {
            requiredFields["Área"] = selectedArea;
        }

        if (selectedVehicleCategory === "MOTO") {
            requiredFields["Relação da Transmissão"] = relacaoTransmissao;
        }

        let missingFields = [];
        for (const [label, value] of Object.entries(requiredFields)) {
            if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
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

        if (photos.length === 0) {
            return Alert.alert("Fotos Obrigatórias", "Por favor, adicione pelo menos uma foto.");
        }

        setIsSubmitting(true);

        const checklistData: any = {
            sector: selectedSector,
            area: selectedArea,
            nome: selectedName,
            placa: selectedPlate,
            quilometragem: parseInt(km),
            nivelCombustivel: fuelLevel,
            nivelOleo: oilLevel,
            pneus: tireCondition,
            descricao: description,
            type: vehicleTypeForBackend,
            vehicleCategory: selectedVehicleCategory,
            temDocumento: temDocumento,
            temCartaoCombustivel: temCartaoCombustivel,
            statusRecebimentoEntrega: statusRecebimentoEntrega,
        };

        if (selectedVehicleCategory === "VTR") {
            checklistData.temEstepe = hasSpareTire;
        } else if (selectedVehicleCategory === "MOTO") {
            checklistData.relacaoTransmissao = relacaoTransmissao;
            checklistData.temBau = temBau;
        }

        try {
            const result = await createChecklistWithAuth(checklistData, photos); 

            if (result) {
                Alert.alert("Sucesso", "Checklist enviado com sucesso!");
                setSelectedSector(null);
                setSelectedArea("");
                setSelectedVehicleCategory(null);
                setSelectedName("");
                setFilteredPlateOptions([]);
                setSelectedPlate("");
                setKm("");
                setFuelLevel("");
                setOilLevel("");
                setTireCondition("");
                setHasSpareTire(false);
                setRelacaoTransmissao("");
                setTemBau(false);
                setTemDocumento(false);
                setTemCartaoCombustivel(false);
                setStatusRecebimentoEntrega("");
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
                    <AnimatedSelect
                        label="Você é de que setor?"
                        selectedValue={selectedSector}
                        onValueChange={setSelectedSector}
                        options={sectorOptions}
                        containerStyle={styles.fullWidthItem}
                        selectKey="sector"
                        openKey={openSelectKey}
                        setOpenKey={setOpenSelectKey}
                        disabled={isSubmitting} 
                    />

                    {selectedSector && (
                        <>
                            {selectedSector === "PRONTO ATENDIMENTO" && (
                                <AnimatedSelect
                                    label="Selecione a Área"
                                    selectedValue={selectedArea}
                                    onValueChange={setSelectedArea}
                                    options={areaPAOptions}
                                    containerStyle={styles.fullWidthItem}
                                    selectKey="areaPA"
                                    openKey={openSelectKey}
                                    setOpenKey={setOpenSelectKey}
                                    disabled={isSubmitting}
                                />
                            )}

                            <AnimatedSelect
                                label="Tipo de Veículo"
                                selectedValue={selectedVehicleCategory}
                                onValueChange={setSelectedVehicleCategory}
                                options={
                                    selectedSector === "PRONTO ATENDIMENTO"
                                        ? vehicleCategoryOptionsPA
                                        : vehicleCategoryOptionsFT
                                }
                                containerStyle={styles.fullWidthItem}
                                selectKey="vehicleCategory"
                                openKey={openSelectKey}
                                setOpenKey={setOpenSelectKey}
                                disabled={isSubmitting}
                            />

                            {selectedVehicleCategory && (
                                <>
                                    <View style={styles.row}>
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
                                            options={filteredPlateOptions}
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

                                    <AnimatedSelect
                                        label="Nível de Combustível"
                                        selectedValue={fuelLevel}
                                        onValueChange={setFuelLevel}
                                        options={fuelLevelOptions}
                                        containerStyle={styles.fullWidthItem}
                                        selectKey="fuelLevel"
                                        openKey={openSelectKey}
                                        setOpenKey={setOpenSelectKey}
                                        disabled={isSubmitting}
                                    />

                                    <AnimatedSelect
                                        label="Nível de Óleo"
                                        selectedValue={oilLevel}
                                        onValueChange={setOilLevel}
                                        options={oilLevelOptions}
                                        containerStyle={styles.fullWidthItem}
                                        selectKey="oilLevel"
                                        openKey={openSelectKey}
                                        setOpenKey={setOpenSelectKey}
                                        disabled={isSubmitting}
                                    />

                                    <AnimatedSelect
                                        label="Estado dos Pneus"
                                        selectedValue={tireCondition}
                                        onValueChange={setTireCondition}
                                        options={tireConditionOptions}
                                        containerStyle={styles.fullWidthItem}
                                        selectKey="tireCondition"
                                        openKey={openSelectKey}
                                        setOpenKey={setOpenSelectKey}
                                        disabled={isSubmitting}
                                    />

                                    {selectedVehicleCategory === "VTR" && (
                                        <View style={styles.row}>
                                            <TouchableOpacity
                                                onPress={() => setHasSpareTire(!hasSpareTire)}
                                                style={[styles.checkboxContainer, styles.fullWidthItem]}
                                                disabled={isSubmitting}
                                            >
                                                <Entypo name={hasSpareTire ? "check" : "circle"} size={24} color={hasSpareTire ? "green" : "gray"} />
                                                <Text style={styles.checkboxLabel}>Tem Estepe</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}

                                    {selectedVehicleCategory === "MOTO" && (
                                        <>
                                            <AnimatedSelect
                                                label="Relação da Transmissão"
                                                selectedValue={relacaoTransmissao}
                                                onValueChange={setRelacaoTransmissao}
                                                options={relacaoTransmissaoOptions}
                                                containerStyle={styles.fullWidthItem}
                                                selectKey="relacaoTransmissao"
                                                openKey={openSelectKey}
                                                setOpenKey={setOpenSelectKey}
                                                disabled={isSubmitting}
                                            />
                                            <View style={styles.row}>
                                                <TouchableOpacity
                                                    onPress={() => setTemBau(!temBau)}
                                                    style={[styles.checkboxContainer, styles.fullWidthItem]}
                                                    disabled={isSubmitting}
                                                >
                                                    <Entypo name={temBau ? "check" : "circle"} size={24} color={temBau ? "green" : "gray"} />
                                                    <Text style={styles.checkboxLabel}>Tem Baú</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </>
                                    )}

                                    <View style={styles.row}>
                                        <TouchableOpacity
                                            onPress={() => setTemDocumento(!temDocumento)}
                                            style={[styles.checkboxContainer, styles.fullWidthItem]}
                                            disabled={isSubmitting}
                                        >
                                            <Entypo name={temDocumento ? "check" : "circle"} size={24} color={temDocumento ? "green" : "gray"} />
                                            <Text style={styles.checkboxLabel}>Tem Documento</Text>
                                        </TouchableOpacity>
                                    </View>
                                    
                                    <View style={styles.row}>
                                        <TouchableOpacity
                                            onPress={() => setTemCartaoCombustivel(!temCartaoCombustivel)}
                                            style={[styles.checkboxContainer, styles.fullWidthItem]}
                                            disabled={isSubmitting}
                                        >
                                            <Entypo name={temCartaoCombustivel ? "check" : "circle"} size={24} color={temCartaoCombustivel ? "green" : "gray"} />
                                            <Text style={styles.checkboxLabel}>Tem Cartão de Combustível</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <AnimatedSelect
                                        label="Status"
                                        selectedValue={statusRecebimentoEntrega}
                                        onValueChange={setStatusRecebimentoEntrega}
                                        options={statusRecebimentoEntregaOptions}
                                        containerStyle={styles.fullWidthItem}
                                        selectKey="status"
                                        openKey={openSelectKey}
                                        setOpenKey={setOpenSelectKey}
                                        disabled={isSubmitting}
                                    />

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
                                            {isSubmitting ? ( 
                                                <ActivityIndicator color="#fff" size="small" />
                                            ) : (
                                                <Text style={styles.photoButtonText}>Galeria</Text>
                                            )}
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={handleTakePhoto} style={styles.photoButton} disabled={isSubmitting}>
                                            {isSubmitting ? ( 
                                                <ActivityIndicator color="#fff" size="small" />
                                            ) : (
                                                <Text style={styles.photoButtonText}>Câmera</Text>
                                            )}
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
                                        style={{ marginHorizontal: 35, opacity: isSubmitting ? 0.7 : 1, marginTop: 20 }}
                                        gradientStyle={{ height: 60, alignItems: "center", justifyContent: "center" }}
                                        disabled={isSubmitting} 
                                    />
                                </>
                            )}
                        </>
                    )}
                </Animated.View>
            </KeyboardAwareScrollView>

            <MenuBottom userRole={userRole} />
        </KeyboardAvoidingView>
    );
}
