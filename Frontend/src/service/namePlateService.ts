import apiRouter from "./apiRouter";
import { getAuthData } from "./authService";

const API_PREFIX = '/nameplates'; // Define o prefixo aqui

// --- Funções para Nomes (Names) ---

/**
 * Busca todos os nomes.
 */
export async function getNames() {
    const authData = await getAuthData();
    const response = await apiRouter.get(`${API_PREFIX}/names`, {
        headers: {
            Authorization: `Bearer ${authData.token}`
        }
    });
    return response.data;
}

/**
 * Adiciona um novo nome.
 * @param name O nome a ser adicionado.
 */
export async function addName(name: string) {
    const authData = await getAuthData();
    const response = await apiRouter.post(`${API_PREFIX}/names`, { name }, {
        headers: {
            Authorization: `Bearer ${authData.token}`
        },
        validateStatus: (status: number) => status < 500
    });
    return response.data;
}

/**
 * Deleta um nome pelo seu ID.
 * @param nameId O ID do nome a ser deletado.
 */
export async function deleteName(nameId: string) {
    const authData = await getAuthData();
    const response = await apiRouter.delete(`${API_PREFIX}/names/${nameId}`, {
        headers: {
            Authorization: `Bearer ${authData.token}`
        },
        validateStatus: (status: number) => status < 500
    });
    return response.data;
}

/**
 * Atualiza um nome pelo seu ID.
 * @param nameId O ID do nome a ser atualizado.
 * @param newName O novo nome.
 */
export async function updateName(nameId: string, newName: string) {
    const authData = await getAuthData();
    const response = await apiRouter.put(`${API_PREFIX}/names/${nameId}`, { name: newName }, {
        headers: {
            Authorization: `Bearer ${authData.token}`
        },
        validateStatus: (status: number) => status < 500
    });
    return response.data;
}

// --- Funções para Placas (Plates) ---

/**
 * Busca todas as placas.
 */
export async function getPlates() {
    const authData = await getAuthData();
    const response = await apiRouter.get(`${API_PREFIX}/plates`, {
        headers: {
            Authorization: `Bearer ${authData.token}`
        }
    });
    return response.data;
}

/**
 * Adiciona uma nova placa.
 * @param plate A placa a ser adicionada.
 */
export async function addPlate(plate: string) {
    const authData = await getAuthData();
    const response = await apiRouter.post(`${API_PREFIX}/plates`, { plate }, {
        headers: {
            Authorization: `Bearer ${authData.token}`
        },
        validateStatus: (status: number) => status < 500
    });
    return response.data;
}

/**
 * Atualiza uma placa pelo seu ID.
 * @param plateId O ID da placa a ser atualizada.
 * @param newPlate A nova placa.
 */
export async function updatePlate(plateId: string, newPlate: string) {
    const authData = await getAuthData();
    const response = await apiRouter.put(`${API_PREFIX}/plates/${plateId}`, { plate: newPlate }, {
        headers: {
            Authorization: `Bearer ${authData.token}`
        },
        validateStatus: (status: number) => status < 500
    });
    return response.data;
}

/**
 * Deleta uma placa pelo seu ID.
 * @param plateId O ID da placa a ser deletada.
 */
export async function deletePlate(plateId: string) { // CORRIGIDO: Usa plateId
    const authData = await getAuthData();
    const response = await apiRouter.delete(`${API_PREFIX}/plates/${plateId}`, { // CORRIGIDO: Usa plateId na URL
        headers: {
            Authorization: `Bearer ${authData.token}`
        },
        validateStatus: (status: number) => status < 500
    });
    return response.data;
}