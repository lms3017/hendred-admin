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
import { PortfolioData } from '@types';

const collectionName = 'portfolio';

export const createPortfolio = async (portfolioData: PortfolioData) => {
  const currentDate = getCurrentDate();
  const docId = uuid();
  const docRef = doc(collection(db, collectionName), docId);
  try {
    if (portfolioData.portfolioLogo) {
      const portfolioLogoUrl = await uploadImage(portfolioData.portfolioLogo, portfolioData.portfolioLogoName);
      portfolioData.portfolioLogoUrl = portfolioLogoUrl;
      portfolioData.portfolioLogo = null;
    }
    if (portfolioData.portfolioInvLogo) {
      const portfolioInvLogoUrl = await uploadImage(portfolioData.portfolioInvLogo, portfolioData.portfolioInvLogoName);
      portfolioData.portfolioInvLogoUrl = portfolioInvLogoUrl;
      portfolioData.portfolioInvLogo = null;
    }
    const prefPortfolioNo = await getMaxNo('portfolioNo');
    const prefMainPageNo = await getMaxNo('mainPageNo');
    portfolioData.portfolioId = docId;
    portfolioData.portfolioNo = prefPortfolioNo + 1;
    portfolioData.mainPageNo = prefMainPageNo + 1;
    portfolioData.createdAt = currentDate;
    portfolioData.updatedAt = currentDate;
    await setDoc(docRef, portfolioData);
  } catch (error) {
    console.error('Error services/firebase/firestore/createPortfolio : ', error);
    throw error;
  }
};

export const fetchPortfolio = async (): Promise<PortfolioData[]> => {
  const q = query(collection(db, collectionName), orderBy('portfolioNo', 'asc'));
  try {
    const querySnapshot = await getDocs(q);
    let result: PortfolioData[] = [];

    querySnapshot.forEach((doc) => {
      const portfolioData: PortfolioData = doc.data() as PortfolioData;
      result.push(portfolioData);
    });
    return result;
  } catch (error) {
    console.error('Error services/firebase/firestore/fetchPortfolio : ', error);
    throw error;
  }
};

export const fetchPortfolioById = async (id: string): Promise<PortfolioData | null> => {
  const docRef = doc(collection(db, collectionName), id);
  try {
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const data = docSnapshot.data() as PortfolioData;
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error services/firebase/firestore/fetchPortfolioById : ', error);
    throw error;
  }
};

export const updatePortfolio = async (
  newData: PortfolioData,
  prefLogoName: string = '',
  prefInvLogoName: string = ''
) => {
  const currentDate = getCurrentDate();
  const docRef = doc(collection(db, collectionName), newData.portfolioId);
  try {
    await updatedAtEqual(newData);
    if (prefLogoName && prefLogoName !== newData.portfolioLogoName) await deleteImage(prefLogoName);
    if (prefInvLogoName && prefInvLogoName !== newData.portfolioInvLogoName) await deleteImage(prefInvLogoName);
    if (newData.portfolioLogo) {
      const portfolioLogoUrl = await uploadImage(newData.portfolioLogo, newData.portfolioLogoName);
      newData.portfolioLogoUrl = portfolioLogoUrl;
      newData.portfolioLogo = null;
    }
    if (newData.portfolioInvLogo) {
      const portfolioLogoUrl = await uploadImage(newData.portfolioInvLogo, newData.portfolioInvLogoName);
      newData.portfolioInvLogoUrl = portfolioLogoUrl;
      newData.portfolioInvLogo = null;
    }
    newData.updatedAt = currentDate;
    await updateDoc(docRef, newData);
  } catch (error) {
    console.error('Error services/firebase/firestore/updatePortfolio : ', error);
    throw error;
  }
};

export const deletePortfolio = async (deleteData: PortfolioData) => {
  const docRef = doc(collection(db, collectionName), deleteData.portfolioId);
  try {
    await updatedAtEqual(deleteData);
    if (deleteData.portfolioLogoName) await deleteImage(deleteData.portfolioLogoName);
    if (deleteData.portfolioInvLogoName) await deleteImage(deleteData.portfolioInvLogoName);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error services/firebase/firestore/deletePortfolio : ', error);
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

const updatedAtEqual = async (data: PortfolioData) => {
  try {
    const compareData = await fetchPortfolioById(data.portfolioId);
    if (compareData?.updatedAt?.nanoseconds !== data.updatedAt?.nanoseconds) {
      alert('이미 이전에 수정된 항목입니다. \r\n새로고침을 해주세요.');
      throw new Error();
    }
  } catch (error) {
    console.error('Error services/firebase/firestore/updatedAtEqual : ', error);
    throw error;
  }
};
