import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '@config/firebase';
import { uploadImage, deleteImage } from '@services/firebase/storage/fileHandler';
import { getCurrentDate, formatDateTime } from '@utils/dateHandler';
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
    const prefContentsNo = await getMaxContentsNo();
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

export const fetchContentsById = async (id: string): Promise<ContentsData | null> => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const data = docSnapshot.data() as ContentsData;
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error services/firebase/firestore/fetchContentsById : ', error);
    throw error;
  }
};

export const updateContents = async (newData: ContentsData) => {
  try {
    await updatedAtEqual(newData);
    newData.updatedAt = getCurrentDate();
    if (newData.contentsImage) {
      await deleteContents(newData.contentsId, newData.contentsImageName);
      const contentsImageUrl = await uploadImage(newData.contentsImage, newData.contentsImageName);
      newData.contentsImageUrl = contentsImageUrl;
      newData.contentsImage = null;
    }
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

const getMaxContentsNo = async (): Promise<number> => {
  try {
    const q = query(collection(db, collectionName), orderBy('contentsNo', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const maxValue = doc.get('contentsNo');
      return maxValue;
    } else {
      return 0;
    }
  } catch (error) {
    console.error('Error services/firebase/firestore/getMaxContentsNo : ', error);
    throw error;
  }
};

const updatedAtEqual = async (data: ContentsData) => {
  try {
    const compareData = await fetchContentsById(data.contentsId);
    if (compareData?.updatedAt?.nanoseconds !== data.updatedAt?.nanoseconds) {
      alert('이미 이전에 수정된 항목입니다. \r\n새로고침을 해주세요.');
      throw new Error();
    }
  } catch (error) {
    console.error('Error services/firebase/firestore/getMaxContentsNo : ', error);
    throw error;
  }
};
