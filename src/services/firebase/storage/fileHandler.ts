import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@config/firebase';

export const uploadImage = async (file: File, fileName: string): Promise<string> => {
  try {
    const storageRef = ref(storage, `images/${fileName}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error services/firebase/storage/uploadImage : ', error);
    throw error;
  }
};

export const deleteImage = async (imageName: string) => {
  try {
    await deleteObject(ref(storage, `images/${imageName}`));
  } catch (error) {
    console.error('Error services/firebase/storage/uploadImage : ', error);
    throw error;
  }
};
