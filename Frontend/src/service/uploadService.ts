// service/uploadService.ts
import { storage } from './firebaseConfig'; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import 'react-native-get-random-values'; 
import { v4 as uuidv4 } from "uuid";

export const uploadImageAsync = async (uri: string): Promise<string | null> => {
  console.log("uploadImageAsync: URI recebida:", uri); // Adicione esta linha
  try {
    const response = await fetch(uri);
    console.log("uploadImageAsync: Status da resposta do fetch:", response.status); 
    const blob = await response.blob();
    console.log("uploadImageAsync: Blob criado com sucesso.");

    const filename = `checklists/${uuidv4()}.jpg`;
    const storageRef = ref(storage, filename); 
    console.log("uploadImageAsync: StorageRef criado para:", filename);

    await uploadBytes(storageRef, blob);
    console.log("uploadImageAsync: Upload de bytes concluído."); 

    const url = await getDownloadURL(storageRef);
    console.log("uploadImageAsync: URL de download obtida:", url);

    return url;
  } catch (error) {
    console.error("uploadImageAsync: Erro COMPLETO ao fazer upload da imagem:", error); 
    return null;
  }
};