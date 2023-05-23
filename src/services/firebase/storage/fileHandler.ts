import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@config/firebase';

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const storageRef = ref(storage, 'images/' + file.name);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    throw error;
  }
};
