import uuid from 'react-uuid';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  orderBy,
  limit,
  setDoc,
} from 'firebase/firestore';
import { db } from '@config/firebase';
import { uploadImage, deleteImage } from '@services/firebase/storage/fileHandler';
import { getCurrentDate } from '@utils/dateHandler';
import { ContentsData } from '@types';

const collectionName = 'contents';

export const createContents = async (contentsData: ContentsData) => {
  const currentDate = getCurrentDate();
  const docId = uuid();
  const docRef = doc(collection(db, collectionName), docId);
  try {
    if (contentsData.contentsImage) {
      const contentsImageUrl = await uploadImage(contentsData.contentsImage, contentsData.contentsImageName);
      contentsData.contentsImageUrl = contentsImageUrl;
      contentsData.contentsImage = null;
    }
    const prefContentsNo = await getMaxNo('contentsNo');
    contentsData.contentsId = docId;
    contentsData.contentsNo = prefContentsNo + 1;
    contentsData.createdAt = currentDate;
    contentsData.updatedAt = currentDate;
    await setDoc(docRef, contentsData);
  } catch (error) {
    console.error('Error services/firebase/firestore/createContents : ', error);
    throw error;
  }
};

export const fetchContents = async (): Promise<ContentsData[]> => {
  const q = query(collection(db, collectionName), orderBy('contentsNo', 'asc'));
  try {
    const querySnapshot = await getDocs(q);
    let result: ContentsData[] = [];

    querySnapshot.forEach((doc) => {
      const contentsData: ContentsData = doc.data() as ContentsData;
      result.push(contentsData);
    });
    return result;
  } catch (error) {
    console.error('Error services/firebase/firestore/fetchContents : ', error);
    throw error;
  }
};

export const fetchContentsById = async (id: string): Promise<ContentsData | null> => {
  const docRef = doc(collection(db, collectionName), id);
  try {
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

export const updateContents = async (newData: ContentsData, prefFileName: string) => {
  const currentDate = getCurrentDate();
  const docRef = doc(collection(db, collectionName), newData.contentsId);
  try {
    await updatedAtEqual(newData);
    if (prefFileName && prefFileName !== newData.contentsImageName) await deleteImage(prefFileName);
    if (newData.contentsImage) {
      const contentsImageUrl = await uploadImage(newData.contentsImage, newData.contentsImageName);
      newData.contentsImageUrl = contentsImageUrl;
      newData.contentsImage = null;
    }
    newData.updatedAt = currentDate;
    await updateDoc(docRef, newData);
  } catch (error) {
    console.error('Error services/firebase/firestore/updateContents : ', error);
    throw error;
  }
};

export const deleteContents = async (deleteData: ContentsData) => {
  const docRef = doc(collection(db, collectionName), deleteData.contentsId);
  try {
    await updatedAtEqual(deleteData);
    if (deleteData.contentsImageName) await deleteImage(deleteData.contentsImageName);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error services/firebase/firestore/deleteContents : ', error);
    throw error;
  }
};

const getMaxNo = async (name: string): Promise<number> => {
  const q = query(collection(db, collectionName), orderBy(name, 'desc'), limit(1));
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const maxValue = doc.get(name);
      return maxValue;
    } else {
      return 0;
    }
  } catch (error) {
    console.error('Error services/firebase/firestore/getMaxNo : ', error);
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
    console.error('Error services/firebase/firestore/updatedAtEqual : ', error);
    throw error;
  }
};
