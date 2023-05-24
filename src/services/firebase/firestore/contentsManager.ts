import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@config/firebase';
import { uploadImage, deleteImage } from '@services/firebase/storage/fileHandler';
import { getCurrentDate } from '@utils/dateHandler';
import { ContentsData } from '@types';

const collectionName = 'contents';

export const createContents = async (contentsData: ContentsData) => {
  try {
    const currentDate = getCurrentDate();
    if (contentsData.contentsImage) {
      const contentsImageUrl = await uploadImage(contentsData.contentsImage, contentsData.contentsImageName);
      contentsData.contentsImageUrl = contentsImageUrl;
      contentsData.contentsImage = null;
    }
    const prefContentsNo = await getContentsSize();
    contentsData.contentsNo = prefContentsNo + 1;
    contentsData.createdAt = currentDate;
    const docRef = await addDoc(collection(db, collectionName), contentsData);

    contentsData.contentsId = docRef.id;
    await updateContents(contentsData);
  } catch (error) {
    console.error('Error services/firebase/firestore/createContents : ', error);
    throw error;
  }
};

export const fetchContents = async (): Promise<ContentsData[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    let result: ContentsData[] = [];

    querySnapshot.forEach((doc) => {
      const contentsData: ContentsData = doc.data() as ContentsData;
      result.push(contentsData);
    });
    return result.sort((a, b) => a.contentsNo - b.contentsNo);
  } catch (error) {
    console.error('Error services/firebase/firestore/fetchContents : ', error);
    throw error;
  }
};

export const updateContents = async (newData: ContentsData) => {
  try {
    newData.updatedAt = getCurrentDate();
    const docRef = doc(db, collectionName, newData.contentsId);
    await updateDoc(docRef, newData);
  } catch (error) {
    console.error('Error services/firebase/firestore/updateContents : ', error);
    throw error;
  }
};

export const deleteContents = async (id: string, imageName: string) => {
  try {
    if (imageName) await deleteImage(imageName);
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error services/firebase/firestore/deleteContents : ', error);
    throw error;
  }
};

const getContentsSize = async (): Promise<number> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.size;
  } catch (error) {
    console.error('Error services/firebase/firestore/fetchContentsNo : ', error);
    throw error;
  }
};
