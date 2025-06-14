import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

// Função para subir uma imagem e retornar a URL
export const uploadImageAsync = async (uri: string): Promise<string | null> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const filename = `checklists/${uuidv4()}.jpg`;
    const storage = getStorage();
    const storageRef = ref(storage, filename);

    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);

    return url;
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    return null;
  }
};
