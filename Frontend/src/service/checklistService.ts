import apiRouter from "./apiRouter";
import { getAuthData } from "../service/authService";
import { uploadImageAsync } from "./uploadService";
import { Alert } from "react-native"; // ✨ Correção: Importar Alert aqui ✨

const api = apiRouter;

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
    fotos: string[];
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
        const response = await api.get('/checklists');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar checklists:', error);
        return [];
    }
};

export const getChecklistById = async (id: string): Promise<Checklist | null> => {
    try {
        const response = await api.get(`/checklists/${id}`);
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
    photoUris: string[] // ✨ CORREÇÃO AQUI: Espera um array de strings (URIs) diretamente ✨
): Promise<Checklist | null> => {
    try {
        const uploadPromises = photoUris.map(uri => uploadImageAsync(uri)); // ✨ Correção: Passa a URI diretamente ✨
        const results = await Promise.allSettled(uploadPromises);

        const fotoUrls: string[] = [];
        let uploadFailed = false;

        results.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value !== null) {
                fotoUrls.push(result.value);
            } else {
                uploadFailed = true;
                console.error(`Falha no upload da foto ${index + 1}:`,
                    result.status === 'rejected' ? result.reason : "Upload retornou null/undefined");
            }
        });

        if (uploadFailed) {
            Alert.alert("Erro de Upload", "Algumas fotos não puderam ser carregadas. Tente novamente.");
            throw new Error("Não foi possível carregar todas as fotos.");
        }

        const dataToSend: Checklist = {
            ...checklistData,
            fotos: fotoUrls,
        };

        const config = await withAuth({
            headers: {
                "Content-Type": "application/json",
            },
        });

        const response = await api.post("/checklists", dataToSend, config);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar checklist (com upload de fotos):", error);
        return null;
    }
};

export const getChecklistsWithAuth = async (id: string): Promise<Checklist | null> => {
    try {
        const config = await withAuth({});
        const response = await api.get(`/checklists`, config);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar checklist com autenticação:', error);
        return null;
    }
}