import apiRouter from "./apiRouter";
import { getAuthData } from "../service/authService";
import { uploadImageAsync } from "./uploadService"; // Importa a versão atualizada de uploadImageAsync
import { Alert } from "react-native";
import { getAuth } from 'firebase/auth'; // Necessário para auth.currentUser
import { app } from './firebaseConfig'; // Necessário para getAuth(app)
import { PhotoWithMetadata } from '../components/common/PhotoUploadSection'; // Importa a interface PhotoWithMetadata

const api = apiRouter;
const auth = getAuth(app); // Obtém a instância de auth

// Interface atualizada para refletir a nova estrutura de fotos
export interface Checklist {
    id?: string;
    sector: string;
    area: string;
    nome: string;
    placa: string;
    quilometragem: number;
    nivelCombustivel: string;
    nivelOleo: string;
    pneus: string;
    temEstepe?: boolean;
    relacaoTransmissao?: string;
    temBau?: boolean;
    temDocumento: boolean;
    temCartaoCombustivel: boolean;
    statusRecebimentoEntrega: string;
    descricao: string;
    fotos: { url: string; tipo: string }[]; // ✨ CORREÇÃO AQUI: fotos agora é um array de objetos ✨
    type: string;
    vehicleCategory: string;
}

const withAuth = async (config: any) => {
    const authData = await getAuthData();
    const token = authData.token;

    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        };
    }
    return config;
};

export const getChecklists = async (): Promise<Checklist[]> => {
    try {
        const config = await withAuth({});
        const response = await api.get('/checklists', config);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar checklists:', error);
        return [];
    }
};

export const getChecklistById = async (id: string): Promise<Checklist | null> => {
    try {
        const config = await withAuth({});
        const response = await api.get(`/checklists/${id}`, config);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar checklist por ID:', error);
        return null;
    }
};

export const updateChecklist = async (id: string, checklist: Checklist): Promise<Checklist | null> => {
    try {
        const config = await withAuth({});
        const response = await api.put(`/checklists/${id}`, checklist, config);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar checklist:', error);
        return null;
    }
};

export const deleteChecklist = async (id: string): Promise<boolean> => {
    try {
        const config = await withAuth({});
        await api.delete(`/checklists/${id}`, config);
        return true;
    } catch (error) {
        console.error('Erro ao deletar checklist:', error);
        return false;
    }
};

// Função para criar um novo checklist com autenticação E upload de fotos
export const createChecklistWithAuth = async (
    checklistData: Omit<Checklist, 'fotos' | 'id'>,
    // ✨ CORREÇÃO AQUI: Espera um array de PhotoWithMetadata (com uri e type) ✨
    photosToUpload: PhotoWithMetadata[]
): Promise<Checklist | null> => {
    try {
        const user = auth.currentUser; // Obtém o usuário autenticado
        if (!user) {
            throw new Error("Usuário não autenticado.");
        }

        const uploadedPhotosData: { url: string; tipo: string }[] = [];
        let uploadFailed = false;

        // ✨ CORREÇÃO AQUI: Mapeia para uploadImageAsync passando URI e TYPE ✨
        const uploadPromises = photosToUpload.map(photo => {
            if (photo.uri) {
                return uploadImageAsync(photo.uri, photo.type); // Passa a URI e o TIPO para o uploadService
            }
            return Promise.resolve(null); // Retorna null para URIs vazias
        });

        const results = await Promise.allSettled(uploadPromises);

        results.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value !== null) {
                // ✨ CORREÇÃO AQUI: Adiciona o 'tipo' da foto original ao objeto ✨
                uploadedPhotosData.push({ url: result.value, tipo: photosToUpload[index].type });
            } else {
                uploadFailed = true;
                console.error(`Falha no upload da foto ${index + 1} (${photosToUpload[index].type}):`,
                    result.status === 'rejected' ? result.reason : "Upload retornou null/undefined");
            }
        });

        if (uploadFailed) {
            Alert.alert("Erro de Upload", "Algumas fotos não puderam ser carregadas. Tente novamente.");
            throw new Error("Não foi possível carregar todas as fotos.");
        }

        const dataToSend: Checklist = {
            ...checklistData,
            fotos: uploadedPhotosData, // Envia as fotos no novo formato (array de objetos com url e tipo)
        };

        const config = await withAuth({
            headers: {
                "Content-Type": "application/json",
            },
        });

        const response = await api.post("/checklists", dataToSend, config);
        return response.data;
    } catch (error: any) {
        console.error("Erro ao criar checklist (com upload de fotos):", error.response?.data || error.message);
        Alert.alert("Erro", error.response?.data?.error || "Ocorreu um erro ao criar o checklist.");
        return null;
    }
};

// ✨ CORREÇÃO AQUI: Removido o parâmetro 'id' pois a função getAllChecklists não o utiliza ✨
export const getChecklistsWithAuth = async (): Promise<Checklist[] | null> => {
    try {
        const config = await withAuth({});
        const response = await api.get(`/checklists`, config);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar checklist com autenticação:', error);
        return null;
    }
}
