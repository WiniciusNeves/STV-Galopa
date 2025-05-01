import axios from "axios";
import apiRouter from "./apiRouter";

const api = apiRouter;


export const getChecklists = async () => {
    try {
        const response = await api.get("/checklists");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar checklists:", error);
        return [];
    }
};

export const getChecklistById = async (id: string) => {
    try {
        const response = await api.get(`/checklists/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar checklist por ID:", error);
        return null;
    }
};

export const createChecklist = async (checklist: any) => {
    try {
        const response = await api.post("/checklists", checklist);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar checklist:", error);
        return null;
    }
}

export const updateChecklist = async (id: string, checklist: any) => {
    try {
        const response = await api.put(`/checklists/${id}`, checklist);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar checklist:", error);
        return null;
    }
}

export const deleteChecklist = async (id: string) => {
    try {
        const response = await api.delete(`/checklists/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao deletar checklist:", error);
        return null;
    }
}
