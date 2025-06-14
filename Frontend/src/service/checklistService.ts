import apiRouter from "./apiRouter";
import { getAuthData } from "../service/authService"; // 🎉 MUDANÇA AQUI: IMPORTAR getAuthData 🎉
import * as FileSystem from "expo-file-system";
import { uploadImageAsync } from "./uploadService";

const api = apiRouter;

// Definindo o tipo Checklist
export interface Checklist {
    id?: string;
    area: string;
    nome: string;
    placa: string;
    quilometragem: number;
    nivelCombustivel: string;
    pneus: boolean;
    temEstepe: boolean;
    descricao: string;
    fotoUrls: string[]; // renomeie para bater com o backend
}

// Função auxiliar para adicionar o token ao cabeçalho da requisição
const withAuth = async (config: any) => {
    // 🎉 MUDANÇA AQUI: CHAMAR getAuthData E PEGAR O TOKEN 🎉
    const authData = await getAuthData();
    const token = authData.token; // Pega o token do objeto retornado

    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        };
    }
    return config;
};

// Buscar todos os checklists
export const getChecklists = async (): Promise<Checklist[]> => {
    try {
        const response = await api.get('/checklists');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar checklists:', error);
        return [];
    }
};

// Buscar checklist por ID
export const getChecklistById = async (id: string): Promise<Checklist | null> => {
    try {
        const response = await api.get(`/checklists/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar checklist por ID:', error);
        return null;
    }
};

// Criar novo checklist
export const createChecklist = async (checklist: Checklist): Promise<Checklist | null> => {
    try {
        const response = await api.post('/checklists', checklist);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar checklist:', error);
        return null;
    }
};

// Atualizar checklist
export const updateChecklist = async (id: string, checklist: Checklist): Promise<Checklist | null> => {
    try {
        const response = await api.put(`/checklists/${id}`, checklist);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar checklist:', error);
        return null;
    }
};

// Deletar checklist
export const deleteChecklist = async (id: string): Promise<boolean> => {
    try {
        await api.delete(`/checklists/${id}`);
        return true;
    } catch (error) {
        console.error('Erro ao deletar checklist:', error);
        return false;
    }
};

// Função para criar um novo checklist com autenticação
export const createChecklistWithAuth = async (
    checklist: Checklist,
    photos: { uri: string }[]
): Promise<Checklist | null> => {
    try {
        const uploadPromises = photos.map(photo => uploadImageAsync(photo.uri));
        const results = await Promise.allSettled(uploadPromises);

        const fotoUrls = results
            .filter(result => result.status === 'fulfilled')
            .map(result => (result as PromiseFulfilledResult<string>).value); // Adicionado cast para garantir tipo

        if (fotoUrls.length !== photos.length) {
            console.warn("Algumas fotos não puderam ser enviadas.");
        }

        const dataToSend = {
            ...checklist,
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
        console.error("Erro ao criar checklist:", error);
        return null;
    }
};

// Função para buscar todos os checklists com autenticação
export const getChecklistsWithAuth = async (): Promise<Checklist[]> => {
    try {
        const config = await withAuth({});
        const response = await api.get('/checklists', config);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar checklists com autenticação:', error);
        return [];
    }
};