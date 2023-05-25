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
import { NodeData } from '@types';

const collectionName = 'node';

export const createNode = async (nodeData: NodeData) => {
  const currentDate = getCurrentDate();
  const docId = uuid();
  const docRef = doc(collection(db, collectionName), docId);
  try {
    if (nodeData.nodeLogo) {
      const nodeLogoUrl = await uploadImage(nodeData.nodeLogo, nodeData.nodeLogoName);
      nodeData.nodeLogoUrl = nodeLogoUrl;
      nodeData.nodeLogo = null;
    }
    const prefNodeNo = await getMaxNo('nodeNo');
    nodeData.nodeId = docId;
    nodeData.nodeNo = prefNodeNo + 1;
    nodeData.createdAt = currentDate;
    nodeData.updatedAt = currentDate;
    await setDoc(docRef, nodeData);
  } catch (error) {
    console.error('Error services/firebase/firestore/createNode : ', error);
    throw error;
  }
};

export const fetchNode = async (): Promise<NodeData[]> => {
  const q = query(collection(db, collectionName), orderBy('nodeNo', 'asc'));
  try {
    const querySnapshot = await getDocs(q);
    let result: NodeData[] = [];

    querySnapshot.forEach((doc) => {
      const nodeData: NodeData = doc.data() as NodeData;
      result.push(nodeData);
    });
    return result;
  } catch (error) {
    console.error('Error services/firebase/firestore/fetchNode : ', error);
    throw error;
  }
};

export const fetchNodeById = async (id: string): Promise<NodeData | null> => {
  const docRef = doc(collection(db, collectionName), id);
  try {
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const data = docSnapshot.data() as NodeData;
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error services/firebase/firestore/fetchNodeById : ', error);
    throw error;
  }
};

export const updateNode = async (newData: NodeData, prefFileName: string) => {
  const currentDate = getCurrentDate();
  const docRef = doc(collection(db, collectionName), newData.nodeId);
  try {
    await updatedAtEqual(newData);
    if (prefFileName && prefFileName !== newData.nodeLogoName) await deleteImage(prefFileName);
    if (newData.nodeLogo) {
      const nodeLogoUrl = await uploadImage(newData.nodeLogo, newData.nodeLogoName);
      newData.nodeLogoUrl = nodeLogoUrl;
      newData.nodeLogo = null;
    }
    newData.updatedAt = currentDate;
    await updateDoc(docRef, newData);
  } catch (error) {
    console.error('Error services/firebase/firestore/updateNode : ', error);
    throw error;
  }
};

export const deleteNode = async (deleteData: NodeData) => {
  const docRef = doc(collection(db, collectionName), deleteData.nodeId);
  try {
    await updatedAtEqual(deleteData);
    if (deleteData.nodeLogoName) await deleteImage(deleteData.nodeLogoName);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error services/firebase/firestore/deleteNode : ', error);
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

const updatedAtEqual = async (data: NodeData) => {
  try {
    const compareData = await fetchNodeById(data.nodeId);
    if (compareData?.updatedAt?.nanoseconds !== data.updatedAt?.nanoseconds) {
      alert('이미 이전에 수정된 항목입니다. \r\n새로고침을 해주세요.');
      throw new Error();
    }
  } catch (error) {
    console.error('Error services/firebase/firestore/updatedAtEqual : ', error);
    throw error;
  }
};
